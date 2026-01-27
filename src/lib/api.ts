import type { ApiResponse } from '@/types';

// Use internal API routes in production, no external backend needed
// All data is served from Next.js API routes with mock data
const USE_INTERNAL_API = true;

class ApiClient {
  private useInternal: boolean;

  constructor() {
    // Always use internal API routes - no external backend required
    this.useInternal = true;
  }

  setAccessToken(token: string | null) {
    // Token storage for future use when auth is implemented
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }
    }
  }

  private getInternalHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      return {
        data: undefined,
        error: data.error || 'An error occurred',
        message: data.message,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Use internal API routes - no external calls
    const response = await fetch(`${endpoint}`, {
      method: 'GET',
      headers: this.getInternalHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: object): Promise<ApiResponse<T>> {
    // Use internal API routes
    const response = await fetch(`${endpoint}`, {
      method: 'POST',
      headers: this.getInternalHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    // Use internal API routes
    const response = await fetch(`${endpoint}`, {
      method: 'PUT',
      headers: this.getInternalHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Use internal API routes
    const response = await fetch(`${endpoint}`, {
      method: 'DELETE',
      headers: this.getInternalHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async upload<T>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({ data, status: xhr.status });
          } else {
            resolve({ data: undefined, error: data.error, status: xhr.status });
          }
        } catch {
          resolve({ data: undefined, error: 'Invalid response', status: xhr.status });
        }
      });

      xhr.addEventListener('error', () => {
        resolve({ data: undefined, error: 'Network error', status: 0 });
      });

      xhr.open('POST', `${endpoint}`);
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      }
      xhr.send(formData);
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Helper functions for common requests - all use internal API routes
export const api = {
  // Users
  users: {
    getProfile: (username: string) => apiClient.get(`/api/users/${encodeURIComponent(username)}`),
    updateProfile: (data: object) => apiClient.put('/api/users/profile', data),
    getFollowers: (username: string) => apiClient.get(`/api/users/${encodeURIComponent(username)}/followers`),
    getFollowing: (username: string) => apiClient.get(`/api/users/${encodeURIComponent(username)}/following`),
    follow: (username: string) => apiClient.post(`/api/users/${encodeURIComponent(username)}/follow`),
    unfollow: (username: string) => apiClient.delete(`/api/users/${encodeURIComponent(username)}/follow`),
  },

  // Feed
  feed: {
    getTimeline: (params?: { limit?: number; offset?: number }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
      })}` : '';
      return apiClient.get(`/api/feed${query}`);
    },
    getTrending: (params?: { limit?: number; offset?: number; timeRange?: string }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
        ...(params.timeRange && { timeRange: params.timeRange }),
      })}` : '';
      return apiClient.get(`/api/feed/trending${query}`);
    },
    getDiscover: (params?: { limit?: number; offset?: number; genre?: string }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 20),
        offset: String(params.offset || 0),
        ...(params.genre && { genre: params.genre }),
      })}` : '';
      return apiClient.get(`/api/feed/discover${query}`);
    },
    getFollowing: (params?: { limit?: number; offset?: number }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
      })}` : '';
      return apiClient.get(`/api/feed/following${query}`);
    },
  },

  // Tracks
  tracks: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      return apiClient.get(`/api/tracks${query}`);
    },
    get: (id: string) => apiClient.get(`/api/tracks/${id}`),
    create: (data: object) => apiClient.post('/api/tracks', data),
    delete: (id: string) => apiClient.delete(`/api/tracks/${id}`),
    like: (id: string) => apiClient.post(`/api/tracks/${id}/like`),
    unlike: (id: string) => apiClient.delete(`/api/tracks/${id}/like`),
    remix: (id: string, data: object) => apiClient.post(`/api/tracks/${id}/remix`, data),
    promote: (id: string, remixId: string) => apiClient.post(`/api/tracks/${id}/promote`, { remixId }),
  },

  // Auth
  auth: {
    login: (credentials: object) => apiClient.post('/api/auth/login', credentials),
    register: (data: object) => apiClient.post('/api/auth/register', data),
    logout: () => apiClient.post('/api/auth/logout'),
    refresh: () => apiClient.post('/api/auth/refresh'),
  },
};

export default apiClient;
