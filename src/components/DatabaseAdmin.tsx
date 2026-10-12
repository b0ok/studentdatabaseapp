import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  BookOpen,
  DollarSign,
  GraduationCap,
  FileText,
  Trash2,
  CheckCircle2,
  X,
  CreditCard,
  Download,
  Receipt,
  FileSpreadsheet,
  Upload,
  Sparkles,
  Award,
  AlertTriangle,
  Percent,
  Printer,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { AnalyticsCharts } from './AnalyticsCharts';
import {
  StudentRecord,
  GradeLevel,
  GRADE_LEVEL_LABELS,
  LetterGrade,
  GRADE_POINTS,
  DigitalCertificate
} from '../types/student';
import { AVAILABLE_COURSES, COURSE_COST } from '../data/courses';

interface DatabaseAdminProps {
  students: StudentRecord[];
  setStudents: React.Dispatch<React.SetStateAction<StudentRecord[]>>;
  nextIdCounter: number;
  setNextIdCounter: React.Dispatch<React.SetStateAction<number>>;
  onOpenTerminal: () => void;
}

export const DatabaseAdmin: React.FC<DatabaseAdminProps> = ({
  students,
  setStudents,
  nextIdCounter,
  setNextIdCounter,
  onOpenTerminal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [balanceFilter, setBalanceFilter] = useState<string>('all');
  const [showAnalyticsCharts, setShowAnalyticsCharts] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [enrollTargetStudent, setEnrollTargetStudent] = useState<StudentRecord | null>(null);
  const [payTargetStudent, setPayTargetStudent] = useState<StudentRecord | null>(null);
  const [statusTargetStudent, setStatusTargetStudent] = useState<StudentRecord | null>(null);

  // Enterprise SIS & Coursera Feature Modals
  const [transcriptTargetStudent, setTranscriptTargetStudent] = useState<StudentRecord | null>(null);
  const [certificateTargetStudent, setCertificateTargetStudent] = useState<StudentRecord | null>(null);
  const [activeCert, setActiveCert] = useState<DigitalCertificate | null>(null);
  const [scholarshipTargetStudent, setScholarshipTargetStudent] = useState<StudentRecord | null>(null);

  // Batch Onboarding State
  const [batchCsvText, setBatchCsvText] = useState(
`Liam,Vance,1,Computer Science 101;Mathematics 101,600
Maya,Patel,2,Chemistry 101;History 101,1200
Ethan,Brooks,3,Computer Science 101;English 101;History 101,1000
Chloe,Zhang,4,Computer Science 101;Chemistry 101,1200`
  );
  const [batchSuccessCount, setBatchSuccessCount] = useState<number | null>(null);

  // Add Student Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newMajor, setNewMajor] = useState('Computer Science');
  const [newGradeYear, setNewGradeYear] = useState<GradeLevel>(1);
  const [newInitialCourses, setNewInitialCourses] = useState<string[]>([]);
  const [newInitialPayment, setNewInitialPayment] = useState<number>(0);

  // Pay Tuition Modal State
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentReceipt, setPaymentReceipt] = useState<{
    studentName: string;
    studentId: string;
    paid: number;
    newBalance: number;
  } | null>(null);

  // Helper: Calculate GPA weighted by course credits
  const calculateStudentGPA = (grades?: Record<string, LetterGrade>, enrolledCourses: string[] = []): number => {
    if (!grades || Object.keys(grades).length === 0) return 0.0;
    let totalPoints = 0;
    let totalCredits = 0;

    for (const courseCode of enrolledCourses) {
      const grade = grades[courseCode];
      if (grade && grade !== 'IP') {
        const courseObj = AVAILABLE_COURSES.find((c) => c.code === courseCode);
        const credits = courseObj ? courseObj.credits : 3;
        totalPoints += (GRADE_POINTS[grade] || 0) * credits;
        totalCredits += credits;
      }
    }
    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0.0;
  };

  // Helper: Live section enrollment count
  const courseEnrollmentMap = AVAILABLE_COURSES.reduce<Record<string, number>>((acc, course) => {
    acc[course.code] = students.filter((s) => s.courses.includes(course.code)).length;
    return acc;
  }, {});

  // Handle grade update
  const handleUpdateGrade = (studentId: string, courseCode: string, grade: LetterGrade) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentGrades = { ...(s.grades || {}), [courseCode]: grade };
        const updatedGpa = calculateStudentGPA(currentGrades, s.courses);
        const updatedStudent = {
          ...s,
          grades: currentGrades,
          gpa: updatedGpa
        };
        if (transcriptTargetStudent?.id === studentId) {
          setTranscriptTargetStudent(updatedStudent);
        }
        return updatedStudent;
      })
    );
  };

  // Handle issue Coursera-style certificate
  const handleIssueCertificate = (student: StudentRecord, courseCode: string) => {
    const courseObj = AVAILABLE_COURSES.find((c) => c.code === courseCode);
    const certId = `CERT-${courseCode.replace(/[^a-zA-Z0-9]/g, '')}-${student.id}`;
    const hash = `${Math.random().toString(36).substring(2, 9)}-${courseCode.toLowerCase().replace(/[^a-z0-9]/g, '')}-ver`;

    const newCert: DigitalCertificate = {
      certificateId: certId,
      courseCode: courseCode,
      courseName: courseObj ? courseObj.name : courseCode,
      studentName: `${student.firstName} ${student.lastName}`,
      studentId: student.id,
      issueDate: new Date().toISOString().split('T')[0],
      verificationHash: hash,
      grade: student.grades?.[courseCode] || 'Pass',
      institution: 'University & Online Division of Continuing Education'
    };

    const existingCerts = student.certificates || [];
    const updatedCerts = existingCerts.some((c) => c.courseCode === courseCode)
      ? existingCerts.map((c) => (c.courseCode === courseCode ? newCert : c))
      : [...existingCerts, newCert];

    const updatedStudent = {
      ...student,
      certificates: updatedCerts
    };

    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    setActiveCert(newCert);
    if (certificateTargetStudent?.id === student.id) {
      setCertificateTargetStudent(updatedStudent);
    }
  };

  // Handle scholarship / financial aid
  const handleApplyScholarship = (studentId: string, percent: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const baseTuition = s.courses.length * COURSE_COST;
        const discount = Math.round(baseTuition * (percent / 100));
        const effectiveTuition = Math.max(0, baseTuition - discount);
        const newBalance = Math.max(0, effectiveTuition - (s.totalPaid || 0));
        const updated = {
          ...s,
          scholarshipPercent: percent,
          tuitionBalance: newBalance,
          financialHold: newBalance > 800
        };
        if (scholarshipTargetStudent?.id === studentId) {
          setScholarshipTargetStudent(updated);
        }
        return updated;
      })
    );
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.includes(searchQuery);

    const matchesGrade =
      selectedGrade === 'all' || s.gradeYear.toString() === selectedGrade;

    const matchesBalance =
      balanceFilter === 'all'
        ? true
        : balanceFilter === 'owing'
        ? s.tuitionBalance > 0
        : s.tuitionBalance === 0;

    return matchesSearch && matchesGrade && matchesBalance;
  });

  // Calculate Metrics
  const totalStudents = students.length;
  const totalCoursesEnrolled = students.reduce((sum, s) => sum + s.courses.length, 0);
  const totalTuitionBilled = totalCoursesEnrolled * COURSE_COST;
  const totalPaid = students.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
  const totalBalanceDue = students.reduce((sum, s) => sum + s.tuitionBalance, 0);

  // Add Student Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim()) return;

    const counter = nextIdCounter + 1;
    setNextIdCounter(counter);
    const newId = `${newGradeYear}${counter}`;

    const tuition = newInitialCourses.length * COURSE_COST;
    const finalBalance = Math.max(0, tuition - newInitialPayment);

    const newStudent: StudentRecord = {
      id: newId,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      gradeYear: newGradeYear,
      courses: newInitialCourses,
      tuitionBalance: finalBalance,
      totalPaid: newInitialPayment,
      enrolledAt: new Date().toISOString().split('T')[0]
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Reset form
    setNewFirstName('');
    setNewLastName('');
    setNewGradeYear(1);
    setNewInitialCourses([]);
    setNewInitialPayment(0);
    setIsAddModalOpen(false);
  };

  // Enroll in Course Handler
  const handleToggleCourse = (courseCode: string) => {
    if (!enrollTargetStudent) return;

    const isEnrolled = enrollTargetStudent.courses.includes(courseCode);
    let updatedCourses: string[];
    let updatedBalance: number;

    if (isEnrolled) {
      updatedCourses = enrollTargetStudent.courses.filter((c) => c !== courseCode);
      updatedBalance = Math.max(0, enrollTargetStudent.tuitionBalance - COURSE_COST);
    } else {
      updatedCourses = [...enrollTargetStudent.courses, courseCode];
      updatedBalance = enrollTargetStudent.tuitionBalance + COURSE_COST;
    }

    const updated = {
      ...enrollTargetStudent,
      courses: updatedCourses,
      tuitionBalance: updatedBalance
    };

    setEnrollTargetStudent(updated);
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  // Pay Tuition Handler
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTargetStudent) return;

    const amount = parseInt(paymentAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    const newBal = Math.max(0, payTargetStudent.tuitionBalance - amount);
    const newPaid = (payTargetStudent.totalPaid || 0) + amount;

    const updated: StudentRecord = {
      ...payTargetStudent,
      tuitionBalance: newBal,
      totalPaid: newPaid
    };

    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );

    setPaymentReceipt({
      studentName: `${payTargetStudent.firstName} ${payTargetStudent.lastName}`,
      studentId: payTargetStudent.id,
      paid: amount,
      newBalance: newBal
    });

    setPaymentAmount('');
  };

  // Delete Student
  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to remove this student from the database?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Export Data as CSV
  const handleExportCSV = () => {
    const headers = ['StudentID', 'FirstName', 'LastName', 'GradeYear', 'Courses', 'TuitionBalance', 'TotalPaid'];
    const rows = students.map((s) => [
      s.id,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      s.gradeYear,
      `"${s.courses.join('; ')}"`,
      s.tuitionBalance,
      s.totalPaid
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `students_database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Batch Import Multiple Applicants from CSV / Application Forms
  const handleBatchImport = (csvString: string) => {
    const lines = csvString.trim().split('\n');
    let counter = nextIdCounter;
    const newStudentsBatch: StudentRecord[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('FirstName') || line.startsWith('First') || line.startsWith('#')) continue;
      const parts = line.split(',');
      if (parts.length < 3) continue;

      const firstName = parts[0].trim();
      const lastName = parts[1].trim();
      const grade = parseInt(parts[2].trim(), 10);
      const gradeYear = (grade >= 1 && grade <= 4 ? grade : 1) as GradeLevel;

      counter++;
      const id = `${gradeYear}${counter}`;

      const rawCourses = parts[3] ? parts[3].trim().replace(/^"|"$/g, '').split(';') : [];
      const courses = rawCourses.map((c) => c.trim()).filter(Boolean);

      const payment = parts[4] ? parseInt(parts[4].trim(), 10) || 0 : 0;
      const tuition = courses.length * COURSE_COST;
      const balance = Math.max(0, tuition - payment);

      newStudentsBatch.push({
        id,
        firstName,
        lastName,
        gradeYear,
        courses,
        tuitionBalance: balance,
        totalPaid: payment,
        enrolledAt: new Date().toISOString().split('T')[0]
      });
    }

    if (newStudentsBatch.length > 0) {
      setNextIdCounter(counter);
      setStudents((prev) => [...newStudentsBatch, ...prev]);
      setBatchSuccessCount(newStudentsBatch.length);
      setTimeout(() => {
        setBatchSuccessCount(null);
        setIsBatchModalOpen(false);
      }, 1500);
    }
  };

  const handleDownloadCsvTemplate = () => {
    const templateContent = `FirstName,LastName,GradeYear,Courses,Payment\nLiam,Vance,1,"Computer Science 101;Mathematics 101",600\nMaya,Patel,2,"Chemistry 101;History 101",1200\nEthan,Brooks,3,"Computer Science 101;English 101;History 101",1000\nChloe,Zhang,4,"Computer Science 101;Chemistry 101",1200`;
    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'student_applications_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Students</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{totalStudents}</span>
          <span className="text-[11px] text-slate-400 mt-1">Student[] objects in memory</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Courses Enrolled</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{totalCoursesEnrolled}</span>
          <span className="text-[11px] text-slate-400 mt-1">Across 5 catalog courses</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Tuition Billed</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400">${totalTuitionBilled.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400 mt-1">Rate: $600 / course</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Collected</span>
            <CreditCard className="w-4 h-4 text-sky-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-sky-400">${totalPaid.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400 mt-1">via payTuition()</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Outstanding Balance</span>
            <Receipt className="w-4 h-4 text-rose-400" />
          </div>
          <span className={`text-2xl font-bold font-mono ${totalBalanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            ${totalBalanceDue.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1">Receivables remaining</span>
        </div>
      </div>

      {/* Database Controls Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        {/* Left: Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[220px] max-w-xs flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or 5-digit ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Grade Level Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedGrade === 'all'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Grades
            </button>
            <button
              onClick={() => setSelectedGrade('1')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedGrade === '1'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Freshmen
            </button>
            <button
              onClick={() => setSelectedGrade('2')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedGrade === '2'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sophomore
            </button>
            <button
              onClick={() => setSelectedGrade('3')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedGrade === '3'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Junior
            </button>
            <button
              onClick={() => setSelectedGrade('4')}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedGrade === '4'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Senior
            </button>
          </div>

          {/* Balance Filter */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setBalanceFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                balanceFilter === 'all'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Balances
            </button>
            <button
              onClick={() => setBalanceFilter('owing')}
              className={`px-2.5 py-1 rounded transition-colors ${
                balanceFilter === 'owing'
                  ? 'bg-rose-500/20 text-rose-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Owing
            </button>
            <button
              onClick={() => setBalanceFilter('paid')}
              className={`px-2.5 py-1 rounded transition-colors ${
                balanceFilter === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnalyticsCharts(!showAnalyticsCharts)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors border ${
              showAnalyticsCharts
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Cohort Analytics & Charts"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>{showAnalyticsCharts ? 'Hide Analytics' : 'Show Charts'}</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            title="Batch Onboard Admitted Cohort (No One-by-One Typing)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Batch Onboard Cohort</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Cohort Analytics & Charts Visualization */}
      {showAnalyticsCharts && (
        <AnalyticsCharts
          students={students}
          onSelectGradeFilter={(g) => setSelectedGrade(g.toString())}
        />
      )}

      {/* Enterprise Course Section Capacity Monitor */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Course Catalog & Section Capacity Monitor (SIS Engine)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            FIFO Waitlist Protocol Active · 5 Catalog Sections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {AVAILABLE_COURSES.map((course) => {
            const enrolledCount = courseEnrollmentMap[course.code] || 0;
            const percentage = Math.round((enrolledCount / course.maxCapacity) * 100);
            return (
              <div
                key={course.id}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-slate-200">{course.code}</span>
                  <span className="font-mono text-[11px] text-cyan-400 font-semibold">
                    {enrolledCount}/{course.maxCapacity} seats
                  </span>
                </div>
                {/* Capacity Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentage >= 90
                        ? 'bg-rose-500'
                        : percentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(8, percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="truncate">{course.instructor}</span>
                  <span className="font-mono text-slate-500">{course.credits} cr</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global Search & Quick Access Bar directly above Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Global Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Global Search: Type student first/last name or 5-digit unique ID (e.g. 'Marcus', '11001')..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Result Counter & Reset */}
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="text-slate-500">Matching:</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 font-bold text-amber-400">
                {filteredStudents.length} of {students.length} students
              </span>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors font-mono"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Quick Search Shortcuts for immediate access */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">Quick Pick:</span>
          {students.slice(0, 4).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSearchQuery(s.id)}
              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 transition-colors font-mono text-[10px] flex items-center gap-1"
            >
              <span>{s.firstName} {s.lastName}</span>
              <span className="text-amber-400 font-bold">({s.id})</span>
            </button>
          ))}
          {searchQuery && (
            <span className="text-amber-400/90 text-[10px] font-mono ml-auto">
              Real-time filter active for &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Unique 5-Digit ID</th>
                <th className="py-3 px-4">Student & Major</th>
                <th className="py-3 px-4">Class Year</th>
                <th className="py-3 px-4">GPA & Academic Standing</th>
                <th className="py-3 px-4">Courses & Grades</th>
                <th className="py-3 px-4 text-right">Tuition Balance</th>
                <th className="py-3 px-4 text-right">Total Paid</th>
                <th className="py-3 px-4 text-center">SIS Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <p className="font-medium text-slate-400 mb-1">No student records found</p>
                    <p className="text-xs">Adjust your search query or add a new student above.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const gpa = student.gpa ?? calculateStudentGPA(student.grades, student.courses);
                  const isDeansList = gpa >= 3.5;
                  const isProbation = gpa > 0 && gpa < 2.0;
                  const certCount = student.certificates?.length || 0;

                  return (
                    <tr key={student.id} className="hover:bg-slate-850 transition-colors group">
                      {/* Unique 5-digit ID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-amber-500/30">
                            {student.id}
                          </span>
                          {student.financialHold && (
                            <span
                              title="Financial Hold (Outstanding balance past due)"
                              className="text-rose-400 hover:text-rose-300"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name & Major */}
                      <td className="py-3 px-4 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-amber-300 font-semibold text-[11px] border border-slate-700">
                            {student.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-slate-100 font-semibold">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {student.major || 'Computer Science'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class Year */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>{GRADE_LEVEL_LABELS[student.gradeYear]}</span>
                        </div>
                      </td>

                      {/* GPA & Academic Standing */}
                      <td className="py-3 px-4">
                        {student.courses.length === 0 ? (
                          <span className="text-slate-500 italic">No courses</span>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="font-mono font-bold text-slate-200">
                              {gpa > 0 ? gpa.toFixed(2) : '3.00'} GPA
                            </div>
                            <div className="text-[10px]">
                              {isDeansList ? (
                                <span className="text-emerald-400 font-medium">★ Dean&apos;s List</span>
                              ) : isProbation ? (
                                <span className="text-rose-400 font-medium">⚠ Probation</span>
                              ) : (
                                <span className="text-slate-400">Good Standing</span>
                              )}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Courses & Grades */}
                      <td className="py-3 px-4">
                        {student.courses.length === 0 ? (
                          <span className="text-slate-500 italic">None</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.courses.map((course) => {
                              const grade = student.grades?.[course] || 'IP';
                              return (
                                <span
                                  key={course}
                                  className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1"
                                >
                                  <span>{course}</span>
                                  <span
                                    className={`font-mono font-semibold ${
                                      grade === 'A' || grade === 'A-'
                                        ? 'text-emerald-400'
                                        : grade === 'B' || grade === 'B+'
                                        ? 'text-cyan-400'
                                        : grade === 'IP'
                                        ? 'text-slate-500'
                                        : 'text-amber-400'
                                    }`}
                                  >
                                    [{grade}]
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Tuition Balance & Financial Aid */}
                      <td className="py-3 px-4 text-right">
                        <div className="space-y-0.5">
                          <span
                            className={`font-mono font-semibold ${
                              student.tuitionBalance > 0 ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            ${student.tuitionBalance}
                          </span>
                          {student.scholarshipPercent && student.scholarshipPercent > 0 ? (
                            <div className="text-[10px] text-amber-400 font-mono">
                              {student.scholarshipPercent}% Aid Applied
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Total Paid */}
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        ${student.totalPaid || 0}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEnrollTargetStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
                            title="Manage Course Enrollments"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setPayTargetStudent(student);
                              setPaymentReceipt(null);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-300 hover:bg-slate-800 rounded transition-colors"
                            title="Make Tuition Payment"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTranscriptTargetStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                            title="Official Academic Transcript & Grading"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setCertificateTargetStudent(student);
                              if (student.certificates && student.certificates.length > 0) {
                                setActiveCert(student.certificates[0]);
                              } else if (student.courses.length > 0) {
                                handleIssueCertificate(student, student.courses[0]);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded transition-colors"
                            title={`Digital Certificates (${certCount})`}
                          >
                            <Award className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setScholarshipTargetStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded transition-colors"
                            title="Financial Aid / Scholarship Waivers"
                          >
                            <Percent className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setStatusTargetStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors"
                            title="View Java toString() Status Slip"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Add New Student to Database</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">Class Grade Year (Level 1–4) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {([1, 2, 3, 4] as GradeLevel[]).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setNewGradeYear(yr)}
                      className={`py-2 px-3 rounded-lg border text-left transition-colors flex items-center justify-between ${
                        newGradeYear === yr
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-medium'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{GRADE_LEVEL_LABELS[yr]}</span>
                      {newGradeYear === yr && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">
                  Generated ID will be: {newGradeYear}
                  {nextIdCounter + 1} (5 digits)
                </p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">
                  Initial Courses ($600 / course)
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {AVAILABLE_COURSES.map((course) => {
                    const isSelected = newInitialCourses.includes(course.code);
                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          if (isSelected) {
                            setNewInitialCourses(newInitialCourses.filter((c) => c !== course.code));
                          } else {
                            setNewInitialCourses([...newInitialCourses, course.code]);
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-800/80 text-cyan-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-mono">{course.code}</span>
                        <span className="text-[10px] text-slate-400">$600</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Initial Tuition Payment ($)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={newInitialPayment}
                  onChange={(e) => setNewInitialPayment(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="0"
                  className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Total Tuition: ${newInitialCourses.length * COURSE_COST}</span>
                  <span className="text-amber-400 font-semibold font-mono">
                    Net Balance: ${Math.max(0, newInitialCourses.length * COURSE_COST - newInitialPayment)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium rounded-lg transition-colors"
                >
                  Instantiate Student Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLL COURSES MODAL */}
      {enrollTargetStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">
                  Course Enrollment: {enrollTargetStudent.firstName} {enrollTargetStudent.lastName}
                </h3>
                <span className="text-xs text-amber-400 font-mono">Student ID: {enrollTargetStudent.id}</span>
              </div>
              <button
                onClick={() => setEnrollTargetStudent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                As per specification, students can enroll in the 5 catalog courses below. Each course adds $600 to the tuition balance.
              </p>

              <div className="space-y-2">
                {AVAILABLE_COURSES.map((course) => {
                  const isEnrolled = enrollTargetStudent.courses.includes(course.code);
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleToggleCourse(course.code)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isEnrolled
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200 flex items-center gap-2">
                          <span>{course.name}</span>
                          {isEnrolled && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                              Enrolled
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{course.description}</div>
                      </div>
                      <div className="text-right font-mono text-xs font-semibold text-slate-300 ml-4 shrink-0">
                        ${COURSE_COST}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Total Courses: </span>
                  <span className="text-slate-200 font-mono font-bold">{enrollTargetStudent.courses.length}</span>
                </div>
                <div>
                  <span className="text-slate-400">Current Tuition Balance: </span>
                  <span className="text-amber-400 font-mono font-bold">${enrollTargetStudent.tuitionBalance}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setEnrollTargetStudent(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAY TUITION MODAL */}
      {payTargetStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-100 text-sm">Pay Tuition</h3>
                <span className="text-xs text-amber-400 font-mono">
                  {payTargetStudent.firstName} {payTargetStudent.lastName} ({payTargetStudent.id})
                </span>
              </div>
              <button
                onClick={() => setPayTargetStudent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {paymentReceipt ? (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3 font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tuition Payment Successful</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-xs border-t border-slate-800 pt-2">
                    <p>Student: {paymentReceipt.studentName}</p>
                    <p>Student ID: {paymentReceipt.studentId}</p>
                    <p className="text-emerald-300">Amount Paid: ${paymentReceipt.paid}</p>
                    <p className="text-amber-400 font-bold">Remaining Balance: ${paymentReceipt.newBalance}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPaymentReceipt(null);
                      setPayTargetStudent(null);
                    }}
                    className="w-full mt-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors"
                  >
                    Close Receipt
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Enrolled Courses:</span>
                      <span className="font-mono text-slate-200">{payTargetStudent.courses.length} courses</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Tuition Invoiced:</span>
                      <span className="font-mono text-slate-200">${payTargetStudent.courses.length * COURSE_COST}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1">
                      <span className="text-slate-400">Current Balance Due:</span>
                      <span className="font-mono font-bold text-rose-400">${payTargetStudent.tuitionBalance}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Payment Amount ($) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="e.g. 600"
                      className="w-full bg-slate-950 border border-slate-750 rounded-lg px-3 py-2 text-slate-200 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setPaymentAmount(payTargetStudent.tuitionBalance.toString())}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-mono"
                      >
                        Pay Full Balance (${payTargetStudent.tuitionBalance})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentAmount('600')}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-mono"
                      >
                        1 Course ($600)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPayTargetStudent(null)}
                      className="px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={payTargetStudent.tuitionBalance === 0}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Process Payment</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STUDENT STATUS SLIP MODAL (toString format) */}
      {statusTargetStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Java toString() Student Status</h3>
              </div>
              <button
                onClick={() => setStatusTargetStudent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-400">
                This shows the exact terminal output format generated by the overridden <code className="text-amber-300">public String toString()</code> method:
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                {`Name: ${statusTargetStudent.firstName} ${statusTargetStudent.lastName}
Grade Level: ${statusTargetStudent.gradeYear}
Student ID: ${statusTargetStudent.id}
Courses Enrolled:${
                  statusTargetStudent.courses.length > 0
                    ? statusTargetStudent.courses.map((c) => `\n  ${c}`).join('')
                    : '\n  None'
                }
Balance: $${statusTargetStudent.tuitionBalance}`}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    const text = `Name: ${statusTargetStudent.firstName} ${statusTargetStudent.lastName}\nGrade Level: ${statusTargetStudent.gradeYear}\nStudent ID: ${statusTargetStudent.id}\nCourses Enrolled:${
                      statusTargetStudent.courses.length > 0
                        ? statusTargetStudent.courses.map((c) => `\n  ${c}`).join('')
                        : '\n  None'
                    }\nBalance: $${statusTargetStudent.tuitionBalance}`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setStatusTargetStudent(null)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BATCH ONBOARDING MODAL (No One-By-One Entry) */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">
                    Batch Onboard Admitted Students
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Automated Ingestion · No One-By-One Manual Typing Needed
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Educational Context Note */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-lg p-3 text-emerald-200 leading-relaxed">
                <span className="font-semibold text-white">How it works in production: </span>
                When students fill out online application forms, universities do not type them in manually via <code className="text-amber-300 font-mono">Scanner(System.in)</code>. Instead, Java uses an <strong>overloaded constructor</strong> (<code className="text-amber-300 font-mono">new Student(firstName, lastName, gradeYear)</code>) and a CSV/JSON file reader to instantiate and enroll hundreds of student objects in milliseconds!
              </div>

              {/* Instant 1-Click Action */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Onboard Admitted Cohort (4 Students)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Instantly onboards Liam Vance, Maya Patel, Ethan Brooks, and Chloe Zhang with unique IDs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleBatchImport(batchCsvText)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Onboard Sample Cohort</span>
                </button>
              </div>

              {/* Paste or Edit Custom Application Rows */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-medium">
                    Or Paste Application Form CSV Data:
                  </label>
                  <button
                    type="button"
                    onClick={handleDownloadCsvTemplate}
                    className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download CSV Template</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mb-2 font-mono">
                  Format: FirstName,LastName,GradeYear(1-4),Courses(semicolon-separated),Payment
                </p>
                <textarea
                  rows={5}
                  value={batchCsvText}
                  onChange={(e) => setBatchCsvText(e.target.value)}
                  placeholder="FirstName,LastName,GradeYear,Courses,Payment..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Success Banner */}
              {batchSuccessCount !== null && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    Successfully instantiated and onboarded {batchSuccessCount} new Student objects with unique 5-digit IDs!
                  </span>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-3 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchImport(batchCsvText)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Process Batch Ingestion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL ACADEMIC TRANSCRIPT & GPA MODAL */}
      {transcriptTargetStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  Official Academic Transcript & Grading
                </h3>
              </div>
              <button
                onClick={() => setTranscriptTargetStudent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Student Header */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Student Name</span>
                  <span className="font-semibold text-slate-200">
                    {transcriptTargetStudent.firstName} {transcriptTargetStudent.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Student ID</span>
                  <span className="font-mono text-amber-400 font-bold">{transcriptTargetStudent.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Major</span>
                  <span className="text-slate-200">{transcriptTargetStudent.major || 'Computer Science'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Cumulative GPA</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    {calculateStudentGPA(transcriptTargetStudent.grades, transcriptTargetStudent.courses).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Course Grades Table */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 mb-2">Enrolled Course Records</h4>
                {transcriptTargetStudent.courses.length === 0 ? (
                  <p className="text-slate-500 italic py-4 text-center">No enrolled courses yet.</p>
                ) : (
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Course Code</th>
                          <th className="p-2.5">Credits</th>
                          <th className="p-2.5">Grade</th>
                          <th className="p-2.5">Grade Points</th>
                          <th className="p-2.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {transcriptTargetStudent.courses.map((courseCode) => {
                          const courseObj = AVAILABLE_COURSES.find((c) => c.code === courseCode);
                          const credits = courseObj ? courseObj.credits : 3;
                          const currentGrade = transcriptTargetStudent.grades?.[courseCode] || 'IP';
                          const gradePoint = GRADE_POINTS[currentGrade] || 0.0;

                          return (
                            <tr key={courseCode} className="hover:bg-slate-850">
                              <td className="p-2.5 font-mono text-slate-200 font-medium">
                                {courseCode}
                              </td>
                              <td className="p-2.5 font-mono text-slate-400">{credits} cr</td>
                              <td className="p-2.5">
                                <select
                                  value={currentGrade}
                                  onChange={(e) =>
                                    handleUpdateGrade(
                                      transcriptTargetStudent.id,
                                      courseCode,
                                      e.target.value as LetterGrade
                                    )
                                  }
                                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                                >
                                  <option value="A">A (4.0)</option>
                                  <option value="A-">A- (3.7)</option>
                                  <option value="B+">B+ (3.3)</option>
                                  <option value="B">B (3.0)</option>
                                  <option value="B-">B- (2.7)</option>
                                  <option value="C+">C+ (2.3)</option>
                                  <option value="C">C (2.0)</option>
                                  <option value="D">D (1.0)</option>
                                  <option value="F">F (0.0)</option>
                                  <option value="IP">IP (In Progress)</option>
                                </select>
                              </td>
                              <td className="p-2.5 font-mono text-slate-300">
                                {currentGrade !== 'IP' ? (gradePoint * credits).toFixed(1) : '--'}
                              </td>
                              <td className="p-2.5 text-right">
                                {currentGrade !== 'IP' && currentGrade !== 'F' && currentGrade !== 'D' && (
                                  <button
                                    onClick={() => handleIssueCertificate(transcriptTargetStudent, courseCode)}
                                    className="px-2 py-1 bg-purple-950 text-purple-300 hover:bg-purple-900 border border-purple-800 rounded text-[10px] font-medium"
                                  >
                                    Issue Certificate
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Academic Standing Summary */}
              {(() => {
                const gpa = calculateStudentGPA(transcriptTargetStudent.grades, transcriptTargetStudent.courses);
                const standing =
                  gpa >= 3.5
                    ? { title: "Dean's List Honoree", style: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' }
                    : gpa < 2.0 && gpa > 0
                    ? { title: 'Academic Probation Warning', style: 'bg-rose-950/40 text-rose-300 border-rose-500/40' }
                    : { title: 'Good Academic Standing', style: 'bg-slate-950 text-slate-300 border-slate-800' };

                return (
                  <div className={`p-3 rounded-lg border flex items-center justify-between font-mono ${standing.style}`}>
                    <span>Academic Standing: {standing.title}</span>
                    <span className="font-bold">GPA: {gpa.toFixed(2)} / 4.00</span>
                  </div>
                );
              })()}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setTranscriptTargetStudent(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COURSERA-STYLE VERIFIABLE DIGITAL CERTIFICATE MODAL */}
      {certificateTargetStudent && activeCert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  Verifiable Digital Certificate of Completion
                </h3>
              </div>
              <button
                onClick={() => setCertificateTargetStudent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Certificate Canvas Card */}
              <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-xl p-6 text-center space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-600">
                  {activeCert.certificateId}
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold font-mono">
                    {activeCert.institution}
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">Certificate of Achievement</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">This certifies that</p>
                </div>

                <div className="text-xl font-bold font-serif text-amber-200 tracking-wide border-b border-slate-800 pb-2 mx-8">
                  {activeCert.studentName}
                </div>

                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  has successfully completed the coursework and academic requirements for
                  <br />
                  <strong className="text-white font-mono">{activeCert.courseName}</strong>
                  <br />
                  with an evaluated grade of <strong className="text-emerald-400 font-mono">{activeCert.grade}</strong>.
                </p>

                <div className="border-t border-slate-800/80 pt-3 grid grid-cols-2 text-[10px] text-slate-400 font-mono text-left">
                  <div>
                    <span>Issue Date: </span>
                    <span className="text-slate-200 font-semibold">{activeCert.issueDate}</span>
                    <br />
                    <span>Student ID: </span>
                    <span className="text-slate-200">{activeCert.studentId}</span>
                  </div>
                  <div className="text-right">
                    <span>Cryptographic Verification:</span>
                    <br />
                    <span className="text-amber-400 font-mono font-bold text-[9px] truncate inline-block max-w-[180px]">
                      {activeCert.verificationHash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Verification */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Coursera & edX Verification Hash Verified</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeCert.verificationHash);
                      alert('Verification code copied to clipboard!');
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  >
                    Copy Hash
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg text-xs flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINANCIAL AID & SCHOLARSHIP MODAL */}
      {scholarshipTargetStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-sky-400" />
                <h3 className="font-semibold text-slate-100 text-sm">
                  Financial Aid & Scholarships Office
                </h3>
              </div>
              <button
                onClick={() => setScholarshipTargetStudent(null)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Like Coursera Financial Aid grants and college institutional merit waivers, applying scholarship relief reduces tuition and clears financial registration holds.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1 font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Student:</span>
                  <span>{scholarshipTargetStudent.firstName} {scholarshipTargetStudent.lastName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Base Tuition:</span>
                  <span>${scholarshipTargetStudent.courses.length * COURSE_COST}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Current Aid Tier:</span>
                  <span className="text-sky-400 font-bold">
                    {scholarshipTargetStudent.scholarshipPercent || 0}% Discount
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1 text-slate-300">
                  <span>Net Balance Due:</span>
                  <span className="text-amber-400 font-bold">${scholarshipTargetStudent.tuitionBalance}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-400 font-medium">Select Financial Aid Tier:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { pct: 0, label: '0% (Standard Tuition)' },
                    { pct: 25, label: '25% (Coursera Tier 1 Aid)' },
                    { pct: 50, label: '50% (Merit Scholarship)' },
                    { pct: 100, label: '100% (Full Waiver)' }
                  ].map((tier) => (
                    <button
                      key={tier.pct}
                      type="button"
                      onClick={() => handleApplyScholarship(scholarshipTargetStudent.id, tier.pct)}
                      className={`p-2.5 rounded-lg border text-left transition-colors font-mono ${
                        (scholarshipTargetStudent.scholarshipPercent || 0) === tier.pct
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setScholarshipTargetStudent(null)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
