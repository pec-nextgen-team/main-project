/**
 * Approval Service
 * 
 * Handles HOD verification, approval notes, and rejections
 * via the shared apiClient. No business data is stored in localStorage.
 */

import apiClient from './apiClient';
import { COMPLAINT_STATUS } from './complaintService';

export const approvalService = {
  /**
   * Get all complaints awaiting departmental HOD approval
   */
  async getPendingApprovals() {
    try {
      const response = await apiClient.get('/api/approvals/pending');
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.data)) return response.data;
      return [];
    } catch (err) {
      console.error('Error fetching pending approvals:', err);
      return [];
    }
  },

  /**
   * Authorize and approve a complaint
   */
  async approve(complaintId, { remarks = '', approvedBy = 'HOD' }) {
    if (!complaintId) {
      throw new Error('Complaint ID is required for approval.');
    }

    try {
      const response = await apiClient.post(`/api/approvals/${complaintId}/approve`, {
        remarks: remarks.trim(),
        approvedBy,
        approvedAt: new Date().toISOString(),
      });
      return response?.data || response || { id: complaintId, status: COMPLAINT_STATUS.APPROVED };
    } catch (err) {
      console.error(`Error approving complaint ${complaintId}:`, err);
      throw err;
    }
  },

  /**
   * Reject a complaint with mandatory justification
   */
  async reject(complaintId, { reason = '', rejectedBy = 'HOD' }) {
    if (!complaintId) {
      throw new Error('Complaint ID is required.');
    }
    if (!reason || !reason.trim()) {
      throw new Error('Please provide a reason for rejecting this complaint.');
    }

    try {
      const response = await apiClient.post(`/api/approvals/${complaintId}/reject`, {
        reason: reason.trim(),
        rejectedBy,
        rejectedAt: new Date().toISOString(),
      });
      return response?.data || response || { id: complaintId, status: COMPLAINT_STATUS.REJECTED };
    } catch (err) {
      console.error(`Error rejecting complaint ${complaintId}:`, err);
      throw err;
    }
  },
};

export default approvalService;

