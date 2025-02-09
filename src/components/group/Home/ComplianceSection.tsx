'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { WebGLBackground } from '../../WarpBackground/WarpBackground';
import { frameworks, Framework } from '@/data/complianceFrameworks';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isExpanded: boolean;
}

const Card = ({ children, className = '', onClick, isExpanded }: CardProps) => (
  <motion.div
    layout
    onClick={onClick}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' },
    }}
    className={`
      rounded-2xl border backdrop-blur-sm transition-all
      duration-500
      ${
        isExpanded
          ? 'border-zinc-200 bg-white/95 text-black dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-white'
          : 'border-zinc-800 bg-black/95 text-white dark:border-zinc-300 dark:bg-white/95 dark:text-black'
      }
      hover:border-zinc-600 hover:shadow-[0_0_50px_rgba(255,255,255,0.15)]
      hover:backdrop-blur-xl dark:hover:border-zinc-400
      dark:hover:shadow-[0_0_50px_rgba(0,0,0,0.15)]
      ${className}
    `}
  >
    {children}
  </motion.div>
);

interface FrameworkCardProps {
  framework: Framework;
  isExpanded: boolean;
  onClick: () => void;
}

const FrameworkCard = ({ framework, isExpanded, onClick }: FrameworkCardProps) => {
  const Icon = framework.icon;

  return (
    <Card
      isExpanded={isExpanded}
      onClick={onClick}
      className="group h-full cursor-pointer p-6 transition-colors hover:border-zinc-700"
    >
      <div className="mb-4 flex items-start justify-between">
        <Icon className="h-8 w-8" />
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-6 w-6 opacity-50 transition-opacity group-hover:opacity-100" />
        </motion.div>
      </div>

      <h3 className="mb-2 text-2xl font-semibold">{framework.name}</h3>
      <p
        className={`mb-6 ${
          isExpanded ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600'
        }`}
      >
        {framework.description}
      </p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
              <h4 className="mb-2 font-semibold">Why It Matters</h4>
              <p className="mb-4 text-zinc-700 dark:text-zinc-300">{framework.businessValue}</p>

              <h4 className="mb-2 font-semibold">Key Requirements</h4>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {framework.requirements.map((req) => (
                  <li
                    key={req.id}
                    className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{req.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className={`space-y-3 ${isExpanded ? 'hidden' : 'block'}`}>
        {framework.features.map((feature) => (
          <motion.li key={feature.id} className="flex items-start gap-3">
            <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <span
              className={
                isExpanded ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-300 dark:text-zinc-700'
              }
            >
              {feature.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </Card>
  );
};

const ComplianceSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  const handleCardClick = (id: string): void => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="relative w-full overflow-hidden bg-black/95 py-32 dark:bg-white/95">
      <WebGLBackground />
      <div className="bg-grid-white/[0.05] dark:bg-grid-black/[0.05] pointer-events-none absolute inset-0 z-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="relative z-20 mx-auto max-w-7xl px-4"
      >
        <motion.div variants={itemVariants} className="mb-20 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white dark:text-black md:text-5xl lg:text-6xl">
            Enterprise-Grade Compliance
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-zinc-400 dark:text-zinc-600 md:text-xl">
            One integrated solution for all your compliance needs. Automatic reporting, continuous
            monitoring, and real-time dashboards included.
          </p>
        </motion.div>

        <div className="mb-20 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {frameworks.map((framework) => (
            <motion.div key={framework.id} variants={itemVariants} layout className="h-full">
              <FrameworkCard
                framework={framework}
                isExpanded={expandedId === framework.id}
                onClick={() => handleCardClick(framework.id)}
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="text-center">
          <h3 className="mb-8 text-xl font-semibold text-white dark:text-black">
            Additional Compliance Coverage
          </h3>
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-4">
            {[
              'ISO 27001',
              'California Privacy Protection (CCPA)',
              'POPIA',
              'NIST',
              'FedRAMP',
              'FINRA',
              'PCI DSS',
              'FERPA',
              'APPI',
            ].map((standard) => (
              <motion.div
                key={standard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border border-zinc-800 px-6
                          py-3 text-zinc-400 backdrop-blur-sm transition-colors
                          hover:border-zinc-600 hover:text-white
                          hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:backdrop-blur-xl
                          dark:border-zinc-300 dark:text-zinc-600
                          dark:hover:border-zinc-400
                          dark:hover:text-black
                          dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.15)]"
              >
                {standard}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ComplianceSection;
