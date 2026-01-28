"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserProfile } from "@/components/profile";
import { Navigation } from "@/components/layout";
import type { Track, User } from "@/types";
import { api } from "@/lib/api";

// Realistic user profiles with varied data
const REALISTIC_USERS: Record<string, { user: User; tracks: Track[] }> = {
  // ==================== VERIFIED ARTISTS ====================
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
        user: {} as User,
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
      },
      {
        id: "t3",
        userId: "u1",
        user: {} as User,
        title: "Ocean Waves",
        description: "Sounds of the sea 🌊",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        durationSeconds: 245,
        likesCount: 52100,
        commentsCount: 1456,
        remixesCount: 67,
        createdAt: "2025-01-08T18:00:00Z",
        tags: ["ambient", "nature", "chill"],
      },
    ],
  },
  "synthwave_queen": {
    user: {
      id: "u2",
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
        id: "t4",
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
      },
      {
        id: "t5",
        userId: "u2",
        user: {} as User,
        title: "Miami Nights",
        description: "South Beach vibes",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        durationSeconds: 265,
        likesCount: 67200,
        commentsCount: 1876,
        remixesCount: 54,
        createdAt: "2025-01-06T22:30:00Z",
        tags: ["synthwave", "80s", "vaporwave"],
      },
    ],
  },
  "trap_master": {
    user: {
      id: "u3",
      username: "trap_master",
      displayName: "Trap Master",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trap",
      bio: "🔥 HYPE 🔥 | Bass music producer | DJ | Touring worldwide | SYFY channel collaborator",
      followersCount: 312000,
      followingCount: 678,
      tracksCount: 67,
      isVerified: true,
    },
    tracks: [
      {
        id: "t6",
        userId: "u3",
        user: {} as User,
        title: "Hype Beast",
        description: "Turn up the volume to the max",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        durationSeconds: 165,
        likesCount: 234000,
        commentsCount: 8900,
        remixesCount: 234,
        createdAt: "2025-01-13T22:00:00Z",
        tags: ["trap", "bass", "hype", "drill"],
      },
      {
        id: "t7",
        userId: "u3",
        user: {} as User,
        title: "Thunder",
        description: "Bass drop incoming ⚡",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        durationSeconds: 185,
        likesCount: 189000,
        commentsCount: 5670,
        remixesCount: 189,
        createdAt: "2025-01-09T02:00:00Z",
        tags: ["trap", "dubstep", "heavy"],
      },
    ],
  },
  "jazz_hop_collective": {
    user: {
      id: "u4",
      username: "jazz_hop_collective",
      displayName: "Jazz Hop Collective",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jazzhop",
      bio: "Smooth jazz meets hiphop 🎷☕ | Instrumental relaxation | Study music",
      followersCount: 178000,
      followingCount: 234,
      tracksCount: 45,
      isVerified: true,
    },
    tracks: [
      {
        id: "t8",
        userId: "u4",
        user: {} as User,
        title: "Coffee Shop Sessions",
        description: "Morning jazz for the soul",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        durationSeconds: 320,
        likesCount: 89000,
        commentsCount: 2340,
        remixesCount: 78,
        createdAt: "2025-01-11T08:00:00Z",
        tags: ["jazz", "chill", "instrumental"],
      },
      {
        id: "t9",
        userId: "u4",
        user: {} as User,
        title: "Blue Notes",
        description: "Smooth sax vibes",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        durationSeconds: 298,
        likesCount: 67800,
        commentsCount: 1890,
        remixesCount: 56,
        createdAt: "2025-01-05T14:30:00Z",
        tags: ["jazz", "smooth", "saxophone"],
      },
    ],
  },

  // ==================== UP-AND-COMING CREATORS ====================
  "lofi_chill": {
    user: {
      id: "u5",
      username: "lofi_chill",
      displayName: "LoFi Chill",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
      bio: "Chill beats to study to 📚 | Rainy day vibes 🌧️ | Peace & positivity ✌️",
      followersCount: 456000,
      followingCount: 123,
      tracksCount: 234,
      isVerified: false,
    },
    tracks: [
      {
        id: "t10",
        userId: "u5",
        user: {} as User,
        title: "Rainy Day Study",
        description: "Perfect for focusing on your work",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        durationSeconds: 180,
        likesCount: 156000,
        commentsCount: 4560,
        remixesCount: 123,
        createdAt: "2025-01-14T08:00:00Z",
        tags: ["lofi", "study", "chill", "rain"],
      },
      {
        id: "t11",
        userId: "u5",
        user: {} as User,
        title: "Sleepy Head",
        description: "Lofi for dreams 💤",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        durationSeconds: 210,
        likesCount: 234000,
        commentsCount: 6780,
        remixesCount: 234,
        createdAt: "2025-01-12T02:00:00Z",
        tags: ["lofi", "sleep", "dreamy"],
      },
      {
        id: "t12",
        userId: "u5",
        user: {} as User,
        title: "Sunday Morning",
        description: "Lazy vibes for the weekend",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        durationSeconds: 195,
        likesCount: 198000,
        commentsCount: 5670,
        remixesCount: 189,
        createdAt: "2025-01-11T10:00:00Z",
        tags: ["lofi", "morning", "chill", "weekend"],
      },
    ],
  },
  "house_vibes": {
    user: {
      id: "u6",
      username: "house_vibes",
      displayName: "House Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=house",
      bio: "🏠 House Music | Club culture enthusiast | Underground DJ sets 🎧",
      followersCount: 198000,
      followingCount: 234,
      tracksCount: 45,
      isVerified: false,
    },
    tracks: [
      {
        id: "t13",
        userId: "u6",
        user: {} as User,
        title: "Dance All Night",
        description: "The club is calling your name",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        durationSeconds: 320,
        likesCount: 78900,
        commentsCount: 2100,
        remixesCount: 67,
        createdAt: "2025-01-07T23:00:00Z",
        tags: ["house", "dance", "club", "electronic"],
      },
      {
        id: "t14",
        userId: "u6",
        user: {} as User,
        title: "Sunset Terrace",
        description: "Warm house for golden hour",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        durationSeconds: 345,
        likesCount: 56700,
        commentsCount: 1560,
        remixesCount: 45,
        createdAt: "2025-01-03T19:00:00Z",
        tags: ["house", "deep house", "sunset"],
      },
    ],
  },

  // ==================== EMERGING ARTISTS ====================
  "indie_soul": {
    user: {
      id: "u7",
      username: "indie_soul",
      displayName: "Indie Soul",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=indie",
      bio: "Singer-songwriter 🎤 | Folk & indie vibes 🌿 | New EP out now!",
      followersCount: 34500,
      followingCount: 567,
      tracksCount: 23,
      isVerified: false,
    },
    tracks: [
      {
        id: "t15",
        userId: "u7",
        user: {} as User,
        title: "Wildflower",
        description: "Acoustic folk for the wanderer",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        durationSeconds: 256,
        likesCount: 12300,
        commentsCount: 456,
        remixesCount: 23,
        createdAt: "2025-01-10T15:30:00Z",
        tags: ["indie", "folk", "acoustic", "singer-songwriter"],
      },
      {
        id: "t16",
        userId: "u7",
        user: {} as User,
        title: "Mountain High",
        description: "Folk journey into nature",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        durationSeconds: 289,
        likesCount: 8900,
        commentsCount: 234,
        remixesCount: 18,
        createdAt: "2025-01-06T12:00:00Z",
        tags: ["folk", "indie", "nature", "acoustic"],
      },
    ],
  },
  "rnb_sensation": {
    user: {
      id: "u8",
      username: "rnb_sensation",
      displayName: "RnB Sensation",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rnb",
      bio: "Smooth R&B 🎵 | Love ballads & soul | Dreamy vibes only ✨",
      followersCount: 67800,
      followingCount: 345,
      tracksCount: 34,
      isVerified: false,
    },
    tracks: [
      {
        id: "t17",
        userId: "u8",
        user: {} as User,
        title: "Midnight Calls",
        description: "Late night conversations",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        durationSeconds: 234,
        likesCount: 34500,
        commentsCount: 1890,
        remixesCount: 78,
        createdAt: "2025-01-13T02:00:00Z",
        tags: ["rnb", "smooth", "ballad", "romance"],
      },
      {
        id: "t18",
        userId: "u8",
        user: {} as User,
        title: "Velvet Dreams",
        description: "Silky smooth sounds",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        durationSeconds: 267,
        likesCount: 28900,
        commentsCount: 1234,
        remixesCount: 56,
        createdAt: "2025-01-08T22:30:00Z",
        tags: ["rnb", "soul", "smooth", "love"],
      },
    ],
  },

  // ==================== CASUAL CREATORS ====================
  "bedroom_producer": {
    user: {
      id: "u9",
      username: "bedroom_producer",
      displayName: "Bedroom Producer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bedroom",
      bio: "🎹 Making beats in my room | Learning everyday | Feedback welcome!",
      followersCount: 1250,
      followingCount: 890,
      tracksCount: 12,
      isVerified: false,
    },
    tracks: [
      {
        id: "t19",
        userId: "u9",
        user: {} as User,
        title: "First Attempt",
        description: "My very first beat - be kind 😅",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        durationSeconds: 145,
        likesCount: 234,
        commentsCount: 56,
        remixesCount: 5,
        createdAt: "2025-01-14T16:00:00Z",
        tags: ["work in progress", "learning", "first"],
      },
      {
        id: "t20",
        userId: "u9",
        user: {} as User,
        title: "Experiment 42",
        description: "Trying something new with sounds",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        durationSeconds: 178,
        likesCount: 456,
        commentsCount: 89,
        remixesCount: 8,
        createdAt: "2025-01-10T20:00:00Z",
        tags: ["experiment", "lofi", "chill"],
      },
    ],
  },
  "drummer_boy": {
    user: {
      id: "u10",
      username: "drummer_boy",
      displayName: "Drummer Boy",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=drums",
      bio: "🥁 Live drums | Rhythm enthusiast | Band practice recordings",
      followersCount: 3400,
      followingCount: 567,
      tracksCount: 8,
      isVerified: false,
    },
    tracks: [
      {
        id: "t21",
        userId: "u10",
        user: {} as User,
        title: "Jam Session 1",
        description: "Quick drum practice clip",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        durationSeconds: 95,
        likesCount: 567,
        commentsCount: 123,
        remixesCount: 12,
        createdAt: "2025-01-12T14:00:00Z",
        tags: ["drums", "live", "practice"],
      },
    ],
  },

  // ==================== VERIFIED DJs/PRODUCERS ====================
  "dj_quantum": {
    user: {
      id: "u11",
      username: "dj_quantum",
      displayName: "DJ Quantum",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=dj",
      bio: "🎧 International DJ | Festival sets & underground mixes | Stream live!",
      followersCount: 567000,
      followingCount: 189,
      tracksCount: 78,
      isVerified: true,
    },
    tracks: [
      {
        id: "t22",
        userId: "u11",
        user: {} as User,
        title: "Festival Banger 2025",
        description: "Big room energy for the masses",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        durationSeconds: 198,
        likesCount: 456000,
        commentsCount: 12300,
        remixesCount: 567,
        createdAt: "2025-01-15T00:00:00Z",
        tags: ["edm", "festival", "big room", "hype"],
      },
      {
        id: "t23",
        userId: "u11",
        user: {} as User,
        title: "Underground Mix Vol. 3",
        description: "Hidden gems from the club",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        durationSeconds: 420,
        likesCount: 234000,
        commentsCount: 8900,
        remixesCount: 345,
        createdAt: "2025-01-11T22:00:00Z",
        tags: ["techno", "underground", "club"],
      },
      {
        id: "t24",
        userId: "u11",
        user: {} as User,
        title: "Sunrise Set",
        description: "Afterhours vibes till dawn",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        durationSeconds: 380,
        likesCount: 189000,
        commentsCount: 5670,
        remixesCount: 234,
        createdAt: "2025-01-09T06:00:00Z",
        tags: ["progressive", "trance", "sunrise"],
      },
    ],
  },
  "bass_god": {
    user: {
      id: "u12",
      username: "bass_god",
      displayName: "Bass God",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bass",
      bio: "💥 SUBWOOFER TESTING | Dubstep & Bass Music | Drop the bass! 🔊",
      followersCount: 789000,
      followingCount: 156,
      tracksCount: 45,
      isVerified: true,
    },
    tracks: [
      {
        id: "t25",
        userId: "u12",
        user: {} as User,
        title: "Earthquake",
        description: "Your neighbors will hate this 😈",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        durationSeconds: 165,
        likesCount: 678000,
        commentsCount: 15600,
        remixesCount: 890,
        createdAt: "2025-01-14T22:00:00Z",
        tags: ["dubstep", "bass", "heavy", "wobble"],
      },
      {
        id: "t26",
        userId: "u12",
        user: {} as User,
        title: "Low End Theory",
        description: "All about that bass",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        durationSeconds: 195,
        likesCount: 456000,
        commentsCount: 10200,
        remixesCount: 567,
        createdAt: "2025-01-10T02:00:00Z",
        tags: ["dubstep", "bass", "riddim"],
      },
    ],
  },

  // ==================== COLLABORATIVE/GROUP ACCOUNTS ====================
  "studio_collectiv": {
    user: {
      id: "u13",
      username: "studio_collectiv",
      displayName: "Studio Collective",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=collective",
      bio: "🎵 Community of creators | Collabs welcome | Submit your tracks!",
      followersCount: 89000,
      followingCount: 1234,
      tracksCount: 167,
      isVerified: false,
    },
    tracks: [
      {
        id: "t27",
        userId: "u13",
        user: {} as User,
        title: "Community Collab #1",
        description: "Made by 5 artists from our community",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        durationSeconds: 267,
        likesCount: 34500,
        commentsCount: 2340,
        remixesCount: 156,
        createdAt: "2025-01-13T18:00:00Z",
        tags: ["collab", "community", "collective"],
      },
      {
        id: "t28",
        userId: "u13",
        user: {} as User,
        title: "Remote Sessions",
        description: "Created across 3 time zones",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        durationSeconds: 312,
        likesCount: 23400,
        commentsCount: 1890,
        remixesCount: 123,
        createdAt: "2025-01-08T20:00:00Z",
        tags: ["collab", "remote", "multi-artist"],
      },
    ],
  },

  // ==================== CONTENT CREATORS/MUSIC ENTHUSIASTS ====================
  "music_reviewer": {
    user: {
      id: "u14",
      username: "music_reviewer",
      displayName: "Music Reviewer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer",
      bio: "🎧 Album reviews & track breakdowns | New music every week | Sub for access",
      followersCount: 234000,
      followingCount: 456,
      tracksCount: 89,
      isVerified: false,
    },
    tracks: [
      {
        id: "t29",
        userId: "u14",
        user: {} as User,
        title: "Track Breakdown: Summer Hit",
        description: "Analyzing the production techniques",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        durationSeconds: 345,
        likesCount: 56700,
        commentsCount: 4560,
        remixesCount: 89,
        createdAt: "2025-01-12T15:00:00Z",
        tags: ["breakdown", "review", "production"],
      },
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
  
  // Handle URL-encoded usernames properly - decode first, then normalize
  const rawUsername = params.username as string || '';
  const cleanUsername = decodeURIComponent(rawUsername).replace(/^@/, '').toLowerCase();
  
  const [profile, setProfile] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!cleanUsername) return;
      
      try {
        setIsLoading(true);
        // Try real API first - pass cleaned username
        const response = await api.users.getProfile(cleanUsername);
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
          const { user: mockUser, tracks: mockTracks } = generateRealisticProfile(cleanUsername);
          setProfile(mockUser);
          setTracks(mockTracks);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        // Fallback to mock data
        const { user: mockUser, tracks: mockTracks } = generateRealisticProfile(cleanUsername);
        setProfile(mockUser);
        setTracks(mockTracks);
      } finally {
        setIsLoading(false);
      }
    };

    if (cleanUsername) {
      fetchProfile();
    }
  }, [cleanUsername]);
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
