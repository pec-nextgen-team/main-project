# Repair & Maintenance Management System

React + Vite + Tailwind CSS frontend (plus an Express + Prisma backend
stub) for Panimalar Engineering College's Repair & Maintenance
Management System.

Pages implemented so far:
- `/approvals/rejected` — Approvals: Rejected
- `/electrician/add` — Add Electrician (with a matching `POST /api/electricians` endpoint)

## Note on the reference screenshot

No screenshot file actually arrived with this build request — only the
detailed text specification did. Every layout, color, spacing, and
copy decision here was built directly from that spec (widths, colors,
card contents, table columns, sample records, etc., are all followed
literally). If you have the screenshot, share it and I can true up any
pixel-level details (exact spacing, font sizes, icon choices) against it.

## Getting started

Frontend:
```bash
npm install
npm run dev
```
Then open http://localhost:5173.

Backend (optional — only needed for the Add Electrician form to actually
persist data; without it the Save button will show the "Could not add
electrician" error toast, which is expected):
```bash
cd server
npm install
cp .env.example .env   # fill in your Neon/Postgres DATABASE_URL
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
The Vite dev server proxies `/api/*` to `http://localhost:4000`, so once
both are running the form saves for real.

## Structure

```
src/
  components/
    electrician/        Right-column info cards specific to Add Electrician
    Sidebar.jsx          Shared nav — Electrician submenu expanded, route-aware
                          Quick Links and active highlight
    TopHeader.jsx        Shared header — shows a role-appropriate signed-in user
                          depending on which section of the app is active
    FormField.jsx / FormInput.jsx / FormSelect.jsx / FormTextarea.jsx / FormSection.jsx
                          Reusable form primitives used by Add Electrician
    SpecializationCheckboxes.jsx
    Toast.jsx
    ...(table/card/badge components from the Approvals: Rejected page)
  pages/
    ApprovalsRejected.jsx
    AddElectrician.jsx
    PlaceholderPage.jsx   Stand-in for sibling pages not yet built
  data/
    mockData.js
    electricianOptions.js Dropdown option lists for the electrician form
  utils/
    validators.js         Email / phone / Aadhaar / PAN / PIN / date validation
  App.jsx                 Route table (React Router)
  main.jsx                Entry point

server/
  index.js                Express app entry
  prismaClient.js          Shared PrismaClient instance
  prisma/schema.prisma     Electrician model
  routes/electricians.js   GET /, GET /:id, POST /
  controllers/electricianController.js
```

## Wiring to the real API later

Replace the import of `rejectedComplaints` in
`src/pages/ApprovalsRejected.jsx` with a `fetch('/api/approvals/rejected')`
call (e.g. in a `useEffect`), and point `ViewComplaintModal` at
`GET /api/tickets/:ticketId` for full detail if you want to lazy-load
details instead of using the row's already-fetched data.

## What's implemented

**Approvals: Rejected**
- Sidebar with the full menu, expanded Approvals submenu, Rejected highlighted
- Top header with notifications, mail, and signed-in user
- Page header with red X icon + breadcrumb
- 4 summary cards
- Filter panel: search, category, sub-category, priority, date range, location,
  reset, and CSV export — all functional against the mock data
- Rejected complaints table with category/priority/rejection-reason badges
- View modal with full complaint detail
- Pagination (functional, currently 6 records)
- Right column: SLA info, rejection reasons, workflow summary, help card
- Bottom note

**Add Electrician**
- Sidebar Electrician submenu expanded with "Add Electrician" active-highlighted
- Auto-generated, read-only Employee ID
- 4 form sections: Personal Information, Employment Information,
  Specialization & Skills (checkbox grid + "enter other specialization" +
  skills textarea with character counter), Emergency Contact
- Full client-side validation (required fields, email, 10-digit Indian phone,
  12-digit Aadhaar, PAN format, 6-digit PIN, date sanity) with inline error
  messages
- Address and Skills character counters (0/200)
- Save button posts to `POST /api/electricians`; success/error toast either way
- Cancel resets the form and returns to the electrician list
- Right column: Electrician Information, Employment Types, Specialization
  Help, and a 4-step Workflow card
- Matching Express + Prisma backend: schema, controller, and routes for
  `GET /api/electricians`, `GET /api/electricians/:id`, `POST /api/electricians`

Both pages are responsive down to mobile (collapsible sidebar, wrapping
cards/columns, scrollable table, stacked form fields).
