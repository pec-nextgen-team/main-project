import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const electricianService = {
  // GET /api/electricians
  list: () => api.get('/electricians').then((r) => r.data),

  // GET /api/electricians/:id
  getById: (id) => api.get(`/electricians/${id}`).then((r) => r.data),

  // POST /api/electricians
  create: (payload) => api.post('/electricians', payload).then((r) => r.data),
}

export default electricianService
