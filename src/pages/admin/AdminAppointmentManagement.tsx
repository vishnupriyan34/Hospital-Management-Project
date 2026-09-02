import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Appointment, Doctor } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Stethoscope,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const AdminAppointmentManagement: React.FC = () => {
  const { showToast } = useNotifications();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  // Edit / Reassign Modal
  const [editingApt, setEditingApt] = useState<Appointment | null>(null);
  const [targetDoctorId, setTargetDoctorId] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [targetSlot, setTargetSlot] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<string>('confirmed');
  const [targetNotes, setTargetNotes] = useState<string>('');
  const [deleteAptId, setDeleteAptId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [apts, docs] = await Promise.all([
        api.getAppointments({ status: statusFilter }),
        api.getDoctors(),
      ]);
      setAppointments(apts);
      setDoctors(docs);
    } catch (err: any) {
      showToast('error', 'Failed to load appointments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleOpenEdit = (apt: Appointment) => {
    setEditingApt(apt);
    setTargetDoctorId(apt.doctorId);
    setTargetDate(apt.date);
    setTargetSlot(apt.timeSlot);
    setTargetStatus(apt.status);
    setTargetNotes(apt.notes || '');
  };

  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApt) return;

    setIsSubmitting(true);
    try {
      await api.updateAppointmentStatus(editingApt.id, targetStatus as any, targetNotes);
      showToast('success', 'Appointment record updated.');
      setEditingApt(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAptId) return;
    try {
      await api.deleteAppointment(deleteAptId);
      showToast('success', 'Appointment removed.');
      setDeleteAptId(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Delete failed.');
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      a.patientName.toLowerCase().includes(term) ||
      a.doctorName.toLowerCase().includes(term) ||
      a.appointmentNumber.toLowerCase().includes(term) ||
      a.departmentName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Appointment Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Hospital-wide appointment management, doctor reassignment, and status overrides.
          </p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient, physician, or appointment ref..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="all">All Appointment Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading central appointment records...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-outfit">No Appointments Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Physician & Dept</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                      {apt.appointmentNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white font-outfit">{apt.patientName}</p>
                      <p className="text-[11px] text-slate-400">{apt.patientPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{apt.doctorName}</p>
                      <p className="text-[11px] text-slate-400">{apt.departmentName}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      <p className="font-semibold">{apt.date}</p>
                      <p className="text-[11px] text-slate-500">{apt.timeSlot}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-500">
                      {apt.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(apt)}
                          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-lg"
                          title="Override Status / Notes"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteAptId(apt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                          title="Delete Appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingApt && (
        <Modal
          isOpen={!!editingApt}
          onClose={() => setEditingApt(null)}
          title={`Administrative Override: ${editingApt.appointmentNumber}`}
          subtitle={`Patient: ${editingApt.patientName} | Assigned Doctor: ${editingApt.doctorName}`}
        >
          <form onSubmit={handleSaveAppointment} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Status
              </label>
              <select
                value={targetStatus}
                onChange={e => setTargetStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
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
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Administrative / Clinical Notes
              </label>
              <textarea
                rows={3}
                value={targetNotes}
                onChange={e => setTargetNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingApt(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md"
              >
                Save Record
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteAptId}
        onClose={() => setDeleteAptId(null)}
        onConfirm={handleDelete}
        title="Delete Appointment Record"
        message="Are you sure you want to permanently delete this appointment from the hospital archives?"
        confirmText="Yes, Delete Record"
        variant="danger"
      />
    </div>
  );
};
