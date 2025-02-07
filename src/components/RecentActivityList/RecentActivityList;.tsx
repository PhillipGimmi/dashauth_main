'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, LucideIcon } from 'lucide-react';
import styles from './RecentActivityList.module.css'; // Import the CSS module

interface RecentActivity {
  id: string;
  user: string;
  type: string;
  time: string;
  location: string;
  status: 'success' | 'warning' | 'error';
  icon: LucideIcon;
}

interface RecentActivityListProps {
  activities: RecentActivity[];
}

const getStatusStyles = (status: RecentActivity['status']) => {
  const styles = {
    success: {
      background: 'bg-green-500/10',
      text: 'text-green-400',
    },
    warning: {
      background: 'bg-yellow-500/10',
      text: 'text-yellow-400',
    },
    error: {
      background: 'bg-zinc-800',
      text: 'text-blue-400',
    },
  };

  return styles[status] || styles.error;
};

const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => (
  <div
    className={`flex max-h-[503px] flex-col space-y-4 overflow-y-auto p-4 ${styles.hideScrollbar}`}
  >
    {activities.map((activity, index) => {
      const statusStyles = getStatusStyles(activity.status);
      const ActivityIcon = activity.icon;

      return (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-4 rounded-lg p-4 transition-colors hover:bg-zinc-800/50"
        >
          <div className={`rounded-lg p-2 ${statusStyles.background}`}>
            <ActivityIcon className={`h-5 w-5 ${statusStyles.text}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-300">{activity.user}</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-zinc-500">{activity.time}</p>
              <span className="text-zinc-600">•</span>
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Globe size={12} />
                {activity.location}
              </div>
              <span className="text-zinc-600">•</span>
              <span className={`text-xs ${statusStyles.text}`}>{activity.type}</span>
            </div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default RecentActivityList;
