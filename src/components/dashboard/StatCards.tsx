import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  DollarSign,
  TrendingUp,
  Award,
  BookOpenCheck,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

export const StatCards: React.FC = () => {
  const { currentRole, students, attendance, invoices, grades, activeParentChild, setActiveTab } = useSchool();

  // Admin Metrics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Average attendance calculation
  const todayRecords = attendance.filter(a => a.date === '2026-11-06');
  const presentCount = todayRecords.filter(a => a.status === 'present').length;
  const attendanceRate = todayRecords.length > 0 ? Math.round((presentCount / todayRecords.length) * 100) : 96.2;

  if (currentRole === 'admin') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Enrolled</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {totalStudents}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{activeStudents} active on roster</span>
            </div>
          </div>
        </div>

        {/* Faculty & Staff */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Faculty Staff</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              34
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% certified educators
            </p>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Today's Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {attendanceRate}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {presentCount} present · 1 late · 1 excused
            </p>
          </div>
        </div>

        {/* Revenue Collected */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tuition & Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                ${totalCollected.toLocaleString()}
              </p>
              <span className="text-xs font-mono font-medium text-slate-500">{collectionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentRole === 'teacher') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">My Classes & Rosters</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
            4 Periods
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Lab Sci-302 & Maker Lab</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Grade 10-A Attendance</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
            96.8%
          </p>
          <p className="text-xs text-slate-500 mt-1">1 alert sent this morning</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Assessments Graded</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
            {grades.length} Entries
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium">Midterm reports compiled</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Next Scheduled Class</span>
          <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 truncate">
            Advanced Physics
          </p>
          <p className="text-xs text-slate-500 mt-1 font-mono">Period 2 · 09:45 AM</p>
        </div>
      </div>
    );
  }

  if (currentRole === 'student') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
            3.86
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-600 font-medium">
            <Award className="w-3.5 h-3.5" />
            <span>High Honors Standing (Top 5%)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Semester Attendance</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
            96.4%
          </p>
          <p className="text-xs text-slate-500 mt-1">48 of 50 school days present</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Library Books Checked Out</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
            2 Titles
          </p>
          <p className="text-xs text-slate-500 mt-1">Due Nov 19 & Nov 25</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Fall Semester Tuition</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
            $4,400
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">Due Nov 15 · Parent Bill</p>
        </div>
      </div>
    );
  }

  // Parent Role Metrics
  const child = activeParentChild || students[0];
  const childInvoices = invoices.filter(inv => inv.studentId === child.id);
  const pendingChildAmount = childInvoices
    .filter(inv => inv.status !== 'paid')
    .reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">Monitoring Student</span>
        <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 truncate">
          {child.firstName} {child.lastName}
        </p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
          {child.grade} · Section {child.section}
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">Academic GPA</span>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
          {child.gpa.toFixed(2)}
        </p>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Honor Roll Eligible</p>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <span className="text-xs font-semibold text-slate-500">Attendance Record</span>
        <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-3 font-mono tabular-nums">
          {child.attendanceRate}%
        </p>
        <p className="text-xs text-slate-500 mt-1">Status: Present on campus</p>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500">Tuition & School Fees</span>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2 font-mono tabular-nums">
            ${pendingChildAmount.toLocaleString()}
          </p>
        </div>
        {pendingChildAmount > 0 ? (
          <button
            onClick={() => setActiveTab('fees')}
            className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Review & Pay Invoice →</span>
          </button>
        ) : (
          <span className="mt-2 text-xs text-emerald-600 font-medium">All fees cleared</span>
        )}
      </div>
    </div>
  );
};
