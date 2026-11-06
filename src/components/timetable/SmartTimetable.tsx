import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { TimetablePeriod } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  X,
} from 'lucide-react';

export const SmartTimetable: React.FC = () => {
  const { timetable, addTimetablePeriod, updateTimetablePeriod, deleteTimetablePeriod, checkConflict, currentRole } = useSchool();

  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [selectedSection, setSelectedSection] = useState('A');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<TimetablePeriod | null>(null);

  // Form Fields
  const [day, setDay] = useState<TimetablePeriod['day']>('Monday');
  const [startTime, setStartTime] = useState('08:30');
  const [endTime, setEndTime] = useState('09:30');
  const [subject, setSubject] = useState('Advanced Physics');
  const [teacherName, setTeacherName] = useState('Ms. Elena Rostova');
  const [room, setRoom] = useState('Lab Sci-302');
  const [color, setColor] = useState('emerald');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const days: TimetablePeriod['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    { start: '08:30', end: '09:30', label: 'Period 1 (08:30 - 09:30)' },
    { start: '09:45', end: '10:45', label: 'Period 2 (09:45 - 10:45)' },
    { start: '11:00', end: '12:00', label: 'Period 3 (11:00 - 12:00)' },
    { start: '13:00', end: '14:00', label: 'Period 4 (13:00 - 14:00)' },
  ];

  const handleOpenAdd = (dayParam?: TimetablePeriod['day'], start?: string, end?: string) => {
    setEditingPeriod(null);
    if (dayParam) setDay(dayParam);
    if (start) setStartTime(start);
    if (end) setEndTime(end);
    setConflictWarning(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: TimetablePeriod) => {
    setEditingPeriod(p);
    setDay(p.day);
    setStartTime(p.startTime);
    setEndTime(p.endTime);
    setSubject(p.subject);
    setTeacherName(p.teacherName);
    setRoom(p.room);
    setColor(p.color);
    setConflictWarning(null);
    setIsModalOpen(true);
  };

  const handleLiveConflictCheck = (
    checkDay: TimetablePeriod['day'],
    checkStart: string,
    checkEnd: string,
    checkRoom: string,
    checkTeacher: string
  ) => {
    const conflict = checkConflict(
      {
        day: checkDay,
        startTime: checkStart,
        endTime: checkEnd,
        subject,
        grade: selectedGrade,
        section: selectedSection,
        teacherName: checkTeacher,
        teacherId: 'tch_test',
        room: checkRoom,
        color,
      },
      editingPeriod?.id
    );
    setConflictWarning(conflict);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const periodData = {
      day,
      startTime,
      endTime,
      subject,
      grade: selectedGrade,
      section: selectedSection,
      teacherName,
      teacherId: 'tch_id',
      room,
      color,
    };

    if (editingPeriod) {
      const res = updateTimetablePeriod({ ...periodData, id: editingPeriod.id });
      if (res.success) setIsModalOpen(false);
    } else {
      const res = addTimetablePeriod(periodData);
      if (res.success) setIsModalOpen(false);
    }
  };

  // Filter periods for selected class
  const filteredPeriods = timetable.filter(
    p => p.grade === selectedGrade && p.section === selectedSection
  );

  const colorThemes: Record<string, string> = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100',
    amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
    sky: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-100',
    purple: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100',
    rose: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Smart Timetable & Conflict-Free Scheduling
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive weekly periods with automatic room and faculty double-booking conflict prevention.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'teacher') && (
          <button
            onClick={() => handleOpenAdd()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Period</span>
          </button>
        )}
      </div>

      {/* Class Selector Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Viewing Schedule:</span>
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

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Science & Labs
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Mathematics
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Humanities
          </span>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Days Header */}
            <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              <div className="py-3 px-2 border-r border-slate-200 dark:border-slate-800">Time Slot</div>
              {days.map(d => (
                <div key={d} className="py-3 px-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                  {d}
                </div>
              ))}
            </div>

            {/* Time Slot Rows */}
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {timeSlots.map(slot => (
                <div key={slot.start} className="grid grid-cols-6 min-h-[110px]">
                  {/* Time Column */}
                  <div className="p-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col justify-center items-center font-mono text-center">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{slot.start}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{slot.end}</span>
                  </div>

                  {/* Day Columns */}
                  {days.map(dayName => {
                    const matchedPeriod = filteredPeriods.find(
                      p => p.day === dayName && p.startTime === slot.start
                    );

                    return (
                      <div
                        key={dayName}
                        className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0 relative group flex flex-col"
                      >
                        {matchedPeriod ? (
                          <div
                            onClick={() => (currentRole === 'admin' || currentRole === 'teacher') && handleOpenEdit(matchedPeriod)}
                            className={`flex-1 p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between ${
                              colorThemes[matchedPeriod.color] || colorThemes.indigo
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold truncate">{matchedPeriod.subject}</p>
                              <p className="text-[11px] opacity-80 flex items-center gap-1 mt-1 truncate">
                                <User className="w-3 h-3 shrink-0" />
                                <span>{matchedPeriod.teacherName.split(' ').slice(-1)[0]}</span>
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/5 dark:border-white/10 text-[10px] opacity-75 font-mono">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" /> {matchedPeriod.room}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => (currentRole === 'admin' || currentRole === 'teacher') && handleOpenAdd(dayName, slot.start, slot.end)}
                            className="flex-1 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-center cursor-pointer text-slate-300 dark:text-slate-700 hover:text-indigo-500"
                            title="Click to schedule class period"
                          >
                            {(currentRole === 'admin' || currentRole === 'teacher') && (
                              <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule / Edit Period Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingPeriod ? 'Reschedule Class Period' : 'Schedule New Class Period'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Conflict Warning Banner */}
            {conflictWarning && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Schedule Conflict Alert</p>
                  <p className="mt-0.5 leading-snug">{conflictWarning}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Day of Week</label>
                  <select
                    value={day}
                    onChange={e => {
                      const newDay = e.target.value as any;
                      setDay(newDay);
                      handleLiveConflictCheck(newDay, startTime, endTime, room, teacherName);
                    }}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => {
                      setStartTime(e.target.value);
                      handleLiveConflictCheck(day, e.target.value, endTime, room, teacherName);
                    }}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => {
                      setEndTime(e.target.value);
                      handleLiveConflictCheck(day, startTime, e.target.value, room, teacherName);
                    }}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Instructor Name</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={e => {
                      setTeacherName(e.target.value);
                      handleLiveConflictCheck(day, startTime, endTime, room, e.target.value);
                    }}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Classroom / Lab</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => {
                      setRoom(e.target.value);
                      handleLiveConflictCheck(day, startTime, endTime, e.target.value, teacherName);
                    }}
                    className="w-full mt-1 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Color Tag</label>
                <div className="flex items-center gap-2 mt-1">
                  {['emerald', 'indigo', 'amber', 'sky', 'purple', 'rose'].map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        color === c ? 'border-indigo-600 scale-110' : 'border-transparent'
                      } ${
                        c === 'emerald' ? 'bg-emerald-500' :
                        c === 'indigo' ? 'bg-indigo-500' :
                        c === 'amber' ? 'bg-amber-500' :
                        c === 'sky' ? 'bg-sky-500' :
                        c === 'purple' ? 'bg-purple-500' : 'bg-rose-500'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                {editingPeriod ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteTimetablePeriod(editingPeriod.id);
                      setIsModalOpen(false);
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Slot</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    {editingPeriod ? 'Save Changes' : 'Confirm Period'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
