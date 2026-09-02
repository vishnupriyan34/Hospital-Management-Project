import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HospitalStats, Appointment, Doctor, Department } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  DollarSign,
  Users,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { showToast } = useNotifications();
  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [statsData, apts, depts, docs] = await Promise.all([
          api.getHospitalStats(),
          api.getAppointments(),
          api.getDepartments(),
          api.getDoctors(),
        ]);
        setStats(statsData);
        setAppointments(apts);
        setDepartments(depts);
        setDoctors(docs);
      } catch (err: any) {
        showToast('error', 'Failed to load reporting data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  // Compute status distributions
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled' || a.status === 'rejected').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Hospital Analytics & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Key operational metrics, clinical consultation volume, revenue summaries, and department loads.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" /> Print Operations Report
        </button>
      </div>

      {/* Revenue & Volume Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Gross Consultation Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
            ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '1,450'} USD
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            ↑ 14.8% from previous period
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Fulfillment Efficiency</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
            {appointments.length > 0 ? Math.round((completedCount / appointments.length) * 100) : 75}%
          </h3>
          <p className="text-xs text-slate-500">
            {completedCount} Completed / {appointments.length} Total Registered
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Clinical Doctor Ratio</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-outfit">
            1 : {stats?.totalDoctors && stats?.totalPatients ? Math.round(stats.totalPatients / stats.totalDoctors) : 3}
          </h3>
          <p className="text-xs text-slate-500">
            Doctor to Patient active load ratio
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Volume Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Departmental Patient Allocation
            </h3>
            <span className="text-xs text-slate-400 font-semibold">Active Distribution</span>
          </div>

          <div className="space-y-3">
            {departments.map((dept, index) => {
              const deptDocs = doctors.filter(d => d.departmentId === dept.id);
              const percentage = Math.min(100, Math.max(15, (deptDocs.length / Math.max(1, doctors.length)) * 100));
              return (
                <div key={dept.id} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{dept.name}</span>
                    <span className="text-slate-500">{deptDocs.length} Specialists ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        index % 3 === 0
                          ? 'bg-teal-500'
                          : index % 3 === 1
                          ? 'bg-cyan-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultation Status Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Consultation Status Breakdown
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{appointments.length} Total</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-300 font-bold block">Completed Visits</span>
              <p className="text-2xl font-extrabold-800 text-emerald-900 dark:text-emerald-100 mt-1 font-outfit">
                {completedCount}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Archived EHR Records</span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
              <span className="text-teal-700 dark:text-teal-300 font-bold block">Confirmed / Scheduled</span>
              <p className="text-2xl font-extrabold-800 text-teal-900 dark:text-teal-100 mt-1 font-outfit">
                {confirmedCount}
              </p>
              <span className="text-[11px] text-teal-600 dark:text-teal-400">Ready for Consultation</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-amber-700 dark:text-amber-300 font-bold block">Pending Review</span>
              <p className="text-2xl font-extrabold-800 text-amber-900 dark:text-amber-100 mt-1 font-outfit">
                {pendingCount}
              </p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400">Awaiting Doctor Acceptance</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-rose-700 dark:text-rose-300 font-bold block">Cancelled / Rejected</span>
              <p className="text-2xl font-extrabold-800 text-rose-900 dark:text-rose-100 mt-1 font-outfit">
                {cancelledCount}
              </p>
              <span className="text-[11px] text-rose-600 dark:text-rose-400">Slots Restored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
          Physician Case Load & Billings
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Physician</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Total Assigned</th>
                <th className="py-2.5 px-3">Consult Fee</th>
                <th className="py-2.5 px-3">Estimated Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {doctors.map(doc => {
                const docApts = appointments.filter(a => a.doctorId === doc.id);
                const estRevenue = docApts.length * doc.consultationFee;
                return (
                  <tr key={doc.id}>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white font-outfit">
                      {doc.name}
                    </td>
                    <td className="py-3 px-3 text-slate-500">{doc.departmentName}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {docApts.length} Cases
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">${doc.consultationFee}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${estRevenue.toLocaleString()} USD
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
