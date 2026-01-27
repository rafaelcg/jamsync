"use client";

import React from "react";
import { TrackCard } from "./TrackCard";
import { Avatar } from "@/components/ui";
import type { MainSectionProps } from "@/types";

export function MainSection({
  remixes,
  originalTrack,
  onRemixClick,
}: MainSectionProps) {
  if (!originalTrack || remixes.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Main Remixes
          </h2>
        </div>
        <span className="text-sm text-neutral-500">
          Selected by @{originalTrack.user.username}
        </span>
      </div>

      {/* Original Track Reference */}
      <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-4">
        <Avatar src={originalTrack.user.avatarUrl} size="md" />
        <div className="flex-1">
          <p className="text-sm text-neutral-500">Original by</p>
          <p className="font-semibold text-neutral-900 dark:text-white">
            @{originalTrack.user.username}
          </p>
        </div>
      </div>

      {/* Remix Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {remixes.map((remix) => (
          <div key={remix.id} className="relative group">
            <TrackCard
              track={remix}
              variant="default"
              onClick={() => onRemixClick?.(remix)}
            />
            {/* Remix Badge */}
            <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
              ⭐ Promoted
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {remixes.length > 4 && (
        <button className="w-full mt-4 py-3 text-center text-primary-600 dark:text-primary-400 font-medium hover:underline">
          View all remixes →
        </button>
      )}
    </section>
  );
}

interface FeaturedRemixesProps {
  remixes: Array<{
    id: string;
    user: { username: string; displayName: string; avatarUrl: string };
    title: string;
    likesCount: number;
    remixesCount: number;
    audioUrl: string;
  }>;
  onRemixClick?: (remixId: string) => void;
}

export function FeaturedRemixes({ remixes, onRemixClick }: FeaturedRemixesProps) {
  if (remixes.length === 0) {
    return (
      <section className="py-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
          🔥 Hot Remixes
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">
            No featured remixes yet
          </h3>
          <p className="text-sm text-neutral-500 max-w-xs">
            Check back later for curated remixes from top creators
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
        🔥 Hot Remixes
      </h2>

      <div className="space-y-3">
        {remixes.map((remix, index) => (
          <div
            key={remix.id}
            className="flex items-center gap-3 p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors cursor-pointer"
            onClick={() => onRemixClick?.(remix.id)}
          >
            {/* Rank */}
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold ${
                index === 0
                  ? "bg-yellow-400 text-yellow-900"
                  : index === 1
                  ? "bg-neutral-300 text-neutral-700"
                  : index === 2
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
              }`}
            >
              {index + 1}
            </span>

            {/* User Avatar */}
            <Avatar src={remix.user.avatarUrl} size="sm" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-neutral-900 dark:text-white truncate">
                {remix.title}
              </h4>
              <p className="text-sm text-neutral-500">@{remix.user.username}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {remix.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                {remix.remixesCount}
              </span>
            </div>

            {/* Play Button */}
            <button className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

interface TrendingTracksProps {
  tracks: Array<{
    id: string;
    title: string;
    user: { username: string; displayName: string; avatarUrl: string };
    likesCount: number;
    remixesCount: number;
  }>;
  onTrackClick?: (trackId: string) => void;
}

export function TrendingTracks({ tracks, onTrackClick }: TrendingTracksProps) {
  if (tracks.length === 0) {
    return (
      <section className="py-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📈</span>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Trending Now
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-1">
            No trending tracks
          </h3>
          <p className="text-sm text-neutral-500 max-w-xs">
            Be the first to upload and start trending!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📈</span>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Trending Now
        </h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex-shrink-0 w-40 cursor-pointer"
            onClick={() => onTrackClick?.(track.id)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl overflow-hidden mb-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
                {Math.floor(Math.random() * 3) + 1}:30
              </div>
            </div>
            <h4 className="font-medium text-neutral-900 dark:text-white truncate">
              {track.title}
            </h4>
            <p className="text-sm text-neutral-500">@{track.user.username}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
