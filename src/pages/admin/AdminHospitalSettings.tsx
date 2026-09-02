import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HospitalInfo } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Save,
  FileText,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AdminHospitalSettings: React.FC = () => {
  const { showToast } = useNotifications();
  const [info, setInfo] = useState<HospitalInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('MediNexus Multi-Specialty Hospital & Research Center');
  const [tagline, setTagline] = useState<string>('Excellence in Clinical Care & Patient Recovery');
  const [address, setAddress] = useState<string>('Plot 42, Health City, Sector 18, Gurugram, Delhi-NCR, India - 122002');
  const [phone, setPhone] = useState<string>('+91 11 4567 8900');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+91 11 4567 9999 (24x7 Trauma Line)');
  const [email, setEmail] = useState<string>('care@medinexus.org');
  const [website, setWebsite] = useState<string>('https://medinexus.health');
  const [opdTimings, setOpdTimings] = useState<string>('Monday - Saturday: 08:00 AM to 08:00 PM | Sunday: Emergency Only');
  const [prescriptionFooter, setPrescriptionFooter] = useState<string>(
    'This prescription is generated electronically via MediNexus EHR System and is legally valid under the Digital Health Act. In case of acute emergency, visit the 24/7 Trauma Wing.'
  );

  useEffect(() => {
    const loadInfo = async () => {
      setIsLoading(true);
      try {
        const data = await api.getHospitalInfo();
        setInfo(data);
        setName(data.name);
        setTagline(data.tagline);
        setAddress(data.address);
        setPhone(data.phone);
        setEmergencyPhone(data.emergencyPhone);
        setEmail(data.email);
        setWebsite(data.website);
        setOpdTimings(data.opdTimings);
        setPrescriptionFooter(data.prescriptionFooter);
      } catch (err: any) {
        showToast('error', 'Failed to load hospital settings.');
      } finally {
        setIsLoading(false);
      }
    };
    loadInfo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateHospitalInfo({
        name,
        tagline,
        address,
        phone,
        emergencyPhone,
        email,
        website,
        opdTimings,
        prescriptionFooter,
      });
      setInfo(updated);
      showToast('success', 'Hospital configuration & branding updated.');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
          Hospital Configuration & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage clinical institutional credentials, legal disclaimers, outpatient timings, and emergency lines.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institutional Branding */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Institutional Branding & Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hospital Official Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hospital Tagline / Mission Motto
              </label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Registered Physical Campus Address *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Contact & Hotlines */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Public Helplines & Operational Timings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                General OPD Appointments Helpline
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                24/7 Critical Trauma Emergency Line *
              </label>
              <input
                type="text"
                required
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none dark:text-white font-semibold text-rose-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Administrative Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Web Portal
              </label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Outpatient Department (OPD) Working Schedule
            </label>
            <input
              type="text"
              value={opdTimings}
              onChange={e => setOpdTimings(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Digital Prescription Disclaimer */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
            Prescription & Clinical Report Legal Disclaimer
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Electronic Signature & Legal Footer Notice
            </label>
            <textarea
              rows={3}
              value={prescriptionFooter}
              onChange={e => setPrescriptionFooter(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              This text is automatically stamped at the bottom of all generated printable PDF prescriptions and diagnostic reports.
            </p>
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
                <Save className="w-4 h-4" /> Save Institutional Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
