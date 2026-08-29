import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import PanimalarLogo from '../../components/branding/PanimalarLogo';
import AnniversaryBadge from '../../components/branding/AnniversaryBadge';
import { FormField, Input, Select } from '../../components/common/FormControls';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../services/authService';

export function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(ROLES.STAFF_STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Please enter your Institutional ID / Register Number.');
      return;
    }
    if (!password) {
      setError('Please enter your account password.');
      return;
    }

    try {
      setLoading(true);
      await login({ identifier, password, role });
      if (onLoginSuccess) {
        onLoginSuccess(role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Institutional Crest & Anniversary Header — Same Horizontal Row */}
        <div className="flex flex-col items-center">
          <div className="w-full flex items-center justify-between gap-4 p-4 rounded-xl bg-[#0A1930] border border-slate-800 text-white shadow-md">
            {/* Left: Panimalar Crest & College Branding */}
            <div className="flex items-center gap-3 min-w-0">
              <PanimalarLogo className="w-12 h-14 shrink-0 drop-shadow-md" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-black tracking-widest text-amber-400 uppercase leading-none">
                  PANIMALAR
                </span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight mt-0.5">
                  ENGINEERING COLLEGE
                </span>
                <span className="text-[10px] text-slate-300 font-medium tracking-wider uppercase mt-0.5">
                  An Autonomous Institution • Chennai
                </span>
              </div>
            </div>

            {/* Right: EXACT 26-Years Logo */}
            <div className="shrink-0 flex items-center">
              <AnniversaryBadge className="w-14 h-16 drop-shadow-md" />
            </div>
          </div>

          <div className="mt-3 inline-block px-3 py-1 bg-blue-900 text-amber-300 text-xs font-bold rounded-md shadow-xs">
            Repair & Maintenance Management System
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-xl border border-slate-200 shadow-md">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Institutional Single Sign-On
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access the maintenance portal using your registered college credentials.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Role Selection */}
            <FormField label="Designation / System Role" required id="role-select">
              <Select
                id="role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                options={Object.values(ROLES)}
                placeholder="Select designation..."
              />
            </FormField>

            {/* Institutional ID */}
            <FormField label="Institutional ID / Staff ID / Reg No" required id="user-id">
              <Input
                id="user-id"
                type="text"
                placeholder="e.g. PEC/STAFF/1042 or 211421104001"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                icon={User}
                autoComplete="username"
              />
            </FormField>

            {/* Password */}
            <FormField label="Password" required id="password-input">
              <div className="relative flex items-center">
                <Input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center"
              >
                Sign In to Portal
              </Button>
            </div>
          </form>

          {/* Institutional Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Authorized personnel only. All access is logged for institutional audit.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Panimalar Engineering College, Varadharajapuram, Poonamallee, Chennai – 600 123.
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
