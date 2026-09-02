import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Department, Doctor } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Stethoscope,
  MapPin,
  Users
} from 'lucide-react';

export const AdminDepartmentManagement: React.FC = () => {
  const { showToast } = useNotifications();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteDeptId, setDeleteDeptId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [headDoctorName, setHeadDoctorName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [depts, docs] = await Promise.all([
        api.getDepartments(),
        api.getDoctors(),
      ]);
      setDepartments(depts);
      setDoctors(docs);
    } catch (err: any) {
      showToast('error', 'Failed to load department directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setHeadDoctorName(doctors.length > 0 ? doctors[0].name : 'Chief Medical Officer');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept);
    setName(dept.name);
    setDescription(dept.description);
    setHeadDoctorName(dept.headDoctorName);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast('error', 'Department name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingDept) {
        await api.updateDepartment(editingDept.id, {
          name,
          description,
          headDoctorName,
        });
        showToast('success', 'Department updated.');
      } else {
        await api.createDepartment({
          name,
          description,
          headDoctorName,
        });
        showToast('success', 'New clinical department created.');
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
    if (!deleteDeptId) return;
    try {
      await api.deleteDepartment(deleteDeptId);
      showToast('success', 'Department removed.');
      setDeleteDeptId(null);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Failed to remove department.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Clinical Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure hospital specialty wings, Department Heads, and staffing distribution.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Department Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-outfit">No Departments Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {dept.doctorCount || 0} Doctors
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                    HOD: {dept.headDoctorName}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(dept)}
                  className="p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl"
                  title="Edit Department"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteDeptId(dept.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  title="Delete Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingDept ? 'Edit Clinical Department' : 'Create New Department'}
          maxWidth="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Pulmonology & Respiratory Care"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Head of Department (HOD) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Sharma, MD"
                value={headDoctorName}
                onChange={e => setHeadDoctorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Clinical Overview / Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe specialty focus and clinical services..."
                value={description}
                onChange={e => setDescription(e.target.value)}
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
                {editingDept ? 'Save Changes' : 'Create Department'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteDeptId}
        onClose={() => setDeleteDeptId(null)}
        onConfirm={handleDelete}
        title="Remove Department"
        message="Are you sure you want to delete this clinical department? Associated doctor assignments may need updating."
        confirmText="Yes, Remove Department"
        variant="danger"
      />
    </div>
  );
};
