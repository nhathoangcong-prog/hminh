import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users, GraduationCap, ChevronRight, Download, Eye, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Classroom } from '../types';

export const ClassesView: React.FC = () => {
  const { classes, students, addClass, updateClass, deleteClass, setCurrentView, setSelectedClassId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '10' | '11' | '12'>('all');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const [rosterClass, setRosterClass] = useState<Classroom | null>(null);

  // Form states
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formGrade, setFormGrade] = useState<'10' | '11' | '12'>('10');
  const [formSchoolYear, setFormSchoolYear] = useState('2024 - 2025');
  const [formStudentCount, setFormStudentCount] = useState<number>(38);
  const [formHomeroom, setFormHomeroom] = useState('Thầy Hoàng Minh');
  const [formNotes, setFormNotes] = useState('');

  const filteredClasses = classes.filter((c) => {
    const matchesGrade = selectedGrade === 'all' || c.grade === selectedGrade;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.homeroomTeacher && c.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  const handleOpenCreate = () => {
    setFormCode(`10A${classes.length + 1}`);
    setFormName(`Lớp 10A${classes.length + 1}`);
    setFormGrade('10');
    setFormSchoolYear('2024 - 2025');
    setFormStudentCount(38);
    setFormHomeroom('Thầy Hoàng Minh');
    setFormNotes('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (c: Classroom) => {
    setEditingClass(c);
    setFormCode(c.code);
    setFormName(c.name);
    setFormGrade(c.grade);
    setFormSchoolYear(c.schoolYear);
    setFormStudentCount(c.studentCount);
    setFormHomeroom(c.homeroomTeacher || '');
    setFormNotes(c.notes || '');
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formName) return;
    addClass({
      code: formCode,
      name: formName,
      grade: formGrade,
      schoolYear: formSchoolYear,
      studentCount: Number(formStudentCount) || 0,
      homeroomTeacher: formHomeroom,
      notes: formNotes,
    });
    setIsCreateModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    updateClass(editingClass.id, {
      code: formCode,
      name: formName,
      grade: formGrade,
      schoolYear: formSchoolYear,
      studentCount: Number(formStudentCount) || 0,
      homeroomTeacher: formHomeroom,
      notes: formNotes,
    });
    setEditingClass(null);
  };

  const handleExportCSV = (cls: Classroom) => {
    const classStudents = students.filter((s) => s.classId === cls.id);
    let csvContent = 'STT,Mã Học Sinh,Họ Và Tên,Giới Tính,Lớp,Điểm TB Toán,Trạng Thái,Ghi Chú\n';
    classStudents.forEach((s, idx) => {
      csvContent += `${idx + 1},"${s.code}","${s.fullName}","${s.gender}","${cls.name}",${s.mathGpa},"${s.status}","${s.notes || ''}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_${cls.code}_Truong_Thanh_Loc.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Quản lý Lớp học Toán
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý các lớp phụ trách giảng dạy của Thầy Hoàng Minh tại Trường THẠNH LỘC
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-[#1877F2] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tạo lớp mới
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        {/* Grade tabs */}
        <div className="flex items-center space-x-1 w-full sm:w-auto">
          {(['all', '10', '11', '12'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {grade === 'all' ? 'Tất cả khối' : `Khối ${grade}`}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên lớp, GVCN..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredClasses.map((c) => {
          const classStudents = students.filter((s) => s.classId === c.id);
          const needingHelp = classStudents.filter((s) => s.status === 'Cần hỗ trợ').length;

          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      Khối {c.grade} • Năm học {c.schoolYear}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mt-2">{c.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      GVCN: <span className="font-semibold text-slate-700">{c.homeroomTeacher || 'Chưa phân công'}</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {c.code}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-400 text-[11px] block">Sĩ số</span>
                    <span className="text-base font-bold text-slate-800">{c.studentCount} HS</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-400 text-[11px] block">ĐTB Môn</span>
                    <span className="text-base font-bold text-emerald-600">
                      {c.averageScore.toString().replace('.', ',')}
                    </span>
                  </div>
                </div>

                {needingHelp > 0 && (
                  <div className="mt-3 text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 flex items-center justify-between">
                    <span>Học sinh cần phụ đạo:</span>
                    <span className="font-bold">{needingHelp} HS</span>
                  </div>
                )}

                {c.notes && (
                  <p className="text-xs text-slate-500 italic mt-3 line-clamp-2">
                    "{c.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setRosterClass(c)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Danh sách HS
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleExportCSV(c)}
                    title="Xuất danh sách ra CSV"
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    title="Chỉnh sửa lớp"
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingClassId(c.id)}
                    title="Xóa lớp"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Tạo lớp mới */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Thêm lớp học mới</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã lớp</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="Ví dụ: 10A3"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ví dụ: Lớp 10A3"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sĩ số học sinh</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formStudentCount}
                    onChange={(e) => setFormStudentCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  value={formHomeroom}
                  onChange={(e) => setFormHomeroom(e.target.value)}
                  placeholder="Họ và tên GVCN"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ghi chú phân công / đặc điểm</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ví dụ: Lớp chọn Tự nhiên, tăng cường Toán..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Tạo lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Chỉnh sửa lớp */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Chỉnh sửa thông tin lớp</h3>
              <button onClick={() => setEditingClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mã lớp</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tên hiển thị</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sĩ số học sinh</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formStudentCount}
                    onChange={(e) => setFormStudentCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Giáo viên chủ nhiệm</label>
                <input
                  type="text"
                  value={formHomeroom}
                  onChange={(e) => setFormHomeroom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ghi chú</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Xác nhận xóa lớp */}
      {deletingClassId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-800 text-center">Xác nhận xóa lớp học</h3>
            <p className="text-xs text-slate-600 text-center mt-2">
              Hành động này sẽ xóa vĩnh viễn lớp học cùng toàn bộ danh sách học sinh và điểm số liên quan. Thầy có chắc chắn muốn xóa?
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setDeletingClassId(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteClass(deletingClassId);
                  setDeletingClassId(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xem danh sách học sinh theo lớp */}
      {rosterClass && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Danh sách học sinh {rosterClass.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Sĩ số: {rosterClass.studentCount} HS | ĐTB: {rosterClass.averageScore}
                </p>
              </div>
              <button onClick={() => setRosterClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                    <th className="py-2 px-2 text-center">STT</th>
                    <th className="py-2 px-2">Mã HS</th>
                    <th className="py-2 px-2">Họ và tên</th>
                    <th className="py-2 px-2 text-center">Giới tính</th>
                    <th className="py-2 px-2 text-center">ĐTB</th>
                    <th className="py-2 px-2 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((s) => s.classId === rosterClass.id)
                    .map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2 text-center text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-2 font-mono text-slate-600">{s.code}</td>
                        <td className="py-2 px-2 font-semibold text-slate-800">{s.fullName}</td>
                        <td className="py-2 px-2 text-center text-slate-600">{s.gender}</td>
                        <td className="py-2 px-2 text-center font-bold text-blue-600">
                          {s.mathGpa.toString().replace('.', ',')}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status === 'Giỏi' || s.status === 'Xuất sắc'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : s.status === 'Khá'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : s.status === 'Trung bình'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <button
                onClick={() => handleExportCSV(rosterClass)}
                className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                <Download className="w-4 h-4" /> Xuất file CSV
              </button>
              <button
                onClick={() => {
                  setSelectedClassId(rosterClass.id);
                  setRosterClass(null);
                  setCurrentView('students');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow"
              >
                Mở trong Quản lý Học sinh →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
