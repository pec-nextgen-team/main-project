import axios from "axios";

// Same convention as src/api/leaveApi.js and ticket/services/ticketsService.js
// elsewhere in the project: shared axios instance, bearer token from
// localStorage, base URL from VITE_API_BASE_URL.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// NOTE: These endpoints match the contract this module's own file header
// already documented (GET /api/attendance, POST /api/attendance/mark,
// PATCH /api/attendance/:id, GET /api/attendance/summary). Unlike the
// leave/ticket/approvals modules, no backend code is included in this
// delivery, so whether these routes are actually implemented server-side
// has not been verified — confirm with the backend team before relying on
// this in production. If any of these do not exist yet, frontend cannot
// safely resolve that; the calling code below still fails safely (surfaces
// a real error, never a fake success) either way.
export const attendanceApi = {
  // GET /api/attendance?date=&department=&location=&shift=&status=
  list: (params) => api.get("/attendance", { params }).then((r) => r.data),

  // GET /api/attendance/summary?date=
  summary: (params) => api.get("/attendance/summary", { params }).then((r) => r.data),

  // PATCH /api/attendance/:empId  (edit an existing record)
  update: (empId, payload) => api.patch(`/attendance/${empId}`, payload).then((r) => r.data),

  // POST /api/attendance/mark  (mark today's attendance for an employee)
  mark: (payload) => api.post("/attendance/mark", payload).then((r) => r.data),
};

export default attendanceApi;
