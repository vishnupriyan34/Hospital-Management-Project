import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/api';
import { Appointment, Doctor, Patient, Department, HospitalStats } from '../../types/index';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Building2,
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  ArrowUpRight,
  Activity,
  PlusCircle,
  BarChart3,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, apts, docs, depts] = await Promise.all([
        api.getHospitalStats(),
        api.getAppointments(),
        api.getDoctors(),
        api.getDepartments(),
      ]);
      setStats(statsData);
      setAppointments(apts);
      setDoctors(docs);
      setDepartments(depts);
    } catch (err: any) {
      showToast('error', 'Failed to load administrative analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5" />
            Hospital Administration Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 font-outfit">
            Hospital Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Real-time multi-department orchestration, staff allocation, patient influx, and clinical reporting.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('/admin/doctors')}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit"
          >
            <Stethoscope className="w-4 h-4" />
            Manage Staff
          </button>
          <button
            onClick={() => onNavigate('/admin/reports')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs sm:text-sm backdrop-blur-sm border border-white/20 transition-all active:scale-95 font-outfit"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics Reports
          </button>
        </div>

        {/* Glow */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Patients"
          value={stats?.totalPatients || 0}
          subtitle="Hospital wide registered"
          icon={Users}
          colorScheme="blue"
        />
        <StatCard
          title="Active Doctors"
          value={stats?.totalDoctors || 0}
          subtitle="Across 6 departments"
          icon={Stethoscope}
          colorScheme="teal"
        />
        <StatCard
          title="Total Consultations"
          value={stats?.totalAppointments || 0}
          subtitle="All-time appointment records"
          icon={Calendar}
          colorScheme="indigo"
        />
        <StatCard
          title="Clinical Departments"
          value={stats?.totalDepartments || 0}
          subtitle="Specialty divisions"
          icon={Building2}
          colorScheme="amber"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Pending Review</p>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              {stats?.pendingAppointments || 0}
            </h4>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Needs Doctor Confirmation</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Completed Visits</p>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              {stats?.completedAppointments || 0}
            </h4>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Fulfilled Consultations</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Consultation Revenue</p>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              ${stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '1,450'} USD
            </h4>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Total OPD Billings</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Appointments + Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Central Appointments */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Hospital Appointment Feed
            </h3>
            <button
              onClick={() => onNavigate('/admin/appointments')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              All Appointments →
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {appointments.slice(0, 5).map(apt => (
              <div
                key={apt.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {apt.appointmentNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white font-outfit">
                      {apt.patientName}
                    </h4>
                    <span className="text-slate-400">→</span>
                    <span className="font-semibold text-teal-700 dark:text-teal-300">
                      {apt.doctorName}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {apt.departmentName} • {apt.date} at {apt.timeSlot}
                  </p>
                </div>

                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Department Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Clinical Departments
            </h3>
            <button
              onClick={() => onNavigate('/admin/departments')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2.5">
            {departments.map(dept => (
              <div
                key={dept.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white font-outfit">
                    {dept.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">Head: {dept.headDoctorName}</p>
                </div>

                <span className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs">
                  {dept.doctorCount} Doctors
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
