/**
 * Complaint Service
 * 
 * Manages complaint registrations, retrieval, and status life-cycle
 * using the shared apiClient. No business data is stored in localStorage.
 */

import apiClient from './apiClient';

export const COMPLAINT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN PROGRESS',
  COMPLETED: 'COMPLETED',
  RESOLVED: 'RESOLVED',
};

export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  EMERGENCY: 'Emergency',
};

export const complaintService = {
  /**
   * Get all complaints from backend API
   */
  async getAllComplaints(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/api/complaints?${query}` : '/api/complaints';
    try {
      const response = await apiClient.get(endpoint);
      return Array.isArray(response) ? response : (response?.data || []);
    } catch (err) {
      console.error('Error fetching complaints from API:', err);
      return [];
    }
  },

  /**
   * Get complaint by ID
   */
  async getComplaintById(id) {
    if (!id) return null;
    try {
      const response = await apiClient.get(`/api/complaints/${id}`);
      return response?.data || response || null;
    } catch (err) {
      console.error(`Error fetching complaint ${id}:`, err);
      return null;
    }
  },

  /**
   * Create a new complaint via API
   */
  async createComplaint(formData, userIdentifier) {
    const payload = {
      location: formData.location || '',
      roomLab: formData.roomLab || '',
      category: formData.category || 'General Electrical',
      priority: formData.priority || PRIORITY_LEVELS.MEDIUM,
      description: formData.description || '',
      contactNumber: formData.contactNumber || '',
      contactEmail: formData.contactEmail || '',
      reportedBy: userIdentifier || 'Staff / Student',
    };

    try {
      const response = await apiClient.post('/api/complaints', payload);
      const createdRecord = response?.data || response || {
        id: `PEC-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        ...payload,
        createdAt: new Date().toISOString(),
        status: COMPLAINT_STATUS.PENDING,
      };
      return createdRecord;
    } catch (err) {
      console.error('Error submitting complaint via API:', err);
      throw err;
    }
  },

  /**
   * Update an existing complaint
   */
  async updateComplaint(id, updateData) {
    try {
      const response = await apiClient.put(`/api/complaints/${id}`, updateData);
      return response?.data || response || { id, ...updateData };
    } catch (err) {
      console.error(`Error updating complaint ${id}:`, err);
      throw err;
    }
  },

  /**
   * Delete a complaint
   */
  async deleteComplaint(id) {
    try {
      return await apiClient.delete(`/api/complaints/${id}`);
    } catch (err) {
      console.error(`Error deleting complaint ${id}:`, err);
      throw err;
    }
  },
};

export default complaintService;

