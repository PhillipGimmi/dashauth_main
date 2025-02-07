import React, { useState, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import GraphTooltip from './GraphTooltip';
import TooltipSection from './TooltipSection';

type TimeRangeType = '24h' | '7d' | '30d' | '90d';

interface DataPoint {
  time: string;
  users: number;
  logins: number;
}

interface ActivityChartProps {
  userColor?: string;
  loginColor?: string;
  axisColor?: string;
  cursorColor?: string;
  data: DataPoint[];
  timeRange: TimeRangeType;
}

interface PercentageDisplayProps {
  onClick: () => void;
  percentageChange: string;
  tooltipText: string;
}

const PercentageDisplay: React.FC<PercentageDisplayProps> = ({
  onClick,
  percentageChange,
  tooltipText,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const getTrendColor = () => {
    if (percentageChange.includes('▲')) return 'text-green-400';
    if (percentageChange.includes('▼')) return 'text-red-400';
    if (percentageChange.includes('→')) return 'text-white';
    return 'text-white'; // Default case
  };

  return (
    <>
      <button
        onClick={onClick}
        className={`text-2xl font-semibold ${getTrendColor()}`}
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseMove={handleMouseMove}
      >
        {percentageChange}
      </button>
      <TooltipSection
        tooltipText={tooltipText}
        mousePosition={mousePosition}
        isVisible={showTooltip}
      />
    </>
  );
};

const ActivityChart: React.FC<ActivityChartProps> = ({
  userColor = '#FFFFFF',
  loginColor = '#00FF00',
  axisColor = '#FFFFFF',
  cursorColor = '#FFFFFF',
  data,
  timeRange = '24h',
}) => {
  const [hoveredKey, setHoveredKey] = useState<'users' | 'logins' | null>(null);
  const [displayMode, setDisplayMode] = useState<'users' | 'logins'>('users');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTotalTooltip, setShowTotalTooltip] = useState(false);

  const timeRangeMap: { [key in TimeRangeType]: number } = {
    '24h': 24,
    '7d': 168,
    '30d': 720,
    '90d': 2160,
  };

  const dataLength = timeRangeMap[timeRange] || timeRangeMap['24h'];

  const previousPeriodData = data.slice(0, dataLength).map((point) => {
    const userReduction = 0.7 + Math.random() * 0.15;
    const loginReduction = 0.65 + Math.random() * 0.15;

    return {
      time: point.time,
      users: Math.floor(point.users * userReduction),
      logins: Math.floor(point.logins * loginReduction),
    };
  });

  const currentPeriodData = data.slice(dataLength, dataLength * 2);

  const totalCurrentUsers = currentPeriodData[currentPeriodData.length - 1]?.users || 0;
  const totalPreviousUsers = previousPeriodData[previousPeriodData.length - 1]?.users || 0;
  const totalPreviousLogins = previousPeriodData.reduce((acc, curr) => acc + curr.logins, 0);
  const totalCurrentLogins = currentPeriodData.reduce((acc, curr) => acc + curr.logins, 0);

  const getDisplayTotal = useCallback(() => {
    if (hoveredKey) {
      return hoveredKey === 'users' ? totalCurrentUsers : totalCurrentLogins;
    }
    return displayMode === 'users' ? totalCurrentUsers : totalCurrentLogins;
  }, [hoveredKey, displayMode, totalCurrentUsers, totalCurrentLogins]);

  const calculatePercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return '→ 0%';

    const change = ((current - previous) / previous) * 100;
    let changeSymbol = '→';

    if (change > 0) {
      changeSymbol = '▲';
    } else if (change < 0) {
      changeSymbol = '▼';
    }

    return `${changeSymbol} ${Math.abs(change).toFixed(1)}%`;
  };

  const getPercentageChange = useCallback(() => {
    if (hoveredKey) {
      if (hoveredKey === 'users') {
        return calculatePercentageChange(totalCurrentUsers, totalPreviousUsers);
      }
      return calculatePercentageChange(totalCurrentLogins, totalPreviousLogins);
    }
    if (displayMode === 'users') {
      return calculatePercentageChange(totalCurrentUsers, totalPreviousUsers);
    }
    return calculatePercentageChange(totalCurrentLogins, totalPreviousLogins);
  }, [
    hoveredKey,
    displayMode,
    totalCurrentUsers,
    totalPreviousUsers,
    totalCurrentLogins,
    totalPreviousLogins,
  ]);

  const handleMetricDoubleClick = () => {
    setDisplayMode((prev) => (prev === 'users' ? 'logins' : 'users'));
  };

  const handleTotalMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative flex h-96 flex-col justify-between rounded-xl p-4 shadow-lg"
      style={{ background: 'transparent', color: axisColor }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <PercentageDisplay
            onClick={handleMetricDoubleClick}
            percentageChange={getPercentageChange()}
            tooltipText={`Percentage Change: Difference in ${
              hoveredKey ?? displayMode
            } from the previous period`}
          />
        </div>

        <div className="relative">
          <button
            className="relative text-4xl font-bold"
            onClick={handleMetricDoubleClick}
            style={{ color: axisColor }}
            type="button"
            onMouseEnter={() => setShowTotalTooltip(true)}
            onMouseLeave={() => setShowTotalTooltip(false)}
            onMouseMove={handleTotalMouseMove}
          >
            {getDisplayTotal().toLocaleString()}
          </button>
          <TooltipSection
            tooltipText={`Total ${hoveredKey ?? displayMode}`}
            mousePosition={mousePosition}
            isVisible={showTotalTooltip}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={currentPeriodData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          onMouseLeave={() => setHoveredKey(null)}
        >
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={userColor}
                stopOpacity={hoveredKey === 'users' ? 1 : 0.8}
              />
              <stop
                offset="95%"
                stopColor={userColor}
                stopOpacity={hoveredKey === 'users' ? 0.6 : 0.1}
              />
            </linearGradient>
            <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={loginColor}
                stopOpacity={hoveredKey === 'logins' ? 1 : 0.8}
              />
              <stop
                offset="95%"
                stopColor={loginColor}
                stopOpacity={hoveredKey === 'logins' ? 0.6 : 0.1}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="time"
            tick={{ fill: axisColor, fontSize: 12 }}
            interval={Math.ceil(currentPeriodData.length / 5)}
          />
          <YAxis tick={{ fill: axisColor, fontSize: 12 }} />

          <Tooltip
            content={
              <GraphTooltip hoveredKey={hoveredKey} previousPeriodData={previousPeriodData} />
            }
            cursor={{ stroke: cursorColor, strokeWidth: 2 }}
          />

          <Area
            type="monotone"
            dataKey="logins"
            stroke={loginColor}
            fill="url(#colorLogins)"
            strokeWidth={hoveredKey === 'logins' ? 5 : 3}
            opacity={hoveredKey === 'users' ? 0.3 : 1}
            onMouseEnter={() => setHoveredKey('logins')}
          />

          <Area
            type="monotone"
            dataKey="users"
            stroke={userColor}
            fill="url(#colorUsers)"
            strokeWidth={hoveredKey === 'users' ? 5 : 3}
            opacity={hoveredKey === 'logins' ? 0.3 : 1}
            onMouseEnter={() => setHoveredKey('users')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
