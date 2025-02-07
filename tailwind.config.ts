import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-sans-jp': ['var(--font-noto-sans-jp)'],
      },
      colors: {
        // Theme Colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          gradient: {
            start: 'var(--color-primary-gradient-start)',
            end: 'var(--color-primary-gradient-end)',
          },
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          gradient: {
            start: 'var(--color-secondary-gradient-start)',
            end: 'var(--color-secondary-gradient-end)',
          },
        },
        // Background and surfaces
        background: {
          DEFAULT: 'var(--color-background)',
          surface: 'var(--color-background-surface)',
          overlay: 'var(--color-background-overlay)',
        },
        // Text colors
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        // UI Elements
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        axis: {
          stroke: 'var(--color-axis-stroke)',
          tick: 'var(--color-axis-tick)',
          line: 'var(--color-axis-line)',
        },
        grid: {
          DEFAULT: 'var(--color-grid)',
        },
        sparkle: {
          glow: 'var(--color-sparkle-glow)',
          standard: 'var(--color-sparkle-standard)',
          intense: 'var(--color-sparkle-intense)',
        },
        indicator: {
          success: 'var(--color-indicator-success)',
          error: 'var(--color-indicator-error)',
          neutral: 'var(--color-indicator-neutral)',
        },
      },
      animation: {
        meteor: 'meteor-animation 1s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-in-out forwards',
        flicker: 'flicker 3s ease-in-out infinite alternate',
        spin: 'spin 3s linear infinite',
        wipe: 'wipe 1.5s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 3s linear infinite',
        'border-spin': 'border-spin 2.5s linear infinite',
      },
      keyframes: {
        'meteor-animation': {
          '0%': {
            transform: 'translateX(0) translateY(0) rotate(45deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100px) translateY(100px) rotate(45deg)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        },
        spin: {
          '0%': { '--mask': '0deg' },
          '100%': { '--mask': '360deg' },
        },
        wipe: {
          '0%': { 'mask-position': '200% center' },
          '100%': { 'mask-position': '0% center' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        glow: {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
        'border-spin': {
          '0%': { '--rotate': '0deg' },
          '100%': { '--rotate': '360deg' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
