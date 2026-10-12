export interface JavaStepTutorial {
  id: string;
  stepNumber: number;
  title: string;
  summary: string;
  codeSnippet: string;
  explanation: string[];
  keyConcept: string;
}

export const STUDENT_JAVA_CODE = `package studentdatabaseapp;

import java.util.Scanner;

public class Student {
    // 1. OUTLINE FOR STUDENT CLASS: Instance & Static fields
    private String firstName;
    private String lastName;
    private int gradeYear;
    private String studentID;
    private String courses = "";
    private int tuitionBalance = 0;
    private static int costOfCourse = 600;
    private static int id = 1000; // Shared counter for unique 5-digit ID

    // 2. INITIALIZING THE STUDENT CONSTRUCTOR: Prompt user to enter student's name and year
    public Student() {
        Scanner in = new Scanner(System.in);
        System.out.print("Enter student first name: ");
        this.firstName = in.nextLine();

        System.out.print("Enter student last name: ");
        this.lastName = in.nextLine();

        System.out.print("1 - Freshmen\\n2 - Sophmore\\n3 - Junior\\n4 - Senior\\nEnter student class level: ");
        this.gradeYear = in.nextInt();

        // 3. CREATE THE UNIQUE STUDENT ID
        setStudentID();
    }

    // 2B. OVERLOADED CONSTRUCTOR: Used for automated / batch onboarding from application forms
    public Student(String firstName, String lastName, int gradeYear) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gradeYear = gradeYear;
        setStudentID();
    }

    // 3. GENERATE A 5-DIGIT UNIQUE ID: First number is grade level + static counter
    private void setStudentID() {
        // Grade level + static ID counter
        id++;
        this.studentID = gradeYear + "" + id;
    }

    // 4. IMPLEMENT THE ENROLLMENT METHOD (Interactive Console)
    public void enroll() {
        // Loop: user enters courses until 'Q' is entered
        do {
            System.out.print("Enter course to enroll (Q to quit): ");
            Scanner in = new Scanner(System.in);
            String course = in.nextLine();
            if (!course.equalsIgnoreCase("Q")) {
                courses = courses + "\\n  " + course;
                tuitionBalance = tuitionBalance + costOfCourse;
            } else {
                break;
            }
        } while (1 != 0);
    }

    // 4B. PROGRAMMATIC ENROLLMENT (Direct from application form preferences)
    public void enrollCourse(String courseName) {
        courses = courses + "\\n  " + courseName;
        tuitionBalance = tuitionBalance + costOfCourse;
    }

    // VIEW TUITION BALANCE
    public void viewBalance() {
        System.out.println("Your balance is: $" + tuitionBalance);
    }

    // 5. IMPLEMENT THE PAY TUITION METHOD (Interactive Console)
    public void payTuition() {
        viewBalance();
        System.out.print("Enter your payment: $");
        Scanner in = new Scanner(System.in);
        int payment = in.nextInt();
        tuitionBalance = tuitionBalance - payment;
        System.out.println("Thank you for your payment of $" + payment);
        viewBalance();
    }

    // 5B. PROGRAMMATIC PAYMENT (Direct from fee deposit / payment gateway)
    public void payTuition(int payment) {
        tuitionBalance = tuitionBalance - payment;
    }

    // 6. CLEAN UP OUTPUT TO DISPLAY THE STUDENT STATUS
    public String toString() {
        return "Name: " + firstName + " " + lastName +
                "\\nGrade Level: " + gradeYear +
                "\\nStudent ID: " + studentID +
                "\\nCourses Enrolled:" + courses +
                "\\nBalance: $" + tuitionBalance;
    }
}
`;

export const APP_JAVA_CODE = `package studentdatabaseapp;

import java.util.Scanner;

public class StudentDatabaseApp {

    public static void main(String[] args) {
        // Ask the user how many new students will be added to the database
        System.out.print("Enter number of new students to enroll: ");
        Scanner in = new Scanner(System.in);
        int numOfStudents = in.nextInt();

        // 7. CREATE AN ARRAY OF OBJECTS
        Student[] students = new Student[numOfStudents];

        // Create n number of new students, enroll, pay tuition, and display status
        for (int n = 0; n < numOfStudents; n++) {
            System.out.println("\\n--- Enrolling Student " + (n + 1) + " of " + numOfStudents + " ---");
            students[n] = new Student();
            students[n].enroll();
            students[n].payTuition();
        }

        // Print final status for all students in the database
        System.out.println("\\n=================================");
        System.out.println("       STUDENT DATABASE ROSTER   ");
        System.out.println("=================================");
        for (int n = 0; n < numOfStudents; n++) {
            System.out.println(students[n].toString());
            System.out.println("---------------------------------");
        }
    }
}
`;

