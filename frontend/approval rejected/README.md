# Repair & Maintenance Management System — Approvals: Rejected

React + Vite + Tailwind CSS page for Panimalar Engineering College's
Repair & Maintenance Management System, implementing the
`/approvals/rejected` screen.

## Note on the reference screenshot

No screenshot file actually arrived with this build request — only the
detailed text specification did. Every layout, color, spacing, and
copy decision here was built directly from that spec (widths, colors,
card contents, table columns, sample records, etc., are all followed
literally). If you have the screenshot, share it and I can true up any
pixel-level details (exact spacing, font sizes, icon choices) against it.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173 — it redirects straight to
`/approvals/rejected`.

## Structure

```
src/
  components/       Reusable UI pieces (Sidebar, TopHeader, cards, table, modal...)
  pages/
    ApprovalsRejected.jsx   The Approvals > Rejected page
    PlaceholderPage.jsx     Stand-in for sibling pages (Dashboard, Tickets, etc.)
  data/
    mockData.js       Mock records; matches the shape GET /api/approvals/rejected
                       and GET /api/tickets/:ticketId are expected to return
  App.jsx             Route table (React Router)
  main.jsx            Entry point
```

## Wiring to the real API later

Replace the import of `rejectedComplaints` in
`src/pages/ApprovalsRejected.jsx` with a `fetch('/api/approvals/rejected')`
call (e.g. in a `useEffect`), and point `ViewComplaintModal` at
`GET /api/tickets/:ticketId` for full detail if you want to lazy-load
details instead of using the row's already-fetched data.

## What's implemented

- Sidebar with the full menu, expanded Approvals submenu, Rejected highlighted
- Top header with search-free layout matching the spec (notifications, mail, user)
- Page header with red X icon + breadcrumb
- 4 summary cards
- Filter panel: search, category, sub-category, priority, date range, location,
  reset, and CSV export — all functional against the mock data
- Rejected complaints table with category/priority/rejection-reason badges
- View modal with full complaint detail
- Pagination (functional, currently 6 records)
- Right column: SLA info, rejection reasons, workflow summary, help card
- Bottom note
- Responsive down to mobile (collapsible sidebar, wrapping cards, scrollable table)
