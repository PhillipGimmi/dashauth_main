'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface RendererProps {
  canvas: HTMLCanvasElement;
  scale: number;
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null;
  buffer: WebGLBuffer | null;
  vs: WebGLShader | null;
  fs: WebGLShader | null;
  isDarkMode: boolean;
  updateScale: (scale: number) => void;
  render: (now: number) => void;
}

class Renderer implements RendererProps {
  canvas: HTMLCanvasElement;
  scale: number;
  gl: WebGL2RenderingContext;
  program: WebGLProgram | null = null;
  buffer: WebGLBuffer | null = null;
  vs: WebGLShader | null = null;
  fs: WebGLShader | null = null;
  isDarkMode: boolean;
  private cachedResolutionLocation: WebGLUniformLocation | null = null;
  private cachedTimeLocation: WebGLUniformLocation | null = null;
  private cachedThemeLocation: WebGLUniformLocation | null = null;
  private cachedPositionLocation: number = -1;

  constructor(canvas: HTMLCanvasElement, scale: number, isDarkMode: boolean) {
    this.canvas = canvas;
    this.scale = scale;
    this.isDarkMode = isDarkMode;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.setup();
    this.init();
  }

  private setup(): void {
    this.vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    if (!this.vs || !this.fs) throw new Error('Failed to create shaders');

    const vertexShader = `#version 300 es
      precision highp float;
      in vec4 position;
      void main() {
        gl_Position = position;
      }`;

    this.compileShader(this.vs, vertexShader);
    this.compileShader(this.fs, shaderSource);

    this.program = this.gl.createProgram();
    if (!this.program) throw new Error('Failed to create program');

    this.gl.attachShader(this.program, this.vs);
    this.gl.attachShader(this.program, this.fs);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(this.program));
      throw new Error('Failed to link program');
    }

    this.cachedResolutionLocation = this.gl.getUniformLocation(this.program, 'resolution');
    this.cachedTimeLocation = this.gl.getUniformLocation(this.program, 'time');
    this.cachedThemeLocation = this.gl.getUniformLocation(this.program, 'isDarkMode');
    this.cachedPositionLocation = this.gl.getAttribLocation(this.program, 'position');
  }

  private compileShader(shader: WebGLShader, source: string): void {
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      throw new Error('Failed to compile shader');
    }
  }

  private init(): void {
    if (!this.program) return;

    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    const vertices = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    this.gl.enableVertexAttribArray(this.cachedPositionLocation);
    this.gl.vertexAttribPointer(this.cachedPositionLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  updateScale(scale: number): void {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * this.scale, this.canvas.height * this.scale);
  }

  updateTheme(isDarkMode: boolean): void {
    this.isDarkMode = isDarkMode;
    if (this.program) {
      this.gl.useProgram(this.program);
      this.gl.uniform1i(this.cachedThemeLocation, this.isDarkMode ? 1 : 0);
    }
  }

  render(now: number): void {
    if (!this.program) return;

    this.gl.clearColor(
      this.isDarkMode ? 0.1 : 0.95,
      this.isDarkMode ? 0.1 : 0.95,
      this.isDarkMode ? 0.2 : 0.98,
      1
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.useProgram(this.program);

    if (this.buffer) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }

    this.gl.uniform2f(this.cachedResolutionLocation, this.canvas.width, this.canvas.height);
    this.gl.uniform1f(this.cachedTimeLocation, now * 0.001);
    this.gl.uniform1i(this.cachedThemeLocation, this.isDarkMode ? 1 : 0);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  cleanup(): void {
    if (this.vs) this.gl.deleteShader(this.vs);
    if (this.fs) this.gl.deleteShader(this.fs);
    if (this.program) this.gl.deleteProgram(this.program);
    if (this.buffer) this.gl.deleteBuffer(this.buffer);
  }
}

const shaderSource = `#version 300 es
    precision highp float;
    out vec4 O;
    uniform float time;
    uniform vec2 resolution;
    uniform bool isDarkMode;
    #define FC gl_FragCoord.xy
    #define R resolution
    #define T (time * 0.05)
    #define S smoothstep
    #define MN min(R.x,R.y)
    #define PI 3.14159265359
    
    float hash21(vec2 p) {
        p = fract(p * vec2(234.34, 435.345));
        p += dot(p, p + 34.23);
        return fract(p.x * p.y);
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; i++) {
            v += a * hash21(p);
            p = rot * p * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    float fogEffect(vec2 uv, float density) {
        float noise = fbm(uv * 3.0 + vec2(T * 0.5));
        float fog = noise * density;
        fog *= smoothstep(1.0, 0.0, length(uv));
        return fog;
    }
    
    float pattern(vec2 uv) {
      float d = 0.0;
      for (float i = 0.0; i < 3.0; i++) {
        float thickness;
        float spacing;
        
        if (R.x > 768.0) {
          thickness = 0.15 + 0.05 * sin(T * 0.5 + uv.x);
          spacing = 4.0;
        } else {
          thickness = 0.15;
          spacing = 2.0;
        }
        
        uv.x += sin(T * (0.25 + i * 0.1) + uv.y * 1.2) * thickness;
        float line = (0.01 + (R.x > 768.0 ? 0.002 : 0.001) * sin(uv.y * 2.0))/abs(uv.x);
        
        float fogIntensity = fogEffect(uv, 0.5);
        d += line * (1.0 + fogIntensity * 0.5);
      }
      return d;
    }
    
    vec3 scene(vec2 uv) {
      vec3 col = vec3(0);
      vec2 uv1 = uv;
      vec2 uv2 = uv + vec2(-1.0, 0.0);
      
      float flowOffset = sin(T * 0.3) * 0.1;
      uv1 = vec2(atan(uv1.x, uv1.y) * 2.0/6.28318, -log(length(uv1)) + T * 1.25 + flowOffset);
      uv2 = vec2(atan(uv2.x, uv2.y) * 2.0/6.28318, -log(length(uv2)) + T * 1.25 - flowOffset);
      
      float spacing = R.x > 768.0 ? 4.0 : 2.0;
      
      for (float i = 0.0; i < 3.0; i++) {
        int k = int(mod(i, 3.0));
        float intensity = 0.7 + 0.1 * sin(T + i);
        
        float fog1 = fogEffect(uv1 + vec2(T * 0.1), 0.3);
        float fog2 = fogEffect(uv2 + vec2(T * 0.1), 0.3);
        
        col[k] += pattern(uv1 + i * spacing/MN) * intensity * (1.0 + fog1);
        col[k] += pattern(uv2 + i * spacing/MN) * intensity * (1.0 + fog2);
      }
      return col;
    }
    
    void main() {
      vec2 uv = (FC - 0.5 * R)/MN;
      vec3 col = vec3(0);
      float s = 6.0;
      float e = 5e-4;
      
      vec2 staticUV = uv;
      uv.y += T * 0.25;
      
      mat2 rot = mat2(cos(PI/4.0), -sin(PI/4.0), sin(PI/4.0), cos(PI/4.0));
      vec2 rotatedUV = rot * uv;
      
      float gridPattern = max(
        abs(sin(rotatedUV.x * s)),
        abs(cos(rotatedUV.y * s))
      );
      col += vec3(step(0.95, gridPattern)) * 0.03;
      
      staticUV.y += R.x > R.y ? 0.5 : 0.5 * (R.y/R.x);
      
      float baseFog = fogEffect(uv * 2.0, 0.2);
      col += vec3(baseFog * 0.1);
      
      vec3 sceneColor = scene(staticUV) * 0.8;
      float sceneFog = fogEffect(staticUV * 1.5, 0.4);
      sceneColor *= 1.0 + sceneFog * 0.3;
      col += sceneColor;
      
      vec3 finalColor = col * 0.6;
      if (isDarkMode) {
          finalColor = vec3(1.0) - finalColor;
      }
      
      O = vec4(finalColor, 0.15);
    }`;

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const frameIdRef = useRef<number>(0);
  const resizeTimeoutRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = Math.max(1, window.devicePixelRatio);
    rendererRef.current = new Renderer(canvas, dpr, isDarkMode);

    const resize = () => {
      if (!canvas) return;
      window.clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = window.setTimeout(() => {
        const { innerWidth: width, innerHeight: height } = window;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        rendererRef.current?.updateScale(dpr);
      }, 100);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = (now: number) => {
      rendererRef.current?.render(now);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.clearTimeout(resizeTimeoutRef.current);
      cancelAnimationFrame(frameIdRef.current);
      rendererRef.current?.cleanup();
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.updateTheme(isDarkMode);
    }
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default AnimatedBackground;
