import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiClient, AUTH_TOKEN_KEY } from '../services/apiClient';

describe('apiClient Service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('exports consistent AUTH_TOKEN_KEY', () => {
    expect(AUTH_TOKEN_KEY).toBe('pec_rmms_auth_token');
  });

  it('includes bearer token in request headers when stored in localStorage', async () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'test-jwt-token-12345');

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: (name) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: () => Promise.resolve({ data: 'success' }),
    });
    global.fetch = mockFetch;

    const res = await apiClient.get('https://api.panimalar.ac.in/test');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.panimalar.ac.in/test',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-jwt-token-12345',
        }),
      })
    );
    expect(res).toEqual({ data: 'success' });
  });

  it('throws ApiError with message and status when response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: {
        get: (name) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: () => Promise.resolve({ message: 'Invalid or expired token' }),
    });
    global.fetch = mockFetch;

    await expect(apiClient.get('https://api.panimalar.ac.in/protected')).rejects.toThrow(
      'Invalid or expired token'
    );
  });

  it('serializes JSON body for POST requests', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: (name) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
      },
      json: () => Promise.resolve({ success: true, id: 101 }),
    });
    global.fetch = mockFetch;

    const payload = { location: 'Main Block', priority: 'HIGH' };
    const res = await apiClient.post('https://api.panimalar.ac.in/complaints', payload);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.panimalar.ac.in/complaints',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(payload),
      })
    );
    expect(res).toEqual({ success: true, id: 101 });
  });
});
