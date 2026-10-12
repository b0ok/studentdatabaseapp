import { useState } from 'react';
import {
  Navbar,
  ActiveTab
} from './components/Navbar';
import { TerminalSimulator } from './components/TerminalSimulator';
import { DatabaseAdmin } from './components/DatabaseAdmin';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { TestSuite } from './components/TestSuite';
import { INITIAL_STUDENTS } from './data/initialStudents';
import { StudentRecord } from './types/student';
import {
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Terminal as TerminalIcon,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('database');
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [nextIdCounter, setNextIdCounter] = useState<number>(1004); // Started after initial sample records 1001-1004
  const [showScenarioDetails, setShowScenarioDetails] = useState(true);

  // Sync students created in Terminal Simulator to Database
  const handleStudentsCreatedFromTerminal = (newStudents: StudentRecord[]) => {
    setStudents((prev) => {
      // Filter out duplicates by ID
      const existingIds = new Set(prev.map((s) => s.id));
      const filteredNew = newStudents.filter((s) => !existingIds.has(s.id));
      return [...filteredNew, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentCount={students.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Project Scenario & Requirements Card */}
        {showScenarioDetails && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    YMM P2: University Database Administrator
                  </span>
                  <span className="text-slate-500 text-xs">·</span>
                  <span className="text-xs text-slate-400">Java OOP Specification</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Scenario:</span> You are a Database Administrator for a university and need to create an application to manage student enrollments and tuition balances.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Prompts number of new students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>5-digit ID (Grade level + static ID)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>5 catalog courses ($600 / course)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Student[] array of objects</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowScenarioDetails(false)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content Display */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-amber-400" />
                <span>
                  Interactive CLI execution simulator for <code className="text-amber-300 font-mono">StudentDatabaseApp.java</code>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('code')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>View Java Code</span>
                </button>
                <span className="text-slate-700">·</span>
                <button
                  onClick={() => setActiveTab('database')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Database Roster ({students.length})</span>
                </button>
              </div>
            </div>

            <TerminalSimulator
              onStudentsCreated={handleStudentsCreatedFromTerminal}
              nextIdCounter={nextIdCounter}
              setNextIdCounter={setNextIdCounter}
            />
          </div>
        )}

        {activeTab === 'database' && (
          <DatabaseAdmin
            students={students}
            setStudents={setStudents}
            nextIdCounter={nextIdCounter}
            setNextIdCounter={setNextIdCounter}
            onOpenTerminal={() => setActiveTab('terminal')}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">
                Real-time Cohort Breakdown · {students.length} Student Objects
              </span>
              <button
                onClick={() => setActiveTab('database')}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                Go to Database Roster &rarr;
              </button>
            </div>
            <AnalyticsCharts
              students={students}
              onSelectGradeFilter={() => {
                setActiveTab('database');
              }}
            />
          </div>
        )}

        {activeTab === 'code' && <JavaCodeViewer />}

        {activeTab === 'memory' && <MemoryVisualizer />}

        {activeTab === 'tests' && <TestSuite />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-amber-400 font-semibold">Java 21 OOP Project</span>
            <span>·</span>
            <span>Classes & Objects, Encapsulation, Static Members, System.in Scanner</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('terminal')} className="hover:text-amber-300 transition-colors">
              Terminal
            </button>
            <button onClick={() => setActiveTab('database')} className="hover:text-amber-300 transition-colors">
              Database
            </button>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-amber-300 transition-colors">
              Analytics
            </button>
            <button onClick={() => setActiveTab('code')} className="hover:text-amber-300 transition-colors">
              Java Code
            </button>
            <button onClick={() => setActiveTab('memory')} className="hover:text-amber-300 transition-colors">
              JVM Memory
            </button>
            <button onClick={() => setActiveTab('tests')} className="hover:text-amber-300 transition-colors">
              Tests
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
