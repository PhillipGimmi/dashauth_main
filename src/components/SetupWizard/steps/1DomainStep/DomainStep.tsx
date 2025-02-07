'use client';

import React, { useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

interface DomainStepProps {
  initialValue?: string;
  onProceedAction: (domain: string) => void | Promise<void>;
}

export const DomainStep: React.FC<DomainStepProps> = ({ initialValue = '', onProceedAction }) => {
  const [domain, setDomain] = useState(initialValue);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const turn = useMotionValue(0);
  const shimmerTurn = useMotionValue(0);
  const degrees = useTransform(turn, (latest) => Math.round((latest * 360) % 360));
  const shimmerDegrees = useTransform(shimmerTurn, (latest) => Math.round((latest * 360) % 360));

  useEffect(() => {
    const animation = animate(turn, 1, {
      ease: 'linear',
      duration: 5,
      repeat: Infinity,
    });

    const shimmerAnimation = animate(shimmerTurn, -1, {
      ease: 'linear',
      duration: 5,
      repeat: Infinity,
    });

    return () => {
      animation.stop();
      shimmerAnimation.stop();
    };
  }, [turn, shimmerTurn]);

  useEffect(() => {
    if (initialValue) {
      setDomain(initialValue);
    }
  }, [initialValue]);

  const getRightEdgeLight = (deg: number) => {
    const START_ANGLE = 373;
    const END_ANGLE = 73;

    let normalizedDeg = deg;
    if (deg < END_ANGLE) {
      normalizedDeg = deg + 360;
    }

    if (normalizedDeg < START_ANGLE && normalizedDeg > END_ANGLE) {
      return 0;
    }

    const TOTAL_ARC = 360 - START_ANGLE + END_ANGLE;
    let progress = 0;

    if (normalizedDeg >= START_ANGLE) {
      progress = (normalizedDeg - START_ANGLE) / TOTAL_ARC;
    } else {
      progress = (normalizedDeg + (360 - START_ANGLE)) / TOTAL_ARC;
    }

    return 1 - progress;
  };

  const getLeftShimmer = (deg: number) => {
    const START_ANGLE = 323;
    const END_ANGLE = 73;

    let normalizedDeg = deg;
    if (deg < END_ANGLE) {
      normalizedDeg = deg + 360;
    }

    if (normalizedDeg < START_ANGLE && normalizedDeg > END_ANGLE) {
      return 0;
    }

    const TOTAL_ARC = 360 - START_ANGLE + END_ANGLE;
    let progress = 0;

    if (normalizedDeg >= START_ANGLE) {
      progress = (normalizedDeg - START_ANGLE) / TOTAL_ARC;
    } else {
      progress = (normalizedDeg + (360 - START_ANGLE)) / TOTAL_ARC;
    }

    return 1 - progress;
  };

  const buttonLight = useTransform(degrees, (latest) => getRightEdgeLight(latest));
  const shimmerLight = useTransform(shimmerDegrees, (latest) => getLeftShimmer(latest));

  const isValidDomain = (input: string): boolean => {
    try {
      const trimmedInput = input.trim().toLowerCase();
      if (!trimmedInput) return false;

      // Add protocol if not present for URL parsing
      const urlString = trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`;
      const url = new URL(urlString);

      // Check if hostname is valid and has at least one dot
      return (
        (url.hostname.includes('.') && url.hostname === trimmedInput) ||
        `www.${url.hostname}` === trimmedInput
      );
    } catch {
      return false;
    }
  };

  const getBorderColor = () => {
    if (domain === '') return '#ffffff';
    return isValidDomain(domain) ? '#22c55e' : '#ef4444';
  };

  const getLightBorderColor = () => {
    if (domain === '') return '#000000';
    return isValidDomain(domain) ? '#22c55e' : '#ef4444';
  };

  const borderGradient = useMotionTemplate`conic-gradient(from ${turn}turn, transparent 0deg, ${getBorderColor()} 60deg, ${getBorderColor()} 120deg, transparent 120deg)`;
  const lightBorderGradient = useMotionTemplate`conic-gradient(from ${turn}turn, transparent 0deg, ${getLightBorderColor()} 60deg, ${getLightBorderColor()} 120deg, transparent 120deg)`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedDomain = domain.trim();

    if (isValidDomain(trimmedDomain)) {
      setShowError(false);
      setIsLoading(true);
      try {
        // Only await if it's a promise
        if (onProceedAction instanceof Promise) {
          await onProceedAction(trimmedDomain);
        } else {
          onProceedAction(trimmedDomain);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowError(true);
      setErrorMessage('Please enter a valid domain');
    }
  };

  const handleInputChange = (value: string) => {
    setDomain(value);
    if (showError) setShowError(false);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const getActiveDot = () => {
    if (domain === '') return 'white';
    return isValidDomain(domain) ? 'valid' : 'invalid';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.h1
        variants={itemVariants}
        className="mb-2 text-center text-4xl font-bold text-white dark:text-black"
      >
        Secure Your Application
      </motion.h1>

      <motion.p variants={itemVariants} className="text-center text-zinc-400 dark:text-gray-600">
        Enter your domain to get started
      </motion.p>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="mx-auto max-w-md space-y-4"
      >
        <div className="group relative">
          <motion.div
            className="absolute -inset-[2px] rounded-lg opacity-75 blur-lg transition-opacity group-hover:opacity-100 dark:hidden"
            style={{
              background: borderGradient,
            }}
          />
          <motion.div
            className="absolute -inset-[1px] rounded-lg dark:hidden"
            style={{
              background: borderGradient,
              opacity: 0.8,
            }}
          />
          <motion.div
            className="absolute -inset-[1px] rounded-lg mix-blend-soft-light dark:hidden"
            style={{
              background:
                'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent 70%)',
              filter: 'blur(4px)',
            }}
          />

          <motion.div
            className="absolute -inset-[2px] hidden rounded-lg opacity-75 blur-lg transition-opacity group-hover:opacity-100 dark:block"
            style={{
              background: lightBorderGradient,
            }}
          />
          <motion.div
            className="absolute -inset-[1px] hidden rounded-lg dark:block"
            style={{
              background: lightBorderGradient,
              opacity: 0.8,
            }}
          />
          <motion.div
            className="absolute -inset-[1px] hidden rounded-lg mix-blend-soft-light dark:block"
            style={{
              background: 'radial-gradient(circle at top left, rgba(0,0,0,0.1), transparent 70%)',
              filter: 'blur(4px)',
            }}
          />

          <div className="absolute inset-[1px] rounded-lg bg-zinc-900/90 backdrop-blur-sm dark:bg-gray-100/90" />

          <input
            type="text"
            value={domain}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={initialValue ? '' : 'your-domain.com'}
            className="relative w-full rounded-lg border-transparent bg-transparent px-4 py-3 text-white placeholder-zinc-500 transition-all duration-200 focus:outline-none dark:text-black dark:placeholder-zinc-400"
          />

          <div className="absolute bottom-[1px] right-[1px] top-[1px] w-[52px] overflow-hidden rounded-r-lg border-transparent">
            <div
              className="absolute inset-0 dark:hidden"
              style={{
                background:
                  'linear-gradient(to right, rgba(24, 24, 27, 0) 0%, rgba(24, 24, 27, 1) 100%)',
              }}
            />
            <div
              className="absolute inset-0 hidden dark:block"
              style={{
                background:
                  'linear-gradient(to right, rgba(24, 24, 27, 0) 0%, rgba(255, 255, 255, 1) 100%)',
              }}
            />
          </div>

          <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2">
            {isLoading ? (
              <p>Busy loading...</p>
            ) : (
              <>
                <div className="absolute inset-0 -left-[1px] overflow-hidden rounded-md bg-zinc-900 dark:bg-gray-100">
                  <motion.div
                    className="absolute -left-[1px] bottom-[3px] top-[3px] w-[1px]"
                    style={{
                      background: useMotionTemplate`linear-gradient(to bottom, ${getBorderColor()}00, ${getBorderColor()}ff, ${getBorderColor()}00)`,
                      opacity: shimmerLight,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="relative z-0 flex items-center overflow-hidden whitespace-nowrap rounded-md border-[1px]
                  border-zinc-900 px-4 py-1.5 font-medium text-neutral-300 transition-all duration-300 before:absolute before:inset-0
                  before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-white
                  before:transition-transform before:duration-1000 before:content-['']
                  hover:scale-105
                  hover:border-white hover:text-neutral-900 hover:before:translate-y-[0%]
                  active:scale-100 dark:border-gray-300 dark:text-gray-700 dark:before:bg-black dark:hover:border-black
                  dark:hover:text-white"
                  disabled={isLoading}
                >
                  <motion.div
                    className="absolute -right-[1px] bottom-0 top-0 w-[1px]"
                    style={{
                      background: useMotionTemplate`linear-gradient(to bottom, ${getBorderColor()}00, ${getBorderColor()}ff, ${getBorderColor()}00)`,
                      opacity: buttonLight,
                    }}
                  />
                  <span className="relative z-10">Next</span>
                </button>
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isInputFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-3 backdrop-blur-sm dark:border-gray-300/50 dark:bg-white/50"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                      getActiveDot() === 'white'
                        ? 'bg-white dark:bg-gray-800'
                        : 'bg-white/20 dark:bg-gray-200/20'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      getActiveDot() === 'white'
                        ? 'text-white dark:text-gray-800'
                        : 'text-white/40 dark:text-gray-400'
                    }`}
                  >
                    Not started
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                      getActiveDot() === 'invalid' ? 'bg-red-500' : 'bg-red-500/20'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      getActiveDot() === 'invalid' ? 'text-red-500' : 'text-red-500/40'
                    }`}
                  >
                    Invalid format
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                      getActiveDot() === 'valid' ? 'bg-green-500' : 'bg-green-500/20'
                    }`}
                  />
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      getActiveDot() === 'valid' ? 'text-green-500' : 'text-green-500/40'
                    }`}
                  >
                    Valid domain
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showError && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {errorMessage}
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
};

export default DomainStep;
