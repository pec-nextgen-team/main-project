import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const electricianApi = {
  // GET /api/electricians?search=&department=&specialization=&status=&fromDate=&toDate=&employmentType=&location=&page=&limit=
  list: (params) => api.get("/electricians", { params }).then((r) => r.data),

  // GET /api/electricians/summary
  summary: () => api.get("/electricians/summary").then((r) => r.data),

  // GET /api/electricians/:id
  getById: (id) => api.get(`/electricians/${id}`).then((r) => r.data),

  // POST /api/electricians
  create: (payload) => api.post("/electricians", payload).then((r) => r.data),

  // PUT /api/electricians/:id
  update: (id, payload) => api.put(`/electricians/${id}`, payload).then((r) => r.data),

  // PATCH /api/electricians/:id/status  { status }
  updateStatus: (id, status) =>
    api.patch(`/electricians/${id}/status`, { status }).then((r) => r.data),

  // DELETE /api/electricians/:id
  remove: (id) => api.delete(`/electricians/${id}`).then((r) => r.data),

  // GET /api/electricians/export -> blob (csv)
  export: (params) =>
    api
      .get("/electricians/export", { params, responseType: "blob" })
      .then((r) => r.data),

  // POST /api/electricians/import  (multipart file)
  import: (formData) =>
    api
      .post("/electricians/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  // PATCH /api/electricians/bulk-status  { ids: [], status }
  bulkUpdateStatus: (ids, status) =>
    api.patch("/electricians/bulk-status", { ids, status }).then((r) => r.data),
};

export default electricianApi;
