import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import TopHeader from './TopHeader.jsx'
import useAuth from '../hooks/useAuth.js'

// Which demo persona is "logged in" for a given section of the app - see
// useAuth.js. This replaces the old approach of guessing a name/role from
// the URL directly inside TopHeader.
function roleForPath(pathname) {
  if (pathname.startsWith('/electrician') || pathname.startsWith('/stock-management')) {
    return 'electricianHead'
  }
  return 'hod'
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth(roleForPath(location.pathname))

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Sidebar mobileOpen={sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      <div className="lg:pl-[200px] min-h-screen flex flex-col">
        <TopHeader onOpenMobileSidebar={() => setSidebarOpen(true)} user={user} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
