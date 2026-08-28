/**
 * useAuth
 * ---------------------------------------------------------------------------
 * In production this should be replaced with the real authentication context
 * (e.g. a JWT-based session, or context populated after a login call to the
 * Node.js + Express backend). It currently returns the signed-in user so the
 * "Reported By" / "Email ID" fields in the complaint form are pre-filled from
 * the logged-in account rather than hard-coded.
 */
import { useMemo } from 'react';

export default function useAuth() {
  const user = useMemo(
    () => ({
      id: 'FAC-1042',
      name: 'Mr. Prakash',
      role: 'Faculty / Staff',
      email: 'prakash@panimalar.ac.in',
      mobile: '',
      department: 'Computer Science and Engineering',
      avatarInitials: 'MP',
    }),
    []
  );

  return { user, isAuthenticated: true };
}
