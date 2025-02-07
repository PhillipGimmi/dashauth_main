import React from 'react';
import { motion } from 'framer-motion';

import ChartCard from '../ChartCard/ChartCard';
import ActivityChart from '../ActivityChart/ActivityChart';
import AuthMethodsChart from '../AuthMethodsChart/AuthMethodsChart';
import GeographicDistribution from '../GeographicDistribution/GeographicDistribution';

const generateReversedActivityData = () => {
  return Array.from({ length: 48 }, (_, index) => {
    const progress = index / 48;
    const curve = Math.pow(progress, 2);

    let baseUsers;
    let baseLogins;

    // Special case for 12:00 previous day
    if (index === 12) {
      // 12:00 mark
      baseUsers = 3000;
      baseLogins = 5000;
    } else {
      baseUsers = Math.floor(
        800 + // Lower starting point
          curve * 2000 + // Smaller growth curve
          Math.random() * 50 // Smaller random variation
      );

      // Logins follow same pattern but slightly higher
      const loginMultiplier = 1.5 + curve * 0.3;
      baseLogins = Math.floor(baseUsers * loginMultiplier);
    }

    // Previous period comparison logic - more explicit control
    let previousMultiplier;

    if (index < 12) {
      previousMultiplier = 1.4; // Much higher previous numbers
    } else if (index < 24) {
      previousMultiplier = 1.25; // Still higher but less dramatic
    } else if (index < 36) {
      previousMultiplier = 1.15; // Small difference
    } else {
      const endPatterns = [1.3, 1.2, 1.15, 1.25, 1.1, 1.05, 1.2, 1.3, 1.15, 1.2, 1.1, 1.15];
      previousMultiplier = endPatterns[index - 36];
    }

    const timeOfDay = index % 24;
    const time = `${String(timeOfDay).padStart(2, '0')}:00`;

    return {
      time,
      users: baseUsers,
      logins: baseLogins,
      biometricLogins: Math.floor(baseLogins * 0.2),
      failedBiometric: Math.floor(baseLogins * 0.2 * 0.02),
      previousPeriodUsers: Math.floor(baseUsers * previousMultiplier),
      previousPeriodLogins: Math.floor(baseLogins * previousMultiplier),
    };
  });
};

const authMethodsData = [
  { id: 'fprint', name: 'Biometrics', value: 20, trend: 25 },
  { id: 'sso', name: 'SSO', value: 20, trend: 7 },
  { id: '2fa', name: '2FA', value: 25, trend: 5 },
  { id: 'pwd', name: 'Password', value: 35, trend: -8 },
];

const geoData = [
  {
    country: 'Australia',
    users: 980,
    mfaAdoption: 78,
    biometricBreakdown: {
      fingerprint: 42,
      faceId: 32,
      voiceAuth: 1,
    },
  },
  {
    country: 'Japan',
    users: 1650,
    mfaAdoption: 90,
    biometricBreakdown: {
      fingerprint: 55,
      faceId: 40,
      voiceAuth: 5,
    },
  },
  {
    country: 'Germany',
    users: 1890,
    mfaAdoption: 85,
    biometricBreakdown: {
      fingerprint: 50,
      faceId: 28,
      voiceAuth: 3,
    },
  },
  {
    country: 'United Kingdom',
    users: 2120,
    mfaAdoption: 76,
    biometricBreakdown: {
      fingerprint: 40,
      faceId: 30,
      voiceAuth: 1,
    },
  },
  {
    country: 'United States',
    users: 5240,
    mfaAdoption: 82,
    biometricBreakdown: {
      fingerprint: 45,
      faceId: 35,
      voiceAuth: 2,
    },
  },
].reverse();

const ChartsGrid = () => {
  const activityChartData = generateReversedActivityData();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        whileHover={{ scale: 1.01 }}
        className="lg:col-span-2"
      >
        <ChartCard
          title="Authentication Activity"
          subtitle="Real-time authentication patterns and trends"
          chart={<ActivityChart data={activityChartData} timeRange="24h" />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.01 }}
      >
        <ChartCard
          title="Authentication Methods"
          subtitle="Security distribution analysis"
          chart={<AuthMethodsChart data={authMethodsData} />}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.01 }}
      >
        <ChartCard
          title="Geographic Coverage"
          subtitle="Global authentication patterns"
          chart={<GeographicDistribution data={geoData} />}
        />
      </motion.div>
    </div>
  );
};

export default ChartsGrid;
