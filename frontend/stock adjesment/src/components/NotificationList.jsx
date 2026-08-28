import { BellOff } from 'lucide-react'
import NotificationRow from './NotificationRow'
import Pagination from './Pagination'

export default function NotificationList({
  notifications,
  filteredCount,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onViewComplaint,
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface shadow-sm">
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-app text-ink-400">
            <BellOff className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-ink-700">No notifications here</p>
          <p className="text-[13px] text-ink-400">Nothing matches this filter right now.</p>
        </div>
      ) : (
        <div>
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              onMarkUnread={onMarkUnread}
              onDelete={onDelete}
              onViewComplaint={onViewComplaint}
            />
          ))}
        </div>
      )}

      {filteredCount > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={filteredCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
