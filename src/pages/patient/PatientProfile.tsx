import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/api';
import {
  User,
  Heart,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export const PatientProfile: React.FC = () => {
  const { user, patientProfile, refreshPatientProfile } = useAuth();
  const { showToast } = useNotifications();

  const [phone, setPhone] = useState<string>('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>('Male');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [address, setAddress] = useState<string>('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState<string>('');
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [medicalHistorySummary, setMedicalHistorySummary] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (patientProfile) {
      setPhone(patientProfile.phone || '');
      setAge(patientProfile.age || 30);
      setGender(patientProfile.gender || 'Male');
      setBloodGroup(patientProfile.bloodGroup || 'O+');
      setAddress(patientProfile.address || '');
      setAllergies(patientProfile.allergies || []);
      setEmergencyName(patientProfile.emergencyContactName || '');
      setEmergencyPhone(patientProfile.emergencyContactPhone || '');
      setMedicalHistorySummary(patientProfile.medicalHistorySummary || '');
    }
  }, [patientProfile]);

  const handleAddAllergy = () => {
    if (!allergyInput.trim()) return;
    if (!allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
    }
    setAllergyInput('');
  };

  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientProfile) return;

    setIsSaving(true);
    try {
      await api.updatePatient(patientProfile.id, {
        phone,
        age: Number(age),
        gender,
        bloodGroup,
        address,
        allergies,
        emergencyContactName: emergencyName,
        emergencyContactPhone: emergencyPhone,
        medicalHistorySummary,
      });

      await refreshPatientProfile();
      showToast('success', 'Health profile successfully updated.');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
          My Health Profile & EHR Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Maintain your clinical emergency contacts, drug allergies, blood group, and residential address.
        </p>
      </div>

      {/* Header Profile Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center font-extrabold-800 text-3xl shadow-lg shadow-teal-500/20">
          {user?.name?.charAt(0) || 'P'}
        </div>

        <div className="text-center sm:text-left flex-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
            {patientProfile?.name || user?.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered Patient • Member ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{patientProfile?.id ? `MN-${patientProfile.id.toUpperCase()}` : `MN-${user?.id?.toUpperCase() || 'PATIENT'}`}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Blood: {bloodGroup}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {age} Years ({gender})
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Basic Health Demographics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Age
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white font-bold text-rose-600"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Residential Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Allergies & Emergency */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Allergies & Critical Emergency Contact
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Known Drug & Food Allergies
            </label>
            <div className="flex gap-2 mb-2 max-w-md">
              <input
                type="text"
                placeholder="e.g. Penicillin, Peanuts, Sulfa..."
                value={allergyInput}
                onChange={e => setAllergyInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAllergy();
                  }
                }}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {allergies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {allergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-800"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {all}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(idx)}
                      className="text-rose-500 hover:text-rose-700 ml-1 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No allergies recorded.</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Emergency Contact Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Verma (Spouse)"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Emergency Contact Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              General Medical History Summary
            </label>
            <textarea
              rows={3}
              placeholder="e.g. History of mild childhood asthma, appendectomy in 2018..."
              value={medicalHistorySummary}
              onChange={e => setMedicalHistorySummary(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

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
                <Save className="w-4 h-4" /> Save Health Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
