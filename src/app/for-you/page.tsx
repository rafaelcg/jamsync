"use client";

import React, { useState, useEffect } from "react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { VideoFeed } from "@/components/feed";
import { Navigation, TopBar } from "@/components/layout";
import type { Track, TabItem } from "@/types";
import { api } from "@/lib/api";

export default function ForYouPage() {
  const [activeTab, setActiveTab] = useState<TabItem>("for-you");
  const [, setSelectedTrackForRemix] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchForYouTracks();
  }, []);

  const fetchForYouTracks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.feed.getTimeline({ limit: 10, offset: 0 });
      if (response.data && typeof response.data === 'object' && 'tracks' in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTracks((response.data as any).tracks as Track[]);
      } else if (Array.isArray(response.data)) {
        setTracks(response.data);
      } else {
        setError("Failed to load tracks");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemix = (track: Track) => {
    setSelectedTrackForRemix(track);
    // In production, this would open a remix modal
    console.log("Opening remix modal for:", track.title);
  };

  const handleLike = async (trackId: string) => {
    try {
      await api.tracks.like(trackId);
      // Update the track's like count in the UI
      setTracks(prevTracks => 
        prevTracks.map(track => 
          track.id === trackId 
            ? { ...track, likesCount: (track.likesCount || 0) + 1 }
            : track
        )
      );
    } catch (error) {
      console.error("Failed to like track:", error);
    }
  };

  const handleShare = (trackId: string) => {
    console.log("Shared:", trackId);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top Bar */}
      <TopBar
        title="For You"
        rightAction={
          <button className="p-2 text-neutral-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
        }
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
          <p className="text-neutral-500 mb-6">{error}</p>
          <button 
            onClick={fetchForYouTracks}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Personalized Feed */}
      {!isLoading && !error && (
        <div className="pb-20">
          <VideoFeed
            tracks={tracks}
            onRemix={handleRemix}
            onLike={handleLike}
            onShare={handleShare}
          />
        </div>
      )}

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
