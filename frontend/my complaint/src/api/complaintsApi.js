/**
 * Complaints listing API
 * ---------------------------------------------------------------------------
 * Talks to GET /api/complaints/my on the Node.js + Express + Prisma +
 * PostgreSQL (Neon) backend. If that request fails (most likely because no
 * backend is running yet in local development), it falls back to filtering
 * the bundled sample dataset client-side so the page stays fully usable.
 * Once a real backend responds, this fallback is never reached.
 */
import { sampleComplaints, MOCK_REFERENCE_DATE } from '../data/sampleComplaints.js';
import { computeSlaInfo } from '../utils/sla.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * @param {object} params
 * @param {string} [params.search]
 * @param {string} [params.status]   - "All Status" or one of the six workflow stages
 * @param {string} [params.category] - "All Category" or one of the four categories
 * @param {string} [params.fromDate] - yyyy-mm-dd
 * @param {string} [params.toDate]   - yyyy-mm-dd
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @returns {Promise<{data: object[], total: number, page: number, limit: number}>}
 */
export async function getMyComplaints(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });

  try {
    const response = await fetch(`${API_BASE_URL}/complaints/my?${query.toString()}`);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    const json = await response.json();
    return { ...json, isSample: false };
  } catch (err) {
    console.warn(
      '[complaintsApi] Backend unavailable, showing bundled sample data instead:',
      err.message
    );
    return { ...getSampleComplaints(params), isSample: true };
  }
}

/**
 * Aggregate counts for the summary cards, computed across ALL of the user's
 * complaints (ignoring the current table filters).
 */
export async function getMyComplaintsSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/my/summary`);
    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn(
      '[complaintsApi] Backend unavailable, computing summary from sample data instead:',
      err.message
    );
    return summarize(sampleComplaints);
  }
}

function getSampleComplaints({ search, status, category, fromDate, toDate, page = 1, limit = 10 }) {
  let filtered = [...sampleComplaints];

  if (search) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((c) =>
      [c.ticketId, c.problemTitle, c.location, c.asset].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }

  if (status && status !== 'All Status') {
    filtered = filtered.filter((c) => c.status === status);
  }

  if (category && category !== 'All Category') {
    filtered = filtered.filter((c) => c.category === category);
  }

  if (fromDate) {
    const from = new Date(fromDate);
    filtered = filtered.filter((c) => new Date(c.createdAt) >= from);
  }

  if (toDate) {
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((c) => new Date(c.createdAt) <= to);
  }

  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = filtered.length;
  const start = (Number(page) - 1) * Number(limit);
  const pageData = filtered.slice(start, start + Number(limit));

  return { data: pageData, total, page: Number(page), limit: Number(limit) };
}

function summarize(complaints) {
  const inProgressStages = ['Inspection', 'Repair Assigned', 'Action Taken', 'Verification'];

  return {
    total: complaints.length,
    open: complaints.filter((c) => c.status === 'Complaint Registered').length,
    inProgress: complaints.filter((c) => inProgressStages.includes(c.status)).length,
    resolved: complaints.filter((c) => c.status === 'Closed').length,
    overdue: complaints.filter((c) => computeSlaInfo(c, MOCK_REFERENCE_DATE).tone === 'overdue').length,
  };
}
