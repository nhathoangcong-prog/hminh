import React, { useState } from 'react';
import {
  PieChart,
  Download,
  Printer,
  Calendar,
  Layers,
  Award,
  Users,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { classes, students, tests, settings, stats } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState('Học kỳ II');

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const reportStudents =
    selectedClassId === 'all'
      ? students
      : students.filter((s) => s.classId === selectedClassId);

  // Calculations for current report scope
  const totalCount = reportStudents.length || 1;
  const excellentCount = reportStudents.filter((s) => s.mathGpa >= 8.0).length;
  const goodCount = reportStudents.filter((s) => s.mathGpa >= 6.5 && s.mathGpa < 8.0).length;
  const averageCount = reportStudents.filter((s) => s.mathGpa >= 5.0 && s.mathGpa < 6.5).length;
  const needSupportCount = reportStudents.filter((s) => s.mathGpa < 5.0).length;

  const avgGpa =
    Math.round(
      (reportStudents.reduce((acc, s) => acc + s.mathGpa, 0) / (reportStudents.length || 1)) * 10
    ) / 10;

  const passRate = Math.round(((totalCount - needSupportCount) / totalCount) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csv = `TRƯỜNG THẠNH LỘC\nBÁO CÁO KẾT QUẢ HỌC TẬP MÔN TOÁN\nGiáo viên: ${settings.teacherName.toUpperCase()}\n`;
    csv += `Phạm vi: ${selectedClass ? selectedClass.name : 'Tất cả các lớp'}, Kỳ: ${selectedSemester}, Năm học: ${settings.academicYear}\n`;
    csv += `Thời điểm xuất: ${new Date().toLocaleString('vi-VN')}\n\n`;
    csv += `STT,Mã Học Sinh,Họ Và Tên,Lớp,ĐTB Môn Toán,Xếp Loại,Trạng Thái\n`;

    reportStudents.forEach((s, idx) => {
      csv += `${idx + 1},"${s.code}","${s.fullName}","${s.className}",${s.mathGpa},"${s.status}","${s.notes || ''}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Mon_Toan_${selectedClass?.code || 'Toan_Bo'}_${settings.academicYear.replace(/\s+/g, '')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-rose-600" />
            Báo Cáo & Thống Kê Chất Lượng Giáo Dục
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp kết quả học tập môn Toán theo quy chuẩn báo cáo sư phạm
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Xuất Excel/CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            In báo cáo chính thức
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Chọn lớp:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="all">Toàn bộ các lớp ({classes.length} lớp)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code}) - {c.studentCount} HS
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-semibold block mb-1">Học kỳ:</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
            >
              <option value="Học kỳ I">Học kỳ I</option>
              <option value="Học kỳ II">Học kỳ II</option>
              <option value="Cả năm">Cả năm học</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Thời điểm xuất: <strong>{new Date().toLocaleDateString('vi-VN')}</strong>
        </div>
      </div>

      {/* OFFICIAL REPORT DOCUMENT (PRINTABLE AREA) */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-sm printable-area">
        {/* OFFICIAL HEADER REQUIRED BY PROMPT */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center space-y-1">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-600 mb-2">
            <span>SỞ GD&ĐT TP. HỒ CHÍ MINH</span>
            <span>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600 border-b border-dashed border-slate-200 pb-2">
            <span className="font-bold text-slate-900 uppercase">TRƯỜNG THẠNH LỘC</span>
            <span className="italic">Độc lập – Tự do – Hạnh phúc</span>
          </div>

          <div className="pt-4">
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-slate-900 font-serif">
              BÁO CÁO KẾT QUẢ HỌC TẬP MÔN TOÁN
            </h1>
            <p className="text-sm font-semibold uppercase text-slate-700 font-serif mt-1">
              Giáo viên: {settings.teacherName.toUpperCase()}
            </p>
            <p className="text-xs text-slate-500 italic mt-0.5">
              Phạm vi: {selectedClass ? selectedClass.name : 'Toàn bộ các lớp phụ trách'} — {selectedSemester} — Năm học {settings.academicYear}
            </p>
          </div>
        </div>

        {/* 1. Tổng hợp chỉ số chất lượng */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-slate-800 mb-3 border-l-4 border-blue-600 pl-2">
            I. Bảng tổng hợp các chỉ số chất lượng môn Toán
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Tổng số học sinh</span>
              <span className="text-xl font-bold text-slate-800">{reportStudents.length}</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Điểm trung bình môn</span>
              <span className="text-xl font-bold text-blue-700">
                {avgGpa.toString().replace('.', ',')}
              </span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Tỷ lệ đạt yêu cầu (≥ 5.0)</span>
              <span className="text-xl font-bold text-emerald-700">{passRate}%</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block">Số HS cần phụ đạo (&lt; 5.0)</span>
              <span className="text-xl font-bold text-rose-600">{needSupportCount} HS</span>
            </div>
          </div>
        </div>

        {/* 2. Thống kê phân loại học lực */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-slate-800 mb-3 border-l-4 border-blue-600 pl-2">
            II. Phân phối chất lượng học lực
          </h3>

          <table className="w-full text-xs text-left border border-slate-300">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                <th className="py-2 px-3 border-r border-slate-300">Mức học lực</th>
                <th className="py-2 px-3 border-r border-slate-300 text-center">Tiêu chuẩn điểm</th>
                <th className="py-2 px-3 border-r border-slate-300 text-center">Số lượng học sinh</th>
                <th className="py-2 px-3 text-center">Tỷ lệ phần trăm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold text-emerald-700">Giỏi</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center">ĐTB ≥ 8.0</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center font-bold">{excellentCount}</td>
                <td className="py-2 px-3 text-center font-bold">
                  {Math.round((excellentCount / totalCount) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold text-blue-700">Khá</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center">6.5 ≤ ĐTB &lt; 8.0</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center font-bold">{goodCount}</td>
                <td className="py-2 px-3 text-center font-bold">
                  {Math.round((goodCount / totalCount) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold text-amber-700">Trung bình</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center">5.0 ≤ ĐTB &lt; 6.5</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center font-bold">{averageCount}</td>
                <td className="py-2 px-3 text-center font-bold">
                  {Math.round((averageCount / totalCount) * 100)}%
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-r border-slate-300 font-semibold text-rose-700">Cần hỗ trợ (Dưới TB)</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center">ĐTB &lt; 5.0</td>
                <td className="py-2 px-3 border-r border-slate-300 text-center font-bold text-rose-600">
                  {needSupportCount}
                </td>
                <td className="py-2 px-3 text-center font-bold text-rose-600">
                  {Math.round((needSupportCount / totalCount) * 100)}%
                </td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td colSpan={2} className="py-2 px-3 border-r border-slate-300 text-center">
                  Tổng cộng
                </td>
                <td className="py-2 px-3 border-r border-slate-300 text-center">{reportStudents.length}</td>
                <td className="py-2 px-3 text-center">100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3. Danh sách học sinh cần quan tâm bồi dưỡng */}
        {needSupportCount > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase text-rose-800 mb-3 border-l-4 border-rose-600 pl-2">
              III. Danh sách học sinh cần hỗ trợ & giải pháp phụ đạo
            </h3>

            <table className="w-full text-xs text-left border border-slate-300">
              <thead>
                <tr className="bg-rose-50 border-b border-slate-300 text-rose-900 font-bold">
                  <th className="py-2 px-2 text-center w-12 border-r border-slate-300">STT</th>
                  <th className="py-2 px-2 w-28 border-r border-slate-300">Mã HS</th>
                  <th className="py-2 px-2 border-r border-slate-300">Họ và tên</th>
                  <th className="py-2 px-2 text-center w-20 border-r border-slate-300">Lớp</th>
                  <th className="py-2 px-2 text-center w-20 border-r border-slate-300">ĐTB</th>
                  <th className="py-2 px-2">Giải pháp can thiệp của giáo viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportStudents
                  .filter((s) => s.status === 'Cần hỗ trợ')
                  .map((s, idx) => (
                    <tr key={s.id}>
                      <td className="py-2 px-2 text-center border-r border-slate-300">{idx + 1}</td>
                      <td className="py-2 px-2 font-mono border-r border-slate-300">{s.code}</td>
                      <td className="py-2 px-2 font-bold border-r border-slate-300">{s.fullName}</td>
                      <td className="py-2 px-2 text-center font-bold text-blue-700 border-r border-slate-300">
                        {s.className}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-rose-600 border-r border-slate-300">
                        {s.mathGpa.toString().replace('.', ',')}
                      </td>
                      <td className="py-2 px-2 italic text-slate-700">
                        {s.notes ||
                          'Giao thêm phiếu học tập mức độ Nhận biết, kiểm tra lại sau mỗi tuần học.'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Chữ ký xác nhận sư phạm */}
        <div className="mt-12 pt-6 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="font-bold uppercase text-slate-700">BAN GIÁM HIỆU PHÊ DUYỆT</p>
            <p className="text-[11px] italic text-slate-400 mt-1">(Ký và ghi rõ họ tên)</p>
          </div>
          <div>
            <p className="italic text-slate-500">
              Thạnh Lộc, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
            </p>
            <p className="font-bold uppercase text-slate-800 mt-1">GIÁO VIÊN BỘ MÔN TOÁN</p>
            <div className="h-16 flex items-center justify-center font-serif italic text-blue-900 text-lg">
              {settings.teacherName}
            </div>
            <p className="font-bold text-slate-900 uppercase">Thầy {settings.teacherName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
