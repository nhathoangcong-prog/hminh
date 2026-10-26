/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './views/OverviewView';
import { ClassesView } from './views/ClassesView';
import { StudentsView } from './views/StudentsView';
import { GradesView } from './views/GradesView';
import { ExamsView } from './views/ExamsView';
import { ProgressView } from './views/ProgressView';
import { AiAssistantView } from './views/AiAssistantView';
import { MaterialsView } from './views/MaterialsView';
import { ReportsView } from './views/ReportsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';
import { Menu, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentView } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'classes':
        return <ClassesView />;
      case 'students':
        return <StudentsView />;
      case 'grades':
        return <GradesView />;
      case 'exams':
        return <ExamsView />;
      case 'progress':
        return <ProgressView />;
      case 'ai_assistant':
        return <AiAssistantView />;
      case 'materials':
        return <MaterialsView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F7FD] font-serif text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header Banner */}
      <HeaderBanner />

      {/* Mobile Toggle Bar */}
      <div className="lg:hidden bg-[#07244C] px-4 py-2 flex items-center justify-between text-white border-b border-blue-900/40">
        <span className="text-xs font-bold font-serif uppercase tracking-wider text-sky-200">
          Menu Điều Hướng Phân Hệ
        </span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 bg-[#07244C] h-full shadow-2xl flex flex-col">
              <div className="p-3 border-b border-blue-900/60 flex items-center justify-between text-white">
                <span className="font-bold text-sm">Phân hệ giảng dạy</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1720px] mx-auto w-full overflow-y-auto">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
