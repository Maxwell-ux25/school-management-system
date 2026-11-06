import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Role,
  UserProfile,
  Student,
  AttendanceRecord,
  AttendanceStatus,
  GradeEntry,
  ReportCard,
  TimetablePeriod,
  Invoice,
  LibraryBook,
  NotificationItem,
  BehaviorRecord,
  HealthRecord,
  SubjectSummary,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_TIMETABLE,
  INITIAL_INVOICES,
  INITIAL_BOOKS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'students'
  | 'attendance'
  | 'grades'
  | 'timetable'
  | 'fees'
  | 'library'
  | 'reports';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface SchoolContextType {
  // Authentication & Role
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: UserProfile;
  activeParentChildId: string;
  setActiveParentChildId: (studentId: string) => void;
  activeParentChild: Student | undefined;

  // Navigation & Theme
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Search & Global state
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast notifications
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Data State & Actions
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'behaviorNotes'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addBehaviorNote: (studentId: string, note: Omit<BehaviorRecord, 'id' | 'date'>) => void;
  updateHealthRecord: (studentId: string, health: HealthRecord) => void;

  attendance: AttendanceRecord[];
  getAttendanceForDate: (date: string, grade?: string, section?: string) => AttendanceRecord[];
  markAttendance: (recordId: string, status: AttendanceStatus, remarks?: string) => void;
  markBatchAttendance: (records: { studentId: string; studentName: string; grade: string; section: string; status: AttendanceStatus }[], date: string) => void;
  sendAttendanceAlert: (recordId: string) => void;

  grades: GradeEntry[];
  addGradeEntry: (entry: Omit<GradeEntry, 'id'>) => void;
  updateGradeEntry: (id: string, updates: Partial<GradeEntry>) => void;
  deleteGradeEntry: (id: string) => void;
  getReportCard: (studentId: string, term?: string) => ReportCard;

  timetable: TimetablePeriod[];
  addTimetablePeriod: (period: Omit<TimetablePeriod, 'id'>) => { success: boolean; conflictMessage?: string };
  updateTimetablePeriod: (period: TimetablePeriod) => { success: boolean; conflictMessage?: string };
  deleteTimetablePeriod: (id: string) => void;
  checkConflict: (period: Omit<TimetablePeriod, 'id'>, excludeId?: string) => string | null;

  invoices: Invoice[];
  payInvoice: (invoiceId: string, paymentMethod: string) => Promise<boolean>;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'paidAmount' | 'status'>) => void;

  books: LibraryBook[];
  borrowBook: (bookId: string, studentId: string, studentName: string, days?: number) => boolean;
  returnBook: (bookId: string, studentId: string) => boolean;
  addBook: (book: Omit<LibraryBook, 'id' | 'borrowedBy' | 'availableCopies'>) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Reset to demo data
  resetAllData: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'apex_sms_role',
  CHILD: 'apex_sms_parent_child',
  THEME: 'apex_sms_theme',
  TAB: 'apex_sms_tab',
  STUDENTS: 'apex_sms_students_v2',
  ATTENDANCE: 'apex_sms_attendance_v2',
  GRADES: 'apex_sms_grades_v2',
  TIMETABLE: 'apex_sms_timetable_v2',
  INVOICES: 'apex_sms_invoices_v2',
  BOOKS: 'apex_sms_books_v2',
  NOTIFICATIONS: 'apex_sms_notifs_v2',
};

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme init
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Role & User
  const [currentRole, setCurrentRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE) as Role;
    return saved && ['admin', 'teacher', 'student', 'parent'].includes(saved) ? saved : 'admin';
  });

  const [activeParentChildId, setActiveParentChildIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CHILD) || 'stu_1001';
  });

  const setActiveParentChildId = (id: string) => {
    setActiveParentChildIdState(id);
    localStorage.setItem(STORAGE_KEYS.CHILD, id);
  };

  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    showToast({
      type: 'info',
      title: `Switched View: ${role.toUpperCase()}`,
      message: `You are now interacting as ${INITIAL_PROFILES[role].name} (${INITIAL_PROFILES[role].title})`,
    });
  };

  const currentUser = INITIAL_PROFILES[currentRole];

  // Navigation
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TAB) as NavigationTab;
    return saved || 'dashboard';
  });

  const setActiveTab = (tab: NavigationTab) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEYS.TAB, tab);
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persistent Core Data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [timetable, setTimetable] = useState<TimetablePeriod[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [books, setBooks] = useState<LibraryBook[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Save to localStorage effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Derived: Active Parent Child
  const activeParentChild = students.find(s => s.id === activeParentChildId) || students[0];

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'attendanceRate' | 'gpa' | 'behaviorNotes'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu_${Date.now()}`,
      attendanceRate: 100,
      gpa: 3.8,
      behaviorNotes: [],
    };
    setStudents(prev => [newStudent, ...prev]);
    showToast({
      type: 'success',
      title: 'Student Profile Enrolled',
      message: `${newStudent.firstName} ${newStudent.lastName} registered in ${newStudent.grade}-${newStudent.section}.`,
    });
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
    showToast({
      type: 'success',
      title: 'Record Updated',
      message: `Profile details for ${updatedStudent.firstName} ${updatedStudent.lastName} saved.`,
    });
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast({
      type: 'info',
      title: 'Student Record Archived',
      message: `${target?.firstName} ${target?.lastName} archived from active roster.`,
    });
  };

  const addBehaviorNote = (studentId: string, noteData: Omit<BehaviorRecord, 'id' | 'date'>) => {
    const newNote: BehaviorRecord = {
      ...noteData,
      id: `beh_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            behaviorNotes: [newNote, ...s.behaviorNotes],
          };
        }
        return s;
      })
    );
    showToast({
      type: 'success',
      title: 'Disciplinary/Commendation Logged',
      message: `Note added to student record.`,
    });
  };

  const updateHealthRecord = (studentId: string, health: HealthRecord) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return { ...s, health };
        }
        return s;
      })
    );
    showToast({
      type: 'success',
      title: 'Health & Medical Info Saved',
      message: 'Emergency protocols and contact records updated.',
    });
  };

  // Attendance Actions
  const getAttendanceForDate = (date: string, grade?: string, section?: string): AttendanceRecord[] => {
    const relevantStudents = students.filter(s => {
      if (grade && s.grade !== grade) return false;
      if (section && s.section !== section) return false;
      return true;
    });

    return relevantStudents.map(student => {
      const existing = attendance.find(a => a.date === date && a.studentId === student.id);
      if (existing) return existing;
      // Default placeholder if not yet marked
      return {
        id: `att_placeholder_${date}_${student.id}`,
        date,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        grade: student.grade,
        section: student.section,
        status: 'present' as AttendanceStatus,
        checkInTime: '08:00 AM',
      };
    });
  };

  const markAttendance = (recordId: string, status: AttendanceStatus, remarks?: string) => {
    setAttendance(prev => {
      const index = prev.findIndex(r => r.id === recordId);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          status,
          remarks: remarks !== undefined ? remarks : copy[index].remarks,
        };
        return copy;
      }
      return prev;
    });
  };

  const markBatchAttendance = (
    records: { studentId: string; studentName: string; grade: string; section: string; status: AttendanceStatus }[],
    date: string
  ) => {
    setAttendance(prev => {
      const updated = [...prev];
      records.forEach(rec => {
        const existingIdx = updated.findIndex(r => r.date === date && r.studentId === rec.studentId);
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            status: rec.status,
          };
        } else {
          updated.push({
            id: `att_${Date.now()}_${rec.studentId}`,
            date,
            studentId: rec.studentId,
            studentName: rec.studentName,
            grade: rec.grade,
            section: rec.section,
            status: rec.status,
            checkInTime: rec.status === 'present' ? '08:15 AM' : undefined,
          });
        }
      });
      return updated;
    });
    showToast({
      type: 'success',
      title: 'Attendance Roster Saved',
      message: `Updated records for ${records.length} students on ${date}.`,
    });
  };

  const sendAttendanceAlert = (recordId: string) => {
    const record = attendance.find(r => r.id === recordId);
    if (!record) return;

    const student = students.find(s => s.id === record.studentId);
    const parentPhone = student?.guardianPhone || '+1 (555) 789-3320';
    const parentName = student?.guardianName || 'Guardian';

    setAttendance(prev =>
      prev.map(r =>
        r.id === recordId
          ? {
              ...r,
              alertSent: true,
              alertSentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : r
      )
    );

    // Mock real-time SMS / Email delivery dispatch
    showToast({
      type: 'info',
      title: `SMS & Email Alert Dispatched`,
      message: `Sent status [${record.status.toUpperCase()}] for ${record.studentName} to ${parentName} (${parentPhone}).`,
    });

    // Also add to school notification center
    setNotifications(prev => [
      {
        id: `notif_${Date.now()}`,
        title: `Attendance Alert: ${record.studentName}`,
        message: `${record.studentName} marked ${record.status}. Notification sent to parent.`,
        timestamp: 'Just now',
        read: false,
        type: 'attendance',
        forRoles: ['admin', 'teacher', 'parent'],
      },
      ...prev,
    ]);
  };

  // Gradebook Actions
  const addGradeEntry = (entryData: Omit<GradeEntry, 'id'>) => {
    const newEntry: GradeEntry = {
      ...entryData,
      id: `grd_${Date.now()}`,
    };
    setGrades(prev => [newEntry, ...prev]);
    showToast({
      type: 'success',
      title: 'Assessment Score Recorded',
      message: `${entryData.assignmentTitle} score (${entryData.score}/${entryData.maxScore}) saved for ${entryData.studentName}.`,
    });
  };

  const updateGradeEntry = (id: string, updates: Partial<GradeEntry>) => {
    setGrades(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
    showToast({
      type: 'success',
      title: 'Grade Updated',
      message: 'Assessment score recalculations applied.',
    });
  };

  const deleteGradeEntry = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
    showToast({
      type: 'info',
      title: 'Assessment Entry Removed',
    });
  };

  const getReportCard = (studentId: string, term: string = 'Term 1 (Fall 2026)'): ReportCard => {
    const student = students.find(s => s.id === studentId) || students[0];
    const studentGrades = grades.filter(g => g.studentId === studentId);

    // Group by subject
    const subjectNames = Array.from(new Set(studentGrades.map(g => g.subject)));
    if (subjectNames.length === 0) {
      subjectNames.push('Advanced Physics', 'Pre-Calculus & Trigonometry', 'World Literature', 'Computer Science II');
    }

    const subjectsSummary: SubjectSummary[] = subjectNames.map(subj => {
      const forSubj = studentGrades.filter(g => g.subject === subj);
      const quizzes = forSubj.filter(g => g.assignmentType === 'Quiz' || g.assignmentType === 'Homework');
      const projects = forSubj.filter(g => g.assignmentType === 'Project');
      const exams = forSubj.filter(g => g.assignmentType === 'Midterm' || g.assignmentType === 'Finals');

      const quizAvg = quizzes.length > 0 ? Math.round(quizzes.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / quizzes.length) : 92;
      const projectAvg = projects.length > 0 ? Math.round(projects.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / projects.length) : 95;
      const examScore = exams.length > 0 ? Math.round(exams.reduce((a, b) => a + (b.score / b.maxScore) * 100, 0) / exams.length) : 90;

      const overall = Math.round(quizAvg * 0.25 + projectAvg * 0.35 + examScore * 0.4);
      let letter = 'A';
      let gpa = 4.0;
      if (overall >= 93) { letter = 'A'; gpa = 4.0; }
      else if (overall >= 90) { letter = 'A-'; gpa = 3.7; }
      else if (overall >= 87) { letter = 'B+'; gpa = 3.3; }
      else if (overall >= 83) { letter = 'B'; gpa = 3.0; }
      else if (overall >= 80) { letter = 'B-'; gpa = 2.7; }
      else { letter = 'C+'; gpa = 2.3; }

      return {
        subject: subj,
        teacher: subj.includes('Physics') ? 'Ms. Elena Rostova' : subj.includes('Calculus') ? 'Mr. Julian Hayes' : 'Mrs. Claire Bennett',
        quizAvg,
        projectAvg,
        examScore,
        overallScore: overall,
        letterGrade: letter,
        gpaPoint: gpa,
        credits: 1.0,
        remarks: overall >= 90 ? 'Demonstrates exemplary critical thought and problem analysis.' : 'Good academic foundation with strong potential.',
      };
    });

    const totalGpa = subjectsSummary.reduce((acc, s) => acc + s.gpaPoint, 0) / (subjectsSummary.length || 1);

    return {
      student,
      term,
      academicYear: '2026-2027 Academic Year',
      issueDate: 'November 6, 2026',
      subjects: subjectsSummary,
      gpa: Number(totalGpa.toFixed(2)),
      cumulativeGpa: Number((totalGpa * 0.98 + 0.05).toFixed(2)),
      rank: student.gpa >= 3.9 ? 2 : student.gpa >= 3.8 ? 5 : 12,
      totalStudentsInClass: 28,
      attendancePercentage: student.attendanceRate || 96.4,
      principalRemarks: 'An outstanding semester characterized by rigor, high academic integrity, and spirited contribution to student clubs.',
      headTeacherRemarks: 'Shows consistent enthusiasm in lab demonstrations. Recommended for Advanced Placement honors.',
    };
  };

  // Timetable Actions & Conflict Checking
  const checkConflict = (period: Omit<TimetablePeriod, 'id'>, excludeId?: string): string | null => {
    for (const existing of timetable) {
      if (excludeId && existing.id === excludeId) continue;
      if (existing.day !== period.day) continue;

      // Check time overlap: (StartA < EndB) and (EndA > StartB)
      const startA = period.startTime;
      const endA = period.endTime;
      const startB = existing.startTime;
      const endB = existing.endTime;

      const overlap = startA < endB && endA > startB;
      if (overlap) {
        if (existing.room === period.room) {
          return `Room conflict: ${period.room} is already reserved by ${existing.subject} (${existing.grade}-${existing.section}) from ${existing.startTime} to ${existing.endTime}.`;
        }
        if (existing.teacherName.toLowerCase() === period.teacherName.toLowerCase()) {
          return `Teacher conflict: ${period.teacherName} is already scheduled for ${existing.subject} (${existing.room}) from ${existing.startTime} to ${existing.endTime}.`;
        }
        if (existing.grade === period.grade && existing.section === period.section) {
          return `Class conflict: ${period.grade}-${period.section} already has ${existing.subject} in ${existing.room} during this slot.`;
        }
      }
    }
    return null;
  };

  const addTimetablePeriod = (periodData: Omit<TimetablePeriod, 'id'>) => {
    const conflict = checkConflict(periodData);
    if (conflict) {
      showToast({
        type: 'error',
        title: 'Schedule Conflict Detected',
        message: conflict,
      });
      return { success: false, conflictMessage: conflict };
    }

    const newPeriod: TimetablePeriod = {
      ...periodData,
      id: `tt_${Date.now()}`,
    };
    setTimetable(prev => [...prev, newPeriod]);
    showToast({
      type: 'success',
      title: 'Class Period Added',
      message: `${periodData.subject} on ${periodData.day} (${periodData.startTime} - ${periodData.endTime}) scheduled in ${periodData.room}.`,
    });
    return { success: true };
  };

  const updateTimetablePeriod = (period: TimetablePeriod) => {
    const conflict = checkConflict(period, period.id);
    if (conflict) {
      showToast({
        type: 'error',
        title: 'Schedule Conflict Detected',
        message: conflict,
      });
      return { success: false, conflictMessage: conflict };
    }

    setTimetable(prev => prev.map(p => (p.id === period.id ? period : p)));
    showToast({
      type: 'success',
      title: 'Class Period Rescheduled',
      message: `Updated ${period.subject} on ${period.day}.`,
    });
    return { success: true };
  };

  const deleteTimetablePeriod = (id: string) => {
    setTimetable(prev => prev.filter(p => p.id !== id));
    showToast({
      type: 'info',
      title: 'Class Period Removed',
      message: 'Slot cleared from master schedule.',
    });
  };

  // Fee Management Actions
  const payInvoice = async (invoiceId: string, paymentMethod: string): Promise<boolean> => {
    // Simulate real gateway latency
    await new Promise(resolve => setTimeout(resolve, 800));

    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'paid',
            paidAmount: inv.totalAmount,
            paidAt: new Date().toISOString().split('T')[0],
            paymentMethod,
            transactionRef: `tx_pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          };
        }
        return inv;
      })
    );

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }

    showToast({
      type: 'success',
      title: 'Payment Processed Successfully',
      message: `Invoice marked paid via ${paymentMethod}. Official receipt generated.`,
    });

    return true;
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'paidAmount' | 'status'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-APX-${Math.floor(1000 + Math.random() * 9000)}`,
      paidAmount: 0,
      status: 'pending',
    };
    setInvoices(prev => [newInvoice, ...prev]);
    showToast({
      type: 'success',
      title: 'New Invoice Issued',
      message: `${newInvoice.invoiceNumber} billed to ${newInvoice.parentName}.`,
    });
  };

  // Library Actions
  const borrowBook = (bookId: string, studentId: string, studentName: string, days = 21): boolean => {
    let success = false;
    setBooks(prev =>
      prev.map(book => {
        if (book.id === bookId) {
          if (book.availableCopies <= 0) {
            showToast({
              type: 'error',
              title: 'No Copies Available',
              message: `All copies of "${book.title}" are currently checked out.`,
            });
            return book;
          }
          success = true;
          const borrowDate = new Date().toISOString().split('T')[0];
          const dueDateObj = new Date();
          dueDateObj.setDate(dueDateObj.getDate() + days);
          const dueDate = dueDateObj.toISOString().split('T')[0];

          return {
            ...book,
            availableCopies: book.availableCopies - 1,
            borrowedBy: [
              ...book.borrowedBy,
              {
                studentId,
                studentName,
                borrowDate,
                dueDate,
                returned: false,
              },
            ],
          };
        }
        return book;
      })
    );

    if (success) {
      showToast({
        type: 'success',
        title: 'Book Borrowed',
        message: `Issued to ${studentName}. Due in ${days} days.`,
      });
    }
    return success;
  };

  const returnBook = (bookId: string, studentId: string): boolean => {
    let success = false;
    setBooks(prev =>
      prev.map(book => {
        if (book.id === bookId) {
          const borrowedEntry = book.borrowedBy.find(b => b.studentId === studentId && !b.returned);
          if (!borrowedEntry) return book;
          success = true;
          return {
            ...book,
            availableCopies: Math.min(book.totalCopies, book.availableCopies + 1),
            borrowedBy: book.borrowedBy.map(b => (b.studentId === studentId && !b.returned ? { ...b, returned: true } : b)),
          };
        }
        return book;
      })
    );

    if (success) {
      showToast({
        type: 'info',
        title: 'Book Returned',
        message: 'Inventory count updated. Shelf check passed.',
      });
    }
    return success;
  };

  const addBook = (bookData: Omit<LibraryBook, 'id' | 'borrowedBy' | 'availableCopies'>) => {
    const newBook: LibraryBook = {
      ...bookData,
      id: `bk_${Date.now()}`,
      availableCopies: bookData.totalCopies,
      borrowedBy: [],
    };
    setBooks(prev => [newBook, ...prev]);
    showToast({
      type: 'success',
      title: 'New Resource Cataloged',
      message: `"${newBook.title}" added to ${newBook.category} collection.`,
    });
  };

  // Notification Actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setGrades(INITIAL_GRADES);
    setTimetable(INITIAL_TIMETABLE);
    setInvoices(INITIAL_INVOICES);
    setBooks(INITIAL_BOOKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRoleState('admin');
    setActiveTabState('dashboard');
    showToast({
      type: 'info',
      title: 'Demo Environment Reset',
      message: 'All records restored to fresh school dataset.',
    });
  };

  return (
    <SchoolContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        activeParentChildId,
        setActiveParentChildId,
        activeParentChild,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        theme,
        toggleTheme,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        removeToast,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        addBehaviorNote,
        updateHealthRecord,
        attendance,
        getAttendanceForDate,
        markAttendance,
        markBatchAttendance,
        sendAttendanceAlert,
        grades,
        addGradeEntry,
        updateGradeEntry,
        deleteGradeEntry,
        getReportCard,
        timetable,
        addTimetablePeriod,
        updateTimetablePeriod,
        deleteTimetablePeriod,
        checkConflict,
        invoices,
        payInvoice,
        addInvoice,
        books,
        borrowBook,
        returnBook,
        addBook,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        resetAllData,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