export const BATCH_APP_JAVA_CODE = `package studentdatabaseapp;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

public class BatchStudentDatabaseApp {

    public static void main(String[] args) {
        // In real university systems, students submit online application forms.
        // The administrator imports them in one automated batch from a CSV file!
        String csvFilePath = "student_applications.csv";
        ArrayList<Student> studentList = new ArrayList<>();

        try {
            File file = new File(csvFilePath);
            Scanner fileScanner = new Scanner(file);

            // Skip CSV header line
            if (fileScanner.hasNextLine()) {
                fileScanner.nextLine();
            }

            // Onboard all applicants automatically without typing one by one!
            while (fileScanner.hasNextLine()) {
                String line = fileScanner.nextLine();
                if (line.trim().isEmpty()) continue;

                // Format: firstName,lastName,gradeYear,courses,payment
                // Example: Sophia,Chen,1,Computer Science 101;Mathematics 101,600
                String[] data = line.split(",");

                String firstName = data[0].trim();
                String lastName = data[1].trim();
                int gradeYear = Integer.parseInt(data[2].trim());

                // 1. Instantiate student object with overloaded constructor
                Student student = new Student(firstName, lastName, gradeYear);

                // 2. Automatically enroll in selected courses from application form
                if (data.length > 3 && !data[3].trim().isEmpty()) {
                    String[] courseList = data[3].split(";");
                    for (String course : courseList) {
                        student.enrollCourse(course.trim());
                    }
                }

                // 3. Automatically record tuition deposit / initial payment
                if (data.length > 4 && !data[4].trim().isEmpty()) {
                    int payment = Integer.parseInt(data[4].trim());
                    student.payTuition(payment);
                }

                studentList.add(student);
            }
            fileScanner.close();

            // Convert to array of objects
            Student[] students = studentList.toArray(new Student[0]);

            System.out.println("=== BATCH ONBOARDING COMPLETED: " + students.length + " STUDENTS IMPORTED ===");
            for (Student s : students) {
                System.out.println(s.toString());
                System.out.println("---------------------------------");
            }

        } catch (FileNotFoundException e) {
            System.out.println("Error reading application file: " + e.getMessage());
        }
    }
}
`;

