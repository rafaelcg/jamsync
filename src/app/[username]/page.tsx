"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserProfile } from "@/components/profile";
import { Navigation } from "@/components/layout";
import type { Track, User } from "@/types";
import { api } from "@/lib/api";

// Realistic user profiles with varied data
const REALISTIC_USERS: Record<string, { user: User; tracks: Track[] }> = {
  "beatmaker_pro": {
    user: {
      id: "u1",
      username: "beatmaker_pro",
      displayName: "BeatMaker Pro",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatmaker",
      bio: "Grammy-nominated producer 🎹 | Creating hits since 2015 | Let's collaborate!",
      followersCount: 245000,
      followingCount: 892,
      tracksCount: 156,
      isVerified: true,
    },
    tracks: [
      {
        id: "t1",
        userId: "u1",
        user: {} as User, // Will be filled
        title: "Summer Vibes",
        description: "Chill beats for summer days ☀️",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        durationSeconds: 195,
        likesCount: 45200,
        commentsCount: 1250,
        remixesCount: 45,
        createdAt: "2025-01-15T10:30:00Z",
        tags: ["summer", "chill", "beats"],
      },
      {
        id: "t2",
        userId: "u1",
        user: {} as User,
        title: "Midnight Dreams",
        description: "Late night studio session",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        durationSeconds: 210,
        likesCount: 38900,
        commentsCount: 892,
        remixesCount: 32,
        createdAt: "2025-01-10T22:15:00Z",
        tags: ["night", "dreamy", "electronic"],
      }
    ],
  },
  "synthwave_queen": {
    user: {
      id: "u2",
      username: "synthwave_queen",
      displayName: "SynthWave Queen",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthwave",
      bio: "Retrowave 🌆 | 80s vibes for the digital age | Vinyl lover",
      followersCount: 189000,
      followingCount: 445,
      tracksCount: 89,
      isVerified: true,
    },
    tracks: [
      {
        id: "t3",
        userId: "u2",
        user: {} as User,
        title: "Neon Lights",
        description: "Drive into the night",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        durationSeconds: 280,
        likesCount: 89400,
        commentsCount: 2340,
        remixesCount: 67,
        createdAt: "2025-01-12T20:00:00Z",
        tags: ["synthwave", "electronic", "retro"],
      }
    ],
  },
  "lofi_chill": {
    user: {
      id: "u3",
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
        id: "t4",
        userId: "u3",
        user: {} as User,
        title: "Rainy Day Study",
        description: "Perfect for focusing",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        durationSeconds: 180,
        likesCount: 156000,
        commentsCount: 4560,
        remixesCount: 123,
        createdAt: "2025-01-14T08:00:00Z",
        tags: ["lofi", "study", "chill"],
      }
    ],
  },
  "trap_master": {
    user: {
      id: "u4",
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
        id: "t5",
        userId: "u4",
        user: {} as User,
        title: "Hype Beast",
        description: "Turn up the volume",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        durationSeconds: 165,
        likesCount: 234000,
        commentsCount: 8900,
        remixesCount: 234,
        createdAt: "2025-01-13T22:00:00Z",
        tags: ["trap", "bass", "hype"],
      }
    ],
  },
  "house_vibes": {
    user: {
      id: "u5",
      username: "house_vibes",
      displayName: "House Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=house",
      bio: "🏠 House Music | Club culture | Underground DJ",
      followersCount: 198000,
      followingCount: 234,
      tracksCount: 45,
      isVerified: false,
    },
    tracks: [
      {
        id: "t6",
        userId: "u5",
        user: {} as User,
        title: "Dance All Night",
        description: "The club is calling",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        durationSeconds: 320,
        likesCount: 78900,
        commentsCount: 2100,
        remixesCount: 67,
        createdAt: "2025-01-07T23:00:00Z",
        tags: ["house", "dance", "club"],
      }
    ],
  },
};

// Initialize track users
Object.values(REALISTIC_USERS).forEach(data => {
  data.tracks.forEach(track => {
    track.user = data.user;
  });
});

function generateRealisticProfile(username: string): { user: User; tracks: Track[] } {
  const cleanUsername = username.replace("@", "").toLowerCase();
  
  if (REALISTIC_USERS[cleanUsername]) {
    return REALISTIC_USERS[cleanUsername];
  }
  
  // Generate semi-realistic data for unknown users
  const displayName = cleanUsername.split('_').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  const followerCount = Math.floor(Math.random() * 50000) + 500;
  const followingCount = Math.floor(Math.random() * 500) + 50;
  const trackCount = Math.floor(Math.random() * 10) + 1;
  
  const user: User = {
    id: `u_${cleanUsername}`,
    username: cleanUsername,
    displayName: displayName,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanUsername)}`,
    bio: `Music creator 🎵 | Building my sound on JamSync`,
    followersCount: followerCount,
    followingCount: followingCount,
    tracksCount: trackCount,
    isVerified: false,
  };
  
  const tracks: Track[] = Array.from({ length: trackCount }, (_, i) => ({
    id: `track_${cleanUsername}_${i}`,
    userId: user.id,
    user: user,
    title: `Project ${i + 1}`,
    description: "Work in progress",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationSeconds: 180,
    likesCount: Math.floor(Math.random() * 1000) + 10,
    commentsCount: Math.floor(Math.random() * 50) + 1,
    remixesCount: Math.floor(Math.random() * 10),
    createdAt: new Date().toISOString(),
    tags: ["original"],
  }));
  
  return { user, tracks };
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const rawUsername = params.username as string;
  const username = decodeURIComponent(rawUsername).replace("@", "");
  
  const [profile, setProfile] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Try real API first
        const response = await api.users.getProfile(username);
        if (response.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = response.data as any;
          if (data.user) {
            setProfile(data.user);
            setTracks(data.tracks || []);
          } else {
            setProfile(data);
            setTracks(data.tracks || []);
          }
        } else {
          // Use mock data
          const { user: mockUser, tracks: mockTracks } = generateRealisticProfile(username);
          setProfile(mockUser);
          setTracks(mockTracks);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        const { user: mockUser, tracks: mockTracks } = generateRealisticProfile(username);
        setProfile(mockUser);
        setTracks(mockTracks);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-white mb-2">User not found</h2>
        <button onClick={() => router.push("/")} className="text-primary-500 font-medium">
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <UserProfile 
        user={profile} 
        tracks={tracks} 
        isOwnProfile={false} 
      />
      <Navigation activeTab="profile" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
    </div>
  );
}
