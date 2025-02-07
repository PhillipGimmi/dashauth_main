'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SecurityIncident {
  day: string;
  bruteForce: number;
  suspicious: number;
  blocked: number;
}

interface SecurityIncidentsChartProps {
  data: SecurityIncident[];
}

const COLORS = {
  red: '#EF4444', // Tailwind red-500
  yellow: '#F59E0B', // Tailwind amber-500
  green: '#10B981', // Tailwind emerald-500
} as const;

const SecurityIncidentsChart: React.FC<SecurityIncidentsChartProps> = ({ data }) => (
  <div className="relative h-80">
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="day" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
        />
        <Line
          type="monotone"
          dataKey="bruteForce"
          stroke={COLORS.red}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{
            r: 6,
            style: {
              filter: 'drop-shadow(0px 2px 4px rgba(239, 68, 68, 0.5))',
              animation: 'pulse 2s infinite',
            },
          }}
        />
        <Line
          type="monotone"
          dataKey="suspicious"
          stroke={COLORS.yellow}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{
            r: 6,
            style: {
              filter: 'drop-shadow(0px 2px 4px rgba(245, 158, 11, 0.5))',
              animation: 'pulse 2s infinite',
            },
          }}
        />
        <Line
          type="monotone"
          dataKey="blocked"
          stroke={COLORS.green}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{
            r: 6,
            style: {
              filter: 'drop-shadow(0px 2px 4px rgba(16, 185, 129, 0.5))',
              animation: 'pulse 2s infinite',
            },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 transform gap-4">
      {[
        { label: 'Brute Force', color: COLORS.red },
        { label: 'Suspicious', color: COLORS.yellow },
        { label: 'Blocked', color: COLORS.green },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm text-zinc-400">{item.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SecurityIncidentsChart;
