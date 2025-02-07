'use client';

import React, { useState, useMemo, useCallback } from 'react';

import {
  LogIn,
  Shield,
  LogOut,
  KeyRound,
  LucideIcon,
  Users,
  Activity,
  CheckCircle,
  Timer,
} from 'lucide-react';

import { useAuthStore } from '@/store/authStore';
import ChartCard from '@/components/VisualDataComponents/ChartCard/ChartCard';
import DashboardHeader from '@/components/DashboardHeader/DashboardHeader';

import ActivityChart from '@/components/VisualDataComponents/ActivityChart/ActivityChart';
import GeographicDistribution from '@/components/VisualDataComponents/GeographicDistribution/GeographicDistribution';
import AuthMethodsChart from '@/components/VisualDataComponents/AuthMethodsChart/AuthMethodsChart';
import SecurityIncidentsChart from '@/components/VisualDataComponents/SecurityIncidentsChart/SecurityIncidentsChart';
import SessionAnalytics from '@/components/VisualDataComponents/SessionAnalytics/SessionAnalytics';
import RecentActivityList from '@/components/RecentActivityList/RecentActivityList;';
import SetupWizard from '@/components/SetupWizard/SetupWizard';

type TimeRangeType = '24h' | '7d' | '30d' | '90d';
type ActivityStatus = 'success' | 'warning' | 'error';
type ActivityType = 'Login' | 'Logout' | '2FA Verification' | 'Password Change';
type StatColor = 'blue' | 'green' | 'yellow' | 'rose' | 'purple';
type TrendDirection = 'up' | 'down' | 'neutral';

interface TimeData {
  time: string;
  users: number;
  logins: number;
  signups: number;
  responseTime: number;
  avgLoginsPerUser?: string;
}

interface DashboardProps {
  isConfigured?: boolean;
}

interface StatDetail {
  label: string;
  value: string | number;
}

interface AuthStats {
  label: string;
  value: string | number;
  change: number;
  trend: TrendDirection;
  color: StatColor;
  icon: LucideIcon;
  details: StatDetail[];
}

interface AuthMethod {
  id: string;
  name: string;
  value: number;
  trend: number;
}

interface LocationData {
  country: string;
  users: number;
  mfaAdoption: number;
}

interface SecurityIncident {
  day: string;
  bruteForce: number;
  suspicious: number;
  blocked: number;
}

interface SessionData {
  time: string;
  active: number;
  average: number;
}

interface RecentActivity {
  id: string;
  type: ActivityType;
  user: string;
  time: string;
  location: string;
  status: ActivityStatus;
  icon: LucideIcon;
  timestamp: string;
}

interface ChartData {
  stats: AuthStats[];
  timeData: TimeData[];
  locationData: LocationData[];
  authMethods: AuthMethod[];
  securityIncidents: SecurityIncident[];
  sessionData: SessionData[];
  recentActivity: RecentActivity[];
}

const TIME_RANGES: TimeRangeType[] = ['24h', '7d', '30d', '90d'];

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  Login: LogIn,
  Logout: LogOut,
  '2FA Verification': Shield,
  'Password Change': KeyRound,
};

const getRelativeTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp provided:', timestamp);
      return 'Invalid date';
    }

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'Yesterday';
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Date error';
  }
};
const generateDummyTimeData = (timeRange: TimeRangeType): TimeData[] => {
  const baseUsers = 1200;
  const baseLogins = 850;
  const baseSignups = 45;
  const baseResponse = 120;

  switch (timeRange) {
    case '24h':
      return [
        {
          time: '00:00',
          users: 1200,
          logins: 850,
          signups: 45,
          responseTime: 120,
        },
        {
          time: '04:00',
          users: 1400,
          logins: 940,
          signups: 65,
          responseTime: 115,
        },
        {
          time: '08:00',
          users: 2100,
          logins: 1540,
          signups: 95,
          responseTime: 125,
        },
        {
          time: '12:00',
          users: 2800,
          logins: 1890,
          signups: 120,
          responseTime: 135,
        },
        {
          time: '16:00',
          users: 2600,
          logins: 1740,
          signups: 110,
          responseTime: 130,
        },
        {
          time: '20:00',
          users: 1800,
          logins: 1240,
          signups: 75,
          responseTime: 125,
        },
      ];

    case '7d':
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - i));
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
        const multiplier = 0.8 + Math.random() * 0.4;

        return {
          time: dayName,
          users: Math.round(baseUsers * 1.5 * multiplier),
          logins: Math.round(baseLogins * 1.5 * multiplier),
          signups: Math.round(baseSignups * 1.2 * multiplier),
          responseTime: Math.round(baseResponse * (0.9 + Math.random() * 0.2)),
        };
      });

    case '30d':
      return Array.from({ length: 30 * 24 }, (_, i) => {
        const hour = new Date();
        hour.setHours(hour.getHours() - (30 * 24 - i));
        const hourStr = `${hour.getMonth() + 1}/${hour.getDate()} ${hour.getHours()}:00`;
        const multiplier = 0.7 + Math.random() * 0.6;

        return {
          time: hourStr,
          users: Math.round(baseUsers * 2 * multiplier),
          logins: Math.round(baseLogins * 2 * multiplier),
          signups: Math.round(baseSignups * 1.5 * multiplier),
          responseTime: Math.round(baseResponse * (0.85 + Math.random() * 0.3)),
        };
      });

    case '90d':
      return Array.from({ length: 90 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - (89 - i));
        const dayStr = `${day.getMonth() + 1}/${day.getDate()}`;
        const multiplier = 0.6 + Math.random() * 0.8;

        return {
          time: dayStr,
          users: Math.round(baseUsers * 2.5 * multiplier),
          logins: Math.round(baseLogins * 2.5 * multiplier),
          signups: Math.round(baseSignups * 2 * multiplier),
          responseTime: Math.round(baseResponse * (0.8 + Math.random() * 0.4)),
        };
      });
  }
};

