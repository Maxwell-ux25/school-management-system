import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { StatCards } from './StatCards';
import {
  Calendar,
  Users,
  GraduationCap,
  CalendarCheck,
  Receipt,
  BookOpen,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

export const OverviewDashboard: React.FC = () => {
  const {
    currentRole,
    currentUser,
    activeParentChild,
    students,
    attendance,
    invoices,
    grades,
    timetable,
    setActiveTab,
    getReportCard,
  } = useSchool();

  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  // Sample trend data points for responsive SVG curve: Months and attendance/enrollment index
  const trendData = [
    { month: 'Jun', attendance: 94.2, enrollment: 240 },
    { month: 'Jul', attendance: 95.1, enrollment: 248 },
    { month: 'Aug', attendance: 96.0, enrollment: 260 },
    { month: 'Sep', attendance: 97.4, enrollment: 275 },
    { month: 'Oct', attendance: 96.8, enrollment: 284 },
    { month: 'Nov', attendance: 98.1, enrollment: 290 },
  ];

  // Fee categories breakdown
  const feeCategories = [
    { name: 'Academic Tuition', value: 78500, color: '#6366f1', percent: 62 },
    { name: 'STEM Labs & Tech', value: 24200, color: '#10b981', percent: 19 },
    { name: 'District Transport', value: 14800, color: '#f59e0b', percent: 12 },
    { name: 'Arts & Athletics', value: 9100, color: '#ec4899', percent: 7 },
  ];

  // SVG dimensions for trend chart
  const width = 500;
  const height = 180;
  const padding = 30;

  const minVal = 92;
  const maxVal = 100;
  const getY = (val: number) => height - padding - ((val - minVal) / (maxVal - minVal)) * (height - padding * 2);
  const getX = (idx: number) => padding + (idx / (trendData.length - 1)) * (width - padding * 2);

  const points = trendData.map((d, idx) => `${getX(idx)},${getY(d.attendance)}`).join(' ');
  const areaPath = `M ${getX(0)},${height - padding} L ${points} L ${getX(trendData.length - 1)},${height - padding} Z`;

  // Filter today's timetable for student or teacher
  const todayClasses = timetable.filter(t => t.day === 'Monday' || t.day === 'Tuesday').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-1">
              <span>Apex Academy Term 1</span>
              <span>·</span>
              <span className="font-mono">Friday, November 6, 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentRole === 'admin' && `Welcome back, ${currentUser.name}`}
              {currentRole === 'teacher' && `Good morning, ${currentUser.name}`}
              {currentRole === 'student' && `Welcome, ${currentUser.name}`}
              {currentRole === 'parent' && `Parent Portal: ${currentUser.name}`}
            </h2>
            <p className="text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              {currentRole === 'admin' && 'Campus operations are operating nominally. 96.4% attendance recorded today with zero safety flags.'}
              {currentRole === 'teacher' && 'You have 4 teaching blocks scheduled today. Lab 302 is prepped for Grade 10 Physics experiments.'}
              {currentRole === 'student' && 'Grade 10-A is in session. Check your upcoming physics assignment and mid-semester grade transcript.'}
              {currentRole === 'parent' && `Currently monitoring records for ${activeParentChild?.firstName || 'your student'}. Fees and attendance are synced in real-time.`}
            </p>
          </div>

          {/* Quick Action Pill on Banner */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            {currentRole === 'admin' && (
              <button
                onClick={() => setActiveTab('students')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Manage Students</span>
              </button>
            )}
            {currentRole === 'teacher' && (
              <button
                onClick={() => setActiveTab('attendance')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Mark Today's Roll</span>
              </button>
            )}
            {currentRole === 'student' && (
              <button
                onClick={() => setActiveTab('grades')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>View My Report Card</span>
              </button>
            )}
            {currentRole === 'parent' && (
              <button
                onClick={() => setActiveTab('fees')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Review Invoices</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Stat Cards */}
      <StatCards />

      {/* Main Two-Column Analytics & Schedule Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Data Visualization */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart 1: Academic Attendance & Enrollment Progression */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Campus Attendance & Engagement Rate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monthly school-wide presence vs 95% target threshold
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Attendance %
                </span>
                <span className="font-mono text-emerald-600 font-semibold">+3.9% MoM</span>
              </div>
            </div>

            {/* Responsive SVG Chart */}
            <div className="w-full overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference gridlines */}
                {[94, 96, 98, 100].map(val => (
                  <g key={val}>
                    <line
                      x1={padding}
                      y1={getY(val)}
                      x2={width - padding}
                      y2={getY(val)}
                      stroke="currentColor"
                      className="text-slate-100 dark:text-slate-800"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding - 6}
                      y={getY(val) + 3}
                      textAnchor="end"
                      className="text-[10px] fill-slate-400 font-mono"
                    >
                      {val}%
                    </text>
                  </g>
                ))}

                {/* Shaded Area */}
                <path d={areaPath} fill="url(#trendGradient)" />

                {/* Line Curve */}
                <path
                  d={`M ${points}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {trendData.map((d, idx) => {
                  const cx = getX(idx);
                  const cy = getY(d.attendance);
                  const isHovered = activeChartPoint === idx;

                  return (
                    <g
                      key={d.month}
                      onMouseEnter={() => setActiveChartPoint(idx)}
                      onMouseLeave={() => setActiveChartPoint(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 4}
                        className="fill-white dark:fill-slate-900 stroke-indigo-600 stroke-2 transition-all"
                      />
                      <text
                        x={cx}
                        y={height - 8}
                        textAnchor="middle"
                        className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium"
                      >
                        {d.month}
                      </text>
                      {isHovered && (
                        <g>
                          <rect
                            x={cx - 32}
                            y={cy - 28}
                            width="64"
                            height="20"
                            rx="4"
                            className="fill-slate-900 dark:fill-slate-100"
                          />
                          <text
                            x={cx}
                            y={cy - 14}
                            textAnchor="middle"
                            className="text-[10px] font-mono font-bold fill-white dark:fill-slate-900"
                          >
                            {d.attendance}%
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Quick Module Action Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                title: 'Student Records',
                desc: 'Profiles, forms & health',
                tab: 'students',
                icon: Users,
                color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40',
              },
              {
                title: 'Attendance Sheet',
                desc: 'Roll call & parent alerts',
                tab: 'attendance',
                icon: CalendarCheck,
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
              },
              {
                title: 'Official Grades',
                desc: 'GPA & report cards',
                tab: 'grades',
                icon: GraduationCap,
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
              },
              {
                title: 'Billing & Fees',
                desc: 'Invoices & checkout',
                tab: 'fees',
                icon: Receipt,
                color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40',
              },
            ].map(tile => {
              const Icon = tile.icon;
              return (
                <button
                  key={tile.tab}
                  onClick={() => setActiveTab(tile.tab as any)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all text-left shadow-2xs group flex flex-col justify-between"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tile.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                      {tile.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {tile.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Timetable & Financial Breakdown */}
        <div className="space-y-6">
          {/* Schedule Widget */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Daily Period Schedule
                </h3>
                <p className="text-xs text-slate-500">Upcoming periods today</p>
              </div>
              <button
                onClick={() => setActiveTab('timetable')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Full Grid →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {todayClasses.map(cls => (
                <div
                  key={cls.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-3"
                >
                  <div className="text-center font-mono text-[10px] text-slate-500 shrink-0 w-12 pt-0.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{cls.startTime}</p>
                    <p className="text-[9px]">{cls.endTime}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {cls.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {cls.grade}-{cls.section} · {cls.room}
                    </p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium truncate mt-0.5">
                      {cls.teacherName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Collections Distribution Doughnut Ring Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Revenue Allocation
              </h3>
              <button
                onClick={() => setActiveTab('fees')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Invoices →
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {feeCategories.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{cat.name}</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      ${cat.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
