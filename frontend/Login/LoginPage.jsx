import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import panimalarLogo from "./assets/panimalar-logo.jpeg";
import years26Badge from "./assets/panimalar-26years.jpeg";

/**
 * LoginPage.jsx
 * ---------------------------------------------------------------------------
 * Entry point of the Accessories Repair & ATR Management System.
 * Flow this page kicks off:
 *   Login -> Complaint Registered -> Inspection -> Repair Assigned
 *         -> Action Taken -> Verification -> Closed
 *
 * On success this pushes the user into "/dashboard"; routing per-role
 * (e.g. HOD vs Electrician landing pages) can be layered in once the
 * dashboard routes exist - see the TODO below.
 * ---------------------------------------------------------------------------
 */
export default function LoginPage() {
  const navigate = useNavigate();

  function handleLoginSuccess(user) {
    // TODO(backend): once role-specific dashboards exist, route by user.role
    // e.g. HOD -> /hod/dashboard, ELECTRICIAN -> /electrician/tickets, etc.
    navigate("/dashboard", { state: { user } });
  }

  function handleForgotPassword() {
    navigate("/forgot-password");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#eef1fb_0%,#f7f9fd_55%,#ffffff_100%)] p-6">
      <div className="w-full max-w-[420px] max-[400px]:max-w-full">
        <div className="mb-2 flex items-center justify-between">
          <img
            src={panimalarLogo}
            alt="Panimalar Engineering College"
            className="h-16 w-16 object-contain"
          />
          <img
            src={years26Badge}
            alt="Celebrating 26 years of excellence in education"
            className="h-12 w-12 rounded-[8px] object-contain"
          />
        </div>
        <p className="mb-[0.9rem] text-center text-[0.95rem] font-bold tracking-[0.02em] text-[#152a6e]">
          Panimalar Engineering College
        </p>
        <h1 className="mb-[0.15rem] text-center text-[1.35rem] font-bold text-[#152a6e]">
          Accessories Repair &amp; ATR
        </h1>
        <p className="mb-[1.8rem] text-center text-[0.9rem] text-[#5c6b8a]">
          Complaint-to-Repair Tracking System — sign in to continue
        </p>

        <LoginForm
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />

        <p className="mt-[1.4rem] text-center text-[0.78rem] text-[#8b97b3]">
          Trouble signing in? Contact your department HOD or the system admin.
        </p>
      </div>
    </div>
  );
}
