import React from 'react';
import { AppointmentStatus } from '../types/index';

interface StatusBadgeProps {
  status: AppointmentStatus | 'active' | 'inactive' | 'Normal' | 'Abnormal' | 'Critical';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  switch (status) {
    case 'confirmed':
    case 'active':
    case 'Normal':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60';
      break;
    case 'pending':
      style = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60';
      break;
    case 'in-progress':
      style = 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/60 animate-pulse';
      break;
    case 'completed':
      style = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/60';
      break;
    case 'cancelled':
    case 'inactive':
    case 'Abnormal':
      style = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60';
      break;
    case 'rejected':
    case 'Critical':
      style = 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-800';
      break;
  }

  const label = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75" />
      {label}
    </span>
  );
};
