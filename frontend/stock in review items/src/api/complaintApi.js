/**
 * Complaint API
 * ---------------------------------------------------------------------------
 * Talks to the Node.js + Express + Prisma + PostgreSQL (Neon) backend.
 * During local development, /api is proxied to the Express server (see
 * vite.config.js). In production, point VITE_API_BASE_URL at the deployed
 * API origin.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Submits a new complaint.
 *
 * Expected backend contract:
 *   POST /api/complaints  (multipart/form-data because attachments are files)
 *   -> 201 Created
 *      {
 *        id, complaintId, category, subCategory, problemTitle, location,
 *        floor, roomNo, asset, description, priority, reportedBy, mobile,
 *        email, department, attachments: [{ url, name, size, type }],
 *        status: "COMPLAINT_REGISTERED", createdAt, updatedAt
 *      }
 *
 * @param {object} payload - complaint fields (see buildComplaintFormData)
 * @returns {Promise<object>} created complaint record
 */
export async function createComplaint(payload) {
  const formData = buildComplaintFormData(payload);

  const response = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let message = 'Failed to submit the complaint. Please try again.';
    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch {
      // response body wasn't JSON - keep the default message
    }
    throw new Error(message);
  }

  return response.json();
}

function buildComplaintFormData(payload) {
  const formData = new FormData();

  formData.append('category', payload.category ?? '');
  formData.append('subCategory', payload.subCategory ?? '');
  formData.append('problemTitle', payload.problemTitle ?? '');
  formData.append('location', payload.location ?? '');
  formData.append('floor', payload.floor ?? '');
  formData.append('roomNo', payload.roomNo ?? '');
  formData.append('asset', payload.asset ?? '');
  formData.append('description', payload.description ?? '');
  formData.append('priority', payload.priority ?? '');
  formData.append('reportedBy', payload.reportedBy ?? '');
  formData.append('mobile', payload.mobile ?? '');
  formData.append('email', payload.email ?? '');
  formData.append('department', payload.department ?? '');
  formData.append('reportedOn', payload.reportedOn ?? new Date().toISOString());
  formData.append('status', 'COMPLAINT_REGISTERED');

  (payload.attachments || []).forEach((file) => {
    formData.append('attachments', file, file.name);
  });

  return formData;
}
