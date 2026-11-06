import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Search, X, Users, BookOpen, Clock, FileText, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, students, timetable, books, invoices, setActiveTab } = useSchool();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingStudents = students.filter(s =>
    `${s.firstName} ${s.lastName} ${s.rollNo} ${s.grade} ${s.guardianName}`.toLowerCase().includes(trimmed)
  ).slice(0, 4);

  const matchingSubjects = Array.from(new Set(timetable.map(t => t.subject)))
    .filter(subj => subj.toLowerCase().includes(trimmed))
    .slice(0, 3);

  const matchingBooks = books.filter(b =>
    `${b.title} ${b.author} ${b.isbn}`.toLowerCase().includes(trimmed)
  ).slice(0, 3);

  const matchingInvoices = invoices.filter(inv =>
    `${inv.invoiceNumber} ${inv.studentName} ${inv.status}`.toLowerCase().includes(trimmed)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search students, classes, books, invoices, or records... (Press Esc to close)"
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {/* Quick Module Shortcuts if empty query */}
          {query.trim() === '' && (
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Students Roster', tab: 'students', icon: Users },
                  { label: 'Attendance Sheet', tab: 'attendance', icon: Clock },
                  { label: 'Official Gradebook', tab: 'grades', icon: FileText },
                  { label: 'Library Catalog', tab: 'library', icon: BookOpen },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => {
                        setActiveTab(item.tab as any);
                        setIsSearchOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-all text-xs font-medium text-slate-700 dark:text-slate-200"
                    >
                      <Icon className="w-4 h-4 text-indigo-500" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Students Results */}
          {matchingStudents.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Students ({matchingStudents.length})
              </p>
              <div className="space-y-1">
                {matchingStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setActiveTab('students');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold text-xs flex items-center justify-center">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {student.rollNo} · {student.grade}-{student.section} · GPA {student.gpa.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      View Hub <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timetable / Subjects */}
          {matchingSubjects.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Courses & Schedules
              </p>
              <div className="space-y-1">
                {matchingSubjects.map(subj => (
                  <button
                    key={subj}
                    onClick={() => {
                      setActiveTab('timetable');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left text-sm"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{subj}</span>
                    <span className="text-xs text-slate-400">View Schedule →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {matchingBooks.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Library Catalog
              </p>
              <div className="space-y-1">
                {matchingBooks.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setActiveTab('library');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{b.title}</p>
                      <p className="text-xs text-slate-500">{b.author} · Shelf {b.shelfLocation}</p>
                    </div>
                    <span className="text-xs text-slate-400">{b.availableCopies} available</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {matchingInvoices.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Invoices & Billing
              </p>
              <div className="space-y-1">
                {matchingInvoices.map(inv => (
                  <button
                    key={inv.id}
                    onClick={() => {
                      setActiveTab('fees');
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{inv.invoiceNumber} · {inv.studentName}</p>
                      <p className="text-xs text-slate-500">Due {inv.dueDate} · Status: {inv.status.toUpperCase()}</p>
                    </div>
                    <span className="font-mono text-xs font-semibold">${inv.totalAmount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() !== '' && matchingStudents.length === 0 && matchingSubjects.length === 0 && matchingBooks.length === 0 && matchingInvoices.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">No records match "{query}".</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by student name, roll number, course, or invoice ID.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
