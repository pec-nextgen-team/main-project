/**
 * Stock In API
 * ---------------------------------------------------------------------------
 * Talks to the Node.js + Express + Prisma + PostgreSQL (Neon) backend.
 *
 * Suggested endpoints:
 *   POST /api/stock/stock-in           create + confirm a receipt (status CONFIRMED)
 *   POST /api/stock/stock-in/draft      save a receipt as a draft (status DRAFT)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * @param {object} payload  - the Stock In form state (see StockIn.jsx)
 * @param {File[]} files    - [invoiceCopy?, ...deliveryNoteFiles]
 * @param {boolean} isDraft - true -> POST /stock/stock-in/draft
 */
export async function submitStockIn(payload, files, isDraft = false) {
  const formData = new FormData();
  formData.append('data', JSON.stringify(payload));
  (files || []).forEach((file) => formData.append('documents', file, file.name));

  const endpoint = isDraft ? '/stock/stock-in/draft' : '/stock/stock-in';

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = isDraft
      ? 'Failed to save the draft. Please try again.'
      : 'Failed to confirm stock in. Please try again.';
    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch {
      // non-JSON error body - keep default message
    }
    throw new Error(message);
  }

  return response.json();
}
