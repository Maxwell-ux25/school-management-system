import React from 'react';
import { ReportCard } from '../../types';
import { X, Printer, Download, Award, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ReportCardModalProps {
  report: ReportCard | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Modal Toolbar (hidden in print) */}
        <div className="no-print px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-800">
              Official Academic Transcript & Report Card
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Document Body */}
        <div className="p-8 sm:p-12 space-y-8 bg-white print:p-0">
          {/* Institutional Crest Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-white flex items-center justify-center text-xl font-extrabold tracking-wider shadow-md shrink-0">
                APX
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 uppercase">
                  Apex Academy of Sciences & Arts
                </h1>
                <p className="text-xs text-slate-600 font-medium tracking-wide mt-0.5">
                  Office of the Registrar · Accredited Secondary Academic Institution
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  742 Academy Way, Pacific Northwest · ID: REG-APX-2026-99
                </p>
              </div>
            </div>

            <div className="text-right sm:border-l sm:pl-6 border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                Official Term Report
              </span>
              <p className="text-sm font-bold text-slate-900 mt-2 font-mono">{report.term}</p>
              <p className="text-xs text-slate-500 font-mono">{report.academicYear}</p>
            </div>
          </div>

          {/* Student Dossier Information Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Student Name:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {report.student.firstName} {report.student.lastName}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Roll / Student ID:</span>
              <p className="font-bold text-slate-900 font-mono mt-0.5">{report.student.rollNo}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Class & Cohort:</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {report.student.grade} (Section {report.student.section})
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Issue Date:</span>
              <p className="font-bold text-slate-900 font-mono mt-0.5">{report.issueDate}</p>
            </div>
          </div>

          {/* Subject Grade Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Academic Course</th>
                  <th className="py-3 px-3">Instructor</th>
                  <th className="py-3 px-3 text-right">Quiz Avg</th>
                  <th className="py-3 px-3 text-right">Project Avg</th>
                  <th className="py-3 px-3 text-right">Exam Score</th>
                  <th className="py-3 px-3 text-right">Final Mark</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-right">GPA Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {report.subjects.map(subj => (
                  <tr key={subj.subject} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {subj.subject}
                      <p className="text-[10px] text-slate-500 font-normal italic mt-0.5">
                        {subj.remarks}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{subj.teacher}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">{subj.quizAvg}%</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">{subj.projectAvg}%</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums">{subj.examScore}%</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {subj.overallScore}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-bold font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                        {subj.letterGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums">
                      {subj.gpaPoint.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Performance Summary Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center">
            <div>
              <p className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Term GPA</p>
              <p className="text-2xl font-bold font-mono text-indigo-950 mt-1">{report.gpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Cumulative GPA</p>
              <p className="text-2xl font-bold font-mono text-indigo-950 mt-1">{report.cumulativeGpa.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Class Standing</p>
              <p className="text-2xl font-bold font-mono text-indigo-950 mt-1">
                Rank {report.rank} <span className="text-xs font-normal text-slate-600">of {report.totalStudentsInClass}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Attendance Rate</p>
              <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">{report.attendancePercentage}%</p>
            </div>
          </div>

          {/* Institutional Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Head of School Remarks
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{report.principalRemarks}"
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Academic Advisor Remarks
              </span>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{report.headTeacherRemarks}"
              </p>
            </div>
          </div>

          {/* Official Signatures & Seal */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-8 text-xs text-slate-600">
            <div className="text-center sm:text-left">
              <div className="h-10 border-b border-slate-400 w-48 mb-2 flex items-end justify-center font-serif italic text-slate-800">
                Dr. Marcus Vance
              </div>
              <p className="font-bold text-slate-900">Dr. Marcus Vance</p>
              <p className="text-[11px] text-slate-500">Principal & Head of School</p>
            </div>

            {/* Verification Seal Badge */}
            <div className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/30">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <div className="text-left text-[10px]">
                <p className="font-bold text-indigo-900 uppercase">Apex Academy Registrar</p>
                <p className="text-slate-500 font-mono">Verified Digital Credential</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="h-10 border-b border-slate-400 w-48 mb-2 flex items-end justify-center font-serif italic text-slate-800">
                Elena Rostova, M.Ed.
              </div>
              <p className="font-bold text-slate-900">Ms. Elena Rostova</p>
              <p className="text-[11px] text-slate-500">Senior Department Head</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
