// DashboardSection.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import DashboardHeader from '../../DashboardHeader/DashboardHeader';
import { authStats } from '../../Tooltip/Tooltip';
import StatsGrid from '../../VisualDataComponents/StatsGrid/StatsGrid';
import ChartsGrid from '../../VisualDataComponents/ChartsGrid/ChartsGrid';

const DashboardSection: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        busy loading ....
      </div>
    );
  }

  return (
    <section className="relative w-full py-20">
      <div className="absolute inset-0 bg-black" style={{ opacity: 0.95 }} />
      <div className="relative mx-auto max-w-7xl space-y-16 px-4">
        <DashboardHeader />
        <StatsGrid stats={authStats} />
        <ChartsGrid />
        <div className="mt-16 text-center">
          <Link href="/signin" className="text-zinc-300 transition-colors hover:text-white">
            Discover more insights in your full dashboard...
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
