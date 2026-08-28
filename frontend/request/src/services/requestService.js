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

export async function fetchRequests(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""))
  ).toString();
  const body = await request(`/api/requests${query ? `?${query}` : ""}`);
  const data = body?.data ?? body ?? [];
  return { data, total: body?.total ?? data.length };
}

export async function fetchRequestSummary() {
  const body = await request("/api/requests/summary");
  return body?.data ?? body ?? [];
}

export async function createRequest(payload) {
  const body = await request("/api/requests", { method: "POST", body: JSON.stringify(payload) });
  return body?.data ?? body;
}

export async function exportRequests(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE_URL}/api/requests/export${query ? `?${query}` : ""}`);
  if (res.status !== 200) {
    let body = null;
    try { body = await res.json(); } catch { body = null; }
    throw new Error(body?.message || "Failed to export requests");
  }
  return res.blob();
}

export default { fetchRequests, fetchRequestSummary, createRequest, exportRequests };
