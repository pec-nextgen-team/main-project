/**
 * Stock Adjustments API service
 * ---------------------------------------------------------------------------
 * Talks to the Node.js + Express + Prisma + PostgreSQL (Neon) backend.
 * No mock data or local-only fallbacks — every call hits the live backend
 * and throws on a non-2xx response so the caller can show a real error toast.
 *
 * Endpoints:
 *   GET  /api/stock/adjustments/summary   -> { totalItems, inStock, lowStock, outOfStock, expiringSoon }
 *   GET  /api/stock/adjustments/recent    -> [{ id, date, type, value }]
 *   POST /api/stock/adjustments           -> create + confirm an adjustment
 *   POST /api/stock/adjustments/draft     -> save an adjustment as a draft
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/stock/adjustments${path}`, {
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

export function fetchStockSummary() {
  return request('/summary')
}

export function fetchRecentAdjustments() {
  return request('/recent')
}

export function submitAdjustment(payload, isDraft = false) {
  const endpoint = isDraft ? '/draft' : ''
  return request(endpoint, { method: 'POST', body: JSON.stringify(payload) })
}
