import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/api';
import { Appointment, Patient, Prescription } from '../../types/index';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PrescriptionPrintView } from '../../components/PrescriptionPrintView';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  ArrowUpRight,
  Pill,
  ClipboardList,
  FileText,
  UserCheck
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (path: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { user, doctorProfile } = useAuth();
  const { showToast } = useNotifications();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [apts, pats, rxs] = await Promise.all([
        api.getAppointments(),
        api.getPatients(),
        api.getPrescriptions(),
      ]);
      setAppointments(apts);
      setPatients(pats);
      setPrescriptions(rxs);
    } catch (err: any) {
      showToast('error', 'Unable to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const handleUpdateStatus = async (id: string, newStatus: Appointment['status']) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      showToast('success', `Appointment marked as ${newStatus}.`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update appointment.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-700 text-teal-200 text-xs font-semibold mb-2">
            <Stethoscope className="w-3.5 h-3.5" />
            Clinical Practitioner Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 font-outfit">
            Good day, {doctorProfile?.name || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-xl">
            {doctorProfile?.specialization} • {doctorProfile?.departmentName} • {todayAppointments.length} consultations scheduled for today
          </p>
        </div>

        <div className="relative z-10 flex gap-2">
          <button
            onClick={() => onNavigate('/doctor/diagnosis')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit"
          >
            <ClipboardList className="w-4 h-4" />
            Add Diagnosis
          </button>
          <button
            onClick={() => onNavigate('/doctor/prescriptions')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs sm:text-sm backdrop-blur-sm border border-white/20 transition-all active:scale-95 font-outfit"
          >
            <Pill className="w-4 h-4" />
            Issue Rx
          </button>
        </div>

        {/* Decorative Background Glows */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Consultations"
          value={todayAppointments.length}
          subtitle="Scheduled for today"
          icon={Calendar}
          colorScheme="teal"
        />
        <StatCard
          title="Assigned Patients"
          value={patients.length}
          subtitle="Under your active care"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Pending Requests"
          value={pendingAppointments.length}
          subtitle="Action required"
          icon={Clock}
          colorScheme="amber"
        />
        <StatCard
          title="Completed Today"
          value={todayAppointments.filter(a => a.status === 'completed').length}
          subtitle="Successfully consulted"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
      </div>

      {/* Main Grid: Today's Schedule + Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                Today's Patient Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <button
              onClick={() => onNavigate('/doctor/appointments')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              View All ({appointments.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800">
              <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No appointments scheduled for today
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                New bookings will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map(apt => (
                <div
                  key={apt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 transition-all gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {apt.timeSlot.split(' ')[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">
                          {apt.patientName}
                        </h4>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {apt.patientAge}y • {apt.patientGender} • Phone: {apt.patientPhone}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                        "{apt.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {apt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.id, 'rejected')}
                          className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'in-progress')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Start Visit
                      </button>
                    )}
                    {apt.status === 'in-progress' && (
                      <button
                        onClick={() => handleUpdateStatus(apt.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Finish Visit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Recent Digital Prescriptions & Actions */}
        <div className="space-y-6">
          {/* Quick Doctor Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Clinical Quick Links
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/doctor/patients')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-left transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Assigned Patient EHRs</p>
                    <p className="text-[11px] text-slate-500">Access histories & diagnosis charts</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => onNavigate('/doctor/schedule')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-left transition-colors border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Consultation Slots</p>
                    <p className="text-[11px] text-slate-500">Adjust weekly timings & leaves</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recent Prescriptions Issued */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                Recent Prescriptions
              </h3>
              <button
                onClick={() => onNavigate('/doctor/prescriptions')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                All Rx
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No prescriptions issued yet</p>
            ) : (
              <div className="space-y-2">
                {prescriptions.slice(0, 3).map(rx => (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRx(rx)}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-teal-500/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white font-outfit">
                        {rx.patientName}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500">{rx.date}</span>
                    </div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-0.5">
                      {rx.diagnosis}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {rx.medicines.length} medications prescribed
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Preview Modal */}
      {selectedRx && (
        <Modal
          isOpen={!!selectedRx}
          onClose={() => setSelectedRx(null)}
          title="Clinical Prescription Preview"
          maxWidth="3xl"
        >
          <PrescriptionPrintView
            prescription={selectedRx}
            onClose={() => setSelectedRx(null)}
          />
        </Modal>
      )}
    </div>
  );
};
