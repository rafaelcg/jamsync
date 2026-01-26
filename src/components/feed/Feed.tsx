'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useInfiniteScroll } from '@/hooks';
import TrackCard from './TrackCard';
import VideoPlayer from '../video/VideoPlayer';
import type { Track } from '@/types';

interface FeedProps {
  initialType?: 'following' | 'trending' | 'discover';
  variant?: 'tiktok' | 'grid' | 'list';
  showTabs?: boolean;
}

export function Feed({
  initialType = 'following',
  variant = 'tiktok',
  showTabs = true,
}: FeedProps) {
  const [activeTab, setActiveTab] = useState<'following' | 'trending' | 'discover'>(initialType);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { tracks, loading, error, hasMore, loadMore } = useInfiniteScroll({
    type: activeTab,
  });

  // Handle infinite scroll with IntersectionObserver
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [target] = entries;
        if (target.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  // TikTok-style navigation
  const handleSwipeUp = useCallback(() => {
    if (activeTrackIndex < tracks.length - 1) {
      setActiveTrackIndex((prev) => prev + 1);
    } else {
      loadMore();
    }
  }, [activeTrackIndex, tracks.length, loadMore]);

  const handleSwipeDown = useCallback(() => {
    if (activeTrackIndex > 0) {
      setActiveTrackIndex((prev) => prev - 1);
    }
  }, [activeTrackIndex]);

  // Prepare tracks with dummy data for demo
  const demoTracks: Track[] = tracks.length > 0 ? tracks : getDemoTracks();

  if (variant === 'tiktok') {
    return (
      <div className="h-full bg-black">
        {/* Tabs */}
        {showTabs && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
            <div className="flex justify-center gap-8 py-3">
              {(['following', 'trending', 'discover'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video Feed */}
        <div className="h-full overflow-hidden">
          {demoTracks.map((track, index) => (
            <div
              key={track.id}
              className={`h-full transition-opacity duration-300 ${
                index === activeTrackIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ position: index === activeTrackIndex ? 'relative' : 'absolute' }}
            >
              <VideoPlayer
                track={track}
                isActive={index === activeTrackIndex}
                onSwipeUp={handleSwipeUp}
                onSwipeDown={handleSwipeDown}
                onLike={() => console.log('Like:', track.id)}
                onRemix={() => console.log('Remix:', track.id)}
                onShare={() => console.log('Share:', track.id)}
                onComment={() => console.log('Comment:', track.id)}
              />
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Loading trigger */}
        <div ref={loadMoreRef} className="h-10" />
      </div>
    );
  }

  // Grid or List view
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {showTabs && (
        <div className="flex gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-700">
          {(['following', 'trending', 'discover'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid View */}
      {variant === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {demoTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onLike={() => console.log('Like:', track.id)}
              onRemix={() => console.log('Remix:', track.id)}
              onClick={() => console.log('Click:', track.id)}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {variant === 'list' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {demoTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              variant="horizontal"
              onLike={() => console.log('Like:', track.id)}
              onRemix={() => console.log('Remix:', track.id)}
              onClick={() => console.log('Click:', track.id)}
            />
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-neutral-500">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-indigo-600 rounded-full animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && tracks.length > 0 && (
          <span className="text-neutral-400 text-sm">No more tracks</span>
        )}
      </div>
    </div>
  );
}

// Demo tracks for preview
function getDemoTracks(): Track[] {
  return [
    {
      id: '1',
      userId: 'user1',
      user: {
        id: 'user1',
        username: 'musician_pro',
        displayName: 'Musician Pro',
        avatarUrl: '',
        followersCount: 12500,
        followingCount: 234,
        tracksCount: 24,
        createdAt: new Date().toISOString(),
      },
      title: 'Original Beat Drop 🎵',
      description: 'Check out my new track! What do you think of the remix potential?',
      audioUrl: 'https://example.com/audio1.mp3',
      durationSeconds: 45,
      likesCount: 2340,
      commentsCount: 89,
      remixesCount: 56,
      isLiked: false,
      isMain: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      userId: 'user2',
      user: {
        id: 'user2',
        username: 'guitar_hero',
        displayName: 'Guitar Hero',
        avatarUrl: '',
        followersCount: 8900,
        followingCount: 456,
        tracksCount: 18,
        createdAt: new Date().toISOString(),
      },
      title: 'Acoustic Session',
      description: 'Cover of a classic with a twist',
      audioUrl: 'https://example.com/audio2.mp3',
      durationSeconds: 62,
      likesCount: 1876,
      commentsCount: 45,
      remixesCount: 34,
      isLiked: true,
      isMain: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      userId: 'user3',
      user: {
        id: 'user3',
        username: 'beat_maker',
        displayName: 'Beat Maker',
        avatarUrl: '',
        followersCount: 45600,
        followingCount: 123,
        tracksCount: 45,
        createdAt: new Date().toISOString(),
      },
      title: 'Trap Beat Freestyle',
      description: 'Need vocals! Drop your remix below 🔥',
      audioUrl: 'https://example.com/audio3.mp3',
      durationSeconds: 38,
      likesCount: 8934,
      commentsCount: 234,
      remixesCount: 189,
      isLiked: false,
      isMain: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];
}

export default Feed;
