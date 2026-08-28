import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export function MainLayout({ currentRoute, onNavigate, children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={onNavigate}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Container (Pushed left for fixed sidebar on lg screen) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <TopHeader
          onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
          onNavigate={onNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
