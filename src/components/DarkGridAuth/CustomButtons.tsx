// src/app/signin/CustomButtons.tsx
'use client';

import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SplashButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...rest
}) => (
  <button
    className={twMerge(
      'shimmer-button group relative inline-flex items-center justify-center',
      variant === 'primary'
        ? 'from-baby-blue-400 to-baby-blue-600 bg-gradient-to-br'
        : 'bg-gradient-to-br from-zinc-400 to-zinc-700',
      className
    )}
    {...rest}
  >
    <span className="text relative z-10">{children}</span>
    <span className="shimmer" aria-hidden="true"></span>
  </button>
);

// BubbleButton component as previously implemented
export const BubbleButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...rest
}) => {
  const baseStyles = `
    relative z-0 
    inline-flex items-center gap-2 
    overflow-hidden whitespace-nowrap rounded-md 
    border px-3 py-1.5
    text-sm font-medium
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    
    before:absolute before:inset-0
    before:-z-10 before:translate-y-[200%]
    before:scale-[2.5]
    before:rounded-[100%]
    before:transition-transform before:duration-500
    before:content-[""]
    
    hover:scale-105
    hover:before:translate-y-[0%]
    active:scale-100
    
    motion-reduce:transition-none
    motion-reduce:hover:transform-none
  `;

  const variants = {
    primary: `
      border-zinc-700 
      bg-gradient-to-br from-zinc-800 to-zinc-950
      text-zinc-50
      before:bg-zinc-100
      hover:text-zinc-900
      focus:ring-zinc-500
      focus:ring-offset-zinc-900
    `,
    secondary: `
      border-zinc-200 
      bg-gradient-to-br from-zinc-100 to-zinc-200
      text-zinc-900
      before:bg-zinc-900
      hover:text-zinc-50
      focus:ring-zinc-200
      focus:ring-offset-zinc-100
    `,
  };

  return (
    <button className={twMerge(baseStyles, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
};

// ButtonGroup for managing groups of buttons
export const ButtonGroup = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('flex items-center gap-2', className)} {...props}>
    {children}
  </div>
);
