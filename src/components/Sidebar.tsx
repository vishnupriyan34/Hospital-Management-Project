import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Clock,
  User,
  Settings,
  PlusCircle,
  Building2,
  BarChart3,
  Stethoscope,
  LogOut,
  HeartPulse,
  Pill,
  ClipboardList,
  ShieldCheck,
  CalendarPlus,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpen = false,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const role = user?.role || 'patient';

  // Role-Specific Navigation Menu Configs
  const doctorNav = [
    { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'Patient Records', path: '/doctor/patients', icon: Users },
    { name: 'Diagnosis', path: '/doctor/diagnosis', icon: ClipboardList },
    { name: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
    { name: 'Schedule Management', path: '/doctor/schedule', icon: Clock },
    { name: 'My Profile', path: '/doctor/profile', icon: User },
  ];

  const patientNav = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus, highlight: true },
    { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Medical Records', path: '/patient/medical-records', icon: FileText },
    { name: 'My Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { name: 'Browse Doctors', path: '/patient/doctors', icon: Stethoscope },
    { name: 'My Health Profile', path: '/patient/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Overview Analytics', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Doctor Management', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Patient Management', path: '/admin/patients', icon: Users },
    { name: 'Appointment Central', path: '/admin/appointments', icon: Calendar },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'User Directory', path: '/admin/users', icon: UserCheck },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Hospital Settings', path: '/admin/settings', icon: Settings },
  ];

  let currentNav = patientNav;
  if (role === 'doctor') currentNav = doctorNav;
  if (role === 'admin') currentNav = adminNav;

  const handleItemClick = (path: string) => {
    onNavigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        id="app-sidebar"
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Mobile Top Brand (only visible in mobile drawer) */}
          <div className="lg:hidden flex items-center justify-between pb-4 mb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-extrabold-800 text-sm">
                M
              </div>
              <span className="font-extrabold-800 text-lg text-slate-900 dark:text-white font-outfit">
                MediNexus
              </span>
            </div>
          </div>

          {/* Section Header */}
          <div className="px-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {role === 'admin' ? 'Administration Portal' : role === 'doctor' ? 'Clinical Workspace' : 'Patient Care Portal'}
            </p>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {currentNav.map(item => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path) && item.path.split('/').length > 2);

              return (
                <button
                  key={item.path}
                  id={`nav-link-${item.path.replace(/\//g, '-')}`}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
                      : item.highlight
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Quick Info & Sign out */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm text-white shadow-xs flex-shrink-0 ${
                  user?.role === 'admin'
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : user?.role === 'doctor'
                    ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
                    : 'bg-gradient-to-br from-cyan-500 to-teal-600'
                }`}
              >
                {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-outfit">
                  {user?.name}
                </p>
                <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider">
                  {user?.role}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
