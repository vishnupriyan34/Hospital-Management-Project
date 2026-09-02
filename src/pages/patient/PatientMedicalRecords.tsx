import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MedicalRecord } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  FileText,
  Calendar,
  Stethoscope,
  Activity,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

export const PatientMedicalRecords: React.FC = () => {
  const { showToast } = useNotifications();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      try {
        const data = await api.getMedicalRecords();
        setRecords(data);
      } catch (err: any) {
        showToast('error', 'Failed to load medical records.');
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
          Electronic Health Records (EHR)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Your complete clinical diagnosis history, documented symptoms, therapeutic plans, and lab tests.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your medical history...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
            No Medical Records Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Clinical diagnoses and doctor visit summaries will be logged here following your appointments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(rec => (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 hover:border-teal-500/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Record Ref: {rec.recordNumber}
                  </span>
                  <h3 className="text-lg font-bold text-teal-800 dark:text-teal-300 font-outfit mt-0.5">
                    {rec.diagnosis}
                  </h3>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Visit: {rec.visitDate}
                  </span>
                  {rec.doctorName && (
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-600" />
                      {rec.doctorName}
                    </span>
                  )}
                </div>
              </div>

              {/* Symptoms */}
              <div className="text-xs space-y-1">
                <strong className="text-slate-700 dark:text-slate-300">Reported Symptoms:</strong>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rec.symptoms.map((sym, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold border border-teal-200 dark:border-teal-800"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Treatment Protocol */}
              <div className="text-xs space-y-1">
                <strong className="text-slate-700 dark:text-slate-300">Treatment Plan & Advice:</strong>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                  {rec.treatment}
                </p>
              </div>

              {/* Doctor Medical Notes */}
              {rec.medicalNotes && (
                <div className="text-xs space-y-1">
                  <strong className="text-slate-700 dark:text-slate-300">Clinical Observations:</strong>
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    "{rec.medicalNotes}"
                  </p>
                </div>
              )}

              {/* Lab Reports */}
              {rec.labReports && rec.labReports.length > 0 && (
                <div className="pt-2">
                  <strong className="text-xs text-slate-700 dark:text-slate-300 block mb-1.5">
                    Diagnostic Lab Reports:
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {rec.labReports.map((lab, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{lab.title}</p>
                          <p className="text-[11px] text-slate-500">{lab.result} {lab.normalRange && `(Ref: ${lab.normalRange})`}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lab.status === 'Abnormal' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                          {lab.status || 'Normal'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rec.followUpDate && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Scheduled Follow-up Review:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{rec.followUpDate}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
