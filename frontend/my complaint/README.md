# Accessory Repair Complaint Tracking System

React + Vite + Tailwind CSS pages for **Panimalar Engineering College**'s Repair &
Maintenance Management System, for Faculty/Staff.

- **Raise New Complaint** (`/`) — register a complaint about an accessory/equipment
  that needs repair.
- **My Complaints** (`/my-complaints`) — search, filter, paginate, view details of,
  and export the signed-in user's own complaints.

## Stack

Plain JavaScript (no TypeScript), React 18, Vite, Tailwind CSS, `react-router-dom`,
`lucide-react` for icons. No Bootstrap, no CSS Modules.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`. API calls to `/api/*` are proxied to
`http://localhost:4000` (see `vite.config.js`) — point that at your Express server, or
set `VITE_API_BASE_URL` in a `.env` file to call a different origin.

## Project structure

```
src/
  api/
    complaintApi.js          # POST /api/complaints (Raise New Complaint)
    complaintsApi.js         # GET /api/complaints/my (+ /summary), with a
                              # client-side sample-data fallback (see below)
  data/sampleComplaints.js   # 12 realistic accessory-repair sample records
  utils/
    sla.js                    # 3-day SLA math shared by the table + modal
    csvExport.js               # client-side CSV export for "Export"
  components/
    Sidebar.jsx               # navy nav, routed active state, Quick Links
    Header.jsx                 # hamburger, notifications, messages, profile
    CategoryCard.jsx           # selectable accessory category tile
    FileUpload.jsx              # drag & drop attachments (jpg/png/pdf/docx, 5MB)
    InfoCards.jsx                # Guidelines / SLA / Need Help / Workflow Summary
    StatusBadge.jsx, PriorityBadge.jsx, SLAIndicator.jsx
    SummaryCards.jsx, FilterBar.jsx, Pagination.jsx
    ComplaintsTable.jsx, ComplaintDetailsModal.jsx
  hooks/useAuth.js             # stand-in for the real auth/session context
  pages/
    RaiseComplaint.jsx          # "Raise New Complaint" page + form logic
    MyComplaints.jsx             # "My Complaints" page: search/filter/paginate
  App.jsx, main.jsx, index.css   # router + shared layout
```

## Backend contract

Suggested endpoints (Node.js + Express + Prisma + PostgreSQL/Neon):

### Create a complaint

```
POST /api/complaints
Content-Type: multipart/form-data

category, subCategory, problemTitle, location, floor, roomNo, asset,
description, priority, reportedBy, mobile, email, department,
reportedOn, status, attachments[]
```

### List the signed-in user's complaints

```
GET /api/complaints/my?search=&status=&category=&fromDate=&toDate=&page=1&limit=10
-> { "data": Complaint[], "total": number, "page": number, "limit": number }

GET /api/complaints/my/summary
-> { "total": number, "open": number, "inProgress": number, "resolved": number, "overdue": number }
```

`src/api/complaintsApi.js` calls these and, **only if the request fails** (e.g. no
backend running yet), falls back to filtering the bundled sample dataset in
`src/data/sampleComplaints.js` client-side so the page stays fully interactive
during frontend development. A banner on the My Complaints page makes it obvious
when sample data is being shown. Once the endpoints respond, the fallback is
never used.

Response (`201 Created`):

```json
{
  "id": "uuid",
  "complaintId": "CMP-2026-000123",
  "status": "COMPLAINT_REGISTERED",
  "createdAt": "2026-08-23T10:15:00.000Z",
  "updatedAt": "2026-08-23T10:15:00.000Z",
  "...": "the rest of the submitted fields"
}
```

A minimal Prisma model to match:

```prisma
enum ComplaintStatus {
  COMPLAINT_REGISTERED
  INSPECTION
  REPAIR_ASSIGNED
  ACTION_TAKEN
  VERIFICATION
  CLOSED
}

model Complaint {
  id           String          @id @default(uuid())
  complaintId  String          @unique
  category     String
  subCategory  String
  problemTitle String
  location     String
  floor        String
  roomNo       String
  asset        String?
  description  String
  priority     String
  reportedBy   String
  mobile       String
  email        String?
  department   String
  attachments  Attachment[]
  status       ComplaintStatus @default(COMPLAINT_REGISTERED)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
}

model Attachment {
  id          String     @id @default(uuid())
  complaintId String
  complaint   Complaint  @relation(fields: [complaintId], references: [id])
  url         String
  name        String
  size        Int
  type        String
}
```

Workflow implemented by `status`: **Complaint Registered → Inspection → Repair
Assigned → Action Taken → Verification → Closed**.

The SLA is fixed at **3 days from the date of approval/processing** — see
`src/utils/sla.js` if that policy ever needs to change; every SLA label, progress
bar, and the "Overdue" summary count derive from that one function.

## Notes

- `src/hooks/useAuth.js` currently returns a mock signed-in Faculty/Staff user
  (`Mr. Prakash`) so "Reported By" / "Email ID" are pre-filled correctly, and My
  Complaints is scoped to that user server-side. Swap it for your real auth
  context/session when wiring this into the full app.
- The Raise Complaint form validates all fields marked `*` client-side; the
  backend should still re-validate before writing to PostgreSQL.
- My Complaints is read-only for Faculty/Staff by design — no editing of
  technician-only fields (inspection, repair, action-taken, verification,
  closure) is exposed on this page.
- No reference screenshot was attached to either request, so the visual design
  (navy sidebar, blue primary, white cards) follows the written spec directly.
