/**
 * useAuth
 * ---------------------------------------------------------------------------
 * In production this should be replaced with the real authentication context
 * (e.g. a JWT-based session, or context populated after a login call to the
 * Node.js + Express backend). It currently returns a demo signed-in user so
 * the header shows an explicit, named account instead of guessing an
 * identity from the current URL.
 *
 * This app has more than one demo persona because different sections are
 * used by different roles (the Electrician Head manages electricians/stock;
 * the HOD handles approvals). The caller (see Layout.jsx's ROLE_BY_PATH)
 * decides which persona is "logged in" for the active route.
 */
import { useMemo } from 'react'

export const DEMO_USERS = {
  electricianHead: {
    id: 'STF-2007',
    name: 'Mr. Selvaraj',
    role: 'Electrician Head',
    email: 'selvaraj@panimalar.ac.in',
  },
  hod: {
    id: 'HOD-IT-01',
    name: 'Dr. R. Kannan',
    role: 'HOD - IT',
    email: 'kannan@panimalar.ac.in',
  },
}

export default function useAuth(role = 'hod') {
  const user = useMemo(() => DEMO_USERS[role] || DEMO_USERS.hod, [role])
  return { user, isAuthenticated: true }
}
