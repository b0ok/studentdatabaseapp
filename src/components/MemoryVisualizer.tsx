import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Cpu,
  Database,
  Box,
  CheckCircle2
} from 'lucide-react';

interface ExecutionStep {
  stepIndex: number;
  label: string;
  codeLine: string;
  description: string;
  staticId: number;
  stackFrame: {
    method: string;
    vars: Record<string, string>;
  };
  heapObjects: Array<{
    address: string;
    type: string;
    fields: Record<string, string>;
  }>;
  arrayRef: {
    address: string;
    elements: string[];
  };
}

const EXECUTION_STEPS: ExecutionStep[] = [
  {
    stepIndex: 0,
    label: 'Class Loading (Static Pool)',
    codeLine: 'class Student { private static int costOfCourse = 600; private static int id = 1000; }',
    description:
      'JVM loads the Student class into the Metaspace. Static variables costOfCourse ($600) and id (1000) are allocated in the Class Area, shared across all future instances.',
    staticId: 1000,
    stackFrame: {
      method: 'main()',
      vars: { 'args': 'String[0]' }
    },
    heapObjects: [],
    arrayRef: {
      address: 'null',
      elements: []
    }
  },
  {
    stepIndex: 1,
    label: 'Array Allocation on Heap',
    codeLine: 'Student[] students = new Student[2];',
    description:
      'Stack variable `students` points to a newly allocated array on the Heap with size 2. Elements students[0] and students[1] initially hold `null`.',
    staticId: 1000,
    stackFrame: {
      method: 'main()',
      vars: {
        'numOfStudents': '2',
        'students': 'ref -> 0xARR01',
        'n': '0'
      }
    },
    heapObjects: [],
    arrayRef: {
      address: '0xARR01',
      elements: ['null', 'null']
    }
  },
  {
    stepIndex: 2,
    label: 'Student 1 Construction & ID Generation',
    codeLine: 'students[0] = new Student(); // Name: "John Doe", Grade: 1',
    description:
      'Student 1 constructor runs. Static `id` increments from 1000 to 1001. Unique 5-digit studentID is set to gradeYear + id = "11001". Reference stored at students[0].',
    staticId: 1001,
    stackFrame: {
      method: 'main()',
      vars: {
        'numOfStudents': '2',
        'students': 'ref -> 0xARR01',
        'n': '0'
      }
    },
    heapObjects: [
      {
        address: '0xSTU01',
        type: 'Student',
        fields: {
          firstName: '"John"',
          lastName: '"Doe"',
          gradeYear: '1',
          studentID: '"11001"',
          courses: '""',
          tuitionBalance: '$0'
        }
      }
    ],
    arrayRef: {
      address: '0xARR01',
      elements: ['ref -> 0xSTU01', 'null']
    }
  },
  {
    stepIndex: 3,
    label: 'Student 1 Enrollment & Tuition Balance',
    codeLine: 'students[0].enroll(); // Enrolls History 101 & Math 101 (2 courses)',
    description:
      'Enrollment method appends courses. Tuition balance increases by 2 * $600 = $1200.',
    staticId: 1001,
    stackFrame: {
      method: 'students[0].enroll()',
      vars: {
        'this': 'ref -> 0xSTU01',
        'course': '"Mathematics 101"'
      }
    },
    heapObjects: [
      {
        address: '0xSTU01',
        type: 'Student',
        fields: {
          firstName: '"John"',
          lastName: '"Doe"',
          gradeYear: '1',
          studentID: '"11001"',
          courses: '"History 101\\nMath 101"',
          tuitionBalance: '$1200'
        }
      }
    ],
    arrayRef: {
      address: '0xARR01',
      elements: ['ref -> 0xSTU01', 'null']
    }
  },
  {
    stepIndex: 4,
    label: 'Student 1 Payment',
    codeLine: 'students[0].payTuition(); // Payment: $500',
    description:
      'payTuition() subtracts $500 payment from $1200 balance. Remaining tuitionBalance becomes $700.',
    staticId: 1001,
    stackFrame: {
      method: 'students[0].payTuition()',
      vars: {
        'this': 'ref -> 0xSTU01',
        'payment': '$500'
      }
    },
    heapObjects: [
      {
        address: '0xSTU01',
        type: 'Student',
        fields: {
          firstName: '"John"',
          lastName: '"Doe"',
          gradeYear: '1',
          studentID: '"11001"',
          courses: '"History 101\\nMath 101"',
          tuitionBalance: '$700'
        }
      }
    ],
    arrayRef: {
      address: '0xARR01',
      elements: ['ref -> 0xSTU01', 'null']
    }
  },
  {
    stepIndex: 5,
    label: 'Student 2 Construction (Loop n = 1)',
    codeLine: 'students[1] = new Student(); // Name: "Sara Smith", Grade: 3',
    description:
      'Static `id` increments from 1001 to 1002! Because `id` is shared statically, Student 2 inherits the incremented counter: gradeYear (3) + 1002 = "31002".',
    staticId: 1002,
    stackFrame: {
      method: 'main()',
      vars: {
        'numOfStudents': '2',
        'students': 'ref -> 0xARR01',
        'n': '1'
      }
    },
    heapObjects: [
      {
        address: '0xSTU01',
        type: 'Student',
        fields: {
          firstName: '"John"',
          lastName: '"Doe"',
          gradeYear: '1',
          studentID: '"11001"',
          courses: '"History 101\\nMath 101"',
          tuitionBalance: '$700'
        }
      },
      {
        address: '0xSTU02',
        type: 'Student',
        fields: {
          firstName: '"Sara"',
          lastName: '"Smith"',
          gradeYear: '3',
          studentID: '"31002"',
          courses: '"Computer Science 101"',
          tuitionBalance: '$600'
        }
      }
    ],
    arrayRef: {
      address: '0xARR01',
      elements: ['ref -> 0xSTU01', 'ref -> 0xSTU02']
    }
  },
  {
    stepIndex: 6,
    label: 'Iteration & Display Status Loop',
    codeLine: 'for (int n = 0; n < numOfStudents; n++) { System.out.println(students[n].toString()); }',
    description:
      'The loop dereferences each array slot on the Heap (students[0] then students[1]) and invokes toString(). Both objects maintain completely independent state.',
    staticId: 1002,
    stackFrame: {
      method: 'students[n].toString()',
      vars: {
        'numOfStudents': '2',
        'n': '1',
        'current': 'ref -> 0xSTU02'
      }
    },
    heapObjects: [
      {
        address: '0xSTU01',
        type: 'Student',
        fields: {
          firstName: '"John"',
          lastName: '"Doe"',
          gradeYear: '1',
          studentID: '"11001"',
          courses: '"History 101\\nMath 101"',
          tuitionBalance: '$700'
        }
      },
      {
        address: '0xSTU02',
        type: 'Student',
        fields: {
          firstName: '"Sara"',
          lastName: '"Smith"',
          gradeYear: '3',
          studentID: '"31002"',
          courses: '"Computer Science 101"',
          tuitionBalance: '$600'
        }
      }
    ],
    arrayRef: {
      address: '0xARR01',
      elements: ['ref -> 0xSTU01', 'ref -> 0xSTU02']
    }
  }
];

