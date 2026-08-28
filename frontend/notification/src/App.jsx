import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import FilterBar from './components/FilterBar'
import NotificationList from './components/NotificationList'
import PreferencesCard from './components/PreferencesCard'
import SummaryChart from './components/SummaryChart'
import QuickActions from './components/QuickActions'
import ImportantNotes from './components/ImportantNotes'
import { useNotifications } from './lib/useNotifications'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nz = useNotifications()

  const handleViewComplaint = (notification) => {
    // Placeholder for router navigation to `notification.actionUrl`.
    console.log('Navigate to complaint:', notification.complaintId)
  }

  return (
    <div className="flex min-h-screen bg-app">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          user={nz.user}
          unreadCount={nz.counts.unread}
        />

        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">Notifications</h2>
            <p className="mt-0.5 text-[13px] text-ink-400">
              <span className="text-ink-500">Home</span>
              <span className="mx-1.5">/</span>
              <span className="font-medium text-ink-700">Notifications</span>
            </p>
          </div>

          <div className="space-y-4">
            <SummaryCards counts={nz.counts} onMarkAllRead={nz.markAllRead} onClearAll={nz.clearAll} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
              <div className="min-w-0 space-y-4">
                <FilterBar
                  activeTab={nz.activeTab}
                  onTabChange={nz.setActiveTab}
                  counts={nz.counts}
                  typeGroup={nz.typeGroup}
                  onTypeChange={nz.setTypeGroup}
                  onMarkAllRead={nz.markAllRead}
                />

                <NotificationList
                  notifications={nz.notifications}
                  filteredCount={nz.filteredCount}
                  page={nz.page}
                  totalPages={nz.totalPages}
                  pageSize={nz.pageSize}
                  onPageChange={nz.goToPage}
                  onMarkRead={nz.markAsRead}
                  onMarkUnread={nz.markAsUnread}
                  onDelete={nz.removeOne}
                  onViewComplaint={handleViewComplaint}
                />
              </div>

              <div className="space-y-4">
                <PreferencesCard />
                <SummaryChart data={nz.chartData} />
                <QuickActions
                  dnd={nz.dnd}
                  onToggleDnd={() => nz.setDnd((v) => !v)}
                  onSnooze={() => nz.setSnoozedUntil(new Date(Date.now() + 3600000))}
                  onClearAll={nz.clearAll}
                  onViewHistory={() => nz.setActiveTab('all')}
                />
                <ImportantNotes />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
