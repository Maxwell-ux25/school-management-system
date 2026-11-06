import React, { useState } from 'react';
import { Student } from '../../types';
import { X, Check, AlertCircle } from 'lucide-react';

interface StudentFormModalProps {
  studentToEdit?: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  studentToEdit,
  isOpen,
  onClose,
  onSave,
}) => {
  const [firstName, setFirstName] = useState(studentToEdit?.firstName || '');
  const [lastName, setLastName] = useState(studentToEdit?.lastName || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(studentToEdit?.gender || 'Male');
  const [dob, setDob] = useState(studentToEdit?.dob || '2010-05-15');
  const [grade, setGrade] = useState(studentToEdit?.grade || 'Grade 10');
  const [section, setSection] = useState(studentToEdit?.section || 'A');
  const [email, setEmail] = useState(studentToEdit?.email || '');
  const [phone, setPhone] = useState(studentToEdit?.phone || '+1 (555) 234-5678');
  const [address, setAddress] = useState(studentToEdit?.address || '124 School Lane, Springfield');
  const [guardianName, setGuardianName] = useState(studentToEdit?.guardianName || '');
  const [guardianRelationship, setGuardianRelationship] = useState(studentToEdit?.guardianRelationship || 'Parent');
  const [guardianPhone, setGuardianPhone] = useState(studentToEdit?.guardianPhone || '+1 (555) 987-6543');
  const [guardianEmail, setGuardianEmail] = useState(studentToEdit?.guardianEmail || '');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Suspended'>(studentToEdit?.status || 'Active');
  const [bloodGroup, setBloodGroup] = useState(studentToEdit?.health.bloodGroup || 'O+');
  const [allergies, setAllergies] = useState(studentToEdit?.health.allergies.join(', ') || '');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters.';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Student email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!guardianName.trim()) {
      newErrors.guardianName = 'Guardian / Parent full name is required.';
    }

    if (!guardianEmail.trim()) {
      newErrors.guardianEmail = 'Guardian email is required for communication.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardianEmail)) {
      newErrors.guardianEmail = 'Invalid guardian email format.';
    }

    if (!guardianPhone.trim()) {
      newErrors.guardianPhone = 'Guardian emergency phone is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      rollNo: studentToEdit?.rollNo || `APX-2026-0${Math.floor(50 + Math.random() * 40)}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      gender,
      dob,
      grade,
      section,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      guardianName: guardianName.trim(),
      guardianRelationship: guardianRelationship.trim(),
      guardianPhone: guardianPhone.trim(),
      guardianEmail: guardianEmail.trim(),
      enrolledDate: studentToEdit?.enrolledDate || new Date().toISOString().split('T')[0],
      status,
      health: {
        bloodGroup,
        allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
        medications: studentToEdit?.health.medications || [],
        emergencyContact: {
          name: guardianName.trim(),
          relationship: guardianRelationship.trim(),
          phone: guardianPhone.trim(),
          email: guardianEmail.trim(),
        },
        doctorName: studentToEdit?.health.doctorName || '',
        doctorPhone: studentToEdit?.health.doctorPhone || '',
        notes: studentToEdit?.health.notes || '',
      },
    };

    if (studentToEdit) {
      onSave({
        ...studentToEdit,
        ...data,
      });
    } else {
      onSave(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {studentToEdit ? 'Edit Student Profile' : 'Enroll New Student'}
            </h3>
            <p className="text-xs text-slate-500">
              {studentToEdit ? 'Update records, academic section, or contact details' : 'Enter primary academic and guardian records'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Student Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Identity</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.target.value);
                    if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                  }}
                  className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 ${
                    errors.firstName
                      ? 'border-rose-400 focus:ring-1 focus:ring-rose-400'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
                  }`}
                  placeholder="e.g. Liam"
                />
                {errors.firstName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                  className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 ${
                    errors.lastName
                      ? 'border-rose-400 focus:ring-1 focus:ring-rose-400'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
                  }`}
                  placeholder="e.g. Parker"
                />
                {errors.lastName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Grade Level</label>
                <select
                  value={grade}
                  onChange={e => setGrade(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Section</label>
                <select
                  value={section}
                  onChange={e => setSection(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Student Email *</label>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 ${
                  errors.email
                    ? 'border-rose-400 focus:ring-1 focus:ring-rose-400'
                    : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="liam.parker@student.apex.edu"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Guardian & Emergency Information */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Guardian & Emergency Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Guardian Name *</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={e => {
                    setGuardianName(e.target.value);
                    if (errors.guardianName) setErrors(prev => ({ ...prev, guardianName: '' }));
                  }}
                  className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 ${
                    errors.guardianName
                      ? 'border-rose-400'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="e.g. David Parker"
                />
                {errors.guardianName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.guardianName}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Relationship</label>
                <input
                  type="text"
                  value={guardianRelationship}
                  onChange={e => setGuardianRelationship(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  placeholder="e.g. Father, Mother, Legal Guardian"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Guardian Phone *</label>
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={e => {
                    setGuardianPhone(e.target.value);
                    if (errors.guardianPhone) setErrors(prev => ({ ...prev, guardianPhone: '' }));
                  }}
                  className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 ${
                    errors.guardianPhone
                      ? 'border-rose-400'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="+1 (555) 789-3320"
                />
                {errors.guardianPhone && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.guardianPhone}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Guardian Email *</label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={e => {
                    setGuardianEmail(e.target.value);
                    if (errors.guardianEmail) setErrors(prev => ({ ...prev, guardianEmail: '' }));
                  }}
                  className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs bg-white dark:bg-slate-800 ${
                    errors.guardianEmail
                      ? 'border-rose-400'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                  placeholder="david.parker@outlook.com"
                />
                {errors.guardianEmail && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.guardianEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Known Allergies / Medical Notes</label>
              <input
                type="text"
                value={allergies}
                onChange={e => setAllergies(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                placeholder="e.g. Peanuts (Mild), Penicillin"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              {studentToEdit ? 'Save Changes' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
