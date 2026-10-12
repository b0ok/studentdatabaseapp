import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, Sparkles, Send, ArrowRight } from 'lucide-react';
import { StudentRecord, GradeLevel } from '../types/student';
import { AVAILABLE_COURSES, COURSE_COST } from '../data/courses';

interface TerminalSimulatorProps {
  onStudentsCreated?: (newStudents: StudentRecord[]) => void;
  nextIdCounter: number;
  setNextIdCounter: React.Dispatch<React.SetStateAction<number>>;
}

type SimulationStep =
  | 'IDLE'
  | 'ASK_NUM_STUDENTS'
  | 'ASK_FIRST_NAME'
  | 'ASK_LAST_NAME'
  | 'ASK_GRADE_YEAR'
  | 'ASK_COURSE'
  | 'ASK_PAYMENT'
  | 'FINISHED';

interface CurrentStudentDraft {
  firstName: string;
  lastName: string;
  gradeYear: GradeLevel;
  studentId: string;
  courses: string[];
  tuitionBalance: number;
  payment: number;
}

interface LogLine {
  id: string;
  text: string;
  type: 'prompt' | 'input' | 'system' | 'header' | 'success' | 'warn';
}

export const TerminalSimulator: React.FC<TerminalSimulatorProps> = ({
  onStudentsCreated,
  nextIdCounter,
  setNextIdCounter
}) => {
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: 'init-1',
      text: 'Java(TM) SE Runtime Environment (build 21.0.2+13)',
      type: 'system'
    },
    {
      id: 'init-2',
      text: 'Compiled StudentDatabaseApp.java & Student.java successfully.',
      type: 'system'
    },
    {
      id: 'init-3',
      text: 'Press "Start Interactive Console" or "Run Live Demo" below to begin.',
      type: 'system'
    }
  ]);

  const [step, setStep] = useState<SimulationStep>('IDLE');
  const [totalStudentsToCreate, setTotalStudentsToCreate] = useState<number>(0);
  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);
  const [currentDraft, setCurrentDraft] = useState<CurrentStudentDraft | null>(null);
  const [createdBatch, setCreatedBatch] = useState<StudentRecord[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (step !== 'IDLE' && step !== 'FINISHED' && !isAutoRunning) {
      inputRef.current?.focus();
    }
  }, [step, isAutoRunning]);

  const addLog = (text: string, type: LogLine['type']) => {
    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, text, type }]);
  };

  const startInteractive = () => {
    setLogs([
      { id: '1', text: '$ java studentdatabaseapp.StudentDatabaseApp', type: 'system' },
      { id: '2', text: 'Enter number of new students to enroll: ', type: 'prompt' }
    ]);
    setStep('ASK_NUM_STUDENTS');
    setTotalStudentsToCreate(0);
    setCurrentStudentIndex(0);
    setCreatedBatch([]);
    setCurrentDraft(null);
    setInputVal('');
  };

  const handleUserInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAutoRunning) return;

    const trimmed = inputVal.trim();
    processStepInput(trimmed);
    setInputVal('');
  };

  const processStepInput = (input: string) => {
    if (step === 'ASK_NUM_STUDENTS') {
      const count = parseInt(input, 10);
      if (isNaN(count) || count <= 0) {
        addLog(input, 'input');
        addLog('Invalid input. Please enter a positive integer (e.g., 1, 2, or 3): ', 'warn');
        return;
      }
      addLog(input, 'input');
      setTotalStudentsToCreate(count);
      setCurrentStudentIndex(0);
      initiateStudentPrompt(0, count);
    } else if (step === 'ASK_FIRST_NAME') {
      if (!input) {
        addLog('First name cannot be empty. Enter student first name: ', 'warn');
        return;
      }
      addLog(input, 'input');
      setCurrentDraft((prev) => prev ? { ...prev, firstName: input } : null);
      addLog('Enter student last name: ', 'prompt');
      setStep('ASK_LAST_NAME');
    } else if (step === 'ASK_LAST_NAME') {
      if (!input) {
        addLog('Last name cannot be empty. Enter student last name: ', 'warn');
        return;
      }
      addLog(input, 'input');
      setCurrentDraft((prev) => prev ? { ...prev, lastName: input } : null);
      addLog('1 - Freshmen\n2 - Sophmore\n3 - Junior\n4 - Senior\nEnter student class level: ', 'prompt');
      setStep('ASK_GRADE_YEAR');
    } else if (step === 'ASK_GRADE_YEAR') {
      const year = parseInt(input, 10);
      if (isNaN(year) || year < 1 || year > 4) {
        addLog(input, 'input');
        addLog('Invalid year. Enter 1 (Freshmen), 2 (Sophmore), 3 (Junior), or 4 (Senior): ', 'warn');
        return;
      }
      addLog(input, 'input');

      // Generate 5-digit unique ID
      const newCounter = nextIdCounter + 1;
      setNextIdCounter(newCounter);
      const studentId = `${year}${newCounter}`;

      setCurrentDraft((prev) => prev ? {
        ...prev,
        gradeYear: year as GradeLevel,
        studentId
      } : null);

      addLog(`[Student Object Instantiated] Generated Student ID: ${studentId}`, 'success');
      addLog('Enter course to enroll (Q to quit): ', 'prompt');
      setStep('ASK_COURSE');
    } else if (step === 'ASK_COURSE') {
      addLog(input, 'input');
      if (input.toUpperCase() === 'Q') {
        const balance = currentDraft?.tuitionBalance || 0;
        addLog(`TUITION BALANCE: $${balance}`, 'warn');
        addLog('Enter your payment: $', 'prompt');
        setStep('ASK_PAYMENT');
      } else {
        const matchingCourse = AVAILABLE_COURSES.find(
          c => c.name.toLowerCase().includes(input.toLowerCase()) || c.code.toLowerCase().includes(input.toLowerCase())
        );
        const courseName = matchingCourse ? matchingCourse.code : (input || 'Custom Course');

        setCurrentDraft((prev) => {
          if (!prev) return null;
          const updatedCourses = [...prev.courses, courseName];
          const updatedBalance = prev.tuitionBalance + COURSE_COST;
          return {
            ...prev,
            courses: updatedCourses,
            tuitionBalance: updatedBalance
          };
        });

        addLog(`ENROLLED IN: ${courseName} (+$${COURSE_COST})`, 'success');
        addLog('Enter course to enroll (Q to quit): ', 'prompt');
      }
    } else if (step === 'ASK_PAYMENT') {
      const paymentAmount = parseInt(input, 10);
      const payment = isNaN(paymentAmount) || paymentAmount < 0 ? 0 : paymentAmount;
      addLog(`$${payment}`, 'input');

      if (!currentDraft) return;

      const remainingBalance = Math.max(0, currentDraft.tuitionBalance - payment);
      addLog(`Thank you for your payment of $${payment}`, 'system');
      addLog(`BALANCE: $${remainingBalance}`, 'warn');

      const completedRecord: StudentRecord = {
        id: currentDraft.studentId,
        firstName: currentDraft.firstName,
        lastName: currentDraft.lastName,
        gradeYear: currentDraft.gradeYear,
        courses: currentDraft.courses,
        tuitionBalance: remainingBalance,
        totalPaid: payment,
        enrolledAt: new Date().toISOString().split('T')[0]
      };

      const updatedBatch = [...createdBatch, completedRecord];
      setCreatedBatch(updatedBatch);

      const nextIndex = currentStudentIndex + 1;
      if (nextIndex < totalStudentsToCreate) {
        setCurrentStudentIndex(nextIndex);
        initiateStudentPrompt(nextIndex, totalStudentsToCreate);
      } else {
        // All students finished! Display final status loop
        finishSimulation(updatedBatch);
      }
    }
  };

  const initiateStudentPrompt = (index: number, total: number) => {
    addLog(`\n--- Enrolling Student ${index + 1} of ${total} ---`, 'header');
    setCurrentDraft({
      firstName: '',
      lastName: '',
      gradeYear: 1,
      studentId: '',
      courses: [],
      tuitionBalance: 0,
      payment: 0
    });
    addLog('Enter student first name: ', 'prompt');
    setStep('ASK_FIRST_NAME');
  };

  const finishSimulation = (batch: StudentRecord[]) => {
    setStep('FINISHED');
    addLog('\n=================================', 'header');
    addLog('       STUDENT DATABASE ROSTER   ', 'header');
    addLog('=================================', 'header');

    batch.forEach((student) => {
      const formattedCourses = student.courses.length > 0
        ? student.courses.map((c) => `\n  ${c}`).join('')
        : '\n  None';

      const statusOutput = `Name: ${student.firstName} ${student.lastName}
Grade Level: ${student.gradeYear}
Student ID: ${student.id}
Courses Enrolled:${formattedCourses}
Balance: $${student.tuitionBalance}`;

      addLog(statusOutput, 'system');
      addLog('---------------------------------', 'header');
    });

    addLog(`Process finished with exit code 0. Created ${batch.length} student objects in Student[] array.`, 'success');

    if (onStudentsCreated && batch.length > 0) {
      onStudentsCreated(batch);
    }
  };

  const runLiveDemo = async () => {
    if (isAutoRunning) return;
    setIsAutoRunning(true);
    setLogs([
      { id: 'd-1', text: '$ java studentdatabaseapp.StudentDatabaseApp', type: 'system' }
    ]);

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const demoStudents = [
      {
        firstName: 'Alice',
        lastName: 'Wong',
        gradeYear: 1 as GradeLevel,
        courses: ['Computer Science 101', 'Mathematics 101'],
        payment: 600
      },
      {
        firstName: 'Jordan',
        lastName: 'Miller',
        gradeYear: 3 as GradeLevel,
        courses: ['Chemistry 101', 'History 101', 'English 101'],
        payment: 1000
      }
    ];

    await delay(300);
    setLogs((prev) => [...prev, { id: 'd-2', text: 'Enter number of new students to enroll: ', type: 'prompt' }]);
    await delay(450);
    setLogs((prev) => [...prev, { id: 'd-3', text: '2', type: 'input' }]);

    const demoBatch: StudentRecord[] = [];
    let curCounter = nextIdCounter;

    for (let i = 0; i < demoStudents.length; i++) {
      const student = demoStudents[i];
      await delay(400);
      setLogs((prev) => [
        ...prev,
        { id: `d-head-${i}`, text: `\n--- Enrolling Student ${i + 1} of 2 ---`, type: 'header' }
      ]);

      // First name
      await delay(300);
      setLogs((prev) => [...prev, { id: `d-fn-${i}`, text: 'Enter student first name: ', type: 'prompt' }]);
      await delay(400);
      setLogs((prev) => [...prev, { id: `d-fn-val-${i}`, text: student.firstName, type: 'input' }]);

      // Last name
      await delay(300);
      setLogs((prev) => [...prev, { id: `d-ln-${i}`, text: 'Enter student last name: ', type: 'prompt' }]);
      await delay(400);
      setLogs((prev) => [...prev, { id: `d-ln-val-${i}`, text: student.lastName, type: 'input' }]);

      // Grade year
      await delay(300);
      setLogs((prev) => [
        ...prev,
        { id: `d-yr-${i}`, text: '1 - Freshmen\n2 - Sophmore\n3 - Junior\n4 - Senior\nEnter student class level: ', type: 'prompt' }
      ]);
      await delay(450);
      setLogs((prev) => [...prev, { id: `d-yr-val-${i}`, text: `${student.gradeYear}`, type: 'input' }]);

      curCounter++;
      const studentId = `${student.gradeYear}${curCounter}`;
      setLogs((prev) => [
        ...prev,
        { id: `d-id-${i}`, text: `[Student Object Instantiated] Generated Student ID: ${studentId}`, type: 'success' }
      ]);

      // Courses
      let tuition = 0;
      for (const course of student.courses) {
        await delay(350);
        setLogs((prev) => [...prev, { id: `d-c-p-${i}-${course}`, text: 'Enter course to enroll (Q to quit): ', type: 'prompt' }]);
        await delay(450);
        setLogs((prev) => [...prev, { id: `d-c-v-${i}-${course}`, text: course, type: 'input' }]);
        tuition += COURSE_COST;
        setLogs((prev) => [
          ...prev,
          { id: `d-c-ok-${i}-${course}`, text: `ENROLLED IN: ${course} (+$${COURSE_COST})`, type: 'success' }
        ]);
      }

      // Quit course entry
      await delay(300);
      setLogs((prev) => [...prev, { id: `d-q-${i}`, text: 'Enter course to enroll (Q to quit): ', type: 'prompt' }]);
      await delay(350);
      setLogs((prev) => [...prev, { id: `d-q-val-${i}`, text: 'Q', type: 'input' }]);
      setLogs((prev) => [...prev, { id: `d-bal-${i}`, text: `TUITION BALANCE: $${tuition}`, type: 'warn' }]);

      // Pay tuition
      await delay(350);
      setLogs((prev) => [...prev, { id: `d-pay-p-${i}`, text: 'Enter your payment: $', type: 'prompt' }]);
      await delay(450);
      setLogs((prev) => [...prev, { id: `d-pay-v-${i}`, text: `${student.payment}`, type: 'input' }]);

      const rem = tuition - student.payment;
      setLogs((prev) => [
        ...prev,
        { id: `d-pay-ok-${i}`, text: `Thank you for your payment of $${student.payment}`, type: 'system' },
        { id: `d-pay-rem-${i}`, text: `BALANCE: $${rem}`, type: 'warn' }
      ]);

      demoBatch.push({
        id: studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        gradeYear: student.gradeYear,
        courses: student.courses,
        tuitionBalance: rem,
        totalPaid: student.payment,
        enrolledAt: new Date().toISOString().split('T')[0]
      });
    }

    setNextIdCounter(curCounter);

    // Final roster output
    await delay(500);
    setLogs((prev) => [
      ...prev,
      { id: 'd-fin-1', text: '\n=================================', type: 'header' },
      { id: 'd-fin-2', text: '       STUDENT DATABASE ROSTER   ', type: 'header' },
      { id: 'd-fin-3', text: '=================================', type: 'header' }
    ]);

    for (const record of demoBatch) {
      await delay(300);
      const coursesStr = record.courses.map((c) => `\n  ${c}`).join('');
      const statusText = `Name: ${record.firstName} ${record.lastName}
Grade Level: ${record.gradeYear}
Student ID: ${record.id}
Courses Enrolled:${coursesStr}
Balance: $${record.tuitionBalance}`;

      setLogs((prev) => [
        ...prev,
        { id: `d-card-${record.id}`, text: statusText, type: 'system' },
        { id: `d-sep-${record.id}`, text: '---------------------------------', type: 'header' }
      ]);
    }

    await delay(300);
    setLogs((prev) => [
      ...prev,
      { id: 'd-done', text: 'Process finished with exit code 0. Array Student[2] populated and displayed.', type: 'success' }
    ]);

    setStep('FINISHED');
    setIsAutoRunning(false);

    if (onStudentsCreated) {
      onStudentsCreated(demoBatch);
    }
  };

  const copyLogs = () => {
    const text = logs.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickCourseSelect = (courseName: string) => {
    if (step === 'ASK_COURSE') {
      processStepInput(courseName);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Terminal: java StudentDatabaseApp</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {step === 'IDLE' ? (
            <>
              <button
                onClick={startInteractive}
                className="px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                Start Interactive Console
              </button>
              <button
                onClick={runLiveDemo}
                disabled={isAutoRunning}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg flex items-center gap-1.5 transition-colors border border-amber-500/30"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                Run Live Demo
              </button>
            </>
          ) : (
            <button
              onClick={startInteractive}
              disabled={isAutoRunning}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              Restart App
            </button>
          )}

          <button
            onClick={copyLogs}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Copy Console Output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-4 font-mono text-xs sm:text-sm overflow-y-auto min-h-[380px] max-h-[520px] bg-slate-950 text-slate-200 space-y-1">
        {logs.map((log) => {
          let style = 'text-slate-300';
          if (log.type === 'prompt') style = 'text-amber-400 font-semibold';
          if (log.type === 'input') style = 'text-cyan-300 font-medium';
          if (log.type === 'system') style = 'text-slate-400';
          if (log.type === 'header') style = 'text-amber-300 font-bold';
          if (log.type === 'success') style = 'text-emerald-400';
          if (log.type === 'warn') style = 'text-rose-400 font-semibold';

          return (
            <div key={log.id} className={`whitespace-pre-wrap leading-relaxed ${style}`}>
              {log.text}
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>

      {/* Interactive Quick-Pick Bar when Prompting Courses or Year */}
      {step === 'ASK_COURSE' && !isAutoRunning && (
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Quick Add:</span>
          {AVAILABLE_COURSES.map((course) => {
            const isAlreadyAdded = currentDraft?.courses.includes(course.code);
            return (
              <button
                key={course.id}
                onClick={() => handleQuickCourseSelect(course.code)}
                disabled={isAlreadyAdded}
                className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1 ${
                  isAlreadyAdded
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                    : 'bg-slate-800 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 border border-amber-500/30'
                }`}
              >
                <span>{course.code}</span>
                <span className="text-[10px] opacity-75">($600)</span>
              </button>
            );
          })}
          <button
            onClick={() => handleQuickCourseSelect('Q')}
            className="px-2.5 py-1 rounded text-xs bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 border border-rose-800/60 font-semibold ml-auto"
          >
            Done Enrolling (Q)
          </button>
        </div>
      )}

      {step === 'ASK_GRADE_YEAR' && !isAutoRunning && (
        <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Select Year:</span>
          {[
            { val: '1', label: '1 - Freshmen' },
            { val: '2', label: '2 - Sophmore' },
            { val: '3', label: '3 - Junior' },
            { val: '4', label: '4 - Senior' }
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => processStepInput(item.val)}
              className="px-2.5 py-1 rounded text-xs bg-slate-800 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="bg-slate-900 border-t border-slate-800 p-3">
        {step !== 'IDLE' && step !== 'FINISHED' ? (
          <form onSubmit={handleUserInputSubmit} className="flex items-center gap-2">
            <span className="text-amber-400 font-mono text-sm pl-1 font-bold">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              disabled={isAutoRunning}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                step === 'ASK_NUM_STUDENTS'
                  ? 'e.g. 2'
                  : step === 'ASK_FIRST_NAME'
                  ? 'Enter first name...'
                  : step === 'ASK_LAST_NAME'
                  ? 'Enter last name...'
                  : step === 'ASK_GRADE_YEAR'
                  ? 'Enter 1, 2, 3, or 4...'
                  : step === 'ASK_COURSE'
                  ? 'e.g. Computer Science 101 or Q to quit'
                  : step === 'ASK_PAYMENT'
                  ? 'e.g. 600'
                  : 'Enter command...'
              }
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-amber-200 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={isAutoRunning}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 py-1 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {step === 'FINISHED'
                  ? 'Program execution completed. Results displayed above.'
                  : 'Ready. Run the interactive console or click "Run Live Demo".'}
              </span>
            </div>
            {step === 'FINISHED' && (
              <button
                onClick={startInteractive}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
              >
                <span>Run Again</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