export const MemoryVisualizer: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const step = EXECUTION_STEPS[currentStepIdx];

  const handleNext = () => {
    if (currentStepIdx < EXECUTION_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
  };

  return (
    <div className="space-y-5">
      {/* Visualizer Stepper Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-semibold">
              Step {step.stepIndex + 1} of {EXECUTION_STEPS.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">{step.label}</span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">{step.description}</p>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded-lg transition-colors border border-slate-700"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIdx === EXECUTION_STEPS.length - 1}
            className="px-4 py-1.5 text-xs bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Line Under Execution */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs flex items-center gap-3">
        <span className="text-amber-400 font-bold shrink-0">EXECUTING:</span>
        <code className="text-cyan-300 overflow-x-auto whitespace-pre">{step.codeLine}</code>
      </div>

      {/* 3-Section Memory Architecture: Metaspace, Stack, Heap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SECTION 1: METASPACE (STATIC POOL) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Metaspace / Class Area
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Contains class definition & static fields shared across all instances.
          </p>

          <div className="bg-slate-950 border border-purple-500/30 rounded-lg p-3 font-mono text-xs space-y-2">
            <div className="text-[11px] text-purple-300 font-semibold border-b border-purple-900/40 pb-1">
              Class: studentdatabaseapp.Student
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>static costOfCourse</span>
              <span className="text-emerald-400 font-bold">$600</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1">
                <span>static id</span>
                <span className="text-[10px] text-purple-400">(Counter)</span>
              </span>
              <span className="text-amber-400 font-bold text-sm bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                {step.staticId}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-amber-300 font-medium">Why static? </span>
            Every time a new student calls <code className="text-cyan-300">id++</code>, this single counter increments so the next student automatically receives the next sequence number!
          </div>
        </div>

        {/* SECTION 2: CALL STACK (LOCAL VARIABLES) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              JVM Call Stack
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Thread stack frames containing method calls and local reference pointers.
          </p>

          <div className="bg-slate-950 border border-cyan-500/30 rounded-lg p-3 font-mono text-xs space-y-2.5">
            <div className="text-[11px] text-cyan-300 font-semibold border-b border-cyan-900/40 pb-1 flex items-center justify-between">
              <span>Frame: {step.stackFrame.method}</span>
              <span className="text-[10px] text-slate-500">LIFO</span>
            </div>
            {Object.entries(step.stackFrame.vars).map(([name, val]) => (
              <div key={name} className="flex justify-between items-center text-slate-300">
                <span className="text-slate-400">{name}</span>
                <span className="text-cyan-300 font-semibold">{val}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-cyan-300 font-medium">Reference Variable: </span>
            <code className="text-cyan-300">Student[] students</code> does not hold student data itself; it holds a 64-bit reference address pointing into the Heap.
          </div>
        </div>

        {/* SECTION 3: HEAP MEMORY (OBJECTS & ARRAY) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Database className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              JVM Heap Space
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Dynamic memory where all objects and arrays reside.
          </p>

          {/* Array Container */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-lg p-3 font-mono text-xs space-y-2">
            <div className="text-[11px] text-amber-300 font-semibold border-b border-amber-900/40 pb-1 flex justify-between">
              <span>Array Object @ {step.arrayRef.address}</span>
              <span className="text-[10px] text-slate-500">Student[2]</span>
            </div>
            {step.arrayRef.elements.length === 0 ? (
              <div className="text-slate-500 text-xs italic py-1">Array not yet allocated</div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {step.arrayRef.elements.map((el, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-center"
                  >
                    <div className="text-[10px] text-slate-500 mb-0.5">Index [{i}]</div>
                    <div className="text-amber-400 font-bold">{el}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instantiated Student Instances */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {step.heapObjects.map((obj) => (
              <div
                key={obj.address}
                className="bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-xs space-y-1 shadow-sm"
              >
                <div className="flex justify-between items-center text-[11px] border-b border-slate-800 pb-1 text-amber-400 font-bold">
                  <span>Instance @ {obj.address}</span>
                  <span className="text-slate-400 font-normal">Student</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300 pt-1">
                  <div>ID: <span className="text-amber-300 font-bold">{obj.fields.studentID}</span></div>
                  <div>Year: <span className="text-slate-200">{obj.fields.gradeYear}</span></div>
                  <div className="col-span-2">
                    Name: <span className="text-slate-200">{obj.fields.firstName} {obj.fields.lastName}</span>
                  </div>
                  <div className="col-span-2">
                    Balance: <span className="text-rose-400 font-semibold">{obj.fields.tuitionBalance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
