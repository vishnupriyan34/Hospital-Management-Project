import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Doctor, Department } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Stethoscope,
  Plus,
  Search,
  Building2,
  Edit2,
  Trash2,
  Phone,
  Mail,
  DollarSign,
  Star,
  Award,
  CheckCircle2
} from 'lucide-react';

export const AdminDoctorManagement: React.FC = () => {
  const { showToast } = useNotifications();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [qualifications, setQualifications] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [consultationFee, setConsultationFee] = useState<number>(100);
  const [about, setAbout] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [docs, depts] = await Promise.all([
        api.getDoctors(),
        api.getDepartments(),
      ]);
      setDoctors(docs);
      setDepartments(depts);
      if (depts.length > 0 && !departmentId) {
        setDepartmentId(depts[0].id);
      }
    } catch (err: any) {
      showToast('error', 'Failed to load doctors.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setName('');
    setEmail('');
    setPhone('+91 ');
    setSpecialization('');
    setQualifications('MBBS, MD');
    setExperience('5 Years Experience');
    setConsultationFee(100);
    setAbout('');
    setLicenseNumber('MCI-REG-');
    if (departments.length > 0) setDepartmentId(departments[0].id);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setName(doc.name);
    setEmail(doc.email);
    setPhone(doc.phone);
    setDepartmentId(doc.departmentId);
    setSpecialization(doc.specialization);
    setQualifications(doc.qualifications);
    setExperience(doc.experience);
    setConsultationFee(doc.consultationFee);
    setAbout(doc.about);
    setLicenseNumber(doc.licenseNumber);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !departmentId || !specialization) {
      showToast('error', 'Please fill in all required fields.');
      return;
    }

    const dept = departments.find(d => d.id === departmentId);
    const departmentName = dept ? dept.name : 'General Medicine';

    setIsSubmitting(true);
    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id, {
          name,
          phone,
          departmentId,
          departmentName,
          specialization,
          qualifications,
          experience,
          consultationFee: Number(consultationFee),
          about,
          licenseNumber,
        });
        showToast('success', 'Doctor profile updated.');
      } else {
        await api.createDoctor({
          name,
          email,
          phone,
          departmentId,
          departmentName,
          specialization,
          qualifications,
          experience,
          consultationFee: Number(consultationFee),
          about,
          licenseNumber,
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          availableTime: '09:00 AM - 05:00 PM',
          slotDurationMinutes: 20,
        });
        showToast('success', 'New doctor added to medical registry.');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Operation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDoctorId) return;
    try {
      await api.deleteDoctor(deleteDoctorId);
      showToast('success', 'Doctor removed from directory.');
      setDeleteDoctorId(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete doctor.');
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchDept = deptFilter === 'all' || doc.departmentId === deptFilter;
    const matchSearch = !search ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Medical Staff & Doctors
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage hospital clinicians, departmental assignments, and consultation rates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit"
        >
          <Plus className="w-4 h-4" /> Add New Physician
        </button>
      </div>

      {/* Filter & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by physician name, email, or specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div className="relative">
          <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full p-12 text-center">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading doctor profiles...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800">
            <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-outfit">No Doctors Found</p>
          </div>
        ) : (
          filteredDoctors.map(doc => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm flex-shrink-0 border border-teal-400/40">
                    {doc.name.replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {doc.specialization}
                    </p>
                    <p className="text-[11px] text-slate-500">{doc.departmentName}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <p><strong>Fee:</strong> ${doc.consultationFee} USD</p>
                  <p><strong>Phone:</strong> {doc.phone}</p>
                  <p><strong>License:</strong> {doc.licenseNumber}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl transition-colors"
                  title="Edit Doctor"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteDoctorId(doc.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                  title="Delete Doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Doctor Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingDoctor ? 'Edit Doctor Profile' : 'Register New Medical Doctor'}
          subtitle="All clinicians must hold a valid state medical council registration."
          maxWidth="2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name with Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Kavita Nair, MD"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingDoctor}
                  placeholder="doctor@medinexus.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department *
                </label>
                <select
                  value={departmentId}
                  onChange={e => setDepartmentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Specialization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Interventional Cardiologist"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Qualifications
                </label>
                <input
                  type="text"
                  placeholder="MBBS, MD, DM, FACC"
                  value={qualifications}
                  onChange={e => setQualifications(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  placeholder="10+ Years Experience"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Consultation Fee ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={e => setConsultationFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medical License / Registration Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Biography / Summary
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={e => setAbout(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md"
              >
                {editingDoctor ? 'Save Changes' : 'Create Doctor'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteDoctorId}
        onClose={() => setDeleteDoctorId(null)}
        onConfirm={handleDelete}
        title="Remove Doctor"
        message="Are you sure you want to remove this doctor from the hospital directory? Associated records will be preserved."
        confirmText="Yes, Remove Doctor"
        variant="danger"
      />
    </div>
  );
};
