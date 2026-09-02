import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Department, Doctor, Appointment } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Building2,
  Stethoscope,
  Calendar,
  Clock,
  User,
  DollarSign,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  Sparkles
} from 'lucide-react';

interface PatientBookAppointmentProps {
  onNavigate: (path: string) => void;
}

export const PatientBookAppointment: React.FC<PatientBookAppointmentProps> = ({ onNavigate }) => {
  const { showToast } = useNotifications();

  // Booking Wizard Step: 1 = Department, 2 = Doctor, 3 = Date & Slot, 4 = Details & Confirm
  const [step, setStep] = useState<number>(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // Set min date to today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [depts, docs] = await Promise.all([
          api.getDepartments(),
          api.getDoctors(),
        ]);
        setDepartments(depts);
        setDoctors(docs);
      } catch (err) {
        showToast('error', 'Failed to load clinic departments.');
      }
    };
    loadInitialData();
  }, []);

  // Filter doctors by selected department
  const filteredDoctors = selectedDeptId
    ? doctors.filter(d => d.departmentId === selectedDeptId)
    : doctors;

  // When doctor and date are chosen, fetch live slots
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const slots = await api.getDoctorSlots(selectedDoctor.id, selectedDate);
        setAvailableSlots(slots);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDoctor, selectedDate]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedSlot || !reason) {
      showToast('error', 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const apt = await api.createAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        reason,
      });

      setBookedAppointment(apt);
      showToast('success', 'Your appointment has been successfully scheduled!');
      setStep(5); // Success step
    } catch (err: any) {
      showToast('error', err.message || 'Failed to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
          Book Doctor Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Select clinical specialty, physician, preferred calendar date, and consultation time.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      {step < 5 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm text-xs font-bold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>1</span>
            <span className="hidden sm:inline">Specialty</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-700" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>2</span>
            <span className="hidden sm:inline">Physician</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-700" />

          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>3</span>
            <span className="hidden sm:inline">Date & Time</span>
          </div>
          <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-700" />

          <div className={`flex items-center gap-2 ${step >= 4 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 4 ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>4</span>
            <span className="hidden sm:inline">Confirm</span>
          </div>
        </div>
      )}

      {/* STEP 1: Select Department */}
      {step === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                Step 1: Choose Medical Department
              </h2>
              <p className="text-xs text-slate-500">Select a specialized clinical department or browse all doctors</p>
            </div>

            <button
              onClick={() => {
                setSelectedDeptId('');
                setStep(2);
              }}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Skip to all doctors →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {departments.map(dept => (
              <div
                key={dept.id}
                onClick={() => {
                  setSelectedDeptId(dept.id);
                  setStep(2);
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedDeptId === dept.id
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500">{dept.doctorCount || 0} Doctors Available</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                  {dept.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Select Doctor */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                Step 2: Select Your Preferred Physician
              </h2>
              <p className="text-xs text-slate-500">
                {selectedDeptId ? `Showing doctors in selected department` : 'Showing all clinical specialists'}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Departments
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {filteredDoctors.map(doc => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setStep(3);
                }}
                className={`p-5 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                  selectedDoctor?.id === doc.id
                    ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-teal-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm flex-shrink-0 border border-teal-400/40">
                    {doc.name.replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {doc.specialization} • {doc.departmentName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {doc.qualifications} • {doc.experience}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Fee: ${doc.consultationFee} USD
                  </span>
                  <span className="text-teal-600 dark:text-teal-400 font-bold">
                    Select & Pick Slot →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Date & Slot Selection */}
      {step === 3 && selectedDoctor && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                Step 3: Select Date & Available Time Slot
              </h2>
              <p className="text-xs text-slate-500">
                Consulting with <strong className="text-teal-600 dark:text-teal-400">{selectedDoctor.name}</strong>
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Doctor List
            </button>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Consultation Date *
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={e => {
                setSelectedDate(e.target.value);
                setSelectedSlot('');
              }}
              className="w-full sm:w-72 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
            />
            <p className="text-xs text-slate-500 mt-1">
              Available Days: {selectedDoctor.availableDays.join(', ')}
            </p>
          </div>

          {/* Time Slots Grid */}
          {selectedDate && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Available Consultation Slots for {selectedDate}
              </label>

              {isLoadingSlots ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Checking doctor's real-time schedule...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-800 dark:text-amber-300 text-xs">
                  The doctor is not available on this date or has no open slots. Please select another day.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        !slot.available
                          ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed line-through'
                          : selectedSlot === slot.time
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setStep(4)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-md text-xs transition-all disabled:opacity-40 flex items-center gap-2 font-outfit"
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Symptoms / Reason & Final Confirmation */}
      {step === 4 && selectedDoctor && (
        <form onSubmit={handleBook} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                Step 4: Reason for Visit & Final Confirmation
              </h2>
              <p className="text-xs text-slate-500">Review your appointment summary and describe your symptoms</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Slots
            </button>
          </div>

          {/* Appointment Summary Box */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs space-y-2">
            <h4 className="font-bold text-teal-900 dark:text-teal-200 font-outfit text-sm">
              Booking Summary:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Specialist:</span>
                <strong>{selectedDoctor.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Department:</span>
                <strong>{selectedDoctor.departmentName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Date:</span>
                <strong>{selectedDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Time Slot:</span>
                <strong>{selectedSlot}</strong>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Chief Complaint / Reason for Consultation *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Please describe your current symptoms, how long you have had them, and any previous medications taken..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-2xl"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/25 flex items-center gap-2 text-xs transition-all font-outfit"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Book Consultation
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: Success Screen */}
      {step === 5 && bookedAppointment && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl text-center space-y-5 animate-fadeIn max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto text-2xl shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
              Appointment Scheduled!
            </h2>
            <p className="text-xs text-slate-500">
              Your consultation has been registered in the MediNexus central registry.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-left">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <span className="text-slate-400">Appointment Ref:</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{bookedAppointment.appointmentNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <span className="text-slate-400">Physician:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{bookedAppointment.doctorName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <span className="text-slate-400">Department:</span>
              <span>{bookedAppointment.departmentName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <span className="text-slate-400">Date & Time:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{bookedAppointment.date} @ {bookedAppointment.timeSlot}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-400">Status:</span>
              <span className="font-bold uppercase text-amber-600">{bookedAppointment.status}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('/patient/appointments')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all font-outfit"
            >
              View My Appointments
            </button>
            <button
              onClick={() => {
                setStep(1);
                setSelectedDeptId('');
                setSelectedDoctor(null);
                setSelectedDate('');
                setSelectedSlot('');
                setReason('');
              }}
              className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
            >
              Book Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