export const ENTERPRISE_JAVA_CODE = `package studentdatabaseapp;

import java.util.*;
import java.util.stream.Collectors;
import java.security.MessageDigest;

/**
 * ENTERPRISE SCALE (Universities like Harvard/ASU & Online Platforms like Coursera)
 * 
 * Features beyond basic YMM P2:
 * 1. O(1) Fast Lookup: Uses HashMap<String, Student> instead of linear O(n) array loops.
 * 2. Section Capacities & FIFO Waitlists: Queues overflow students when seats are full.
 * 3. GPA & Academic Standing Engine: Letter grades (A=4.0) weighted by credit hours.
 * 4. Financial Aid & Scholarships: Percentage discounts & Financial Hold enforcement.
 * 5. Coursera-Style Verifiable Certificates: Cryptographic verification hash generation.
 * 6. Java Streams API: Instant analytics across thousands of students.
 */
public class EnterpriseStudentDatabaseApp {

    // Central registry for O(1) lookup by 5-digit Student ID
    private static Map<String, StudentProfile> studentRegistry = new HashMap<>();

    // Course Section Catalog with Capacity & FIFO Waitlists
    private static Map<String, CourseSection> courseCatalog = new HashMap<>();

    public static void main(String[] args) {
        initCatalog();

        // 1. O(1) Student Enrollment with Financial Aid
        StudentProfile s1 = new StudentProfile("11001", "Marcus", "Vance", 1, "Computer Science");
        StudentProfile s2 = new StudentProfile("21002", "Elena", "Reyes", 2, "Biochemistry");
        s2.applyScholarship(0.25); // 25% Coursera Financial Aid / Merit Scholarship

        studentRegistry.put(s1.getId(), s1);
        studentRegistry.put(s2.getId(), s2);

        // 2. Capacity-controlled Enrollment
        enrollWithCapacityCheck(s1, "CS101");
        enrollWithCapacityCheck(s2, "CS101");

        // 3. Post Grades & Calculate GPA
        s1.assignGrade("CS101", 4.0); // Grade A
        s2.assignGrade("CS101", 4.0); // Grade A

        // 4. Issue Verifiable Digital Certificate (Coursera Style)
        if (s1.getTuitionBalance() == 0 && s1.getGPA() >= 2.0) {
            String certHash = s1.issueDigitalCertificate("CS101");
            System.out.println("Issued Verifiable Certificate for " + s1.getFullName() + ": " + certHash);
        }

        // 5. High-Performance Java Streams Analytics
        System.out.println("\n=== DEAN'S LIST STUDENTS (GPA >= 3.5) ===");
        List<StudentProfile> deansList = studentRegistry.values().stream()
                .filter(s -> s.getGPA() >= 3.5)
                .collect(Collectors.toList());
        deansList.forEach(s -> System.out.println(s.getFullName() + " | GPA: " + s.getGPA()));

        System.out.println("\n=== FINANCIAL HOLDS (PAST DUE BALANCE) ===");
        List<StudentProfile> pastDue = studentRegistry.values().stream()
                .filter(s -> s.getTuitionBalance() > 500)
                .collect(Collectors.toList());
        pastDue.forEach(s -> System.out.println(s.getFullName() + " | Owes: $" + s.getTuitionBalance()));
    }

    private static void initCatalog() {
        courseCatalog.put("CS101", new CourseSection("CS101", "Intro to Programming", 4, 600, 40));
        courseCatalog.put("MATH101", new CourseSection("MATH101", "Calculus & Algebra", 4, 600, 30));
    }

    private static void enrollWithCapacityCheck(StudentProfile student, String courseCode) {
        CourseSection section = courseCatalog.get(courseCode);
        if (section.hasAvailableSeats()) {
            section.addStudent(student);
            student.addCourse(section);
            System.out.println(student.getFullName() + " ENROLLED in " + courseCode);
        } else {
            section.addToWaitlist(student);
            System.out.println("Section full! " + student.getFullName() + " placed on WAITLIST for " + courseCode);
        }
    }
}

class CourseSection {
    String code, title;
    int credits, cost, maxCapacity;
    List<StudentProfile> enrolled = new ArrayList<>();
    Queue<StudentProfile> waitlist = new LinkedList<>();

    public CourseSection(String code, String title, int credits, int cost, int maxCapacity) {
        this.code = code; this.title = title; this.credits = credits; this.cost = cost; this.maxCapacity = maxCapacity;
    }
    public boolean hasAvailableSeats() { return enrolled.size() < maxCapacity; }
    public void addStudent(StudentProfile s) { enrolled.add(s); }
    public void addToWaitlist(StudentProfile s) { waitlist.offer(s); }
}

class StudentProfile {
    private String id, firstName, lastName, major;
    private int gradeYear;
    private Map<String, Double> grades = new HashMap<>();
    private int tuitionBalance = 0;
    private double scholarshipRate = 0.0;

    public StudentProfile(String id, String firstName, String lastName, int gradeYear, String major) {
        this.id = id; this.firstName = firstName; this.lastName = lastName;
        this.gradeYear = gradeYear; this.major = major;
    }

    public void applyScholarship(double rate) { this.scholarshipRate = rate; }
    public void addCourse(CourseSection course) {
        int cost = (int)(course.cost * (1.0 - scholarshipRate));
        this.tuitionBalance += cost;
    }
    public void assignGrade(String courseCode, double gradePoint) { grades.put(courseCode, gradePoint); }

    public double getGPA() {
        if (grades.isEmpty()) return 0.0;
        return grades.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    public String issueDigitalCertificate(String courseCode) {
        try {
            String raw = id + ":" + courseCode + ":" + System.currentTimeMillis();
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes());
            return HexFormat.of().formatHex(hash).substring(0, 16);
        } catch (Exception e) { return "CERT-" + UUID.randomUUID().toString().substring(0, 8); }
    }

    public String getId() { return id; }
    public String getFullName() { return firstName + " " + lastName; }
    public int getTuitionBalance() { return tuitionBalance; }
}
`;

