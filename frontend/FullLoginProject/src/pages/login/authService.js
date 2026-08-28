/**
 * authService.js
 * ---------------------------------------------------------------------------
 * Thin API layer for authentication. Kept isolated from LoginForm so the
 * backend team can see exactly one place that needs to match their contract,
 * and so the fetch logic is swappable (e.g. for axios) without touching UI.
 *
 * BACKEND CONTRACT
 * -----------------------------------------------------------------------
 * POST {BASE_URL}/auth/login
 *   Request body   (application/json): LoginRequest  { employeeId, password, rememberMe }
 *   Success (200)  (application/json): LoginResponse { token, refreshToken?, expiresIn, user }
 *   Failure (401/423/500) (application/json): LoginErrorResponse { message, code }
 *
 * Suggested `users` table columns for the DB team, based on the fields this
 * page collects and the roles in the workflow chart:
 *   id, employee_id (unique), name, password_hash, role, department,
 *   email, is_active, failed_login_attempts, locked_until, created_at
 * -----------------------------------------------------------------------
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class LoginApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "LoginApiError";
    this.status = status;
    this.code = code;
  }
}

export async function loginRequest(payload) {
  let response;

  try {
    response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new LoginApiError(
      "Unable to reach the server. Please check your connection and try again.",
      0,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorBody = data ?? {};
    throw new LoginApiError(
      errorBody.message ?? "Login failed. Please check your credentials.",
      response.status,
      errorBody.code,
    );
  }

  return data;
}

/** Persists the session according to the "Remember Me" choice. */
export function persistSession(result, rememberMe) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("atr_token", result.token);
  storage.setItem("atr_user", JSON.stringify(result.user));
  if (result.refreshToken) {
    storage.setItem("atr_refresh_token", result.refreshToken);
  }
}
