import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { FloatingBackground } from './FloatingBackground';
import { ToastContainer } from './ToastContainer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-teal-500 selection:text-white relative">
      <FloatingBackground />
      <ToastContainer />
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Modern Compact Global Footer */}
      <footer className="no-print w-full py-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center text-xs text-slate-500 dark:text-slate-400 relative z-10">
        <p className="font-medium">
          MediNexus • Built to Connect. Designed to Care. — <span className="text-teal-600 dark:text-teal-400 font-semibold">Where technology meets healthcare — by Vishnu Priyan S</span>
        </p>
      </footer>
    </div>
  );
};
