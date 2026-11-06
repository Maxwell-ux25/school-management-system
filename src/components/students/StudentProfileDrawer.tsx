import React, { useState } from 'react';
import { Student, BehaviorRecord, HealthRecord } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import {
  X,
  User,
  GraduationCap,
  CalendarCheck,
  HeartPulse,
  ShieldAlert,
  Award,
  Phone,
  Mail,
  MapPin,
  Plus,
  Printer,
  FileBadge,
} from 'lucide-react';

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  onClose,
  onEdit,
}) => {
  const { addBehaviorNote, updateHealthRecord } = useSchool();
  const [activeTab, setActiveTab] = useState<'academics' | 'attendance' | 'behavior' | 'health'>('academics');

  // Behavior Note Form State
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteType, setNoteType] = useState<BehaviorRecord['type']>('commendation');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDetails, setNoteDetails] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Faculty Advisor');

  // Health Editing State
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(student?.health.bloodGroup || 'O+');
  const [allergies, setAllergies] = useState(student?.health.allergies.join(', ') || '');
  const [medications, setMedications] = useState(student?.health.medications.join(', ') || '');
  const [doctorName, setDoctorName] = useState(student?.health.doctorName || '');
  const [doctorPhone, setDoctorPhone] = useState(student?.health.doctorPhone || '');
  const [healthNotes, setHealthNotes] = useState(student?.health.notes || '');

  if (!student) return null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteDetails.trim()) return;

    addBehaviorNote(student.id, {
      type: noteType,
      title: noteTitle,
      notes: noteDetails,
      author: noteAuthor,
    });
    setNoteTitle('');
    setNoteDetails('');
    setIsAddingNote(false);
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHealth: HealthRecord = {
      bloodGroup,
      allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
      medications: medications.split(',').map(m => m.trim()).filter(Boolean),
      emergencyContact: student.health.emergencyContact,
      doctorName,
      doctorPhone,
      notes: healthNotes,
    };
    updateHealthRecord(student.id, updatedHealth);
    setIsEditingHealth(false);
  };

  const handlePrintId = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={`${student.firstName} ${student.lastName}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                `${student.firstName[0]}${student.lastName[0]}`
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {student.rollNo}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {student.grade} · Section {student.section} · Status: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{student.status}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintId}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Print Student Profile Record"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 text-xs font-semibold">
          {[
            { id: 'academics', label: 'Academics & Bio', icon: GraduationCap },
            { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
            { id: 'behavior', label: `Conduct & Notes (${student.behaviorNotes.length})`, icon: ShieldAlert },
            { id: 'health', label: 'Health & Medical', icon: HeartPulse },
          ].map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
                  active
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Academics & Bio Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              {/* Quick KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center">
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Cumulative GPA</p>
                  <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{student.gpa.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center">
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Attendance</p>
                  <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">{student.attendanceRate}%</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center">
                  <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Standing</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 truncate">Honor Roll</p>
                </div>
              </div>

              {/* Bio & Demographics */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Date of Birth:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.dob}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Gender:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.gender}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Student Email:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">{student.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Contact Phone:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Residential Address:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.address}</p>
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Primary Guardian & Family</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Guardian Name:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.guardianName} ({student.guardianRelationship})</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.guardianPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">Email:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{student.guardianEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Official Semester Attendance</p>
                  <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{student.attendanceRate}%</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Exceeds Standard
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Attendance Records</p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Friday, Nov 6, 2026</p>
                      <p className="text-slate-500 text-[11px]">Period 1 · Checked in 08:14 AM</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-medium">Present</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Thursday, Nov 5, 2026</p>
                      <p className="text-slate-500 text-[11px]">Period 1 · Checked in 08:10 AM</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-medium">Present</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Wednesday, Nov 4, 2026</p>
                      <p className="text-slate-500 text-[11px]">Period 1 · Checked in 08:15 AM</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-medium">Present</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Behavior & Conduct Tab */}
          {activeTab === 'behavior' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Disciplinary & Commendation Log
                </h4>
                <button
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg hover:bg-indigo-100 flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNote ? 'Cancel' : 'Add Note'}</span>
                </button>
              </div>

              {/* Add Note Form */}
              {isAddingNote && (
                <form onSubmit={handleSaveNote} className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Category</label>
                      <select
                        value={noteType}
                        onChange={e => setNoteType(e.target.value as any)}
                        className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      >
                        <option value="commendation">Commendation / Honor</option>
                        <option value="infraction">Infraction / Warning</option>
                        <option value="counseling">Counseling Note</option>
                        <option value="general">General Remark</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Staff Author</label>
                      <input
                        type="text"
                        value={noteAuthor}
                        onChange={e => setNoteAuthor(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Title / Subject</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={e => setNoteTitle(e.target.value)}
                      placeholder="e.g. Science Olympiad Regional Recognition"
                      className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Detailed Notes</label>
                    <textarea
                      rows={2}
                      value={noteDetails}
                      onChange={e => setNoteDetails(e.target.value)}
                      placeholder="Observation details..."
                      className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Save to Record
                    </button>
                  </div>
                </form>
              )}

              {/* Notes List */}
              <div className="space-y-3">
                {student.behaviorNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No disciplinary or commendation entries recorded.</p>
                ) : (
                  student.behaviorNotes.map(n => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              n.type === 'commendation'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                : n.type === 'infraction'
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {n.type}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.notes}</p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Logged by {n.author}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. Health & Medical Tab */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical & Health Record</h4>
                <button
                  onClick={() => setIsEditingHealth(!isEditingHealth)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  {isEditingHealth ? 'Cancel' : 'Edit Health Info'}
                </button>
              </div>

              {isEditingHealth ? (
                <form onSubmit={handleSaveHealth} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Blood Group</label>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={e => setBloodGroup(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Allergies (comma-separated)</label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={e => setAllergies(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Medications on File</label>
                    <input
                      type="text"
                      value={medications}
                      onChange={e => setMedications(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Physician Name</label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={e => setDoctorName(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Physician Phone</label>
                      <input
                        type="text"
                        value={doctorPhone}
                        onChange={e => setDoctorPhone(e.target.value)}
                        className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Physician Notes / Restrictions</label>
                    <textarea
                      rows={2}
                      value={healthNotes}
                      onChange={e => setHealthNotes(e.target.value)}
                      className="w-full mt-1 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500"
                    >
                      Save Health Records
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Blood Group:</span>
                      <p className="font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{student.health.bloodGroup}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Known Allergies:</span>
                      <p className="font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                        {student.health.allergies.length > 0 ? student.health.allergies.join(', ') : 'None registered'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Active Medications:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      {student.health.medications.length > 0 ? student.health.medications.join(', ') : 'No scheduled medications'}
                    </p>
                  </div>

                  {student.health.doctorName && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Primary Physician:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {student.health.doctorName} · {student.health.doctorPhone}
                      </p>
                    </div>
                  )}

                  {student.health.notes && (
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500">Medical Protocols / Restrictions:</span>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5">{student.health.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center">
          <button
            onClick={() => onEdit(student)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-800 dark:text-slate-200 transition-colors"
          >
            Edit Profile Details
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
