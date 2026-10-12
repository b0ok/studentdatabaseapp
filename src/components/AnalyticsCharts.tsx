import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  Users,
  BookOpen,
  PieChart,
  ArrowUpRight,
  GraduationCap,
  Filter
} from 'lucide-react';
import { StudentRecord, GradeLevel, GRADE_LEVEL_LABELS } from '../types/student';
import { COURSE_COST } from '../data/courses';

interface AnalyticsChartsProps {
  students: StudentRecord[];
  onSelectGradeFilter?: (grade: GradeLevel | 'all') => void;
}

type ChartMetricView = 'all' | 'enrollment' | 'tuition';

interface GradeMetrics {
  gradeYear: GradeLevel;
  label: string;
  shortLabel: string;
  studentCount: number;
  totalCourses: number;
  avgCoursesPerStudent: number;
  totalBilled: number;
  totalPaid: number;
  totalOwing: number;
  collectionRate: number; // percentage 0-100
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  students,
  onSelectGradeFilter
}) => {
  const [metricView, setMetricView] = useState<ChartMetricView>('all');
  const [hoveredGrade, setHoveredGrade] = useState<GradeLevel | null>(null);

  // Compute breakdown metrics for each grade level 1 to 4
  const grades: GradeLevel[] = [1, 2, 3, 4];
  const gradeData: GradeMetrics[] = grades.map((g) => {
    const cohort = students.filter((s) => s.gradeYear === g);
    const count = cohort.length;
    const totalCourses = cohort.reduce((acc, s) => acc + s.courses.length, 0);
    const totalBilled = totalCourses * COURSE_COST;
    const totalPaid = cohort.reduce((acc, s) => acc + (s.totalPaid || 0), 0);
    const totalOwing = cohort.reduce((acc, s) => acc + s.tuitionBalance, 0);
    const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0;
    const avgCourses = count > 0 ? parseFloat((totalCourses / count).toFixed(1)) : 0;

    const shortLabels: Record<GradeLevel, string> = {
      1: 'Freshmen (Yr 1)',
      2: 'Sophomores (Yr 2)',
      3: 'Juniors (Yr 3)',
      4: 'Seniors (Yr 4)'
    };

    return {
      gradeYear: g,
      label: GRADE_LEVEL_LABELS[g],
      shortLabel: shortLabels[g],
      studentCount: count,
      totalCourses,
      avgCoursesPerStudent: avgCourses,
      totalBilled,
      totalPaid,
      totalOwing,
      collectionRate
    };
  });

  // Calculate Global Maxima for Chart Scaling
  const maxStudents = Math.max(...gradeData.map((d) => d.studentCount), 1);
  const maxCourses = Math.max(...gradeData.map((d) => d.totalCourses), 1);
  const maxDollar = Math.max(...gradeData.map((d) => Math.max(d.totalBilled, d.totalPaid, d.totalOwing)), 1000);

  // Totals across all grades
  const totalStudents = students.length;
  const grandTotalBilled = gradeData.reduce((acc, d) => acc + d.totalBilled, 0);
  const grandTotalPaid = gradeData.reduce((acc, d) => acc + d.totalPaid, 0);
  const grandTotalOwing = gradeData.reduce((acc, d) => acc + d.totalOwing, 0);
  const overallCollectionRate = grandTotalBilled > 0 ? Math.round((grandTotalPaid / grandTotalBilled) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Cohort Analytics: Enrollment & Tuition Breakdown by Grade Level
              </h3>
              <p className="text-[11px] text-slate-400">
                Visualizing student headcounts, course registrations, and financial receivables across all 4 academic years.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetricView('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              metricView === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Combined View
          </button>
          <button
            onClick={() => setMetricView('enrollment')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              metricView === 'enrollment'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enrollment Counts
          </button>
          <button
            onClick={() => setMetricView('tuition')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              metricView === 'tuition'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tuition Status ($)
          </button>
        </div>
      </div>

      {/* Top Level Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Enrolled Students</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{totalStudents}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across Freshmen – Seniors</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Total Tuition Billed</span>
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-cyan-300">
            ${grandTotalBilled.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">At standard $600 / course</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Tuition Collected</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            ${grandTotalPaid.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5 font-mono">
            {overallCollectionRate}% Collection Rate
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Outstanding Balance</span>
            <DollarSign className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className={`text-xl font-bold font-mono ${grandTotalOwing > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${grandTotalOwing.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total Receivables Due</div>
        </div>
      </div>

      {/* CHARTS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CHART 1: Student Enrollment & Course Load by Grade Level */}
        {(metricView === 'all' || metricView === 'enrollment') && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 shadow-inner flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Student Enrollment & Course Load by Grade Level</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Comparative headcount (amber) vs. registered courses (cyan)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
                  <span className="text-slate-300">Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 inline-block" />
                  <span className="text-slate-300">Courses</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="space-y-4 pt-2">
              {gradeData.map((d) => {
                const studentPct = Math.round((d.studentCount / maxStudents) * 100);
                const coursePct = Math.round((d.totalCourses / maxCourses) * 100);
                const isHovered = hoveredGrade === d.gradeYear;

                return (
                  <div
                    key={d.gradeYear}
                    onMouseEnter={() => setHoveredGrade(d.gradeYear)}
                    onMouseLeave={() => setHoveredGrade(null)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isHovered
                        ? 'bg-slate-900 border-amber-500/40 shadow-md'
                        : 'bg-slate-900/60 border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{d.shortLabel}</span>
                        {onSelectGradeFilter && (
                          <button
                            type="button"
                            onClick={() => onSelectGradeFilter(d.gradeYear)}
                            className="text-[10px] text-amber-400 hover:text-amber-300 underline font-mono flex items-center gap-0.5"
                            title={`Filter roster to ${d.shortLabel}`}
                          >
                            <Filter className="w-2.5 h-2.5" />
                            <span>Filter</span>
                          </button>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                        <span className="text-amber-300 font-bold">{d.studentCount} students</span>
                        <span>·</span>
                        <span className="text-cyan-300 font-bold">{d.totalCourses} courses</span>
                        <span>·</span>
                        <span>avg {d.avgCoursesPerStudent}/student</span>
                      </div>
                    </div>

                    {/* Dual Progress Bars */}
                    <div className="space-y-1.5">
                      {/* Students Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono w-14 shrink-0">Headcount</span>
                        <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.max(4, studentPct)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-amber-300 w-6 text-right">
                          {d.studentCount}
                        </span>
                      </div>

                      {/* Courses Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-mono w-14 shrink-0">Courses</span>
                        <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
                            style={{ width: `${Math.max(4, coursePct)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300 w-6 text-right">
                          {d.totalCourses}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-850 flex items-center justify-between">
              <span>Grade levels determined by first digit of 5-digit unique student ID</span>
              <span className="font-mono text-amber-400/90 font-medium">Class 1 to 4</span>
            </div>
          </div>
        )}

        {/* CHART 2: Tuition & Financial Status by Grade Level */}
        {(metricView === 'all' || metricView === 'tuition') && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 shadow-inner flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tuition Financial Status by Grade Level</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Billed tuition vs. collected revenue vs. outstanding balance
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-400 inline-block" />
                  <span className="text-slate-300">Paid</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-400 inline-block" />
                  <span className="text-slate-300">Owing</span>
                </div>
              </div>
            </div>

            {/* Visual Financial Stacked Bars */}
            <div className="space-y-4 pt-2">
              {gradeData.map((d) => {
                const paidPct = d.totalBilled > 0 ? (d.totalPaid / d.totalBilled) * 100 : 0;
                const owingPct = d.totalBilled > 0 ? (d.totalOwing / d.totalBilled) * 100 : 0;
                const isHovered = hoveredGrade === d.gradeYear;

                return (
                  <div
                    key={d.gradeYear}
                    onMouseEnter={() => setHoveredGrade(d.gradeYear)}
                    onMouseLeave={() => setHoveredGrade(null)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isHovered
                        ? 'bg-slate-900 border-emerald-500/40 shadow-md'
                        : 'bg-slate-900/60 border-slate-850 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{d.shortLabel}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Billed: ${d.totalBilled.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">${d.totalPaid.toLocaleString()} paid</span>
                        <span>·</span>
                        <span className={`font-bold ${d.totalOwing > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                          ${d.totalOwing.toLocaleString()} owing
                        </span>
                      </div>
                    </div>

                    {/* Stacked Financial Status Bar */}
                    <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                      {/* Paid Portion */}
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${paidPct}%` }}
                        title={`Paid: $${d.totalPaid} (${Math.round(paidPct)}%)`}
                      />
                      {/* Owing Portion */}
                      <div
                        className="h-full bg-rose-500/90 transition-all duration-500"
                        style={{ width: `${owingPct}%` }}
                        title={`Owing: $${d.totalOwing} (${Math.round(owingPct)}%)`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-1">
                      <span>Rate: {d.collectionRate}% collected</span>
                      <span className={d.totalOwing === 0 ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                        {d.totalOwing === 0 ? 'Fully Paid' : `$${d.totalOwing} pending`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-850 flex items-center justify-between">
              <span>Standard tuition rate: $600 per enrolled course</span>
              <span className="font-mono text-emerald-400/90 font-medium">Billed: ${grandTotalBilled.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Cohort Detail Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {gradeData.map((d) => (
          <div
            key={d.gradeYear}
            className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-bold text-slate-100 text-xs">{d.shortLabel}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                Yr {d.gradeYear}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Students:</span>
                <span className="font-mono font-semibold text-slate-200">{d.studentCount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Courses:</span>
                <span className="font-mono font-semibold text-slate-200">{d.totalCourses}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Billed:</span>
                <span className="font-mono font-semibold text-cyan-300">${d.totalBilled.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Paid:</span>
                <span className="font-mono font-semibold text-emerald-400">${d.totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-850 pt-1">
                <span>Owing:</span>
                <span className={`font-mono font-bold ${d.totalOwing > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  ${d.totalOwing.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Collection</span>
                <span className="text-emerald-400 font-bold">{d.collectionRate}%</span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${d.collectionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
