/**
 * Ticket & Electrician Assignment Service
 * 
 * Manages ticket assignment to electricians and technician job execution tracking
 * via the shared apiClient. No business data is stored in localStorage.
 */

import apiClient from './apiClient';
import { COMPLAINT_STATUS } from './complaintService';

export const ticketService = {
  /**
   * Get all approved complaints awaiting technician dispatch
   */
  async getUnassignedTickets() {
    try {
      const response = await apiClient.get('/api/tickets/unassigned');
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.data)) return response.data;
      return [];
    } catch (err) {
      console.error('Error fetching unassigned tickets:', err);
      return [];
    }
  },

  /**
   * Assign an authorized ticket to a technician
   */
  async assignElectrician(ticketId, { electricianName, electricianId = '', instructions = '', assignedPriority = '', assignedBy = 'Maintenance In-charge' }) {
    if (!ticketId) {
      throw new Error('Ticket ID is required.');
    }
    if (!electricianName || !electricianName.trim()) {
      throw new Error('Please enter/select the electrician technician name or staff ID.');
    }

    const payload = {
      electricianName: electricianName.trim(),
      electricianId: electricianId.trim(),
      instructions: instructions.trim(),
      assignedPriority,
      assignedBy,
      assignedAt: new Date().toISOString(),
    };

    try {
      const response = await apiClient.post(`/api/tickets/${ticketId}/assign`, payload);
      return response?.data || response || { id: ticketId, status: COMPLAINT_STATUS.ASSIGNED, ...payload };
    } catch (err) {
      console.error(`Error assigning ticket ${ticketId}:`, err);
      throw err;
    }
  },

  /**
   * Get all assigned work orders / jobs
   */
  async getAssignedJobs(electricianFilter = '') {
    const query = electricianFilter ? `?electrician=${encodeURIComponent(electricianFilter.trim())}` : '';
    try {
      const response = await apiClient.get(`/api/jobs${query}`);
      if (Array.isArray(response)) return response;
      if (response && Array.isArray(response.data)) return response.data;
      return [];
    } catch (err) {
      console.error('Error fetching assigned jobs:', err);
      return [];
    }
  },

  /**
   * Update job status (e.g. IN_PROGRESS, COMPLETED) and attach resolution remarks
   */
  async updateJobStatus(jobId, { newStatus, resolutionNotes = '', technicianName = 'Electrician' }) {
    if (!jobId) {
      throw new Error('Job ID is required.');
    }

    const payload = {
      status: newStatus,
      resolutionNotes: resolutionNotes.trim(),
      technicianName,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await apiClient.put(`/api/jobs/${jobId}/status`, payload);
      return response?.data || response || { id: jobId, status: newStatus, ...payload };
    } catch (err) {
      console.error(`Error updating job status for ${jobId}:`, err);
      throw err;
    }
  },
};

export default ticketService;

