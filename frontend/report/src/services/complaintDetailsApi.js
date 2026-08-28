import axios from "axios";

// Same convention as src/api/leaveApi.js elsewhere in the project.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Endpoints match the contract this module's own README already
// documented under "Wiring to the real backend". No backend code is
// included in this delivery, so whether these routes are actually
// implemented server-side is unverified — confirm with the backend team.
// The calling code always waits for a real response and never assumes
// success, so an unimplemented route surfaces as a clear error instead of
// a false "moved to Repair Assignment" message.
export const complaintDetailsApi = {
  // GET /api/complaints/:id
  getById: (id) => api.get(`/complaints/${id}`).then((r) => r.data),

  // PATCH /api/complaints/:id  (partial save, stage unchanged)
  saveDraft: (id, payload) => api.patch(`/complaints/${id}`, payload).then((r) => r.data),

  // POST /api/complaints/:id/advance-stage
  // body: { from: "INSPECTION", to: "REPAIR_ASSIGNED", ...inspectionForm }
  advanceStage: (id, payload) =>
    api.post(`/complaints/${id}/advance-stage`, payload).then((r) => r.data),

  // GET /api/complaints?department=&limit=4  (Recent Complaints rail)
  listRecent: (params) => api.get("/complaints", { params }).then((r) => r.data),
};

export default complaintDetailsApi;