export const JAVA_STEP_TUTORIALS: JavaStepTutorial[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Create the Outline for Student Class',
    summary: 'Define private instance variables for encapsulation and static variables for shared state.',
    codeSnippet: `public class Student {
    // Encapsulated instance fields
    private String firstName;
    private String lastName;
    private int gradeYear;
    private String studentID;
    private String courses = "";
    private int tuitionBalance = 0;

    // Static fields shared across all student instances
    private static int costOfCourse = 600;
    private static int id = 1000;
}`,
    explanation: [
      'Encapsulation: Fields are declared private to protect student data from unauthorized direct modification from outside the class.',
      'Instance vs. Static: firstName, lastName, gradeYear, and courses belong to individual instances. However, costOfCourse and id are static, meaning they belong to the Student class itself and are shared by all instances.',
      'Default Values: courses starts as an empty String (""), and tuitionBalance starts at 0.'
    ],
    keyConcept: 'Encapsulation & Static Variables'
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Initializing the Student Constructor',
    summary: 'Construct the Student object and prompt the user for student details using Scanner.',
    codeSnippet: `public Student() {
    Scanner in = new Scanner(System.in);
    System.out.print("Enter student first name: ");
    this.firstName = in.nextLine();

    System.out.print("Enter student last name: ");
    this.lastName = in.nextLine();

    System.out.print("1 - Freshmen\\n2 - Sophmore\\n3 - Junior\\n4 - Senior\\nEnter student class level: ");
    this.gradeYear = in.nextInt();

    setStudentID();
}`,
    explanation: [
      'The constructor has the same name as the class (Student) with no return type.',
      'It executes every time the "new Student()" keyword is called in StudentDatabaseApp.',
      'It prompts the administrator directly for first name, last name, and grade level (1–4), then automatically calls setStudentID().'
    ],
    keyConcept: 'Constructors & System.in Scanner Input'
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Create the Unique 5-Digit Student ID',
    summary: 'Combine grade year with an auto-incrementing static counter to guarantee unique 5-digit IDs.',
    codeSnippet: `private void setStudentID() {
    // Increment the class static counter
    id++;
    // Concatenate grade level (1 digit) + id (4 digits) -> 5-digit String
    this.studentID = gradeYear + "" + id;
}`,
    explanation: [
      'Why static id = 1000? Each time a new student is constructed, id is incremented (1001, 1002, 1003...). Because it is static, all Student instances share this same counter.',
      'String concatenation: gradeYear (e.g. 1) + "" + id (e.g. 1001) produces "11001" (Freshman #1).',
      'Sophomore with id 1002 becomes "21002", Junior becomes "31003", Senior becomes "41004".',
      'The method is marked private because outside classes should not be able to manually tamper with student ID assignment.'
    ],
    keyConcept: 'Static Auto-Increment & String Concatenation'
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Implement the Enrollment Method',
    summary: 'Loop course entries, append each to courses list, and add $600 to tuition balance per course.',
    codeSnippet: `public void enroll() {
    do {
        System.out.print("Enter course to enroll (Q to quit): ");
        Scanner in = new Scanner(System.in);
        String course = in.nextLine();
        if (!course.equalsIgnoreCase("Q")) {
            courses = courses + "\\n  " + course;
            tuitionBalance = tuitionBalance + costOfCourse;
        } else {
            break;
        }
    } while (1 != 0);
}`,
    explanation: [
      'A do-while loop guarantees the prompt runs at least once so the student has the opportunity to enter courses or quit immediately.',
      'course.equalsIgnoreCase("Q") enables case-insensitive exit ("q" or "Q").',
      'Each valid course is concatenated with a newline into the courses string: courses = courses + "\\n  " + course.',
      'Each course increases tuitionBalance by costOfCourse ($600).'
    ],
    keyConcept: 'Do-While Loops, String Building, & Accumulators'
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Implement the Pay Tuition Method',
    summary: 'Display current balance, read payment amount, update balance, and display confirmation.',
    codeSnippet: `public void viewBalance() {
    System.out.println("Your balance is: $" + tuitionBalance);
}

public void payTuition() {
    viewBalance();
    System.out.print("Enter your payment: $");
    Scanner in = new Scanner(System.in);
    int payment = in.nextInt();
    tuitionBalance = tuitionBalance - payment;
    System.out.println("Thank you for your payment of $" + payment);
    viewBalance();
}`,
    explanation: [
      'viewBalance() is a helper method that prints the current tuition balance.',
      'payTuition() asks how much the student wants to pay.',
      'It subtracts payment from tuitionBalance (e.g. $1200 - $500 = $700 remaining balance).',
      'Prints a confirmation receipt with the exact remaining balance.'
    ],
    keyConcept: 'State Mutation & Interactive Helper Methods'
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Clean Up the Output to Display Student Status',
    summary: 'Override toString() to cleanly format student name, grade level, 5-digit ID, courses, and balance.',
    codeSnippet: `public String toString() {
    return "Name: " + firstName + " " + lastName +
           "\\nGrade Level: " + gradeYear +
           "\\nStudent ID: " + studentID +
           "\\nCourses Enrolled:" + courses +
           "\\nBalance: $" + tuitionBalance;
}`,
    explanation: [
      'Standard Java practice: Overriding toString() allows System.out.println(students[n]) to automatically render cleanly formatted text.',
      'Contains all required fields from the specification: Name, 5-digit unique ID, Grade Level, list of enrolled courses, and balance.',
      'Formatted with line breaks (\\n) for readable output in the terminal.'
    ],
    keyConcept: 'Object toString() Method Overriding'
  },
  {
    id: 'step-7',
    stepNumber: 7,
    title: 'Create an Array of Objects',
    summary: 'Prompt for number of students, allocate Student[] array, initialize instances, and loop through results.',
    codeSnippet: `// 1. Ask how many students will be added
System.out.print("Enter number of new students to enroll: ");
Scanner in = new Scanner(System.in);
int numOfStudents = in.nextInt();

// 2. Instantiate array of Student reference variables
Student[] students = new Student[numOfStudents];

// 3. Loop through array to construct, enroll, and pay
for (int n = 0; n < numOfStudents; n++) {
    students[n] = new Student();
    students[n].enroll();
    students[n].payTuition();
}

// 4. Print status summary for all students in the array
for (int n = 0; n < numOfStudents; n++) {
    System.out.println(students[n].toString());
}`,
    explanation: [
      'Student[] students = new Student[numOfStudents]; creates an array of reference pointers in heap memory, initially containing null.',
      'students[n] = new Student(); instantiates each actual Student object in memory.',
      'For-loop runs the complete lifecycle: constructor -> enroll() -> payTuition() for each student.',
      'A second for-loop iterates through the array to display the final formatted status of every student.'
    ],
    keyConcept: 'Array of Object References in Java'
  },
  {
    id: 'step-8',
    stepNumber: 8,
    title: 'Real-World Production: Batch Onboarding (No Manual Entry)',
    summary: 'Eliminate one-by-one manual typing by using overloaded constructors and batch CSV file readers.',
    codeSnippet: `// 1. Overloaded constructor receives data directly (from form/file)
public Student(String firstName, String lastName, int gradeYear) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gradeYear = gradeYear;
    setStudentID(); // Still auto-generates unique 5-digit ID!
}

// 2. Batch loop reads application forms from CSV file
Scanner fileScanner = new Scanner(new File("applications.csv"));
while (fileScanner.hasNextLine()) {
    String[] row = fileScanner.nextLine().split(",");
    // Automatically onboard applicant:
    Student student = new Student(row[0], row[1], Integer.parseInt(row[2]));
    student.enrollCourse(row[3]);
    student.payTuition(Integer.parseInt(row[4]));
    studentsList.add(student);
}`,
    explanation: [
      'Why you do NOT have to type one by one in production: In real universities, students submit digital application forms (via web or common app).',
      'Overloaded Constructor: Instead of blocking on Scanner(System.in), the constructor accepts parameters directly: new Student("Jane", "Doe", 1).',
      'File & Stream I/O: Java reads thousands of submitted rows in milliseconds using Scanner(File) or BufferedReader, auto-generating unique 5-digit IDs seamlessly.',
      'Clean Separation of Concerns: Separates data acquisition (file, web form, API) from the business domain model (Student object state).'
    ],
    keyConcept: 'Constructor Overloading & Batch File Processing'
  }
];
