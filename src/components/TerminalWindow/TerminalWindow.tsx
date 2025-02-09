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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);
  const isPausedRef = useRef(false);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const lastScrollPositionRef = useRef(0);

  // Add a key to force reset when messages change
  const messagesKey = JSON.stringify(messages);

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

    // Small delay before starting new animation
    const timeoutId = setTimeout(startMessageAnimation, 300);

    return () => {
      clearTimeout(timeoutId);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [messagesKey, startMessageAnimation]);

  useEffect(() => {
    if (terminalContentRef.current) {
      const { scrollTop } = terminalContentRef.current;
      if (scrollTop < lastScrollPositionRef.current) {
        terminalContentRef.current.scrollTop = lastScrollPositionRef.current;
      }
    }
  }, [commandHistory]);

  useEffect(() => {
    isPausedRef.current = isInteractive;
  }, [isInteractive]);

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
    <section
      aria-label="Terminal window"
      className="flex h-[530px] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-gray-900/95 shadow-2xl backdrop-blur-md dark:border-gray-300/50 dark:bg-white/95"
    >
      <header className="flex flex-shrink-0 items-center border-b border-gray-700/50 bg-gray-800/90 px-4 py-3 dark:border-gray-300/50 dark:bg-gray-100/90">
        <div className="flex gap-2">
          <button
            aria-label="Close terminal"
            className="group relative h-3.5 w-3.5 cursor-pointer rounded-full bg-gray-400/90 transition-transform hover:scale-110 dark:bg-gray-600/90"
            onClick={() => {
              /* Add close handler */
            }}
          >
            <X className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
          </button>
          <button
            aria-label="Minimize terminal"
            className="group relative h-3.5 w-3.5 cursor-pointer rounded-full bg-gray-500/90 transition-transform hover:scale-110 dark:bg-gray-500/90"
            onClick={() => {
              /* Add minimize handler */
            }}
          >
            <Minus className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
          </button>
          <button
            aria-label="Maximize terminal"
            className="group relative h-3.5 w-3.5 cursor-pointer rounded-full bg-gray-600/90 transition-transform hover:scale-110 dark:bg-gray-400/90"
            onClick={() => {
              /* Add maximize handler */
            }}
          >
            <Square className="absolute inset-0 h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-50" />
          </button>
        </div>
        <span className="ml-4 font-mono text-lg font-medium text-gray-200 dark:text-gray-800">
          <span className="hidden sm:inline">dash-auth-terminal</span>
          <span className="inline sm:hidden">terminal</span>
        </span>
      </header>

      <div
        ref={terminalContentRef}
        role="log"
        aria-live="polite"
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50 hover:scrollbar-thumb-gray-500/50 dark:scrollbar-track-gray-200/50 dark:scrollbar-thumb-gray-400/50 dark:hover:scrollbar-thumb-gray-500/50 flex-1 space-y-2 overflow-y-auto p-6 font-mono text-base transition-colors [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-400/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-800/50 dark:[&::-webkit-scrollbar-track]:bg-gray-200/50 [&::-webkit-scrollbar]:w-2.5"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={messagesKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {messages
              ?.slice(0, visibleLines)
              .map((message, index) => (
                <TerminalLine key={`msg-${message}-${index}`} text={message} index={index} />
              ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {commandHistory.map((line, index) => (
            <TerminalLine key={`cmd-${line}-${index}`} text={line} index={index} isCommand={true} />
          ))}
        </AnimatePresence>

        {isInteractive && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputValue.trim()) {
                handleCommand(inputValue);
              }
            }}
            className="mt-4 flex items-center gap-3 text-gray-100 dark:text-gray-800"
          >
            <ChevronRight
              aria-hidden="true"
              className="h-5 w-5 text-green-400 dark:text-green-500"
            />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsInteractive(true)}
              onBlur={(e) => {
                // Only set interactive to false if we're not clicking inside the terminal
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsInteractive(false);
                }
              }}
              aria-label="Terminal input"
              className="flex-1 border-none bg-transparent font-mono text-base text-gray-100 antialiased placeholder-gray-500/70 outline-none dark:text-gray-800 dark:placeholder-gray-400/70"
              placeholder="Type 'help' for available commands..."
              autoFocus
            />
          </form>
        )}
      </div>
    </section>
  );
};

export default TerminalWindow;
