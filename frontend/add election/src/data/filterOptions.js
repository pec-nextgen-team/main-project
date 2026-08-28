// Static domain configuration for the Approvals - Rejected page
// (dropdown options, workflow steps, rejection-reason labels).
// Actual complaint records and summary counts come from the live
// backend via services/rejectedApprovalsService.js (GET /api/approvals/rejected).

export const rejectionReasonsList = [
  'Insufficient Information',
  'Invalid Complaint',
  'Duplicate Complaint',
  'Not Our Responsibility',
  'Other',
]

export const workflowSteps = [
  'Complaint Reported (Supervisor)',
  'HOD Approval',
  'Ticket Created (If Approved)',
  'Assigned to Electrician',
  'Repair / Maintenance',
  'HOD Verification',
  'Closure & Report Distribution',
]

export const categoryOptions = ['All Categories', 'Electrical', 'Plumbing', 'General']

export const subCategoryOptions = {
  'All Categories': ['All Sub Categories'],
  Electrical: ['All Sub Categories', 'Wiring', 'AC / Cooling', 'Switch Board', 'Lighting'],
  Plumbing: ['All Sub Categories', 'Leakage', 'Tap / Fixture', 'Drainage'],
  General: ['All Sub Categories', 'Furniture', 'Door / Lock', 'Civil'],
}

export const priorityOptions = ['All Priorities', 'High', 'Medium', 'Low']

export const locationOptions = [
  'All Locations',
  'Server Room',
  'Boys Hostel',
  'Classroom 203',
  'Seminar Hall',
  'Lab EEE-02',
  'Canteen',
]
