import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  AlertTriangle,
  Mail,
  Smartphone,
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const {
    students,
    attendance,
    getAttendanceForDate,
    markAttendance,
    markBatchAttendance,
    sendAttendanceAlert,
    currentRole,
    showToast,
  } = useSchool();

  const [selectedDate, setSelectedDate] = useState('2026-11-06');
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');

  // Retrieve or compose attendance records for this date/grade/section
  const records = getAttendanceForDate(selectedDate, selectedGrade, selectedSection);

  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const lateCount = records.filter(r => r.status === 'late').length;
  const excusedCount = records.filter(r => r.status === 'excused').length;
  const total = records.length;
  const rate = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  const handleMarkAllPresent = () => {
    const batch = records.map(r => ({
      studentId: r.studentId,
      studentName: r.studentName,
      grade: r.grade,
      section: r.section,
      status: 'present' as AttendanceStatus,
    }));
    markBatchAttendance(batch, selectedDate);
  };

  const handleNotifyAllAbsentees = () => {
    const targets = records.filter(r => (r.status === 'absent' || r.status === 'late') && !r.alertSent);
    if (targets.length === 0) {
      showToast({
        type: 'info',
        title: 'No Pending Notifications',
        message: 'All absent or tardy students have already been notified.',
      });
      return;
    }
    targets.forEach(t => sendAttendanceAlert(t.id));
    showToast({
      type: 'success',
      title: 'Bulk Parent Broadcast Dispatched',
      message: `SMS & Email attendance alerts sent to ${targets.length} parent guardians.`,
    });
  };

  const changeDateBy = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Daily Attendance Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark class presence, log tardiness, and send automated SMS/Email alerts directly to parents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={handleNotifyAllAbsentees}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Notify Absentee Parents</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Date Selector & Grade/Section Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Date Navigator */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => changeDateBy(-1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none font-mono cursor-pointer"
            />
          </div>

          <button
            onClick={() => changeDateBy(1)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate('2026-11-06')}
            className="px-2.5 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Today
          </button>
        </div>

        {/* Grade & Section Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Class:</span>
          </div>
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 7">Grade 7</option>
          </select>

          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>
      </div>

      {/* Class Statistics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Roll</span>
          <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1 tabular-nums">{total}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Present</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">{presentCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">Late</span>
          <p className="text-xl font-bold font-mono text-amber-600 mt-1 tabular-nums">{lateCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">Absent</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-1 tabular-nums">{absentCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Daily Rate</span>
          <p className="text-xl font-bold font-mono text-indigo-600 mt-1 tabular-nums">{rate}%</p>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status & Quick Toggle</th>
                <th className="py-3 px-4">Remarks / Notes</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4 text-right">Parent Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    No students enrolled in {selectedGrade}-{selectedSection}.
                  </td>
                </tr>
              ) : (
                records.map(record => {
                  const student = students.find(s => s.id === record.studentId);

                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                            {record.studentName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              {record.studentName}
                            </p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              {student?.rollNo || 'APX-2026'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status Segmented Buttons */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                          {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map(st => {
                            const isCurrent = record.status === st;

                            const activeStyles = {
                              present: 'bg-emerald-600 text-white shadow-xs',
                              late: 'bg-amber-600 text-white shadow-xs',
                              absent: 'bg-rose-600 text-white shadow-xs',
                              excused: 'bg-indigo-600 text-white shadow-xs',
                            };

                            return (
                              <button
                                key={st}
                                onClick={() => markAttendance(record.id, st)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                                  isCurrent
                                    ? activeStyles[st]
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Remarks Field */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={record.remarks || ''}
                          onChange={e => markAttendance(record.id, record.status, e.target.value)}
                          placeholder="Add incident remark..."
                          className="w-full max-w-xs px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </td>

                      {/* Check-in time */}
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {record.checkInTime || (record.status === 'present' ? '08:15 AM' : '—')}
                      </td>

                      {/* Parent Alert Trigger */}
                      <td className="py-3 px-4 text-right">
                        {record.status === 'absent' || record.status === 'late' ? (
                          record.alertSent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Dispatched ({record.alertSentAt || 'Sent'})</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => sendAttendanceAlert(record.id)}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                              title={`Send instant SMS/Email notice to ${student?.guardianName || 'Parent'}`}
                            >
                              <Smartphone className="w-3 h-3" />
                              <span>Notify Parent</span>
                            </button>
                          )
                        ) : (
                          <span className="text-slate-400 text-[11px]">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
