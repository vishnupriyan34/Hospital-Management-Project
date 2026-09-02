export type UserRole = 'admin' | 'doctor' | 'patient';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  phone?: string;
}

export interface DoctorScheduleDay {
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '17:00'
  slotDurationMinutes: number; // 30
  isAvailable: boolean;
  breakStartTime?: string; // '13:00'
  breakEndTime?: string; // '14:00'
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  specialization: string;
  qualification?: string;
  qualifications?: string;
  experienceYears?: number;
  experience?: string;
  licenseNumber: string;
  consultationFee: number;
  about: string;
  avatar: string;
  rating: number;
  reviewCount?: number;
  availableDays: string[];
  availableTime?: string;
  slotDurationMinutes?: number;
  schedule?: DoctorScheduleDay[];
  leaveDates?: string[];
  unavailableDates?: string[];
  status: 'active' | 'inactive';
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth?: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  allergies: string[];
  medicalHistorySummary: string;
  status: 'active' | 'inactive';
  registeredAt?: string;
  assignedDoctorId?: string;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  description: string;
  iconName?: string;
  headDoctorId?: string;
  headDoctorName?: string;
  doctorCount: number;
  active?: boolean;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  departmentId: string;
  departmentName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:00 AM - 10:30 AM"
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface LabReport {
  id?: string;
  title: string;
  date?: string;
  result: string;
  normalRange?: string;
  status?: 'Normal' | 'Abnormal' | 'Critical';
}

export interface MedicalRecord {
  id: string;
  recordNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  appointmentId?: string;
  visitDate: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  medicalNotes: string;
  followUpDate?: string;
  labReports?: LabReport[];
  createdAt: string;
}

export interface PrescriptionMedicine {
  id?: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "1-0-1 (Twice daily)"
  duration: string; // e.g. "5 days"
  instructions: string; // "Take after meals with warm water"
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorQualification: string;
  doctorDepartment?: string;
  doctorLicense: string;
  departmentName: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  advice?: string;
  followUpDate?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'prescription' | 'medical-record';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface HospitalSettings {
  name: string;
  tagline: string;
  footerCredit?: string;
  logoUrl?: string;
  address: string;
  phone: string;
  email: string;
  emergencyPhone: string;
  emergencyContact?: string;
  website: string;
  workingHours?: string;
  opdTimings: string;
  consultationSlotMinutes?: number;
  enableAutoConfirm?: boolean;
  maxAdvanceBookingDays?: number;
  prescriptionFooter: string;
}

export type HospitalInfo = HospitalSettings;

export interface HospitalStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalDepartments: number;
  todayAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  doctorProfile?: Doctor;
  patientProfile?: Patient;
}

export interface AnalyticsReport {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalDepartments: number;
  todayAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  revenueTotal: number;
  monthlyGrowth: { month: string; patients: number; appointments: number; revenue: number }[];
  appointmentStatusBreakdown: { status: string; count: number; percentage: number }[];
  departmentStats: { name: string; doctorCount: number; patientCount: number; appointmentCount: number }[];
  doctorPerformance: { name: string; department: string; appointments: number; rating: number }[];
}
