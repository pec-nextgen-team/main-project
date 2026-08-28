# Repair & Maintenance Management System — Panimalar Engineering College

A multi-page ERP front end built with React + Vite + Tailwind CSS v4, covering:

1. **Notifications** (`/notifications`) — accessory repair complaint notification center
2. **Stock Adjustments** (`/stock/adjustments`) — stock adjustment entry form

Both pages share one `AppShell` (sidebar + header) so the app feels like a single
unified ERP system, matching the supplied reference design.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173). It redirects to
`/notifications` by default — use the sidebar to get to Stock Management → Adjustments.

## Notifications page

- Dark navy sidebar with the full nested nav, Notifications highlighted as active
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

All state and mutations live in `src/lib/useNotifications.js`. Each function there maps
1:1 to a suggested endpoint from the original spec:

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
so it lines up directly with a Prisma model.

## Stock Adjustments page

- Section 1 — Adjustment Information: 5-column form (Adjustment No., Date, Type,
  Reference Type/No., Store, Department, Adjusted/Verified By, Reason), plus
  attachment upload and remarks
- Section 2 — Items to Adjust: editable line-item table with live per-row and
  total adjustment value calculation, add/remove rows
- Section 3 — Additional Information: Adjustment Impact / Affects Stock Value badges
  (impact flips Increase/Decrease automatically based on the selected Adjustment Type),
  Accounting Head, Approver, approval remarks, and Cancel / Save as Draft / Confirm actions
- Right rail: Adjustment Types radio list (synced live with the form's Adjustment Type
  dropdown), Stock Summary with progress bars, a Notes card, and Recent Adjustments

Form/table state lives in `src/pages/StockAdjustmentsPage.jsx`; seed data (items, stock
summary, recent adjustments, adjustment type list) lives in `src/data/stockAdjustments.js`.
Swap `seedItems`/`stockSummary`/`recentAdjustments` for real API data the same way as the
notifications hook, and point `onConfirm`/`onSaveDraft` at your `POST /api/stock-adjustments`
endpoint.

## Shared design system

- `src/components/Sidebar.jsx` — nested, collapsible nav; add a page by giving its
  sidebar item a `path` and adding a matching `<Route>` in `src/App.jsx`
- `src/components/Header.jsx` — top bar (menu, title, bell/mail badges, user)
- `src/components/AppShell.jsx` — wraps Sidebar + Header around `<Outlet>`, and hands
  the notifications hook down via router context so the header's unread badge always
  reflects live state
- `src/components/form/FormControls.jsx` — shared `Field`, `TextInput`, `SelectInput`,
  `TextArea`, `CardHeading` used by every form on the Stock Adjustments page
- `src/index.css` — Tailwind v4 `@theme` tokens (navy sidebar palette, brand blue,
  ink/text scale, success/warning/danger/info/violet status colors) shared by both pages

## Adding another page

1. Drop a page component in `src/pages/`
2. Add a `<Route path="...">` in `src/App.jsx`
3. Give the matching item (or child item) in `src/components/Sidebar.jsx` a `path`

It will automatically pick up the shared sidebar, header, fonts, colors, and form styles.
