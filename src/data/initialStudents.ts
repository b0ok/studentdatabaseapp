import { StudentRecord } from '../types/student';

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: '11001',
    firstName: 'Marcus',
    lastName: 'Vance',
    gradeYear: 1,
    courses: ['Computer Science 101', 'Mathematics 101'],
    tuitionBalance: 600,
    totalPaid: 600,
    enrolledAt: '2026-09-01',
    major: 'Computer Science',
    scholarshipPercent: 0,
    grades: {
      'Computer Science 101': 'A',
      'Mathematics 101': 'B+'
    },
    gpa: 3.65,
    certificates: [
      {
        certificateId: 'CERT-CS101-11001',
        courseCode: 'Computer Science 101',
        courseName: 'Computer Science 101: Intro to Programming',
        studentName: 'Marcus Vance',
        studentId: '11001',
        issueDate: '2026-10-01',
        verificationHash: '9a3f2b8c-cs101-verified',
        grade: 'A',
        institution: 'University School of Computing'
      }
    ]
  },
  {
    id: '21002',
    firstName: 'Elena',
    lastName: 'Reyes',
    gradeYear: 2,
    courses: ['Chemistry 101', 'English 101', 'History 101'],
    tuitionBalance: 0,
    totalPaid: 1800,
    enrolledAt: '2026-09-02',
    major: 'Biochemistry',
    scholarshipPercent: 25,
    grades: {
      'Chemistry 101': 'A',
      'English 101': 'A',
      'History 101': 'A-'
    },
    gpa: 3.90,
    certificates: [
      {
        certificateId: 'CERT-CHEM101-21002',
        courseCode: 'Chemistry 101',
        courseName: 'Chemistry 101: General Chemistry',
        studentName: 'Elena Reyes',
        studentId: '21002',
        issueDate: '2026-10-05',
        verificationHash: '7e1c4a9d-chem101-verified',
        grade: 'A',
        institution: 'University College of Sciences'
      }
    ]
  },
  {
    id: '31003',
    firstName: 'Devon',
    lastName: 'Kao',
    gradeYear: 3,
    courses: ['Computer Science 101', 'History 101', 'Mathematics 101'],
    tuitionBalance: 1200,
    totalPaid: 600,
    enrolledAt: '2026-09-03',
    major: 'Data Science',
    scholarshipPercent: 0,
    financialHold: true,
    grades: {
      'Computer Science 101': 'B',
      'History 101': 'C+',
      'Mathematics 101': 'IP'
    },
    gpa: 2.65,
    certificates: []
  },
  {
    id: '41004',
    firstName: 'Sophia',
    lastName: 'Chen',
    gradeYear: 4,
    courses: ['Computer Science 101', 'Chemistry 101'],
    tuitionBalance: 0,
    totalPaid: 1200,
    enrolledAt: '2026-09-04',
    major: 'Software Engineering',
    scholarshipPercent: 50,
    grades: {
      'Computer Science 101': 'A',
      'Chemistry 101': 'A-'
    },
    gpa: 3.85,
    certificates: [
      {
        certificateId: 'CERT-CS101-41004',
        courseCode: 'Computer Science 101',
        courseName: 'Computer Science 101: Intro to Programming',
        studentName: 'Sophia Chen',
        studentId: '41004',
        issueDate: '2026-10-08',
        verificationHash: '4b8d1f2e-cs101-verified',
        grade: 'A',
        institution: 'University School of Computing'
      }
    ]
  }
];
