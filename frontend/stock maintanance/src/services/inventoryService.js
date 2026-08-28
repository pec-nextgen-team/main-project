/**
 * Inventory API service
 * ---------------------------------------------------------------------------
 * Talks to the Node.js + Express + Prisma + PostgreSQL (Neon) backend
 * (see server/routes/inventory.js and server/controllers/inventoryController.js).
 *
 * No mock data / local-only fallbacks: every call hits the live backend and
 * throws on a non-2xx response so the caller can show a real error toast.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/inventory${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.'
    try {
      const body = await response.json()
      message = body?.message || message
    } catch {
      // non-JSON error body - keep default message
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export function fetchInventory(filters = {}) {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'All Categories') params.set('category', filters.category)
  if (filters.location && filters.location !== 'All Locations') params.set('location', filters.location)
  if (filters.stockStatus && filters.stockStatus !== 'All Stock Status') params.set('status', filters.stockStatus)
  if (filters.search) params.set('search', filters.search)

  const qs = params.toString()
  return request(`${qs ? `?${qs}` : ''}`)
}

export function createInventoryItem(payload) {
  return request('', { method: 'POST', body: JSON.stringify(payload) })
}

export function updateInventoryItem(id, payload) {
  return request(`/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export function deleteInventoryItem(id) {
  return request(`/${id}`, { method: 'DELETE' })
}

export function recordStockMovement(id, mode, quantity) {
  const endpoint = mode === 'in' ? 'stock-in' : mode === 'out' ? 'stock-out' : 'adjustment'
  return request(`/${id}/${endpoint}`, { method: 'POST', body: JSON.stringify({ quantity }) })
}
