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
  if (res.status !== 200) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
  return body;
}

// GET /api/tickets?search=&status=&category=&priority=&fromDate=&toDate=&location=&assignedTo=&page=&limit=
export async function fetchTickets(filters = {}, page = 1, limit = 10) {
  const params = new URLSearchParams({
    ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)),
    page: String(page),
    limit: String(limit),
  });
  const body = await request(`/api/tickets?${params.toString()}`);
  return {
    tickets: body?.data ?? body?.tickets ?? [],
    total: body?.total ?? (body?.data ?? body?.tickets ?? []).length,
  };
}

// GET /api/tickets/summary — dashboard counts (Total / Open / In Progress / Resolved / Overdue).
export async function fetchTicketsSummary() {
  const body = await request("/api/tickets/summary");
  return body?.data ?? body ?? [];
}

// GET /api/tickets/export?<same filters> — server-generated CSV export.
export async function exportTickets(filters = {}) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
  );
  const res = await fetch(`${API_BASE_URL}/api/tickets/export?${params.toString()}`);
  if (res.status !== 200) {
    throw new Error(`Export failed (${res.status})`);
  }
  return res.blob();
}

export default { fetchTickets, fetchTicketsSummary, exportTickets };
