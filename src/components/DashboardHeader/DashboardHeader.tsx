'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  user?: {
    name?: string;
    email?: string;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: '-100px' }}
    transition={{ duration: 0.6 }}
    className="mb-20 text-center"
  >
    <h2 className="mb-6 text-4xl font-bold text-white dark:text-black md:text-5xl lg:text-6xl">
      {user?.name ? `Welcome, ${user.name}` : 'Powerful Authentication Dashboard'}
    </h2>
    <p className="mx-auto max-w-3xl text-lg text-zinc-400 dark:text-zinc-600 md:text-xl">
      Real-time insights and analytics for your authentication system. Automatic monitoring, user
      trends, and detailed dashboards included.
    </p>
  </motion.div>
);

export default DashboardHeader;
