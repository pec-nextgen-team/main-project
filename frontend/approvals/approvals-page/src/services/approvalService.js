const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (res.status !== 200 && res.status !== 201) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}

export async function fetchApprovals(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""))
  ).toString();
  const body = await request(`/api/approvals${query ? `?${query}` : ""}`);
  return body?.data ?? body ?? [];
}

// Approving a complaint opens its repair ticket:
// POST /api/tickets/open/:complaintId, transitioning status to TICKET_OPEN.
export async function approveComplaint(complaintId) {
  const body = await request(`/api/tickets/open/${complaintId}`, { method: "POST" });
  return body?.data ?? body;
}

export async function rejectComplaint(complaintId, remarks) {
  const body = await request(`/api/approvals/${complaintId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "Rejected", rejectionRemarks: remarks }),
  });
  return body?.data ?? body;
}

export default { fetchApprovals, approveComplaint, rejectComplaint };
