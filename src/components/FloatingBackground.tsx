import React from 'react';
import {
  Stethoscope,
  Heart,
  HeartPulse,
  Activity,
  Syringe,
  Pill,
  Building2,
  Thermometer,
  Dna,
  Microscope,
  ShieldCheck,
  FlaskConical,
  Bandage,
  FileHeart,
  Plus,
  Sparkles
} from 'lucide-react';

interface FloatingItem {
  Icon: React.ElementType;
  size: number;
  top: string;
  left: string;
  animationClass: string;
  duration: string;
  delay: string;
  colorClass: string;
  bgGlowClass?: string;
  hasBadge?: boolean;
  label?: string;
}

export const FloatingBackground: React.FC = () => {
  const floatingTools: FloatingItem[] = [
    // Top Left - Clinical Diagnostics
    {
      Icon: Stethoscope,
      size: 46,
      top: '6%',
      left: '4%',
      animationClass: 'animate-float-drift',
      duration: '14s',
      delay: '0s',
      colorClass: 'text-teal-500/45 dark:text-teal-400/40 drop-shadow-[0_0_12px_rgba(20,184,166,0.4)]',
      bgGlowClass: 'bg-teal-500/15 dark:bg-teal-400/15 shadow-[0_0_20px_rgba(20,184,166,0.25)]',
      hasBadge: true,
      label: 'Diagnostics',
    },
    {
      Icon: Syringe,
      size: 38,
      top: '28%',
      left: '7%',
      animationClass: 'animate-float',
      duration: '16s',
      delay: '2s',
      colorClass: 'text-cyan-600/45 dark:text-cyan-400/35 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]',
    },
    {
      Icon: Thermometer,
      size: 36,
      top: '48%',
      left: '3%',
      animationClass: 'animate-float-reverse',
      duration: '18s',
      delay: '1s',
      colorClass: 'text-emerald-600/45 dark:text-emerald-400/35 drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]',
    },
    {
      Icon: HeartPulse,
      size: 44,
      top: '72%',
      left: '6%',
      animationClass: 'animate-float-drift',
      duration: '15s',
      delay: '3s',
      colorClass: 'text-rose-500/45 dark:text-rose-400/40 drop-shadow-[0_0_14px_rgba(244,63,94,0.45)]',
      bgGlowClass: 'bg-rose-500/15 dark:bg-rose-400/15 shadow-[0_0_22px_rgba(244,63,94,0.25)]',
      hasBadge: true,
      label: 'Cardiology',
    },

    // Center / Floating Ambient Nodes
    {
      Icon: Dna,
      size: 46,
      top: '12%',
      left: '42%',
      animationClass: 'animate-float',
      duration: '20s',
      delay: '2.5s',
      colorClass: 'text-indigo-500/40 dark:text-indigo-400/30 drop-shadow-[0_0_12px_rgba(99,102,241,0.35)]',
    },
    {
      Icon: Microscope,
      size: 42,
      top: '24%',
      left: '58%',
      animationClass: 'animate-float-reverse',
      duration: '17s',
      delay: '4s',
      colorClass: 'text-teal-600/45 dark:text-teal-400/35 drop-shadow-[0_0_12px_rgba(20,184,166,0.35)]',
      bgGlowClass: 'bg-teal-500/15 dark:bg-teal-400/15 shadow-[0_0_20px_rgba(20,184,166,0.25)]',
      hasBadge: true,
      label: 'Pathology',
    },
    {
      Icon: Bandage,
      size: 34,
      top: '84%',
      left: '45%',
      animationClass: 'animate-float-drift',
      duration: '16s',
      delay: '1.2s',
      colorClass: 'text-amber-600/45 dark:text-amber-400/35 drop-shadow-[0_0_10px_rgba(245,158,11,0.35)]',
    },

    // Top Right - Vital Care & Pharmacy
    {
      Icon: Activity,
      size: 50,
      top: '8%',
      left: '88%',
      animationClass: 'animate-float-drift',
      duration: '15s',
      delay: '1.5s',
      colorClass: 'text-teal-600/45 dark:text-teal-400/40 drop-shadow-[0_0_14px_rgba(20,184,166,0.45)]',
      bgGlowClass: 'bg-teal-500/15 dark:bg-teal-400/15 shadow-[0_0_22px_rgba(20,184,166,0.25)]',
      hasBadge: true,
      label: 'Vitals 24/7',
    },
    {
      Icon: Pill,
      size: 40,
      top: '32%',
      left: '92%',
      animationClass: 'animate-float',
      duration: '13s',
      delay: '3.5s',
      colorClass: 'text-sky-500/45 dark:text-sky-400/35 drop-shadow-[0_0_10px_rgba(14,165,233,0.35)]',
    },
    {
      Icon: FlaskConical,
      size: 42,
      top: '55%',
      left: '90%',
      animationClass: 'animate-float-reverse',
      duration: '19s',
      delay: '0.5s',
      colorClass: 'text-purple-500/45 dark:text-purple-400/35 drop-shadow-[0_0_12px_rgba(168,85,247,0.35)]',
      bgGlowClass: 'bg-purple-500/15 dark:bg-purple-400/15 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      hasBadge: true,
      label: 'Pharmacy',
    },
    {
      Icon: ShieldCheck,
      size: 44,
      top: '80%',
      left: '86%',
      animationClass: 'animate-float-drift',
      duration: '16s',
      delay: '2.8s',
      colorClass: 'text-emerald-500/45 dark:text-emerald-400/40 drop-shadow-[0_0_14px_rgba(16,185,129,0.4)]',
      bgGlowClass: 'bg-emerald-500/15 dark:bg-emerald-400/15 shadow-[0_0_22px_rgba(16,185,129,0.25)]',
      hasBadge: true,
      label: 'NABH / HIPAA',
    },

    // Bottom Center & Mid Anchors
    {
      Icon: FileHeart,
      size: 38,
      top: '68%',
      left: '26%',
      animationClass: 'animate-float',
      duration: '18s',
      delay: '3s',
      colorClass: 'text-teal-600/45 dark:text-teal-400/35 drop-shadow-[0_0_10px_rgba(20,184,166,0.35)]',
    },
    {
      Icon: Building2,
      size: 46,
      top: '76%',
      left: '68%',
      animationClass: 'animate-float-reverse',
      duration: '21s',
      delay: '1s',
      colorClass: 'text-blue-600/40 dark:text-blue-400/30 drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    },
    {
      Icon: Sparkles,
      size: 28,
      top: '18%',
      left: '22%',
      animationClass: 'animate-pulse-glow',
      duration: '8s',
      delay: '0.8s',
      colorClass: 'text-teal-500/50 dark:text-teal-400/40 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]',
    },
    {
      Icon: Plus,
      size: 26,
      top: '40%',
      left: '78%',
      animationClass: 'animate-pulse-glow',
      duration: '6s',
      delay: '2.2s',
      colorClass: 'text-rose-500/45 dark:text-rose-400/35 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none no-print"
    >
      {/* High-Luminance Ambient Medical Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-teal-500/20 dark:bg-teal-500/18 rounded-full blur-[100px] animate-pulse-glow" />
      <div
        className="absolute top-1/4 -right-32 w-[30rem] h-[30rem] bg-cyan-500/20 dark:bg-cyan-500/18 rounded-full blur-[100px] animate-pulse-glow"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[120px] animate-pulse-glow"
        style={{ animationDelay: '4.5s' }}
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[34rem] h-[34rem] bg-teal-600/18 dark:bg-teal-600/15 rounded-full blur-[110px] animate-pulse-glow"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Floating Heartbeat / ECG Wave Pattern Across Background */}
      <svg
        className="absolute top-20 left-0 w-full h-24 opacity-[0.14] dark:opacity-[0.18] text-teal-500 dark:text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]"
        fill="none"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 L300,50 L320,50 L330,20 L340,85 L355,10 L370,65 L380,50 L400,50 L700,50 L720,50 L730,15 L740,90 L755,5 L770,70 L780,50 L800,50 L1100,50 L1120,50 L1130,20 L1140,85 L1155,10 L1170,65 L1180,50 L1200,50"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg-line"
        />
      </svg>

      <svg
        className="absolute bottom-24 left-0 w-full h-20 opacity-[0.10] dark:opacity-[0.14] text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        fill="none"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 L200,50 L220,50 L230,25 L240,80 L255,15 L270,60 L280,50 L300,50 L600,50 L620,50 L630,25 L640,80 L655,15 L670,60 L680,50 L700,50 L1000,50 L1020,50 L1030,25 L1040,80 L1055,15 L1070,60 L1080,50 L1200,50"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg-line"
          style={{ animationDuration: '6s' }}
        />
      </svg>

      {/* Floating Medical Tools & Icons */}
      {floatingTools.map((item, idx) => {
        const IconComp = item.Icon;
        return (
          <div
            key={idx}
            className={`absolute flex items-center gap-2 transition-transform duration-1000 ${item.animationClass}`}
            style={{
              top: item.top,
              left: item.left,
              animationDuration: item.duration,
              animationDelay: item.delay,
            }}
          >
            {item.hasBadge ? (
              <div
                className={`p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border border-teal-500/30 dark:border-teal-400/25 backdrop-blur-xs shadow-sm flex items-center gap-2 ${
                  item.bgGlowClass || 'bg-white/45 dark:bg-slate-900/45'
                }`}
              >
                <IconComp
                  size={item.size}
                  className={item.colorClass}
                  strokeWidth={1.75}
                />
                {item.label && (
                  <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-wider font-outfit text-teal-900/60 dark:text-teal-300/50 select-none">
                    {item.label}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-1">
                <IconComp
                  size={item.size}
                  className={`${item.colorClass}`}
                  strokeWidth={1.6}
                />
              </div>
            )}
          </div>
        );
      })}

      {/* Medical Cross Plus Grid Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1.2px,transparent_1.2px)] [background-size:36px_36px] opacity-[0.06] dark:opacity-[0.08]" />
    </div>
  );
};
