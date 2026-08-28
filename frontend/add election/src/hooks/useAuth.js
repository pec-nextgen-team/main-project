/**
 * useAuth
 * ---------------------------------------------------------------------------
 * In production this should be replaced with the real authentication context
 * (e.g. a JWT-based session, or context populated after a login call to the
 * Node.js + Express backend). It currently returns the signed-in user so
 * TopHeader shows the actual logged-in account instead of guessing an
 * identity from the current route.
 */
import { useMemo } from 'react'

export default function useAuth() {
  const user = useMemo(
    () => ({
      id: 'HOD-IT-01',
      name: 'Dr. R. Kannan',
      role: 'HOD - IT',
      email: 'kannan@panimalar.ac.in',
    }),
    []
  )

  return { user, isAuthenticated: true }
}
