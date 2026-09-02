import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: 'teal' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose';
  id?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'teal',
  id,
}) => {
  const colorMap = {
    teal: {
      bgIcon: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border-teal-200/60 dark:border-teal-800/50',
      glow: 'group-hover:border-teal-500/30',
    },
    blue: {
      bgIcon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50',
      glow: 'group-hover:border-blue-500/30',
    },
    indigo: {
      bgIcon: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/50',
      glow: 'group-hover:border-indigo-500/30',
    },
    emerald: {
      bgIcon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/50',
      glow: 'group-hover:border-emerald-500/30',
    },
    amber: {
      bgIcon: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/50',
      glow: 'group-hover:border-amber-500/30',
    },
    rose: {
      bgIcon: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/50',
      glow: 'group-hover:border-rose-500/30',
    },
  };

  const currentTheme = colorMap[colorScheme];

  return (
    <div
      id={id}
      className={`group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 ${currentTheme.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold-800 mt-1.5 text-slate-900 dark:text-white font-outfit">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium">
              <span className={trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-slate-500 dark:text-slate-400">vs last month</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl border ${currentTheme.bgIcon} transition-transform group-hover:scale-105 duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
