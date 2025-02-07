'use client';

import React, { useEffect, useRef } from 'react';

interface WebGLUniforms {
  u_time: WebGLUniformLocation | null;
  u_ratio: WebGLUniformLocation | null;
  u_pointer_position: WebGLUniformLocation | null;
  u_pointer_active: WebGLUniformLocation | null;
  u_scroll_progress: WebGLUniformLocation | null;
}

interface PointerState {
  x: number;
  y: number;
  tX: number;
  tY: number;
  active: boolean;
}

export const WebGLBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerState>({
    x: 0,
    y: 0,
    tX: 0,
    tY: 0,
    active: false,
  });
  const uniformsRef = useRef<WebGLUniforms | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    const vertexShader = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
          vUv = .5 * (a_position + 1.);
          gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;
uniform float u_pointer_active;
uniform float u_scroll_progress;

vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float neuro_shape(vec2 uv, float t) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;
    for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer);
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= 1.2; // Removed p from here
    }
    return res.x + res.y;
}

void main() {
    vec2 uv = .5 * vUv;
    uv.x *= u_ratio;
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;

    float dist = length(pointer);
    float event_horizon = 0.15;
    float gravity_strength = u_pointer_active * 0.4;

    vec2 distorted_uv = uv;
    if (dist > 0.0 && u_pointer_active > 0.0) {
        vec2 dir = normalize(pointer);
        float pull = pow(1.0 - smoothstep(0.0, event_horizon, dist), 2.0) * gravity_strength;
        distorted_uv -= dir * pull * 0.1;
    }

    float p = clamp(length(pointer), 0., 1.);
    p = (1. - p) * u_pointer_active;

    // Apply p to UV coordinates for distortion
    distorted_uv += pointer * p * 0.1;

    float t = .0005 * u_time;
    vec3 color = vec3(0.);
    float noise = neuro_shape(distorted_uv, t);

    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);

    float fade_distance = 300.0 / 1200.0;
    float top_fade = smoothstep(0.0, fade_distance, vUv.y);
    float bottom_fade = smoothstep(0.0, fade_distance, 1.0 - vUv.y);
    float edge_fade = top_fade * bottom_fade;
    noise *= edge_fade;

    color = normalize(vec3(1.0, 1.0, 1.0));
    color = color * noise;

    gl_FragColor = vec4(color, noise * 0.3);
}

    `;

    const createShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;

    const vertShader = createShader(vertexShader, gl.VERTEX_SHADER);
    const fragShader = createShader(fragmentShader, gl.FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    uniformsRef.current = {
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_ratio: gl.getUniformLocation(program, 'u_ratio'),
      u_pointer_position: gl.getUniformLocation(program, 'u_pointer_position'),
      u_pointer_active: gl.getUniformLocation(program, 'u_pointer_active'),
      u_scroll_progress: gl.getUniformLocation(program, 'u_scroll_progress'),
    };

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      if (uniformsRef.current?.u_ratio) {
        gl.uniform1f(uniformsRef.current.u_ratio, canvas.width / canvas.height);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.tX = e.clientX - rect.left;
      pointerRef.current.tY = e.clientY - rect.top;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const animate = () => {
      if (!gl || !uniformsRef.current) return;

      const pointer = pointerRef.current;
      pointer.x += (pointer.tX - pointer.x) * 0.1;
      pointer.y += (pointer.tY - pointer.y) * 0.1;

      const rect = canvas.getBoundingClientRect();
      const scrollProgress = (window.scrollY - rect.top) / (window.innerHeight * 2);

      if (uniformsRef.current.u_time) {
        gl.uniform1f(uniformsRef.current.u_time, performance.now());
      }
      if (uniformsRef.current.u_pointer_position) {
        gl.uniform2f(
          uniformsRef.current.u_pointer_position,
          pointer.x / rect.width,
          1 - pointer.y / rect.height
        );
      }
      if (uniformsRef.current.u_pointer_active) {
        gl.uniform1f(uniformsRef.current.u_pointer_active, pointer.active ? 1.0 : 0.0);
      }
      if (uniformsRef.current.u_scroll_progress) {
        gl.uniform1f(uniformsRef.current.u_scroll_progress, scrollProgress);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-95"
      />
    </div>
  );
};
