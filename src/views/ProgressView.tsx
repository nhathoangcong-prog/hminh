import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  BookOpen,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressView: React.FC = () => {
  const { students, topics, classes, stats, setCurrentView } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  const filteredStudents =
    selectedClassId === 'all'
      ? students
      : students.filter((s) => s.classId === selectedClassId);

  const selectedStudent =
    students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            Theo Dõi Tiến Độ Học Tập Môn Toán
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Phân tích sự tiến bộ theo chuyên đề, phát hiện lỗ hổng kiến thức và đề xuất kế hoạch phụ đạo
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="all">Toàn bộ các lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. TOPIC PERFORMANCE OVERVIEW (Chuyên đề Toán học) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Kết quả học tập theo từng chuyên đề Toán học
          </h3>
          <span className="text-xs text-slate-500">
            Chương trình GDPT 2018 - THPT Thạnh Lộc
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => {
            const isLow = t.averageScore < 7.0;
            return (
              <div
                key={t.id}
                className={`p-4 rounded-xl border transition-all ${
                  isLow ? 'bg-amber-50/30 border-amber-200' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                    Khối {t.grade}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    ĐTB: <strong className={isLow ? 'text-amber-700' : 'text-emerald-700'}>{t.averageScore}</strong>
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-800 mt-2">{t.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Mức độ đạt chuẩn:</span>
                    <span className="font-bold">{Math.round((t.averageScore / 10) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      style={{ width: `${(t.averageScore / 10) * 100}%` }}
                      className={`h-full rounded-full ${isLow ? 'bg-amber-500' : 'bg-blue-600'}`}
                    />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Học sinh cần kèm:</span>
                  <span className="font-bold text-rose-600">{t.strugglingCount} học sinh</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. INDIVIDUAL STUDENT TRACKER & TRAJECTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Student Selector List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-sky-600" />
              Chọn học sinh theo dõi chi tiết
            </h3>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredStudents.map((s) => {
                const isSelected = s.id === selectedStudent?.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{s.fullName}</div>
                      <div className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {s.code} • {s.className}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-blue-700'}`}>
                        {s.mathGpa.toString().replace('.', ',')}
                      </span>
                      <div
                        className={`text-[10px] font-semibold ${
                          isSelected
                            ? 'text-yellow-200'
                            : s.status === 'Cần hỗ trợ'
                            ? 'text-rose-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {s.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400 italic">
              Có thể chọn học sinh bất kỳ để xem biểu đồ và phương án phụ đạo
            </span>
          </div>
        </div>

        {/* Right: Individual Student Trajectory & Remediation Plan */}
        {selectedStudent && (
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Hồ sơ tiến độ: {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã HS: <span className="font-mono font-bold text-slate-700">{selectedStudent.code}</span> • Lớp: <span className="font-bold text-blue-700">{selectedStudent.className}</span> • Điểm hiện tại: <span className="font-bold text-blue-900">{selectedStudent.mathGpa}</span>
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold self-start ${
                    selectedStudent.status === 'Giỏi' || selectedStudent.status === 'Xuất sắc'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : selectedStudent.status === 'Khá'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : selectedStudent.status === 'Trung bình'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {selectedStudent.status}
                </span>
              </div>

              {/* Progress Trajectory Chart */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quá trình biến thiên điểm số qua các kỳ kiểm tra
                </h4>
                <div className="h-36 bg-slate-50 rounded-xl p-3 border border-slate-100 relative flex items-end justify-between px-8">
                  {/* Milestones */}
                  {[
                    { label: 'Tháng 1', score: Math.max(3.0, selectedStudent.mathGpa - 0.9) },
                    { label: 'Tháng 2', score: Math.max(3.2, selectedStudent.mathGpa - 0.5) },
                    { label: 'Tháng 3', score: Math.max(3.5, selectedStudent.mathGpa - 0.2) },
                    { label: 'Tháng 4 (Hiện tại)', score: selectedStudent.mathGpa },
                  ].map((m, idx) => {
                    const heightPct = (m.score / 10) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center z-10">
                        <span className="text-xs font-bold text-blue-700 mb-1">
                          {m.score.toFixed(1).replace('.', ',')}
                        </span>
                        <div className="w-10 bg-blue-100 rounded-t h-20 flex items-end">
                          <div
                            style={{ height: `${heightPct}%` }}
                            className="w-full bg-blue-600 rounded-t transition-all duration-300"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 mt-1">
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Pedagogical Remediation Plan */}
              <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Kế hoạch phụ đạo & Ôn tập trọng tâm (Thầy Hoàng Minh đề xuất)
                </div>

                {selectedStudent.status === 'Cần hỗ trợ' ? (
                  <ul className="list-disc list-inside space-y-1 text-slate-700 mt-2">
                    <li>
                      <strong>Giai đoạn 1 (2 tuần):</strong> Củng cố quy tắc tính toán cơ bản, công thức nghiệm tam thức bậc hai và dấu nhị thức bậc nhất.
                    </li>
                    <li>
                      <strong>Giai đoạn 2 (3 tuần):</strong> Luyện tập 20 bài trắc nghiệm mức độ Nhận biết mỗi tuần trên hệ thống web.
                    </li>
                    <li>
                      <strong>Biện pháp hỗ trợ:</strong> Bố trí học sinh giỏi ({students.find((s) => s.status === 'Giỏi')?.fullName || 'học sinh khá giỏi'}) kèm nhóm sau giờ học.
                    </li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-slate-700 mt-2">
                    <li>
                      <strong>Duy trì phong độ:</strong> Tiếp tục giải quyết các bài toán Vận dụng cao, hình học không gian và tích phân hàm ẩn.
                    </li>
                    <li>
                      <strong>Định hướng:</strong> Tham gia câu lạc bộ Toán học và bồi dưỡng thi học sinh giỏi cấp trường.
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Ghi chú: {selectedStudent.notes || 'Học sinh có ý thức học tập tốt'}
              </span>
              <button
                onClick={() => setCurrentView('ai_assistant')}
                className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                Nhờ Trợ lý AI tạo phiếu bài tập riêng →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
