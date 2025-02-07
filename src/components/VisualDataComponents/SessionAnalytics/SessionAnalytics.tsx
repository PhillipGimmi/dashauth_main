'use client';

import React from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SessionData {
  time: string;
  active: number;
  average: number;
}

interface SessionAnalyticsProps {
  data: SessionData[];
}

const COLORS = {
  blue: '#3B82F6', // Tailwind blue-500
  purple: '#8B5CF6', // Tailwind violet-500
} as const;

const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({ data }) => (
  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="time" stroke="#9CA3AF" />
        <YAxis yAxisId="left" stroke="#9CA3AF" />
        <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '0.5rem',
          }}
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="active"
          fill={`${COLORS.blue}20`}
          stroke={COLORS.blue}
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="average"
          stroke={COLORS.purple}
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export default SessionAnalytics;
