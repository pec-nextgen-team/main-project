// Mock data for the Accessory Repair Complaint Details form.
// Shaped so it can later be replaced with a GET /api/complaints/:id fetch
// and a POST/PATCH on save, without changing component props.

export const STAGES = [
  { key: "REGISTERED", label: "Complaint Registered", status: "Completed" },
  { key: "INSPECTION", label: "Inspection", status: "In Progress" },
  { key: "REPAIR_ASSIGNED", label: "Repair Assigned", status: "Pending" },
  { key: "ACTION_TAKEN", label: "Action Taken", status: "Pending" },
  { key: "VERIFICATION", label: "Verification", status: "Pending" },
  { key: "CLOSED", label: "Closed", status: "Pending" },
];

export const complaintTypes = ["Accessory Repair", "Replacement Request", "Maintenance"];
export const accessoryCategories = ["Computer Peripheral", "Furniture", "Electrical Appliance", "Networking Equipment"];
export const priorities = ["High", "Medium", "Low"];
export const damageTypes = ["Physical Damage", "Electrical Fault", "Wear and Tear", "Manufacturing Defect"];

export const initialComplaintForm = {
  complaintNo: "CMP-2026-00158",
  complaintDate: "16-05-2026",
  complaintType: "Accessory Repair",
  accessoryCategory: "Computer Peripheral",
  accessoryName: "Keyboard",
  department: "Computer Science & Engineering",
  roomLocation: "CSE Lab - AB-201",
  reportedBy: "Faculty / Staff",
  priority: "High",
  problemDescription: "Keyboard keys not responding properly",
  remarks: "",
};

export const initialInspectionForm = {
  inspectedBy: "",
  inspectionDate: "",
  issueIdentified: "",
  damageType: "",
  estimatedRepairCost: "",
  repairRequired: "Yes",
  inspectionRemarks: "",
};

export const complaintInfoCard = {
  complaintNo: "CMP-2026-00158",
  category: "Computer Peripheral",
  location: "CSE Lab - AB-201",
  priority: "High",
  currentStatus: "Inspection",
};

export const accessoryInfoCard = {
  accessoryName: "Keyboard",
  assetSerialNo: "KBD-CSE-0158",
  department: "Computer Science & Engineering",
  purchaseDate: "12-01-2024",
  warrantyStatus: "Expired",
};

export const workflowSummaryCard = {
  currentStage: "Inspection",
  assignedTechnician: "Not yet assigned",
  expectedCompletion: "19-05-2026",
  slaStatus: "On Track",
};

export const recentComplaints = [
  { complaintNo: "CMP-2026-00151", date: "14-05-2026", accessory: "Projector", status: "Closed" },
  { complaintNo: "CMP-2026-00147", date: "12-05-2026", accessory: "Office Chair", status: "In Progress" },
  { complaintNo: "CMP-2026-00139", date: "09-05-2026", accessory: "Printer", status: "Closed" },
  { complaintNo: "CMP-2026-00132", date: "05-05-2026", accessory: "Router", status: "Verification" },
];
