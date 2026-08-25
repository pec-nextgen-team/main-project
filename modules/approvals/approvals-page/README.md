# Approvals Page — Integration Guide

This delivers the **Pending Approvals** page for the Repair & Maintenance
Management System, built with React + Vite + Tailwind CSS (plain JS, no
TypeScript, no Bootstrap).

## Files

```
src/
  data/
    mockApprovals.js       // mock rows + dropdown options (swap for API later)
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

1. Copy `src/data/mockApprovals.js`, `src/pages/Approvals.jsx`, and the files
   under `src/components/` into your project.
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

## Wiring to the real backend later

`src/data/mockApprovals.js` exports `initialApprovals` and the dropdown
option lists. When the Node.js + Express + Prisma + Postgres API is ready:

- Replace `initialApprovals` in `Approvals.jsx` with a `useEffect` that
  fetches `GET /api/approvals?status=pending`.
- Replace `handleApprove` with `PATCH /api/approvals/:id` (`status: "Approved"`).
- Replace `handleConfirmReject` with `PATCH /api/approvals/:id`
  (`status: "Rejected", remarks`).

No other component needs to change — they only consume `rows`, `filters`,
and the three callback props (`onView`, `onApprove`, `onReject`).

## Notes

- All colors, layout, copy, and sample data follow the spec exactly (navy
  sidebar `#062B5C`, primary blue `#0757D9`, orange/blue/red/green summary
  tiles, exact 8-row sample dataset, exact workflow steps, etc.).
- The table stays a real `<table>` on all breakpoints (not swapped for
  cards) with horizontal scroll on small screens.
- Approve/Reject/Export are all local-state only — no page reloads, no
  network calls yet, since no backend was attached to this task.
- I could not run `npm install && npm run dev` in this environment (no
  network access here), so please do that verification step on your end.
