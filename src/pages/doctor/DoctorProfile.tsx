import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../services/api';
import {
  User,
  Stethoscope,
  Mail,
  Phone,
  Building2,
  Award,
  DollarSign,
  Save,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { user, doctorProfile, refreshDoctorProfile } = useAuth();
  const { showToast } = useNotifications();

  const [phone, setPhone] = useState<string>('');
  const [qualifications, setQualifications] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [consultationFee, setConsultationFee] = useState<number>(100);
  const [about, setAbout] = useState<string>('');
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (doctorProfile) {
      setPhone(doctorProfile.phone || '');
      setQualifications(doctorProfile.qualifications || '');
      setExperience(doctorProfile.experience || '');
      setConsultationFee(doctorProfile.consultationFee || 100);
      setAbout(doctorProfile.about || '');
      setLicenseNumber(doctorProfile.licenseNumber || '');
    }
  }, [doctorProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorProfile) return;

    setIsSaving(true);
    try {
      await api.updateDoctor(doctorProfile.id, {
        phone,
        qualifications,
        experience,
        consultationFee: Number(consultationFee),
        about,
        licenseNumber,
      });

      await refreshDoctorProfile();
      showToast('success', 'Profile updated successfully.');
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
          Physician Profile & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your verified professional details, clinical qualifications, and consultation pricing.
        </p>
      </div>

      {/* Header Profile Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-lg shadow-teal-500/20 border-2 border-teal-400">
          {(doctorProfile?.name || user?.name || 'Dr').replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'D'}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              {doctorProfile?.name || user?.name}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Practitioner
            </span>
          </div>

          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">
            {doctorProfile?.specialization} • Department of {doctorProfile?.departmentName}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            License / Reg: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{doctorProfile?.licenseNumber || (doctorProfile?.id ? `MCI-${doctorProfile.id.toUpperCase()}` : 'MCI-VERIFIED')}</span>
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Contact & Clinical Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Official Phone Number
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
                Medical License / Reg Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Qualifications
              </label>
              <input
                type="text"
                placeholder="e.g. MBBS, MD (Internal Medicine), DM"
                value={qualifications}
                onChange={e => setQualifications(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Experience
              </label>
              <input
                type="text"
                placeholder="e.g. 12 Years Clinical Experience"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Consultation Fee ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={e => setConsultationFee(Number(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white font-semibold"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Professional Biography & Clinical Overview
            </label>
            <textarea
              rows={4}
              value={about}
              onChange={e => setAbout(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white leading-relaxed"
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
                <Save className="w-4 h-4" /> Save Profile Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
