import React, { useState, useMemo } from 'react';
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
import { AuthStat, contentVariants, CustomTooltip } from '../../Tooltip/Tooltip';

interface DataPoint {
  time: string;
  value: number;
  successRate?: number;
}

export interface StatsCardProps {
  stat: AuthStat;
  index: number;
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
          backgroundColor: '#1A1A1A',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: '#FFFFFF',
        }}
      >
        <div style={{ flex: '1', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{label}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0' }}>
            {currentValue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
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

const StatsCard: React.FC<StatsCardProps> = ({ stat, index }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [tooltipConfig, setTooltipConfig] = useState<{
    text: string;
    position: { x: number; y: number };
  } | null>(null);
  const [[page, direction], setPage] = useState([0, 0]);

  const handleMouseEnter = (e: React.MouseEvent, text: string) => {
    setTooltipConfig({ text, position: { x: e.clientX, y: e.clientY } });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltipConfig) {
      setTooltipConfig({
        ...tooltipConfig,
        position: { x: e.clientX, y: e.clientY },
      });
    }
  };

  const toggleView = () => {
    setTooltipConfig(null);
    setPage([page === 0 ? 1 : 0, page === 0 ? 1 : -1]);
    setShowGraph(!showGraph);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltipConfig(null);
  };

  const IconComponent = stat.icon;

  return (
    <motion.div
      layout
      className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-[#1A1A1A]"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <button
        onClick={toggleView}
        onKeyDown={(e) => e.key === 'Enter' && toggleView()}
        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-zinc-700"
        aria-expanded={showGraph}
        aria-label={`Show ${showGraph ? 'value' : 'graph'} for ${stat.label}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <IconComponent className="h-5 w-5 text-zinc-400" />
              <span className="text-sm text-zinc-400">{stat.label}</span>
            </div>
            <input
              type="button"
              value={`${stat.change >= 0 ? '▲' : '▼'} ${Math.abs(stat.change)}%`}
              className={`text-sm font-medium ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'} flex cursor-pointer items-center gap-1`}
              onClick={handleClick}
              onMouseEnter={(e) => handleMouseEnter(e, '24h trend')}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setTooltipConfig(null)}
              aria-label={`Change: ${stat.change >= 0 ? 'Increase' : 'Decrease'} ${Math.abs(stat.change)}%`}
              tabIndex={0}
            />
          </div>
          <div className="relative overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {!showGraph ? (
                <motion.div
                  key="value"
                  custom={direction}
                  variants={contentVariants.value}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="py-2 text-center"
                  onMouseLeave={() => setTooltipConfig(null)}
                >
                  <motion.div
                    className="mb-1 text-6xl font-bold text-white"
                    onMouseEnter={(e) => handleMouseEnter(e, stat.description)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setTooltipConfig(null)}
                    whileHover={{ textShadow: '0 0 8px rgba(255,255,255,0.5)' }}
                  >
                    {stat.value}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="graph"
                  custom={direction}
                  variants={contentVariants.graph}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="h-32"
                  onMouseEnter={() => setTooltipConfig(null)}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stat.graphData}
                      margin={{ left: 15, right: 10, top: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
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
                      <XAxis dataKey="time" tick={{ fill: '#9CA3AF' }} interval={3} />
                      <YAxis
                        tick={{ fill: '#9CA3AF' }}
                        width={45}
                        tickFormatter={(value) => value.toLocaleString()}
                        domain={stat.label === 'Auth Success' ? [99.8, 100] : ['auto', 'auto']}
                      />
                      <Tooltip content={<CustomTooltipWrapper />} />
                      <Area
                        type="monotone"
                        name={stat.label === 'Auth Success' ? 'successRate' : 'value'}
                        dataKey={stat.label === 'Auth Success' ? 'successRate' : 'value'}
                        stroke="#FFFFFF"
                        fill={`url(#gradient-${index})`}
                        strokeWidth={2}
                        isAnimationActive={false}
                        clipPath={`url(#clip-${index})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {showGraph && stat.label === 'Auth Success' && stat.details && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 border-t border-zinc-800 pt-4"
            >
              <p className="mb-2 text-sm text-zinc-400">Authentication Failures</p>
              {stat.details.map((detail, idx) => (
                <div key={idx} className="mb-1 flex justify-between text-sm">
                  <span className="text-zinc-400">{detail.reason}</span>
                  <span className="text-white">{detail.percentage}%</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
        {tooltipConfig && (
          <CustomTooltip text={tooltipConfig.text} mousePosition={tooltipConfig.position} />
        )}
      </button>
    </motion.div>
  );
};

export default StatsCard;
