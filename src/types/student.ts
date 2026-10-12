export type GradeLevel = 1 | 2 | 3 | 4;

export const GRADE_LEVEL_LABELS: Record<GradeLevel, string> = {
  1: 'Freshman (1)',
  2: 'Sophomore (2)',
  3: 'Junior (3)',
  4: 'Senior (4)',
};

export type LetterGrade = 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'F' | 'IP';

export const GRADE_POINTS: Record<LetterGrade, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0,
  'IP': 0.0
};

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  cost: number;
  description: string;
  maxCapacity: number;
  instructor: string;
  prerequisites: string[];
}

export interface DigitalCertificate {
  certificateId: string;
  courseCode: string;
  courseName: string;
  studentName: string;
  studentId: string;
  issueDate: string;
  verificationHash: string;
  grade: string;
  institution: string;
}

export interface StudentRecord {
  id: string; // unique 5-digit ID (e.g. 11001)
  firstName: string;
  lastName: string;
  gradeYear: GradeLevel;
  courses: string[]; // List of course names/codes
  tuitionBalance: number;
  totalPaid: number;
  enrolledAt: string;
  // University & Coursera Enterprise Enhancements:
  grades?: Record<string, LetterGrade>; // courseCode -> letter grade
  gpa?: number;
  scholarshipPercent?: number; // 0, 25, 50, 100% (Coursera Aid / University Scholarship)
  financialHold?: boolean;
  certificates?: DigitalCertificate[];
  major?: string;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  remainingBalance: number;
}

