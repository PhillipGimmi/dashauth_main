// DashboardSection.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import DashboardHeader from '../../DashboardHeader/DashboardHeader';
import { authStats } from '../../Tooltip/Tooltip';
import StatsGrid from '../../VisualDataComponents/StatsGrid/StatsGrid';
import ChartsGrid from '../../VisualDataComponents/ChartsGrid/ChartsGrid';

const DashboardSection: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [showComponents, setShowComponents] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setShowComponents(false);
      const timer = setTimeout(() => setShowComponents(true), 50);
      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) return null;

  return (
    <div className="relative w-full py-20">
      <div className="absolute inset-0 bg-black dark:bg-white" style={{ opacity: 0.95 }} />
      <div className="relative mx-auto max-w-7xl space-y-16 px-4">
        <DashboardHeader />
        {showComponents && (
          <>
            <StatsGrid stats={authStats} />
            <ChartsGrid />
          </>
        )}
        <div className="mt-16 text-center">
          <Link
            href="/signin"
            className="text-zinc-300 transition-colors hover:text-white dark:text-zinc-700 dark:hover:text-black"
          >
            Discover more insights in your full dashboard...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
