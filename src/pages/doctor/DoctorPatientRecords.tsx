import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Patient, MedicalRecord, Prescription } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import { Modal } from '../../components/Modal';
import { PrescriptionPrintView } from '../../components/PrescriptionPrintView';
import {
  Users,
  Search,
  FileText,
  Pill,
  Heart,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Plus
} from 'lucide-react';

interface DoctorPatientRecordsProps {
  onNavigate?: (path: string) => void;
}

export const DoctorPatientRecords: React.FC<DoctorPatientRecordsProps> = ({ onNavigate }) => {
  const { showToast } = useNotifications();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [patientRx, setPatientRx] = useState<Prescription[]>([]);
  const [activeTab, setActiveTab] = useState<'records' | 'prescriptions' | 'info'>('records');
  const [selectedRxModal, setSelectedRxModal] = useState<Prescription | null>(null);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPatients(search);
      setPatients(data);
    } catch (err: any) {
      showToast('error', 'Could not load patient records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [search]);

  const handleSelectPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    try {
      const [records, rxs] = await Promise.all([
        api.getMedicalRecords(patient.id),
        api.getPrescriptions(patient.id),
      ]);
      setPatientRecords(records);
      setPatientRx(rxs);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Assigned Patient Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Strict role-restricted electronic health records (EHR) of patients under your clinical care.
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search assigned patients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Patient Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading patient profiles...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
            No Assigned Patients Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Patients who book consultations with you or are assigned to your care will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map(patient => (
            <div
              key={patient.id}
              onClick={() => handleSelectPatient(patient)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/40 cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center font-extrabold-800 text-sm shadow-md shadow-teal-500/20">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {patient.age} yrs • {patient.gender} • Blood: <span className="font-bold text-rose-600 dark:text-rose-400">{patient.bloodGroup}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Active
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
                {patient.allergies.length > 0 && (
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold pt-1">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate text-[11px]">Allergies: {patient.allergies.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 text-[11px]">Click to view full EHR</span>
                <span className="text-teal-600 dark:text-teal-400 font-bold group-hover:translate-x-1 transition-transform">
                  View Medical Chart →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient EHR Detailed Modal */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`Electronic Health Record: ${selectedPatient.name}`}
          subtitle={`Age: ${selectedPatient.age} | Gender: ${selectedPatient.gender} | Blood: ${selectedPatient.bloodGroup} | Phone: ${selectedPatient.phone}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
              <button
                onClick={() => setActiveTab('records')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'records'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Clinical Diagnoses & Notes ({patientRecords.length})
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'prescriptions'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Issued Prescriptions ({patientRx.length})
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'info'
                    ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Demographics & Contacts
              </button>
            </div>

            {/* Tab 1: Clinical Diagnoses */}
            {activeTab === 'records' && (
              <div className="space-y-4">
                {patientRecords.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No clinical diagnoses logged yet for this patient.
                  </p>
                ) : (
                  patientRecords.map(rec => (
                    <div
                      key={rec.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400">Record: {rec.recordNumber}</span>
                          <h4 className="text-sm font-bold text-teal-800 dark:text-teal-300 font-outfit">
                            {rec.diagnosis}
                          </h4>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">Visit Date: {rec.visitDate}</span>
                      </div>

                      <div className="text-xs space-y-2">
                        <div>
                          <strong className="text-slate-700 dark:text-slate-300">Reported Symptoms:</strong>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {rec.symptoms.map((sym, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[11px] font-medium border border-teal-200 dark:border-teal-800"
                              >
                                {sym}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <strong className="text-slate-700 dark:text-slate-300">Treatment Plan:</strong>
                          <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            {rec.treatment}
                          </p>
                        </div>

                        {rec.medicalNotes && (
                          <div>
                            <strong className="text-slate-700 dark:text-slate-300">Physician Notes:</strong>
                            <p className="text-slate-500 dark:text-slate-400 mt-0.5 italic">
                              "{rec.medicalNotes}"
                            </p>
                          </div>
                        )}

                        {rec.labReports && rec.labReports.length > 0 && (
                          <div className="pt-2">
                            <strong className="text-slate-700 dark:text-slate-300">Diagnostic & Lab Investigations:</strong>
                            <div className="space-y-1.5 mt-1.5">
                              {rec.labReports.map((lab, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]"
                                >
                                  <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{lab.title}</p>
                                    <p className="text-slate-500">{lab.result} {lab.normalRange && `(Ref: ${lab.normalRange})`}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lab.status === 'Abnormal' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                                    {lab.status || 'Normal'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Prescriptions */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-3">
                {patientRx.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">
                    No prescriptions on record.
                  </p>
                ) : (
                  patientRx.map(rx => (
                    <div
                      key={rx.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">{rx.prescriptionNumber}</span>
                          <span className="text-xs font-semibold text-slate-500">{rx.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-outfit mt-0.5">
                          {rx.diagnosis}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {rx.medicines.map(m => `${m.name} (${m.dosage})`).join(', ')}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedRxModal(rx)}
                        className="px-3 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm transition-colors flex-shrink-0"
                      >
                        View Official Rx
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Demographics */}
            {activeTab === 'info' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 font-semibold">Residential Address</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedPatient.address}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">Date of Birth</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedPatient.dateOfBirth} ({selectedPatient.age} years old)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div>
                    <p className="text-slate-500 font-semibold">Emergency Contact Person</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedPatient.emergencyContactName}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-semibold">Emergency Contact Phone</p>
                    <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{selectedPatient.emergencyContactPhone}</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <p className="text-slate-500 font-semibold">Recorded Medical History Summary</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{selectedPatient.medicalHistorySummary}</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Prescription Preview */}
      {selectedRxModal && (
        <Modal
          isOpen={!!selectedRxModal}
          onClose={() => setSelectedRxModal(null)}
          title="Digital Prescription"
          maxWidth="3xl"
        >
          <PrescriptionPrintView
            prescription={selectedRxModal}
            onClose={() => setSelectedRxModal(null)}
          />
        </Modal>
      )}
    </div>
  );
};
