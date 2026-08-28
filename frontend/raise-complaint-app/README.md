# Accessory Repair Complaint Tracking System — Raise New Complaint

React + Vite + Tailwind CSS page for **Panimalar Engineering College**'s Repair &
Maintenance Management System. Lets Faculty/Staff register a complaint about an
accessory/equipment that needs repair.

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
  api/complaintApi.js       # fetch layer -> POST /api/complaints
  components/
    Sidebar.jsx              # dark navy nav, "Raise Complaint" active
    Header.jsx                # hamburger, notifications, messages, profile
    CategoryCard.jsx          # selectable accessory category tile
    FileUpload.jsx            # drag & drop attachments (jpg/png/pdf/docx, 5MB)
    InfoCards.jsx              # Guidelines / SLA / Need Help / Workflow Summary
  hooks/useAuth.js            # stand-in for the real auth/session context
  pages/RaiseComplaint.jsx    # the full "Raise New Complaint" page + form logic
  App.jsx, main.jsx, index.css
```

## Backend contract

Suggested endpoint (Node.js + Express + Prisma + PostgreSQL/Neon):

```
POST /api/complaints
Content-Type: multipart/form-data

category, subCategory, problemTitle, location, floor, roomNo, asset,
description, priority, reportedBy, mobile, email, department,
reportedOn, status, attachments[]
```

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

## Notes

- `src/hooks/useAuth.js` currently returns a mock signed-in Faculty/Staff user
  (`Mr. Prakash`) so "Reported By" / "Email ID" are pre-filled correctly. Swap it
  for your real auth context/session when wiring this into the full app.
- The form validates all fields marked `*` client-side; the backend should still
  re-validate before writing to PostgreSQL.
- No reference screenshot was attached to this request, so the visual design
  (navy sidebar, blue primary, white cards) follows the written spec directly.
