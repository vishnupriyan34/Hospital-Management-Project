import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DashboardLayout } from './components/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorAppointments } from './pages/doctor/DoctorAppointments';
import { DoctorPatientRecords } from './pages/doctor/DoctorPatientRecords';
import { DoctorDiagnosis } from './pages/doctor/DoctorDiagnosis';
import { DoctorPrescriptions } from './pages/doctor/DoctorPrescriptions';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { DoctorProfile } from './pages/doctor/DoctorProfile';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientBookAppointment } from './pages/patient/PatientBookAppointment';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientMedicalRecords } from './pages/patient/PatientMedicalRecords';
import { PatientPrescriptions } from './pages/patient/PatientPrescriptions';
import { PatientDoctors } from './pages/patient/PatientDoctors';
import { PatientProfile } from './pages/patient/PatientProfile';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDoctorManagement } from './pages/admin/AdminDoctorManagement';
import { AdminPatientManagement } from './pages/admin/AdminPatientManagement';
import { AdminAppointmentManagement } from './pages/admin/AdminAppointmentManagement';
import { AdminDepartmentManagement } from './pages/admin/AdminDepartmentManagement';
import { AdminUserManagement } from './pages/admin/AdminUserManagement';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminHospitalSettings } from './pages/admin/AdminHospitalSettings';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('');

  // Default path per role
  useEffect(() => {
    if (user) {
      if (user.role === 'doctor') {
        setCurrentPath('/doctor/dashboard');
      } else if (user.role === 'patient') {
        setCurrentPath('/patient/dashboard');
      } else if (user.role === 'admin') {
        setCurrentPath('/admin/dashboard');
      }
    }
  }, [user?.role]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wider font-outfit text-teal-400">
          Loading MediNexus Healthcare System...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Render view based on role and path
  const renderCurrentView = () => {
    // DOCTOR ROLE
    if (user.role === 'doctor') {
      switch (currentPath) {
        case '/doctor/dashboard':
          return <DoctorDashboard onNavigate={handleNavigate} />;
        case '/doctor/appointments':
          return <DoctorAppointments onNavigate={handleNavigate} />;
        case '/doctor/patient-records':
          return <DoctorPatientRecords onNavigate={handleNavigate} />;
        case '/doctor/diagnosis':
          return <DoctorDiagnosis onNavigate={handleNavigate} />;
        case '/doctor/prescriptions':
          return <DoctorPrescriptions onNavigate={handleNavigate} />;
        case '/doctor/schedule':
          return <DoctorSchedule />;
        case '/doctor/profile':
          return <DoctorProfile />;
        default:
          return <DoctorDashboard onNavigate={handleNavigate} />;
      }
    }

    // PATIENT ROLE
    if (user.role === 'patient') {
      switch (currentPath) {
        case '/patient/dashboard':
          return <PatientDashboard onNavigate={handleNavigate} />;
        case '/patient/book-appointment':
          return <PatientBookAppointment onNavigate={handleNavigate} />;
        case '/patient/appointments':
          return <PatientAppointments onNavigate={handleNavigate} />;
        case '/patient/medical-records':
          return <PatientMedicalRecords />;
        case '/patient/prescriptions':
          return <PatientPrescriptions />;
        case '/patient/doctors':
          return <PatientDoctors onNavigate={handleNavigate} />;
        case '/patient/profile':
          return <PatientProfile />;
        default:
          return <PatientDashboard onNavigate={handleNavigate} />;
      }
    }

    // ADMIN ROLE
    if (user.role === 'admin') {
      switch (currentPath) {
        case '/admin/dashboard':
          return <AdminDashboard onNavigate={handleNavigate} />;
        case '/admin/doctors':
          return <AdminDoctorManagement />;
        case '/admin/patients':
          return <AdminPatientManagement />;
        case '/admin/appointments':
          return <AdminAppointmentManagement />;
        case '/admin/departments':
          return <AdminDepartmentManagement />;
        case '/admin/users':
          return <AdminUserManagement />;
        case '/admin/reports':
          return <AdminReports />;
        case '/admin/settings':
          return <AdminHospitalSettings />;
        default:
          return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    return <div>Unauthorized access.</div>;
  };

  return (
    <DashboardLayout currentPath={currentPath} onNavigate={handleNavigate}>
      {renderCurrentView()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
