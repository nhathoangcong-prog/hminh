import React from 'react';
import {
  Home,
  Users,
  User,
  BarChart3,
  FileText,
  TrendingUp,
  Brain,
  BookOpen,
  PieChart,
  Bell,
  Settings,
} from 'lucide-react';
import { useApp, NavView } from '../context/AppContext';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, notifications } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Tổng quan', icon: Home },
    { id: 'classes', label: 'Quản lý lớp học', icon: Users },
    { id: 'students', label: 'Học sinh', icon: User },
    { id: 'grades', label: 'Điểm số & Kết quả', icon: BarChart3 },
    { id: 'exams', label: 'Kiểm tra & Luyện tập', icon: FileText },
    { id: 'progress', label: 'Theo dõi tiến độ', icon: TrendingUp },
    { id: 'ai_assistant', label: 'Trợ lý AI Toán học', icon: Brain },
    { id: 'materials', label: 'Giáo án & Học liệu', icon: BookOpen },
    { id: 'reports', label: 'Báo cáo & Thống kê', icon: PieChart },
    { id: 'notifications', label: 'Thông báo', icon: Bell, badge: unreadNotifs },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-[#07244C] via-[#0B356E] to-[#082245] text-white flex flex-col justify-between shadow-xl min-h-[calc(100vh-76px)] border-r border-[#154685]/40 select-none">
      {/* Navigation menu list */}
      <div className="py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 text-left font-serif cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#1877F2] to-[#38BDF8] text-white font-bold shadow-md shadow-blue-900/40 translate-x-1'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-sky-300 group-hover:text-white'
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold font-serif ${
                    isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer matching reference screenshot with f(x) and math geometry */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-to-br from-[#0B3D7D]/60 to-[#07254E]/80 border border-sky-400/20 backdrop-blur-sm relative overflow-hidden">
        {/* Subtle geometric wireframe watermark */}
        <div className="absolute right-1 -bottom-2 opacity-20 pointer-events-none text-sky-200">
          <svg width="70" height="70" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <polygon points="50,10 90,90 10,90" strokeWidth="2" />
            <circle cx="50" cy="55" r="28" strokeWidth="1.5" />
            <line x1="10" y1="90" x2="50" y2="10" strokeWidth="1.5" />
            <line x1="90" y1="90" x2="50" y2="10" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl font-bold italic font-serif text-sky-300">f(x)</span>
            <div className="h-0.5 flex-1 bg-gradient-to-r from-sky-400 to-transparent rounded" />
          </div>
          <p className="text-[12px] font-bold text-white uppercase tracking-wider font-serif">
            TOÁN HỌC
          </p>
          <p className="text-[11px] text-sky-200/90 font-serif leading-tight">
            KẾT NỐI TRI THỨC
          </p>
          <p className="text-[11px] text-yellow-300 font-serif leading-tight font-semibold">
            VỚI CUỘC SỐNG
          </p>
        </div>
      </div>
    </aside>
  );
};
