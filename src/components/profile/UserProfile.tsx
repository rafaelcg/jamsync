"use client";

import React, { useState } from "react";
import { Avatar, Button, Badge, IconButton } from "@/components/ui";
import { TrackCard } from "@/components/feed/TrackCard";
import type { UserProfileProps } from "@/types";
import { api } from "@/lib/api";

export function UserProfile({
  user,
  tracks,
  isOwnProfile = false,
  activeTab = "tracks",
  onEditProfile,
}: UserProfileProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const tabCounts = {
    tracks: tracks.filter((t) => !t.originalTrackId).length,
    remixes: tracks.filter((t) => t.originalTrackId).length,
    liked: 0, // Would come from API
  };

  const handleFollow = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const wasFollowing = isFollowing;
    setIsFollowing(!isFollowing);
    
    try {
      if (wasFollowing) {
        await api.users.unfollow(user.username);
      } else {
        await api.users.follow(user.username);
      }
    } catch (error) {
      // Revert on error
      setIsFollowing(wasFollowing);
      console.error('Failed to update follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="font-bold text-lg text-neutral-900 dark:text-white">
            @{user.username}
          </span>
          {isOwnProfile ? (
            <div className="flex items-center gap-2">
              <IconButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
                variant="ghost"
              />
              <IconButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                }
                variant="ghost"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <IconButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                }
                variant="ghost"
              />
              <IconButton
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                }
                variant="ghost"
              />
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <Avatar src={user.avatarUrl} size="xl" status={isFollowing ? "online" : undefined} />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                {user.displayName}
              </h1>
              {user.isVerified && (
                <svg className="w-5 h-5 text-primary-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="2" />
                </svg>
              )}
            </div>
            <p className="text-neutral-500">@{user.username}</p>
            {user.bio && (
              <p className="mt-2 text-neutral-700 dark:text-neutral-300">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatNumber(user.tracksCount)}
            </p>
            <p className="text-xs text-neutral-500">Tracks</p>
          </div>
          <div className="text-center cursor-pointer">
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatNumber(user.followersCount)}
            </p>
            <p className="text-xs text-neutral-500">Followers</p>
          </div>
          <div className="text-center cursor-pointer">
            <p className="text-lg font-bold text-neutral-900 dark:text-white">
              {formatNumber(user.followingCount)}
            </p>
            <p className="text-xs text-neutral-500">Following</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwnProfile && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleFollow}
              variant={isFollowing ? "outline" : "primary"}
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : isFollowing ? (
                "Following"
              ) : (
                "Follow"
              )}
            </Button>
            <Button variant="secondary" className="px-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </Button>
          </div>
        )}

        {isOwnProfile && (
          <Button 
            variant="outline" 
            fullWidth 
            className="mt-4"
            onClick={onEditProfile}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex">
          {[
            { id: "tracks", label: "Tracks", count: tabCounts.tracks },
            { id: "remixes", label: "Remixes", count: tabCounts.remixes },
            { id: "liked", label: "Liked", count: tabCounts.liked },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as typeof currentTab)}
              className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-medium transition-colors ${
                currentTab === tab.id
                  ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="default" size="sm">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {currentTab === "tracks" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tracks
              .filter((t) => !t.originalTrackId)
              .map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  variant="default"
                  onClick={() => {}}
                />
              ))}
            {tracks.filter((t) => !t.originalTrackId).length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
                  />
                </svg>
                <p>No tracks yet</p>
              </div>
            )}
          </div>
        )}

        {currentTab === "remixes" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tracks
              .filter((t) => t.originalTrackId)
              .map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  variant="default"
                  onClick={() => {}}
                />
              ))}
            {tracks.filter((t) => t.originalTrackId).length === 0 && (
              <div className="col-span-full text-center py-12 text-neutral-500">
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <p>No remixes yet</p>
              </div>
            )}
          </div>
        )}

        {currentTab === "liked" && (
          <div className="text-center py-12 text-neutral-500">
            <p>Liked tracks will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
