"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "@/components/layout";
import { FeaturedRemixes, TrendingTracks } from "@/components/feed";
import { TrackCard } from "@/components/feed/TrackCard";
import type { Track } from "@/types";
import { api } from "@/lib/api";

// Helper function to format numbers with labels
const formatCountWithLabel = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};


const mockRemixes = [
  { id: "1", title: "Summer Vibe", user: { username: "remixer1", displayName: "Remixer One" }, bpm: 128 },
  { id: "2", title: "Chill Mix", user: { username: "chill_guy", displayName: "Chill Guy" }, bpm: 95 },
];
export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ["All", "Hip Hop", "Electronic", "Rock", "Pop", "R&B", "Jazz", "Classical", "Acoustic"];

  useEffect(() => {
    fetchDiscoverTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const fetchDiscoverTracks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.feed.getDiscover({ 
        limit: 20, 
        offset: 0,
        genre: selectedCategory !== 'All' ? selectedCategory : undefined 
      });
      if (response.data && typeof response.data === 'object' && 'tracks' in response.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTracks((response.data as any).tracks as Track[]);
      } else if (Array.isArray(response.data)) {
        setTracks(response.data);
      } else {
        setError("Failed to load discover tracks");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const filters = [
    { id: "trending", label: "Trending", active: true },
    { id: "new", label: "New Releases", active: false },
    { id: "remixes", label: "Remixes", active: false },
    { id: "following", label: "Following", active: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <TopBar
        title="Discover"
        transparent
        rightAction={
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-primary-500 text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        }
      />

      <div className="pt-14 pb-20 px-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks, artists, hashtags..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 mb-3">Filter by</h3>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  aria-label={`Filter by ${filter.label}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter.active
                      ? "bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-label={`Select ${category} category`}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-500 text-white shadow-md"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-primary-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Section Header with Labels */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              🔥 Trending Now
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(5000)} plays
            </span>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center py-10">{error}</p>
          ) : (
            <TrendingTracks
              tracks={tracks}
              onTrackClick={(id) => console.log("Track:", id)}
            />
          )}
        </section>

        {/* Featured Remixes */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              ⭐ Featured Remixes
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(150)} remixes
            </span>
          </div>
          {!isLoading && !error && (
            <FeaturedRemixes
              remixes={tracks}
              onRemixClick={(id) => console.log("Featured remix:", id)}
            />
          )}
        </section>

        {/* New Releases with labels */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              🎵 New Releases
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(234)} new tracks
            </span>
          </div>
          {!isLoading && !error && (
            <div className="space-y-3">
              {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                variant="horizontal"
                onClick={() => {}}
                onLike={() => {}}
                onRemix={() => {}}
                onShare={() => {}}
              />
            ))}
            </div>
          )}
        </section>

        {/* Recommended Artists with followers label */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              👥 Artists to Follow
            </h2>
            <span className="text-sm text-neutral-500">
              {formatCountWithLabel(12500)} new followers
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-center cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-primary-500 group-hover:scale-105 transition-transform">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=artist${i}`}
                    alt={`Artist ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  artist_{i}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatCountWithLabel(100 + i * 50)} followers
                </p>
                <button className="mt-2 px-3 py-1 text-xs font-medium bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Top Charts Section */}
        <section className="py-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
            📊 Top Charts
          </h2>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center gap-4 p-4 ${
                  index !== tracks.length - 1 
                    ? "border-b border-neutral-100 dark:border-neutral-800" 
                    : ""
                } hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer`}
              >
                <span className={`text-2xl font-bold w-8 ${
                  index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-600" : "text-neutral-400"
                }`}>
                  {index + 1}
                </span>
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary-500 to-purple-600 flex-shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=chart${index}`}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 dark:text-white truncate">
                    {track.title}
                  </p>
                  <p className="text-sm text-neutral-500">@{track.user.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    ❤️ {formatCountWithLabel(track.likesCount)}
                  </p>
                  <p className="text-xs text-neutral-500">
                    🔄 {formatCountWithLabel(track.remixesCount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
