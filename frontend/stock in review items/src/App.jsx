import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import RaiseComplaint from './pages/RaiseComplaint.jsx';
import MyComplaints from './pages/MyComplaints.jsx';
import StockIn from './pages/StockIn.jsx';
import useAuth from './hooks/useAuth.js';

// Which demo persona is "logged in" for a given route. Different pages in
// this ERP are used by different roles: Faculty/Staff raise and track their
// own complaints, while the Electrician Head processes stock.
const ROLE_BY_PATH = {
  '/': 'faculty',
  '/my-complaints': 'faculty',
  '/stock-management/stock-in': 'electricianHead',
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const role = ROLE_BY_PATH[location.pathname] || 'faculty';
  const { user } = useAuth(role);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen w-full flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen((v) => !v)} user={user} />

        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<RaiseComplaint />} />
            <Route path="/my-complaints" element={<MyComplaints />} />
            <Route path="/stock-management/stock-in" element={<StockIn />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