const MOCK_DATA: ChartData = {
  stats: [
    {
      label: 'Total Users',
      value: '12,345',
      change: 8.2,
      trend: 'up',
      color: 'blue',
      icon: Users,
      details: [
        { label: 'Active Today', value: '2,345' },
        { label: 'New Users', value: '432' },
        { label: 'Returning', value: '1,913' },
      ],
    },
    {
      label: 'Active Sessions',
      value: '2,876',
      change: -2.1,
      trend: 'down',
      color: 'green',
      icon: Activity,
      details: [
        { label: 'Desktop', value: '1,543' },
        { label: 'Mobile', value: '1,333' },
      ],
    },
    {
      label: 'Success Rate',
      value: '98.2%',
      change: 0.5,
      trend: 'up',
      color: 'purple',
      icon: CheckCircle,
      details: [
        { label: 'Failed Attempts', value: '1.8%' },
        { label: 'Blocked IPs', value: '23' },
      ],
    },
    {
      label: 'Avg Response',
      value: '124ms',
      change: -12.5,
      trend: 'down',
      color: 'yellow',
      icon: Timer,
      details: [
        { label: 'Peak', value: '342ms' },
        { label: 'Low', value: '89ms' },
      ],
    },
  ],
  timeData: generateDummyTimeData('24h'),
  locationData: [
    { country: 'United States', users: 5240, mfaAdoption: 82 },
    { country: 'United Kingdom', users: 2120, mfaAdoption: 76 },
    { country: 'Germany', users: 1890, mfaAdoption: 85 },
    { country: 'Japan', users: 1450, mfaAdoption: 90 },
    { country: 'France', users: 1200, mfaAdoption: 78 },
  ],
  authMethods: [
    { id: 'pwd', name: 'Password', value: 45, trend: -5 },
    { id: '2fa', name: '2FA', value: 30, trend: 8 },
    { id: 'sso', name: 'SSO', value: 15, trend: 12 },
    { id: 'bio', name: 'Biometric', value: 10, trend: 15 },
  ],
  securityIncidents: [
    { day: 'Mon', bruteForce: 8, suspicious: 12, blocked: 5 },
    { day: 'Tue', bruteForce: 6, suspicious: 8, blocked: 4 },
    { day: 'Wed', bruteForce: 10, suspicious: 15, blocked: 7 },
    { day: 'Thu', bruteForce: 7, suspicious: 10, blocked: 5 },
    { day: 'Fri', bruteForce: 5, suspicious: 7, blocked: 3 },
    { day: 'Sat', bruteForce: 3, suspicious: 5, blocked: 2 },
    { day: 'Sun', bruteForce: 4, suspicious: 6, blocked: 3 },
  ],
  sessionData: [
    { time: '00:00', active: 1200, average: 25 },
    { time: '04:00', active: 1500, average: 28 },
    { time: '08:00', active: 2800, average: 22 },
    { time: '12:00', active: 3200, average: 24 },
    { time: '16:00', active: 2900, average: 26 },
    { time: '20:00', active: 1800, average: 30 },
  ],
  recentActivity: [
    {
      id: 'act1',
      type: 'Login',
      user: 'john.doe@example.com',
      timestamp: '2024-03-06T10:30:00Z',
      time: '2 minutes ago',
      location: 'San Francisco, US',
      status: 'success',
      icon: ACTIVITY_ICONS['Login'],
    },
    {
      id: 'act2',
      type: '2FA Verification',
      user: 'jane.smith@example.com',
      timestamp: '2024-03-06T10:28:00Z',
      time: '5 minutes ago',
      location: 'London, UK',
      status: 'warning',
      icon: ACTIVITY_ICONS['2FA Verification'],
    },
    {
      id: 'act3',
      type: 'Logout',
      user: 'bob.wilson@example.com',
      timestamp: '2024-03-06T10:25:00Z',
      time: '10 minutes ago',
      location: 'Sydney, AU',
      status: 'success',
      icon: ACTIVITY_ICONS['Logout'],
    },
    {
      id: 'act4',
      type: 'Password Change',
      user: 'alice.johnson@example.com',
      timestamp: '2024-03-06T10:20:00Z',
      time: '15 minutes ago',
      location: 'Toronto, CA',
      status: 'error',
      icon: ACTIVITY_ICONS['Password Change'],
    },
    {
      id: 'act5',
      type: 'Password Change',
      user: 'alice.johnson@example.com',
      timestamp: '2024-03-06T10:20:00Z',
      time: '15 minutes ago',
      location: 'Toronto, CA',
      status: 'error',
      icon: ACTIVITY_ICONS['Password Change'],
    },
    {
      id: 'act6',
      type: 'Password Change',
      user: 'alice.johnson@example.com',
      timestamp: '2024-03-06T10:20:00Z',
      time: '15 minutes ago',
      location: 'Toronto, CA',
      status: 'error',
      icon: ACTIVITY_ICONS['Password Change'],
    },
  ],
};

