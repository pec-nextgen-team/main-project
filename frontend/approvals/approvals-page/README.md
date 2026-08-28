# Approvals Page — Integration Guide

This delivers the **Pending Approvals** page for the Repair & Maintenance
Management System, built with React + Vite + Tailwind CSS (plain JS, no
TypeScript, no Bootstrap).

## Files

```
src/
  data/
    filterOptions.js       // static dropdown option lists only (categories/priorities/locations)
  services/
    approvalService.js     // real GET /api/approvals, POST /api/tickets/open/:id, PATCH /api/approvals/:id
  components/
    Sidebar.jsx             // shared left nav — reuse if your project already has one
    Header.jsx               // shared top header — reuse if your project already has one
    SummaryCard.jsx           // the 4 top stat tiles
    FilterBar.jsx              // search + filters + reset/export
    ApprovalTable.jsx          // the complaints table with row actions
    ApprovalModal.jsx          // "View" details modal + "Reject" remarks modal
    WorkflowSummary.jsx        // right-rail vertical workflow stepper
    InfoCard.jsx                // right-rail "Approval Guidelines" + "Need Help?"
    Toast.jsx                    // success/error toast
  pages/
    Approvals.jsx                 // page that wires everything together
```

## How to drop this into your existing project

1. Copy `src/data/filterOptions.js`, `src/services/approvalService.js`,
   `src/pages/Approvals.jsx`, and the files under `src/components/` into
   your project.
2. **If your project already has `Sidebar.jsx` / `Header.jsx`**, don't copy
   the ones here — instead open `src/pages/Approvals.jsx` and swap the
   imports to point at your existing components, and pass whatever props
   they expect (e.g. an `activePage="Approvals"` prop instead of
   `activeSubmenu`).
3. Install the one new dependency, if it isn't already in your project:
   ```bash
   npm install lucide-react
   ```
4. Add the route (adjust to however your project already routes pages):
   ```jsx
   // src/App.jsx (example, using react-router-dom)
   import { Routes, Route } from "react-router-dom";
   import Approvals from "./pages/Approvals";

   function App() {
     return (
       <Routes>
         {/* ...your existing routes... */}
         <Route path="/approvals" element={<Approvals />} />
       </Routes>
     );
   }
   ```
5. Run it:
   ```bash
   npm install
   npm run dev
   ```

## Backend wiring (already done)

This page is already wired to the live backend via `src/services/approvalService.js`:

- `Approvals.jsx` loads real rows with `fetchApprovals()` → `GET /api/approvals`.
- `handleApprove` calls `approveComplaint(id)` → `POST /api/tickets/open/:complaintId`
  (this is the real endpoint that opens the repair ticket and transitions the
  complaint to `TICKET_OPEN` — there is no separate "approve" PATCH route).
- `handleConfirmReject` calls `rejectComplaint(id, remarks)` →
  `PATCH /api/approvals/:complaintId` with `{ status: "Rejected", rejectionRemarks }`.
- Local state and success toasts only update after the backend confirms
  (2xx response); failures show the backend's own error message instead.

No dedicated `/api/approvals/export` endpoint exists yet, so **Export**
does not call a fake or invented endpoint. It builds a CSV from the rows
already loaded (matching the current filters) and downloads it directly in
the browser — real data, no server round trip. If a real export endpoint
is added later, swap this for a `GET /api/approvals/export` call the same
way Leave Management's `leaveApi.export` works.

## Notes

- All colors, layout, and copy follow the original spec (navy sidebar
  `#062B5C`, primary blue `#0757D9`, orange/blue/red/green summary tiles,
  workflow steps, etc.) — only the data source changed, not the design.
- The table stays a real `<table>` on all breakpoints (not swapped for
  cards) with horizontal scroll on small screens.
- Pagination and filtering are done client-side over the fetched rows,
  since the backend's `/api/approvals` doesn't currently support
  `page`/`limit` query params. Any filter change resets back to page 1.
