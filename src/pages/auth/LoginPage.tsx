import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ThemeToggle } from '../../components/ThemeToggle';
import { FloatingBackground } from '../../components/FloatingBackground';
import {
  Stethoscope,
  Shield,
  HeartPulse,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UserPlus,
  LogIn
} from 'lucide-react';
import { UserRole } from '../../types/index';

interface LoginPageProps {
  onNavigate?: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, register } = useAuth();
  const { showToast } = useNotifications();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Switch to registration mode with selected role
  const handleSelectRoleToRegister = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setMode('signup');
    setErrorMessage('');
    const roleLabels: Record<UserRole, string> = {
      patient: 'Patient Portal',
      doctor: 'Doctor Portal',
      admin: 'Admin Panel',
    };
    showToast('info', `Switched to ${roleLabels[selectedRole]} Registration`, 'Register Account');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must contain at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        showToast('success', `Welcome back, ${res.user.name.split(' ')[0]}!`, 'Signed In');
        if (res.user.role === 'admin') onNavigate?.('/admin/dashboard');
        else if (res.user.role === 'doctor') onNavigate?.('/doctor/dashboard');
        else onNavigate?.('/patient/dashboard');
      } else {
        const res = await register({
          name: fullName,
          email,
          password,
          role,
          phone,
        });
        showToast('success', 'Your account has been created successfully.', 'Welcome to MediNexus');
        if (res.user.role === 'admin') onNavigate?.('/admin/dashboard');
        else if (res.user.role === 'doctor') onNavigate?.('/doctor/dashboard');
        else onNavigate?.('/patient/dashboard');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSuccess(false);
      setForgotEmail('');
      showToast('info', 'Password reset instructions sent to your email.');
    }, 2000);
  };

  return (
    <div className="min-h-screen min-h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative transition-colors duration-200">
      {/* Floating Medical Icons and Radiant Background */}
      <FloatingBackground />

      {/* Top Bar with Theme Toggle and Glowing Brand Mark */}
      <header className="relative z-10 w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {/* Ambient Logo Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur-sm opacity-70 animate-pulse-glow" />
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-extrabold text-lg sm:text-xl shadow-md shadow-teal-500/30">
              M
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-outfit drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]">
              Medi<span className="text-teal-600 dark:text-teal-400">Nexus</span>
            </span>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Centered Glowing Auth Container with Smooth Responsive Scrolling */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 sm:py-8 w-full">
        <div className="w-full max-w-md my-auto">
          {/* Main Brand Title with Luminous Glow Effects */}
          <div className="text-center mb-3 sm:mb-4 relative">
            {/* Radiant Ambient Aura Behind Title */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-16 bg-gradient-to-r from-teal-500/30 via-cyan-500/25 to-emerald-500/30 rounded-full blur-xl pointer-events-none animate-pulse-glow" />
            
            <h1 className="relative text-2xl sm:text-3xl font-extrabold tracking-tight font-outfit leading-tight">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 dark:from-teal-400 dark:via-emerald-300 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(20,184,166,0.5)] dark:drop-shadow-[0_0_24px_rgba(45,212,191,0.6)]">
                MediNexus
              </span>
            </h1>
            
            <div className="relative inline-flex items-center gap-1 px-2.5 py-0.5 mt-1.5 rounded-full bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 dark:border-teal-400/30 shadow-[0_0_12px_rgba(20,184,166,0.18)]">
              <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400 animate-pulse" />
              <p className="text-[11px] sm:text-xs font-semibold text-teal-700 dark:text-teal-300">
                Built to Connect. Designed to Care.
              </p>
            </div>
          </div>

          {/* Quick Register by Role Selector */}
          <div className="mb-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-teal-500/30 dark:border-teal-500/25 shadow-[0_0_20px_rgba(20,184,166,0.12)]">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <UserPlus className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                Register for Portal:
              </p>
              <span className="text-[9px] sm:text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                Click role to sign up
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleSelectRoleToRegister('patient')}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                  mode === 'signup' && role === 'patient'
                    ? 'bg-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-400'
                    : 'bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60'
                }`}
              >
                <HeartPulse className="w-3 h-3 flex-shrink-0" />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRoleToRegister('doctor')}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                  mode === 'signup' && role === 'doctor'
                    ? 'bg-teal-600 text-white shadow-[0_0_12px_rgba(20,184,166,0.5)] border border-teal-400'
                    : 'bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                }`}
              >
                <Stethoscope className="w-3 h-3 flex-shrink-0" />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRoleToRegister('admin')}
                className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all transform active:scale-95 cursor-pointer ${
                  mode === 'signup' && role === 'admin'
                    ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-amber-400'
                    : 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                }`}
              >
                <Shield className="w-3 h-3 flex-shrink-0" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Compact Auth Card */}
          <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1),0_0_25px_rgba(20,184,166,0.12)] dark:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.5),0_0_25px_rgba(20,184,166,0.18)] transition-all">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800/80 rounded-xl p-0.5 mb-3 border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create Account
              </button>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div className="mb-2.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {mode === 'signup' && (
                <>
                  {/* Active Registering Role Badge */}
                  <div className="p-1.5 rounded-lg bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/70 dark:border-teal-800/60 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Registering As:
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 shadow-xs">
                      {role === 'admin' ? 'Hospital Admin' : role === 'doctor' ? 'Doctor / Specialist' : 'Patient'}
                    </span>
                  </div>

                  {/* 2-Column Grid for Name and Phone in Signup Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                        Full Name *
                      </label>
                      <input
                        id="signup-name"
                        type="text"
                        required
                        placeholder={role === 'doctor' ? 'Dr. Aakash Roy' : role === 'admin' ? 'Rajesh Sharma' : 'Rohan Verma'}
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                        Phone Number
                      </label>
                      <input
                        id="signup-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    placeholder={mode === 'login' ? 'doctor@medinexus.com' : 'your.email@example.com'}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 sm:py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              {/* Password Fields */}
              {mode === 'signup' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 sm:py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full pl-8 pr-2.5 py-1.5 sm:py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-8 pr-8 py-1.5 sm:py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center pt-0.5">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="remember-me" className="ml-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Remember my credentials
                  </label>
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 mt-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.3)] flex items-center justify-center gap-2 text-xs sm:text-sm transition-all transform active:scale-95 disabled:opacity-70 font-outfit cursor-pointer"
              >
                {isLoading ? (
                  <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In to Portal' : 'Register New Account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-outfit mb-1">
              Reset Password
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              Enter your registered MediNexus email address to receive secure recovery instructions.
            </p>

            {forgotSuccess ? (
              <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-lg text-teal-700 dark:text-teal-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Password reset link dispatched!
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mandatory Exact Footer */}
      <footer className="relative z-10 w-full py-4 px-4 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm flex-shrink-0">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Where technology meets healthcare — by Vishnu Priyan S
        </p>
      </footer>
    </div>
  );
};