const Dashboard = ({ isConfigured = true }: DashboardProps) => {
  const { user, loading } = useAuthStore();

  const [timeRange, setTimeRange] = useState<TimeRangeType>('24h');

  const handleTimeRangeChange = useCallback((range: TimeRangeType) => {
    setTimeRange(range);
  }, []);

  const filteredData = useMemo(() => {
    const rawData = generateDummyTimeData(timeRange);
    return rawData.map((point) => ({
      time: point.time,
      users: point.users,
      logins: point.logins,
      signups: point.signups,
      responseTime: point.responseTime,
      avgLoginsPerUser: (point.logins / point.users).toFixed(2),
    }));
  }, [timeRange]);

  const processedRecentActivity = useMemo(() => {
    return MOCK_DATA.recentActivity.map((activity) => ({
      ...activity,
      time: getRelativeTime(activity.timestamp),
    }));
  }, []);

  const headerUser = useMemo(() => {
    return user
      ? {
          name: user.name || undefined,
          email: user.email || undefined,
        }
      : { name: undefined, email: undefined };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
        busy loading ...
      </div>
    );
  }

  if (!isConfigured && user?.email) {
    return (
      <SetupWizard
        onComplete={async () => {
          window.location.reload();
          return Promise.resolve();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-950">
      <div className="h-full flex flex-col">
        <div className="flex-none p-4 sm:p-6">
          <DashboardHeader user={headerUser} />
          <div className="flex justify-end gap-2 mt-4 sm:mt-6">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-2 sm:px-3 py-1 rounded-md text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col lg:flex-row gap-6 overflow-auto">
          {/* First Column */}
          <div className="w-full lg:w-1/3 min-w-[300px] space-y-6">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {MOCK_DATA.stats
                .slice(0, 2)
                .map((stat: AuthStats, index: number) => (
                  <StatsCard
                    key={stat.label}
                    stat={stat}
                    index={index}
                    isSelected={selectedCard === index}
                    onSelect={() => handleCardSelection(index)}
                  />
                ))}
            </div> */}
            <ChartCard
              title="Authentication Activity"
              subtitle="Real-time user authentication tracking"
              chart={
                <ActivityChart timeRange={timeRange} data={filteredData} />
              }
            />
            <ChartCard
              title="Geographic Distribution"
              subtitle="User distribution and MFA adoption by country"
              chart={
                <GeographicDistribution
                  data={MOCK_DATA.locationData}
                  primaryColor="#10B981"
                />
              }
            />
          </div>

          {/* Second Column */}
          <div className="w-full lg:w-1/3 min-w-[300px] space-y-6">
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {MOCK_DATA.stats
                .slice(2, 4)
                .map((stat: AuthStats, index: number) => (
                  <StatsCard
                    key={stat.label}
                    stat={stat}
                    index={index + 2}
                    isSelected={selectedCard === index + 2}
                    onSelect={() => handleCardSelection(index + 2)}
                  />
                ))}
            </div> */}
            <ChartCard
              title="Authentication Methods"
              subtitle="Distribution and trends of authentication methods"
              chart={<AuthMethodsChart data={MOCK_DATA.authMethods} />}
            />
            <ChartCard
              title="Security Incidents"
              subtitle="Daily security events and blocked attempts"
              chart={
                <SecurityIncidentsChart data={MOCK_DATA.securityIncidents} />
              }
            />
          </div>

          {/* Third Column */}
          <div className="w-full lg:w-1/3 min-w-[300px] space-y-6">
            <ChartCard
              title="Session Analytics"
              subtitle="Active sessions and average duration"
              chart={<SessionAnalytics data={MOCK_DATA.sessionData} />}
            />
            <ChartCard
              title="Recent Activity"
              subtitle="Latest authentication events"
              content={
                <RecentActivityList activities={processedRecentActivity} />
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
