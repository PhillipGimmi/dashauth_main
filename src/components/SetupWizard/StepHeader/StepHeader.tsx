import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepHeaderProps {
  title: string;
  subtitle: string;
  backLabel: string;
  showHelp: boolean;
  onBack?: () => void;
  onHelp?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  subtitle,
  backLabel,
  showHelp,
  onBack,
  onHelp,
}) => {
  return (
    <div className="relative mb-12">
      <button
        onClick={onBack}
        className="absolute left-0 top-8 flex items-center gap-2 p-2 text-zinc-400 transition-colors hover:text-white dark:text-gray-500 dark:hover:text-black"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="max-w-[200px] truncate">{backLabel}</span>
      </button>

      <button
        onClick={onHelp}
        className="absolute right-0 top-8 flex items-center gap-2 p-2 text-zinc-400 transition-colors hover:text-white dark:text-gray-500 dark:hover:text-black"
      >
        <span>Help</span>
        <motion.div animate={{ rotate: showHelp ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronRight className="h-5 w-5" />
        </motion.div>
      </button>

      <div className="space-y-4 pt-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white dark:text-black"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 dark:text-gray-500"
        >
          {subtitle}
        </motion.p>
      </div>
    </div>
  );
};
