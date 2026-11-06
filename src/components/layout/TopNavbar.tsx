import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Role } from '../../types';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  GraduationCap,
  BookOpen,
  HeartHandshake,
  Check,
  RotateCcw,
  Menu,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    activeParentChildId,
    setActiveParentChildId,
    students,
    activeTab,
    theme,
    toggleTheme,
    setIsSearchOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetAllData,
  } = useSchool();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: Role; label: string; icon: any; desc: string }[] = [
    { role: 'admin', label: 'Admin', icon: Shield, desc: 'Full System Oversight' },
    { role: 'teacher', label: 'Teacher', icon: GraduationCap, desc: 'Classroom & Grades' },
    { role: 'student', label: 'Student', icon: BookOpen, desc: 'Academics & Dues' },
    { role: 'parent', label: 'Parent', icon: HeartHandshake, desc: 'Multi-Child Monitor' },
  ];

  // Role filtered notifications
  const relevantNotifs = notifications.filter(n => n.forRoles.includes(currentRole));
  const unreadCount = relevantNotifs.filter(n => !n.read).length;

  const parentChildren = students.filter(s => s.guardianName.includes('David Parker'));

  const breadcrumbs: Record<string, string> = {
    dashboard: 'Campus Overview',
    students: 'Student Information Hub',
    attendance: 'Daily Attendance Tracker',
    grades: 'Gradebook & Official Reports',
    timetable: 'Master Schedule & Bookings',
    fees: 'Billing & Fee Center',
    library: 'Resource & Book Catalog',
    reports: 'Official Report Cards',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Sidebar"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Apex Academy</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
            {breadcrumbs[activeTab] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Center: Interactive Role Switcher Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
        {roles.map(r => {
          const Icon = r.icon;
          const isActive = currentRole === r.role;
          return (
            <button
              key={r.role}
              onClick={() => setCurrentRole(r.role)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title={r.desc}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">{r.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Parent Child Switcher (if parent), Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Multi-Child Selector for Parent */}
        {currentRole === 'parent' && parentChildren.length > 0 && (
          <div className="hidden lg:flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-lg px-2 py-1 text-xs">
            <span className="text-amber-800 dark:text-amber-300 font-medium">Child:</span>
            <select
              value={activeParentChildId}
              onChange={e => setActiveParentChildId(e.target.value)}
              className="bg-transparent text-amber-950 dark:text-amber-100 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {parentChildren.map(c => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
                  {c.firstName} ({c.grade}-{c.section})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Global Search Shortcut Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          title="Search anything (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 text-slate-500 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {relevantNotifs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new notifications for your role.
                  </div>
                ) : (
                  relevantNotifs.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                        !notif.read ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/60 transition-colors"
            title="Profile & Settings"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-indigo-200 dark:border-indigo-800"
            />
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 text-left">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-indigo-300 dark:border-indigo-700"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                    {currentRole} Role
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              <div className="py-2 space-y-1">
                <div className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span>Role Level</span>
                  <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                    {currentRole}
                  </span>
                </div>
                <div className="px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                  <span>Academic Term</span>
                  <span className="text-[11px] font-mono text-slate-500">Fall 2026</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    resetAllData();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Database</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
