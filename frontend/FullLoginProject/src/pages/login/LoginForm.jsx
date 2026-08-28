import { useState } from "react";
import { LoginApiError, loginRequest, persistSession } from "./authService";
import { hasErrors, validateLoginForm } from "./validation";

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const fieldErrors = validateLoginForm(employeeId, password);
    setErrors(fieldErrors);
    if (hasErrors(fieldErrors)) return;

    setIsSubmitting(true);
    try {
      const result = await loginRequest({
        employeeId: employeeId.trim(),
        password,
        rememberMe,
      });
      persistSession(result, rememberMe);
      onSuccess(result.user);
    } catch (err) {
      const message =
        err instanceof LoginApiError
          ? err.message
          : "Something went wrong. Please try again.";
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-[14px] border border-[#e3e7f1] bg-white px-8 py-9 shadow-[0_20px_45px_-25px_rgba(21,42,110,0.35)]"
      onSubmit={handleSubmit}
      noValidate
    >
      {errors.form && (
        <div
          className="mb-[1.1rem] rounded-[8px] border border-[#f3c3c3] bg-[#fdecec] px-[0.9rem] py-[0.65rem] text-[0.85rem] text-[#9c2c2c]"
          role="alert"
        >
          {errors.form}
        </div>
      )}

      <div className="mb-3">
        <label
          htmlFor="employeeId"
          className="mb-[0.35rem] block text-[0.85rem] font-semibold tracking-[0.01em] text-[#152a6e]"
        >
          Username / Employee ID
        </label>
        <input
          id="employeeId"
          name="employeeId"
          type="text"
          autoComplete="username"
          className={`w-full rounded-[8px] border px-[0.85rem] py-[0.65rem] text-[0.95rem] transition-[border-color,box-shadow] duration-150 outline-none focus:border-[#2f5fd0] focus:shadow-[0_0_0_3px_rgba(47,95,208,0.15)] ${errors.employeeId ? "!border-[#d64545] focus:shadow-[0_0_0_3px_rgba(214,69,69,0.15)]" : "border-[#cfd6e6]"}`}
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="e.g. EMP-1042"
          aria-invalid={!!errors.employeeId}
          aria-describedby={errors.employeeId ? "employeeId-error" : undefined}
          disabled={isSubmitting}
        />
        {errors.employeeId && (
          <div id="employeeId-error" className="mt-[0.3rem] text-[0.8rem] text-[#d64545]">
            {errors.employeeId}
          </div>
        )}
      </div>

      <div className="mb-2">
        <label
          htmlFor="password"
          className="mb-[0.35rem] block text-[0.85rem] font-semibold tracking-[0.01em] text-[#152a6e]"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={`w-full rounded-[8px] border px-[0.85rem] py-[0.65rem] pr-[3.4rem] text-[0.95rem] transition-[border-color,box-shadow] duration-150 outline-none focus:border-[#2f5fd0] focus:shadow-[0_0_0_3px_rgba(47,95,208,0.15)] ${errors.password ? "!border-[#d64545] focus:shadow-[0_0_0_3px_rgba(214,69,69,0.15)]" : "border-[#cfd6e6]"}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute right-[0.6rem] top-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent px-[0.4rem] py-[0.2rem] text-[0.8rem] font-semibold text-[#5c6b8a] hover:text-[#2f5fd0]"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={0}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <div id="password-error" className="mt-[0.3rem] text-[0.8rem] text-[#d64545]">
            {errors.password}
          </div>
        )}
      </div>

      <div className="my-[1.1rem] mb-[1.4rem] flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            className="mr-2 h-4 w-4 accent-[#152a6e]"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isSubmitting}
          />
          <label
            htmlFor="rememberMe"
            className="cursor-pointer select-none text-[0.85rem] text-[#33415e]"
          >
            Remember me
          </label>
        </div>

        <button
          type="button"
          className="border-0 bg-transparent p-0 text-[0.85rem] font-medium text-[#2f5fd0] no-underline hover:underline"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded-[8px] border-0 bg-[#152a6e] px-4 py-[0.7rem] font-semibold tracking-[0.02em] text-white transition-[background,transform] duration-150 hover:enabled:bg-[#1e3a94] disabled:cursor-not-allowed disabled:bg-[#8b97c2]"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
