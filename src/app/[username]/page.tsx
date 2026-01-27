"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar, Navigation } from "@/components/layout";
import type { Track, User, TabItem } from "@/types";

// Realistic user profiles with varied data
const REALISTIC_USERS: Record<string, { user: User; tracks: Track[] }> = {
  "beatmaker_pro": {
    user: {
      id: "1",
      username: "beatmaker_pro",
      displayName: "BeatMaker Pro",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
      bio: "Grammy-nominated producer 🎹 | Created tracks for top artists | Available for collaborations",
      followersCount: 245000,
      followingCount: 892,
      tracksCount: 156,
      isVerified: true,
    },
    tracks: [
      {
        id: "t1",
        userId: "1",
        user: {
          id: "1",
          username: "beatmaker_pro",
          displayName: "BeatMaker Pro",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
          followersCount: 245000,
          followingCount: 892,
          tracksCount: 156,
          isVerified: true,
        },
        title: "Summer Vibes",
        description: "Chill beats for summer days ☀️",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
        durationSeconds: 195,
        likesCount: 45200,
        commentsCount: 1250,
        remixesCount: 45,
        createdAt: "2025-01-15T10:30:00Z",
        tags: ["summer", "chill", "beats"],
        isMain: true,
      },
      {
        id: "t2",
        userId: "1",
        user: {
          id: "1",
          username: "beatmaker_pro",
          displayName: "BeatMaker Pro",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
          followersCount: 245000,
          followingCount: 892,
          tracksCount: 156,
          isVerified: true,
        },
        title: "Midnight Dreams",
        description: "Late night studio session",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        durationSeconds: 210,
        likesCount: 38900,
        commentsCount: 892,
        remixesCount: 32,
        createdAt: "2025-01-10T22:15:00Z",
        tags: ["night", "dreamy", "electronic"],
      },
      {
        id: "t3",
        userId: "1",
        user: {
          id: "1",
          username: "beatmaker_pro",
          displayName: "BeatMaker Pro",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
          followersCount: 245000,
          followingCount: 892,
          tracksCount: 156,
          isVerified: true,
        },
        title: "Urban Flow",
        description: "Street beats for the soul",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        durationSeconds: 168,
        likesCount: 52100,
        commentsCount: 2340,
        remixesCount: 78,
        createdAt: "2025-01-05T18:45:00Z",
        tags: ["urban", "hiphop", "beats"],
      },
      {
        id: "t4",
        userId: "1",
        user: {
          id: "1",
          username: "beatmaker_pro",
          displayName: "BeatMaker Pro",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
          followersCount: 245000,
          followingCount: 892,
          tracksCount: 156,
          isVerified: true,
        },
        title: "Golden Hour",
        description: "Perfect sunset vibes",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        durationSeconds: 225,
        likesCount: 67800,
        commentsCount: 1890,
        remixesCount: 56,
        createdAt: "2025-01-01T19:30:00Z",
        tags: ["sunset", "chill", "vibes"],
      },
    ],
  },
  "synthwave_queen": {
    user: {
      id: "2",
      username: "synthwave_queen",
      displayName: "SynthWave Queen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave",
      bio: "Retrowave 🌆 | 80s vibes for the digital age | Vinyl collector",
      followersCount: 189000,
      followingCount: 445,
      tracksCount: 89,
      isVerified: true,
    },
    tracks: [
      {
        id: "t5",
        userId: "2",
        user: {
          id: "2",
          username: "synthwave_queen",
          displayName: "SynthWave Queen",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave",
          followersCount: 189000,
          followingCount: 445,
          tracksCount: 89,
          isVerified: true,
        },
        title: "Neon Lights",
        description: "Drive into the night",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        durationSeconds: 280,
        likesCount: 89400,
        commentsCount: 2340,
        remixesCount: 67,
        createdAt: "2025-01-12T20:00:00Z",
        tags: ["synthwave", "electronic", "retro"],
        isMain: true,
      },
      {
        id: "t6",
        userId: "2",
        user: {
          id: "2",
          username: "synthwave_queen",
          displayName: "SynthWave Queen",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave",
          followersCount: 189000,
          followingCount: 445,
          tracksCount: 89,
          isVerified: true,
        },
        title: "Cyber Sunset",
        description: "Future nostalgia",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        durationSeconds: 245,
        likesCount: 56700,
        commentsCount: 1560,
        remixesCount: 34,
        createdAt: "2025-01-08T19:00:00Z",
        tags: ["synthwave", "cyber", "nostalgia"],
      },
    ],
  },
  "lofi_chill": {
    user: {
      id: "3",
      username: "lofi_chill",
      displayName: "LoFi Chill",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
      bio: "Chill beats to study to 📚 | Rainy day vibes 🌧️ | Peace & positivity",
      followersCount: 456000,
      followingCount: 123,
      tracksCount: 234,
      isVerified: false,
    },
    tracks: [
      {
        id: "t7",
        userId: "3",
        user: {
          id: "3",
          username: "lofi_chill",
          displayName: "LoFi Chill",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
          followersCount: 456000,
          followingCount: 123,
          tracksCount: 234,
          isVerified: false,
        },
        title: "Rainy Day Study",
        description: "Perfect for focusing",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        durationSeconds: 180,
        likesCount: 156000,
        commentsCount: 4560,
        remixesCount: 123,
        createdAt: "2025-01-14T08:00:00Z",
        tags: ["lofi", "study", "chill"],
        isMain: true,
      },
      {
        id: "t8",
        userId: "3",
        user: {
          id: "3",
          username: "lofi_chill",
          displayName: "LoFi Chill",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
          followersCount: 456000,
          followingCount: 123,
          tracksCount: 234,
          isVerified: false,
        },
        title: "Coffee Shop Morning",
        description: "Start your day right",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        durationSeconds: 200,
        likesCount: 98000,
        commentsCount: 2890,
        remixesCount: 89,
        createdAt: "2025-01-11T09:30:00Z",
        tags: ["lofi", "morning", "cafe"],
      },
      {
        id: "t9",
        userId: "3",
        user: {
          id: "3",
          username: "lofi_chill",
          displayName: "LoFi Chill",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
          followersCount: 456000,
          followingCount: 123,
          tracksCount: 234,
          isVerified: false,
        },
        title: "Midnight Express",
        description: "Late night thoughts",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        durationSeconds: 165,
        likesCount: 123000,
        commentsCount: 3450,
        remixesCount: 156,
        createdAt: "2025-01-09T00:00:00Z",
        tags: ["lofi", "midnight", "thoughts"],
      },
    ],
  },
  "trap_master": {
    user: {
      id: "4",
      username: "trap_master",
      displayName: "Trap Master",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trap",
      bio: "🔥 HYPE 🔥 | Bass music producer | DJ | Touring worldwide",
      followersCount: 312000,
      followingCount: 678,
      tracksCount: 67,
      isVerified: true,
    },
    tracks: [
      {
        id: "t10",
        userId: "4",
        user: {
          id: "4",
          username: "trap_master",
          displayName: "Trap Master",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trap",
          followersCount: 312000,
          followingCount: 678,
          tracksCount: 67,
          isVerified: true,
        },
        title: "Hype Beast",
        description: "Turn up the volume",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        durationSeconds: 165,
        likesCount: 234000,
        commentsCount: 8900,
        remixesCount: 234,
        createdAt: "2025-01-13T22:00:00Z",
        tags: ["trap", "bass", "hype"],
        isMain: true,
      },
    ],
  },
  "house_vibes": {
    user: {
      id: "5",
      username: "house_vibes",
      displayName: "House Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=house",
      bio: "🏠 House Music | Club culture | Underground DJ since 2010",
      followersCount: 198000,
      followingCount: 234,
      tracksCount: 45,
      isVerified: false,
    },
    tracks: [
      {
        id: "t11",
        userId: "5",
        user: {
          id: "5",
          username: "house_vibes",
          displayName: "House Vibes",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=house",
          followersCount: 198000,
          followingCount: 234,
          tracksCount: 45,
          isVerified: false,
        },
        title: "Dance All Night",
        description: "The club is calling",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        durationSeconds: 320,
        likesCount: 78900,
        commentsCount: 2100,
        remixesCount: 67,
        createdAt: "2025-01-07T23:00:00Z",
        tags: ["house", "dance", "club"],
        isMain: true,
      },
    ],
  },
};

