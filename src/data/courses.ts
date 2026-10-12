import { Course } from '../types/student';

export const COURSE_COST = 600;

export const AVAILABLE_COURSES: Course[] = [
  {
    id: 'HIST101',
    code: 'History 101',
    name: 'History 101: World Civilizations',
    department: 'Humanities',
    credits: 3,
    cost: COURSE_COST,
    description: 'Foundational study of ancient and modern civilizations, political structures, and cultural movements.',
    maxCapacity: 35,
    instructor: 'Dr. Evelyn Harris',
    prerequisites: []
  },
  {
    id: 'MATH101',
    code: 'Mathematics 101',
    name: 'Mathematics 101: Calculus & Algebra',
    department: 'Mathematics',
    credits: 4,
    cost: COURSE_COST,
    description: 'Differential calculus, limits, and algebraic structures applied to quantitative problem-solving.',
    maxCapacity: 30,
    instructor: 'Prof. Alan Vance',
    prerequisites: []
  },
  {
    id: 'ENGL101',
    code: 'English 101',
    name: 'English 101: Composition & Rhetoric',
    department: 'English',
    credits: 3,
    cost: COURSE_COST,
    description: 'Critical reading, essay composition, and persuasive argumentation in academic writing.',
    maxCapacity: 25,
    instructor: 'Dr. Sarah Sterling',
    prerequisites: []
  },
  {
    id: 'CHEM101',
    code: 'Chemistry 101',
    name: 'Chemistry 101: General Chemistry',
    department: 'Physical Sciences',
    credits: 4,
    cost: COURSE_COST,
    description: 'Atomic theory, chemical bonding, stoichiometry, and introductory laboratory techniques.',
    maxCapacity: 28,
    instructor: 'Prof. David Lin',
    prerequisites: []
  },
  {
    id: 'CS101',
    code: 'Computer Science 101',
    name: 'Computer Science 101: Intro to Programming',
    department: 'Computer Science',
    credits: 4,
    cost: COURSE_COST,
    description: 'Core object-oriented principles, algorithms, control flow, and data structures in Java.',
    maxCapacity: 40,
    instructor: 'Dr. James Gosling Jr.',
    prerequisites: []
  }
];
