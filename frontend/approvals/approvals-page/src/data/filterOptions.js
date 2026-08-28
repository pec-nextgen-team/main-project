// Static filter-option lists for the Approvals page UI.
// Complaint records themselves are loaded live from GET /api/approvals
// via src/services/approvalService.js — no mock business data here.

export const categories = ["All Categories", "Electrical", "Plumbing", "General"];
export const subCategories = ["All Sub Categories", "Wiring", "Fixture", "Leakage", "Furniture"];
export const priorities = ["All Priorities", "High", "Medium", "Low"];
export const locations = [
  "All Locations",
  "Lab IT-01",
  "Block A - 2nd Floor",
  "Library",
  "Hostel - Block B",
  "Admin Block",
  "Lab EEE-02",
  "Boy's Toilet",
  "CSE - Seminar Hall",
];

