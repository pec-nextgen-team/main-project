/**
 * Shared API Client
 * 
 * Central HTTP client for all backend communication across the application.
 * Supports GET, POST, PUT, PATCH, DELETE, Authorization headers,
 * centralized error handling, and configurable API base URL.
 * 
 * Expected Architecture: Frontend -> apiClient -> Backend API
 */

// Single consistent token key used across authService, AuthContext, and apiClient
export const AUTH_TOKEN_KEY = 'pec_rmms_auth_token';
export const AUTH_USER_KEY = 'pec_rmms_auth_user';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  // When no backend base URL is configured, log debug information and safely return null
  if (!API_BASE_URL && !endpoint.startsWith('http')) {
    console.debug(`[apiClient] ${options.method || 'GET'} ${endpoint} (VITE_API_BASE_URL not configured)`);
    return null;
  }

  try {
    const response = await fetch(url, config);

    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      responseData = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const errorMessage =
        (responseData && typeof responseData === 'object' && (responseData.message || responseData.error)) ||
        (typeof responseData === 'string' && responseData) ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error occurred. Please check your backend connection.', 0);
  }
}

export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'POST', body });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'PUT', body });
  },

  patch(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'PATCH', body });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  },

  request,
  getBaseUrl: () => API_BASE_URL,
  getTokenKey: () => AUTH_TOKEN_KEY,
  getUserKey: () => AUTH_USER_KEY,
};

export default apiClient;

