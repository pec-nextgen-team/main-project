/**
 * validation.js
 * ---------------------------------------------------------------------------
 * Pure, framework-free validation functions so they're easy to unit test
 * and easy to reuse if a "Forgot Password" form is built later.
 * ---------------------------------------------------------------------------
 */

export function validateEmployeeId(value) {
  if (!value.trim()) return "Employee ID is required.";
  if (value.trim().length < 3) return "Employee ID looks too short.";
  return undefined;
}

export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  return undefined;
}

export function validateLoginForm(employeeId, password) {
  const errors = {};

  const employeeIdError = validateEmployeeId(employeeId);
  if (employeeIdError) errors.employeeId = employeeIdError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
