import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Calendar,
  Clock,
  Stethoscope,
  XCircle,
  Plus,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

interface PatientAppointmentsProps {
  onNavigate: (path: string) => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ onNavigate }) => {
  const { showToast } = useNotifications();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAppointments({
        status: statusFilter,
      });
      setAppointments(data);
    } catch (err: any) {
      showToast('error', 'Failed to load your appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter]);

  const handleCancelAppointment = async () => {
    if (!cancelModalId) return;
    try {
      await api.updateAppointmentStatus(cancelModalId, 'cancelled', 'Cancelled by patient');
      showToast('info', 'Appointment cancelled.');
      setCancelModalId(null);
      loadAppointments();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review your consultations, tracking status and cancellation options.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/patient/book-appointment')}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit"
        >
          <Plus className="w-4 h-4" /> Book New Consultation
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
            No Appointments Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any appointments matching this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map(apt => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {apt.appointmentNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mt-1">
                    {apt.doctorName}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                    {apt.departmentName}
                  </p>
                </div>
                <StatusBadge status={apt.status} />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  {apt.date}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  {apt.timeSlot}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Reason:</strong> {apt.reason}
              </div>

              {apt.notes && (
                <div className="text-xs text-slate-500 italic bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-200/40">
                  Doctor Notes: "{apt.notes}"
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {(apt.status === 'pending' || apt.status === 'confirmed') ? (
                  <button
                    onClick={() => setCancelModalId(apt.id)}
                    className="text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel Appointment
                  </button>
                ) : (
                  <span className="text-slate-400 text-[11px]">No active actions</span>
                )}

                <button
                  onClick={() => onNavigate('/patient/book-appointment')}
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  Book Follow-up →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!cancelModalId}
        onClose={() => setCancelModalId(null)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this scheduled consultation? This slot will be released back to the clinic."
        confirmText="Yes, Cancel Consultation"
        variant="danger"
      />
    </div>
  );
};
