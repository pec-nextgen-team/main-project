/**
 * Shared data-shape documentation for the Login module.
 * These JSDoc typedefs preserve the original API contract in plain JavaScript.
 */

/** @typedef {"SUPERVISOR"|"ELECTRICIAN_INCHARGE"|"HOD"|"ELECTRICIAN_HEAD"|"ELECTRICIAN"|"MANAGER"|"DEAN_IQAC"} UserRole */

/** @typedef {{ employeeId: string, password: string, rememberMe: boolean }} LoginRequest */

/** @typedef {{ id: string, employeeId: string, name: string, role: UserRole, department?: string, email?: string }} AuthUser */

/** @typedef {{ token: string, refreshToken?: string, expiresIn: number, user: AuthUser }} LoginResponse */

/** @typedef {{ message: string, code?: "INVALID_CREDENTIALS"|"ACCOUNT_LOCKED"|"ACCOUNT_DISABLED"|"SERVER_ERROR" }} LoginErrorResponse */

/** @typedef {{ employeeId?: string, password?: string, form?: string }} LoginFormErrors */

export {};
