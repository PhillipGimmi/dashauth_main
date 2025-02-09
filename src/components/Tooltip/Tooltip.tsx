// auth-utils.tsx

import React from 'react';
import { createPortal } from 'react-dom';
import { Users, Shield, Zap, LucideIcon } from 'lucide-react';

// Types
export interface CustomTooltipProps {
  text: string;
  mousePosition: { x: number; y: number };
}

export interface DataPoint {
  time: string;
  value: number;
  successRate?: number;
}

export interface AuthStat {
  label: string;
  value: string;
  change: number;
  icon: LucideIcon;
  description: string;
  graphData: DataPoint[];
  details?: Array<{ reason: string; percentage: number }>;
}

// Animation variants
export const contentVariants = {
  value: {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    }, // Corrected closing brace
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  },
  graph: {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    }, // Corrected closing brace
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  },
};

// Components
export const CustomTooltip: React.FC<CustomTooltipProps> = ({ text, mousePosition }) => {
  if (!mousePosition) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed z-50 rounded-lg border border-zinc-800 bg-[#1A1A1A] px-3
                     py-2 text-sm text-zinc-400 shadow-lg dark:border-zinc-200 dark:bg-white dark:text-zinc-600"
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        maxWidth: 200,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {text}
    </div>,
    document.body
  );
};

// Sample data
export const generate24HourData = (): DataPoint[] => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    const isBusinessHour = i >= 9 && i <= 17;
    const baseLogins = isBusinessHour ? 2500 : 800;
    const variance = isBusinessHour ? 500 : 200;

    return {
      time: `${hour}:00`,
      value: Math.floor(baseLogins + Math.random() * variance),
      successRate: 99.9 + Math.random() * 0.09,
    };
  });

  return hours;
};

export const authStats: AuthStat[] = [
  {
    label: 'Active Sessions',
    value: '5,847',
    change: 12.3,
    icon: Users,
    description: 'Currently authenticated users',
    graphData: generate24HourData(),
  },
  {
    label: 'Auth Success',
    value: '99.95%',
    change: 0.03,
    icon: Shield,
    description: 'Authentication success rate in last 24h',
    graphData: generate24HourData(),
    details: [
      { reason: 'Invalid Credentials', percentage: 45 },
      { reason: '2FA Failed', percentage: 30 },
      { reason: 'Token Expired', percentage: 15 },
      { reason: 'Rate Limited', percentage: 10 },
    ],
  },
  {
    label: 'Auth Rate',
    value: '2,134/min',
    change: 8.4,
    icon: Zap,
    description: 'Authentication requests per minute',
    graphData: generate24HourData(),
  },
];
