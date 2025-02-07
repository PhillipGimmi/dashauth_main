export interface SecurityMetric {
  id: number;
  time: string;
  value: number;
  previousValue: number;
}

export interface GeoSecurityData {
  region: string;
  failedAttempts: number;
  blockedIPs: number;
  anomalyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  metrics: SecurityMetric[];
}

export interface GeographicDistributionProps {
  data: Array<{
    country: string;
    users: number;
    mfaAdoption: number;
  }>;
  primaryColor?: string;
}

export interface TooltipProps {
  active?: boolean;
  content: {
    title?: string;
    value: string | number;
    subValue?: string | number;
    description?: string;
    change?: {
      value: number;
      label?: string;
    };
  };
  mousePosition: { x: number; y: number } | null;
}

export const defaultProps = {
  primaryColor: '#3B82F6', // Default to blue-500
};

export const getChangeColor = (value: number) => {
  if (value > 0) return 'text-green-400';
  if (value < 0) return 'text-red-400';
  return 'text-white';
};

export const getChangeSymbol = (value: number): string => {
  if (value > 0) return '▲';
  if (value < 0) return '▼';
  return '→';
};

export const getRiskColor = (level: string, primaryColor: string): string => {
  switch (level) {
    case 'high':
      return '#ef4444'; // red-500
    case 'medium':
      return '#f59e0b'; // amber-500
    case 'low':
      return primaryColor;
    default:
      return primaryColor;
  }
};

export const generateMetrics = (base: number): SecurityMetric[] =>
  Array.from({ length: 24 }, (_, i) => ({
    id: i,
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.round(base + Math.random() * base * 0.2),
    previousValue: Math.round(base * 0.95),
  }));

export const generateData = (): GeoSecurityData[] => [
  {
    region: 'Asia Pacific',
    failedAttempts: 2840,
    blockedIPs: 142,
    anomalyScore: 8.4,
    riskLevel: 'high',
    metrics: generateMetrics(120),
  },
  {
    region: 'North America',
    failedAttempts: 1560,
    blockedIPs: 89,
    anomalyScore: 4.2,
    riskLevel: 'medium',
    metrics: generateMetrics(80),
  },
  {
    region: 'Europe',
    failedAttempts: 1980,
    blockedIPs: 115,
    anomalyScore: 6.7,
    riskLevel: 'high',
    metrics: generateMetrics(100),
  },
  {
    region: 'South America',
    failedAttempts: 890,
    blockedIPs: 67,
    anomalyScore: 5.1,
    riskLevel: 'low',
    metrics: generateMetrics(60),
  },
];

export const failureReasons = [
  { reason: 'Invalid Credentials', percentage: 45 },
  { reason: '2FA Failed', percentage: 30 },
  { reason: 'Token Expired', percentage: 15 },
  { reason: 'Rate Limited', percentage: 10 },
];
