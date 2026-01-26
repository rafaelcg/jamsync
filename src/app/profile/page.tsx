"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/components/profile";
import type { User, Track } from "@/types";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setIsDataLoading(true);
    setError(null);
    try {
      // Get current user's username from auth context or localStorage
      const currentUsername = typeof window !== 'undefined' 
        ? localStorage.getItem('currentUsername') || 'musicmaker'
        : 'musicmaker';
      
      const response = await api.users.getProfile(currentUsername);
      if (response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any;
        if (data.user) {
          setProfile(data.user);
          setTracks(data.user.tracks || []);
        } else if (data.username) {
          setProfile(data);
          setTracks(data.tracks || []);
        } else {
          setError("User data missing in response");
        }
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsLoading(true);
    // Navigate to edit profile page
    router.push('/profile/edit');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Loading State for data */}
      {isDataLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isDataLoading && (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button 
            onClick={fetchUserProfile}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Profile Content */}
      {!isDataLoading && !error && profile && (
        <UserProfile
          user={profile}
          tracks={tracks}
          isOwnProfile={true}
          onEditProfile={handleEditProfile}
        />
      )}
    </div>
  );
}
