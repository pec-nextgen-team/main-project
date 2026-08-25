# Complaint Details Form — Accessory Repair Complaint Management System

React + Vite + Tailwind CSS (plain JS), lucide-react icons. This is the
**registration/inspection form** view — a working editable form with the
six-stage workflow shown above it, distinct from the read-only tabbed
tracking page built earlier for the same overall system.

## Files

```
src/
  data/
    mockData.js                  // form defaults, stages, right-rail data
  components/
    Sidebar.jsx                    // nav list from this spec, "My Complaints" active
    TopHeader.jsx                    // Mr. Selvaraj / Admin header identity
    Breadcrumb.jsx
    WorkflowProgress.jsx               // 6-stage horizontal progress + status badges
    ComplaintInformationForm.jsx         // main complaint fields (editable)
    InspectionInformationForm.jsx          // inspection fields (editable)
    RightSidebarCards.jsx                    // Complaint/Accessory/Workflow/Recent cards
    BottomActionBar.jsx                        // Cancel / Save as Draft / Move to Repair Assignment
    Toast.jsx
  pages/
    ComplaintDetailsForm.jsx                     // wires everything together
```

## How to drop this into your existing project

1. Copy `src/data/mockData.js`, `src/pages/ComplaintDetailsForm.jsx`, and
   everything under `src/components/` into your project.
2. If you already have a shared Sidebar/TopHeader from other pages of this
   system, merge navigation lists as needed — this spec's sidebar order
   (Technician, Service Provider, IQAC/NAAC as separate items, no Stock
   Management) differs slightly from earlier pages built for this project.
3. Install lucide-react if not already present:
   ```bash
   npm install lucide-react
   ```
4. Add the route:
   ```jsx
   import ComplaintDetailsForm from "./pages/ComplaintDetailsForm";
   <Route path="/complaints/:id/details" element={<ComplaintDetailsForm />} />
   ```
5. `npm install && npm run dev`.

## Behavior

- Both form sections (Complaint Information, Inspection Information) are
  fully controlled and editable — not static display, since this is meant
  to be filled in during the Inspection stage.
- **Move to Repair Assignment** validates that "Inspected By" and "Issue
  Identified" are filled in before allowing the transition — a reasonable
  minimum gate for moving out of the Inspection stage, given the spec's
  emphasis elsewhere on not skipping stages without inspection data.
- **Save as Draft** and **Cancel** are wired to local state (draft-save
  shows a toast; cancel resets both forms to their original values).
- Complaint No. is shown read-only since it's a generated identifier, not
  something the form should let you edit.

## Wiring to the real backend

- Replace `initialComplaintForm` / `initialInspectionForm` with a
  `GET /api/complaints/:id` fetch on mount.
- `handleSaveDraft` → `PATCH /api/complaints/:id` (partial save, stage
  unchanged).
- `handleMoveToRepairAssignment` → `POST /api/complaints/:id/advance-stage`
  with `{ from: "INSPECTION", to: "REPAIR_ASSIGNED" }`, matching the
  `ComplaintStage` model from the spec — keep the "required fields"
  validation server-side too, not just in the client.
- The right-rail cards (`ComplaintInfoCard`, `AccessoryInfoCard`,
  `WorkflowSummaryCard`, `RecentComplaintsCard`) are read-only summaries;
  point them at the same `GET /api/complaints/:id` response plus a
  `GET /api/complaints?department=&limit=4` for Recent Complaints.

## Notes

- No screenshot was actually attached to this task, so it was built
  strictly from the text spec.
- I could not run `npm install && npm run dev` in this environment (no
  network access) — please verify on your end before shipping.
