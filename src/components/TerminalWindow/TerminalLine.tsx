import React from 'react';
import { motion } from 'framer-motion';

interface TerminalLineProps {
  text: string;
  index: number;
  isCommand?: boolean;
}

const TerminalLine = ({ text, index, isCommand = false }: TerminalLineProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      className={`font-mono text-base antialiased ${
        isCommand ? 'text-green-400 dark:text-green-500' : 'text-gray-300/90 dark:text-gray-800'
      }`}
    >
      {text}
    </motion.div>
  );
};

export default TerminalLine;
