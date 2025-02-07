'use client';

import React, { useEffect, useRef } from 'react';

const createMeteorStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes meteor-animation {
      0% {
        transform: translate(0, 0) rotate(35deg);
        opacity: var(--opacity-start, 1);
      }
      
      20% {
        opacity: var(--opacity-start, 1);
      }
      
      60% {
        opacity: 0;
      }
      
      100% {
        transform: translate(calc(var(--travel-distance, 150vh) * 1.5), var(--travel-distance, 150vh)) rotate(35deg);
        opacity: 0;
      }
    }

    .animate-meteor {
      --opacity-start: 1;
      position: absolute;
      animation: meteor-animation var(--duration, 2s) linear forwards;
      animation-delay: var(--delay, 0s);
      will-change: transform, opacity;
    }
  `;
  return style;
};

export function Meteors({ number = 20 }: { readonly number?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add meteor animation styles
    const meteorStyles = createMeteorStyles();
    document.head.appendChild(meteorStyles);

    const createMeteor = () => {
      const meteorWrapper = document.createElement('div');

      const speed = Math.random();
      const isSlowMeteor = speed < 0.3;
      const isVeryThin = Math.random() < 0.4;

      meteorWrapper.classList.add('absolute', 'animate-meteor');

      const meteorHead = document.createElement('div');
      const meteorTail = document.createElement('div');

      const meteorHeight = isVeryThin ? '0.5px' : '1px';
      meteorWrapper.style.height = meteorHeight;

      meteorHead.classList.add('absolute', 'right-0');
      meteorTail.classList.add('absolute');

      const headWidth = isVeryThin ? '8px' : '15px';
      const tailWidth = isVeryThin ? '60px' : '85px';

      meteorHead.style.width = headWidth;
      meteorHead.style.height = meteorHeight;
      meteorTail.style.width = tailWidth;
      meteorTail.style.height = meteorHeight;
      meteorTail.style.right = headWidth;

      const headOpacity = isVeryThin ? 0.7 : 1;
      const tailOpacity = isVeryThin ? 0.3 : 0.4;

      meteorHead.style.background = `linear-gradient(to right, transparent, rgba(255,255,255,${headOpacity}))`;
      meteorHead.style.boxShadow = isVeryThin ? 'none' : '0 0 0 1px rgba(255,255,255,0.4)';
      meteorTail.style.background = `linear-gradient(to right, transparent, rgba(255,255,255,${tailOpacity}))`;

      meteorWrapper.appendChild(meteorTail);
      meteorWrapper.appendChild(meteorHead);

      meteorWrapper.style.top = `-${Math.random() * 100}px`;
      meteorWrapper.style.left = `${Math.random() * 100}vw`;

      const duration = isSlowMeteor ? 2.5 + Math.random() * 1.5 : 1 + Math.random() * 0.8;

      meteorWrapper.style.setProperty(
        '--travel-distance',
        `${Math.floor(Math.random() * 50 + 150)}vh`
      );
      meteorWrapper.style.setProperty('--duration', `${duration}s`);
      meteorWrapper.style.setProperty('--delay', `${Math.random() * 2}s`);
      meteorWrapper.style.opacity = isVeryThin ? '0.8' : '1';

      container.appendChild(meteorWrapper);

      const cleanup = () => {
        if (container.contains(meteorWrapper)) {
          container.removeChild(meteorWrapper);
        }
      };

      meteorWrapper.addEventListener('animationend', cleanup);
    };

    // Create initial batch
    for (let i = 0; i < number; i++) {
      setTimeout(() => createMeteor(), Math.random() * 1500);
    }

    // Continue creating meteors
    const interval = setInterval(createMeteor, 2000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(meteorStyles);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [number]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
