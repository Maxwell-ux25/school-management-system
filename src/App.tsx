import React from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { StudentHub } from './components/students/StudentHub';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { GradebookManager } from './components/gradebook/GradebookManager';
import { SmartTimetable } from './components/timetable/SmartTimetable';
import { FeeManagement } from './components/fees/FeeManagement';
import { LibraryManager } from './components/library/LibraryManager';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { activeTab } = useSchool();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && <OverviewDashboard />}
            {activeTab === 'students' && <StudentHub />}
            {activeTab === 'attendance' && <AttendanceTracker />}
            {activeTab === 'grades' && <GradebookManager />}
            {activeTab === 'timetable' && <SmartTimetable />}
            {activeTab === 'fees' && <FeeManagement />}
            {activeTab === 'library' && <LibraryManager />}
          </div>
        </main>
      </div>

      {/* Modals & Overlays */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <MainContent />
    </SchoolProvider>
  );
}
