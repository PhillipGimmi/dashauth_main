import React from 'react';
import { motion } from 'framer-motion';

interface FormErrorProps {
  readonly error: string;
}

export function FormError({ error }: FormErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500"
    >
      {error}
    </motion.div>
  );
}
