import React, { useState } from 'react';
import { Menu, Shield, UserCircle, LogOut, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function TopHeader({ onToggleMobile, onNavigate }) {
  const { user, role, switchRole, logout, availableRoles } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & System Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              PEC-RMMS
            </span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
              Repair & Maintenance Management System
            </h1>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
            Panimalar Engineering College (Autonomous)
          </span>
        </div>
      </div>

      {/* Right: Institutional Role & Account Controls */}
      <div className="flex items-center gap-3">
        {/* Role Selector Dropdown (Allows campus users to easily switch workflow perspective) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
            title="Institutional Role Workflow View"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline text-slate-500 font-normal">Active Role:</span>
            <span className="font-bold text-blue-900 truncate max-w-[140px] sm:max-w-none">
              {role}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setRoleMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-slate-200 shadow-lg py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Operational Perspective
                </div>
                {availableRoles.map((r) => {
                  const isCurrent = role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{r}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Account indicator / Login Link */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-semibold">
                <UserCircle className="w-5 h-5 text-slate-500" />
              </div>
              <span className="hidden md:inline font-semibold text-slate-900 truncate max-w-[120px]">
                {user.identifier}
              </span>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="px-3 py-1.5 rounded-md bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Portal Login
          </button>
        )}
      </div>
    </header>
  );
}

export default TopHeader;
