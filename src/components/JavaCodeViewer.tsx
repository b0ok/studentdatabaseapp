import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  BookOpen,
  Layers,
  ChevronRight,
  Info,
  FileSpreadsheet
} from 'lucide-react';
import {
  STUDENT_JAVA_CODE,
  APP_JAVA_CODE,
  BATCH_APP_JAVA_CODE,
  ENTERPRISE_JAVA_CODE,
  JAVA_STEP_TUTORIALS,
  JavaStepTutorial
} from '../data/javaCode';

export const JavaCodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'app' | 'batchApp' | 'enterprise' | 'breakdown'>('student');
  const [copied, setCopied] = useState(false);
  const [selectedStepId, setSelectedStepId] = useState<string>('step-1');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getActiveCode = () => {
    if (activeTab === 'student') return STUDENT_JAVA_CODE;
    if (activeTab === 'app') return APP_JAVA_CODE;
    if (activeTab === 'batchApp') return BATCH_APP_JAVA_CODE;
    if (activeTab === 'enterprise') return ENTERPRISE_JAVA_CODE;
    return '';
  };

  const getActiveFilename = () => {
    if (activeTab === 'student') return 'Student.java';
    if (activeTab === 'app') return 'StudentDatabaseApp.java';
    if (activeTab === 'batchApp') return 'BatchStudentDatabaseApp.java';
    if (activeTab === 'enterprise') return 'EnterpriseStudentDatabaseApp.java';
    return '';
  };

  const selectedStep: JavaStepTutorial =
    JAVA_STEP_TUTORIALS.find((s) => s.id === selectedStepId) || JAVA_STEP_TUTORIALS[0];

  return (
    <div className="space-y-4">
      {/* Navigation tabs & action toolbar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('student')}
            className={`px-3 py-1.5 rounded-md font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Student.java</span>
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`px-3 py-1.5 rounded-md font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'app'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Console App</span>
          </button>
          <button
            onClick={() => setActiveTab('batchApp')}
            className={`px-3 py-1.5 rounded-md font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'batchApp'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Batch CSV Importer</span>
          </button>
          <button
            onClick={() => setActiveTab('enterprise')}
            className={`px-3 py-1.5 rounded-md font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'enterprise'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Enterprise SIS (Universities & Coursera)</span>
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 rounded-md font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture & Guide</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {activeTab !== 'breakdown' && (
            <>
              <button
                onClick={() => copyCode(getActiveCode())}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
              <button
                onClick={() => downloadFile(getActiveFilename(), getActiveCode())}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1.5 transition-colors border border-amber-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .java</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'student' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-semibold">src/studentdatabaseapp/Student.java</span>
            <span>Java 21 · Includes Interactive & Overloaded Batch Constructors</span>
          </div>
          <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 bg-slate-950 max-h-[650px] overflow-y-auto">
            <pre>
              <code>{STUDENT_JAVA_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'app' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-semibold">
              src/studentdatabaseapp/StudentDatabaseApp.java
            </span>
            <span>Interactive Scanner Loop · Type Students via Console</span>
          </div>
          <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 bg-slate-950 max-h-[650px] overflow-y-auto">
            <pre>
              <code>{APP_JAVA_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'batchApp' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-emerald-400 font-semibold">
              src/studentdatabaseapp/BatchStudentDatabaseApp.java
            </span>
            <span>Production Automated Onboarding · Reads CSV Application Forms into Student[] Array</span>
          </div>
          <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 bg-slate-950 max-h-[650px] overflow-y-auto">
            <pre>
              <code>{BATCH_APP_JAVA_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'enterprise' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-semibold">
              src/studentdatabaseapp/EnterpriseStudentDatabaseApp.java
            </span>
            <span>Enterprise SIS · HashMaps, Waitlists, GPA Engine, Financial Aid & Verifiable Certificates</span>
          </div>
          <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 bg-slate-950 max-h-[650px] overflow-y-auto">
            <pre>
              <code>{ENTERPRISE_JAVA_CODE}</code>
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Step Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
              All 7 Project Milestones
            </div>
            {JAVA_STEP_TUTORIALS.map((step) => {
              const isSelected = step.id === selectedStepId;
              return (
                <div
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400">
                      Step {step.stepNumber}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <h4 className="font-semibold text-slate-200 text-xs mt-2">{step.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{step.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Step Detail Content */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs font-mono font-bold">
                  Step {selectedStep.stepNumber} of 7
                </span>
                <span className="text-xs text-cyan-300 font-mono">
                  Concept: {selectedStep.keyConcept}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{selectedStep.title}</h3>
              <p className="text-xs text-slate-300 mt-1">{selectedStep.summary}</p>
            </div>

            {/* Code Snippet */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
                <span>Implementation Code:</span>
                <button
                  onClick={() => copyCode(selectedStep.codeSnippet)}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Snippet</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs sm:text-sm text-amber-200 overflow-x-auto leading-relaxed shadow-inner">
                <pre>
                  <code>{selectedStep.codeSnippet}</code>
                </pre>
              </div>
            </div>

            {/* Key Explanation Points */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Deep Dive & Java Mechanics</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                {selectedStep.explanation.map((exp, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {exp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
