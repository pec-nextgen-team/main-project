import { useOutletContext } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import SummaryCards from '../components/SummaryCards'
import FilterBar from '../components/FilterBar'
import NotificationList from '../components/NotificationList'
import PreferencesCard from '../components/PreferencesCard'
import SummaryChart from '../components/SummaryChart'
import QuickActions from '../components/QuickActions'
import ImportantNotes from '../components/ImportantNotes'

export default function NotificationsPage() {
  const nz = useOutletContext()

  const handleViewComplaint = (notification) => {
    console.log('Navigate to complaint:', notification.complaintId)
  }

  return (
    <>
      <PageHeader title="Notifications" crumbs={[{ label: 'Home', path: '/' }, { label: 'Notifications' }]} />

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
    </>
  )
}
