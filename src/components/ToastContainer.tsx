import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let bgStyle = 'bg-slate-900/95 text-white border-slate-700';
        let iconColor = 'text-cyan-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          bgStyle = 'bg-teal-950/95 text-teal-50 border-teal-700/60';
          iconColor = 'text-teal-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgStyle = 'bg-rose-950/95 text-rose-50 border-rose-700/60';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgStyle = 'bg-amber-950/95 text-amber-50 border-amber-700/60';
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            id={`toast-item-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bgStyle}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm">
              {toast.title && <h4 className="font-semibold mb-0.5">{toast.title}</h4>}
              <p className="text-xs leading-relaxed opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
