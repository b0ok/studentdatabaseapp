import React from 'react';
import {
  Terminal,
  Database,
  Code2,
  Cpu,
  CheckCircle,
  GraduationCap,
  BarChart3
} from 'lucide-react';

export type ActiveTab = 'terminal' | 'database' | 'analytics' | 'code' | 'memory' | 'tests';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  studentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  studentCount
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  YMM P2
                </span>
                <span className="text-slate-600 text-xs">/</span>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Student Database Application
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Java OOP Architecture · Unique 5-Digit ID · Scanner Input · Tuition Management
              </p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Admin</span>
              <span className="font-mono text-[10px] opacity-75 ml-0.5">({studentCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics Charts</span>
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'terminal'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Terminal Console</span>
              <span className="md:hidden">CLI</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'code'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Java Code</span>
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'memory'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Memory Visualizer</span>
              <span className="sm:hidden">JVM</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'tests'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Test Suite</span>
              <span className="sm:hidden">Tests</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
