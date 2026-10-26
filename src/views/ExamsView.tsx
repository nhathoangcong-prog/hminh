import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Play,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
  BookOpen,
  Eye,
  Trash2,
  Edit2,
  Copy,
  ChevronRight,
  Printer,
  X,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Question, DifficultyLevel, QuestionType } from '../types';
import { RenderRichMathText } from '../components/MathFormula';

export const ExamsView: React.FC = () => {
  const {
    tests,
    questions,
    classes,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    submitExamPractice,
    submissions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tests' | 'bank' | 'practice' | 'submissions'>('tests');

  // Question bank filters
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Question Modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<QuestionType>('multiple_choice');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState('A');
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState<DifficultyLevel>('Thông hiểu');
  const [qTopic, setQTopic] = useState('Hàm số và đồ thị');
  const [qGrade, setQGrade] = useState<'10' | '11' | '12'>('12');

  // Practice mode state
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceStudentName, setPracticeStudentName] = useState('Nguyễn Văn An');
  const [practiceClass, setPracticeClass] = useState('10A1');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins countdown
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [practiceResult, setPracticeResult] = useState<{ score: number; total: number } | null>(null);

  // Timer effect for practice
  useEffect(() => {
    let timer: any;
    if (isPracticing && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishPractice();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPracticing, isSubmitted, timeLeft]);

  const handleStartPractice = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setPracticeResult(null);
    setTimeLeft(15 * 60);
    setIsPracticing(true);
  };

  const handleSelectAnswer = (qId: string, val: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleFinishPractice = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / (questions.length || 1)) * 10 * 10) / 10;
    setPracticeResult({ score, total: questions.length });
    setIsSubmitted(true);

    submitExamPractice({
      examId: 'practice-01',
      studentId: `hs-${Date.now()}`,
      studentName: practiceStudentName,
      className: practiceClass,
      score,
      answers: userAnswers,
      timeSpentSeconds: 15 * 60 - timeLeft,
    });
  };

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQText('');
    setQType('multiple_choice');
    setQOptions(['$y = 2x + 1$', '$y = x^2 - 4x + 3$', '$y = \\frac{x-1}{x+2}$', '$y = \\sqrt{x}$']);
    setQCorrect('A');
    setQExplanation('');
    setQDifficulty('Thông hiểu');
    setQTopic('Hàm số và đồ thị');
    setQGrade('12');
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setQText(q.text);
    setQType(q.type);
    setQOptions(q.options || ['', '', '', '']);
    setQCorrect(q.correctAnswer);
    setQExplanation(q.explanation);
    setQDifficulty(q.difficulty);
    setQTopic(q.topic);
    setQGrade(q.grade);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim()) return;

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, {
        text: qText,
        type: qType,
        options: qType === 'multiple_choice' ? qOptions : undefined,
        correctAnswer: qCorrect,
        explanation: qExplanation,
        difficulty: qDifficulty,
        topic: qTopic,
        grade: qGrade,
      });
    } else {
      addQuestion({
        text: qText,
        type: qType,
        options: qType === 'multiple_choice' ? qOptions : undefined,
        correctAnswer: qCorrect,
        explanation: qExplanation,
        difficulty: qDifficulty,
        topic: qTopic,
        grade: qGrade,
      });
    }

    setIsQuestionModalOpen(false);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchTopic = selectedTopic === 'all' || q.topic === selectedTopic;
    const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    const matchGrade = selectedGrade === 'all' || q.grade === selectedGrade;
    return matchTopic && matchDiff && matchGrade;
  });

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            Kiểm Tra & Luyện Tập Toán Trực Tuyến
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Xây dựng ngân hàng đề kiểm tra, công thức KaTeX và tổ chức thi trực tuyến có chấm điểm tự động
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => {
              setActiveTab('tests');
              setIsPracticing(false);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'tests' && !isPracticing ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đề kiểm tra
          </button>
          <button
            onClick={() => {
              setActiveTab('bank');
              setIsPracticing(false);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'bank' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ngân hàng câu hỏi ({questions.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('practice');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'practice' || isPracticing
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            ▶ Làm bài thi thử
          </button>
          <button
            onClick={() => {
              setActiveTab('submissions');
              setIsPracticing(false);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'submissions' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bài đã nộp ({submissions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: DANH SÁCH ĐỀ KIỂM TRA */}
      {activeTab === 'tests' && !isPracticing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Lớp {test.className} • {test.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{test.testDate}</span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2.5">{test.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">Chủ đề: {test.topic}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Thời lượng</span>
                    <span className="font-bold text-slate-700">{test.durationMinutes} phút</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-400 text-[10px] block">Hệ số</span>
                    <span className="font-bold text-blue-600">Hệ số {test.coefficient}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Trạng thái: <strong className="text-slate-700">{test.status}</strong>
                </span>
                <button
                  onClick={() => {
                    setActiveTab('practice');
                    handleStartPractice();
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" /> Thử làm đề
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: NGÂN HÀNG CÂU HỎI */}
      {activeTab === 'bank' && !isPracticing && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 text-xs rounded border border-slate-200 bg-white"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="Nhận biết">Nhận biết</option>
                <option value="Thông hiểu">Thông hiểu</option>
                <option value="Vận dụng">Vận dụng</option>
                <option value="Vận dụng cao">Vận dụng cao</option>
              </select>

              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-1.5 text-xs rounded border border-slate-200 bg-white"
              >
                <option value="all">Tất cả khối</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Thêm câu hỏi mới
            </button>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Câu {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        q.difficulty === 'Nhận biết'
                          ? 'bg-emerald-50 text-emerald-700'
                          : q.difficulty === 'Thông hiểu'
                          ? 'bg-blue-50 text-blue-700'
                          : q.difficulty === 'Vận dụng'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Khối {q.grade} • {q.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditQuestion(q)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 text-sm text-slate-800 font-medium">
                  <RenderRichMathText text={q.text} />
                </div>

                {/* Multiple choice options */}
                {q.type === 'multiple_choice' && q.options && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isCorrect = q.correctAnswer === letter;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded border flex items-center space-x-2 ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold w-5">{letter}.</span>
                          <span className="flex-1">
                            <RenderRichMathText text={opt} />
                          </span>
                          {isCorrect && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* True/False or Short answer display */}
                {q.type === 'true_false' && (
                  <div className="mt-2 text-xs">
                    <span className="font-semibold text-slate-600">Đáp án chuẩn: </span>
                    <span className="font-bold text-emerald-700">{q.correctAnswer}</span>
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div className="mt-3 p-2.5 bg-blue-50/40 rounded border border-blue-100 text-xs text-slate-600">
                    <strong className="text-blue-900">Lời giải chi tiết: </strong>
                    <RenderRichMathText text={q.explanation} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GIAO DIỆN HỌC SINH LÀM BÀI TRỰC TUYẾN (PRACTICE MODE) */}
      {(activeTab === 'practice' || isPracticing) && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Top Bar for practice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                PHÒNG THI TRỰC TUYẾN TOÁN THPT
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-1">
                Đề luyện tập trắc nghiệm số 01: Hàm số & Giải tích
              </h3>
              <p className="text-xs text-slate-500">
                Thí sinh: <span className="font-bold text-slate-800">{practiceStudentName}</span> ({practiceClass})
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Countdown Timer */}
              <div
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border font-mono font-bold text-sm ${
                  timeLeft <= 60
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <Clock className="w-4 h-4 text-purple-600" />
                <span>
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, '0')}
                  :{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleFinishPractice}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Nộp bài thi
                </button>
              ) : (
                <button
                  onClick={handleStartPractice}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Làm lại bài thi
                </button>
              )}
            </div>
          </div>

          {/* Result Banner if submitted */}
          {isSubmitted && practiceResult && (
            <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                  Kết quả chấm tự động
                </span>
                <h4 className="text-2xl font-bold mt-0.5">
                  Điểm số: {practiceResult.score.toString().replace('.', ',')} / 10 điểm
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  Đã lưu kết quả thi vào hệ thống theo dõi của Thầy Hoàng Minh. Thầy có thể xem lời giải chi tiết bên dưới.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                {practiceResult.score >= 5 ? 'ĐẠT' : 'CHƯA ĐẠT'}
              </div>
            </div>
          )}

          {/* Test Questions List */}
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const currentChoice = userAnswers[q.id];
              const isCorrect = isSubmitted && currentChoice === q.correctAnswer;
              const isWrong = isSubmitted && currentChoice !== undefined && currentChoice !== q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : isWrong
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-slate-200 bg-slate-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700">Câu {idx + 1}:</span>
                    <span className="text-[11px] text-slate-400">{q.difficulty}</span>
                  </div>

                  <div className="text-sm font-semibold text-slate-800">
                    <RenderRichMathText text={q.text} />
                  </div>

                  {/* Options */}
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const letter = String.fromCharCode(65 + oIdx);
                        const isSelected = currentChoice === letter;
                        const isRightAnswer = isSubmitted && q.correctAnswer === letter;

                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelectAnswer(q.id, letter)}
                            className={`p-2.5 rounded-lg border flex items-center space-x-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                                : isRightAnswer
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold w-5">{letter}.</span>
                            <span className="flex-1">
                              <RenderRichMathText text={opt} />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* True/False buttons */}
                  {q.type === 'true_false' && (
                    <div className="mt-3 flex gap-3 text-xs">
                      {['Đúng', 'Sai'].map((val) => {
                        const isSelected = currentChoice === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, val)}
                            className={`px-5 py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation after submit */}
                  {isSubmitted && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <span>Đáp án đúng: </span>
                        <span className="text-emerald-700">{q.correctAnswer}</span>
                      </div>
                      <p className="text-slate-600">
                        <strong>Hướng dẫn giải: </strong>
                        <RenderRichMathText text={q.explanation} />
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: BÀI NỘP CỦA HỌC SINH */}
      {activeTab === 'submissions' && !isPracticing && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-sm text-slate-800">
              Danh sách kết quả làm bài trực tuyến ({submissions.length} lượt nộp)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                  <th className="py-2.5 px-3">Học sinh</th>
                  <th className="py-2.5 px-3 text-center">Lớp</th>
                  <th className="py-2.5 px-3 text-center">Điểm số</th>
                  <th className="py-2.5 px-3 text-center">Thời gian làm</th>
                  <th className="py-2.5 px-3 text-center">Thời điểm nộp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Chưa có lượt nộp bài trực tuyến nào. Thầy có thể nhấn "Làm bài thi thử" để trải nghiệm.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{sub.studentName}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-blue-700">{sub.className}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-sm">
                        <span className={sub.score >= 5 ? 'text-emerald-600' : 'text-rose-600'}>
                          {sub.score.toString().replace('.', ',')} / 10
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-600">
                        {Math.floor(sub.timeSpentSeconds / 60)} phút {sub.timeSpentSeconds % 60} giây
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500">{sub.submittedAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Thêm/Sửa câu hỏi trong ngân hàng */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">
                {editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi vào ngân hàng'}
              </h3>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Khối lớp</label>
                  <select
                    value={qGrade}
                    onChange={(e) => setQGrade(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  >
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mức độ</label>
                  <select
                    value={qDifficulty}
                    onChange={(e) => setQDifficulty(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  >
                    <option value="Nhận biết">Nhận biết</option>
                    <option value="Thông hiểu">Thông hiểu</option>
                    <option value="Vận dụng">Vận dụng</option>
                    <option value="Vận dụng cao">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dạng câu</label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 bg-white"
                  >
                    <option value="multiple_choice">Trắc nghiệm 4 chọn</option>
                    <option value="true_false">Đúng / Sai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chủ đề</label>
                <input
                  type="text"
                  value={qTopic}
                  onChange={(e) => setQTopic(e.target.value)}
                  placeholder="Ví dụ: Hàm số, Đạo hàm, Tích phân..."
                  className="w-full px-3 py-1.5 rounded border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung câu hỏi (hỗ trợ công thức LaTeX giữa dấu $)
                </label>
                <textarea
                  rows={3}
                  required
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Ví dụ: Cho hàm số $y = x^3 - 3x$. Tính $y'(1)$..."
                  className="w-full px-3 py-2 rounded border border-slate-200 font-mono"
                />
              </div>

              {qType === 'multiple_choice' && (
                <div className="space-y-2">
                  <label className="block text-slate-700 font-semibold">Các phương án A, B, C, D</label>
                  {qOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="font-bold w-4">{String.fromCharCode(65 + idx)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...qOptions];
                          newOpts[idx] = e.target.value;
                          setQOptions(newOpts);
                        }}
                        className="flex-1 px-3 py-1.5 rounded border border-slate-200 font-mono"
                      />
                    </div>
                  ))}

                  <div className="pt-2">
                    <label className="block text-slate-700 font-semibold mb-1">Đáp án đúng</label>
                    <select
                      value={qCorrect}
                      onChange={(e) => setQCorrect(e.target.value)}
                      className="px-3 py-1.5 rounded border border-slate-200 bg-white font-bold text-blue-700"
                    >
                      <option value="A">Phương án A</option>
                      <option value="B">Phương án B</option>
                      <option value="C">Phương án C</option>
                      <option value="D">Phương án D</option>
                    </select>
                  </div>
                </div>
              )}

              {qType === 'true_false' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Đáp án đúng</label>
                  <select
                    value={qCorrect}
                    onChange={(e) => setQCorrect(e.target.value)}
                    className="px-3 py-1.5 rounded border border-slate-200 bg-white font-bold"
                  >
                    <option value="Đúng">Đúng</option>
                    <option value="Sai">Sai</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Lời giải chi tiết & hướng dẫn chấm
                </label>
                <textarea
                  rows={2}
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Ghi rõ các bước biến đổi để học sinh đối chiếu..."
                  className="w-full px-3 py-2 rounded border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-200 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Lưu vào ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
