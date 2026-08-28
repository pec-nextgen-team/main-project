import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import RaiseComplaint from './pages/RaiseComplaint.jsx';
import MyComplaints from './pages/MyComplaints.jsx';
import useAuth from './hooks/useAuth.js';

const ACTIVE_ITEM_BY_PATH = {
  '/': 'Raise Complaint',
  '/my-complaints': 'My Complaints',
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const activeItem = ACTIVE_ITEM_BY_PATH[location.pathname] || 'Raise Complaint';

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeItem={activeItem} />

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} user={user} />

        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<RaiseComplaint />} />
            <Route path="/my-complaints" element={<MyComplaints />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
