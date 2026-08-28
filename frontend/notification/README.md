# Notifications Page — Accessory Repair Complaint Tracking System

A fully functional Notifications page for Panimalar Engineering College's
Repair & Maintenance Management System, built with React + Vite + Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## What's wired up

- Dark navy sidebar with the full nav list, Notifications highlighted as active
- White header with bell/mail badges and user info
- 5 summary cards (Total, Unread, Due Today, Overdue, Mark All Read / Clear All)
- Filter tabs (All / Unread / Alerts / Reminders / Updates / System) with live counts
- Type dropdown + Filter + Mark All Read controls
- Notification list with unread state, priority badges, and a working 3-dot menu
  (Mark as Read/Unread, View Complaint, Delete)
- Working pagination (8 per page)
- Right rail: Notification Preferences, a live SVG donut chart (Notification Summary),
  Quick Actions (history, snooze, Do Not Disturb toggle, Clear All w/ confirmation),
  and Important Notes
- Fully responsive: sidebar collapses to a drawer, cards wrap, tabs scroll horizontally,
  right rail moves below the list on small screens

## Swapping in the real backend

All state and mutations live in `src/lib/useNotifications.js`. Each function there maps
1:1 to a suggested endpoint from the spec:

- `markAsRead(id)`   → `PATCH /api/notifications/:id/read`
- `markAllRead()`    → `PATCH /api/notifications/read-all`
- `removeOne(id)`    → `DELETE /api/notifications/:id`
- `clearAll()`       → `DELETE /api/notifications/clear-all`

Replace `seedNotifications` (in `src/data/notifications.js`) with a `GET /api/notifications`
fetch, and swap the in-memory `setNotifications` calls for `fetch()` calls with optimistic
updates — no component outside this hook needs to change.

The notification type → category/group/icon/color mapping used everywhere (tabs, type
dropdown, chart, row icons) lives in `src/lib/notificationMeta.js`, keyed by the same
`NotificationType` enum values from the spec (`SLA_OVERDUE`, `COMPLAINT_ASSIGNED`, etc.),
so it lines up directly with the Prisma model.
