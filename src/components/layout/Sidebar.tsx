import React from 'react';
import { useSchool, NavigationTab } from '../../context/SchoolContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  GraduationCap,
  Calendar,
  Receipt,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    currentRole,
    currentUser,
    students,
    invoices,
  } = useSchool();

  const pendingInvoicesCount = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length;

  const navItems: { tab: NavigationTab; label: string; icon: any; badge?: string; roles?: string[] }[] = [
    {
      tab: 'dashboard',
      label: 'Campus Overview',
      icon: LayoutDashboard,
    },
    {
      tab: 'students',
      label: 'Student Hub',
      icon: Users,
      badge: `${students.length}`,
    },
    {
      tab: 'attendance',
      label: 'Daily Attendance',
      icon: CalendarCheck,
    },
    {
      tab: 'grades',
      label: 'Gradebook & Reports',
      icon: GraduationCap,
    },
    {
      tab: 'timetable',
      label: 'Smart Timetable',
      icon: Calendar,
    },
    {
      tab: 'fees',
      label: 'Fee & Invoicing',
      icon: Receipt,
      badge: pendingInvoicesCount > 0 ? `${pendingInvoicesCount} due` : undefined,
    },
    {
      tab: 'library',
      label: 'Library & Resources',
      icon: BookOpen,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-40 shrink-0 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 justify-between">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold tracking-wider text-sm shadow-md shadow-indigo-500/20 shrink-0">
              AX
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                Apex Academy
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                School Management
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold tracking-wider text-sm shadow-md shadow-indigo-500/20">
            AX
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Banner */}
      {!isSidebarCollapsed && (
        <div className="p-3 mx-3 mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                  {currentRole} Access
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className={`text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-3 ${isSidebarCollapsed ? 'text-center' : ''}`}>
          {isSidebarCollapsed ? '···' : 'Navigation'}
        </p>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              } ${isSidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
              
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge.includes('due')
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Apex OS v2.4</span>
          <span className="font-mono">Term 1 · 2026</span>
        </div>
      )}
    </aside>
  );
};
