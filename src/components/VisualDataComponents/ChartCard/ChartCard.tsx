'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useTheme } from 'next-themes';

interface ChartCardProps {
  title: string;
  subtitle: string;
  chart?: React.ReactNode;
  content?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, chart, content }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-zinc-700/50 bg-gradient-to-br from-zinc-800/50
        to-zinc-900/50 p-6 backdrop-blur-xl transition-all
        duration-300 hover:border-zinc-600/50
        dark:border-zinc-800/50 dark:from-zinc-100/50 dark:to-zinc-200/50
        dark:hover:border-zinc-700/50"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white dark:text-zinc-900">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">{subtitle}</p>
      </div>
      {chart && (
        <div
          key={theme}
          className="relative [&_svg]:text-white [&_svg]:dark:text-zinc-900 [&_text]:text-white [&_text]:dark:text-zinc-900"
        >
          {chart}
        </div>
      )}
      {content && <div className="mt-4">{content}</div>}
    </motion.div>
  );
};

export default ChartCard;
