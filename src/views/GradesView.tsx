import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Plus,
  Save,
  Download,
  Printer,
  Check,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TestExam } from '../types';

export const GradesView: React.FC = () => {
  const { tests, classes, students, addTest, updateStudentScore } = useApp();

  const [activeTestId, setActiveTestId] = useState<string>(tests[0]?.id || '');
  const [editingScores, setEditingScores] = useState<Record<string, string>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);

  // New Test form state
  const [newTitle, setNewTitle] = useState('');
  const [newClassId, setNewClassId] = useState(classes[0]?.id || '');
  const [newDate, setNewDate] = useState('20/05/2025');
  const [newType, setNewType] = useState<TestExam['type']>('45 phút (1 tiết)');
  const [newDuration, setNewDuration] = useState(45);
  const [newCoefficient, setNewCoefficient] = useState(2);
  const [newTopic, setNewTopic] = useState('Khảo sát hàm số & Tích phân');

  const currentTest = useMemo(() => {
    return tests.find((t) => t.id === activeTestId) || tests[0];
  }, [tests, activeTestId]);

  // Students belonging to the current test's class
  const classStudents = useMemo(() => {
    if (!currentTest) return [];
    return students.filter((s) => s.classId === currentTest.classId);
  }, [students, currentTest]);

  // Handle score typing
  const handleScoreChange = (studentId: string, val: string) => {
    setEditingScores((prev) => ({ ...prev, [studentId]: val }));
  };

  // Save all entered scores
  const handleSaveScores = () => {
    let savedCount = 0;
    classStudents.forEach((student) => {
      const valStr = editingScores[student.id];
      if (valStr !== undefined && valStr.trim() !== '') {
        const num = parseFloat(valStr.replace(',', '.'));
        if (!isNaN(num) && num >= 0 && num <= 10) {
          updateStudentScore(student.id, currentTest.id, num);
          savedCount++;
        }
      }
    });

    setSaveSuccessMsg(`Đã lưu thành công điểm của ${savedCount} học sinh!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Test statistics
  const testStats = useMemo(() => {
    const scores: number[] = [];
    classStudents.forEach((s) => {
      // Check edited score or saved score
      const edited = editingScores[s.id];
      if (edited !== undefined && edited.trim() !== '') {
        const num = parseFloat(edited.replace(',', '.'));
        if (!isNaN(num) && num >= 0 && num <= 10) scores.push(num);
      } else if (s.testScores[currentTest?.id] !== undefined) {
        scores.push(s.testScores[currentTest.id]);
      }
    });

    if (scores.length === 0) {
      return {
        count: 0,
        avg: 0,
        max: 0,
        min: 0,
        excellent: 0,
        good: 0,
        average: 0,
        weak: 0,
      };
    }

    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round((sum / scores.length) * 10) / 10;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const excellent = scores.filter((s) => s >= 8.0).length;
    const good = scores.filter((s) => s >= 6.5 && s < 8.0).length;
    const average = scores.filter((s) => s >= 5.0 && s < 6.5).length;
    const weak = scores.filter((s) => s < 5.0).length;

    return {
      count: scores.length,
      avg,
      max,
      min,
      excellent,
      good,
      average,
      weak,
    };
  }, [classStudents, editingScores, currentTest]);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const targetClass = classes.find((c) => c.id === newClassId) || classes[0];
    addTest({
      title: newTitle.trim(),
      classId: targetClass.id,
      className: targetClass.code,
      testDate: newDate,
      durationMinutes: Number(newDuration),
      type: newType,
      scale: 10,
      coefficient: Number(newCoefficient),
      topic: newTopic,
      questionCount: 25,
    });
    setIsNewTestModalOpen(false);
    setNewTitle('');
  };

  const handleExportCSV = () => {
    if (!currentTest) return;
    let csv = `BẢNG ĐIỂM KIỂM TRA MÔN TOÁN - ${currentTest.title}\n`;
    csv += `Lớp: ${currentTest.className}, Ngày kiểm tra: ${currentTest.testDate}, Hệ số: ${currentTest.coefficient}\n`;
    csv += `STT,Mã Học Sinh,Họ Và Tên,Điểm Số,Xếp Loại,Ghi Chú\n`;

    classStudents.forEach((s, idx) => {
      const score = s.testScores[currentTest.id];
      const scoreStr = score !== undefined ? score.toString().replace('.', ',') : '';
      const rank =
        score !== undefined
          ? score >= 8
            ? 'Giỏi'
            : score >= 6.5
            ? 'Khá'
            : score >= 5
            ? 'Trung bình'
            : 'Cần hỗ trợ'
          : 'Chưa có điểm';
      csv += `${idx + 1},"${s.code}","${s.fullName}",${scoreStr},"${rank}","${s.notes || ''}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bang_Diem_${currentTest.className}_${currentTest.title.replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-rose-600" />
            Sổ Điểm Điện Tử & Quản Lý Kết Quả
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Nhập, lưu trữ, thống kê phổ điểm và theo dõi kết quả kiểm tra từng lớp
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsNewTestModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tạo bài kiểm tra
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            In bảng điểm
          </button>
        </div>
      </div>

      {/* Select Test Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Chọn bài kiểm tra cần chấm / xem kết quả:
        </label>
        <div className="flex flex-wrap gap-2">
          {tests.map((t) => {
            const isSelected = t.id === activeTestId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTestId(t.id);
                  setEditingScores({});
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all text-left border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {t.className}
                  </span>
                  <span>{t.title}</span>
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  {t.testDate} • {t.durationMinutes} phút • HS {t.coefficient}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {currentTest && (
        <>
          {/* Printable Official Header (Only in print mode) */}
          <div className="hidden print:block text-center mb-6">
            <h3 className="text-sm font-bold uppercase">SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH</h3>
            <h4 className="text-sm font-bold uppercase underline">TRƯỜNG THẠNH LỘC</h4>
            <h2 className="text-lg font-bold uppercase mt-4">
              BẢNG TỔNG HỢP ĐIỂM KIỂM TRA MÔN TOÁN
            </h2>
            <p className="text-xs italic mt-1">
              Bài kiểm tra: {currentTest.title} — Lớp: {currentTest.className} — Ngày: {currentTest.testDate}
            </p>
            <p className="text-xs mt-0.5">Giáo viên phụ trách: THẦY HOÀNG MINH</p>
          </div>

          {/* Test Info & Distribution Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 no-print">
            {/* Test Details Card */}
            <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {currentTest.type}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{currentTest.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Chủ đề: {currentTest.topic}</p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Lớp kiểm tra</span>
                    <span className="text-base font-bold text-blue-700">{currentTest.className}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Thời gian làm bài</span>
                    <span className="text-base font-bold text-slate-800">{currentTest.durationMinutes} phút</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Thang điểm chuẩn</span>
                    <span className="text-base font-bold text-emerald-600">Thang 10</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="text-slate-400 text-[10px] block">Hệ số tính điểm</span>
                    <span className="text-base font-bold text-amber-600">Hệ số {currentTest.coefficient}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <span>Nhập điểm trực tiếp trên bảng và nhấn nút "Lưu bảng điểm".</span>
              </div>
            </div>

            {/* Test Statistics Card */}
            <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Thống kê & Phổ điểm bài kiểm tra ({testStats.count} học sinh đã có điểm)
                </h3>

                <div className="grid grid-cols-4 gap-3 text-center mb-4">
                  <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-100">
                    <span className="text-[11px] text-blue-600 block">Điểm trung bình</span>
                    <span className="text-2xl font-bold text-blue-900">
                      {testStats.avg.toString().replace('.', ',')}
                    </span>
                  </div>
                  <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-100">
                    <span className="text-[11px] text-emerald-600 block">Điểm cao nhất</span>
                    <span className="text-2xl font-bold text-emerald-800">
                      {testStats.max.toString().replace('.', ',')}
                    </span>
                  </div>
                  <div className="bg-rose-50/70 p-3 rounded-lg border border-rose-100">
                    <span className="text-[11px] text-rose-600 block">Điểm thấp nhất</span>
                    <span className="text-2xl font-bold text-rose-800">
                      {testStats.min.toString().replace('.', ',')}
                    </span>
                  </div>
                  <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-100">
                    <span className="text-[11px] text-amber-600 block">Cần phụ đạo (&lt;5)</span>
                    <span className="text-2xl font-bold text-rose-600">
                      {testStats.weak} HS
                    </span>
                  </div>
                </div>

                {/* Score Histogram Bars */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-slate-600 font-semibold">Giỏi (8.0 - 10):</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        style={{ width: `${(testStats.excellent / (testStats.count || 1)) * 100}%` }}
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="w-16 font-bold text-slate-700 text-right">
                      {testStats.excellent} HS
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-24 text-slate-600 font-semibold">Khá (6.5 - 7.9):</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        style={{ width: `${(testStats.good / (testStats.count || 1)) * 100}%` }}
                        className="bg-blue-500 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="w-16 font-bold text-slate-700 text-right">
                      {testStats.good} HS
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-24 text-slate-600 font-semibold">TB (5.0 - 6.4):</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        style={{ width: `${(testStats.average / (testStats.count || 1)) * 100}%` }}
                        className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="w-16 font-bold text-slate-700 text-right">
                      {testStats.average} HS
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-24 text-slate-600 font-semibold">Dưới TB (&lt; 5.0):</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3.5 overflow-hidden">
                      <div
                        style={{ width: `${(testStats.weak / (testStats.count || 1)) * 100}%` }}
                        className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      />
                    </div>
                    <span className="w-16 font-bold text-rose-600 text-right">
                      {testStats.weak} HS
                    </span>
                  </div>
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {saveSuccessMsg}
                </div>
              )}
            </div>
          </div>

          {/* Electronic Grade Sheet Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden printable-area">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between no-print">
              <h3 className="font-bold text-sm text-slate-800">
                Bảng ghi điểm chi tiết: Lớp {currentTest.className} ({classStudents.length} học sinh)
              </h3>
              <button
                onClick={handleSaveScores}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Lưu bảng điểm
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-serif">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50">
                    <th className="py-2.5 px-3 text-center w-12">STT</th>
                    <th className="py-2.5 px-3 w-28">Mã HS</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-3 text-center w-28">
                      Điểm nhập (0 - 10)
                    </th>
                    <th className="py-2.5 px-3 text-center w-28">Điểm hiện tại</th>
                    <th className="py-2.5 px-3 text-center w-32">Xếp loại bài KT</th>
                    <th className="py-2.5 px-3 text-center w-28">ĐTB Môn chung</th>
                    <th className="py-2.5 px-3">Nhận xét của giáo viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.map((s, idx) => {
                    const currentScore = s.testScores[currentTest.id];
                    const inputVal =
                      editingScores[s.id] !== undefined
                        ? editingScores[s.id]
                        : currentScore !== undefined
                        ? currentScore.toString().replace('.', ',')
                        : '';

                    const isInvalid =
                      inputVal !== '' &&
                      (isNaN(parseFloat(inputVal.replace(',', '.'))) ||
                        parseFloat(inputVal.replace(',', '.')) < 0 ||
                        parseFloat(inputVal.replace(',', '.')) > 10);

                    return (
                      <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 text-center text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3 font-mono font-semibold text-slate-700">{s.code}</td>
                        <td className="py-2 px-3 font-bold text-slate-800">{s.fullName}</td>

                        {/* Interactive Inline Score Input */}
                        <td className="py-2 px-3 text-center no-print">
                          <input
                            type="text"
                            value={inputVal}
                            onChange={(e) => handleScoreChange(s.id, e.target.value)}
                            placeholder="0 - 10"
                            className={`w-20 px-2 py-1 text-center font-bold text-sm rounded border ${
                              isInvalid
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : inputVal !== ''
                                ? 'border-blue-300 bg-blue-50/50 text-blue-900 focus:ring-2 focus:ring-blue-500'
                                : 'border-slate-200 bg-white focus:ring-2 focus:ring-blue-500'
                            }`}
                          />
                        </td>

                        {/* Display for print */}
                        <td className="py-2 px-3 text-center font-bold text-sm">
                          {currentScore !== undefined ? (
                            <span
                              className={
                                currentScore >= 8
                                  ? 'text-emerald-600'
                                  : currentScore >= 6.5
                                  ? 'text-blue-600'
                                  : currentScore >= 5
                                  ? 'text-amber-600'
                                  : 'text-rose-600'
                              }
                            >
                              {currentScore.toString().replace('.', ',')}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic">—</span>
                          )}
                        </td>

                        <td className="py-2 px-3 text-center">
                          {currentScore !== undefined ? (
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                currentScore >= 8
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : currentScore >= 6.5
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : currentScore >= 5
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}
                            >
                              {currentScore >= 8
                                ? 'Giỏi'
                                : currentScore >= 6.5
                                ? 'Khá'
                                : currentScore >= 5
                                ? 'Trung bình'
                                : 'Cần hỗ trợ'}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Chưa nhập</span>
                          )}
                        </td>

                        <td className="py-2 px-3 text-center font-bold text-slate-700">
                          {s.mathGpa.toString().replace('.', ',')}
                        </td>

                        <td className="py-2 px-3 text-slate-500 italic text-[11px]">
                          {s.notes ||
                            (currentScore !== undefined && currentScore < 5
                              ? 'Cần kèm thêm phần bài tập trắc nghiệm cơ bản'
                              : 'Hoàn thành tốt nhiệm vụ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Tạo bài kiểm tra mới */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Tạo bài kiểm tra mới</h3>
              <button
                onClick={() => setIsNewTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tên bài kiểm tra *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra 1 tiết: Nguyên hàm & Tích phân"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lớp học</label>
                  <select
                    value={newClassId}
                    onChange={(e) => setNewClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày kiểm tra</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hình thức</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="15 phút">15 phút</option>
                    <option value="45 phút (1 tiết)">45 phút</option>
                    <option value="Giữa kỳ">Giữa kỳ</option>
                    <option value="Cuối kỳ">Cuối kỳ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Thời gian</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hệ số điểm</label>
                  <select
                    value={newCoefficient}
                    onChange={(e) => setNewCoefficient(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="1">Hệ số 1</option>
                    <option value="2">Hệ số 2</option>
                    <option value="3">Hệ số 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chủ đề kiểm tra</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Ví dụ: Đạo hàm, Khảo sát hàm số..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewTestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Tạo bài kiểm tra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
