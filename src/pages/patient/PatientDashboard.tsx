import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/api';
import { Appointment, MedicalRecord, Prescription } from '../../types/index';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { PrescriptionPrintView } from '../../components/PrescriptionPrintView';
import {
  HeartPulse,
  Calendar,
  Pill,
  FileText,
  Clock,
  UserCheck,
  CalendarPlus,
  AlertTriangle,
  ChevronRight,
  Stethoscope,
  Printer
} from 'lucide-react';

interface PatientDashboardProps {
  onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user, patientProfile } = useAuth();
  const { showToast } = useNotifications();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [apts, records, rxs] = await Promise.all([
        api.getAppointments(),
        api.getMedicalRecords(),
        api.getPrescriptions(),
      ]);
      setAppointments(apts);
      setMedicalRecords(records);
      setPrescriptions(rxs);
    } catch (err: any) {
      showToast('error', 'Failed to load patient dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const upcomingAppointments = appointments.filter(
    a => a.status === 'confirmed' || a.status === 'pending'
  );
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-800/80 border border-cyan-700 text-cyan-200 text-xs font-semibold mb-1">
            <HeartPulse className="w-3.5 h-3.5" />
            Patient Health Sanctuary
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 font-outfit">
            Welcome back, {patientProfile?.name || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/80 max-w-xl">
            Blood Group: <span className="font-bold text-white">{patientProfile?.bloodGroup || 'O+'}</span> • Allergies: {patientProfile?.allergies?.length ? patientProfile.allergies.join(', ') : 'None registered'}
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('/patient/book-appointment')}
            className="flex items-center gap-2 px-5 py-3 bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-bold rounded-2xl text-xs sm:text-sm shadow-lg transition-all active:scale-95 font-outfit"
          >
            <CalendarPlus className="w-4 h-4" />
            Book Consultation
          </button>
          <button
            onClick={() => onNavigate('/patient/prescriptions')}
            className="flex items-center gap-2 px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs sm:text-sm backdrop-blur-sm border border-white/20 transition-all active:scale-95 font-outfit"
          >
            <Pill className="w-4 h-4" />
            My Medicines
          </button>
        </div>

        {/* Glow */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Consults"
          value={upcomingAppointments.length}
          subtitle="Scheduled visits"
          icon={Calendar}
          colorScheme="teal"
        />
        <StatCard
          title="Active Prescriptions"
          value={prescriptions.length}
          subtitle="Medical prescriptions"
          icon={Pill}
          colorScheme="blue"
        />
        <StatCard
          title="EHR Health Records"
          value={medicalRecords.length}
          subtitle="Diagnosis & test history"
          icon={FileText}
          colorScheme="indigo"
        />
        <StatCard
          title="Completed Visits"
          value={appointments.filter(a => a.status === 'completed').length}
          subtitle="Past consultations"
          icon={UserCheck}
          colorScheme="emerald"
        />
      </div>

      {/* Main Grid: Next Appointment + Prescriptions & Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Scheduled Appointment & Consultation List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Immediate Visit Card */}
          {nextAppointment ? (
            <div className="bg-gradient-to-br from-white to-teal-50/40 dark:from-slate-900 dark:to-slate-800/40 rounded-3xl p-6 border border-teal-200/80 dark:border-teal-900/60 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                    Next Scheduled Consultation
                  </h3>
                </div>
                <StatusBadge status={nextAppointment.status} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-base flex-shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                      {nextAppointment.doctorName}
                    </h4>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                      {nextAppointment.departmentName}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        {nextAppointment.date}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        {nextAppointment.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    ID: {nextAppointment.appointmentNumber}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-[200px]">
                    "{nextAppointment.reason}"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm text-center py-8">
              <CalendarPlus className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 font-outfit">
                No Upcoming Appointments
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Schedule a consultation with our board-certified physicians and specialists today.
              </p>
              <button
                onClick={() => onNavigate('/patient/book-appointment')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
              >
                <CalendarPlus className="w-4 h-4" /> Book an Appointment
              </button>
            </div>
          )}

          {/* Recent Appointments List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                Recent Appointment History
              </h3>
              <button
                onClick={() => onNavigate('/patient/appointments')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                View All ({appointments.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No appointment history found.</p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 3).map(apt => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white font-outfit">
                          {apt.doctorName}
                        </h4>
                        <StatusBadge status={apt.status} />
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        {apt.departmentName} • {apt.date} at {apt.timeSlot}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">{apt.appointmentNumber}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Prescriptions & Health Summary */}
        <div className="space-y-6">
          {/* Active Prescriptions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                My Prescriptions
              </h3>
              <button
                onClick={() => onNavigate('/patient/prescriptions')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                View All
              </button>
            </div>

            {prescriptions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active prescriptions.</p>
            ) : (
              <div className="space-y-3">
                {prescriptions.slice(0, 2).map(rx => (
                  <div
                    key={rx.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-bold">{rx.prescriptionNumber}</span>
                      <span className="text-slate-400 text-[10px]">{rx.date}</span>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      {rx.diagnosis}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      By {rx.doctorName}
                    </p>

                    <button
                      onClick={() => setSelectedRx(rx)}
                      className="w-full mt-2 py-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> View Official Rx
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Health Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Emergency & Vital Info
            </h3>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-slate-400">Blood Group</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">{patientProfile?.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-slate-400">Emergency Contact</span>
                <span className="font-semibold">{patientProfile?.emergencyContactName || 'Family Member'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                <span className="text-slate-400">Emergency Phone</span>
                <span className="font-mono">{patientProfile?.emergencyContactPhone || '+91 98765 43210'}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Known Allergies</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  {patientProfile?.allergies?.length ? patientProfile.allergies.join(', ') : 'None'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/patient/profile')}
              className="w-full mt-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors text-center"
            >
              Update Medical Profile
            </button>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {selectedRx && (
        <Modal
          isOpen={!!selectedRx}
          onClose={() => setSelectedRx(null)}
          title="Digital Prescription"
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
