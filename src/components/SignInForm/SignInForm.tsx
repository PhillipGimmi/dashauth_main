'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FormError } from './FormError';
import { FormInput } from './FormInput';
import { VerificationForm } from './VerificationForm';

import { useAuthForm } from '@/hooks/useAuthForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { AuthMode } from '@/types/auth';
import ShimmerButton from '../ShimmerButton/ShimmerButton';

const formVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

const buttonContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.3,
    },
  },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.6,
    },
  },
};

interface SignInFormProps {
  readonly mode: AuthMode;
}

export function SignInForm({ mode }: SignInFormProps) {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const {
    formState,
    handleSubmit,
    handleInputChange,
    getButtonText,
    handleBackToLogin,
    handleResendCode,
  } = useAuthForm(mode);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (form) {
      form.requestSubmit();
    }
  };

  if (showResetPassword) {
    return <ResetPasswordForm onBackToLogin={() => setShowResetPassword(false)} />;
  }

  return (
    <motion.form
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md space-y-4"
      noValidate
    >
      <AnimatePresence mode="wait">
        {formState.error && <FormError error={formState.error} />}
      </AnimatePresence>

      {formState.showVerificationField ? (
        <VerificationForm
          formState={formState}
          onInputChange={handleInputChange}
          onBackToLogin={handleBackToLogin}
          onResendCode={handleResendCode}
        />
      ) : (
        <motion.div className="space-y-4">
          {mode === 'signup' && (
            <FormInput
              id="name"
              name="name"
              label="Full Name"
              type="text"
              placeholder="Your full name"
              value={formState.name}
              onChange={handleInputChange}
              disabled={formState.loading}
              required
            />
          )}

          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formState.email}
            onChange={handleInputChange}
            disabled={formState.loading}
            required
            autoComplete={mode === 'signup' ? 'username' : 'email'}
          />

          <FormInput
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder={mode === 'signup' ? 'Create a strong password' : '••••••••••••'}
            value={formState.password}
            onChange={handleInputChange}
            disabled={formState.loading}
            required
            minLength={8}
            showPasswordRequirements={mode === 'signup' && formState.touched.password}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          {mode === 'signup' && (
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••••••"
              value={formState.confirmPassword}
              onChange={handleInputChange}
              disabled={formState.loading}
              required
              minLength={8}
              autoComplete="new-password"
            />
          )}

          {mode === 'signin' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-zinc-400">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Forgot password?
              </button>
            </div>
          )}
        </motion.div>
      )}

      <motion.div variants={buttonContainerVariants}>
        <ShimmerButton href="#" text={getButtonText()} onClick={handleButtonClick} />
      </motion.div>

      {!formState.showVerificationField && (
        <motion.div variants={textVariants} className="space-y-4">
          <motion.p className="text-xs text-zinc-400">
            By {mode === 'signin' ? 'signing in' : 'signing up'}, you agree to our{' '}
            <Link
              href="/terms"
              className="rounded-sm text-white hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-100"
            >
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="rounded-sm text-white hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-100"
            >
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      )}

      {formState.showVerificationField && (
        <motion.p variants={textVariants} className="mt-4 text-xs text-zinc-400">
          Please enter the verification code sent to{' '}
          <span className="text-white">{formState.email}</span>.{' '}
          {formState.verificationAttempts > 0 && (
            <span>
              Attempts remaining:{' '}
              <span className="text-white">{3 - formState.verificationAttempts}</span>
            </span>
          )}
        </motion.p>
      )}

      {formState.showHelp && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <h3 className="mb-2 text-sm font-medium text-white">Having trouble signing in?</h3>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>• Make sure your email address is correct</li>
            <li>• Passwords are case-sensitive</li>
            <li>• Check if caps lock is turned on</li>
            <li>• Try resetting your password if you can&apos;t remember it</li>
          </ul>
        </motion.div>
      )}
    </motion.form>
  );
}
