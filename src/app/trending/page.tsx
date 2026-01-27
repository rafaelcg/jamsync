"use client";

import React, { useState, useEffect } from "react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { Navigation, TopBar } from "@/components/layout";
import type { Track, TabItem } from "@/types";
import { api } from "@/lib/api";

// Mock trending data for fallback
const mockTrendingTracks: Track[] = [
  {
    id: "1",
    userId: "user1",
    user: {
      id: "user1",
      username: "beatmaker_pro",
      displayName: "BeatMaker Pro",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
      bio: "Creating beats that move you",
      followersCount: 125000,
      followingCount: 45,
      tracksCount: 89,
    },
    title: "Summer Nights",
    description: "The ultimate summer anthem",
    audioUrl: "/demo.mp3",
    durationSeconds: 195,
    likesCount: 245000,
    commentsCount: 1250,
    remixesCount: 45,
    createdAt: "2025-01-15T10:30:00Z",
    tags: ["summer", "chill", "beats"],
  },
  {
    id: "2",
    userId: "user2",
    user: {
      id: "user2",
      username: "synthwave_queen",
      displayName: "SynthWave Queen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave",
      bio: "Retro vibes for the future",
      followersCount: 89000,
      followingCount: 120,
      tracksCount: 45,
    },
    title: "Neon Dreams",
    description: "Drive into the night",
    audioUrl: "/demo.mp3",
    durationSeconds: 220,
    likesCount: 189000,
    commentsCount: 890,
    remixesCount: 32,
    createdAt: "2025-01-14T22:15:00Z",
    tags: ["synthwave", "electronic", "retro"],
  },
  {
    id: "3",
    userId: "user3",
    user: {
      id: "user3",
      username: "lofi_chill",
      displayName: "LoFi Chill",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
      bio: "Chill beats to study to",
      followersCount: 234000,
      followingCount: 67,
      tracksCount: 156,
    },
    title: "Rainy Day",
    description: "Perfect for studying or relaxing",
    audioUrl: "/demo.mp3",
    durationSeconds: 180,
    likesCount: 456000,
    commentsCount: 2340,
    remixesCount: 67,
    createdAt: "2025-01-13T18:45:00Z",
    tags: ["lofi", "chill", "study"],
  },
  {
    id: "4",
    userId: "user4",
    user: {
      id: "user4",
      username: "trap_master",
      displayName: "Trap Master",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trap",
      bio: "808s and dreams",
      followersCount: 178000,
      followingCount: 89,
      tracksCount: 78,
    },
    title: "Hype Beast",
    description: "Turn up the volume",
    audioUrl: "/demo.mp3",
    durationSeconds: 165,
    likesCount: 312000,
    commentsCount: 1560,
    remixesCount: 89,
    createdAt: "2025-01-12T14:30:00Z",
    tags: ["trap", "hiphop", "hype"],
  },
  {
    id: "5",
    userId: "user5",
    user: {
      id: "user5",
      username: "house_vibes",
      displayName: "House Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=house",
      bio: "Feel the rhythm",
      followersCount: 95000,
      followingCount: 156,
      tracksCount: 67,
    },
    title: "Dance All Night",
    description: "The club is calling",
    audioUrl: "/demo.mp3",
    durationSeconds: 210,
    likesCount: 198000,
    commentsCount: 980,
    remixesCount: 45,
    createdAt: "2025-01-11T20:00:00Z",
    tags: ["house", "dance", "electronic"],
  },
];

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState<TabItem>("trending");
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "day">("all");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  const fetchTrendingTracks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.feed.getTrending({
        limit: 20,
        offset: 0,
        timeRange: timeFilter
      });
      if (response.data && typeof response.data === 'object' && 'tracks' in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fetchedTracks = (response.data as any).tracks as Track[];
        if (fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
        } else {
          // Use mock data as fallback
          setTracks(mockTrendingTracks);
        }
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setTracks(response.data);
      } else {
        // Use mock data as fallback
        setTracks(mockTrendingTracks);
      }
    } catch (err) {
      // Use mock data as fallback on error
      setTracks(mockTrendingTracks);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top Bar */}
      <TopBar
        title="Trending"
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

      {/* Time Filter */}
      <div className="sticky top-14 z-10 bg-neutral-950/80 backdrop-blur-xl py-3 px-4 border-b border-neutral-800">
        <div className="flex gap-2">
          {(["all", "week", "day"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {filter === "all" ? "All Time" : filter === "week" ? "This Week" : "Today"}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Charts */}
      <div className="pb-20 px-4">
        {/* Top 3 Featured */}
        <div className="py-4">
          <h2 className="text-lg font-bold text-white mb-4">🔥 Hot Tracks</h2>
          <div className="space-y-3">
            {tracks.slice(0, 3).map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-3 p-3 bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <span
                  className={`text-xl font-bold w-8 ${
                    index === 0
                      ? "text-yellow-400"
                      : index === 1
                      ? "text-gray-300"
                      : index === 2
                      ? "text-amber-600"
                      : "text-neutral-500"
                  }`}
                >
                  #{index + 1}
                </span>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden flex-shrink-0">
                  <img
                    src={track.user.avatarUrl}
                    alt={track.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{track.title}</p>
                  <p className="text-neutral-400 text-sm">@{track.user.username}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-primary-500 font-medium">
                    {track.likesCount > 1000000
                      ? `${(track.likesCount / 1000000).toFixed(1)}M`
                      : track.likesCount > 1000
                      ? `${(track.likesCount / 1000).toFixed(0)}K`
                      : track.likesCount}
                    ❤️
                  </p>
                  <p className="text-xs text-neutral-500">{track.remixesCount} remixes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* More Trending */}
        <div className="py-4">
          <h2 className="text-lg font-bold text-white mb-4">📈 Rising</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {tracks.slice(3).map((track) => (
              <div
                key={track.id}
                className="aspect-square bg-neutral-900 rounded-xl overflow-hidden relative cursor-pointer group"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-medium text-sm truncate">{track.title}</p>
                  <p className="text-white/70 text-xs">@{track.user.username}</p>
                  <p className="text-primary-400 text-xs mt-1">
                    ❤️ {track.likesCount > 1000 ? `${(track.likesCount / 1000).toFixed(0)}K` : track.likesCount}
                  </p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Trending Creators */}
        <div className="py-4">
          <h2 className="text-lg font-bold text-white mb-4">⭐ Top Creators</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {tracks.map((track) => (
              <div
                key={`creator-${track.user.id}`}
                className="flex-shrink-0 text-center"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 mx-auto">
                  <img
                    src={track.user.avatarUrl}
                    alt={track.user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white text-sm mt-2 truncate w-20">
                  @{track.user.username}
                </p>
                <p className="text-neutral-500 text-xs">
                  {(track.user.followersCount / 1000).toFixed(0)}K followers
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
