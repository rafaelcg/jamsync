"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar, Navigation } from "@/components/layout";
import type { Track, User, TabItem } from "@/types";

// Mock user data (in production, this would come from the API)
const getMockUser = (usernameParam: string): User => {
  const username = usernameParam.replace("@", "");
  return {
    id: "1",
    username: username,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`,
    bio: "Music creator 🎵 | Building the future of sound",
    followersCount: Math.floor(Math.random() * 50000),
    followingCount: Math.floor(Math.random() * 1000),
    tracksCount: Math.floor(Math.random() * 50),
  };
};

const getMockTracks = (usernameParam: string): Track[] => {
  const user = getMockUser(usernameParam);
  return [
    {
      id: "1",
      userId: "1",
      user: user,
      title: "Summer Vibes",
      description: "Just vibing on this summer track ☀️",
      audioUrl: "/demo.mp3",
      videoUrl: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
      durationSeconds: 185,
      likesCount: 1247,
      commentsCount: 89,
      remixesCount: 12,
      createdAt: "2025-01-15T10:30:00Z",
      tags: ["summer", "chill", "beats"],
    },
    {
      id: "2",
      userId: "1",
      user: user,
      title: "Midnight Dreams",
      description: "Late night studio session 🎹",
      audioUrl: "/demo.mp3",
      durationSeconds: 210,
      likesCount: 2340,
      commentsCount: 156,
      remixesCount: 8,
      createdAt: "2025-01-14T22:15:00Z",
      isMain: true,
    },
    {
      id: "3",
      userId: "1",
      user: user,
      title: "Urban Flow",
      description: "Street beats for the soul 🎤",
      audioUrl: "/demo.mp3",
      durationSeconds: 168,
      likesCount: 5600,
      commentsCount: 234,
      remixesCount: 45,
      createdAt: "2025-01-13T18:45:00Z",
    },
  ];
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  // Decode the username to handle URL-encoded characters like %40 for @
  const rawUsername = params.username as string;
  const username = decodeURIComponent(rawUsername);
  const [activeTab, setActiveTab] = useState<TabItem>("home");
  const [isFollowing, setIsFollowing] = useState(false);

  const user = getMockUser(username);
  const tracks = getMockTracks(username);

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
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 via-purple-500 to-secondary-500" />

        {/* Profile Info */}
        <div className="px-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-neutral-950 bg-neutral-200 overflow-hidden">
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {user.displayName}
              </h1>
              <p className="text-neutral-500">@{user.username}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div className="text-center cursor-pointer">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {user.tracksCount}
              </p>
              <p className="text-xs text-neutral-500">Tracks</p>
            </div>
            <div className="text-center cursor-pointer">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {user.followersCount.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500">Followers</p>
            </div>
            <div className="text-center cursor-pointer">
              <p className="text-lg font-bold text-neutral-900 dark:text-white">
                {user.followingCount}
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
          {user.bio && (
            <p className="mt-4 text-neutral-700 dark:text-neutral-300">{user.bio}</p>
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
        <div className="grid grid-cols-2 gap-3 p-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-xl overflow-hidden relative cursor-pointer group"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {track.isMain && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  ⭐ Main
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white font-medium text-sm truncate">{track.title}</p>
                <p className="text-white/70 text-xs">{track.likesCount.toLocaleString()} likes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
