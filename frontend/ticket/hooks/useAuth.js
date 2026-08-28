/**
 * useAuth
 * ---------------------------------------------------------------------------
 * In production this should be replaced with the real authentication context
 * (e.g. a JWT-based session, or context populated after a login call to the
 * Node.js + Express backend). It currently returns the signed-in user so the
 * header on the Tickets page reflects the logged-in account rather than a
 * hard-coded name, consistent with the useAuth hook used by the other
 * modules in this project.
 */
import { useMemo } from "react";

export default function useAuth() {
  const user = useMemo(
    () => ({
      id: "TECH-1001",
      name: "Mr. Selvaraj",
      role: "Technician / Service Head",
      email: "selvaraj@panimalar.ac.in",
    }),
    []
  );

  return { user, isAuthenticated: true };
}
