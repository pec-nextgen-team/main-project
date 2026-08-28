import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const leaveApi = {
  // GET /api/leaves?fromDate=&toDate=&department=&status=&leaveType=&electricianId=&search=&page=&limit=
  list: (params) => api.get("/leaves", { params }).then((r) => r.data),

  // GET /api/leaves/summary  -> real counts for summary cards + donut chart
  summary: (params) => api.get("/leaves/summary", { params }).then((r) => r.data),

  // GET /api/leaves/:id
  getById: (id) => api.get(`/leaves/${id}`).then((r) => r.data),

  // POST /api/leaves
  create: (payload) => api.post("/leaves", payload).then((r) => r.data),

  // PUT /api/leaves/:id  (edit a pending request)
  update: (id, payload) => api.put(`/leaves/${id}`, payload).then((r) => r.data),

  // DELETE /api/leaves/:id  (cancel a pending request)
  cancel: (id) => api.delete(`/leaves/${id}`).then((r) => r.data),

  // PATCH /api/leaves/:id/approve
  approve: (id, remarks) =>
    api.patch(`/leaves/${id}/approve`, { remarks }).then((r) => r.data),

  // PATCH /api/leaves/:id/reject
  reject: (id, remarks) =>
    api.patch(`/leaves/${id}/reject`, { remarks }).then((r) => r.data),

  // GET /api/leaves/export?format=csv&... -> blob
  export: (params) =>
    api
      .get("/leaves/export", { params, responseType: "blob" })
      .then((r) => r.data),

  // GET /api/electricians/:id/leave-balance
  balance: (electricianId) =>
    api.get(`/electricians/${electricianId}/leave-balance`).then((r) => r.data),

  // GET /api/users/electricians -> live electrician roster for the
  // "Apply Leave" / filter dropdowns (Team 4 backend API contract).
  listElectricians: () => api.get("/users/electricians").then((r) => r.data),
};

export default leaveApi;
