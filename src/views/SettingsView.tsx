import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  AlertTriangle,
  Server,
  ShieldCheck,
  School,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDemoData,
    exportBackupData,
    importBackupData,
  } = useApp();

  const [teacherName, setTeacherName] = useState(settings.teacherName);
  const [teacherTitle, setTeacherTitle] = useState(settings.teacherTitle);
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [slogan, setSlogan] = useState(settings.slogan);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [passGrade, setPassGrade] = useState(settings.passGrade);
  const [excellentGrade, setExcellentGrade] = useState(settings.excellentGrade);
  const [goodGrade, setGoodGrade] = useState(settings.goodGrade);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupJson, setBackupJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      teacherName,
      teacherTitle,
      schoolName,
      slogan,
      academicYear,
      passGrade: Number(passGrade),
      excellentGrade: Number(excellentGrade),
      goodGrade: Number(goodGrade),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadBackup = () => {
    const dataStr = exportBackupData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sao_Luu_Du_Lieu_Toan_Thay_Hoang_Minh_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportBackup = () => {
    if (!backupJson.trim()) return;
    const ok = importBackupData(backupJson.trim());
    if (ok) {
      setImportStatus('Phục hồi dữ liệu thành công!');
      setTimeout(() => setImportStatus(null), 4000);
      setBackupJson('');
    } else {
      setImportStatus('Lỗi: Định dạng tệp sao lưu JSON không hợp lệ!');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-serif max-w-4xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Cài Đặt Hệ Thống & Cấu Hình Sư Phạm
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tùy chỉnh thông tin giáo viên, đơn vị trường học, thang điểm và quản lý dữ liệu
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            Đã lưu cài đặt thành công!
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs">
        {/* Section 1: Teacher & School Branding */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <School className="w-4 h-4 text-blue-600" />
            1. Thông tin Giáo viên & Đơn vị công tác
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Họ và tên giáo viên *</label>
              <input
                type="text"
                required
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Chức danh / Bộ môn</label>
              <input
                type="text"
                value={teacherTitle}
                onChange={(e) => setTeacherTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Đơn vị trường học *</label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Năm học giảng dạy</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024 - 2025"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Khẩu hiệu / Slogan sư phạm</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Kiến thức vững vàng – Tương lai tươi sáng"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium italic"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Grading Rules */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            2. Quy chuẩn đánh giá & Tiêu chuẩn điểm số (Chương trình GDPT 2018)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Điểm chuẩn Giỏi (≥)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={excellentGrade}
                onChange={(e) => setExcellentGrade(parseFloat(e.target.value) || 8.0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Mặc định: 8.0</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Điểm chuẩn Khá (≥)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={goodGrade}
                onChange={(e) => setGoodGrade(parseFloat(e.target.value) || 6.5)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Mặc định: 6.5</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Điểm Đạt yêu cầu / Trung bình (≥)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={passGrade}
                onChange={(e) => setPassGrade(parseFloat(e.target.value) || 5.0)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">Dưới mức này là Cần hỗ trợ</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#1877F2] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu cài đặt cấu hình
          </button>
        </div>
      </form>

      {/* Section 3: Data Backup, Restore & Reset */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 text-xs">
        <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
          <Server className="w-4 h-4 text-purple-600" />
          3. Sao lưu, Phục hồi & Khôi phục dữ liệu mẫu
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Backup Action */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-600" />
                Xuất tệp sao lưu (Backup)
              </h4>
              <p className="text-slate-500 mt-1">
                Tải về máy toàn bộ dữ liệu gồm lớp học, học sinh, điểm số, đề kiểm tra và học liệu dưới dạng JSON an toàn.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold self-start cursor-pointer"
            >
              Tải tệp sao lưu (.json)
            </button>
          </div>

          {/* Reset Action */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-rose-800 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                Khôi phục dữ liệu mẫu ban đầu
              </h4>
              <p className="text-slate-600 mt-1">
                Đặt lại toàn bộ 4 lớp học (10A1, 10A2, 11A1, 12A1) với 156 học sinh và các chỉ số chuẩn ban đầu của Trường Thạnh Lộc.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    'Thầy có chắc chắn muốn khôi phục lại dữ liệu mẫu chuẩn của Trường Thạnh Lộc không?'
                  )
                ) {
                  resetToDemoData();
                  alert('Đã khôi phục toàn bộ số liệu chuẩn!');
                }
              }}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold self-start cursor-pointer"
            >
              Khôi phục dữ liệu mẫu chuẩn
            </button>
          </div>
        </div>

        {/* Restore from JSON Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-2">
          <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-emerald-600" />
            Nhập dữ liệu từ tệp sao lưu JSON
          </h4>
          <textarea
            rows={3}
            value={backupJson}
            onChange={(e) => setBackupJson(e.target.value)}
            placeholder="Dán chuỗi nội dung JSON tệp sao lưu vào đây..."
            className="w-full p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] bg-white"
          />

          {importStatus && (
            <p
              className={`font-semibold ${
                importStatus.includes('thành công') ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {importStatus}
            </p>
          )}

          <button
            type="button"
            onClick={handleImportBackup}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold cursor-pointer"
          >
            Nạp dữ liệu từ chuỗi JSON
          </button>
        </div>
      </div>
    </div>
  );
};
