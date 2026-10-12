# YMM P2: Java Student Database Application

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6%2B-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Repository Description:**  
> An Object-Oriented Java Student Database management system paired with an interactive Web Administrator workspace. Features full OOP `Student` class modeling, unique 5-digit ID generation (`Grade Level` + `static counter`), catalog course enrollment ($600/course), real-time tuition balance tracking, cohort batch onboarding (CSV), an in-browser `Scanner(System.in)` terminal simulator, JVM memory visualizer, and grade-level analytics.

---

## 📋 Scenario & Project Brief

You are a **Database Administrator** for a university and need to create an application to manage student enrollments, course selections, and tuition balances.

### Core Objectives
1. **Outline for `Student` Class**: Encapsulate private student state (`firstName`, `lastName`, `gradeYear`, `studentID`, `courses`, `tuitionBalance`).
2. **Student Constructor**: Prompt the user to enter each student's name and class year (1 = Freshman, 2 = Sophomore, 3 = Junior, 4 = Senior).
3. **Unique 5-Digit Student ID**: Generate a unique 5-digit identifier with the first digit representing class year and the remaining 4 digits from a static global counter initialized at `1000`.
4. **Course Enrollment Method**: Enroll students in courses from the catalog ($600 per course) until they signal completion (pressing `Q`).
5. **Pay Tuition Method**: Record tuition payments, deduct from balance, and display the remaining balance.
6. **Clean Output Display**: Provide formatted student status summaries (`name`, `id`, `courses enrolled`, `tuition balance`).
7. **Array of Objects**: Prompt the administrator for $N$ students, dynamically allocate a `Student[]` array, instantiate each student, and iterate through the cohort to display status.

---

## 🌟 Key Features

### 1. Pure Java OOP Architecture
* **`Student.java`**: Implements encapsulation, private instance variables, static fields (`costOfCourse = 600`, `id = 1000`), constructors, `enroll()`, `viewBalance()`, `payTuition()`, and `toString()`.
* **`StudentDatabaseApp.java`**: Implements dynamic array allocation (`Student[] students = new Student[numOfStudents]`), user loop iteration, and batch status reporting.
* **`BatchStudentDatabaseApp.java`**: Production-grade batch importer reading admitted student forms via CSV files using overloaded parameterized constructors.

### 2. Interactive Terminal Simulator
* Runs an in-browser Java virtual terminal simulating real-time `Scanner(System.in)` input and `System.out.print` output.
* Allows adding custom cohorts one-by-one with interactive prompts or auto-running preset test cases.
* Synchronizes newly added students directly with the administrator database.

### 3. Database Administration Dashboard
* **Global Search & Filter**: Real-time filtering by student name, 5-digit student ID, or class grade level.
* **Enrollment Management**: Enroll students into new courses on the fly with instant balance updates.
* **Tuition Payment Processing**: Payment modal with receipt generation and live balance deduction.
* **Batch Onboarding**: Bulk-import admitted student cohorts via CSV or download formatted enrollment templates.
* **Export Options**: One-click export to CSV, JSON, or Java array initialization code.

### 4. Enrollment & Financial Analytics Charts
* Visual breakdowns of student distribution across grade levels (Freshmen, Sophomores, Juniors, Seniors).
* Aggregate course enrollment metrics and total tuition revenue vs. outstanding balance tracking.

### 5. JVM Memory Architecture Visualizer
* Step-by-step interactive debugger illustrating memory allocation during runtime:
  * **Metaspace / Method Area**: Static fields (`Student.costOfCourse`, `Student.id`).
  * **Call Stack**: Stack frames for `main()`, `Student()`, and local reference variables.
  * **Heap Memory**: Object instances (`Student[0]`, `Student[1]`, String pools, and course lists).

