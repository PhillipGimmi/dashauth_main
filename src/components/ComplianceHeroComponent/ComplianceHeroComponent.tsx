import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';

type ComplianceInfo = {
  [key: string]: {
    description: string;
    relevance: string;
  };
};

interface ComplianceStandardProps {
  standard: string;
  isExpanded: boolean;
  onToggle: () => void;
}

interface ComplianceSectionProps {
  standards: string[];
}

export const complianceInfo: ComplianceInfo = {
  'ISO 27001': {
    description: 'International security management standard',
    relevance:
      'Our authentication system automatically implements required access controls and provides audit-ready compliance reporting.',
  },
  'SOC 2': {
    description: 'Service organization security and privacy standard',
    relevance:
      'Built-in security monitoring and access controls help maintain SOC 2 compliance with automated audit trails.',
  },
  GDPR: {
    description: 'EU data protection and privacy regulation',
    relevance:
      'Our authentication handles user consent and data access controls in compliance with GDPR requirements.',
  },
  HIPAA: {
    description: 'Healthcare data privacy and security standard',
    relevance:
      'Pre-configured healthcare authentication workflows ensure HIPAA-compliant access control and audit logging.',
  },
  HITECH: {
    description: 'Healthcare technology security requirements',
    relevance:
      'Our system provides the required technical safeguards and breach notification capabilities.',
  },
  'PCI DSS': {
    description: 'Payment card industry security standard',
    relevance:
      'Authentication controls and session management align with PCI DSS requirements for secure access.',
  },
  CCPA: {
    description: 'California Consumer Privacy Act standard',
    relevance: 'Built-in consent management and access controls help maintain CCPA compliance.',
  },
};

const ComplianceStandard: React.FC<ComplianceStandardProps> = ({
  standard,
  isExpanded,
  onToggle,
}) => {
  const info = complianceInfo[standard];
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    if (Math.abs(swipeDistance) < 5) {
      handleClick();
    }
  };

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
    onToggle();
  };

  return (
    <motion.div
      layout
      className={`relative ${isExpanded ? 'col-span-full w-full' : ''}`}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        layout
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="group relative transform cursor-pointer touch-manipulation overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition-transform duration-100 hover:scale-[0.99] active:scale-[0.98] md:hover:scale-[0.99] md:active:scale-[0.98]"
      >
        <div className="hidden md:block">
          {!isExpanded && (
            <>
              <div className="absolute inset-0 -translate-x-[101%] transform bg-white/50 transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <div className="absolute inset-0 -translate-x-[101%] transform bg-white/50 transition-transform delay-75 duration-500 ease-out group-hover:translate-x-0" />
              <div className="absolute inset-0 -translate-x-[101%] transform bg-white transition-transform delay-150 duration-500 ease-out group-hover:translate-x-0" />
            </>
          )}
        </div>

        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-150 active:opacity-100 md:hidden" />

        <AnimatePresence>
          {isAnimating && (
            <>
              <motion.div
                className="absolute inset-0 bg-white/50"
                initial={{ x: '-101%' }}
                animate={{ x: '101%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 bg-white/50"
                initial={{ x: '-101%' }}
                animate={{ x: '101%' }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.1 }}
              />
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-101%' }}
                animate={{ x: '101%' }}
                transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.2 }}
              />
            </>
          )}
        </AnimatePresence>

        <motion.div layout className="relative z-10 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <motion.p
              layout
              className={`
                        text-base font-light text-white transition-colors duration-300 md:text-xl
                        ${isExpanded ? '' : 'active:text-black md:active:text-white md:group-hover:text-black'}
                    `}
            >
              {standard}
            </motion.p>

            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className={`
                  text-white transition-colors duration-300 md:hidden
                  ${isExpanded ? 'text-white' : 'active:text-black'}
                `}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 grid grid-cols-1 gap-4 overflow-hidden md:mt-6 md:gap-6 lg:grid-cols-2"
              >
                <div>
                  <h3 className="mb-2 text-xs uppercase tracking-wider text-white/80 md:text-sm">
                    About
                  </h3>
                  <p className="text-sm text-white/70 md:text-lg">{info.description}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-xs uppercase tracking-wider text-white/80 md:text-sm">
                    How We Help
                  </h3>
                  <p className="text-sm text-white/70 md:text-lg">{info.relevance}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ComplianceHeroComponent: React.FC<ComplianceSectionProps> = ({ standards }) => {
  const [activeStandard, setActiveStandard] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStandardToggle = (standard: string) => {
    if (isTransitioning) return;

    if (activeStandard && activeStandard !== standard) {
      setIsTransitioning(true);
      setActiveStandard(null);

      setTimeout(() => {
        setActiveStandard(standard);
        setIsTransitioning(false);
      }, 900);
    } else {
      setActiveStandard(activeStandard === standard ? null : standard);
    }
  };

  return (
    <motion.div
      className="max-w-[900px] overflow-hidden rounded-xl border border-gray-800 bg-black/85 p-4 backdrop-blur-sm md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseLeave={() => !isTransitioning && window.innerWidth >= 768 && setActiveStandard(null)}
    >
      <h2 className="mb-4 flex items-center gap-2 text-lg font-light text-white sm:text-xl md:mb-8 md:gap-3 md:text-3xl">
        <Shield className="h-5 w-5 text-white md:h-8 md:w-8" />
        Compliance Standards
      </h2>

      <motion.div layout className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {standards.map((standard) => (
          <motion.div
            key={standard}
            layout
            className={`${activeStandard === standard ? 'order-first col-span-full w-full' : ''}`}
          >
            <ComplianceStandard
              standard={standard}
              isExpanded={activeStandard === standard}
              onToggle={() => handleStandardToggle(standard)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ComplianceHeroComponent;
