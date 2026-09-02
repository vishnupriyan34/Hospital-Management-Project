import {
  User,
  Doctor,
  Patient,
  Department,
  Appointment,
  MedicalRecord,
  Prescription,
  NotificationItem,
  HospitalSettings,
  AnalyticsReport
} from '../../src/types/index';

// Initial Database State with realistic, interconnected medical data
export class Database {
  users: User[] = [];
  passwords: Record<string, string> = {}; // email -> plain/hashed password for demo
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  departments: Department[] = [];
  appointments: Appointment[] = [];
  medicalRecords: MedicalRecord[] = [];
  prescriptions: Prescription[] = [];
  notifications: NotificationItem[] = [];
  settings: HospitalSettings = {
    name: 'MediNexus Super Specialty Hospital',
    tagline: 'Built to Connect. Designed to Care.',
    footerCredit: 'Where technology meets healthcare — by Vishnu Priyan S',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80',
    address: '402 Healthcare Nexus Boulevard, MediCity Cyber Park, Bengaluru 560100',
    phone: '+91 800-633-4639 (1800-MEDINEXUS)',
    email: 'helpdesk@medinexus.com',
    emergencyContact: '+91 800-911-HELP (24x7 Ambulance & Trauma)',
    emergencyPhone: '+91 800-911-HELP (24x7 Ambulance & Trauma)',
    website: 'https://medinexus.org',
    workingHours: 'Mon - Sat: 08:00 AM - 09:00 PM | Sun: 09:00 AM - 02:00 PM (Emergency 24x7)',
    opdTimings: 'Mon - Sat: 08:00 AM - 09:00 PM | Sun: 09:00 AM - 02:00 PM (Emergency 24x7)',
    consultationSlotMinutes: 30,
    enableAutoConfirm: false,
    maxAdvanceBookingDays: 30,
    prescriptionFooter: 'This prescription is digitally signed and generated through MediNexus EHR System. Valid under Digital Health Act regulations.'
  };

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Departments
    this.departments = [
      {
        id: 'dept-1',
        name: 'Cardiology',
        code: 'CARDIO',
        description: 'Advanced interventional cardiology, heart failure management, echocardiography and cardiac rehabilitation.',
        iconName: 'HeartPulse',
        headDoctorId: 'doc-1',
        headDoctorName: 'Dr. Arvind Swaminathan',
        doctorCount: 2,
        active: true,
      },
      {
        id: 'dept-2',
        name: 'Neurology',
        code: 'NEURO',
        description: 'Comprehensive neurological care for stroke, epilepsy, neuromuscular disorders and neuro-diagnostics.',
        iconName: 'Brain',
        headDoctorId: 'doc-2',
        headDoctorName: 'Dr. Radhika Menon',
        doctorCount: 1,
        active: true,
      },
      {
        id: 'dept-3',
        name: 'Orthopedics',
        code: 'ORTHO',
        description: 'Joint replacement, arthroscopy, sports trauma, pediatric orthopedics and spine care.',
        iconName: 'Activity',
        headDoctorId: 'doc-3',
        headDoctorName: 'Dr. Rajesh Khanna',
        doctorCount: 1,
        active: true,
      },
      {
        id: 'dept-4',
        name: 'Pediatrics',
        code: 'PEDIA',
        description: 'Dedicated neonatal intensive care, child health assessments, vaccination and adolescent medicine.',
        iconName: 'Baby',
        headDoctorId: 'doc-4',
        headDoctorName: 'Dr. Priya Sundaram',
        doctorCount: 1,
        active: true,
      },
      {
        id: 'dept-5',
        name: 'Dermatology',
        code: 'DERMA',
        description: 'Clinical dermatology, trichology, cosmetic procedures, allergy testing and laser therapy.',
        iconName: 'Sparkles',
        doctorCount: 1,
        active: true,
      },
      {
        id: 'dept-6',
        name: 'General Medicine',
        code: 'GENMED',
        description: 'Primary medical care, chronic disease management, diabetes reversal and wellness health checks.',
        iconName: 'Stethoscope',
        doctorCount: 2,
        active: true,
      },
      {
        id: 'dept-7',
        name: 'Gynecology & Obstetrics',
        code: 'GYNEC',
        description: 'High-risk obstetrics, fetal medicine, laparoscopic surgery, maternal and reproductive health.',
        iconName: 'Users',
        doctorCount: 1,
        active: true,
      },
      {
        id: 'dept-8',
        name: 'ENT (Otolaryngology)',
        code: 'ENT',
        description: 'Micro-ear surgeries, endoscopic sinus surgeries, voice restoration and audiometry.',
        iconName: 'Ear',
        doctorCount: 1,
        active: true,
      },
      {
        id: 'dept-9',
        name: 'Dental Surgery',
        code: 'DENTAL',
        description: 'Orthodontics, dental implants, cosmetic smiles, maxillofacial and periodontics.',
        iconName: 'Smile',
        doctorCount: 1,
        active: true,
      }
    ];

