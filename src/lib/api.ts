import type { ApiResponse } from '@/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') + '/api/v1';

class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
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
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: object): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: object): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
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

    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

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

      xhr.open('POST', `${this.baseUrl}${endpoint}`);
      if (this.accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.accessToken}`);
      }
      xhr.send(formData);
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Helper functions for common requests
export const api = {
  // Users
  users: {
    getProfile: (username: string) => apiClient.get(`/users/${encodeURIComponent(username)}`),
    updateProfile: (data: object) => apiClient.put('/users/profile', data),
    getFollowers: (username: string) => apiClient.get(`/users/${encodeURIComponent(username)}/followers`),
    getFollowing: (username: string) => apiClient.get(`/users/${encodeURIComponent(username)}/following`),
    follow: (username: string) => apiClient.post(`/users/${encodeURIComponent(username)}/follow`),
    unfollow: (username: string) => apiClient.delete(`/users/${encodeURIComponent(username)}/follow`),
  },

  // Feed
  feed: {
    getTimeline: (params?: { limit?: number; offset?: number }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
      })}` : '';
      return apiClient.get(`/feed${query}`);
    },
    getTrending: (params?: { limit?: number; offset?: number; timeRange?: string }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
        ...(params.timeRange && { timeRange: params.timeRange }),
      })}` : '';
      return apiClient.get(`/feed/trending${query}`);
    },
    getDiscover: (params?: { limit?: number; offset?: number; genre?: string }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
        ...(params.genre && { genre: params.genre }),
      })}` : '';
      return apiClient.get(`/feed/discover${query}`);
    },
    getFollowing: (params?: { limit?: number; offset?: number }) => {
      const query = params ? `?${new URLSearchParams({
        limit: String(params.limit || 10),
        offset: String(params.offset || 0),
      })}` : '';
      return apiClient.get(`/feed/following${query}`);
    },
  },

  // Tracks
  tracks: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      return apiClient.get(`/tracks${query}`);
    },
    get: (id: string) => apiClient.get(`/tracks/${id}`),
    create: (data: object) => apiClient.post('/tracks', data),
    delete: (id: string) => apiClient.delete(`/tracks/${id}`),
    like: (id: string) => apiClient.post(`/tracks/${id}/like`),
    unlike: (id: string) => apiClient.delete(`/tracks/${id}/like`),
    remix: (id: string, data: object) => apiClient.post(`/tracks/${id}/remix`, data),
    promote: (id: string, remixId: string) => apiClient.post(`/tracks/${id}/promote`, { remixId }),
  },

  // Auth
  auth: {
    login: (credentials: object) => apiClient.post('/auth/login', credentials),
    register: (data: object) => apiClient.post('/auth/register', data),
    logout: () => apiClient.post('/auth/logout'),
    refresh: () => apiClient.post('/auth/refresh'),
  },
};

export default apiClient;
