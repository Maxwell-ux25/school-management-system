import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { GradeEntry, AssignmentType, ReportCard } from '../../types';
import { ReportCardModal } from './ReportCardModal';
import {
  GraduationCap,
  Plus,
  FileText,
  Filter,
  ArrowUpDown,
  Search,
  Award,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export const GradebookManager: React.FC = () => {
  const {
    students,
    grades,
    addGradeEntry,
    updateGradeEntry,
    deleteGradeEntry,
    getReportCard,
    currentRole,
    activeParentChild,
  } = useSchool();

  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStudentId, setSelectedStudentId] = useState(
    currentRole === 'student' ? 'stu_1001' : currentRole === 'parent' ? activeParentChild?.id || 'stu_1001' : 'All'
  );
  const [selectedType, setSelectedType] = useState('All');

  // New Grade Form Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formStudentId, setFormStudentId] = useState(students[0]?.id || '');
  const [formSubject, setFormSubject] = useState('Advanced Physics');
  const [formType, setFormType] = useState<AssignmentType>('Quiz');
  const [formTitle, setFormTitle] = useState('');
  const [formScore, setFormScore] = useState(90);
  const [formMaxScore, setFormMaxScore] = useState(100);
  const [formWeight, setFormWeight] = useState(20);
  const [formRemarks, setFormRemarks] = useState('');

  // Report Card Modal
  const [activeReport, setActiveReport] = useState<ReportCard | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Filtered grades
  const filteredGrades = grades.filter(g => {
    if (selectedSubject !== 'All' && g.subject !== selectedSubject) return false;
    if (selectedStudentId !== 'All' && g.studentId !== selectedStudentId) return false;
    if (selectedType !== 'All' && g.assignmentType !== selectedType) return false;
    return true;
  });

  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subject)));

  const handleCreateGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const student = students.find(s => s.id === formStudentId) || students[0];

    addGradeEntry({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      grade: student.grade,
      subject: formSubject,
      term: 'Term 1 (Fall 2026)',
      assignmentType: formType,
      assignmentTitle: formTitle.trim(),
      score: Number(formScore),
      maxScore: Number(formMaxScore),
      weightPercent: Number(formWeight),
      date: new Date().toISOString().split('T')[0],
      teacherRemarks: formRemarks.trim() || undefined,
    });

    setFormTitle('');
    setFormRemarks('');
    setIsAddOpen(false);
  };

  const handleOpenReport = (studentId: string) => {
    const report = getReportCard(studentId);
    setActiveReport(report);
    setIsReportModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Modern Gradebook & Assessment Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log quizzes, laboratory projects, and exams with cumulative GPA calculations and printable transcripts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(currentRole === 'admin' || currentRole === 'teacher') && (
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record Assessment Score</span>
            </button>
          )}

          <button
            onClick={() => handleOpenReport(selectedStudentId !== 'All' ? selectedStudentId : students[0].id)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Official Report Card</span>
          </button>
        </div>
      </div>

      {/* Filter and Switcher Strip */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Subject:</span>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="All">All Subjects</option>
            {uniqueSubjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Student Filter */}
        {currentRole !== 'student' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Student:</span>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
            >
              <option value="All">All Students ({students.length})</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Assignment Type Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Type:</span>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Quiz">Quiz</option>
            <option value="Project">Project</option>
            <option value="Midterm">Midterm</option>
            <option value="Finals">Finals</option>
          </select>
        </div>
      </div>

      {/* Grade Entries Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Subject & Course</th>
                <th className="py-3 px-4">Assessment Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Score / Max</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    No grades match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredGrades.map(grade => {
                  const percent = Math.round((grade.score / grade.maxScore) * 100);
                  const isPassing = percent >= 70;

                  return (
                    <tr
                      key={grade.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {grade.studentName}
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {grade.subject}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {grade.assignmentTitle}
                        </span>
                        {grade.teacherRemarks && (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">
                            "{grade.teacherRemarks}"
                          </p>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {grade.assignmentType}
                        </span>
                      </td>

                      {/* Interactive Editable Score */}
                      <td className="py-3 px-4 font-mono font-bold tabular-nums">
                        {(currentRole === 'teacher' || currentRole === 'admin') ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={grade.maxScore}
                              value={grade.score}
                              onChange={e => updateGradeEntry(grade.id, { score: Number(e.target.value) })}
                              className="w-14 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-center"
                            />
                            <span className="text-slate-400">/ {grade.maxScore}</span>
                          </div>
                        ) : (
                          <span>{grade.score} / {grade.maxScore}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        {grade.weightPercent}%
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold text-xs ${
                            percent >= 90
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : percent >= 80
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {percent}%
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenReport(grade.studentId)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Generate Student Report Card"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {(currentRole === 'admin' || currentRole === 'teacher') && (
                            <button
                              onClick={() => deleteGradeEntry(grade.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete Grade Entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Assessment Score Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Record Assessment Entry
            </h3>

            <form onSubmit={handleCreateGrade} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Student</label>
                <select
                  value={formStudentId}
                  onChange={e => setFormStudentId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.rollNo} · {s.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                  <select
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Advanced Physics">Advanced Physics</option>
                    <option value="Pre-Calculus & Trigonometry">Pre-Calculus & Trigonometry</option>
                    <option value="World Literature & Rhetoric">World Literature & Rhetoric</option>
                    <option value="Computer Science II: Algorithms">Computer Science II</option>
                    <option value="Physical Education & Health">Physical Education</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Assignment Type</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Homework">Homework</option>
                    <option value="Project">Project</option>
                    <option value="Midterm">Midterm</option>
                    <option value="Finals">Finals</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Title / Assessment Name</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Electromagnetism & Circuits Lab"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Score Earned</label>
                  <input
                    type="number"
                    min={0}
                    max={formMaxScore}
                    value={formScore}
                    onChange={e => setFormScore(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Max Score</label>
                  <input
                    type="number"
                    min={1}
                    value={formMaxScore}
                    onChange={e => setFormMaxScore(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Weight %</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formWeight}
                    onChange={e => setFormWeight(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Teacher Remarks</label>
                <input
                  type="text"
                  value={formRemarks}
                  onChange={e => setFormRemarks(e.target.value)}
                  placeholder="e.g. Solid experimental technique"
                  className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                />
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
                  Record Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Report Card Modal */}
      <ReportCardModal
        report={activeReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
