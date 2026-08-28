import { useMemo, useState, useCallback } from 'react'
import { seedNotifications, currentUser } from '../data/notifications'
import { getTypeMeta } from './notificationMeta'

const PAGE_SIZE = 8

// This hook owns everything the Notifications page needs. Every mutation
// here maps 1:1 to a suggested endpoint from the spec:
//   markAsRead      -> PATCH /api/notifications/:id/read
//   markAllRead     -> PATCH /api/notifications/read-all
//   removeOne       -> DELETE /api/notifications/:id
//   clearAll        -> DELETE /api/notifications/clear-all
// Swapping the in-memory array for real fetch() calls does not require
// touching any component that consumes this hook.
export function useNotifications() {
  const [notifications, setNotifications] = useState(seedNotifications)
  const [activeTab, setActiveTab] = useState('all')
  const [typeGroup, setTypeGroup] = useState('all')
  const [page, setPage] = useState(1)
  const [dnd, setDnd] = useState(false)
  const [snoozedUntil, setSnoozedUntil] = useState(null)

  const filtered = useMemo(() => {
    let list = notifications

    if (activeTab === 'unread') {
      list = list.filter((n) => !n.isRead)
    } else if (activeTab !== 'all') {
      list = list.filter((n) => getTypeMeta(n.type).category === activeTab)
    }

    if (typeGroup !== 'all') {
      list = list.filter((n) => getTypeMeta(n.type).group === typeGroup)
    }

    return [...list].sort((a, b) => b.createdAt - a.createdAt)
  }, [notifications, activeTab, typeGroup])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const counts = useMemo(() => {
    const byCategory = { all: notifications.length, unread: 0, alerts: 0, reminders: 0, updates: 0, system: 0 }
    let overdue = 0
    let dueToday = 0
    const now = new Date()
    for (const n of notifications) {
      if (!n.isRead) byCategory.unread += 1
      const meta = getTypeMeta(n.type)
      byCategory[meta.category] = (byCategory[meta.category] ?? 0) + 1
      if (n.type === 'SLA_OVERDUE') overdue += 1
      if (n.type === 'SLA_REMINDER' || n.type === 'VERIFICATION_PENDING') {
        const hoursOld = (now - n.createdAt) / 3600000
        if (hoursOld < 24) dueToday += 1
      }
    }
    return { ...byCategory, overdue, dueToday, total: notifications.length }
  }, [notifications])

  const chartData = useMemo(() => {
    const totals = { alerts: 0, reminders: 0, updates: 0, system: 0 }
    for (const n of notifications) {
      const meta = getTypeMeta(n.type)
      totals[meta.category] += 1
    }
    return totals
  }, [notifications])

  const goToPage = useCallback(
    (p) => setPage(Math.min(Math.max(1, p), totalPages)),
    [totalPages],
  )

  const setTab = useCallback((tab) => {
    setActiveTab(tab)
    setPage(1)
  }, [])

  const setType = useCallback((group) => {
    setTypeGroup(group)
    setPage(1)
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n)),
    )
  }, [])

  const markAsUnread = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: false, readAt: null } : n)),
    )
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.isRead ? n : { ...n, isRead: true, readAt: new Date() })))
  }, [])

  const removeOne = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    user: currentUser,
    notifications: pageItems,
    allCount: notifications.length,
    filteredCount: filtered.length,
    counts,
    chartData,
    activeTab,
    setActiveTab: setTab,
    typeGroup,
    setTypeGroup: setType,
    page: safePage,
    totalPages,
    pageSize: PAGE_SIZE,
    goToPage,
    markAsRead,
    markAsUnread,
    markAllRead,
    removeOne,
    clearAll,
    dnd,
    setDnd,
    snoozedUntil,
    setSnoozedUntil,
  }
}
