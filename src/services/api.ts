import {
  AuthResponse,
  User,
  Doctor,
  Patient,
  Department,
  Appointment,
  MedicalRecord,
  Prescription,
  NotificationItem,
  HospitalSettings,
  HospitalInfo,
  HospitalStats,
  AnalyticsReport,
  UserRole
} from '../types/index';

const API_BASE = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('medinexus_token');
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // --- AUTH ---
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<AuthResponse>(res);
    localStorage.setItem('medinexus_token', data.token);
    return data;
  }

  async register(formData: any): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await this.handleResponse<AuthResponse>(res);
    localStorage.setItem('medinexus_token', data.token);
    return data;
  }

  async getMe(): Promise<{ user: User; doctorProfile?: Doctor; patientProfile?: Patient }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  logout() {
    localStorage.removeItem('medinexus_token');
  }

  // --- DOCTORS ---
  async getDoctors(params?: { departmentId?: string; search?: string }): Promise<Doctor[]> {
    const query = new URLSearchParams();
    if (params?.departmentId) query.append('departmentId', params.departmentId);
    if (params?.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/doctors?${query.toString()}`);
    return this.handleResponse(res);
  }

  async getDoctor(id: string): Promise<Doctor> {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    return this.handleResponse(res);
  }

  async getDoctorSlots(doctorId: string, date: string): Promise<{ time: string; available: boolean }[]> {
    const res = await fetch(`${API_BASE}/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createDoctor(data: Partial<Doctor>): Promise<Doctor> {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    return this.handleResponse(res);
  }

  async updateDoctorSchedule(id: string, scheduleData: { availableDays?: string[]; availableTime?: string; slotDurationMinutes?: number; unavailableDates?: string[] }): Promise<Doctor> {
    const res = await fetch(`${API_BASE}/doctors/${id}/schedule`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(scheduleData),
    });
    return this.handleResponse(res);
  }

  async deleteDoctor(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  // --- PATIENTS ---
  async getPatients(search?: string): Promise<Patient[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${API_BASE}/patients${query}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async getPatient(id: string): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    return this.handleResponse(res);
  }

  async deletePatient(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  // --- APPOINTMENTS ---
  async getAppointments(params?: { status?: string; date?: string; doctorId?: string; patientId?: string }): Promise<Appointment[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.date) query.append('date', params.date);
    if (params?.doctorId) query.append('doctorId', params.doctorId);
    if (params?.patientId) query.append('patientId', params.patientId);

    const res = await fetch(`${API_BASE}/appointments?${query.toString()}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateAppointmentStatus(id: string, status: Appointment['status'], notes?: string, cancellationReason?: string): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, notes, cancellationReason }),
    });
    return this.handleResponse(res);
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  // --- MEDICAL RECORDS ---
  async getMedicalRecords(patientId?: string): Promise<MedicalRecord[]> {
    const query = patientId ? `?patientId=${patientId}` : '';
    const res = await fetch(`${API_BASE}/medical-records${query}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const res = await fetch(`${API_BASE}/medical-records`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  // --- PRESCRIPTIONS ---
  async getPrescriptions(patientId?: string): Promise<Prescription[]> {
    const query = patientId ? `?patientId=${patientId}` : '';
    const res = await fetch(`${API_BASE}/prescriptions${query}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async createPrescription(data: Partial<Prescription>): Promise<Prescription> {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  // --- DEPARTMENTS ---
  async getDepartments(): Promise<Department[]> {
    const res = await fetch(`${API_BASE}/departments`);
    return this.handleResponse(res);
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(res);
  }

  async deleteDepartment(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/departments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  // --- REPORTS & STATS ---
  async getReports(): Promise<AnalyticsReport> {
    const res = await fetch(`${API_BASE}/reports`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async getHospitalStats(): Promise<HospitalStats> {
    const res = await fetch(`${API_BASE}/hospital-stats`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  // --- SETTINGS / HOSPITAL INFO ---
  async getHospitalInfo(): Promise<HospitalInfo> {
    const res = await fetch(`${API_BASE}/settings`);
    return this.handleResponse(res);
  }

  async updateHospitalInfo(settings: Partial<HospitalInfo>): Promise<HospitalInfo> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });
    return this.handleResponse(res);
  }

  // --- USERS ---
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ role }),
    });
    return this.handleResponse(res);
  }

  async resetUserPassword(id: string, newPass: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/users/${id}/password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ password: newPass }),
    });
    return this.handleResponse(res);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(res);
  }
}

export const api = new ApiService();