function generateRealisticProfile(username: string): { user: User; tracks: Track[] } {
  const cleanUsername = username.replace("@", "").toLowerCase();
  
  // Check if we have a predefined profile
  if (REALISTIC_USERS[cleanUsername]) {
    return REALISTIC_USERS[cleanUsername];
  }
  
  // Generate semi-realistic data for unknown users
  const displayName = cleanUsername.split('_').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const followerCount = Math.floor(Math.random() * 50000) + 500;
  const followingCount = Math.floor(Math.random() * 500) + 50;
  const trackCount = Math.floor(Math.random() * 20) + 1;
  
  const bios = [
    "Music creator 🎵 | Building the future of sound",
    "Independent artist | Dream big, create bigger ✨",
    "Audio engineer by day, producer by night 🎧",
    "Creating sounds that move you 💫",
    "Hip-hop enthusiast | Building my craft one beat at a time",
  ];
  
  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    username: cleanUsername,
    displayName: displayName,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanUsername)}`,
    bio: bios[Math.floor(Math.random() * bios.length)],
    followersCount: followerCount,
    followingCount: followingCount,
    tracksCount: trackCount,
    isVerified: false,
  };
  
  const tracks: Track[] = Array.from({ length: trackCount }, (_, i) => ({
    id: `track_${cleanUsername}_${i}`,
    userId: user.id,
    user: user,
    title: `Track ${i + 1}`,
    description: "Original track",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationSeconds: Math.floor(Math.random() * 180) + 120,
    likesCount: Math.floor(Math.random() * 5000) + 100,
    commentsCount: Math.floor(Math.random() * 200) + 10,
    remixesCount: Math.floor(Math.random() * 20),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ["original"],
  }));
  
  return { user, tracks };
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const rawUsername = params.username as string;
  const username = decodeURIComponent(rawUsername).replace("@", "").toLowerCase();
  const [activeTab, setActiveTab] = useState<TabItem>("home");
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${encodeURIComponent(username)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        setUser(data.user);
        setTracks(data.tracks || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
        // Use realistic mock data on error
        const { user: mockUser, tracks: mockTracks } = generateRealisticProfile(username);
        setUser(mockUser);
        setTracks(mockTracks);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileData();
    }
  }, [username]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Fallback user if still null
  const displayUser = user || {
    id: "1",
    username: username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
    bio: "Music creator 🎵 | Building the future of sound",
    followersCount: 0,
    followingCount: 0,
    tracksCount: 0,
    isVerified: false,
  };

  // Filter tracks based on active tab
  const filteredTracks = activeTab === "for-you" 
    ? tracks.filter(t => t.originalTrackId)
    : activeTab === "trending"
    ? []
    : tracks;

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Top Bar */}
      <TopBar
        title=""
        leftAction={
          <button
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        }
        rightAction={
          <button className="text-neutral-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        }
      />

      {/* Profile Content */}
      <div className="pb-20">
        {/* Header Banner - vary based on user */}
        <div className={`h-32 ${
          displayUser.isVerified 
            ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' 
            : 'bg-gradient-to-r from-primary-500 via-purple-500 to-secondary-500'
        }`} />

        {/* Profile Info */}
        <div className="px-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-neutral-950 bg-neutral-200 overflow-hidden">
              <img
                src={displayUser.avatarUrl}
                alt={displayUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {displayUser.displayName}
                </h1>
                {displayUser.isVerified && (
                  <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" />
                  </svg>
                )}
              </div>
              <p className="text-neutral-500">@{displayUser.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div className="text-center cursor-pointer">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {displayUser.tracksCount}
              </p>
              <p className="text-xs text-neutral-500">Tracks</p>
            </div>
            <div className="text-center cursor-pointer">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {displayUser.followersCount >= 1000000 
                  ? `${(displayUser.followersCount / 1000000).toFixed(1)}M`
                  : displayUser.followersCount >= 1000
                  ? `${(displayUser.followersCount / 1000).toFixed(1)}K`
                  : displayUser.followersCount.toLocaleString()
                }
              </p>
              <p className="text-xs text-neutral-500">Followers</p>
            </div>
            <div className="text-center cursor-pointer">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {displayUser.followingCount >= 1000 
                  ? `${(displayUser.followingCount / 1000).toFixed(1)}K`
                  : displayUser.followingCount
                }
              </p>
              <p className="text-xs text-neutral-500">Following</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 py-2.5 rounded-xl font-semibold transition-colors ${
                isFollowing
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  : "bg-primary-500 text-white hover:bg-primary-600"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>

          {/* Bio */}
          {displayUser.bio && (
            <p className="mt-4 text-neutral-700 dark:text-neutral-300">{displayUser.bio}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mt-6">
          {["Tracks", "Remixes", "Liked"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as TabItem)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.toLowerCase()
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tracks Grid */}
        {filteredTracks.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden relative cursor-pointer group"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(track.title)}`}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {track.isMain && (
                  <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                    ⭐ Main
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-medium text-sm truncate">{track.title}</p>
                  <p className="text-white/70 text-xs">
                    {track.likesCount >= 1000000 
                      ? `${(track.likesCount / 1000000).toFixed(1)}M likes`
                      : track.likesCount >= 1000
                      ? `${(track.likesCount / 1000).toFixed(1)}K likes`
                      : `${track.likesCount} likes`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-neutral-500">
              {activeTab === "for-you" ? "No remixes yet" : "No trending tracks yet"}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
