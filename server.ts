import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/models/db.js';
import { User, UserRole } from './src/types/index.js';

// Extend Express Request type for authenticated user
interface AuthRequest extends Request {
  user?: User;
}

// Simple token generator / validator for demo & security
function generateToken(user: User): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token: string): User | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);
    if (!payload.id) return null;
    const user = db.getUserById(payload.id);
    return user || null;
  } catch (e) {
    return null;
  }
}

// Auth Middleware
function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user || user.status === 'inactive') {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  req.user = user;
  next();
}

// Role-based Authorization Middleware
function requireRoles(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to perform this action.' });
    }
    next();
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'MediNexus Hospital Management API', timestamp: new Date().toISOString() });
  });

  // --- AUTHENTICATION ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!db.validatePassword(email, password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Your account has been deactivated. Please contact hospital administration.' });
    }

    const token = generateToken(user);
    const doctorProfile = user.role === 'doctor' ? db.getDoctorByUserId(user.id) : undefined;
    const patientProfile = user.role === 'patient' ? db.getPatientByUserId(user.id) : undefined;

    res.json({
      token,
      user,
      doctorProfile,
      patientProfile,
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role, phone, age, gender, specialization, departmentId, qualification } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    // Support registering Patient, Doctor, or Hospital Admin
    if (!['patient', 'doctor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user role selected.' });
    }

    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must contain at least 6 characters.' });
    }

    const newUser = db.createUser(
      {
        name,
        email,
        role,
        phone,
      },
      password
    );

    let doctorProfile;
    let patientProfile;

    if (role === 'doctor') {
      const dept = db.getAllDepartments().find(d => d.id === departmentId) || db.getAllDepartments()[0];
      doctorProfile = db.createDoctor({
        userId: newUser.id,
        name,
        email,
        phone: phone || '',
        departmentId: dept?.id || 'dept-1',
        departmentName: dept?.name || 'General Medicine',
        specialization: specialization || 'General Physician',
        qualification: qualification || 'MBBS, MD',
        consultationFee: 600,
      });
    } else if (role === 'patient') {
      patientProfile = db.createPatient({
        userId: newUser.id,
        name,
        email,
        phone: phone || '',
        age: age ? Number(age) : 25,
        gender: gender || 'Male',
      });
    }

    const token = generateToken(newUser);

    // Notify Admin of registration
    db.createNotification({
      userId: 'usr-admin',
      role: 'admin',
      title: `New ${role.toUpperCase()} Registration`,
      message: `${name} registered as a new ${role}.`,
      type: 'info',
      link: role === 'doctor' ? '/admin/doctors' : '/admin/patients',
    });

    res.status(201).json({
      token,
      user: newUser,
      doctorProfile,
      patientProfile,
    });
  });

  app.get('/api/auth/me', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const doctorProfile = user.role === 'doctor' ? db.getDoctorByUserId(user.id) : undefined;
    const patientProfile = user.role === 'patient' ? db.getPatientByUserId(user.id) : undefined;

    res.json({
      user,
      doctorProfile,
      patientProfile,
    });
  });

  // --- DOCTORS ---
  app.get('/api/doctors', (req, res) => {
    const { departmentId, search } = req.query;
    let docs = db.getAllDoctors();

    if (departmentId && typeof departmentId === 'string' && departmentId !== 'all') {
      docs = docs.filter(d => d.departmentId === departmentId);
    }

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      docs = docs.filter(d => 
        d.name.toLowerCase().includes(s) || 
        d.specialization.toLowerCase().includes(s) || 
        d.departmentName.toLowerCase().includes(s)
      );
    }

    res.json(docs);
  });

  app.get('/api/doctors/:id', (req, res) => {
    const doc = db.getDoctorById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doc);
  });

  // Get dynamic slot availability for a doctor on a specific date
  app.get('/api/doctors/:id/slots', (req, res) => {
    const { id } = req.params;
    const { date } = req.query;
    const doc = db.getDoctorById(id);
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });

    const targetDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];
    const existingAppointments = db.getAppointmentsByDoctorId(id).filter(
      a => a.date === targetDate && a.status !== 'cancelled' && a.status !== 'rejected'
    );
    const bookedTimes = new Set(existingAppointments.map(a => a.timeSlot.split(' - ')[0].trim()));

    // Generate standard working slots: 09:00 AM to 05:00 PM
    const allTimes = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    const slots = allTimes.map(time => ({
      time,
      available: !bookedTimes.has(time) && !doc.leaveDates?.includes(targetDate)
    }));

    res.json(slots);
  });

  app.post('/api/doctors', authenticate, requireRoles('admin'), (req, res) => {
    const { name, email, password, phone, departmentId, specialization, qualification, qualifications, experienceYears, experience, consultationFee, about, licenseNumber } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Doctor name and email are required.' });
    }

    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const newUser = db.createUser({
      name,
      email,
      role: 'doctor',
      phone,
    }, password || 'doctor123');

    const dept = db.getAllDepartments().find(d => d.id === departmentId) || db.getAllDepartments()[0];

    const doctor = db.createDoctor({
      userId: newUser.id,
      name,
      email,
      phone,
      departmentId: dept?.id,
      departmentName: dept?.name,
      specialization: specialization || 'Consultant Specialist',
      qualification: qualification || qualifications || 'MBBS, MD',
      experienceYears: Number(experienceYears) || Number(experience) || 5,
      licenseNumber: licenseNumber || `MCI-${Math.floor(10000 + Math.random() * 90000)}`,
      consultationFee: Number(consultationFee) || 700,
      about,
    });

    res.status(201).json(doctor);
  });

  app.put('/api/doctors/:id', authenticate, (req: AuthRequest, res) => {
    const { id } = req.params;
    const user = req.user!;
    const doc = db.getDoctorById(id);

    if (!doc) return res.status(404).json({ error: 'Doctor not found.' });

    // Authorization: only the doctor themselves or an admin can update doctor profile/schedule
    if (user.role !== 'admin' && doc.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this doctor profile.' });
    }

    const updated = db.updateDoctor(id, req.body);
    res.json(updated);
  });

  app.put('/api/doctors/:id/schedule', authenticate, (req: AuthRequest, res) => {
    const { id } = req.params;
    const user = req.user!;
    const doc = db.getDoctorById(id);

    if (!doc) return res.status(404).json({ error: 'Doctor not found.' });

    if (user.role !== 'admin' && doc.userId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const updated = db.updateDoctor(id, req.body);
    res.json(updated);
  });

  app.delete('/api/doctors/:id', authenticate, requireRoles('admin'), (req, res) => {
    const success = db.deleteDoctor(req.params.id);
    if (!success) return res.status(404).json({ error: 'Doctor not found.' });
    res.json({ message: 'Doctor deleted successfully.' });
  });

  // --- PATIENTS ---
  app.get('/api/patients', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const { search } = req.query;
    let list: any[] = [];

    if (user.role === 'admin') {
      list = db.getAllPatients();
    } else if (user.role === 'doctor') {
      const doctor = db.getDoctorByUserId(user.id);
      if (!doctor) return res.json([]);
      if (req.query.scope === 'all') {
        list = db.getAllPatients();
      } else {
        const doctorAppointments = db.getAppointmentsByDoctorId(doctor.id);
        const doctorPatientIds = new Set(doctorAppointments.map(a => a.patientId));
        list = db.getAllPatients().filter(p => doctorPatientIds.has(p.id) || p.assignedDoctorId === doctor.id);
        // If doctor has no assigned or booked patients yet, fallback to hospital patient list so doctor can diagnose/prescribe
        if (list.length === 0) {
          list = db.getAllPatients();
        }
      }
    } else if (user.role === 'patient') {
      const self = db.getPatientByUserId(user.id);
      list = self ? [self] : [];
    }

    if (search && typeof search === 'string') {
      const s = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.phone.includes(s) || p.email.toLowerCase().includes(s));
    }

    res.json(list);
  });

  app.get('/api/patients/:id', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const patient = db.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    if (user.role === 'patient') {
      const self = db.getPatientByUserId(user.id);
      if (!self || self.id !== patient.id) {
        return res.status(403).json({ error: 'Access forbidden. You may only view your own patient file.' });
      }
    } else if (user.role === 'doctor') {
      const doctor = db.getDoctorByUserId(user.id);
      const hasRelation = doctor && (patient.assignedDoctorId === doctor.id || db.getAppointmentsByDoctorId(doctor.id).some(a => a.patientId === patient.id));
      if (!hasRelation) {
        return res.status(403).json({ error: 'Access forbidden. You can only access records of patients assigned to you.' });
      }
    }

    res.json(patient);
  });

  app.post('/api/patients', authenticate, requireRoles('admin'), (req, res) => {
    const { name, email, phone, age, gender, bloodGroup, address, emergencyContactName, emergencyContactPhone, allergies } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

    const newUser = db.createUser({
      name,
      email,
      role: 'patient',
      phone,
    }, 'patient123');

    const patient = db.createPatient({
      userId: newUser.id,
      name,
      email,
      phone,
      age: Number(age) || 30,
      gender: gender || 'Male',
      bloodGroup: bloodGroup || 'O+',
      address,
      emergencyContactName,
      emergencyContactPhone,
      allergies: Array.isArray(allergies) ? allergies : allergies ? [allergies] : [],
    });

    res.status(201).json(patient);
  });

  app.put('/api/patients/:id', authenticate, (req: AuthRequest, res) => {
    const { id } = req.params;
    const user = req.user!;
    const patient = db.getPatientById(id);

    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    if (user.role === 'patient') {
      const self = db.getPatientByUserId(user.id);
      if (!self || self.id !== patient.id) {
        return res.status(403).json({ error: 'You may only update your own profile.' });
      }
    } else if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const updated = db.updatePatient(id, req.body);
    res.json(updated);
  });

  app.delete('/api/patients/:id', authenticate, requireRoles('admin'), (req, res) => {
    const success = db.deletePatient(req.params.id);
    if (!success) return res.status(404).json({ error: 'Patient not found.' });
    res.json({ message: 'Patient removed successfully.' });
  });

  // --- APPOINTMENTS ---
  app.get('/api/appointments', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const { status, date, doctorId, patientId } = req.query;
    let list: any[] = [];

    if (user.role === 'admin') {
      list = db.getAllAppointments();
    } else if (user.role === 'doctor') {
      const doctor = db.getDoctorByUserId(user.id);
      list = doctor ? db.getAppointmentsByDoctorId(doctor.id) : [];
    } else if (user.role === 'patient') {
      const patient = db.getPatientByUserId(user.id);
      list = patient ? db.getAppointmentsByPatientId(patient.id) : [];
    }

    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(a => a.status === status);
    }
    if (date && typeof date === 'string') {
      list = list.filter(a => a.date === date);
    }
    if (doctorId && typeof doctorId === 'string' && doctorId !== 'all') {
      list = list.filter(a => a.doctorId === doctorId);
    }
    if (patientId && typeof patientId === 'string') {
      list = list.filter(a => a.patientId === patientId);
    }

    // Sort by latest date/time
    list.sort((a, b) => new Date(b.date + ' ' + b.timeSlot.split(' - ')[0]).getTime() - new Date(a.date + ' ' + a.timeSlot.split(' - ')[0]).getTime());

    res.json(list);
  });

  app.post('/api/appointments', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const { doctorId, date, timeSlot, reason, departmentId, patientId, notes } = req.body;

    if (!doctorId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Doctor, Date, and Time Slot are required.' });
    }

    // Check for double booking with same doctor at same date & slot
    const existing = db.getAllAppointments().find(a => 
      a.doctorId === doctorId && 
      a.date === date && 
      a.timeSlot === timeSlot && 
      a.status !== 'cancelled' && 
      a.status !== 'rejected'
    );

    if (existing) {
      return res.status(409).json({ error: 'This time slot has just been booked. Please choose another available slot.' });
    }

    const doctor = db.getDoctorById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Selected doctor not found.' });

    let targetPatient = db.getPatientById(patientId);
    if (user.role === 'patient') {
      targetPatient = db.getPatientByUserId(user.id);
    }

    if (!targetPatient) {
      return res.status(400).json({ error: 'Patient profile not found.' });
    }

    const newApt = db.createAppointment({
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      patientAge: targetPatient.age,
      patientGender: targetPatient.gender,
      patientPhone: targetPatient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      departmentId: departmentId || doctor.departmentId,
      departmentName: doctor.departmentName,
      date,
      timeSlot,
      reason: reason || 'Routine Consultation',
      notes,
      fee: doctor.consultationFee,
    });

    res.status(201).json(newApt);
  });

  app.put('/api/appointments/:id', authenticate, (req: AuthRequest, res) => {
    const { id } = req.params;
    const { status, notes, cancellationReason } = req.body;
    const user = req.user!;

    const apt = db.getAllAppointments().find(a => a.id === id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found.' });

    if (user.role === 'patient') {
      const patient = db.getPatientByUserId(user.id);
      if (!patient || patient.id !== apt.patientId) {
        return res.status(403).json({ error: 'Unauthorized.' });
      }
      if (status && status !== 'cancelled') {
        return res.status(403).json({ error: 'Patients can only cancel appointments.' });
      }
    } else if (user.role === 'doctor') {
      const doctor = db.getDoctorByUserId(user.id);
      if (!doctor || doctor.id !== apt.doctorId) {
        return res.status(403).json({ error: 'Unauthorized.' });
      }
    }

    const updated = db.updateAppointmentStatus(id, status, notes, cancellationReason);
    res.json(updated);
  });

  app.delete('/api/appointments/:id', authenticate, requireRoles('admin'), (req, res) => {
    const idx = db.appointments.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Appointment not found.' });
    db.appointments.splice(idx, 1);
    res.json({ message: 'Appointment deleted successfully.' });
  });

  // --- MEDICAL RECORDS ---
  app.get('/api/medical-records', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const { patientId } = req.query;

    if (user.role === 'patient') {
      const patient = db.getPatientByUserId(user.id);
      return res.json(patient ? db.getMedicalRecordsByPatientId(patient.id) : []);
    } else if (user.role === 'doctor') {
      const doctor = db.getDoctorByUserId(user.id);
      if (!doctor) return res.json([]);
      if (patientId && typeof patientId === 'string') {
        return res.json(db.getMedicalRecordsByPatientId(patientId));
      }
      return res.json(db.getMedicalRecordsByDoctorId(doctor.id));
    } else if (user.role === 'admin') {
      if (patientId && typeof patientId === 'string') {
        return res.json(db.getMedicalRecordsByPatientId(patientId));
      }
      return res.json(db.getAllMedicalRecords());
    }

    res.json([]);
  });

  app.post('/api/medical-records', authenticate, requireRoles('doctor', 'admin'), (req: AuthRequest, res) => {
    const user = req.user!;
    const { patientId, visitDate, symptoms, diagnosis, treatment, medicalNotes, followUpDate, labReports, appointmentId } = req.body;

    if (!patientId || !diagnosis) {
      return res.status(400).json({ error: 'Patient ID and Diagnosis are required.' });
    }

    const patient = db.getPatientById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    let doctor = db.getDoctorByUserId(user.id);
    if (!doctor && user.role === 'admin') {
      doctor = db.getAllDoctors()[0];
    }

    const record = db.createMedicalRecord({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor?.id || 'doc-1',
      doctorName: doctor?.name || 'Chief Consultant',
      departmentName: doctor?.departmentName || 'General Medicine',
      appointmentId,
      visitDate: visitDate || new Date().toISOString().split('T')[0],
      symptoms: Array.isArray(symptoms) ? symptoms : typeof symptoms === 'string' ? symptoms.split(',').map(s => s.trim()) : [],
      diagnosis,
      treatment: treatment || '',
      medicalNotes: medicalNotes || '',
      followUpDate,
      labReports: labReports || [],
    });

    res.status(201).json(record);
  });

  // --- PRESCRIPTIONS ---
  app.get('/api/prescriptions', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const { patientId } = req.query;

    if (user.role === 'patient') {
      const patient = db.getPatientByUserId(user.id);
      return res.json(patient ? db.getPrescriptionsByPatientId(patient.id) : []);
    } else if (user.role === 'doctor') {
      const doctor = db.getDoctorByUserId(user.id);
      if (!doctor) return res.json([]);
      if (patientId && typeof patientId === 'string') {
        return res.json(db.getPrescriptionsByPatientId(patientId));
      }
      return res.json(db.getPrescriptionsByDoctorId(doctor.id));
    } else if (user.role === 'admin') {
      if (patientId && typeof patientId === 'string') {
        return res.json(db.getPrescriptionsByPatientId(patientId));
      }
      return res.json(db.getAllPrescriptions());
    }

    res.json([]);
  });

  app.post('/api/prescriptions', authenticate, requireRoles('doctor', 'admin'), (req: AuthRequest, res) => {
    const user = req.user!;
    const { patientId, diagnosis, medicines, advice, followUpDate, appointmentId } = req.body;

    if (!patientId || !diagnosis || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ error: 'Patient, Diagnosis, and at least one medication are required.' });
    }

    const patient = db.getPatientById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found.' });

    let doctor = db.getDoctorByUserId(user.id);
    if (!doctor && user.role === 'admin') {
      doctor = db.getAllDoctors()[0];
    }

    const rx = db.createPrescription({
      appointmentId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      doctorId: doctor?.id || 'doc-1',
      doctorName: doctor?.name || 'Chief Consultant',
      doctorSpecialization: doctor?.specialization || 'Consultant Specialist',
      doctorQualification: doctor?.qualification || 'MBBS, MD',
      doctorLicense: doctor?.licenseNumber || 'MCI-0000',
      departmentName: doctor?.departmentName || 'General Medicine',
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medicines,
      advice,
      followUpDate,
    });

    res.status(201).json(rx);
  });

  // --- DEPARTMENTS ---
  app.get('/api/departments', (req, res) => {
    res.json(db.getAllDepartments());
  });

  app.post('/api/departments', authenticate, requireRoles('admin'), (req, res) => {
    const { name, code, description, iconName, headDoctorId } = req.body;
    if (!name) return res.status(400).json({ error: 'Department name is required.' });

    const headDoc = headDoctorId ? db.getDoctorById(headDoctorId) : undefined;
    const dept = db.createDepartment({
      name,
      code,
      description,
      iconName,
      headDoctorId,
      headDoctorName: headDoc?.name,
    });

    res.status(201).json(dept);
  });

  app.put('/api/departments/:id', authenticate, requireRoles('admin'), (req, res) => {
    const { id } = req.params;
    const updated = db.updateDepartment(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Department not found.' });
    res.json(updated);
  });

  app.delete('/api/departments/:id', authenticate, requireRoles('admin'), (req, res) => {
    const success = db.deleteDepartment(req.params.id);
    if (!success) return res.status(404).json({ error: 'Department not found.' });
    res.json({ message: 'Department deleted successfully.' });
  });

  // --- NOTIFICATIONS ---
  app.get('/api/notifications', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    const notifs = db.getUserNotifications(user.id);
    res.json(notifs);
  });

  app.put('/api/notifications/:id/read', authenticate, (req: AuthRequest, res) => {
    const success = db.markNotificationAsRead(req.params.id);
    res.json({ success });
  });

  app.put('/api/notifications/read-all', authenticate, (req: AuthRequest, res) => {
    const user = req.user!;
    db.markAllNotificationsAsRead(user.id);
    res.json({ success: true });
  });

  // --- REPORTS & HOSPITAL STATS ---
  app.get('/api/reports', authenticate, requireRoles('admin'), (req, res) => {
    const analytics = db.getAnalytics();
    res.json(analytics);
  });

  app.get('/api/hospital-stats', authenticate, requireRoles('admin'), (req, res) => {
    const analytics = db.getAnalytics();
    res.json({
      totalPatients: analytics.totalPatients,
      totalDoctors: analytics.totalDoctors,
      totalAppointments: analytics.totalAppointments,
      totalDepartments: analytics.totalDepartments,
      todayAppointments: analytics.todayAppointments,
      completedAppointments: analytics.completedAppointments,
      pendingAppointments: analytics.pendingAppointments,
      totalRevenue: analytics.revenueTotal,
    });
  });

  // --- HOSPITAL SETTINGS ---
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', authenticate, requireRoles('admin'), (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    res.json(db.settings);
  });

  // --- USERS MANAGEMENT (Admin Only) ---
  app.get('/api/users', authenticate, requireRoles('admin'), (req, res) => {
    res.json(db.users);
  });

  app.put('/api/users/:id/status', authenticate, requireRoles('admin'), (req, res) => {
    const user = db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.status = req.body.status || 'active';
    res.json(user);
  });

  app.put('/api/users/:id/role', authenticate, requireRoles('admin'), (req, res) => {
    const user = db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.role = req.body.role || user.role;
    res.json(user);
  });

  app.put('/api/users/:id/password', authenticate, requireRoles('admin'), (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required.' });
    db.resetPassword(req.params.id, password);
    res.json({ success: true, message: 'Password reset successfully.' });
  });

  app.delete('/api/users/:id', authenticate, requireRoles('admin'), (req, res) => {
    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'User not found.' });
    db.users.splice(idx, 1);
    res.json({ message: 'User deleted successfully.' });
  });

  // ==========================================
  // VITE DEV & PRODUCTION STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MediNexus Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start MediNexus server:', err);
});
