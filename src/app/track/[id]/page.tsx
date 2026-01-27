"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/layout";
import { RemixModal } from "@/components/modal";
import { MainSection } from "@/components/feed";
import { AudioPlayer } from "../../../components/audio/AudioPlayer";
import { Avatar, Button, Badge } from "@/components/ui";
import type { Track, Comment } from "@/types";

const mockTrack: Track = {
  id: "1",
  userId: "1",
  user: {
    id: "1",
    username: "musicmaker",
    displayName: "Alex Johnson",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=music",
    followersCount: 12500,
    followingCount: 342,
    tracksCount: 24,
  },
  title: "Summer Vibes",
  description: "Just vibing on this summer track ☀️ Nothing but good vibes and chill beats. Created this during a sunset session in Malibu 🎵",
  audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  // No videoUrl - will use AudioPlayer
  durationSeconds: 185,
  likesCount: 1247,
  commentsCount: 89,
  remixesCount: 12,
  createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  tags: ["summer", "chill", "beats", "lofi"],
  isLiked: false,
};

const mockComments: Comment[] = [
  {
    id: "1",
    userId: "2",
    user: {
      id: "2",
      username: "fan123",
      displayName: "Super Fan",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fan",
      followersCount: 150,
      followingCount: 200,
      tracksCount: 5,
    },
    trackId: "1",
    content: "This is exactly what I needed today! 🔥",
    likesCount: 24,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    userId: "3",
    user: {
      id: "3",
      username: "music_producer",
      displayName: "Producer Max",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=max",
      followersCount: 5000,
      followingCount: 300,
      tracksCount: 50,
    },
    trackId: "1",
    content: "The production quality is insane! What VSTs did you use?",
    likesCount: 18,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    userId: "4",
    user: {
      id: "4",
      username: "dj_sarah",
      displayName: "Sarah Lee",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      followersCount: 5600,
      followingCount: 189,
      tracksCount: 12,
    },
    trackId: "1",
    content: "Remix coming soon! 🎹",
    likesCount: 42,
    createdAt: new Date().toISOString(),
  },
];

const mockRemixes: Track[] = [
  {
    id: "1-1",
    userId: "3",
    user: {
      id: "3",
      username: "dj_sarah",
      displayName: "Sarah Lee",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      followersCount: 5600,
      followingCount: 189,
      tracksCount: 12,
    },
    title: "Summer Vibes (Club Mix)",
    audioUrl: "/demo.mp3",
    durationSeconds: 245,
    likesCount: 567,
    commentsCount: 34,
    remixesCount: 0,
    createdAt: new Date().toISOString(),
    originalTrackId: "1",
    isMain: true,
  },
  {
    id: "1-2",
    userId: "4",
    user: {
      id: "4",
      username: "lofi_girl",
      displayName: "Lofi Girl",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lofi",
      followersCount: 12000,
      followingCount: 100,
      tracksCount: 25,
    },
    title: "Summer Vibes (Lofi Edit)",
    audioUrl: "/demo.mp3",
    durationSeconds: 210,
    likesCount: 423,
    commentsCount: 21,
    remixesCount: 0,
    createdAt: new Date().toISOString(),
    originalTrackId: "1",
    isMain: true,
  },
];

export default function TrackDetailPage() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _trackId = params.id as string;
  const [isLiked, setIsLiked] = useState(mockTrack.isLiked);
  const [likeCount, setLikeCount] = useState(mockTrack.likesCount);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userId: "current-user",
      user: {
        id: "current-user",
        username: "you",
        displayName: "You",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
        followersCount: 0,
        followingCount: 0,
        tracksCount: 0,
      },
      trackId: mockTrack.id,
      content: newComment,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <TopBar
        leftAction={
          <button className="p-2 -ml-2 text-neutral-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        }
        rightAction={
          <button className="p-2 text-neutral-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        }
      />

      <div className="pt-14 pb-24">
        {/* Media Section */}
        <div className="relative bg-neutral-900 aspect-video">
          {mockTrack.videoUrl ? (
            <video
              src={mockTrack.videoUrl}
              className="w-full h-full object-cover"
              controls
              poster="/placeholder.jpg"
            />
          ) : mockTrack.audioUrl ? (
            <div className="w-full h-full">
              <AudioPlayer track={mockTrack} />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600 to-secondary-600">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <p className="text-lg font-medium">No audio available</p>
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            {mockTrack.title}
          </h1>

          {/* User Info */}
          <div className="flex items-center gap-3 mt-3">
            <Avatar src={mockTrack.user.avatarUrl} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-neutral-900 dark:text-white">
                {mockTrack.user.displayName}
              </p>
              <p className="text-sm text-neutral-500">@{mockTrack.user.username}</p>
            </div>
            <Button variant="primary" size="sm">
              Follow
            </Button>
          </div>

          {/* Description */}
          {mockTrack.description && (
            <p className="mt-4 text-neutral-700 dark:text-neutral-300">
              {mockTrack.description}
            </p>
          )}

          {/* Tags */}
          {mockTrack.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {mockTrack.tags.map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats & Date */}
          <div className="flex items-center gap-4 mt-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {formatNumber(likeCount)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {formatNumber(mockTrack.commentsCount)}
            </span>
            <span>{formatTimeAgo(mockTrack.createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleLike}
              variant={isLiked ? "primary" : "outline"}
              className="flex-1"
              leftIcon={
                <svg className={`w-5 h-5 ${isLiked ? "fill-current" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
            >
              {isLiked ? "Liked" : "Like"}
            </Button>
            <Button
              onClick={() => setShowRemixModal(true)}
              variant="secondary"
              className="flex-1"
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              }
            >
              Remix
            </Button>
            <Button variant="outline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Main Remixes Section */}
        <div className="px-4">
          <MainSection
            remixes={mockRemixes}
            originalTrack={mockTrack}
            onRemixClick={(remix) => console.log("Remix clicked:", remix.id)}
          />
        </div>

        {/* Comments Section */}
        <div className="px-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
            Comments ({mockTrack.commentsCount})
          </h3>

          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-600 dark:text-primary-400">You</span>
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar src={comment.user.avatarUrl} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      @{comment.user.username}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                    <button className="flex items-center gap-1 hover:text-neutral-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {comment.likesCount}
                    </button>
                    <button className="hover:text-neutral-700">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Remix Modal */}
      <RemixModal
        isOpen={showRemixModal}
        onClose={() => setShowRemixModal(false)}
        originalTrack={mockTrack}
        onRemix={(track) => console.log("Creating remix:", track)}
      />
    </div>
  );
}
