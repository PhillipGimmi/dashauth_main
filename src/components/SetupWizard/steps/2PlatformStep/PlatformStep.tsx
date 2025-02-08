import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, ChevronDown, ChevronUp, X } from 'lucide-react';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { StepHeader } from '../../StepHeader/StepHeader';
import { SETUP_OPTIONS } from '@/constants/constants';
import { FAQ_ITEMS } from '@/data/faqData';
import { MousePosition, SetupOption } from '@/types/types';

export interface PlatformStepProps {
  mousePositions: Record<string, MousePosition>;
  setMousePositions: React.Dispatch<React.SetStateAction<Record<string, MousePosition>>>;
  selectedOption: SetupOption['id'] | null;
  onSelect: (optionId: SetupOption['id']) => void;
  previousDomain: string;
  onBack?: () => Promise<void>;
}

export const PlatformStep: React.FC<PlatformStepProps> = ({
  mousePositions,
  setMousePositions,
  selectedOption,
  onSelect,
  previousDomain,
  onBack,
}) => {
  const [isHovering, setIsHovering] = useState<Record<string, boolean>>({});
  const [showFAQ, setShowFAQ] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(selectedOption);

  useEffect(() => {
    const fetchCurrentPlatform = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
          .from('client_applications')
          .select('platform_type')
          .eq('domain', previousDomain)
          .maybeSingle();

        if (error) {
          throw new Error('Failed to fetch platform info');
        }

        if (data?.platform_type) {
          setCurrentPlatform(data.platform_type);
          if (!selectedOption) {
            onSelect(data.platform_type);
          }
        }
      } catch (error) {
        console.error('Failed to fetch platform:', error);
      } finally {
        setHasLoaded(true);
      }
    };

    void fetchCurrentPlatform();
  }, [previousDomain, selectedOption, onSelect]);

  const handleMouseMove = (optionId: SetupOption['id'], e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePositions((prev) => ({
      ...prev,
      [optionId]: {
        x: (e.clientX ?? 0) - (rect.left ?? 0),
        y: (e.clientY ?? 0) - (rect.top ?? 0),
      },
    }));
    setIsHovering((prev) => ({ ...prev, [optionId]: true }));
  };

  const handleMouseLeave = (optionId: SetupOption['id']) => {
    setTimeout(() => {
      setIsHovering((prev) => ({ ...prev, [optionId]: false }));
      setMousePositions((prev) => {
        const newPositions = { ...prev };
        delete newPositions[optionId];
        return newPositions;
      });
    }, 300);
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs((prev) =>
      prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]
    );
  };

  const filteredFAQs = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.includes(searchQuery.toLowerCase()))
  );

  const handlePlatformSelect = async (platformId: SetupOption['id']) => {
    setCurrentPlatform(platformId);
    onSelect(platformId);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 text-white dark:bg-white dark:text-black">
      <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <StepHeader
          title="Choose Your Platform"
          subtitle="Select the type of application you're building"
          backLabel={previousDomain}
          showHelp={showFAQ}
          onBack={onBack}
          onHelp={() => setShowFAQ(!showFAQ)}
        />

        <motion.div
          initial="hidden"
          animate={hasLoaded ? 'visible' : 'hidden'}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="mt-8 grid w-full grid-cols-1 gap-6 md:grid-cols-2"
        >
          {SETUP_OPTIONS.map((option, index) => {
            const Icon = option.icon;
            const isHovered = isHovering[option.id];
            const isSelected = selectedOption === option.id;
            const isCurrent = currentPlatform === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => handlePlatformSelect(option.id)}
                onMouseMove={(e) => handleMouseMove(option.id, e)}
                onMouseLeave={() => handleMouseLeave(option.id)}
                whileHover={{ translateY: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ delay: 0.2 * (index + 1) }}
                className={`relative w-full overflow-hidden rounded-xl border p-6 ${
                  isSelected || isCurrent
                    ? 'border-white bg-zinc-900/50 dark:border-black dark:bg-gray-50'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 dark:border-gray-200 dark:bg-white dark:hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg p-3 ${
                      isSelected || isCurrent
                        ? 'bg-white text-black dark:bg-black dark:text-white'
                        : 'bg-zinc-800 group-hover:bg-zinc-700 dark:bg-gray-100 dark:group-hover:bg-gray-200'
                    } transition-colors`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-white dark:text-gray-900">
                      {option.title}
                      {isCurrent && !isSelected && (
                        <span className="ml-2 text-sm text-blue-400">(Current)</span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400 dark:text-gray-500">
                      {option.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`h-5 w-5 text-zinc-400 transition-transform dark:text-gray-400 ${
                      isSelected || isCurrent ? 'translate-x-1' : ''
                    }`}
                  />
                </div>

                {isHovered && mousePositions[option.id] && (
                  <motion.div
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      background: `
                        radial-gradient(400px circle at ${mousePositions[option.id].x}px ${
                          mousePositions[option.id].y
                        }px, rgba(59, 130, 246, 0.1), transparent 40%),
                        radial-gradient(800px circle at ${mousePositions[option.id].x}px ${
                          mousePositions[option.id].y
                        }px, rgba(59, 130, 246, 0.05), transparent 40%)
                      `,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {showFAQ && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto border-l border-zinc-800 bg-zinc-950 dark:border-gray-200 dark:bg-white sm:w-[480px]"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
              className="space-y-4 p-6"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex items-center justify-between"
              >
                <h2 className="text-xl font-bold text-white dark:text-gray-900">
                  Which do you choose
                </h2>
                <button
                  onClick={() => setShowFAQ(false)}
                  className="p-2 text-zinc-400 transition-colors hover:text-white dark:text-gray-400 dark:hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-m text-center font-bold text-white dark:text-gray-900"
              >
                Type your language, library or framework in search to narrow down options
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-zinc-400 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none dark:border-gray-200 dark:bg-gray-50 dark:text-gray-900 dark:placeholder-gray-400"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="space-y-2"
              >
                {filteredFAQs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ delay: 0.2 }}
                    className="overflow-hidden rounded-lg border border-zinc-800 dark:border-gray-200"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-zinc-800/50 dark:hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-white dark:text-gray-900">
                        {faq.question}
                      </h3>
                      {expandedFAQs.includes(faq.id) ? (
                        <ChevronUp className="h-4 w-4 text-zinc-400 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-400 dark:text-gray-400" />
                      )}
                    </button>
                    {expandedFAQs.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-zinc-800 p-4 text-zinc-400 dark:bg-gray-50 dark:text-gray-500">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlatformStep;
