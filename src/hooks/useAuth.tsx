"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import type { User } from '@/types';
import { api } from '@/lib/api';

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Sync NextAuth session with our backend
  useEffect(() => {
    const syncOAuthUser = async () => {
      if (session?.user) {
        try {
          // Sync OAuth user with backend
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              const user: User = {
                id: data.user.id,
                username: data.user.username,
                displayName: data.user.displayName,
                avatarUrl: data.user.avatarUrl,
                bio: '',
                followersCount: 0,
                followingCount: 0,
                tracksCount: 0,
              };
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              localStorage.setItem('jamsync_token', (session as any).accessToken || 'oauth-token');
              setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            }
          }
        } catch (error) {
          console.error('Failed to sync OAuth user:', error);
        }
      }
    };

    if (status === 'authenticated') {
      syncOAuthUser();
    } else if (status === 'unauthenticated') {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [session, status]);

  // Fetch user from local token
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('jamsync_token');
    if (!token) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.id || '1',
        username: payload.username || 'user',
        displayName: payload.displayName || 'User',
        avatarUrl: payload.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.username || 'default'}`,
        bio: payload.bio || '',
        followersCount: 0,
        followingCount: 0,
        tracksCount: 0,
      };

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      localStorage.removeItem('jamsync_token');
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      fetchUser();
    }
  }, [status, fetchUser]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.auth.login({ email, password });

      if (response.data && response.status === 200) {
        const { accessToken, user } = response.data as AuthResponse;
        localStorage.setItem('jamsync_token', accessToken);
        
        setState({
          user: user as User,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed',
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred',
      }));
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.auth.register(data);

      if (response.data && response.status === 201) {
        const { accessToken, user } = response.data as AuthResponse;
        localStorage.setItem('jamsync_token', accessToken);
        
        setState({
          user: user as User,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred',
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      localStorage.removeItem('jamsync_token');
      // Sign out from NextAuth as well
      await nextAuthSignOut({ callbackUrl: '/login' });
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('jamsync_token');
    if (!token) return;

    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default unauthenticated state when used outside AuthProvider
    // This allows login/register pages to work during SSR/pre-rendering
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      refreshUser: async () => {},
      clearError: () => {},
    };
  }
  return context;
}

export default AuthContext;
