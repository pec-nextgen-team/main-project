/**
 * useAuth
 * ---------------------------------------------------------------------------
 * In production this should be replaced with the real authentication context
 * (e.g. a JWT-based session, or context populated after a login call to the
 * Node.js + Express backend). It currently returns a demo signed-in user so
 * fields like "Reported By" / "Email ID" / "Received By" are pre-filled from
 * "the logged-in account" rather than hard-coded per page.
 *
 * The app has more than one demo persona because different pages are used by
 * different roles (Faculty/Staff raise & track complaints; the Electrician
 * Head processes stock). Callers pass which persona is "logged in" for that
 * route — see ROLE_BY_PATH in App.jsx.
 */
import { useMemo } from 'react';

export const DEMO_USERS = {
  faculty: {
    id: 'FAC-1042',
    name: 'Mr. Prakash',
    role: 'Faculty / Staff',
    email: 'prakash@panimalar.ac.in',
    mobile: '',
    department: 'Computer Science and Engineering',
    avatarInitials: 'MP',
  },
  electricianHead: {
    id: 'STF-2007',
    name: 'Mr. Selvaraj',
    role: 'Electrician Head',
    email: 'selvaraj@panimalar.ac.in',
    mobile: '9840055667',
    department: 'Maintenance & Stock Management',
    avatarInitials: 'MS',
  },
};

export default function useAuth(role = 'faculty') {
  const user = useMemo(() => DEMO_USERS[role] || DEMO_USERS.faculty, [role]);
  return { user, isAuthenticated: true };
}
