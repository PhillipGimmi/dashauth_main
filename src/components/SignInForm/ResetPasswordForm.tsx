import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FormInput } from './FormInput';
import { FormError } from './FormError';

import { useState } from 'react';
import ShimmerButton from '../ShimmerButton/ShimmerButton';

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

interface ResetPasswordFormProps {
  readonly onBackToLogin: () => void;
}

export function ResetPasswordForm({ onBackToLogin }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else if (response.status === 404) {
        setError(`No account found with email address: ${email}`);
      } else {
        setError(data.error || 'An error occurred while processing your request');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6"
    >
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-colors group-hover:text-white" />
          <span>Back to login</span>
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Reset Your Password</h2>
        <p className="text-sm text-zinc-400">
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      <AnimatePresence mode="wait">{error && <FormError error={error} />}</AnimatePresence>

      {!success ? (
        <motion.form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <ShimmerButton
              href="#"
              text={loading ? 'Sending...' : 'Reset Password'}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }}
            />
          </motion.div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
            <p className="text-green-500">Check your email for password reset instructions.</p>
          </div>
          <p className="text-sm text-zinc-400">
            We&apos;ve sent an email to <span className="text-white">{email}</span> with
            instructions to reset your password. The link will expire in 1 hour.
          </p>
          <button
            onClick={onBackToLogin}
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Return to login
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
