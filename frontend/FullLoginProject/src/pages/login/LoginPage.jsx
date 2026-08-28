import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import panimalarLogo from "./assets/panimalar-logo.jpeg";
import years26Badge from "./assets/panimalar-26years.jpeg";

/**
 * Maps the `role` field of AuthUser (see ./types.js) to its landing route.
 * Every role in the documented UserRole union has an explicit destination;
 * an unrecognized or missing role still falls back to the generic
 * "/dashboard" placeholder rather than failing the redirect.
 */
const ROLE_LANDING_ROUTES = {
  SUPERVISOR: "/supervisor/dashboard",
  ELECTRICIAN_INCHARGE: "/electrician-incharge/dashboard",
  HOD: "/hod/dashboard",
  ELECTRICIAN_HEAD: "/electrician-head/dashboard",
  ELECTRICIAN: "/electrician/tickets",
  MANAGER: "/manager/dashboard",
  DEAN_IQAC: "/dean-iqac/dashboard",
};

/**
 * LoginPage.jsx
 * ---------------------------------------------------------------------------
 * Entry point of the Accessories Repair & ATR Management System.
 * Flow this page kicks off:
 *   Login -> Complaint Registered -> Inspection -> Repair Assigned
 *         -> Action Taken -> Verification -> Closed
 *
 * On success this routes by user.role (see ROLE_LANDING_ROUTES above) to
 * that role's dashboard - e.g. HOD -> /hod/dashboard, ELECTRICIAN ->
 * /electrician/tickets. Each destination is currently a placeholder page
 * (see App.jsx) until the real per-role dashboards are built elsewhere in
 * the project; the routing itself is real and role-aware today.
 * ---------------------------------------------------------------------------
 */
export default function LoginPage() {
  const navigate = useNavigate();

  function handleLoginSuccess(user) {
    const destination = ROLE_LANDING_ROUTES[user?.role] ?? "/dashboard";
    navigate(destination, { state: { user } });
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
