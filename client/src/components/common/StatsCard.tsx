import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-primary-50 dark:bg-primary-950/40',
      border: 'border-primary-100 dark:border-primary-900',
      iconBg: 'bg-primary-500 text-white',
      hover: 'hover:border-primary-400'
    },
    green: {
      bg: 'bg-secondary-50 dark:bg-secondary-950/40',
      border: 'border-secondary-100 dark:border-secondary-900',
      iconBg: 'bg-secondary-500 text-white',
      hover: 'hover:border-secondary-400'
    },
    orange: {
      bg: 'bg-accent-50 dark:bg-accent-950/40',
      border: 'border-accent-100 dark:border-accent-900',
      iconBg: 'bg-accent-500 text-white',
      hover: 'hover:border-accent-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-100 dark:border-purple-900',
      iconBg: 'bg-purple-500 text-white',
      hover: 'hover:border-purple-400'
    }
  }[color];

  return (
    <div className={`p-5 rounded-2xl border ${colorStyles.border} ${colorStyles.bg} transition-all duration-200 shadow-sm ${colorStyles.hover}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${colorStyles.iconBg}`}>
          {icon}
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-secondary-600 dark:text-secondary-400' : 'text-rose-500'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
