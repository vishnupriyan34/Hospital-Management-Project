import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Doctor, Department } from '../../types/index';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Stethoscope,
  Search,
  Building2,
  CalendarPlus,
  Star,
  Award,
  DollarSign,
  Clock,
  User
} from 'lucide-react';

interface PatientDoctorsProps {
  onNavigate: (path: string) => void;
}

export const PatientDoctors: React.FC<PatientDoctorsProps> = ({ onNavigate }) => {
  const { showToast } = useNotifications();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadDoctorsAndDepts = async () => {
      setIsLoading(true);
      try {
        const [docs, depts] = await Promise.all([
          api.getDoctors(),
          api.getDepartments(),
        ]);
        setDoctors(docs);
        setDepartments(depts);
      } catch (err: any) {
        showToast('error', 'Failed to load doctors directory.');
      } finally {
        setIsLoading(false);
      }
    };
    loadDoctorsAndDepts();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const matchDept = selectedDeptId === 'all' || doc.departmentId === selectedDeptId;
    const matchSearch = !searchTerm ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold-800 text-slate-900 dark:text-white font-outfit">
            Clinical Specialists Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Discover board-certified physicians, clinical department heads, and experienced consultants.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor or specialty..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedDeptId('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedDeptId === 'all'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
          }`}
        >
          All Specialties ({doctors.length})
        </button>
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setSelectedDeptId(dept.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDeptId === dept.id
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {dept.name}
          </button>
        ))}
      </div>

      {/* Doctor Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading specialist profiles...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-outfit">
            No Doctors Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or selecting another department.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map(doc => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm flex-shrink-0 border border-teal-400/40">
                    {doc.name.replace(/^Dr\.?\s*/i, '').charAt(0).toUpperCase() || 'D'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{doc.rating} / 5.0</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mt-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                      {doc.specialization}
                    </p>
                    <p className="text-xs text-slate-500">{doc.departmentName}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                  <p><strong>Qualifications:</strong> {doc.qualifications}</p>
                  <p><strong>Experience:</strong> {doc.experience}</p>
                  <p className="text-teal-700 dark:text-teal-300">
                    <strong>Clinic Days:</strong> {doc.availableDays.join(', ')}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {doc.about}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Consultation Fee</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-outfit">
                    ${doc.consultationFee} USD
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('/patient/book-appointment')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all active:scale-95 font-outfit"
                >
                  <CalendarPlus className="w-3.5 h-3.5" /> Book Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
