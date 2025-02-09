import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import type { FormState } from '@/app/types/auth';

const containerVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

interface VerificationFormProps {
  readonly formState: FormState;
  readonly onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onBackToLogin: () => void;
  readonly onResendCode: () => void;
}

export function VerificationForm({
  formState,
  onInputChange,
  onBackToLogin,
  onResendCode,
}: VerificationFormProps) {
  const [code, setCode] = useState('');
  const DIGIT_POSITIONS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

  const getResendButtonText = () => {
    if (formState.loading) {
      return (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending verification email...
        </span>
      );
    }
    if (formState.success) {
      return 'Email sent successfully';
    }
    return 'Resend code';
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    onInputChange({
      ...e,
      target: { ...e.target, value },
    });
  };

  // Split code into array of digits, pad with empty strings if needed
  const digits = Array.from(code.padEnd(6, ' '));

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToLogin}
          className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-colors group-hover:text-white" />
          <span>Back to login</span>
        </button>

        <button
          type="button"
          onClick={onResendCode}
          disabled={!formState.showResendButton}
          className="text-sm text-blue-500 transition-colors hover:text-blue-400 disabled:opacity-50 disabled:hover:text-blue-500"
        >
          {getResendButtonText()}
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="verificationCode" className="block text-sm font-medium text-white">
          Verification Code
        </label>

        <div className="relative">
          {/* Hidden input for actual value */}
          <input
            id="verificationCode"
            name="verificationCode"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={handleCodeChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            autoComplete="one-time-code"
            disabled={formState.loading}
          />

          {/* Visual representation */}
          <div className="flex justify-between gap-2">
            {digits.map((digit, index) => (
              <div
                key={`verification-${DIGIT_POSITIONS[index]}`}
                className={`flex h-12 w-12 items-center justify-center rounded-lg border 
                  ${formState.loading ? 'opacity-50' : ''}
                  ${
                    digit !== ' '
                      ? 'border-blue-500 bg-zinc-800/50'
                      : 'border-zinc-600 bg-zinc-800/30'
                  } 
                  ${formState.error ? 'border-red-500' : ''}
                  text-xl font-medium text-white`}
              >
                {digit !== ' ' ? digit : ''}
              </div>
            ))}
          </div>

          {/* Error message */}
          {formState.error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 mt-2"
            >
              <p className="text-sm text-red-500">{formState.error}</p>
            </motion.div>
          )}

          {/* Loading state */}
          {formState.loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      </div>

      {formState.verificationTimer && !formState.error && (
        <p className="text-sm text-zinc-400">Code expires in: {formState.verificationTimer}s</p>
      )}

      {formState.verificationAttempts > 0 && !formState.error && (
        <p className="text-sm text-zinc-400">
          Attempts remaining: {3 - formState.verificationAttempts}
        </p>
      )}

      <p className="mt-4 text-xs text-zinc-400">
        Please enter the verification code sent to your email. If you don&apos;t see it, check your
        spam folder.
      </p>
    </motion.div>
  );
}
