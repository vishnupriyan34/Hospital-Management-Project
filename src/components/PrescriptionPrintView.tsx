import React from 'react';
import { Prescription } from '../types/index';
import { Printer, Download, Pill, Activity, ShieldCheck } from 'lucide-react';

interface PrescriptionPrintViewProps {
  prescription: Prescription;
  onClose?: () => void;
}

export const PrescriptionPrintView: React.FC<PrescriptionPrintViewProps> = ({ prescription, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header in Modal (Hidden during printing) */}
      <div className="no-print flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-xs font-semibold uppercase text-teal-600 dark:text-teal-400">Digital Health Document</span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Rx #{prescription.prescriptionNumber}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Clinical Sheet */}
      <div className="printable-card bg-white text-slate-900 p-8 rounded-2xl border border-slate-300 shadow-md font-sans">
        {/* Hospital Header */}
        <div className="flex justify-between items-start border-b-2 border-teal-700 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-extrabold-800 text-xl tracking-tight">
              MN
            </div>
            <div>
              <h1 className="text-2xl font-extrabold-800 tracking-tight text-teal-900 font-outfit">
                MediNexus
              </h1>
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                Super Specialty Hospital & Research Institute
              </p>
              <p className="text-[11px] text-slate-500">
                402 Healthcare Nexus Way, Cyber Park, Bengaluru | 24x7 Helpline: 1800-MEDINEXUS
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-lg mb-1">
              OFFICIAL ELECTRONIC PRESCRIPTION
            </div>
            <p className="text-xs text-slate-500 font-mono">Date: {prescription.date}</p>
            <p className="text-xs text-slate-500 font-mono">Rx ID: {prescription.prescriptionNumber}</p>
          </div>
        </div>

        {/* Doctor and Patient Details Grid */}
        <div className="grid grid-cols-2 gap-6 my-6 py-4 px-5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
          {/* Doctor Info */}
          <div className="space-y-1 border-r border-slate-200 pr-4">
            <p className="font-semibold text-slate-500 uppercase text-[10px]">Consultant Details</p>
            <p className="text-sm font-bold text-slate-900">{prescription.doctorName}</p>
            <p className="text-teal-700 font-medium">{prescription.doctorSpecialization} ({prescription.departmentName})</p>
            <p className="text-slate-600">{prescription.doctorQualification}</p>
            <p className="text-slate-500 font-mono">Reg / MCI Lic: {prescription.doctorLicense}</p>
          </div>

          {/* Patient Info */}
          <div className="space-y-1 pl-2">
            <p className="font-semibold text-slate-500 uppercase text-[10px]">Patient Demographics</p>
            <p className="text-sm font-bold text-slate-900">{prescription.patientName}</p>
            <p className="text-slate-700">
              Age: <span className="font-semibold">{prescription.patientAge} Years</span> | Gender: <span className="font-semibold">{prescription.patientGender}</span>
            </p>
            <p className="text-slate-600">
              Clinical Diagnosis: <span className="font-bold text-teal-800">{prescription.diagnosis}</span>
            </p>
          </div>
        </div>

        {/* Rx Symbol */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-extrabold font-serif text-teal-800">℞</span>
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Medication Regimen</span>
        </div>

        {/* Medicines Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-teal-800 text-white font-semibold">
                <th className="py-2.5 px-4 w-8">#</th>
                <th className="py-2.5 px-4">Medicine & Formulation</th>
                <th className="py-2.5 px-4">Dosage</th>
                <th className="py-2.5 px-4">Frequency</th>
                <th className="py-2.5 px-4">Duration</th>
                <th className="py-2.5 px-4">Special Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prescription.medicines.map((med, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-3 px-4 font-mono text-slate-500">{i + 1}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 text-sm">{med.name}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{med.dosage}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-800 rounded font-medium">
                      {med.frequency}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{med.duration}</td>
                  <td className="py-3 px-4 text-slate-600 italic">{med.instructions || 'As directed'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clinical Advice & Follow Up */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-8">
          <div className="col-span-2">
            <p className="font-bold text-slate-700 uppercase text-[10px] mb-1">General Dietary & Clinical Advice:</p>
            <p className="text-slate-700 leading-relaxed">{prescription.advice || 'Drink adequate water, maintain regular sleep cycles, and adhere strictly to prescribed dosages.'}</p>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="font-bold text-slate-700 uppercase text-[10px] mb-1">Scheduled Review / Follow-Up:</p>
            <p className="font-bold text-teal-800 text-sm">{prescription.followUpDate || 'After 2 weeks or SOS'}</p>
          </div>
        </div>

        {/* Footer & Signature */}
        <div className="flex justify-between items-end border-t border-slate-200 pt-6">
          <div className="text-[11px] text-slate-500 space-y-0.5">
            <p className="flex items-center gap-1.5 font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Digitally Authenticated via MediNexus Clinical Platform
            </p>
            <p>Generated by {prescription.doctorName} on {new Date(prescription.createdAt).toLocaleString()}</p>
            <p className="italic">Where technology meets healthcare — by Vishnu Priyan S</p>
          </div>

          <div className="text-center">
            <div className="w-48 border-b-2 border-slate-800 pb-1 mb-1 font-serif text-sm font-semibold text-slate-800">
              {prescription.doctorName}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Authorized Medical Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