    // 2. Core Users
    this.users = [
      {
        id: 'usr-admin',
        name: 'Dr. Vishnu Priyan S (Medical Director & Chief Admin)',
        email: 'admin@medinexus.com',
        role: 'admin',
        status: 'active',
        phone: '+91 98401 23456',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-01-10T08:00:00Z',
      },
      {
        id: 'usr-doc-1',
        name: 'Dr. Arvind Swaminathan',
        email: 'doctor@medinexus.com',
        role: 'doctor',
        status: 'active',
        phone: '+91 98402 34567',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-01-15T09:30:00Z',
      },
      {
        id: 'usr-doc-2',
        name: 'Dr. Radhika Menon',
        email: 'radhika.menon@medinexus.com',
        role: 'doctor',
        status: 'active',
        phone: '+91 98403 45678',
        avatar: 'https://images.unsplash.com/photo-1594824813579-247012fbdfb0?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-01-16T10:00:00Z',
      },
      {
        id: 'usr-doc-3',
        name: 'Dr. Rajesh Khanna',
        email: 'rajesh.khanna@medinexus.com',
        role: 'doctor',
        status: 'active',
        phone: '+91 98404 56789',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-01-18T11:00:00Z',
      },
      {
        id: 'usr-doc-4',
        name: 'Dr. Priya Sundaram',
        email: 'priya.sundaram@medinexus.com',
        role: 'doctor',
        status: 'active',
        phone: '+91 98405 67890',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-01-20T09:00:00Z',
      },
      {
        id: 'usr-pat-1',
        name: 'Ananya Sharma',
        email: 'patient@medinexus.com',
        role: 'patient',
        status: 'active',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-02-01T10:15:00Z',
      },
      {
        id: 'usr-pat-2',
        name: 'Karthik Raman',
        email: 'karthik.raman@gmail.com',
        role: 'patient',
        status: 'active',
        phone: '+91 98765 11223',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-02-05T14:30:00Z',
      },
      {
        id: 'usr-pat-3',
        name: 'Meera Nambiar',
        email: 'meera.nambiar@gmail.com',
        role: 'patient',
        status: 'active',
        phone: '+91 98765 33445',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-02-10T11:45:00Z',
      },
      {
        id: 'usr-pat-4',
        name: 'Vikramaditya Bose',
        email: 'vikram.bose@gmail.com',
        role: 'patient',
        status: 'active',
        phone: '+91 98765 55667',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2025-02-12T09:20:00Z',
      }
    ];

    // Seed Passwords (default passwords)
    this.passwords = {
      'admin@medinexus.com': 'admin123',
      'doctor@medinexus.com': 'doctor123',
      'radhika.menon@medinexus.com': 'doctor123',
      'rajesh.khanna@medinexus.com': 'doctor123',
      'priya.sundaram@medinexus.com': 'doctor123',
      'patient@medinexus.com': 'patient123',
      'karthik.raman@gmail.com': 'patient123',
      'meera.nambiar@gmail.com': 'patient123',
      'vikram.bose@gmail.com': 'patient123',
    };

