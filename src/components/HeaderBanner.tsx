import React, { useState } from 'react';
import { Bell, Settings, ChevronDown, CheckCircle, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeaderBanner: React.FC = () => {
  const { settings, notifications, setCurrentView } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="relative w-full bg-gradient-to-r from-[#07244C] via-[#0D3874] to-[#1258A6] text-white overflow-hidden shadow-lg border-b border-[#1E62AF]/40">
      {/* Mathematical background decorative wireframes and glowing formulas */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mathGrid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Subtle grid */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative math illustration overlays */}
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none opacity-40 hidden xl:flex items-center space-x-6">
        {/* Glowing Pi symbol */}
        <div className="text-6xl font-serif text-[#60A5FA] select-none font-bold drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]">
          π
        </div>
        {/* Math coordinate diagram */}
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" stroke="currentColor" className="text-sky-300">
          <line x1="5" y1="50" x2="95" y2="50" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="15" y1="5" x2="15" y2="55" strokeWidth="1.5" strokeOpacity="0.6" />
          <path d="M 15 45 Q 45 10 90 20" strokeWidth="2" stroke="#38BDF8" fill="none" />
          <circle cx="50" cy="23" r="3" fill="#FBBF24" />
        </svg>
        {/* Glowing 3D Wireframe Cube */}
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#93C5FD" strokeWidth="1" className="opacity-60">
          <rect x="15" y="15" width="28" height="28" />
          <rect x="23" y="7" width="28" height="28" />
          <line x1="15" y1="15" x2="23" y2="7" />
          <line x1="43" y1="15" x2="51" y2="7" />
          <line x1="15" y1="43" x2="23" y2="35" />
          <line x1="43" y1="43" x2="51" y2="35" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: School Crest Logo & Title */}
        <div className="flex items-center space-x-4">
          {/* Circular School Emblem */}
          <div className="relative group cursor-pointer flex-shrink-0" onClick={() => setCurrentView('overview')}>
            <div className="w-16 h-16 rounded-full bg-white p-1 shadow-md border-2 border-[#EAB308] flex items-center justify-center transition-transform hover:scale-105">
              <div className="w-full h-full rounded-full border border-blue-900 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-0.5 text-center">
                {/* SVG Emblem for Trường Thạnh Lộc */}
                <svg viewBox="0 0 100 100" className="w-9 h-9">
                  {/* Outer circle */}
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#073B78" strokeWidth="3" />
                  {/* Torch of wisdom */}
                  <path d="M50 20 L53 32 L47 32 Z" fill="#DC2626" />
                  <path d="M47 32 Q50 38 53 32 L51 46 L49 46 Z" fill="#F59E0B" />
                  {/* Open book */}
                  <path d="M26 58 Q50 48 50 64 Q50 48 74 58 L72 74 Q50 64 50 78 Q50 64 28 74 Z" fill="#1E40AF" />
                  {/* Pages accent */}
                  <path d="M29 60 Q50 51 50 65 Q50 51 71 60" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="text-[7.5px] font-bold text-[#073B78] uppercase tracking-tighter leading-none mt-0.5">
                  THẠNH LỘC
                </span>
              </div>
            </div>
            {/* Soft pulse aura */}
            <div className="absolute inset-0 rounded-full border border-yellow-300/40 animate-ping opacity-25 pointer-events-none" />
          </div>

          {/* Title and Branding */}
          <div className="text-left">
            <h1 className="text-2xl lg:text-[28px] font-bold tracking-wide uppercase text-white drop-shadow-sm font-serif">
              TRỢ LÝ DẠY HỌC TOÁN
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-[#FBBF24] font-bold text-base lg:text-lg tracking-wide uppercase font-serif drop-shadow">
                THẦY {settings.teacherName.toUpperCase()}
              </span>
              <span className="text-white/60 font-light">|</span>
              <span className="text-white font-semibold text-base lg:text-lg tracking-wide uppercase font-serif">
                {settings.schoolName}
              </span>
            </div>
            <p className="text-xs lg:text-sm text-sky-200/90 italic font-serif mt-0.5 tracking-wide">
              — {settings.slogan} —
            </p>
          </div>
        </div>

        {/* Right: Actions, Notifications & Teacher Profile */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* Notification Button */}
          <button
            onClick={() => setCurrentView('notifications')}
            title="Trung tâm thông báo"
            className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0D3874] shadow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setCurrentView('settings')}
            title="Cài đặt hệ thống"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Teacher Profile Chip */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full py-1.5 pl-1.5 pr-4 cursor-pointer transition-all duration-200 shadow-sm"
            >
              {/* Teacher Avatar (Matches reference image style) */}
              <div className="w-10 h-10 rounded-full border-2 border-white/80 overflow-hidden bg-slate-200 shadow-inner flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                  alt={settings.teacherName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to stylized SVG avatar if network fails
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="w-full h-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
                  HM
                </div>
              </div>

              {/* Teacher Info */}
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-sm font-bold text-white tracking-wide font-serif">
                  {settings.teacherName}
                </div>
                <div className="text-[11px] text-sky-200 font-serif">
                  {settings.teacherTitle}
                </div>
                <div className="text-[10px] text-white/70 font-serif">
                  {settings.schoolName}
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-white/80" />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs text-slate-500">Tài khoản giáo viên</p>
                  <p className="font-bold text-slate-800 text-sm font-serif">{settings.teacherName}</p>
                  <p className="text-xs text-blue-600 font-serif">{settings.teacherTitle}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    Đã xác thực giáo viên THPT
                  </div>
                </div>

                <div className="py-1 text-sm font-serif">
                  <button
                    onClick={() => {
                      setCurrentView('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    Cấu hình năm học {settings.academicYear}
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('overview');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Xem trang Tổng quan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
