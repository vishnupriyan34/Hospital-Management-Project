import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/api';
import { Doctor } from '../../types/index';
import {
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Coffee,
  Check
} from 'lucide-react';

export const DoctorSchedule: React.FC = () => {
  const { doctorProfile, refreshDoctorProfile } = useAuth();
  const { showToast } = useNotifications();

  const [availableDays, setAvailableDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ]);
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('05:00 PM');
  const [slotDuration, setSlotDuration] = useState<number>(20);
  const [breakStart, setBreakStart] = useState<string>('01:00 PM');
  const [breakEnd, setBreakEnd] = useState<string>('02:00 PM');
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [newLeaveDate, setNewLeaveDate] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (doctorProfile) {
      if (doctorProfile.availableDays) setAvailableDays(doctorProfile.availableDays);
      if (doctorProfile.availableTime) {
        const parts = doctorProfile.availableTime.split(' - ');
        if (parts.length === 2) {
          setStartTime(parts[0]);
          setEndTime(parts[1]);
        }
      }
      if (doctorProfile.slotDurationMinutes) setSlotDuration(doctorProfile.slotDurationMinutes);
      if (doctorProfile.unavailableDates) setUnavailableDates(doctorProfile.unavailableDates);
    }
  }, [doctorProfile]);

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length === 1) {
        showToast('error', 'You must be available at least one day per week.');
        return;
      }
      setAvailableDays(availableDays.filter(d => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleAddLeaveDate = () => {
    if (!newLeaveDate) return;
    if (!unavailableDates.includes(newLeaveDate)) {
      setUnavailableDates([...unavailableDates, newLeaveDate]);
    }
    setNewLeaveDate('');
  };

  const handleRemoveLeaveDate = (date: string) => {
    setUnavailableDates(unavailableDates.filter(d => d !== date));
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorProfile) return;

    setIsSaving(true);
    try {
      await api.updateDoctorSchedule(doctorProfile.id, {
        availableDays,
        availableTime: `${startTime} - ${endTime}`,
        slotDurationMinutes: Number(slotDuration),
        unavailableDates,
      });

      await refreshDoctorProfile();
      showToast('success', 'Your consultation schedule has been updated.');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update schedule.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
          Consultation Schedule & Timings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure active clinic days, daily working hours, slot intervals, and planned leave dates.
        </p>
      </div>

      <form onSubmit={handleSaveSchedule} className="space-y-6 max-w-4xl">
        {/* Working Days */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Active Consultation Days
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Select the days of the week on which patients can schedule outpatient appointments.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
            {daysOfWeek.map(day => {
              const isSelected = availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <span>{day.substring(0, 3)}</span>
                  {isSelected ? (
                    <span className="text-[10px] text-teal-600 dark:text-teal-400">Available</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Off</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timings & Slot Duration */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Operating Hours & Interval
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Session Start Time
              </label>
              <input
                type="text"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Session End Time
              </label>
              <input
                type="text"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                placeholder="e.g. 05:00 PM"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Slot Duration (Minutes)
              </label>
              <select
                value={slotDuration}
                onChange={e => setSlotDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              >
                <option value={15}>15 Minutes (Express)</option>
                <option value={20}>20 Minutes (Standard)</option>
                <option value={30}>30 Minutes (Comprehensive)</option>
                <option value={45}>45 Minutes (Extended)</option>
                <option value={60}>60 Minutes (Specialist)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Planned Leaves & Blocked Dates */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Planned Leaves & Unavailable Dates
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Booking slots will be completely blocked on these dates.
          </p>

          <div className="flex gap-2 max-w-sm">
            <input
              type="date"
              value={newLeaveDate}
              onChange={e => setNewLeaveDate(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
            <button
              type="button"
              onClick={handleAddLeaveDate}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Date
            </button>
          </div>

          {unavailableDates.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {unavailableDates.map((dt, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {dt}
                  <button
                    type="button"
                    onClick={() => handleRemoveLeaveDate(dt)}
                    className="text-rose-500 hover:text-rose-700 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No unavailable dates currently scheduled.</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/25 flex items-center gap-2 text-sm transition-all transform active:scale-95 font-outfit"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Consultation Schedule
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