    // 3. Doctors
    const standardWeekSchedule = [
      { day: 'Monday', startTime: '09:00', endTime: '16:30', slotDurationMinutes: 30, isAvailable: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '16:30', slotDurationMinutes: 30, isAvailable: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '16:30', slotDurationMinutes: 30, isAvailable: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '16:30', slotDurationMinutes: 30, isAvailable: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Friday', startTime: '09:00', endTime: '16:30', slotDurationMinutes: 30, isAvailable: true, breakStartTime: '13:00', breakEndTime: '14:00' },
      { day: 'Saturday', startTime: '09:30', endTime: '13:30', slotDurationMinutes: 30, isAvailable: true },
      { day: 'Sunday', startTime: '00:00', endTime: '00:00', slotDurationMinutes: 30, isAvailable: false },
    ];

    this.doctors = [
      {
        id: 'doc-1',
        userId: 'usr-doc-1',
        name: 'Dr. Arvind Swaminathan',
        email: 'doctor@medinexus.com',
        phone: '+91 98402 34567',
        departmentId: 'dept-1',
        departmentName: 'Cardiology',
        specialization: 'Senior Consultant Interventional Cardiologist',
        qualification: 'MBBS, MD (General Medicine), DM (Cardiology), FACC',
        experienceYears: 16,
        licenseNumber: 'MCI-CARD-94821',
        consultationFee: 800,
        about: 'Specializes in complex coronary angioplasty, transcatheter aortic valve implantation (TAVI), pacemaker implantation, and preventive cardiac wellness.',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
        rating: 4.9,
        reviewCount: 342,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        schedule: standardWeekSchedule,
        leaveDates: [],
        status: 'active',
      },
      {
        id: 'doc-2',
        userId: 'usr-doc-2',
        name: 'Dr. Radhika Menon',
        email: 'radhika.menon@medinexus.com',
        phone: '+91 98403 45678',
        departmentId: 'dept-2',
        departmentName: 'Neurology',
        specialization: 'Lead Neuro-physician & Stroke Specialist',
        qualification: 'MBBS, MD, DM (Neurology), DNB',
        experienceYears: 12,
        licenseNumber: 'MCI-NEUR-83920',
        consultationFee: 900,
        about: 'Expertise in acute stroke thrombolysis, refractory epilepsy, migraine management, Parkinson disease and electroencephalography (EEG) evaluations.',
        avatar: 'https://images.unsplash.com/photo-1594824813579-247012fbdfb0?w=150&auto=format&fit=crop&q=80',
        rating: 4.85,
        reviewCount: 215,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        schedule: standardWeekSchedule,
        leaveDates: [],
        status: 'active',
      },
      {
        id: 'doc-3',
        userId: 'usr-doc-3',
        name: 'Dr. Rajesh Khanna',
        email: 'rajesh.khanna@medinexus.com',
        phone: '+91 98404 56789',
        departmentId: 'dept-3',
        departmentName: 'Orthopedics',
        specialization: 'Joint Replacement & Arthroscopic Surgeon',
        qualification: 'MBBS, MS (Orthopedics), M.Ch (Ortho - UK), Fellowship in Joint Recon',
        experienceYears: 18,
        licenseNumber: 'MCI-ORTH-72810',
        consultationFee: 750,
        about: 'Over 2,500 successful robotic knee and hip replacements. Specialist in ACL reconstruction, rotator cuff repairs, and geriatric mobility care.',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
        rating: 4.92,
        reviewCount: 420,
        availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        schedule: standardWeekSchedule,
        leaveDates: [],
        status: 'active',
      },
      {
        id: 'doc-4',
        userId: 'usr-doc-4',
        name: 'Dr. Priya Sundaram',
        email: 'priya.sundaram@medinexus.com',
        phone: '+91 98405 67890',
        departmentId: 'dept-4',
        departmentName: 'Pediatrics',
        specialization: 'Consultant Pediatrician & Neonatologist',
        qualification: 'MBBS, DCH, DNB (Pediatrics), Fellowship in Neonatal Intensive Care',
        experienceYears: 10,
        licenseNumber: 'MCI-PEDI-61849',
        consultationFee: 650,
        about: 'Passionate about developmental pediatrics, childhood nutrition, respiratory allergies in children, and comprehensive pediatric immunizations.',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        rating: 4.96,
        reviewCount: 380,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        schedule: standardWeekSchedule,
        leaveDates: [],
        status: 'active',
      }
    ];

    // 4. Patients
    this.patients = [
      {
        id: 'pat-1',
        userId: 'usr-pat-1',
        name: 'Ananya Sharma',
        email: 'patient@medinexus.com',
        phone: '+91 98765 43210',
        age: 29,
        gender: 'Female',
        dateOfBirth: '1996-05-14',
        address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru',
        emergencyContactName: 'Rohit Sharma (Spouse)',
        emergencyContactPhone: '+91 98765 99887',
        bloodGroup: 'B+',
        allergies: ['Penicillin', 'Dust / Pollen'],
        medicalHistorySummary: 'History of episodic palpitations and mild iron deficiency anemia. Under regular preventive cardiac review.',
        status: 'active',
        registeredAt: '2025-02-01T10:15:00Z',
        assignedDoctorId: 'doc-1',
      },
      {
        id: 'pat-2',
        userId: 'usr-pat-2',
        name: 'Karthik Raman',
        email: 'karthik.raman@gmail.com',
        phone: '+91 98765 11223',
        age: 46,
        gender: 'Male',
        dateOfBirth: '1979-11-20',
        address: '45/2, 4th Cross, Indiranagar, Bengaluru',
        emergencyContactName: 'Deepa Raman (Wife)',
        emergencyContactPhone: '+91 98765 22334',
        bloodGroup: 'O+',
        allergies: ['Sulfa drugs'],
        medicalHistorySummary: 'Hypertension managed with Telmisartan. Regular lipid profile monitoring.',
        status: 'active',
        registeredAt: '2025-02-05T14:30:00Z',
        assignedDoctorId: 'doc-1',
      },
      {
        id: 'pat-3',
        userId: 'usr-pat-3',
        name: 'Meera Nambiar',
        email: 'meera.nambiar@gmail.com',
        phone: '+91 98765 33445',
        age: 34,
        gender: 'Female',
        dateOfBirth: '1991-03-08',
        address: 'B-604, Godrej Woodsman Estate, Bellary Road, Bengaluru',
        emergencyContactName: 'Girish Menon (Brother)',
        emergencyContactPhone: '+91 98765 44556',
        bloodGroup: 'A+',
        allergies: ['None known'],
        medicalHistorySummary: 'Chronic tension-type headache with visual aura. Migraine prophylaxis ongoing.',
        status: 'active',
        registeredAt: '2025-02-10T11:45:00Z',
        assignedDoctorId: 'doc-2',
      },
      {
        id: 'pat-4',
        userId: 'usr-pat-4',
        name: 'Vikramaditya Bose',
        email: 'vikram.bose@gmail.com',
        phone: '+91 98765 55667',
        age: 58,
        gender: 'Male',
        dateOfBirth: '1967-08-15',
        address: 'Flat 302, Prestige Hermitage, Kensington Road, Bengaluru',
        emergencyContactName: 'Sunita Bose (Wife)',
        emergencyContactPhone: '+91 98765 66778',
        bloodGroup: 'AB+',
        allergies: ['Aspirin (gastric irritation)'],
        medicalHistorySummary: 'Bilateral knee osteoarthritis stage II. Physical rehabilitation & Hyaluronic acid therapy planned.',
        status: 'active',
        registeredAt: '2025-02-12T09:20:00Z',
        assignedDoctorId: 'doc-3',
      }
    ];

    // 5. Appointments
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Calculate tomorrow and past days for demo
    const dTomorrow = new Date();
    dTomorrow.setDate(dTomorrow.getDate() + 1);
    const tomorrowStr = dTomorrow.toISOString().split('T')[0];

    const dIn2Days = new Date();
    dIn2Days.setDate(dIn2Days.getDate() + 2);
    const in2DaysStr = dIn2Days.toISOString().split('T')[0];

    const dPast = new Date();
    dPast.setDate(dPast.getDate() - 5);
    const pastStr = dPast.toISOString().split('T')[0];

    this.appointments = [
      {
        id: 'apt-101',
        appointmentNumber: 'MN-APT-2025-081',
        patientId: 'pat-1',
        patientName: 'Ananya Sharma',
        patientAge: 29,
        patientGender: 'Female',
        patientPhone: '+91 98765 43210',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        doctorSpecialization: 'Interventional Cardiology',
        departmentId: 'dept-1',
        departmentName: 'Cardiology',
        date: todayStr,
        timeSlot: '10:00 AM - 10:30 AM',
        reason: 'Follow-up consultation for mild exertion breathlessness and resting ECG evaluation.',
        status: 'confirmed',
        notes: 'Bring previous 2D-Echo and Holter monitor records.',
        fee: 800,
        createdAt: '2025-02-18T10:00:00Z',
        updatedAt: '2025-02-18T11:00:00Z',
      },
      {
        id: 'apt-102',
        appointmentNumber: 'MN-APT-2025-082',
        patientId: 'pat-2',
        patientName: 'Karthik Raman',
        patientAge: 46,
        patientGender: 'Male',
        patientPhone: '+91 98765 11223',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        doctorSpecialization: 'Interventional Cardiology',
        departmentId: 'dept-1',
        departmentName: 'Cardiology',
        date: todayStr,
        timeSlot: '11:30 AM - 12:00 PM',
        reason: 'Quarterly hypertension checkup & medication titration review.',
        status: 'pending',
        notes: 'Check home BP log record.',
        fee: 800,
        createdAt: '2025-02-19T08:30:00Z',
        updatedAt: '2025-02-19T08:30:00Z',
      },
      {
        id: 'apt-103',
        appointmentNumber: 'MN-APT-2025-083',
        patientId: 'pat-3',
        patientName: 'Meera Nambiar',
        patientAge: 34,
        patientGender: 'Female',
        patientPhone: '+91 98765 33445',
        doctorId: 'doc-2',
        doctorName: 'Dr. Radhika Menon',
        doctorSpecialization: 'Neurology',
        departmentId: 'dept-2',
        departmentName: 'Neurology',
        date: tomorrowStr,
        timeSlot: '02:00 PM - 02:30 PM',
        reason: 'Severe unilateral throbbing headache with photophobia over the last 3 days.',
        status: 'confirmed',
        notes: 'MRI Brain review scheduled with radiological plates.',
        fee: 900,
        createdAt: '2025-02-20T09:15:00Z',
        updatedAt: '2025-02-20T10:00:00Z',
      },
      {
        id: 'apt-104',
        appointmentNumber: 'MN-APT-2025-084',
        patientId: 'pat-4',
        patientName: 'Vikramaditya Bose',
        patientAge: 58,
        patientGender: 'Male',
        patientPhone: '+91 98765 55667',
        doctorId: 'doc-3',
        doctorName: 'Dr. Rajesh Khanna',
        doctorSpecialization: 'Orthopedics',
        departmentId: 'dept-3',
        departmentName: 'Orthopedics',
        date: in2DaysStr,
        timeSlot: '10:30 AM - 11:00 AM',
        reason: 'Bilateral knee stiffness, morning crepitus and gait difficulty while climbing stairs.',
        status: 'pending',
        notes: 'Standing AP/Lateral X-rays requested.',
        fee: 750,
        createdAt: '2025-02-21T12:00:00Z',
        updatedAt: '2025-02-21T12:00:00Z',
      },
      {
        id: 'apt-105',
        appointmentNumber: 'MN-APT-2025-075',
        patientId: 'pat-1',
        patientName: 'Ananya Sharma',
        patientAge: 29,
        patientGender: 'Female',
        patientPhone: '+91 98765 43210',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        doctorSpecialization: 'Interventional Cardiology',
        departmentId: 'dept-1',
        departmentName: 'Cardiology',
        date: pastStr,
        timeSlot: '03:00 PM - 03:30 PM',
        reason: 'Initial consultation for intermittent sinus tachycardia and fatigue.',
        status: 'completed',
        notes: 'Blood work and 2D Echo completed. Prescribed beta-blocker micro-dose.',
        fee: 800,
        createdAt: '2025-02-10T14:00:00Z',
        updatedAt: '2025-02-15T15:45:00Z',
      }
    ];

    // 6. Medical Records
    this.medicalRecords = [
      {
        id: 'rec-201',
        recordNumber: 'MN-EHR-8491',
        patientId: 'pat-1',
        patientName: 'Ananya Sharma',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        departmentName: 'Cardiology',
        appointmentId: 'apt-105',
        visitDate: pastStr,
        symptoms: ['Sinus Tachycardia (HR 98-106 bpm)', 'Fatigue on rapid climbing', 'Occasional lightheadedness'],
        diagnosis: 'Inappropriate Sinus Tachycardia secondary to Mild Iron Deficiency',
        treatment: 'Low-dose Metoprolol Succinate 12.5mg OD, Liposomal Iron supplementation with Vitamin C, 3L daily hydration.',
        medicalNotes: 'ECG demonstrated normal sinus rhythm with tachycardia, no ischemic ST-T changes. 2D Echo revealed normal LVEF 62%, no valvular lesion. Recheck Serum Ferritin in 4 weeks.',
        followUpDate: todayStr,
        labReports: [
          { title: 'Complete Blood Count (CBC) & Serum Ferritin', date: pastStr, result: 'Hb: 11.2 g/dL (Low), Ferritin: 14 ng/mL', normalRange: 'Ferritin 20-200 ng/mL', status: 'Abnormal' },
          { title: '12-Lead Resting ECG', date: pastStr, result: 'Sinus Tachycardia @ 102 bpm, Normal QTc 410ms', normalRange: '60-100 bpm', status: 'Normal' },
          { title: '2D Transthoracic Echocardiography', date: pastStr, result: 'Concentric LV geometry, EF 62%, Good RV systolic function', normalRange: 'EF > 55%', status: 'Normal' }
        ],
        createdAt: '2025-02-15T16:00:00Z'
      },
      {
        id: 'rec-202',
        recordNumber: 'MN-EHR-8492',
        patientId: 'pat-2',
        patientName: 'Karthik Raman',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        departmentName: 'Cardiology',
        visitDate: '2025-01-20',
        symptoms: ['Occasional occipital morning headache', 'Asymptomatic elevated BP reading at pharmacy (146/92 mmHg)'],
        diagnosis: 'Essential Stage 1 Systemic Hypertension',
        treatment: 'Telmisartan 40mg once daily in morning. Dietary sodium restriction (< 2g/day) and 45 mins brisk walking 5 days/week.',
        medicalNotes: 'Renal function tests, serum electrolytes and fundus examination within normal limits. Monitored for postural hypotension.',
        followUpDate: todayStr,
        labReports: [
          { title: 'Lipid Profile & Serum Creatinine', date: '2025-01-20', result: 'Serum Creatinine: 0.9 mg/dL, Total Cholesterol: 192 mg/dL, LDL: 118 mg/dL', normalRange: 'Creatinine: 0.7-1.2 mg/dL', status: 'Normal' }
        ],
        createdAt: '2025-01-20T17:30:00Z'
      }
    ];

    // 7. Prescriptions
    this.prescriptions = [
      {
        id: 'rx-301',
        prescriptionNumber: 'MN-RX-2025-904',
        appointmentId: 'apt-105',
        patientId: 'pat-1',
        patientName: 'Ananya Sharma',
        patientAge: 29,
        patientGender: 'Female',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        doctorSpecialization: 'Interventional Cardiology',
        doctorQualification: 'MBBS, MD, DM (Cardiology), FACC',
        doctorLicense: 'MCI-CARD-94821',
        departmentName: 'Cardiology',
        date: pastStr,
        diagnosis: 'Sinus Tachycardia & Mild Anemia',
        medicines: [
          {
            name: 'Metolar XR (Metoprolol Succinate ER)',
            dosage: '12.5 mg',
            frequency: '1 - 0 - 0 (Once daily after breakfast)',
            duration: '30 Days',
            instructions: 'Do not discontinue abruptly. Monitor resting pulse.'
          },
          {
            name: 'Orofer XT (Ferrous Ascorbate + Folic Acid)',
            dosage: '100 mg elemental iron',
            frequency: '0 - 1 - 0 (Once daily after lunch)',
            duration: '60 Days',
            instructions: 'Take with orange juice / water. Avoid milk/tea within 2 hours.'
          },
          {
            name: 'Limcee (Vitamin C / Ascorbic Acid)',
            dosage: '500 mg',
            frequency: '0 - 1 - 0 (Chewable)',
            duration: '30 Days',
            instructions: 'Aids iron absorption.'
          }
        ],
        advice: 'Maintain minimum 2.5 - 3.0 Litres of oral fluids daily. Avoid high-caffeine energy drinks. Follow up with repeat CBC & Ferritin in 4 weeks.',
        followUpDate: todayStr,
        createdAt: '2025-02-15T16:15:00Z'
      },
      {
        id: 'rx-302',
        prescriptionNumber: 'MN-RX-2025-905',
        patientId: 'pat-2',
        patientName: 'Karthik Raman',
        patientAge: 46,
        patientGender: 'Male',
        doctorId: 'doc-1',
        doctorName: 'Dr. Arvind Swaminathan',
        doctorSpecialization: 'Interventional Cardiology',
        doctorQualification: 'MBBS, MD, DM (Cardiology), FACC',
        doctorLicense: 'MCI-CARD-94821',
        departmentName: 'Cardiology',
        date: '2025-01-20',
        diagnosis: 'Essential Systemic Hypertension',
        medicines: [
          {
            name: 'Telma (Telmisartan)',
            dosage: '40 mg',
            frequency: '1 - 0 - 0 (Morning after food)',
            duration: '90 Days',
            instructions: 'Regular blood pressure monitoring 3 times weekly.'
          },
          {
            name: 'Rosuvas (Rosuvastatin)',
            dosage: '10 mg',
            frequency: '0 - 0 - 1 (At bedtime)',
            duration: '90 Days',
            instructions: 'For lipid optimization & vascular endothelial protection.'
          }
        ],
        advice: 'DASH Diet (Low sodium < 2.3g/day, high potassium fresh fruits). Avoid tobacco and alcohol.',
        followUpDate: todayStr,
        createdAt: '2025-01-20T17:45:00Z'
      }
    ];

    // 8. Notifications
    this.notifications = [
      {
        id: 'notif-1',
        userId: 'usr-doc-1',
        role: 'doctor',
        title: 'New Appointment Booked',
        message: 'Patient Karthik Raman requested a consultation for today at 11:30 AM.',
        type: 'appointment',
        read: false,
        link: '/doctor/appointments',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'usr-pat-1',
        role: 'patient',
        title: 'Appointment Confirmed',
        message: 'Your Cardiology consultation with Dr. Arvind Swaminathan is confirmed for today at 10:00 AM.',
        type: 'success',
        read: false,
        link: '/patient/appointments',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-3',
        userId: 'usr-admin',
        role: 'admin',
        title: 'Department Capacity Alert',
        message: 'Cardiology OPD has reached 85% scheduled capacity for today.',
        type: 'info',
        read: false,
        link: '/admin/appointments',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-4',
        userId: 'usr-pat-1',
        role: 'patient',
        title: 'Digital Prescription Available',
        message: 'Dr. Arvind Swaminathan has generated your digital prescription MN-RX-2025-904.',
        type: 'prescription',
        read: true,
        link: '/patient/prescriptions',
        createdAt: '2025-02-15T16:20:00Z',
      },
      {
        id: 'notif-5',
        userId: 'usr-admin',
        role: 'admin',
        title: 'New Doctor Onboarding',
        message: 'Dr. Priya Sundaram completed credential verification for Pediatrics OPD.',
        type: 'success',
        read: true,
        link: '/admin/doctors',
        createdAt: '2025-01-20T09:30:00Z',
      }
    ];
  }

