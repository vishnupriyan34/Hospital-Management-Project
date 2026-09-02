import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Prescription } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { Modal } from '../../components/Modal';
import { PrescriptionPrintView } from '../../components/PrescriptionPrintView';
import {
  Pill,
  Printer,
  Calendar,
  Stethoscope,
  FileText,
  Search,
  Download
} from 'lucide-react';

export const PatientPrescriptions: React.FC = () => {
  const { showToast } = useNotifications();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  useEffect(() => {
    const loadPrescriptions = async () => {
      setIsLoading(true);
      try {
        const data = await api.getPrescriptions();
        setPrescriptions(data);
      } catch (err: any) {
        showToast('error', 'Failed to load prescriptions.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPrescriptions();
  }, []);

  const filtered = prescriptions.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.diagnosis.toLowerCase().includes(term) ||
      p.doctorName.toLowerCase().includes(term) ||
      p.prescriptionNumber.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            My Digital Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Official digital medical prescriptions with dosage, intervals, and doctor's advice.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine or doctor..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading prescriptions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <Pill className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
            No Prescriptions Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Prescriptions formulated by your physicians will appear here with instant printing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rx => (
            <div
              key={rx.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                      {rx.prescriptionNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{rx.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit mt-1">
                    Diagnosis: {rx.diagnosis}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Prescribed by <strong className="text-slate-700 dark:text-slate-300">{rx.doctorName}</strong> ({rx.doctorDepartment})
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRx(rx)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all self-start sm:self-center font-outfit"
                >
                  <Printer className="w-3.5 h-3.5" /> View & Print Prescription
                </button>
              </div>

              {/* Medicines Grid */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Prescribed Drugs & Posology ({rx.medicines.length}):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rx.medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-teal-800 dark:text-teal-300 font-outfit text-sm">
                          {med.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">{med.dosage}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                        <span>Freq: <strong>{med.frequency}</strong></span>
                        <span>Duration: <strong>{med.duration}</strong></span>
                      </div>
                      {med.instructions && (
                        <p className="text-[11px] text-teal-600 dark:text-teal-400 italic">
                          Instruction: {med.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {rx.advice && (
                <div className="text-xs text-slate-600 dark:text-slate-400 bg-teal-50/40 dark:bg-teal-950/20 p-3 rounded-2xl border border-teal-200/50 dark:border-teal-900/40">
                  <strong className="text-teal-800 dark:text-teal-300">Doctor's Clinical Advice:</strong> {rx.advice}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prescription View / Print Modal */}
      {selectedRx && (
        <Modal
          isOpen={!!selectedRx}
          onClose={() => setSelectedRx(null)}
          title="Digital Prescription Preview"
          maxWidth="3xl"
        >
          <PrescriptionPrintView
            prescription={selectedRx}
            onClose={() => setSelectedRx(null)}
          />
        </Modal>
      )}
    </div>
  );
};
