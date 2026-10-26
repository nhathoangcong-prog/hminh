export type AcademicStatus = 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Cần hỗ trợ';

export interface Classroom {
  id: string;
  code: string;
  name: string;
  grade: '10' | '11' | '12';
  schoolYear: string;
  studentCount: number;
  homeroomTeacher?: string;
  averageScore: number;
  passRate: number; // percentage
  notes?: string;
}

export interface Student {
  id: string;
  code: string; // Mã học sinh ví dụ HS1001
  fullName: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  classId: string;
  className: string;
  mathGpa: number; // Điểm trung bình môn Toán
  status: AcademicStatus;
  notes?: string;
  phone?: string;
  parentPhone?: string;
  testScores: Record<string, number>; // testId -> score
  topicStrengths?: string[];
  topicWeaknesses?: string[];
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';
export type DifficultyLevel = 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Cho trắc nghiệm 4 lựa chọn A, B, C, D
  correctAnswer: string; // "A", "B", "C", "D" hoặc "Đúng"/"Sai" hoặc số/chuỗi ngắn
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
  grade: '10' | '11' | '12';
}

export interface TestExam {
  id: string;
  title: string;
  classId: string;
  className: string;
  testDate: string;
  durationMinutes: number;
  type: '15 phút' | '45 phút (1 tiết)' | 'Giữa kỳ' | 'Cuối kỳ';
  scale: number; // thường là 10
  coefficient: number; // hệ số 1, 2, 3
  topic: string;
  questionCount: number;
  status: 'Sắp tới' | 'Đã kiểm tra' | 'Đang chấm' | 'Đã nhập điểm';
  questions?: Question[];
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  className: string;
  score: number;
  submittedAt: string;
  answers: Record<string, string>;
  timeSpentSeconds: number;
  teacherFeedback?: string;
}

export interface MathTopic {
  id: string;
  name: string;
  grade: '10' | '11' | '12';
  description: string;
  weightPercent: number;
  averageScore: number;
  strugglingCount: number;
}

export interface TeachingDocument {
  id: string;
  title: string;
  category: 'Giáo án' | 'Kế hoạch bài dạy' | 'Phiếu học tập' | 'Đề kiểm tra' | 'Đáp án' | 'Tài liệu tham khảo';
  grade: '10' | '11' | '12';
  topic: string;
  schoolYear: string;
  fileType: 'PDF' | 'DOCX' | 'TEX' | 'MD';
  fileSize: string;
  createdAt: string;
  content: string;
  aiGenerated?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'document' | 'grade' | 'schedule' | 'system';
  read: boolean;
  details?: string;
}

export interface AppSettings {
  teacherName: string;
  teacherTitle: string;
  schoolName: string;
  slogan: string;
  academicYear: string;
  gradingScale: number;
  passGrade: number;
  excellentGrade: number;
  goodGrade: number;
  averageGrade: number;
}
