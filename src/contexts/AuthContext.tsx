import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Doctor, Patient, UserRole, AuthResponse } from '../types/index';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  doctorProfile: Doctor | null;
  patientProfile: Patient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (formData: any) => Promise<AuthResponse>;
  logout: () => void;
  updateUserContext: (user: User, doctor?: Doctor, patient?: Patient) => void;
  refreshDoctorProfile: () => Promise<void>;
  refreshPatientProfile: () => Promise<void>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [patientProfile, setPatientProfile] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const initAuth = async () => {
    try {
      const token = localStorage.getItem('medinexus_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const data = await api.getMe();
      setUser(data.user);
      setDoctorProfile(data.doctorProfile || null);
      setPatientProfile(data.patientProfile || null);
    } catch (err) {
      console.warn('Session verification failed, clearing token:', err);
      api.logout();
      setUser(null);
      setDoctorProfile(null);
      setPatientProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const data = await api.login(email, pass);
      setUser(data.user);
      setDoctorProfile(data.doctorProfile || null);
      setPatientProfile(data.patientProfile || null);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const data = await api.register(formData);
      setUser(data.user);
      setDoctorProfile(data.doctorProfile || null);
      setPatientProfile(data.patientProfile || null);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setDoctorProfile(null);
    setPatientProfile(null);
  };

  const updateUserContext = (updatedUser: User, doc?: Doctor, pat?: Patient) => {
    setUser(updatedUser);
    if (doc) setDoctorProfile(doc);
    if (pat) setPatientProfile(pat);
  };

  const refreshDoctorProfile = async () => {
    if (doctorProfile) {
      try {
        const fresh = await api.getDoctor(doctorProfile.id);
        setDoctorProfile(fresh);
      } catch (e) {
        console.error('Failed to refresh doctor profile:', e);
      }
    }
  };

  const refreshPatientProfile = async () => {
    if (patientProfile) {
      try {
        const fresh = await api.getPatient(patientProfile.id);
        setPatientProfile(fresh);
      } catch (e) {
        console.error('Failed to refresh patient profile:', e);
      }
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    let email = 'patient@medinexus.com';
    let pass = 'patient123';
    if (role === 'admin') {
      email = 'admin@medinexus.com';
      pass = 'admin123';
    } else if (role === 'doctor') {
      email = 'doctor@medinexus.com';
      pass = 'doctor123';
    }
    await login(email, pass);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        doctorProfile,
        patientProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserContext,
        refreshDoctorProfile,
        refreshPatientProfile,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
