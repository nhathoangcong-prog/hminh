import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TeachingDocument } from '../types';
import { RenderRichMathText } from '../components/MathFormula';

export const MaterialsView: React.FC = () => {
  const { documents, addDocument, deleteDocument, settings, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const [viewingDoc, setViewingDoc] = useState<TeachingDocument | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Add document form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TeachingDocument['category']>('Giáo án');
  const [newGrade, setNewGrade] = useState<'10' | '11' | '12'>('12');
  const [newTopic, setNewTopic] = useState('Đạo hàm và ứng dụng');
  const [newContent, setNewContent] = useState('');

  const filteredDocs = documents.filter((d) => {
    const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchGrade = selectedGrade === 'all' || d.grade === selectedGrade;
    const matchSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchGrade && matchSearch;
  });

  const handleOpenAdd = () => {
    setNewTitle('');
    setNewCategory('Giáo án');
    setNewGrade('12');
    setNewTopic('Đạo hàm và ứng dụng');
    setNewContent('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addDocument({
      title: newTitle.trim(),
      category: newCategory,
      grade: newGrade,
      topic: newTopic,
      schoolYear: settings.academicYear,
      fileType: 'DOCX',
      fileSize: '1.2 MB',
      content: newContent || 'Tài liệu lưu trữ nội bộ môn Toán Thầy Hoàng Minh.',
    });

    setIsAddModalOpen(false);
  };

  const handleCopyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadDoc = (doc: TeachingDocument) => {
    const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}.md`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Kho Giáo Án & Học Liệu Toán Học
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lưu trữ giáo án theo công văn 5512, kế hoạch bài dạy, phiếu học tập và tài liệu chuyên đề
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentView('ai_assistant')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-sky-300 text-sky-700 hover:bg-sky-50 text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            Soạn bằng AI
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Thêm tài liệu mới
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, chuyên đề..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>

        {/* Category filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="all">Tất cả loại học liệu</option>
            <option value="Giáo án">Giáo án (KHBD)</option>
            <option value="Phiếu học tập">Phiếu học tập</option>
            <option value="Đề kiểm tra">Đề kiểm tra & Ma trận</option>
            <option value="Đáp án">Đáp án & Hướng dẫn chấm</option>
            <option value="Tài liệu tham khảo">Tài liệu tham khảo chuyên sâu</option>
          </select>
        </div>

        {/* Grade filter */}
        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="all">Tất cả các khối</option>
            <option value="10">Khối 10</option>
            <option value="11">Khối 11</option>
            <option value="12">Khối 12</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                    doc.category === 'Giáo án'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : doc.category === 'Phiếu học tập'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {doc.category} • Lớp {doc.grade}
                </span>

                {doc.aiGenerated && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI
                  </span>
                )}
              </div>

              <h3 className="font-bold text-sm text-slate-800 mt-2.5 line-clamp-2 leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">Chủ đề: {doc.topic}</p>

              <div className="mt-3 p-2.5 rounded bg-slate-50 text-xs text-slate-600 line-clamp-3 italic">
                "{doc.content}"
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{doc.createdAt}</span>
                <span>
                  {doc.fileType} • {doc.fileSize}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setViewingDoc(doc)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" /> Xem nội dung
              </button>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleDownloadDoc(doc)}
                  title="Tải tệp"
                  className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  title="Xóa tài liệu"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Xem nội dung tài liệu */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {viewingDoc.category} • Khối {viewingDoc.grade}
                </span>
                <h3 className="font-bold text-lg text-slate-800 mt-1">{viewingDoc.title}</h3>
                <p className="text-xs text-slate-500">
                  Chủ đề: {viewingDoc.topic} • Năm học: {viewingDoc.schoolYear}
                </p>
              </div>
              <button onClick={() => setViewingDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
              <RenderRichMathText text={viewingDoc.content} />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyContent(viewingDoc.content)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? 'Đã sao chép' : 'Sao chép nội dung'}
                </button>
                <button
                  onClick={() => handleDownloadDoc(viewingDoc)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Tải về máy
                </button>
              </div>

              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Thêm tài liệu */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Thêm học liệu mới vào kho</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tiêu đề tài liệu *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Giáo án: Khảo sát hàm phân thức hữu tỉ"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phân loại</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Giáo án">Giáo án (KHBD)</option>
                    <option value="Phiếu học tập">Phiếu học tập</option>
                    <option value="Đề kiểm tra">Đề kiểm tra</option>
                    <option value="Đáp án">Đáp án</option>
                    <option value="Tài liệu tham khảo">Tài liệu tham khảo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="10">Khối 10</option>
                    <option value="11">Khối 11</option>
                    <option value="12">Khối 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chuyên đề Toán học</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Ví dụ: Nguyên hàm, Tích phân, Hình học không gian..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung chi tiết / hướng dẫn sử dụng
                </label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Nhập nội dung bài dạy hoặc dán tài liệu vào đây..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-serif"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Lưu vào kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
