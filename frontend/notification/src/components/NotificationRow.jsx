import { useState } from 'react'
import { MoreVertical, Eye, MailOpen, Mail, Trash2 } from 'lucide-react'
import { getTypeMeta, getColorStyles, PRIORITY_STYLES } from '../lib/notificationMeta'
import { formatRelativeTime } from '../lib/formatTime'

export default function NotificationRow({ notification, onMarkRead, onMarkUnread, onDelete, onViewComplaint }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const meta = getTypeMeta(notification.type)
  const colors = getColorStyles(notification.type)
  const Icon = meta.icon
  const priorityStyle = PRIORITY_STYLES[notification.priority]

  const handleRowClick = () => {
    if (!notification.isRead) onMarkRead(notification.id)
  }

  return (
    <div
      onClick={handleRowClick}
      className={`group relative flex cursor-pointer gap-3 border-b border-border-soft px-4 py-3.5 transition-colors last:border-b-0 hover:bg-app/60 sm:px-5 ${
        !notification.isRead ? 'bg-brand-50/40' : 'bg-surface'
      }`}
    >
      <div className="flex w-4 shrink-0 items-start justify-center pt-1.5">
        {!notification.isRead && <span className="h-2 w-2 rounded-full bg-brand-600" aria-label="Unread" />}
      </div>

      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ${colors.chipBg} ${colors.chipText} ${colors.ring}`}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <p className={`text-[14px] leading-snug ${!notification.isRead ? 'font-bold text-ink-900' : 'font-medium text-ink-700'}`}>
            {notification.title}
          </p>
          <span className="shrink-0 text-[12px] text-ink-400">{formatRelativeTime(notification.createdAt)}</span>
        </div>
        <p className="mt-0.5 text-[13px] leading-snug text-ink-600">{notification.message}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-app px-2 py-0.5 text-[11.5px] font-medium text-ink-500">
            {meta.module} · {notification.relatedModule}
          </span>
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.ring}`}>
            {notification.priority}
          </span>
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen((v) => !v)
          }}
          onBlur={() => setTimeout(() => setMenuOpen(false), 120)}
          className="rounded-md p-1.5 text-ink-400 hover:bg-app hover:text-ink-700"
          aria-label="Notification actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-10 w-44 overflow-hidden rounded-lg border border-border-subtle bg-surface py-1 shadow-lg">
            {notification.complaintId && (
              <button
                onMouseDown={(e) => {
                  e.stopPropagation()
                  onViewComplaint(notification)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink-700 hover:bg-app"
              >
                <Eye className="h-3.5 w-3.5" /> View Complaint
              </button>
            )}
            {notification.isRead ? (
              <button
                onMouseDown={(e) => {
                  e.stopPropagation()
                  onMarkUnread(notification.id)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink-700 hover:bg-app"
              >
                <Mail className="h-3.5 w-3.5" /> Mark as Unread
              </button>
            ) : (
              <button
                onMouseDown={(e) => {
                  e.stopPropagation()
                  onMarkRead(notification.id)
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-ink-700 hover:bg-app"
              >
                <MailOpen className="h-3.5 w-3.5" /> Mark as Read
              </button>
            )}
            <button
              onMouseDown={(e) => {
                e.stopPropagation()
                onDelete(notification.id)
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-danger-600 hover:bg-danger-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Notification
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
