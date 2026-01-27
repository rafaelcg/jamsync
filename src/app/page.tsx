"use client";

import React, { useState, useEffect } from "react";

import { VideoFeed } from "@/components/feed";
import { UploadModal, RemixModal } from "@/components/modal";
import { Navigation, TopBar } from "@/components/layout";
import type { Track, User, TabItem } from "@/types";
import { api } from "@/lib/api";

// Mock feed data for fallback
const mockTracks: Track[] = [
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
    title: "Summer Vibes",
    description: "Chill beats for summer days",
    audioUrl: "/demo.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
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
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
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
    description: "Perfect for studying",
    audioUrl: "/demo.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 180,
    likesCount: 456000,
    commentsCount: 2340,
    remixesCount: 67,
    createdAt: "2025-01-13T18:45:00Z",
    tags: ["lofi", "chill", "study"],
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabItem>("home");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [selectedTrackForRemix, setSelectedTrackForRemix] = useState<Track | null>(null);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "home") {
      fetchTracks();
    }
  }, [activeTab]);

  const fetchTracks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.feed.getTimeline({ limit: 10, offset: 0 });
      if (response.data && typeof response.data === 'object' && 'tracks' in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fetchedTracks = (response.data as any).tracks as Track[];
        if (fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
        } else {
          // Use mock data as fallback
          setTracks(mockTracks);
        }
      } else if (Array.isArray(response.data) && response.data.length > 0) {
        setTracks(response.data);
      } else {
        // Use mock data as fallback
        setTracks(mockTracks);
      }
    } catch (err) {
      // Use mock data as fallback on error
      setTracks(mockTracks);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemix = (track: Track) => {
    setSelectedTrackForRemix(track);
    setShowRemixModal(true);
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
    // In production, this would open a share dialog
  };

  const handleUpload = (trackData: Partial<Track>) => {
    console.log("Uploading track:", trackData);
  };

  const handleRemixSubmit = (trackData: Partial<Track>) => {
    console.log("Creating remix:", trackData);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState message={error} onRetry={fetchTracks} />;
        return (
          <VideoFeed
            tracks={tracks}
            onRemix={handleRemix}
            onLike={handleLike}
            onShare={handleShare}
          />
        );
      case "discover":
        return <DiscoverPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-neutral-500">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {activeTab !== "home" && (
        <>
          {activeTab === "discover" && (
            <TopBar
              title="Discover"
              rightAction={
                <button className="p-2 text-neutral-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
              }
            />
          )}
          {activeTab === "profile" && <div className="h-14" />}
          {renderContent()}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}

      {activeTab === "home" && (
        <>
          {renderContent()}
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      {showRemixModal && selectedTrackForRemix && (
        <RemixModal
          isOpen={showRemixModal}
          onClose={() => setShowRemixModal(false)}
          originalTrack={selectedTrackForRemix}
          onRemix={handleRemixSubmit}
        />
      )}
    </div>
  );
}

function DiscoverPage() {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setIsLoading(true);
    // Use the error variable from the scope
    // We'll define a local setter if needed or just use the parent one
    try {
      const response = await api.feed.getTrending();
      if (response.data && typeof response.data === 'object' && 'tracks' in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTrendingTracks((response.data as any).tracks as Track[]);
      } else if (Array.isArray(response.data)) {
        setTrendingTracks(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-14 pb-20 px-4">
      <div className="sticky top-14 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl py-3 -mx-4 px-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search tracks, artists, hashtags..." className="w-full pl-10 pr-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-0 rounded-xl focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4 scrollbar-hide">
        {["All", "Hip Hop", "Electronic", "Rock", "Pop", "R&B", "Jazz", "Classical"].map((category, i) => (
          <button key={category} className={`flex-shrink-0 px-4 py-2 rounded-full font-medium ${i === 0 ? "bg-primary-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"}`}>
            {category}
          </button>
        ))}
      </div>

      <div className="py-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">🔥 Trending</h2>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-10">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trendingTracks.slice(0, 10).map((track) => (
              <div key={track.id} className="aspect-square bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl overflow-hidden relative cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60">
                  <p className="text-white font-medium truncate">{track.title}</p>
                  <p className="text-white/70 text-sm">@{track.user?.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile("beatmaker");
  }, []);

  const fetchProfile = async (username: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.users.getProfile(username);
      if (response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any;
        if (data.user) {
          setProfile(data.user);
          setTracks(data.user.tracks || []);
        } else if (data.username) {
          // If the API returns the user object directly
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
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => fetchProfile("beatmaker")} />;
  if (!profile) return null;

  return (
    <div className="pt-14">
      <UserProfilePage user={profile} tracks={tracks} />
    </div>
  );
}

function UserProfilePage({ user }: { user: User; tracks: Track[] }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="pb-20">
      <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500" />
      <div className="px-4 -mt-12">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-full border-4 border-white dark:border-neutral-950 bg-neutral-200 overflow-hidden">
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{user.displayName}</h1>
            <p className="text-neutral-500">@{user.username}</p>
          </div>
        </div>
        <div className="flex gap-6 mt-4">
          <div className="text-center"><p className="text-lg font-bold">{user.tracksCount}</p><p className="text-xs text-neutral-500">Tracks</p></div>
          <div className="text-center"><p className="text-lg font-bold">{user.followersCount}</p><p className="text-xs text-neutral-500">Followers</p></div>
          <div className="text-center"><p className="text-lg font-bold">{user.followingCount}</p><p className="text-xs text-neutral-500">Following</p></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setIsFollowing(!isFollowing)} className={`flex-1 py-2.5 rounded-xl font-semibold ${isFollowing ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white" : "bg-primary-500 text-white"}`}>
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
        </div>
        {user.bio && <p className="mt-4 text-neutral-700 dark:text-neutral-300">{user.bio}</p>}
      </div>
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mt-6">
        {["Tracks", "Remixes", "Liked"].map((tab, i) => (
          <button key={tab} className={`flex-1 py-3 text-sm font-medium ${i === 0 ? "text-primary-600 border-b-2 border-primary-600" : "text-neutral-500"}`}>{tab}</button>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Something went wrong</h3>
      <p className="text-neutral-500 mb-6">{message}</p>
      <button onClick={onRetry} className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
        Try Again
      </button>
    </div>
  );
}
