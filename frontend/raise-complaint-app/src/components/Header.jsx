import { Menu, Bell, Mail, ChevronDown } from 'lucide-react';
import panimalarLogo from '../assets/panimalar-logo.jpeg';
import years26Badge from '../assets/panimalar-26years.jpeg';

export default function Header({ onMenuClick, user, notificationCount = 4, messageCount = 2 }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        onClick={onMenuClick}
        className="hidden rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:inline-flex"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <img
        src={panimalarLogo}
        alt="Panimalar Engineering College"
        className="h-9 w-9 flex-shrink-0 object-contain"
      />

      <h1 className="truncate text-[15px] font-semibold text-slate-800 sm:text-base">
        Repair &amp; Maintenance Management System
      </h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <img
          src={years26Badge}
          alt="Celebrating 26 years of excellence in education"
          className="hidden h-9 w-9 flex-shrink-0 rounded-[6px] object-contain sm:block"
        />
        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <button
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Messages"
        >
          <Mail className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">
              {messageCount}
            </span>
          )}
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <button className="flex items-center gap-2.5 rounded-lg py-1.5 pl-1 pr-2 hover:bg-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {user.avatarInitials}
          </div>
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
        </button>
      </div>
    </header>
  );
}
