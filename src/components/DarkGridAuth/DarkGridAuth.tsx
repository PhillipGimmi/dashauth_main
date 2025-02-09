'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { AuthMode } from '@/app/types/auth';
import { Meteors } from './Meteors';
import { Stars } from './Stars';
import CornerGrid from './CornerGrid';
import { SignInForm } from '../SignInForm/SignInForm';
import { BubbleButton } from './CustomButtons';

// Animation variants
const containerVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.3,
    },
  },
};

const fadeInUp = {
  initial: {
    opacity: 0,
    y: 20,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.3,
    },
  },
};

const backgroundVariants = {
  initial: {
    opacity: 0,
    scale: 1.1,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: 'easeOut',
    },
  },
};

const Heading = ({ mode, onToggleMode }: { mode: AuthMode; onToggleMode: () => void }) => (
  <motion.div
    initial="initial"
    animate="animate"
    variants={{
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.2,
        },
      },
    }}
    className="w-full"
  >
    <motion.h1
      variants={fadeInUp}
      className="relative text-3xl font-bold text-zinc-100 transition-transform duration-200 hover:scale-[1.02]"
    >
      Dash Auth
    </motion.h1>
    <div className="mb-9 mt-6 space-y-1.5">
      <motion.h2 variants={fadeInUp} className="text-2xl font-semibold">
        <AnimatePresence mode="wait">
          <motion.span
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </motion.span>
        </AnimatePresence>
      </motion.h2>
      <div className="text-zinc-400">
        <AnimatePresence mode="wait">
          <motion.div key={mode} className="inline-block">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </motion.span>

            <motion.button
              onClick={onToggleMode}
              className="ml-3 rounded-sm text-white hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode}
                  initial={{}}
                  animate={{ transition: { staggerChildren: 0.02 } }}
                >
                  {(mode === 'signin' ? ['Create', 'one.'] : ['Sign', 'in', 'instead.']).map(
                    (word, wordIndex) => (
                      <motion.span
                        key={`${mode}-word-${word}`}
                        className="inline-block whitespace-nowrap"
                        initial={{}}
                        animate={{ transition: { staggerChildren: 0.02 } }}
                      >
                        {word.split('').map((letter, letterIndex) => (
                          <motion.span
                            key={`${mode}-${word}-${letter}-${letterIndex}`}
                            className="inline-block"
                            variants={{
                              initial: { opacity: 0, y: 20, filter: 'blur(8px)' },
                              animate: {
                                opacity: 1,
                                y: 0,
                                filter: 'blur(0px)',
                                transition: { duration: 0.25, ease: 'easeOut' },
                              },
                            }}
                          >
                            {letter}
                          </motion.span>
                        ))}
                        {wordIndex !== (mode === 'signin' ? 1 : 2) && (
                          <span className="mr-2 inline-block"> </span>
                        )}
                      </motion.span>
                    )
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

interface DarkGridAuthProps {
  children?: React.ReactNode;
}

const DarkGridAuth = ({ children }: DarkGridAuthProps) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 text-zinc-200 selection:bg-zinc-600">
      {/* Background Effects */}
      <motion.div
        variants={backgroundVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0"
      >
        <CornerGrid />
        <Meteors number={20} />
        <Stars number={100} />
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="relative z-10 mx-auto w-full max-w-sm px-0"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children || (
            <>
              <Heading mode={mode} onToggleMode={toggleMode} />
              <SignInForm mode={mode} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Go Back Button */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 1.4 }}
        className="absolute left-4 top-6 z-10"
      >
        <BubbleButton
          onClick={() => window.history.back()}
          className="group text-sm transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <motion.svg
            initial={{ x: 0 }}
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </motion.svg>
          Go back
        </BubbleButton>
      </motion.div>
    </div>
  );
};

export default DarkGridAuth;
