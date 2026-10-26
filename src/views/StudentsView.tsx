import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  X,
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student, AcademicStatus } from '../types';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    tests,
    addStudent,
    updateStudent,
    deleteStudent,
    selectedClassId,
    setSelectedClassId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>(selectedClassId || 'all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'gpaDesc' | 'gpaAsc'>('name');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [formError, setFormError] = useState('');

  // Form fields
  const [formCode, setFormCode] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formGender, setFormGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [formBirthDate, setFormBirthDate] = useState('15/05/2009');
  const [formClassId, setFormClassId] = useState(classes[0]?.id || '');
  const [formNotes, setFormNotes] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');

  // Filter & Sort
  const filteredStudents = students
    .filter((s) => {
      const matchClass = filterClass === 'all' || s.classId === filterClass;
      const matchStatus = filterStatus === 'all' || s.status === filterStatus;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        s.fullName.toLowerCase().includes(query) ||
        s.code.toLowerCase().includes(query) ||
        s.className.toLowerCase().includes(query);
      return matchClass && matchStatus && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'gpaDesc') return b.mathGpa - a.mathGpa;
      if (sortBy === 'gpaAsc') return a.mathGpa - b.mathGpa;
      if (sortBy === 'code') return a.code.localeCompare(b.code);
      // Sort by Vietnamese name (last word first)
      const aLastName = a.fullName.split(' ').slice(-1)[0] || '';
      const bLastName = b.fullName.split(' ').slice(-1)[0] || '';
      return aLastName.localeCompare(bLastName, 'vi');
    });

  const handleOpenAdd = () => {
    setFormError('');
    const targetClass = classes.find((c) => c.id === filterClass) || classes[0];
    const generatedCode = `${targetClass?.code || '10A1'}-${(students.length + 1).toString().padStart(2, '0')}`;
    setFormCode(generatedCode);
    setFormFullName('');
    setFormGender('Nam');
    setFormBirthDate('15/05/2009');
    setFormClassId(targetClass?.id || '');
    setFormNotes('');
    setFormPhone('');
    setFormParentPhone('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formFullName.trim()) {
      setFormError('Vui lòng điền đầy đủ Mã học sinh và Họ tên');
      return;
    }
    // Check duplicate code
    if (students.some((s) => s.code.toLowerCase() === formCode.trim().toLowerCase())) {
      setFormError(`Mã học sinh "${formCode}" đã tồn tại trên hệ thống. Vui lòng chọn mã khác.`);
      return;
    }

    const selectedCls = classes.find((c) => c.id === formClassId) || classes[0];
    addStudent({
      code: formCode.trim().toUpperCase(),
      fullName: formFullName.trim(),
      gender: formGender,
      birthDate: formBirthDate.trim(),
      classId: selectedCls.id,
      className: selectedCls.code,
      notes: formNotes.trim(),
      phone: formPhone.trim(),
      parentPhone: formParentPhone.trim(),
    });

    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (student: Student) => {
    setFormError('');
    setEditingStudent(student);
    setFormCode(student.code);
    setFormFullName(student.fullName);
    setFormGender(student.gender);
    setFormBirthDate(student.birthDate);
    setFormClassId(student.classId);
    setFormNotes(student.notes || '');
    setFormPhone(student.phone || '');
    setFormParentPhone(student.parentPhone || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!formFullName.trim()) {
      setFormError('Họ tên học sinh không được để trống');
      return;
    }
    // Check duplicate code if changed
    if (
      formCode.trim().toLowerCase() !== editingStudent.code.toLowerCase() &&
      students.some((s) => s.code.toLowerCase() === formCode.trim().toLowerCase())
    ) {
      setFormError(`Mã học sinh "${formCode}" đã tồn tại.`);
      return;
    }

    const selectedCls = classes.find((c) => c.id === formClassId) || classes[0];
    updateStudent(editingStudent.id, {
      code: formCode.trim().toUpperCase(),
      fullName: formFullName.trim(),
      gender: formGender,
      birthDate: formBirthDate.trim(),
      classId: selectedCls.id,
      className: selectedCls.code,
      notes: formNotes.trim(),
      phone: formPhone.trim(),
      parentPhone: formParentPhone.trim(),
    });

    setEditingStudent(null);
  };

  const handleExportCSV = () => {
    let csvContent = 'STT,Mã Học Sinh,Họ Và Tên,Giới Tính,Ngày Sinh,Lớp,ĐTB Môn Toán,Trạng Thái,Ghi Chú,SĐT Phụ Huynh\n';
    filteredStudents.forEach((s, idx) => {
      csvContent += `${idx + 1},"${s.code}","${s.fullName}","${s.gender}","${s.birthDate}","${s.className}",${s.mathGpa},"${s.status}","${s.notes || ''}","${s.parentPhone || ''}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_Sach_Hoc_Sinh_Toan_Thanh_Loc.csv`;
    link.click();
  };

  const handleImportCSVPreview = () => {
    if (!importText.trim()) return;
    const lines = importText.trim().split('\n');
    let importedCount = 0;

    lines.forEach((line) => {
      const parts = line.split(',').map((p) => p.replace(/"/g, '').trim());
      if (parts.length >= 2 && !parts[0].toLowerCase().includes('mã')) {
        const code = parts[0];
        const name = parts[1];
        const gender = (parts[2] as any) === 'Nữ' ? 'Nữ' : 'Nam';
        const className = parts[3] || '10A1';
        const targetClass = classes.find((c) => c.code === className) || classes[0];

        if (!students.some((s) => s.code.toLowerCase() === code.toLowerCase())) {
          addStudent({
            code,
            fullName: name,
            gender,
            birthDate: '01/01/2009',
            classId: targetClass.id,
            className: targetClass.code,
            notes: 'Nhập từ tệp danh sách',
          });
          importedCount++;
        }
      }
    });

    setIsImportModalOpen(false);
    setImportText('');
    alert(`Đã nhập thành công ${importedCount} học sinh vào hệ thống!`);
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-sky-600" />
            Hồ sơ & Danh sách Học sinh
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: <span className="font-bold text-blue-700">{students.length} học sinh</span> trong các lớp phụ trách
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            Nhập CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Xuất Excel/CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo Mã HS, Họ tên..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
          />
        </div>

        {/* Filter by Class */}
        <div>
          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setSelectedClassId(e.target.value === 'all' ? null : e.target.value);
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
          >
            <option value="all">Tất cả các lớp ({classes.length} lớp)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code}) - {c.studentCount} HS
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Academic Status */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
          >
            <option value="all">Tất cả mức học lực</option>
            <option value="Giỏi">Giỏi (ĐTB ≥ 8.0)</option>
            <option value="Khá">Khá (6.5 ≤ ĐTB &lt; 8.0)</option>
            <option value="Trung bình">Trung bình (5.0 ≤ ĐTB &lt; 6.5)</option>
            <option value="Cần hỗ trợ">Cần hỗ trợ (ĐTB &lt; 5.0)</option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white font-medium"
          >
            <option value="name">Sắp xếp: Tên học sinh (A-Z)</option>
            <option value="code">Sắp xếp: Mã học sinh</option>
            <option value="gpaDesc">Sắp xếp: Điểm ĐTB cao nhất</option>
            <option value="gpaAsc">Sắp xếp: Điểm ĐTB thấp nhất</option>
          </select>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-serif">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/75">
                <th className="py-3 px-3 text-center w-12">STT</th>
                <th className="py-3 px-3 w-28">Mã HS</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3 text-center w-20">Giới tính</th>
                <th className="py-3 px-3 text-center w-28">Ngày sinh</th>
                <th className="py-3 px-3 text-center w-20">Lớp</th>
                <th className="py-3 px-3 text-center w-24">ĐTB Toán</th>
                <th className="py-3 px-3 text-center w-28">Trạng thái</th>
                <th className="py-3 px-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-2.5 px-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700 font-semibold">{s.code}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{s.fullName}</span>
                        {s.notes && (
                          <span
                            title={s.notes}
                            className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{s.gender}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500">{s.birthDate}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-blue-700">{s.className}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-sm">
                      <span
                        className={
                          s.mathGpa >= 8.0
                            ? 'text-emerald-600'
                            : s.mathGpa >= 6.5
                            ? 'text-blue-600'
                            : s.mathGpa >= 5.0
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {s.mathGpa.toString().replace('.', ',')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          s.status === 'Giỏi' || s.status === 'Xuất sắc'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : s.status === 'Khá'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : s.status === 'Trung bình'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setDetailStudent(s)}
                          title="Xem chi tiết hồ sơ"
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          title="Sửa thông tin"
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStudentId(s.id)}
                          title="Xóa học sinh"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Thêm học sinh */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Thêm học sinh mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded text-rose-600 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveAdd} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mã học sinh *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lớp học *</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ và tên học sinh *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SĐT học sinh</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">SĐT phụ huynh</label>
                  <input
                    type="text"
                    value={formParentPhone}
                    onChange={(e) => setFormParentPhone(e.target.value)}
                    placeholder="09..."
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ghi chú đặc điểm học tập</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi chú về năng lực, tinh thần học tập..."
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Thêm vào lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Sửa thông tin học sinh */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Cập nhật hồ sơ học sinh</h3>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded text-rose-600 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mã học sinh *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lớp học</label>
                  <select
                    value={formClassId}
                    onChange={(e) => setFormClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Họ và tên học sinh *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Giới tính</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ghi chú theo dõi</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Xem chi tiết hồ sơ & lịch sử điểm */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {detailStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{detailStudent.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    Mã HS: <span className="font-mono font-semibold text-slate-700">{detailStudent.code}</span> • Lớp: <span className="font-bold text-blue-700">{detailStudent.className}</span>
                  </p>
                </div>
              </div>
              <button onClick={() => setDetailStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* General Overview */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">ĐTB Môn Toán</span>
                <span className="text-2xl font-bold text-blue-700">
                  {detailStudent.mathGpa.toString().replace('.', ',')}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Mức Học Lực</span>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-bold ${
                    detailStudent.status === 'Giỏi' || detailStudent.status === 'Xuất sắc'
                      ? 'bg-emerald-50 text-emerald-700'
                      : detailStudent.status === 'Khá'
                      ? 'bg-blue-50 text-blue-700'
                      : detailStudent.status === 'Trung bình'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {detailStudent.status}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Giới tính & Ngày sinh</span>
                <span className="text-xs font-semibold text-slate-700 block mt-1">
                  {detailStudent.gender} • {detailStudent.birthDate}
                </span>
              </div>
            </div>

            {/* Test History Table */}
            <div className="mt-4">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Lịch sử các bài kiểm tra Toán
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <th className="py-2 px-3">Bài kiểm tra</th>
                      <th className="py-2 px-3 text-center">Hệ số</th>
                      <th className="py-2 px-3 text-center">Điểm số</th>
                      <th className="py-2 px-3 text-center">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tests.map((t) => {
                      const score = detailStudent.testScores[t.id];
                      return (
                        <tr key={t.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-800">{t.title}</td>
                          <td className="py-2 px-3 text-center text-slate-500">HS {t.coefficient}</td>
                          <td className="py-2 px-3 text-center font-bold">
                            {score !== undefined ? (
                              <span className={score >= 5.0 ? 'text-blue-600' : 'text-rose-600'}>
                                {score.toString().replace('.', ',')}
                              </span>
                            ) : (
                              <span className="text-slate-300 italic">Chưa có điểm</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-500">
                            {score !== undefined
                              ? score >= 8
                                ? 'Đạt loại Giỏi'
                                : score >= 6.5
                                ? 'Đạt loại Khá'
                                : score >= 5
                                ? 'Đạt Trung bình'
                                : 'Cần bồi dưỡng'
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Teacher Notes & Remediation Plan */}
            <div className="mt-4 p-3.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-slate-700">
              <span className="font-bold text-blue-900 block mb-1">
                Ghi chú sư phạm của Thầy Hoàng Minh:
              </span>
              <p className="italic">
                {detailStudent.notes ||
                  'Học sinh tham gia học tập nghiêm túc, cần tiếp tục phát huy năng lực tư duy.'}
              </p>
              {detailStudent.topicWeaknesses && detailStudent.topicWeaknesses.length > 0 && (
                <div className="mt-2 pt-2 border-t border-blue-200/60">
                  <span className="font-semibold text-rose-700">Chủ đề cần tập trung ôn luyện: </span>
                  <span className="font-bold text-slate-800">
                    {detailStudent.topicWeaknesses.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xóa học sinh */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-800 text-center">Xóa hồ sơ học sinh?</h3>
            <p className="text-xs text-slate-600 text-center mt-2">
              Hành động này sẽ xóa học sinh khỏi danh sách lớp và xóa toàn bộ lịch sử điểm liên quan.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => setDeletingStudentId(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteStudent(deletingStudentId);
                  setDeletingStudentId(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nhập danh sách CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Nhập danh sách học sinh từ CSV</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Dán nội dung CSV (mỗi dòng gồm: Mã HS, Họ và tên, Giới tính, Lớp):
            </p>

            <textarea
              rows={6}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="10A1-39, Lê Hoàng Long, Nam, 10A1&#10;10A1-40, Phạm Thúy Nga, Nữ, 10A1"
              className="w-full mt-2 p-3 font-mono text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4 flex justify-between items-center text-xs">
              <button
                onClick={() =>
                  setImportText(
                    `10A1-41, Nguyễn Quốc Huy, Nam, 10A1\n10A2-41, Đoàn Minh Châu, Nữ, 10A2\n11A1-40, Vũ Tuấn Hải, Nam, 11A1`
                  )
                }
                className="text-blue-600 hover:underline"
              >
                Dán dữ liệu mẫu
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-200 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImportCSVPreview}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Xác nhận nạp dữ liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
