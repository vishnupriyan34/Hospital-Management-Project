import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Patient, Prescription, PrescriptionMedicine } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { Modal } from '../../components/Modal';
import { PrescriptionPrintView } from '../../components/PrescriptionPrintView';
import {
  Pill,
  Plus,
  Trash2,
  Printer,
  FileText,
  User,
  Calendar,
  Sparkles,
  Save,
  Search,
  Eye
} from 'lucide-react';

export const DoctorPrescriptions: React.FC = () => {
  const { showToast } = useNotifications();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedRxForPrint, setSelectedRxForPrint] = useState<Prescription | null>(null);

  // Prescription Form State
  const [patientId, setPatientId] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    { name: '', dosage: '', frequency: '1 - 0 - 1 (Twice daily)', duration: '5 Days', instructions: 'Take after meals' }
  ]);
  const [advice, setAdvice] = useState<string>('Drink plenty of water and complete the full course of medicines.');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rxs, pats] = await Promise.all([
        api.getPrescriptions(),
        api.getPatients(),
      ]);
      setPrescriptions(rxs);
      setPatients(pats);
      if (pats.length > 0 && !patientId) {
        setPatientId(pats[0].id);
      }
    } catch (err: any) {
      showToast('error', 'Failed to load prescriptions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: '1 - 0 - 0 (Once daily)', duration: '5 Days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleUpdateMedicine = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !diagnosis) {
      showToast('error', 'Patient and Diagnosis are required.');
      return;
    }

    const validMedicines = medicines.filter(m => m.name.trim() !== '');
    if (validMedicines.length === 0) {
      showToast('error', 'Please enter at least one medication name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await api.createPrescription({
        patientId,
        diagnosis,
        medicines: validMedicines,
        advice,
        followUpDate,
      });

      showToast('success', 'Digital Prescription generated successfully!');
      setIsCreating(false);
      // Reset form
      setDiagnosis('');
      setMedicines([{ name: '', dosage: '', frequency: '1 - 0 - 1 (Twice daily)', duration: '5 Days', instructions: 'Take after meals' }]);
      loadData();
      // Auto open print modal for convenience
      setSelectedRxForPrint(created);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to create prescription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(rx => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      rx.patientName.toLowerCase().includes(term) ||
      rx.prescriptionNumber.toLowerCase().includes(term) ||
      rx.diagnosis.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Digital Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Generate, print, and manage official digital prescriptions with drug posology.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all active:scale-95 font-outfit"
        >
          {isCreating ? 'View Prescriptions Archive' : '+ Generate New Prescription'}
        </button>
      </div>

      {/* Prescription Generator Form */}
      {isCreating ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                New Electronic Prescription Formulation
              </h2>
              <p className="text-xs text-slate-500">Auto-formatted with official hospital credentials</p>
            </div>
          </div>

          <form onSubmit={handleCreatePrescription} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Patient *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <select
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.age} yrs, {p.gender}) — Blood: {p.bloodGroup}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Clinical Diagnosis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Bronchitis / Stage 1 Hypertension"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Medicines List Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Prescribed Medications ({medicines.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicineRow}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Drug Row
                </button>
              </div>

              <div className="space-y-2">
                {medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 items-center text-xs"
                  >
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        required
                        placeholder="Drug Name & Brand (e.g. Amoxicillin 500mg)"
                        value={med.name}
                        onChange={e => handleUpdateMedicine(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Dosage (500 mg / 1 tab)"
                        value={med.dosage}
                        onChange={e => handleUpdateMedicine(idx, 'dosage', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Frequency (1-0-1)"
                        value={med.frequency}
                        onChange={e => handleUpdateMedicine(idx, 'frequency', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Duration (5 Days)"
                        value={med.duration}
                        onChange={e => handleUpdateMedicine(idx, 'duration', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        placeholder="Notes (After food)"
                        value={med.instructions}
                        onChange={e => handleUpdateMedicine(idx, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(idx)}
                        disabled={medicines.length === 1}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  General Dietary & Clinical Advice
                </label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={e => setAdvice(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Follow-Up Review Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-2xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/25 flex items-center gap-2 text-xs transition-all"
              >
                <Save className="w-4 h-4" /> Issue & Print Prescription
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Prescriptions Archive Table / List */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search prescription or patient..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading prescriptions...</p>
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="p-12 text-center">
              <Pill className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
                No Prescriptions Found
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Click "Generate New Prescription" above to write digital prescriptions.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPrescriptions.map(rx => (
                <div
                  key={rx.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-3 rounded-2xl transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                        {rx.prescriptionNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{rx.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mt-1">
                      {rx.patientName} ({rx.patientAge}y, {rx.patientGender})
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                      Diagnosis: {rx.diagnosis}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {rx.medicines.map(m => `${m.name} (${m.dosage})`).join(', ')}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedRxForPrint(rx)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold rounded-xl transition-all self-start sm:self-center"
                  >
                    <Printer className="w-3.5 h-3.5" /> View & Print Rx
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prescription Print Modal */}
      {selectedRxForPrint && (
        <Modal
          isOpen={!!selectedRxForPrint}
          onClose={() => setSelectedRxForPrint(null)}
          title="Digital Prescription Preview"
          maxWidth="3xl"
        >
          <PrescriptionPrintView
            prescription={selectedRxForPrint}
            onClose={() => setSelectedRxForPrint(null)}
          />
        </Modal>
      )}
    </div>
  );
};
