'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface EclipseToggleProps {
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const EclipseToggle: React.FC<EclipseToggleProps> = ({ onThemeChange }) => {
  const [animationState, setAnimationState] = useState(2);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isNearEclipse = useCallback((element: HTMLElement) => {
    const progress = parseInt(
      window.getComputedStyle(element).getPropertyValue('background-position')
    );
    return progress >= 48 && progress <= 50;
  }, []);

  const isNearStartingPosition = useCallback((element: HTMLElement) => {
    const progress = parseInt(
      window.getComputedStyle(element).getPropertyValue('background-position')
    );
    return progress >= 99 || progress <= 1;
  }, []);

  const pauseAllAnimations = useCallback(() => {
    const moon = document.querySelector('.moon') as HTMLElement;
    const sun = document.querySelector('.four.move') as HTMLElement;

    if (moon && sun) {
      moon.style.animationPlayState = 'paused';
      sun.style.animationPlayState = 'paused';
    }
    setIsTransitioning(false);
  }, []);

  const runAllAnimations = useCallback(() => {
    const moon = document.querySelector('.moon') as HTMLElement;
    const sun = document.querySelector('.four.move') as HTMLElement;

    if (moon && sun) {
      moon.style.animationPlayState = 'running';
      sun.style.animationPlayState = 'running';
    }
    setIsTransitioning(true);
  }, []);

  const waitForEclipseThenPause = useCallback(() => {
    const moon = document.querySelector('.moon') as HTMLElement;
    if (!moon) return;

    function checkEclipse() {
      if (isNearEclipse(moon)) {
        pauseAllAnimations();
        // When moon covers sun (eclipse) = light mode
        onThemeChange?.('light');
        setAnimationState(2);
      } else {
        requestAnimationFrame(checkEclipse);
      }
    }
    checkEclipse();
  }, [isNearEclipse, pauseAllAnimations, onThemeChange]);

  const waitForEndThenPause = useCallback(() => {
    const moon = document.querySelector('.moon') as HTMLElement;
    if (!moon) return;

    function checkEnd() {
      if (isNearStartingPosition(moon)) {
        pauseAllAnimations();
        // When sun is visible = dark mode
        onThemeChange?.('dark');
        setAnimationState(0);
      } else {
        requestAnimationFrame(checkEnd);
      }
    }
    checkEnd();
  }, [isNearStartingPosition, pauseAllAnimations, onThemeChange]);

  const handleClick = useCallback(() => {
    if (animationState === 0) {
      runAllAnimations();
      waitForEclipseThenPause();
    } else if (animationState === 2) {
      runAllAnimations();
      waitForEndThenPause();
    }
  }, [animationState, runAllAnimations, waitForEclipseThenPause, waitForEndThenPause]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  // Updated mouse tracking
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) {
      const handleMouseMove = (e: MouseEvent) => {
        const threshold = 150;
        const isNearCorner =
          window.innerWidth - e.clientX <= threshold && window.innerHeight - e.clientY <= threshold;

        setMousePos({ x: e.clientX, y: e.clientY });
        setIsVisible(isNearCorner || isTransitioning);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
      setIsVisible(true);
    }
  }, [isTransitioning]);

  // Add useEffect to set initial theme
  useEffect(() => {
    // Set initial theme to light mode
    onThemeChange?.('light');
    
    // Pause animations in light mode position
    const moon = document.querySelector('.moon') as HTMLElement;
    const sun = document.querySelector('.four.move') as HTMLElement;
    
    if (moon && sun) {
      // Set initial position for light mode
      moon.style.backgroundPosition = '50% 50%';
      sun.style.left = '0px';
      moon.style.animationPlayState = 'paused';
      sun.style.animationPlayState = 'paused';
    }
  }, [onThemeChange]);

  return (
    <div
      className={`
      fixed bottom-4 
      right-4 z-50
      transition-opacity duration-300
      ease-in-out md:bottom-8 md:right-8
      ${isVisible || isTransitioning ? 'opacity-100' : 'opacity-0'}
      group
    `}
    >
      <style>{`
        .eclipse-elements {
          filter: url('#goo');
          width: 50px;
          height: 50px;
          position: relative;
          overflow: visible;
        }
        .moon {
          position: absolute;
          left: 0;
          top: 0;
          width: 50px;
          height: 50px;
          margin: 0;
          background: linear-gradient(90deg, rgba(255, 255, 230, 0.6), rgba(240, 243, 230, 0.7), rgba(231, 234, 217, 0.7),#283747, #283747, #283747, rgba(231, 234, 217, 0.7), rgba(240, 243, 230, 0.7), rgba(255, 255, 230, 0.6));
          background-size: 1000% 1000%;
          border-radius: 100%;
          overflow: hidden;
          position: relative;
          animation: moon 10s infinite linear;
          animation-play-state: paused;
        }
        .moon::before {
          content: "";
          background-image: url("https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg");
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: inherit;
          z-index: -1;
          opacity: 1;
          animation: moonImageOpacity 10s infinite linear;
          animation-play-state: paused;
        }
        @keyframes moon {
          0%, 100% {
            background-position: 100% 50%;
          }
          42%, 48% {
            background-position: 50% 50%;
          }
        }
        @keyframes moonImageOpacity {
          0%, 100% {
            opacity: 1;
          }
          42%, 48% {
            opacity: 0.5;
          }
        }
        .four {
          position: absolute;
          left: 85px;
          top: 0;
          width: 50px;
          height: 50px;
          transform: scale(0.9);
          animation: sunMove 10s infinite ease;
          animation-play-state: paused;
          filter: blur(10px);
          opacity: 1 !important;
          background: rgba(255, 255, 255, 1) !important;
          border-radius: 100%;
          z-index: -2;
        }
        @keyframes sunMove {
          0% {
            left: 85px;
            transform: scale(0.9);
          }
          50% {
            left: 0;
            transform: scale(0.9);
          }
          100% {
            left: 85px;
            transform: scale(0.9);
          }
        }
      `}</style>

      {/* Tooltip - Hidden on mobile */}
      <div
        className="
          pointer-events-none fixed
          z-10
          hidden whitespace-nowrap rounded-lg
          bg-zinc-800 px-3
          py-1.5 text-sm
          text-zinc-200 opacity-0
          shadow-lg
          transition-opacity duration-200
          group-hover:opacity-100 dark:bg-white
          dark:text-zinc-800
          md:block
        "
        style={{
          left: `${mousePos.x - 150}px`,
          top: `${mousePos.y}px`,
        }}
      >
        {animationState === 0 ? 'Click for light mode' : 'Click for dark mode'}
      </div>

      {/* Eclipse toggle button */}
      <button
        className="eclipse-elements"
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        aria-label="Toggle theme"
        role="switch"
        aria-checked={animationState === 2}
      >
        <div className="sun four move"></div>
        <div className="moon"></div>
      </button>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default EclipseToggle;
