import React from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
  subtitle?: string;
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function MetricCard({ title, value, icon, trend, color = 'blue', subtitle }: MetricCardProps) {
  return (
    <motion.div 
      variants={item}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-50 rounded-lg ring-2 ring-${color}-100 ring-opacity-50`}>
          {icon}
        </div>
        {trend && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium
            ${trend.isPositive ? 'bg-green-50 text-green-600 ring-2 ring-green-100' : 
                                'bg-red-50 text-red-600 ring-2 ring-red-100'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold gradient-text mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}