### 6. Automated Unit & Specification Test Suite
* Built-in automated test suite verifying all 6 core project constraints:
  - Outline & Encapsulation
  - 5-Digit ID generation format
  - Course cost accumulation ($600 / course)
  - Payment balance deduction
  - Clean status output formatting
  - Array bounds & instantiation

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with metadata
├── metadata.json                # Applet configuration and permissions
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build and Tailwind configuration
├── README.md                    # Project documentation
│
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Main workspace shell with navigation & scenario banner
    ├── index.css                # Tailwind CSS styling and theme
    │
    ├── components/
    │   ├── Navbar.tsx           # Global header and tab navigation
    │   ├── DatabaseAdmin.tsx    # Database Administrator table, search, enrollment & payments
    │   ├── TerminalSimulator.tsx# Java console simulator with Scanner(System.in)
    │   ├── AnalyticsCharts.tsx  # Grade breakdown, enrollment & tuition visual charts
    │   ├── JavaCodeViewer.tsx   # Syntax-highlighted Java source & 8-step tutorial guide
    │   ├── MemoryVisualizer.tsx # JVM Stack, Heap, and Metaspace memory inspector
    │   └── TestSuite.tsx        # Automated verification of project constraints
    │
    ├── data/
    │   ├── courses.ts           # Course catalog definition ($600/course)
    │   ├── initialStudents.ts   # Sample student records
    │   └── javaCode.ts          # Full Java source files and step-by-step documentation
    │
    └── types/
        └── student.ts           # TypeScript interfaces for Student, Course, and Grades
```

---

## ☕ Pure Java Implementation

If you want to compile and run the Java program directly in your terminal:

### 1. Compile the Source Code
```bash
# Navigate to the directory containing the java files
javac -d . Student.java StudentDatabaseApp.java
```

### 2. Run the Application
```bash
java studentdatabaseapp.StudentDatabaseApp
```

### 3. Sample Terminal Execution
```text
How many new students will be added to the database? 2

Enter student first name: Marcus
Enter student last name: Vance
1 - Freshmen
2 - Sophmore
3 - Junior
4 - Senior
Enter student class level: 1
Student ID: 11001

Enter course to enroll (Q to quit): History 101
ENROLLED IN: History 101
Enter course to enroll (Q to quit): Mathematics 101
ENROLLED IN: Mathematics 101
Enter course to enroll (Q to quit): Q

Your balance is: $1200
Enter your payment: $600
Thank you for your payment of $600

----------------------------------------
Name: Marcus Vance
Grade Level: 1
Student ID: 11001
Courses Enrolled: History 101, Mathematics 101
Balance: $600
----------------------------------------
```

---

## 💻 Running the Web Application

### Prerequisites
* **Node.js** (v18.0.0 or later)
* **npm** or **bun** / **yarn**

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Production Build & Linting
```bash
# Type check and lint
npm run lint

# Build production bundle
npm run build
```

---

## 📚 Course Catalog & Pricing Reference

| Course Code | Course Name | Credits | Tuition Cost |
| :--- | :--- | :---: | :---: |
| **HIST101** | History 101: World Civilizations | 3 | $600.00 |
| **MATH101** | Mathematics 101: Calculus & Algebra | 4 | $600.00 |
| **ENG101** | English 101: Composition & Rhetoric | 3 | $600.00 |
| **CHEM101** | Chemistry 101: General Chemistry | 4 | $600.00 |
| **CS101** | Computer Science 101: Intro to Java | 4 | $600.00 |

*Cost per course is a constant `static int costOfCourse = 600` in `Student.java`.*

---

## 🎓 Academic Concepts Demonstrated

1. **Encapsulation & Access Modifiers**: Private fields with controlled public interfaces.
2. **Static vs. Instance Variables**: Static global counter for IDs and uniform course pricing vs. instance-specific student data.
3. **Array of Objects**: Allocating and traversing arrays of references (`Student[]`).
4. **Input Handling & Sentinel Loops**: `Scanner` input parsing with sentinel termination (`do { ... } while (!course.equals("Q"))`).
5. **Method Overloading**: Providing both interactive `Scanner` constructors and batch parameterized constructors.
6. **JVM Memory Mechanics**: Distinguishing reference pointers on the stack from object instances on the heap.

---

## 📄 License

This project is licensed under the Apache 2.0 License. See the LICENSE file for details.
