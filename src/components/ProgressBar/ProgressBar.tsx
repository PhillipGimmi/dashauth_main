import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

interface ProgressDotProps {
  active: boolean;
  completed: boolean;
}

const ProgressDot: React.FC<ProgressDotProps> = ({ active, completed }) => {
  // Determine the background color class based on the state
  let backgroundClass = 'bg-zinc-600'; // Default

  if (completed) {
    backgroundClass = 'bg-white';
  } else if (active) {
    backgroundClass = 'bg-white/50';
  }

  return (
    <div
      className={`
          h-2 w-2 rounded-full transition-all duration-300
          ${backgroundClass}
        `}
    />
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 backdrop-blur-sm"
    >
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <ProgressDot key={step} active={currentStep === step} completed={currentStep > step} />
      ))}
    </motion.div>
  );
};
