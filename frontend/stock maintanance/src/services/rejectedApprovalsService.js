/**
 * Rejected Approvals API service
 * ---------------------------------------------------------------------------
 * Talks to the Node.js + Express backend for the Approvals - Rejected page.
 *
 * No mock data / local-only fallbacks: every call hits the live backend and
 * throws on a non-2xx response so the caller can show a real error instead
 * of silently falling back to fake records.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  if (res.status !== 200) {
    throw new Error(body?.message || `Request failed (${res.status})`)
  }
  return body
}

// GET /api/approvals/rejected — list of rejected complaints plus summary counts.
export async function fetchRejectedApprovals() {
  const body = await request('/api/approvals/rejected')
  return {
    summaryStats: body?.summaryStats ?? [],
    rejectedComplaints: body?.rejectedComplaints ?? body?.data ?? [],
  }
}

// GET /api/tickets/:ticketId — full detail for a single rejected complaint.
export async function fetchRejectedComplaintDetail(ticketId) {
  const body = await request(`/api/tickets/${ticketId}`)
  return body?.data ?? body
}

export default { fetchRejectedApprovals, fetchRejectedComplaintDetail }
