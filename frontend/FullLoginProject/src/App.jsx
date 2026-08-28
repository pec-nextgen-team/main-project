import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";

function Placeholder({ label }) {
  return <div style={{ padding: 40 }}>{label}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Placeholder label="Dashboard" />} />
        <Route path="/forgot-password" element={<Placeholder label="Forgot Password" />} />

        {/* Per-role landing routes - see ROLE_LANDING_ROUTES in LoginPage.jsx.
            These are placeholders until each role's real dashboard module
            is wired in; the redirect logic itself is already role-aware. */}
        <Route path="/supervisor/dashboard" element={<Placeholder label="Supervisor Dashboard" />} />
        <Route path="/electrician-incharge/dashboard" element={<Placeholder label="Electrician In-Charge Dashboard" />} />
        <Route path="/hod/dashboard" element={<Placeholder label="HOD Dashboard" />} />
        <Route path="/electrician-head/dashboard" element={<Placeholder label="Electrician Head Dashboard" />} />
        <Route path="/electrician/tickets" element={<Placeholder label="Electrician Tickets" />} />
        <Route path="/manager/dashboard" element={<Placeholder label="Manager Dashboard" />} />
        <Route path="/dean-iqac/dashboard" element={<Placeholder label="Dean IQAC Dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
