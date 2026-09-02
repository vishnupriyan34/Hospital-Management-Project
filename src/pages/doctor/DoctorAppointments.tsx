import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment, AppointmentStatus } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import {
  Calendar,
  Search,
  Filter,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

export const DoctorAppointments: React.FC = () => {
  const { showToast } = useNotifications();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<AppointmentStatus>('confirmed');
  const [actionNotes, setActionNotes] = useState<string>('');

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAppointments({
        status: statusFilter,
        date: dateFilter,
      });
      setAppointments(data);
    } catch (err: any) {
      showToast('error', 'Failed to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, dateFilter]);

  const filteredAppointments = appointments.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.patientName.toLowerCase().includes(term) ||
      a.patientPhone.includes(term) ||
      a.appointmentNumber.toLowerCase().includes(term) ||
      a.reason.toLowerCase().includes(term)
    );
  });

  const handleOpenStatusModal = (apt: Appointment, targetStatus: AppointmentStatus) => {
    setSelectedApt(apt);
    setNewStatus(targetStatus);
    setActionNotes(apt.notes || '');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApt) return;
    try {
      await api.updateAppointmentStatus(selectedApt.id, newStatus, actionNotes);
      showToast('success', `Appointment status updated to ${newStatus}.`);
      setStatusModalOpen(false);
      loadAppointments();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update status.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your patient consultations, approve requests, and record session outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStatusFilter('all');
              setDateFilter('');
              setSearchTerm('');
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, phone, or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white cursor-pointer"
          >
            <option value="all">All Appointment Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white cursor-pointer"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
              No Appointments Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              There are no appointments matching your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredAppointments.map(apt => (
              <div
                key={apt.id}
                className="p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                      {apt.appointmentNumber}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                      {apt.patientName}
                    </h3>
                    <StatusBadge status={apt.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                      {apt.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {apt.patientAge}y • {apt.patientGender}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {apt.patientPhone}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 inline-block">
                    <strong className="text-teal-700 dark:text-teal-300 font-semibold">Chief Reason:</strong> {apt.reason}
                  </p>

                  {apt.notes && (
                    <p className="text-xs text-slate-500 italic">
                      Doctor Notes: "{apt.notes}"
                    </p>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                  {apt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleOpenStatusModal(apt, 'confirmed')}
                        className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => handleOpenStatusModal(apt, 'rejected')}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 dark:bg-slate-800 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </>
                  )}

                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleOpenStatusModal(apt, 'in-progress')}
                      className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <PlayCircle className="w-3.5 h-3.5" /> Start Visit
                    </button>
                  )}

                  {apt.status === 'in-progress' && (
                    <button
                      onClick={() => handleOpenStatusModal(apt, 'completed')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Complete Visit
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedApt(apt);
                      setActionNotes(apt.notes || '');
                      setStatusModalOpen(true);
                      setNewStatus(apt.status);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                  >
                    Edit Status / Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status / Notes Modal */}
      {statusModalOpen && selectedApt && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Appointment: ${selectedApt.appointmentNumber}`}
          subtitle={`Patient: ${selectedApt.patientName} (${selectedApt.date} @ ${selectedApt.timeSlot})`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Appointment Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as AppointmentStatus)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Notes / Remarks
              </label>
              <textarea
                rows={3}
                placeholder="Enter clinical instructions, diagnostic notes, or reasons..."
                value={actionNotes}
                onChange={e => setActionNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
