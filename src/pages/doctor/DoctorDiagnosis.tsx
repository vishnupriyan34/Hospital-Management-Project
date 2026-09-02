import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Patient, MedicalRecord } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  ClipboardList,
  User,
  Plus,
  Trash2,
  Calendar,
  Save,
  CheckCircle2,
  History,
  Activity,
  Sparkles
} from 'lucide-react';

export const DoctorDiagnosis: React.FC = () => {
  const { showToast } = useNotifications();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [symptomsInput, setSymptomsInput] = useState<string>('');
  const [symptomsList, setSymptomsList] = useState<string[]>([]);
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [treatment, setTreatment] = useState<string>('');
  const [medicalNotes, setMedicalNotes] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState<string>('');
  const [labTests, setLabTests] = useState<{ title: string; result: string; normalRange: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [previousRecords, setPreviousRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const list = await api.getPatients();
        setPatients(list);
        if (list.length > 0) {
          setSelectedPatientId(list[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return;
    const fetchHistory = async () => {
      try {
        const records = await api.getMedicalRecords(selectedPatientId);
        setPreviousRecords(records);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, [selectedPatientId]);

  const handleAddSymptom = () => {
    if (!symptomsInput.trim()) return;
    if (!symptomsList.includes(symptomsInput.trim())) {
      setSymptomsList([...symptomsList, symptomsInput.trim()]);
    }
    setSymptomsInput('');
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptomsList(symptomsList.filter((_, i) => i !== index));
  };

  const handleAddLabTest = () => {
    setLabTests([...labTests, { title: '', result: '', normalRange: '' }]);
  };

  const handleRemoveLabTest = (index: number) => {
    setLabTests(labTests.filter((_, i) => i !== index));
  };

  const handleUpdateLabTest = (index: number, field: string, value: string) => {
    const updated = [...labTests];
    (updated[index] as any)[field] = value;
    setLabTests(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis) {
      showToast('error', 'Please select a patient and enter the diagnosis.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createMedicalRecord({
        patientId: selectedPatientId,
        symptoms: symptomsList.length > 0 ? symptomsList : ['Clinical assessment routine'],
        diagnosis,
        treatment,
        medicalNotes,
        followUpDate,
        labReports: labTests.filter(t => t.title.trim() !== ''),
      });

      showToast('success', 'Clinical Diagnosis & EHR notes recorded successfully.');
      // Reset form
      setDiagnosis('');
      setTreatment('');
      setMedicalNotes('');
      setFollowUpDate('');
      setSymptomsList([]);
      setLabTests([]);
      // Reload history
      const updated = await api.getMedicalRecords(selectedPatientId);
      setPreviousRecords(updated);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save diagnosis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
          Clinical Diagnosis & EHR Entry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Record clinical findings, symptoms, therapeutic treatments, and follow-up directives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Patient Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Patient Profile *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white cursor-pointer"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.gender}) — Blood: {p.bloodGroup} — Phone: {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatient && (
                <div className="mt-2 p-3 bg-teal-50/60 dark:bg-teal-950/30 rounded-xl border border-teal-200/60 dark:border-teal-800/50 flex flex-wrap items-center gap-4 text-xs">
                  <span><strong>Allergies:</strong> {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'None reported'}</span>
                  <span><strong>Emergency:</strong> {selectedPatient.emergencyContactName} ({selectedPatient.emergencyContactPhone})</span>
                </div>
              )}
            </div>

            {/* Symptoms Tag Builder */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Observed / Reported Symptoms
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. Chest tightness, Morning stiffness, Fever..."
                  value={symptomsInput}
                  onChange={e => setSymptomsInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSymptom();
                    }
                  }}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSymptom}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {symptomsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {symptomsList.map((sym, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800"
                    >
                      {sym}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(idx)}
                        className="text-teal-600 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnosis Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Essential Hypertension Stage 1 / Refractory Migraine / Knee OA Grade II"
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white font-medium"
              />
            </div>

            {/* Treatment Protocol */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Treatment & Therapeutic Protocol
              </label>
              <textarea
                rows={3}
                placeholder="Detail treatment therapy, dietary recommendations, exercise plans, lifestyle changes..."
                value={treatment}
                onChange={e => setTreatment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            {/* Medical Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confidential Clinical Notes & Findings
              </label>
              <textarea
                rows={2}
                placeholder="Physician observations, physiological vitals, auscultation results..."
                value={medicalNotes}
                onChange={e => setMedicalNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
              />
            </div>

            {/* Lab Test Results Entry */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Diagnostic Lab & Imaging Reports (Optional)
                </label>
                <button
                  type="button"
                  onClick={handleAddLabTest}
                  className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Lab Investigation
                </button>
              </div>

              {labTests.map((lab, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Investigation (e.g. CBC, Serum Creatinine)"
                    value={lab.title}
                    onChange={e => handleUpdateLabTest(i, 'title', e.target.value)}
                    className="flex-2 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Result (e.g. 1.1 mg/dL)"
                    value={lab.result}
                    onChange={e => handleUpdateLabTest(i, 'result', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLabTest(i)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Follow-up Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Recommended Follow-Up Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="date"
                  value={followUpDate}
                  onChange={e => setFollowUpDate(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-600/25 flex items-center gap-2 text-sm transition-all transform active:scale-95 font-outfit"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save & Update Patient EHR
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Historical Diagnoses for Selected Patient */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit">
              Diagnosis Timeline
            </h3>
          </div>

          {previousRecords.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No prior diagnoses on file for this patient.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {previousRecords.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{rec.recordNumber}</span>
                    <span className="text-[11px] text-slate-500">{rec.visitDate}</span>
                  </div>
                  <h4 className="font-bold text-teal-700 dark:text-teal-300 font-outfit text-sm">
                    {rec.diagnosis}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Treatment:</strong> {rec.treatment}
                  </p>
                  {rec.followUpDate && (
                    <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                      Follow up: {rec.followUpDate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
