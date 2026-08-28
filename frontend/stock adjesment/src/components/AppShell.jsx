import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useNotifications } from '../lib/useNotifications'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nz = useNotifications()

  return (
    <div className="flex min-h-screen bg-app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} user={nz.user} unreadCount={nz.counts.unread} />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <Outlet context={nz} />
        </main>
      </div>
    </div>
  )
}
