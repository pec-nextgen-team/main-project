/**
 * Authentication Service
 * 
 * Manages user authentication, token storage, and session state.
 * Uses the shared apiClient and a single consistent token key (pec_rmms_auth_token).
 */

import apiClient, { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './apiClient';

export const ROLES = {
  STAFF_STUDENT: 'Staff / Student',
  HOD: 'Head of Department (HOD)',
  MAINTENANCE_ADMIN: 'Maintenance In-charge / Admin',
  ELECTRICIAN: 'Electrician / Technician',
};

export const authService = {
  // Retrieve token using the single agreed token key
  getToken() {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY) || '';
    } catch {
      return '';
    }
  },

  // Retrieve current active user session
  getCurrentUser() {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse user session:', e);
    }
    return null;
  },

  // Alias for backwards compatibility
  getCurrentSession() {
    return this.getCurrentUser();
  },

  // Log in with credentials
  async login({ identifier, password, role }) {
    if (!identifier || !identifier.trim()) {
      throw new Error('Please enter your Institutional ID / Staff ID / Register Number.');
    }
    if (!password || password.length < 4) {
      throw new Error('Please enter a valid password (minimum 4 characters).');
    }
    if (!role) {
      throw new Error('Please select your institutional designation / role.');
    }

    const trimmedId = identifier.trim();

    // If backend is configured, attempt backend login
    if (apiClient.getBaseUrl()) {
      try {
        const response = await apiClient.post('/api/auth/login', {
          identifier: trimmedId,
          password,
          role,
        });

        if (response && response.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, response.token);
          const userObj = response.user || {
            identifier: trimmedId,
            role: role,
            loggedInAt: new Date().toISOString(),
          };
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userObj));
          return userObj;
        }
      } catch (err) {
        throw new Error(err.message || 'Authentication failed on server.', { cause: err });
      }
    }

    // Standard client session creation for frontend-only readiness
    const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userSession = {
      identifier: trimmedId,
      role: role,
      token: token,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userSession));
    return userSession;
  },

  // Log out user and clean up single token key & session
  async logout() {
    if (apiClient.getBaseUrl()) {
      try {
        await apiClient.post('/api/auth/logout', {});
      } catch (e) {
        console.debug('Server logout error:', e);
      }
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  // Switch institutional role within session
  switchRole(newRole) {
    const current = this.getCurrentUser();
    if (current) {
      const updated = { ...current, role: newRole };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  },
};

export default authService;

