import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayText('');
    setIsTyping(true);
    let currentIndex = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayText(text.substring(0, currentIndex + 1));
        currentIndex++;
        const timeout = setTimeout(typeNextChar, Math.random() * 50 + 30);
        timeouts.push(timeout);
      } else {
        setIsTyping(false);
      }
    };

    const initialTimeout = setTimeout(typeNextChar, 150);
    timeouts.push(initialTimeout);

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, [text]);

  return (
    <span className="inline-flex items-center">
      {displayText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="ml-1 inline-block h-5 w-2 bg-slate-300"
        />
      )}
    </span>
  );
};

export default TypewriterText;
