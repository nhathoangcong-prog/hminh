import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Send,
  Copy,
  Check,
  Download,
  BookOpen,
  Printer,
  RefreshCw,
  Edit3,
  Layers,
  HelpCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RenderRichMathText } from '../components/MathFormula';

const AI_TOOLS = [
  'Soạn giáo án theo chủ đề',
  'Tạo mục tiêu bài học',
  'Thiết kế hoạt động khởi động',
  'Tạo bài tập theo mức độ',
  'Tạo câu hỏi trắc nghiệm',
  'Tạo câu hỏi tự luận',
  'Giải thích lời giải Toán từng bước',
  'Gợi ý phương pháp giảng dạy',
  'Tạo phiếu học tập',
  'Gợi ý bài tập phụ đạo',
  'Gợi ý bài tập nâng cao',
  'Hỗ trợ xây dựng ma trận & đặc tả',
];

export const AiAssistantView: React.FC = () => {
  const { addDocument, settings } = useApp();

  const [selectedTool, setSelectedTool] = useState(AI_TOOLS[0]);
  const [grade, setGrade] = useState('Lớp 12');
  const [topic, setTopic] = useState('Khảo sát và vẽ đồ thị hàm số');
  const [difficulty, setDifficulty] = useState('Thông hiểu');
  const [questionCount, setQuestionCount] = useState(4);
  const [extraDetails, setExtraDetails] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLiveAI, setIsLiveAI] = useState<boolean | null>(null);
  const [statusNote, setStatusNote] = useState('');

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setResultText('');
    setSavedSuccess(false);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: selectedTool,
          grade,
          topic,
          difficulty,
          questionCount,
          extraDetails,
          customPrompt,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResultText(data.content);
        setIsLiveAI(data.isLiveAI);
        if (data.note) setStatusNote(data.note);
      } else {
        setResultText(`Đã xảy ra lỗi: ${data.error || 'Không thể tạo nội dung'}`);
      }
    } catch (err: any) {
      setResultText(`Lỗi kết nối máy chủ: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resultText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveToLibrary = () => {
    if (!resultText) return;
    addDocument({
      title: `${selectedTool}: ${topic} (${grade})`,
      category: selectedTool.includes('giáo án')
        ? 'Giáo án'
        : selectedTool.includes('phiếu')
        ? 'Phiếu học tập'
        : selectedTool.includes('trắc nghiệm') || selectedTool.includes('bài tập')
        ? 'Đề kiểm tra'
        : 'Tài liệu tham khảo',
      grade: grade.includes('10') ? '10' : grade.includes('11') ? '11' : '12',
      topic,
      schoolYear: settings.academicYear,
      fileType: 'MD',
      fileSize: '45 KB',
      content: resultText,
      aiGenerated: true,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([resultText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTool.replace(/\s+/g, '_')}_${grade}_Thanh_Loc.md`;
    link.click();
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-sky-600" />
            Trợ Lý AI Toán Học THPT
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Chuyên gia sư phạm AI hỗ trợ Thầy Hoàng Minh soạn bài, tạo đề, xây dựng phiếu học tập và giải Toán theo chuẩn GDPT 2018
          </p>
        </div>

        {/* Live status badge */}
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`px-3 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
              isLiveAI
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isLiveAI ? 'Gemini 3.8 Flash (Trực tiếp)' : 'Trợ lý Sư phạm Toán THPT'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Tool Selector & Configuration Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tool Palette */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              1. Chọn công cụ trợ lý cần dùng (12 công cụ chuyên biệt):
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
              {AI_TOOLS.map((tool, idx) => {
                const isSelected = tool === selectedTool;
                return (
                  <button
                    key={tool}
                    onClick={() => setSelectedTool(tool)}
                    className={`p-2 rounded-lg text-left text-xs font-medium transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-[10px] opacity-70 block">Công cụ #{idx + 1}</span>
                    <span className="line-clamp-1">{tool}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Settings */}
          <form onSubmit={handleGenerate} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3.5 text-xs">
            <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
              2. Tham số và yêu cầu chuyên môn
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Lớp 10">Lớp 10 (GDPT 2018)</option>
                  <option value="Lớp 11">Lớp 11 (GDPT 2018)</option>
                  <option value="Lớp 12">Lớp 12 (GDPT 2018)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mức độ nhận thức</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Nhận biết">1. Nhận biết</option>
                  <option value="Thông hiểu">2. Thông hiểu</option>
                  <option value="Vận dụng">3. Vận dụng</option>
                  <option value="Vận dụng cao">4. Vận dụng cao</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Chủ đề bài học</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Đạo hàm, Tích phân, Tọa độ Oxyz..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Số lượng / Quy mô</label>
              <input
                type="number"
                min="1"
                max="20"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Yêu cầu sư phạm bổ sung (tùy chọn)
              </label>
              <textarea
                rows={2}
                value={extraDetails}
                onChange={(e) => setExtraDetails(e.target.value)}
                placeholder="Ví dụ: Trình bày bài toán gắn với thực tiễn, có hình vẽ hoặc bảng biến thiên..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white py-2.5 rounded-lg font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  AI đang xử lý và tổng hợp lời giải...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Tạo nội dung với AI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Output Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[550px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Kết quả tạo bởi Trợ lý AI
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedTool} • {topic} ({grade})
                </p>
              </div>

              {resultText && (
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Đã sao chép' : 'Sao chép'}
                  </button>

                  <button
                    onClick={handleSaveToLibrary}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    {savedSuccess ? 'Đã lưu vào kho!' : 'Lưu vào Học liệu'}
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    title="Tải tệp Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Generated Content Box */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200 max-h-[520px] overflow-y-auto leading-relaxed text-sm text-slate-800 whitespace-pre-wrap font-serif">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  <p className="font-bold text-slate-700">Trợ lý AI đang tư duy và cấu trúc hóa bài học...</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Đang thiết lập định dạng chuẩn Bộ GD&ĐT, kiểm tra tính đúng đắn toán học và xây dựng hướng dẫn chấm.
                  </p>
                </div>
              ) : resultText ? (
                <div className="prose prose-slate max-w-none">
                  <RenderRichMathText text={resultText} />
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                  <Brain className="w-12 h-12 text-slate-300" />
                  <p className="font-semibold">Chưa có nội dung nào được tạo.</p>
                  <p className="text-xs">
                    Thầy vui lòng chọn công cụ bên trái và bấm nút "Tạo nội dung với AI".
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Khuyến nghị: Thầy Hoàng Minh nên rà soát lại trước khi in phát cho học sinh.
            </span>
            <span>Chương trình Toán THPT Thạnh Lộc</span>
          </div>
        </div>
      </div>
    </div>
  );
};