  // --- Helper Methods ---

  // Auth & Users
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  validatePassword(email: string, pass: string): boolean {
    const stored = this.passwords[email.toLowerCase()];
    if (!stored) return false;
    return stored === pass;
  }

  createUser(userData: Partial<User>, password: string): User {
    const id = `usr-${Date.now()}`;
    const newUser: User = {
      id,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'patient',
      status: 'active',
      phone: userData.phone || '',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.passwords[newUser.email.toLowerCase()] = password;
    return newUser;
  }

  // Doctors
  getDoctorByUserId(userId: string): Doctor | undefined {
    return this.doctors.find(d => d.userId === userId);
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }

  getAllDoctors(): Doctor[] {
    return this.doctors;
  }

  createDoctor(doctorData: Partial<Doctor>): Doctor {
    const id = `doc-${Date.now()}`;
    const newDoc: Doctor = {
      id,
      userId: doctorData.userId || `usr-doc-${Date.now()}`,
      name: doctorData.name || '',
      email: doctorData.email || '',
      phone: doctorData.phone || '',
      departmentId: doctorData.departmentId || 'dept-1',
      departmentName: doctorData.departmentName || 'General Medicine',
      specialization: doctorData.specialization || 'Consultant Specialist',
      qualification: doctorData.qualification || 'MBBS, MD',
      experienceYears: doctorData.experienceYears || 5,
      licenseNumber: doctorData.licenseNumber || `MCI-GEN-${Math.floor(10000 + Math.random() * 90000)}`,
      consultationFee: doctorData.consultationFee || 600,
      about: doctorData.about || 'Dedicated healthcare physician committed to excellence in patient outcomes.',
      avatar: doctorData.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewCount: 1,
      availableDays: doctorData.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      schedule: doctorData.schedule || [
        { day: 'Monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isAvailable: true },
        { day: 'Friday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30, isAvailable: true },
      ],
      leaveDates: [],
      status: 'active',
    };
    this.doctors.push(newDoc);
    
    // Update dept count
    const dept = this.departments.find(d => d.id === newDoc.departmentId);
    if (dept) dept.doctorCount += 1;

    return newDoc;
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Doctor | null {
    const index = this.doctors.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.doctors[index] = { ...this.doctors[index], ...updates };
    
    // Sync User name/avatar if changed
    const userIndex = this.users.findIndex(u => u.id === this.doctors[index].userId);
    if (userIndex !== -1) {
      if (updates.name) this.users[userIndex].name = updates.name;
      if (updates.avatar) this.users[userIndex].avatar = updates.avatar;
      if (updates.phone) this.users[userIndex].phone = updates.phone;
    }
    return this.doctors[index];
  }

  deleteDoctor(id: string): boolean {
    const doc = this.doctors.find(d => d.id === id);
    if (!doc) return false;
    this.doctors = this.doctors.filter(d => d.id !== id);
    this.users = this.users.filter(u => u.id !== doc.userId);
    const dept = this.departments.find(d => d.id === doc.departmentId);
    if (dept && dept.doctorCount > 0) dept.doctorCount -= 1;
    return true;
  }

  // Patients
  getPatientByUserId(userId: string): Patient | undefined {
    return this.patients.find(p => p.userId === userId);
  }

  getPatientById(id: string): Patient | undefined {
    return this.patients.find(p => p.id === id);
  }

  getAllPatients(): Patient[] {
    return this.patients;
  }

  createPatient(patientData: Partial<Patient>): Patient {
    const id = `pat-${Date.now()}`;
    const newPat: Patient = {
      id,
      userId: patientData.userId || `usr-pat-${Date.now()}`,
      name: patientData.name || '',
      email: patientData.email || '',
      phone: patientData.phone || '',
      age: patientData.age || 30,
      gender: patientData.gender || 'Other',
      dateOfBirth: patientData.dateOfBirth || '1995-01-01',
      address: patientData.address || 'Bengaluru, Karnataka',
      emergencyContactName: patientData.emergencyContactName || 'Family Member',
      emergencyContactPhone: patientData.emergencyContactPhone || '+91 99999 88888',
      bloodGroup: patientData.bloodGroup || 'O+',
      allergies: patientData.allergies || [],
      medicalHistorySummary: patientData.medicalHistorySummary || 'No major prior medical conditions recorded.',
      status: 'active',
      registeredAt: new Date().toISOString(),
    };
    this.patients.push(newPat);
    return newPat;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.patients[index] = { ...this.patients[index], ...updates };
    
    // Sync User info
    const userIndex = this.users.findIndex(u => u.id === this.patients[index].userId);
    if (userIndex !== -1) {
      if (updates.name) this.users[userIndex].name = updates.name;
      if (updates.phone) this.users[userIndex].phone = updates.phone;
    }
    return this.patients[index];
  }

  // Appointments
  getAllAppointments(): Appointment[] {
    return this.appointments;
  }

  getAppointmentsByDoctorId(doctorId: string): Appointment[] {
    return this.appointments.filter(a => a.doctorId === doctorId);
  }

  getAppointmentsByPatientId(patientId: string): Appointment[] {
    return this.appointments.filter(a => a.patientId === patientId);
  }

  createAppointment(data: Partial<Appointment>): Appointment {
    const id = `apt-${Date.now()}`;
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const newApt: Appointment = {
      id,
      appointmentNumber: `MN-APT-2025-${randomSeq}`,
      patientId: data.patientId || '',
      patientName: data.patientName || '',
      patientAge: data.patientAge || 30,
      patientGender: data.patientGender || 'Other',
      patientPhone: data.patientPhone || '',
      doctorId: data.doctorId || '',
      doctorName: data.doctorName || '',
      doctorSpecialization: data.doctorSpecialization || 'Specialist',
      departmentId: data.departmentId || '',
      departmentName: data.departmentName || '',
      date: data.date || new Date().toISOString().split('T')[0],
      timeSlot: data.timeSlot || '10:00 AM - 10:30 AM',
      reason: data.reason || 'General Consultation',
      status: this.settings.enableAutoConfirm ? 'confirmed' : 'pending',
      notes: data.notes || '',
      fee: data.fee || 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.appointments.push(newApt);

    // Create notifications for Doctor and Admin
    const doctor = this.doctors.find(d => d.id === newApt.doctorId);
    if (doctor) {
      this.createNotification({
        userId: doctor.userId,
        role: 'doctor',
        title: 'New Appointment Booking',
        message: `${newApt.patientName} has booked an appointment for ${newApt.date} at ${newApt.timeSlot}.`,
        type: 'appointment',
        link: '/doctor/appointments',
      });
    }

    this.createNotification({
      userId: 'usr-admin',
      role: 'admin',
      title: 'Appointment Scheduled',
      message: `Appointment ${newApt.appointmentNumber} scheduled with ${newApt.doctorName}.`,
      type: 'info',
      link: '/admin/appointments',
    });

    return newApt;
  }

  updateAppointmentStatus(id: string, status: Appointment['status'], notes?: string, cancellationReason?: string): Appointment | null {
    const index = this.appointments.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.appointments[index].status = status;
    this.appointments[index].updatedAt = new Date().toISOString();
    if (notes) this.appointments[index].notes = notes;
    if (cancellationReason) this.appointments[index].cancellationReason = cancellationReason;

    const apt = this.appointments[index];
    const patient = this.patients.find(p => p.id === apt.patientId);
    if (patient) {
      this.createNotification({
        userId: patient.userId,
        role: 'patient',
        title: `Appointment ${status.toUpperCase()}`,
        message: `Your consultation with ${apt.doctorName} on ${apt.date} has been marked as ${status}.`,
        type: status === 'confirmed' ? 'success' : status === 'rejected' || status === 'cancelled' ? 'error' : 'info',
        link: '/patient/appointments',
      });
    }

    return apt;
  }

  // Medical Records
  getAllMedicalRecords(): MedicalRecord[] {
    return this.medicalRecords;
  }

  getMedicalRecordsByPatientId(patientId: string): MedicalRecord[] {
    return this.medicalRecords.filter(r => r.patientId === patientId);
  }

  getMedicalRecordsByDoctorId(doctorId: string): MedicalRecord[] {
    return this.medicalRecords.filter(r => r.doctorId === doctorId);
  }

  createMedicalRecord(data: Partial<MedicalRecord>): MedicalRecord {
    const id = `rec-${Date.now()}`;
    const seq = Math.floor(1000 + Math.random() * 9000);
    const newRecord: MedicalRecord = {
      id,
      recordNumber: `MN-EHR-${seq}`,
      patientId: data.patientId || '',
      patientName: data.patientName || '',
      doctorId: data.doctorId || '',
      doctorName: data.doctorName || '',
      departmentName: data.departmentName || '',
      appointmentId: data.appointmentId,
      visitDate: data.visitDate || new Date().toISOString().split('T')[0],
      symptoms: data.symptoms || [],
      diagnosis: data.diagnosis || '',
      treatment: data.treatment || '',
      medicalNotes: data.medicalNotes || '',
      followUpDate: data.followUpDate,
      labReports: data.labReports || [],
      createdAt: new Date().toISOString(),
    };
    this.medicalRecords.unshift(newRecord);

    const patient = this.patients.find(p => p.id === newRecord.patientId);
    if (patient) {
      this.createNotification({
        userId: patient.userId,
        role: 'patient',
        title: 'New Clinical Record Added',
        message: `${newRecord.doctorName} recorded medical notes for diagnosis: ${newRecord.diagnosis}.`,
        type: 'medical-record',
        link: '/patient/medical-records',
      });
    }

    return newRecord;
  }

  // Prescriptions
  getAllPrescriptions(): Prescription[] {
    return this.prescriptions;
  }

  getPrescriptionsByPatientId(patientId: string): Prescription[] {
    return this.prescriptions.filter(p => p.patientId === patientId);
  }

  getPrescriptionsByDoctorId(doctorId: string): Prescription[] {
    return this.prescriptions.filter(p => p.doctorId === doctorId);
  }

  createPrescription(data: Partial<Prescription>): Prescription {
    const id = `rx-${Date.now()}`;
    const seq = Math.floor(100 + Math.random() * 900);
    const newRx: Prescription = {
      id,
      prescriptionNumber: `MN-RX-2025-${seq}`,
      appointmentId: data.appointmentId,
      patientId: data.patientId || '',
      patientName: data.patientName || '',
      patientAge: data.patientAge || 30,
      patientGender: data.patientGender || 'Other',
      doctorId: data.doctorId || '',
      doctorName: data.doctorName || '',
      doctorSpecialization: data.doctorSpecialization || '',
      doctorQualification: data.doctorQualification || '',
      doctorLicense: data.doctorLicense || '',
      departmentName: data.departmentName || '',
      date: data.date || new Date().toISOString().split('T')[0],
      diagnosis: data.diagnosis || '',
      medicines: data.medicines || [],
      advice: data.advice || '',
      followUpDate: data.followUpDate,
      createdAt: new Date().toISOString(),
    };
    this.prescriptions.unshift(newRx);

    const patient = this.patients.find(p => p.id === newRx.patientId);
    if (patient) {
      this.createNotification({
        userId: patient.userId,
        role: 'patient',
        title: 'Digital Prescription Generated',
        message: `${newRx.doctorName} issued Prescription #${newRx.prescriptionNumber} for ${newRx.diagnosis}.`,
        type: 'prescription',
        link: '/patient/prescriptions',
      });
    }

    return newRx;
  }

  // Departments
  getAllDepartments(): Department[] {
    return this.departments;
  }

  createDepartment(data: Partial<Department>): Department {
    const id = `dept-${Date.now()}`;
    const newDept: Department = {
      id,
      name: data.name || '',
      code: data.code || data.name?.slice(0, 5).toUpperCase() || 'DEPT',
      description: data.description || '',
      iconName: data.iconName || 'Activity',
      headDoctorId: data.headDoctorId,
      headDoctorName: data.headDoctorName,
      doctorCount: 0,
      active: true,
    };
    this.departments.push(newDept);
    return newDept;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const index = this.departments.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.departments[index] = { ...this.departments[index], ...updates };
    return this.departments[index];
  }

  deleteDepartment(id: string): boolean {
    const index = this.departments.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.departments.splice(index, 1);
    return true;
  }

  deletePatient(id: string): boolean {
    const index = this.patients.findIndex(p => p.id === id);
    if (index === -1) return false;
    const pat = this.patients[index];
    this.patients.splice(index, 1);
    // remove user account too
    const uIdx = this.users.findIndex(u => u.id === pat.userId);
    if (uIdx !== -1) this.users.splice(uIdx, 1);
    return true;
  }

  resetPassword(userId: string, newPass: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    this.passwords[user.email] = newPass;
    return true;
  }

  // Notifications
  getUserNotifications(userId: string): NotificationItem[] {
    return this.notifications.filter(n => n.userId === userId);
  }

  createNotification(data: Partial<NotificationItem>): NotificationItem {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random()}`,
      userId: data.userId || 'usr-admin',
      role: data.role || 'admin',
      title: data.title || 'Notification',
      message: data.message || '',
      type: data.type || 'info',
      read: false,
      link: data.link,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  markNotificationAsRead(id: string): boolean {
    const n = this.notifications.find(item => item.id === id);
    if (!n) return false;
    n.read = true;
    return true;
  }

  markAllNotificationsAsRead(userId: string): boolean {
    this.notifications.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    return true;
  }

  // Reports & Analytics
  getAnalytics(): AnalyticsReport {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = this.appointments.filter(a => a.date === today);
    const completed = this.appointments.filter(a => a.status === 'completed');
    const pending = this.appointments.filter(a => a.status === 'pending');
    const revenue = this.appointments.reduce((sum, a) => sum + (a.status !== 'cancelled' && a.status !== 'rejected' ? a.fee : 0), 0);

    const statusCounts: Record<string, number> = {};
    this.appointments.forEach(a => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: Math.round((count / (this.appointments.length || 1)) * 100),
    }));

    const deptStats = this.departments.map(dept => {
      const aptCount = this.appointments.filter(a => a.departmentId === dept.id).length;
      return {
        name: dept.name,
        doctorCount: dept.doctorCount,
        patientCount: Math.round(aptCount * 1.5) + (dept.doctorCount * 8),
        appointmentCount: aptCount,
      };
    });

    const docPerf = this.doctors.map(doc => {
      const docApts = this.appointments.filter(a => a.doctorId === doc.id).length;
      return {
        name: doc.name,
        department: doc.departmentName,
        appointments: docApts,
        rating: doc.rating,
      };
    });

    return {
      totalDoctors: this.doctors.length,
      totalPatients: this.patients.length,
      totalAppointments: this.appointments.length,
      totalDepartments: this.departments.length,
      todayAppointments: todayApts.length,
      completedAppointments: completed.length,
      pendingAppointments: pending.length,
      revenueTotal: revenue,
      monthlyGrowth: [
        { month: 'Sep', patients: 45, appointments: 80, revenue: 64000 },
        { month: 'Oct', patients: 62, appointments: 110, revenue: 88000 },
        { month: 'Nov', patients: 84, appointments: 155, revenue: 124000 },
        { month: 'Dec', patients: 108, appointments: 195, revenue: 156000 },
        { month: 'Jan', patients: 140, appointments: 260, revenue: 208000 },
        { month: 'Feb', patients: 185, appointments: 320, revenue: 256000 },
      ],
      appointmentStatusBreakdown: statusBreakdown,
      departmentStats: deptStats,
      doctorPerformance: docPerf,
    };
  }
}

export const db = new Database();
