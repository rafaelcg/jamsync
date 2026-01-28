"use client";

import React, { useState, useEffect } from "react";

import { VideoFeed } from "@/components/feed";
import { UploadModal, RemixModal } from "@/components/modal";
import { Navigation, TopBar } from "@/components/layout";
import type { Track, User, TabItem } from "@/types";
import { api } from "@/lib/api";

// Mock feed data for fallback - 20+ realistic tracks
const mockTracks: Track[] = [
  {
    id: "1",
    userId: "user1",
    user: {
      id: "user1",
      username: "neonhorizons",
      displayName: "Neon Horizons",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=neonhorizons",
      bio: "Synthwave producer from Tokyo 🎹",
      followersCount: 245000,
      followingCount: 189,
      tracksCount: 67,
    },
    title: "Midnight City Dreams",
    description: "Drive into the night ✨",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 215,
    likesCount: 124000,
    commentsCount: 2340,
    remixesCount: 89,
    createdAt: "2025-01-15T10:30:00Z",
    tags: ["synthwave", "electronic", "80s", "retro"],
  },
  {
    id: "2",
    userId: "user2",
    user: {
      id: "user2",
      username: "lunabeats",
      displayName: "Luna Beats",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lunabeats",
      bio: "Chill vibes only 🌙",
      followersCount: 189000,
      followingCount: 234,
      tracksCount: 89,
    },
    title: "Ocean Waves",
    description: "Lo-fi beats to study to 🌊",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationSeconds: 182,
    likesCount: 456000,
    commentsCount: 4560,
    remixesCount: 156,
    createdAt: "2025-01-14T18:00:00Z",
    tags: ["lofi", "chill", "study", "beats"],
  },
  {
    id: "3",
    userId: "user3",
    user: {
      id: "user3",
      username: "bassdrop_kevin",
      displayName: "Kevin Bass",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bassdropkevin",
      bio: "Drop the bass 🔥",
      followersCount: 312000,
      followingCount: 89,
      tracksCount: 45,
    },
    title: "Turn Up The Bass",
    description: "Club banger ready for the weekend",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 198,
    likesCount: 234000,
    commentsCount: 3450,
    remixesCount: 234,
    createdAt: "2025-01-14T02:30:00Z",
    tags: ["edm", "bass", "house", "club"],
  },
  {
    id: "4",
    userId: "user4",
    user: {
      id: "user4",
      username: "velvetecho",
      displayName: "Velvet Echo",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=velvetecho",
      bio: "Dreamy electronic soundscapes 🎵",
      followersCount: 78000,
      followingCount: 345,
      tracksCount: 34,
    },
    title: "Pastel Memories",
    description: "Floating through time 💫",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    durationSeconds: 267,
    likesCount: 89000,
    commentsCount: 1230,
    remixesCount: 67,
    createdAt: "2025-01-13T20:15:00Z",
    tags: ["electronic", "ambient", "dreamy", "chill"],
  },
  {
    id: "5",
    userId: "user5",
    user: {
      id: "user5",
      username: "coastalvibes",
      displayName: "Coastal Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=coastalvibes",
      bio: "Beach house producer 🏖️",
      followersCount: 156000,
      followingCount: 456,
      tracksCount: 56,
    },
    title: "Sunset Boulevard",
    description: "Golden hour drive 🌅",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    durationSeconds: 234,
    likesCount: 167000,
    commentsCount: 2890,
    remixesCount: 123,
    createdAt: "2025-01-13T14:45:00Z",
    tags: ["chill", "house", "summer", "vibes"],
  },
  {
    id: "6",
    userId: "user6",
    user: {
      id: "user6",
      username: "nightowl_music",
      displayName: "Night Owl",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=nightowl",
      bio: "Late night studio sessions 🦉",
      followersCount: 67000,
      followingCount: 234,
      tracksCount: 28,
    },
    title: "Midnight Drive",
    description: "Empty streets at 3am 🚗",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    durationSeconds: 195,
    likesCount: 234000,
    commentsCount: 3450,
    remixesCount: 189,
    createdAt: "2025-01-12T22:00:00Z",
    tags: ["synthwave", "electronic", "night", "drive"],
  },
  {
    id: "7",
    userId: "user7",
    user: {
      id: "user7",
      username: "synthdreams",
      displayName: "Synth Dreams",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=synthdreams",
      bio: "Analog warmth & digital magic 🎹",
      followersCount: 123000,
      followingCount: 178,
      tracksCount: 41,
    },
    title: "Electric Soul",
    description: "Feel the rhythm ⚡",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 212,
    likesCount: 345000,
    commentsCount: 5670,
    remixesCount: 234,
    createdAt: "2025-01-12T16:30:00Z",
    tags: ["synthpop", "electronic", "dance", "80s"],
  },
  {
    id: "8",
    userId: "user8",
    user: {
      id: "user8",
      username: "beatsociety",
      displayName: "Beat Society",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatsociety",
      bio: "Collective of producers 🎤",
      followersCount: 234000,
      followingCount: 567,
      tracksCount: 78,
    },
    title: "Urban Dreams",
    description: "City lights & late nights 🌃",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    durationSeconds: 178,
    likesCount: 189000,
    commentsCount: 2340,
    remixesCount: 145,
    createdAt: "2025-01-11T20:00:00Z",
    tags: ["hiphop", "urban", "chill", "beats"],
  },
  {
    id: "9",
    userId: "user9",
    user: {
      id: "user9",
      username: "acoustic_soul",
      displayName: "Maya Rivera",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=acoustic_soul",
      bio: "Singer-songwriter 🎸",
      followersCount: 89000,
      followingCount: 678,
      tracksCount: 23,
    },
    title: "Golden Hour",
    description: "Acoustic sunset session 🌇",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    durationSeconds: 245,
    likesCount: 156000,
    commentsCount: 1890,
    remixesCount: 78,
    createdAt: "2025-01-11T14:15:00Z",
    tags: ["acoustic", "folk", "indie", "singer-songwriter"],
  },
  {
    id: "10",
    userId: "user10",
    user: {
      id: "user10",
      username: "echo_valley",
      displayName: "Echo Valley",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=echovalley",
      bio: "Indie rock from the valley 🎸",
      followersCount: 45000,
      followingCount: 234,
      tracksCount: 18,
    },
    title: "Crystal Clear",
    description: "Mountain stream vibes 💎",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    durationSeconds: 198,
    likesCount: 67000,
    commentsCount: 890,
    remixesCount: 45,
    createdAt: "2025-01-10T18:45:00Z",
    tags: ["indie", "rock", "acoustic", "nature"],
  },
  {
    id: "11",
    userId: "user11",
    user: {
      id: "user11",
      username: "jazzcats",
      displayName: "The Jazz Cats",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jazzcats",
      bio: "Smooth jazz for the soul 🎷",
      followersCount: 167000,
      followingCount: 123,
      tracksCount: 45,
    },
    title: "Coffee Shop Sessions",
    description: "Morning jazz ☕",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    durationSeconds: 312,
    likesCount: 234000,
    commentsCount: 3450,
    remixesCount: 167,
    createdAt: "2025-01-10T10:30:00Z",
    tags: ["jazz", "smooth", "instrumental", "chill"],
  },
  {
    id: "12",
    userId: "user12",
    user: {
      id: "user12",
      username: "midnightcollective",
      displayName: "The Midnight Collective",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=midnightcollective",
      bio: "Late night beats 🎹",
      followersCount: 289000,
      followingCount: 456,
      tracksCount: 67,
    },
    title: "City Lights",
    description: "Metropolitan feelings 🌆",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 223,
    likesCount: 456000,
    commentsCount: 5670,
    remixesCount: 234,
    createdAt: "2025-01-09T22:00:00Z",
    tags: ["electronic", "urban", "chill", "night"],
  },
  {
    id: "13",
    userId: "user13",
    user: {
      id: "user13",
      username: "lunawave",
      displayName: "Luna Wave",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lunawave",
      bio: "Wave to the moon 🌊",
      followersCount: 34000,
      followingCount: 189,
      tracksCount: 12,
    },
    title: "Neon Nights",
    description: "Glow in the dark ✨",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    durationSeconds: 187,
    likesCount: 45000,
    commentsCount: 670,
    remixesCount: 34,
    createdAt: "2025-01-09T16:00:00Z",
    tags: ["synthwave", "electronic", "night", "retro"],
  },
  {
    id: "14",
    userId: "user14",
    user: {
      id: "user14",
      username: "trapsoul_pro",
      displayName: "Trap Soul",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=trapsoul",
      bio: "Dark vibes only 🌑",
      followersCount: 178000,
      followingCount: 234,
      tracksCount: 38,
    },
    title: "Streets Remember",
    description: "Remember where you came from",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    durationSeconds: 165,
    likesCount: 345000,
    commentsCount: 4560,
    remixesCount: 189,
    createdAt: "2025-01-08T20:00:00Z",
    tags: ["trap", "hiphop", "dark", "r&b"],
  },
  {
    id: "15",
    userId: "user15",
    user: {
      id: "user15",
      username: "house_head",
      displayName: "House Head",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=househead",
      bio: "4 on the floor life 🥁",
      followersCount: 234000,
      followingCount: 178,
      tracksCount: 89,
    },
    title: "Dance All Night",
    description: "Until the sun comes up 🕺",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 345,
    likesCount: 567000,
    commentsCount: 7890,
    remixesCount: 345,
    createdAt: "2025-01-08T02:00:00Z",
    tags: ["house", "dance", "club", "electronic"],
  },
  {
    id: "16",
    userId: "user16",
    user: {
      id: "user16",
      username: "indie_vibes",
      displayName: "Indie Vibes",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=indievibes",
      bio: "Feel-good indie music ☀️",
      followersCount: 123000,
      followingCount: 345,
      tracksCount: 34,
    },
    title: "Wildflower",
    description: "Fields of gold 🌻",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    durationSeconds: 234,
    likesCount: 198000,
    commentsCount: 2340,
    remixesCount: 98,
    createdAt: "2025-01-07T14:30:00Z",
    tags: ["indie", "folk", "acoustic", "summer"],
  },
  {
    id: "17",
    userId: "user17",
    user: {
      id: "user17",
      username: "rnb_smooth",
      displayName: "Aaliyah Brooks",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rnb_smooth",
      bio: "Smooth R&B for the night 🌙",
      followersCount: 156000,
      followingCount: 456,
      tracksCount: 41,
    },
    title: "Nights Like This",
    description: "Smooth serenades 💕",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    durationSeconds: 256,
    likesCount: 289000,
    commentsCount: 3450,
    remixesCount: 167,
    createdAt: "2025-01-06T22:15:00Z",
    tags: ["rnb", "soul", "smooth", "romance"],
  },
  {
    id: "18",
    userId: "user18",
    user: {
      id: "user18",
      username: "afrobeat_king",
      displayName: "Afro Beat King",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=afrobeat",
      bio: "African rhythms 🌍",
      followersCount: 345000,
      followingCount: 123,
      tracksCount: 56,
    },
    title: "Lagos Nights",
    description: "Nigerian heat 🔥",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 198,
    likesCount: 567000,
    commentsCount: 6780,
    remixesCount: 345,
    createdAt: "2025-01-05T20:00:00Z",
    tags: ["afrobeats", "dance", "african", "party"],
  },
  {
    id: "19",
    userId: "user19",
    user: {
      id: "user19",
      username: "lofi_dreams",
      displayName: "Lofi Dreams",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofidreams",
      bio: "Sleepy beats 😴",
      followersCount: 456000,
      followingCount: 89,
      tracksCount: 134,
    },
    title: "Cloud Nine",
    description: "Floating on clouds ☁️",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    durationSeconds: 165,
    likesCount: 678000,
    commentsCount: 8900,
    remixesCount: 456,
    createdAt: "2025-01-04T02:00:00Z",
    tags: ["lofi", "chill", "sleep", "dreamy"],
  },
  {
    id: "20",
    userId: "user20",
    user: {
      id: "user20",
      username: "rock_anthem",
      displayName: "Thunder Road",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thunderroad",
      bio: "Classic rock energy 🤘",
      followersCount: 178000,
      followingCount: 234,
      tracksCount: 45,
    },
    title: "Breaking Free",
    description: "Guitar hero vibes 🎸",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    durationSeconds: 267,
    likesCount: 345000,
    commentsCount: 4560,
    remixesCount: 198,
    createdAt: "2025-01-03T18:30:00Z",
    tags: ["rock", "guitar", "anthem", "classic"],
  },
  {
    id: "21",
    userId: "user21",
    user: {
      id: "user21",
      username: "chill_collective",
      displayName: "The Chill Collective",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chillcollective",
      bio: "Collective chill energy ❄️",
      followersCount: 234000,
      followingCount: 567,
      tracksCount: 78,
    },
    title: "Sunday Morning",
    description: "Lazy weekend vibes ☕",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    durationSeconds: 223,
    likesCount: 456000,
    commentsCount: 5670,
    remixesCount: 234,
    createdAt: "2025-01-02T10:00:00Z",
    tags: ["chill", "lofi", "morning", "weekend"],
  },
  {
    id: "22",
    userId: "user22",
    user: {
      id: "user22",
      username: "reggaeton_vibes",
      displayName: "DJ Sol",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=djsol",
      bio: "Latin vibes only 💃",
      followersCount: 289000,
      followingCount: 156,
      tracksCount: 67,
    },
    title: "Dale",
    description: "Perreo time! 🔥",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    durationSeconds: 187,
    likesCount: 567000,
    commentsCount: 7890,
    remixesCount: 345,
    createdAt: "2025-01-01T22:00:00Z",
    tags: ["reggaeton", "latin", "dance", "party"],
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

  const handleTabChange = (tab: TabItem) => {
    if (tab === "upload") {
      setShowUploadModal(true);
    } else {
      setActiveTab(tab);
    }
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
      case "notifications":
        return (
          <div className="pt-14 pb-20 px-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Inbox</h2>
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-neutral-500">No notifications yet</p>
            </div>
          </div>
        );
      default:
        return null;
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
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}

      {activeTab === "home" && (
        <>
          {renderContent()}
          <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setActiveTab("home");
        }}
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

function UserProfilePage({ user, tracks }: { user: User; tracks: Track[] }) {
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

      {/* Tracks Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {tracks.length > 0 ? (
          tracks.map((track) => (
            <div
              key={track.id}
              className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden relative cursor-pointer group"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium text-sm truncate">{track.title}</p>
                <p className="text-white/70 text-xs">{track.likesCount.toLocaleString()} likes</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-20 text-center text-neutral-500">
            No tracks found
          </div>
        )}
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
