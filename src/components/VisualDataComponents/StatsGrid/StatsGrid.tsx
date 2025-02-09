// StatsGrid.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../StatsCard/StatsCard';
import { AuthStat } from '../../Tooltip/Tooltip';
import { useCardStore } from '@/stores/cardStore';
import { useTheme } from '@/context/ThemeContext';

export interface StatsGridProps {
  stats: AuthStat[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const [expandedCards, setExpandedCards] = useState<boolean[]>(
    new Array(stats.length).fill(false)
  );

  const { onCollapseAll } = useCardStore();
  const { theme } = useTheme();

  // Listen for theme changes to collapse cards
  useEffect(() => {
    setExpandedCards(new Array(stats.length).fill(false));
  }, [theme, stats.length]);

  // Listen for collapse all events
  useEffect(() => {
    const handleCollapse = () => {
      setExpandedCards(new Array(stats.length).fill(false));
    };

    // Just call onCollapseAll and handle collapse
    onCollapseAll();
    handleCollapse();
  }, [onCollapseAll, stats.length]);

  const toggleCard = (index: number) => {
    setExpandedCards((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 dark:text-black md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
          }}
        >
          <StatsCard
            stat={stat}
            index={index}
            isExpanded={expandedCards[index]}
            onToggle={() => toggleCard(index)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
