'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Minus, Square } from 'lucide-react';
import TerminalLine from './TerminalLine';
import { commands } from './terminaldata';

interface TerminalWindowProps {
  messages: string[];
  onComplete?: () => void;
}

const TerminalWindow = ({ messages, onComplete }: TerminalWindowProps) => {
  const [mounted, setMounted] = useState(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  const isPausedRef = useRef(false);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef(0);

  const handleVisibleLines = useCallback(() => {
    setVisibleLines((prev) => {
      if (prev < messages.length) {
        return prev + 1;
      }
      if (!completedRef.current) {
        completedRef.current = true;
        Promise.resolve().then(() => onComplete?.());
      }
      if (timerRef.current) clearInterval(timerRef.current);
      return prev;
    });
  }, [messages.length, onComplete]);

  const startMessageAnimation = useCallback(() => {
    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        handleVisibleLines();
      }
    }, 2000);

    timerRef.current = interval;
  }, [handleVisibleLines]);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      completedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setVisibleLines(0);
    completedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);

    const timeoutId = setTimeout(startMessageAnimation, 0);

    return () => {
      clearTimeout(timeoutId);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [messages, onComplete, startMessageAnimation]);

  useEffect(() => {
    if (terminalContentRef.current) {
      const { scrollTop } = terminalContentRef.current;
      if (scrollTop < lastScrollPositionRef.current) {
        terminalContentRef.current.scrollTop = lastScrollPositionRef.current;
      }
    }
  }, [commandHistory]);

  useEffect(() => {
    isPausedRef.current = isHovered;
    setIsInteractive(isHovered);
  }, [isHovered]);

  const handleScroll = () => {
    if (terminalContentRef.current) {
      lastScrollPositionRef.current = terminalContentRef.current.scrollTop;
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const command = commands.find((c) => c.name === trimmedCmd);

    if (terminalContentRef.current) {
      lastScrollPositionRef.current = terminalContentRef.current.scrollTop;
    }

    setCommandHistory((prev) => [
      ...prev,
      `> ${cmd}`,
      command ? command.action() : 'Command not found. Type "help" for available commands.',
    ]);
    setInputValue('');
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className="flex h-[530px] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-shrink-0 items-center border-b border-gray-700/50 bg-gray-800/90 px-4 py-3">
        <div className="flex gap-2">
          <motion.div
            className="group relative h-3.5 w-3.5 cursor-pointer rounded-full bg-gray-400/90"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
          </motion.div>
          <motion.div
            className="group relative h-3.5 w-3.5 cursor-pointer rounded-full bg-gray-500/90"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Minus className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
          </motion.div>
          <motion.div
            className="group relative h-3.5 w-3.5 cursor-pointer rounded-full bg-gray-600/90"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Square className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
          </motion.div>
        </div>
        <span className="ml-4 font-mono text-lg font-medium text-gray-200">
          <span className="hidden sm:inline">dash-auth-terminal</span>
          <span className="inline sm:hidden">terminal</span>
        </span>
      </div>

      <div
        ref={terminalContentRef}
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50 flex-1 space-y-2 overflow-y-auto p-6 font-mono text-base transition-colors [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-800/50 [&::-webkit-scrollbar]:w-2.5"
      >
        <AnimatePresence>
          {messages
            ?.slice(0, visibleLines)
            .map((message, index) => (
              <TerminalLine key={`msg-${message}-${index}`} text={message} index={index} />
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {commandHistory.map((line, index) => (
            <TerminalLine key={`cmd-${line}-${index}`} text={line} index={index} isCommand={true} />
          ))}
        </AnimatePresence>

        {isInteractive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-3 text-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-green-400" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  handleCommand(inputValue);
                }
              }}
              className="flex-1 border-none bg-transparent font-mono text-base text-gray-100 placeholder-gray-500 outline-none"
              placeholder="Type 'help' for available commands..."
              autoFocus
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
