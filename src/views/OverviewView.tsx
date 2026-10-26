import React from 'react';
import {
  GraduationCap,
  Users,
  FileCheck,
  TrendingUp,
  Trophy,
  BarChart,
  UserCheck,
  FileText,
  LineChart,
  Brain,
  BookOpen,
  PieChart,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OverviewView: React.FC = () => {
  const { stats, classes, tests, notifications, setCurrentView, setSelectedClassId } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* 1. TOP 5 QUICK STAT CARDS (Exact match to screenshot) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Classes */}
        <div
          onClick={() => setCurrentView('classes')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900 font-serif leading-none">
                {stats.totalClasses}
              </div>
              <div className="text-xs text-slate-500 font-serif mt-1">Lớp học</div>
            </div>
          </div>
          <Users className="w-8 h-8 text-slate-100 group-hover:text-blue-100 transition-colors" />
        </div>

        {/* Card 2: Students */}
        <div
          onClick={() => setCurrentView('students')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-900 font-serif leading-none">
                {stats.totalStudents}
              </div>
              <div className="text-xs text-slate-500 font-serif mt-1">Học sinh</div>
            </div>
          </div>
          <UserCheck className="w-8 h-8 text-slate-100 group-hover:text-sky-100 transition-colors" />
        </div>

        {/* Card 3: Tests */}
        <div
          onClick={() => setCurrentView('exams')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-900 font-serif leading-none">
                {stats.totalTests}
              </div>
              <div className="text-xs text-slate-500 font-serif mt-1">Bài kiểm tra</div>
            </div>
          </div>
          <FileText className="w-8 h-8 text-slate-100 group-hover:text-rose-100 transition-colors" />
        </div>

        {/* Card 4: Average Score */}
        <div
          onClick={() => setCurrentView('grades')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-800 font-serif leading-none">
                {stats.overallAverage.toString().replace('.', ',')}
              </div>
              <div className="text-xs text-slate-500 font-serif mt-1">Điểm TB môn Toán</div>
            </div>
          </div>
          <BarChart className="w-8 h-8 text-slate-100 group-hover:text-emerald-100 transition-colors" />
        </div>

        {/* Card 5: Target Pass Rate */}
        <div
          onClick={() => setCurrentView('reports')}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-800 font-serif leading-none">
                {stats.passRate}%
              </div>
              <div className="text-xs text-slate-500 font-serif mt-1">Học sinh đạt yêu cầu</div>
            </div>
          </div>
          <Trophy className="w-8 h-8 text-slate-100 group-hover:text-amber-100 transition-colors" />
        </div>
      </div>

      {/* 2. MIDDLE ROW: BAR CHART, DONUT CHART, STUDENTS NEEDING ATTENTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 2.1 Bar Chart: Kết quả học tập theo lớp (5 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-serif">
              <BarChart className="w-5 h-5 text-blue-600" />
              Kết quả học tập theo lớp
            </h3>
          </div>

          {/* SVG Bar Chart matching screenshot */}
          <div className="h-56 relative flex items-end justify-between px-4 pt-6 pb-2 border-b border-l border-slate-200">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">10</div>
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">8</div>
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">6</div>
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">4</div>

            {/* Bars for 10A1, 10A2, 11A1, 12A1 */}
            {classes.map((c, idx) => {
              const barColors = [
                'bg-[#2185D0] hover:bg-blue-600',
                'bg-[#F2711C] hover:bg-orange-600',
                'bg-[#21BA45] hover:bg-emerald-600',
                'bg-[#7B2CBF] hover:bg-purple-700',
              ];
              const score = c.averageScore || 7.0;
              const heightPct = (score / 10) * 100;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedClassId(c.id);
                    setCurrentView('grades');
                  }}
                  className="flex flex-col items-center flex-1 max-w-[56px] mx-1 z-10 cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-700 font-serif mb-1 group-hover:scale-110 transition-transform">
                    {score.toString().replace('.', ',')}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t h-40 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-500 shadow-sm ${barColors[idx % barColors.length]}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 font-serif mt-2 group-hover:text-blue-600">
                    {c.code}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 font-serif">
            <span className="w-3 h-3 bg-[#2185D0] rounded-sm inline-block" />
            <span>Điểm trung bình môn Toán</span>
          </div>
        </div>

        {/* 2.2 Donut Chart: Tỷ lệ học sinh theo mức học lực (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-serif">
              <PieChart className="w-5 h-5 text-sky-600" />
              Tỷ lệ học sinh theo mức học lực
            </h3>
          </div>

          <div className="flex flex-row items-center justify-around py-2">
            {/* SVG Donut */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                {/* 
                  Circumference = 2 * PI * 35 ≈ 220
                  Giỏi: 12% = 26.4
                  Khá: 28% = 61.6
                  Trung bình: 46% = 101.2
                  Cần hỗ trợ: 14% = 30.8
                */}
                <circle cx="50" cy="50" r="35" fill="none" stroke="#e2e8f0" strokeWidth="18" />
                {/* Giỏi (Green): 12% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="18"
                  strokeDasharray="26.4 220"
                  strokeDashoffset="0"
                />
                {/* Khá (Blue): 28% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="18"
                  strokeDasharray="61.6 220"
                  strokeDashoffset="-26.4"
                />
                {/* Trung bình (Amber): 46% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="18"
                  strokeDasharray="101.2 220"
                  strokeDashoffset="-88"
                />
                {/* Cần hỗ trợ (Red): 14% */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="18"
                  strokeDasharray="30.8 220"
                  strokeDashoffset="-189.2"
                />
              </svg>

              {/* Center count */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-bold text-slate-800 font-serif leading-none">
                  {stats.totalStudents}
                </span>
                <span className="text-[11px] text-slate-500 font-serif mt-0.5">Học sinh</span>
              </div>
            </div>

            {/* Legend list matching screenshot */}
            <div className="space-y-2 text-xs font-serif">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#22C55E] flex-shrink-0" />
                <span className="text-slate-700">Giỏi ({stats.distribution.excellentPct}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#3B82F6] flex-shrink-0" />
                <span className="text-slate-700">Khá ({stats.distribution.goodPct}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B] flex-shrink-0" />
                <span className="text-slate-700">Trung bình ({stats.distribution.averagePct}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] flex-shrink-0" />
                <span className="text-slate-700">Cần hỗ trợ ({stats.distribution.needSupportPct}%)</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 text-[11px] text-slate-400 font-serif border-t border-slate-100">
            Dữ liệu tự động cập nhật khi giáo viên chỉnh sửa bảng điểm
          </div>
        </div>

        {/* 2.3 Table: Học sinh cần quan tâm (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-serif">
              <FileText className="w-5 h-5 text-rose-500" />
              Học sinh cần quan tâm
            </h3>
            <button
              onClick={() => setCurrentView('students')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold font-serif flex items-center gap-0.5"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-2 px-2 text-center">STT</th>
                  <th className="py-2 px-2">Họ và tên</th>
                  <th className="py-2 px-2 text-center">Lớp</th>
                  <th className="py-2 px-2 text-center">ĐTB</th>
                  <th className="py-2 px-2 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.studentsNeedingHelp.slice(0, 5).map((student, idx) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 text-center text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-2 font-semibold text-slate-800">{student.fullName}</td>
                    <td className="py-2 px-2 text-center text-slate-600 font-medium">{student.className}</td>
                    <td className="py-2 px-2 text-center font-bold text-rose-600">
                      {student.mathGpa.toString().replace('.', ',')}
                    </td>
                    <td className="py-2 px-2 text-center">
                      <span className="inline-block px-2 py-0.5 text-[11px] font-bold text-rose-600 bg-rose-50 rounded border border-rose-200">
                        Cần hỗ trợ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setCurrentView('progress')}
              className="text-xs text-blue-600 hover:underline font-serif"
            >
              Lập kế hoạch phụ đạo cho học sinh yếu kém →
            </button>
          </div>
        </div>
      </div>

      {/* 3. SHORTCUT TILES (8 Colorful Pastel Action Cards matching screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Tile 1: Quản lý lớp học */}
        <div
          onClick={() => setCurrentView('classes')}
          className="bg-[#EBF3FE] hover:bg-[#DCE9FD] p-3.5 rounded-xl border border-blue-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Quản lý lớp học
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Tạo lớp, sĩ số, phân công
          </div>
        </div>

        {/* Tile 2: Hồ sơ học sinh */}
        <div
          onClick={() => setCurrentView('students')}
          className="bg-[#E6FBF9] hover:bg-[#D4F7F4] p-3.5 rounded-xl border border-teal-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#0D9488] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Hồ sơ học sinh
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Danh sách, thông tin
          </div>
        </div>

        {/* Tile 3: Điểm số & Kết quả */}
        <div
          onClick={() => setCurrentView('grades')}
          className="bg-[#FEECEF] hover:bg-[#FCD8DF] p-3.5 rounded-xl border border-rose-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#E11D48] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <BarChart className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Điểm số & Kết quả
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Nhập điểm, thống kê
          </div>
        </div>

        {/* Tile 4: Kiểm tra & Luyện tập */}
        <div
          onClick={() => setCurrentView('exams')}
          className="bg-[#F3EEFF] hover:bg-[#E9DEFF] p-3.5 rounded-xl border border-purple-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Kiểm tra & Luyện tập
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Tạo đề, chấm bài
          </div>
        </div>

        {/* Tile 5: Theo dõi tiến độ */}
        <div
          onClick={() => setCurrentView('progress')}
          className="bg-[#FEF6E9] hover:bg-[#FDECCE] p-3.5 rounded-xl border border-amber-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#D97706] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <LineChart className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Theo dõi tiến độ
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Phân tích, biểu đồ
          </div>
        </div>

        {/* Tile 6: Trợ lý AI Toán học */}
        <div
          onClick={() => setCurrentView('ai_assistant')}
          className="bg-[#E7F6FE] hover:bg-[#D5EFFF] p-3.5 rounded-xl border border-sky-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#0284C7] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Trợ lý AI Toán học
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Soạn bài, tạo bài tập
          </div>
        </div>

        {/* Tile 7: Giáo án & Học liệu */}
        <div
          onClick={() => setCurrentView('materials')}
          className="bg-[#EDFAF0] hover:bg-[#DCF5E2] p-3.5 rounded-xl border border-emerald-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Giáo án & Học liệu
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Giáo án, tài liệu, hình ảnh
          </div>
        </div>

        {/* Tile 8: Báo cáo & Thống kê */}
        <div
          onClick={() => setCurrentView('reports')}
          className="bg-[#FDECEF] hover:bg-[#FCD8E0] p-3.5 rounded-xl border border-rose-200/60 cursor-pointer transition-all duration-150 text-center flex flex-col items-center justify-center group shadow-xs hover:shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#E11D48] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
            <PieChart className="w-5 h-5" />
          </div>
          <div className="text-[13px] font-bold text-slate-800 font-serif leading-tight">
            Báo cáo & Thống kê
          </div>
          <div className="text-[11px] text-slate-500 font-serif mt-0.5">
            Xuất Excel, PDF
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: LỊCH KIỂM TRA SẮP TỚI, TIẾN ĐỘ HỌC TẬP, THÔNG BÁO MỚI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 4.1 Lịch kiểm tra sắp tới (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-serif">
              <FileCheck className="w-5 h-5 text-blue-600" />
              Lịch kiểm tra sắp tới
            </h3>
            <button
              onClick={() => setCurrentView('exams')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold font-serif flex items-center gap-0.5"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-2 px-2">Ngày</th>
                  <th className="py-2 px-2">Nội dung kiểm tra</th>
                  <th className="py-2 px-2 text-center">Lớp</th>
                  <th className="py-2 px-2 text-center">Hình thức</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tests.slice(0, 4).map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 font-medium text-slate-600 whitespace-nowrap">
                      {test.testDate}
                    </td>
                    <td className="py-2 px-2 font-semibold text-slate-800">{test.title}</td>
                    <td className="py-2 px-2 text-center font-bold text-blue-700">{test.className}</td>
                    <td className="py-2 px-2 text-center text-slate-500 whitespace-nowrap">
                      {test.durationMinutes} phút
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => setCurrentView('exams')}
              className="text-xs text-blue-600 hover:underline font-serif"
            >
              + Tạo bài kiểm tra hoặc đề luyện tập mới
            </button>
          </div>
        </div>

        {/* 4.2 Tiến độ học tập của học sinh (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-serif">
              <LineChart className="w-5 h-5 text-sky-600" />
              Tiến độ học tập của học sinh
            </h3>
            <button
              onClick={() => setCurrentView('progress')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold font-serif flex items-center gap-0.5"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Line Chart matching screenshot */}
          <div className="h-44 relative border-b border-l border-slate-200 px-3 pt-4 pb-2">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">8</div>
            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">6</div>
            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100 text-[10px] text-slate-400 pl-1">4</div>

            <svg viewBox="0 0 300 130" className="w-full h-full overflow-visible">
              {/* Line 1: Nguyễn Minh An (Blue): T1: 7.2 (y=36), T2: 7.6 (y=31), T3: 8.3 (y=22), T4: 8.8 (y=15) */}
              <polyline
                fill="none"
                stroke="#1877F2"
                strokeWidth="2.5"
                points="25,36 105,31 185,22 265,15"
              />
              <circle cx="25" cy="36" r="3.5" fill="#1877F2" />
              <circle cx="105" cy="31" r="3.5" fill="#1877F2" />
              <circle cx="185" cy="22" r="3.5" fill="#1877F2" />
              <circle cx="265" cy="15" r="3.5" fill="#1877F2" />

              {/* Line 2: Trần Ngọc Bình (Green): T1: 4.0 (y=78), T2: 4.5 (y=71), T3: 4.8 (y=67), T4: 4.9 (y=66) */}
              <polyline
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.5"
                points="25,78 105,71 185,67 265,66"
              />
              <circle cx="25" cy="78" r="3.5" fill="#16A34A" />
              <circle cx="105" cy="71" r="3.5" fill="#16A34A" />
              <circle cx="185" cy="67" r="3.5" fill="#16A34A" />
              <circle cx="265" cy="66" r="3.5" fill="#16A34A" />

              {/* Line 3: Lê Hoàng Phúc (Orange): T1: 6.0 (y=52), T2: 6.4 (y=46), T3: 6.8 (y=41), T4: 7.0 (y=39) */}
              <polyline
                fill="none"
                stroke="#EA580C"
                strokeWidth="2.5"
                points="25,52 105,46 185,41 265,39"
              />
              <circle cx="25" cy="52" r="3.5" fill="#EA580C" />
              <circle cx="105" cy="46" r="3.5" fill="#EA580C" />
              <circle cx="185" cy="41" r="3.5" fill="#EA580C" />
              <circle cx="265" cy="39" r="3.5" fill="#EA580C" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-serif text-slate-500 pt-1">
              <span>Tháng 1</span>
              <span>Tháng 2</span>
              <span>Tháng 3</span>
              <span>Tháng 4</span>
            </div>
          </div>

          {/* Legend dots */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-serif text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2]" />
              <span>Nguyễn Minh An</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              <span>Trần Ngọc Bình</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
              <span>Lê Hoàng Phúc</span>
            </div>
          </div>
        </div>

        {/* 4.3 Thông báo mới (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 font-serif">
              <span className="text-rose-500 text-lg">🔔</span>
              Thông báo mới
            </h3>
            <button
              onClick={() => setCurrentView('notifications')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold font-serif flex items-center gap-0.5"
            >
              Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.slice(0, 5).map((item) => {
              const dotColor =
                item.type === 'exam'
                  ? 'bg-blue-500'
                  : item.type === 'document' || item.type === 'system'
                  ? 'bg-emerald-500'
                  : 'bg-amber-500';

              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentView('notifications')}
                  className="flex items-start space-x-2.5 text-xs font-serif hover:bg-slate-50 p-1 rounded cursor-pointer transition-colors"
                >
                  <span className="text-slate-500 font-medium whitespace-nowrap w-11 flex-shrink-0">
                    {item.date}
                  </span>
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
                  <span className="text-slate-800 font-medium line-clamp-1 flex-1">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center border-t border-slate-100 mt-2">
            <button
              onClick={() => setCurrentView('notifications')}
              className="text-xs text-blue-600 hover:underline font-serif inline-flex items-center gap-1"
            >
              Mở trung tâm thông báo và nhắc việc <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
