export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  title: string;
  department?: string;
  phone?: string;
}

export interface BehaviorRecord {
  id: string;
  date: string;
  type: 'commendation' | 'infraction' | 'counseling' | 'general';
  title: string;
  notes: string;
  author: string;
}

export interface HealthRecord {
  bloodGroup: string;
  allergies: string[];
  medications: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  doctorName?: string;
  doctorPhone?: string;
  notes?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  grade: string; // e.g. "Grade 10"
  section: string; // e.g. "A"
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  enrolledDate: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  gpa: number;
  attendanceRate: number;
  avatarUrl?: string;
  health: HealthRecord;
  behaviorNotes: BehaviorRecord[];
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  status: AttendanceStatus;
  checkInTime?: string;
  remarks?: string;
  alertSent?: boolean;
  alertSentAt?: string;
}

export type AssignmentType = 'Quiz' | 'Homework' | 'Project' | 'Midterm' | 'Finals';

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  subject: string;
  term: string; // e.g., "Term 1 (Fall 2026)"
  assignmentType: AssignmentType;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  weightPercent: number;
  date: string;
  teacherRemarks?: string;
}

export interface SubjectSummary {
  subject: string;
  teacher: string;
  quizAvg: number;
  projectAvg: number;
  examScore: number;
  overallScore: number;
  letterGrade: string;
  gpaPoint: number;
  credits: number;
  remarks: string;
}

export interface ReportCard {
  student: Student;
  term: string;
  academicYear: string;
  issueDate: string;
  subjects: SubjectSummary[];
  gpa: number;
  cumulativeGpa: number;
  rank: number;
  totalStudentsInClass: number;
  attendancePercentage: number;
  principalRemarks: string;
  headTeacherRemarks: string;
}

export interface TimetablePeriod {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:30"
  subject: string;
  grade: string;     // e.g. "Grade 10"
  section: string;   // e.g. "A"
  teacherName: string;
  teacherId: string;
  room: string;
  color: string;
}

export interface FeeItem {
  id: string;
  description: string;
  category: 'Tuition' | 'Transport' | 'Lab & Science' | 'Technology' | 'Sports & Clubs';
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  grade: string;
  parentName: string;
  parentEmail: string;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  items: FeeItem[];
  totalAmount: number;
  paidAmount: number;
  paidAt?: string;
  paymentMethod?: string;
  transactionRef?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: 'Science' | 'Literature' | 'Mathematics' | 'History' | 'Computer Science' | 'Arts';
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  publishedYear: number;
  coverAccent: string;
  borrowedBy: {
    studentId: string;
    studentName: string;
    borrowDate: string;
    dueDate: string;
    returned: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'academic' | 'finance' | 'attendance' | 'announcement';
  forRoles: Role[];
}
