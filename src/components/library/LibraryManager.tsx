import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { LibraryBook } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bookmark,
  MapPin,
  X,
  UserCheck,
} from 'lucide-react';

export const LibraryManager: React.FC = () => {
  const { books, borrowBook, returnBook, addBook, students, currentRole } = useSchool();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Borrow Modal State
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);
  const [selectedBookForBorrow, setSelectedBookForBorrow] = useState<LibraryBook | null>(null);
  const [borrowStudentId, setBorrowStudentId] = useState(students[0]?.id || '');
  const [borrowDays, setBorrowDays] = useState(21);

  // Return Modal State
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [selectedBookForReturn, setSelectedBookForReturn] = useState<LibraryBook | null>(null);

  // Add Book Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newIsbn, setNewIsbn] = useState('978-013409');
  const [newCategory, setNewCategory] = useState<LibraryBook['category']>('Science');
  const [newCopies, setNewCopies] = useState(5);
  const [newShelf, setNewShelf] = useState('Stack 1, Row A-01');

  const categories = ['All', 'Science', 'Computer Science', 'Literature', 'Mathematics', 'History'];

  const filteredBooks = books.filter(b => {
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesSearch =
      `${b.title} ${b.author} ${b.isbn} ${b.shelfLocation}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const handleOpenBorrow = (book: LibraryBook) => {
    setSelectedBookForBorrow(book);
    setIsBorrowOpen(true);
  };

  const handleOpenReturn = (book: LibraryBook) => {
    setSelectedBookForReturn(book);
    setIsReturnOpen(true);
  };

  const handleConfirmBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForBorrow) return;
    const student = students.find(s => s.id === borrowStudentId) || students[0];
    borrowBook(selectedBookForBorrow.id, student.id, `${student.firstName} ${student.lastName}`, Number(borrowDays));
    setIsBorrowOpen(false);
  };

  const handleConfirmReturn = (studentId: string) => {
    if (!selectedBookForReturn) return;
    returnBook(selectedBookForReturn.id, studentId);
    setIsReturnOpen(false);
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    addBook({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      isbn: newIsbn.trim(),
      category: newCategory,
      totalCopies: Number(newCopies),
      shelfLocation: newShelf.trim(),
      publishedYear: 2024,
      coverAccent: newCategory === 'Science' ? '#0284c7' : newCategory === 'Computer Science' ? '#10b981' : '#f59e0b',
    });

    setNewTitle('');
    setNewAuthor('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Resource & Library Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic textbooks, STEM reference volumes, overdue alerts, and circulation checkout.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book to Catalog</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search book title, author, or ISBN..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Book Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map(book => {
          const activeBorrows = book.borrowedBy.filter(b => !b.returned);
          const hasOverdue = activeBorrows.some(b => new Date(b.dueDate) < new Date('2026-11-06'));

          return (
            <div
              key={book.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
            >
              <div className="space-y-3">
                {/* Top strip: Category + Overdue Alert */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {book.category}
                  </span>

                  {hasOverdue && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Overdue Copy</span>
                    </span>
                  )}
                </div>

                {/* Book Spine Graphic Accent & Title */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-2.5 h-14 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: book.coverAccent }}
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      by {book.author}
                    </p>
                  </div>
                </div>

                {/* Metadata & Location */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{book.shelfLocation}</span>
                    </span>
                    <span className="font-mono text-[11px]">{book.isbn.slice(-8)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Available Copies:</span>
                    <span
                      className={`font-mono font-bold text-xs ${
                        book.availableCopies > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {book.availableCopies} of {book.totalCopies} left
                    </span>
                  </div>
                </div>

                {/* Active Borrowers list (if any) */}
                {activeBorrows.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Checked out to:</p>
                    {activeBorrows.map(b => (
                      <div key={b.studentId} className="flex justify-between items-center text-slate-500">
                        <span className="truncate">{b.studentName}</span>
                        <span className="font-mono text-[10px]">Due {b.dueDate}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {activeBorrows.length > 0 && (
                  <button
                    onClick={() => handleOpenReturn(book)}
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    Check In Return
                  </button>
                )}

                <button
                  onClick={() => handleOpenBorrow(book)}
                  disabled={book.availableCopies <= 0}
                  className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs text-center"
                >
                  {book.availableCopies > 0 ? 'Borrow Copy' : 'Out of Stock'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Borrow Modal */}
      {isBorrowOpen && selectedBookForBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Circulation Checkout: {selectedBookForBorrow.title}
            </h3>

            <form onSubmit={handleConfirmBorrow} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Borrower Student</label>
                <select
                  value={borrowStudentId}
                  onChange={e => setBorrowStudentId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Loan Period</label>
                <select
                  value={borrowDays}
                  onChange={e => setBorrowDays(Number(e.target.value))}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value={7}>1 Week (Standard short loan)</option>
                  <option value={14}>2 Weeks (Course reading)</option>
                  <option value={21}>3 Weeks (Extended research)</option>
                  <option value={30}>1 Month (Semester project)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBorrowOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Confirm Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {isReturnOpen && selectedBookForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Return Book to Stacks: {selectedBookForReturn.title}
            </h3>
            <p className="text-xs text-slate-500">
              Select the student returning their borrowed copy to update shelf inventory:
            </p>

            <div className="space-y-2">
              {selectedBookForReturn.borrowedBy
                .filter(b => !b.returned)
                .map(borrower => (
                  <div
                    key={borrower.studentId}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{borrower.studentName}</p>
                      <p className="text-slate-500 font-mono text-[11px]">Due: {borrower.dueDate}</p>
                    </div>
                    <button
                      onClick={() => handleConfirmReturn(borrower.studentId)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                    >
                      Confirm Return
                    </button>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsReturnOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Catalog New Resource
            </h3>
            <form onSubmit={handleCreateBook} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Book Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Molecular Biology of the Cell"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Author</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={e => setNewAuthor(e.target.value)}
                    placeholder="e.g. Bruce Alberts"
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Science">Science</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Literature">Literature</option>
                    <option value="History">History</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">ISBN</label>
                  <input
                    type="text"
                    value={newIsbn}
                    onChange={e => setNewIsbn(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Copies</label>
                  <input
                    type="number"
                    min={1}
                    value={newCopies}
                    onChange={e => setNewCopies(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Shelf Location</label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={e => setNewShelf(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
