import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import RaiseComplaint from './pages/RaiseComplaint.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import useAuth from './hooks/useAuth.js';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-h-screen w-full flex-1 flex-col lg:pl-0">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} user={user} />

        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/raise-complaint" replace />} />
            <Route path="/raise-complaint" element={<RaiseComplaint />} />
            {/* These routes live in this module's own sibling folders in the
                monorepo (Tickets.jsx, Requests.jsx, approvals-page, etc.).
                They render here as placeholders so the sidebar always
                navigates to a real route instead of a dead "#" link. */}
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/my-complaints" element={<PlaceholderPage title="My Complaints" />} />
            <Route path="/approvals" element={<PlaceholderPage title="Approvals" />} />
            <Route path="/tickets" element={<PlaceholderPage title="Tickets" />} />
            <Route path="/requests" element={<PlaceholderPage title="Requests" />} />
            <Route path="/technician" element={<PlaceholderPage title="Technician" />} />
            <Route path="/stock-management" element={<PlaceholderPage title="Stock Management" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
