import React, { useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { AuthStat, contentVariants } from '../../Tooltip/Tooltip';

interface DataPoint {
  time: string;
  value: number;
  successRate?: number;
}

export interface StatsCardProps {
  stat: AuthStat;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const generatePreviousPeriodData = (currentData: DataPoint[]): DataPoint[] => {
  return currentData.map((point) => ({
    ...point,
    value: Math.floor(point.value * (0.85 + Math.random() * 0.3)),
    successRate: point.successRate
      ? Math.max(99.8, point.successRate * (0.998 + Math.random() * 0.004))
      : undefined,
  }));
};

const dummyPreviousPeriodData: DataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  value: Math.floor(2000 + Math.random() * 1000),
  successRate: 99.9 + Math.random() * 0.09,
}));

const CustomTooltipWrapper: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  const previousPeriodData = useMemo(() => generatePreviousPeriodData(dummyPreviousPeriodData), []);

  if (active && payload && payload.length > 0 && label) {
    const currentValue = payload[0]?.value;
    const previousValue = previousPeriodData[0]?.value ?? 0;

    if (currentValue === undefined) return null;

    const change = ((currentValue - previousValue) / (previousValue || 1)) * 100;
    const isIncrease = change > 0;

    return (
      <div
        style={{
          maxWidth: '400px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: document.documentElement.classList.contains('dark')
            ? '#FFFFFF'
            : '#1A1A1A',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: document.documentElement.classList.contains('dark') ? '#171717' : '#FFFFFF',
        }}
      >
        <div style={{ flex: '1', textAlign: 'left' }}>
          <div
            style={{
              fontSize: '12px',
              color: document.documentElement.classList.contains('dark') ? '#4B5563' : '#9CA3AF',
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>
            {currentValue.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#6B7280',
            }}
          >
            Previous: {previousValue.toLocaleString()}
          </div>
        </div>
        <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
          <div
            style={{
              fontSize: '14px',
              color: isIncrease ? '#22C55E' : '#EF4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {isIncrease ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Extract tooltip configuration type
interface TooltipConfig {
  text: string;
  position: { x: number; y: number };
}

// Add at the top with other utility functions
const createTooltipHandler =
  (onTooltipChange: (config: TooltipConfig | null) => void) =>
  (e: React.MouseEvent, text?: string) => {
    onTooltipChange(text ? { text, position: { x: e.clientX, y: e.clientY } } : null);
  };

// Extract header component
const StatsCardHeader: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  change: number;
  onTooltipChange: (config: TooltipConfig | null) => void;
}> = ({ icon: IconComponent, label, change, onTooltipChange }) => {
  const handleMouseEvent = createTooltipHandler(onTooltipChange);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <IconComponent className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
        <span className="text-sm text-zinc-400 dark:text-zinc-600">{label}</span>
      </div>
      <input
        type="button"
        value={`${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}%`}
        className={`text-sm font-medium ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        } flex cursor-pointer items-center gap-1`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => handleMouseEvent(e, '24h trend')}
        onMouseMove={(e) => handleMouseEvent(e, '24h trend')}
        onMouseLeave={() => handleMouseEvent({} as React.MouseEvent)}
        aria-label={`Change: ${change >= 0 ? 'Increase' : 'Decrease'} ${Math.abs(change)}%`}
        tabIndex={0}
      />
    </div>
  );
};

// Extract value display component
const ValueDisplay: React.FC<{
  value: number | string;
  description: string;
  onTooltipChange: (config: TooltipConfig | null) => void;
}> = ({ value, description, onTooltipChange }) => {
  const handleMouseEvent = createTooltipHandler(onTooltipChange);

  return (
    <motion.div
      className="mb-1 text-6xl font-bold text-white dark:text-zinc-900"
      onMouseEnter={(e) => handleMouseEvent(e, description)}
      onMouseMove={(e) => handleMouseEvent(e, description)}
      onMouseLeave={() => handleMouseEvent({} as React.MouseEvent)}
      whileHover={{
        textShadow: document.documentElement.classList.contains('dark')
          ? '0 0 8px rgba(0,0,0,0.5)'
          : '0 0 8px rgba(255,255,255,0.5)',
      }}
    >
      {value}
    </motion.div>
  );
};

// Extract graph component with proper typing
const StatsGraph: React.FC<{
  graphData: DataPoint[];
  label: string;
  index: number;
}> = ({ graphData, label, index }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={graphData} margin={{ left: 15, right: 10, top: 10, bottom: 0 }}>
      <defs>
        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="5%"
            stopColor={document.documentElement.classList.contains('dark') ? '#171717' : '#FFFFFF'}
            stopOpacity={0.3}
          />
          <stop
            offset="95%"
            stopColor={document.documentElement.classList.contains('dark') ? '#171717' : '#FFFFFF'}
            stopOpacity={0}
          />
        </linearGradient>
        <clipPath id={`clip-${index}`}>
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: 'easeInOut',
            }}
          />
        </clipPath>
      </defs>
      <XAxis
        dataKey="time"
        tick={{ fill: document.documentElement.classList.contains('dark') ? '#4B5563' : '#9CA3AF' }}
        interval={3}
      />
      <YAxis
        tick={{ fill: document.documentElement.classList.contains('dark') ? '#4B5563' : '#9CA3AF' }}
        width={45}
        tickFormatter={(value) => value.toLocaleString()}
        domain={label === 'Auth Success' ? [99.8, 100] : ['auto', 'auto']}
      />
      <Tooltip content={<CustomTooltipWrapper />} />
      <Area
        type="monotone"
        name={label === 'Auth Success' ? 'successRate' : 'value'}
        dataKey={label === 'Auth Success' ? 'successRate' : 'value'}
        stroke={document.documentElement.classList.contains('dark') ? '#171717' : '#FFFFFF'}
        fill={`url(#gradient-${index})`}
        strokeWidth={2}
        isAnimationActive={false}
        clipPath={`url(#clip-${index})`}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Extract details component
const AuthDetails: React.FC<{
  details: Array<{ reason: string; percentage: number }>;
}> = ({ details }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    className="mt-4 border-t border-zinc-800 pt-4 dark:border-zinc-200"
  >
    <p className="mb-2 text-sm text-zinc-400 dark:text-zinc-600">Authentication Failures</p>
    {details.map((detail) => (
      <div key={detail.reason} className="mb-1 flex justify-between text-sm">
        <span className="text-zinc-400 dark:text-zinc-600">{detail.reason}</span>
        <span className="text-white dark:text-zinc-900">{detail.percentage}%</span>
      </div>
    ))}
  </motion.div>
);

// Main StatsCard component with reduced complexity
const StatsCard: React.FC<StatsCardProps> = ({ stat, index, isExpanded, onToggle }) => {
  const handleTooltip = (config: TooltipConfig | null) => {
    console.log('Tooltip:', config);
  };

  useEffect(() => {
    if (isExpanded) {
      onToggle();
    }
  }, [isExpanded, onToggle]);

  return (
    <motion.div
      layout
      className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#1A1A1A] dark:border-zinc-200 dark:bg-white"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <button
        onClick={onToggle}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-zinc-700 dark:focus:ring-zinc-300"
        aria-expanded={isExpanded}
        aria-label={`Show ${isExpanded ? 'value' : 'graph'} for ${stat.label}`}
      >
        <div className="space-y-4">
          <StatsCardHeader
            icon={stat.icon}
            label={stat.label}
            change={stat.change}
            onTooltipChange={handleTooltip}
          />

          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={isExpanded} mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="value"
                  custom={isExpanded}
                  variants={contentVariants.value}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="py-2 text-center"
                >
                  <ValueDisplay
                    value={stat.value}
                    description={stat.description}
                    onTooltipChange={handleTooltip}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="graph"
                  custom={isExpanded}
                  variants={contentVariants.graph}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="h-32"
                >
                  <StatsGraph graphData={stat.graphData} label={stat.label} index={index} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isExpanded && stat.label === 'Auth Success' && stat.details && (
            <AuthDetails details={stat.details} />
          )}
        </div>
      </button>
    </motion.div>
  );
};

export default StatsCard;
