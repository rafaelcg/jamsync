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
  const now = Date.now();
  
  return [
    {
      id: '1',
      userId: 'user1',
      user: {
        id: 'user1',
        username: 'neonhorizons',
        displayName: 'Neon Horizons',
        avatarUrl: '',
        followersCount: 45200,
        followingCount: 189,
        tracksCount: 34,
        createdAt: new Date().toISOString(),
      },
      title: 'Midnight City Dreams',
      description: 'New synthwave track I worked on all night ✨',
      audioUrl: 'https://example.com/audio1.mp3',
      durationSeconds: 215,
      likesCount: 12453,
      commentsCount: 342,
      remixesCount: 89,
      tags: ['synthwave', 'electronic', '80s', 'retro'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      userId: 'user2',
      user: {
        id: 'user2',
        username: 'jazzcats',
        displayName: 'The Jazz Cats',
        avatarUrl: '',
        followersCount: 12800,
        followingCount: 456,
        tracksCount: 18,
        createdAt: new Date().toISOString(),
      },
      title: 'Sunday Morning Coffee',
      description: 'Chill jazz instrumental for lazy mornings ☕',
      audioUrl: 'https://example.com/audio2.mp3',
      durationSeconds: 248,
      likesCount: 8934,
      commentsCount: 167,
      remixesCount: 23,
      tags: ['jazz', 'instrumental', 'chill', 'acoustic'],
      isLiked: true,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '3',
      userId: 'user3',
      user: {
        id: 'user3',
        username: 'lunabeats',
        displayName: 'Luna Beats',
        avatarUrl: '',
        followersCount: 89500,
        followingCount: 234,
        tracksCount: 67,
        createdAt: new Date().toISOString(),
      },
      title: 'Ocean Waves',
      description: 'Lo-fi beats to study/relax to 🌊',
      audioUrl: 'https://example.com/audio3.mp3',
      durationSeconds: 182,
      likesCount: 45612,
      commentsCount: 892,
      remixesCount: 156,
      tags: ['lofi', 'chill', 'study', 'beats'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: '4',
      userId: 'user4',
      user: {
        id: 'user4',
        username: 'bassdrop_kevin',
        displayName: 'Kevin Bass',
        avatarUrl: '',
        followersCount: 234000,
        followingCount: 89,
        tracksCount: 124,
        createdAt: new Date().toISOString(),
      },
      title: 'Turn Up The Bass',
      description: 'Club banger ready for the weekend 🔥',
      audioUrl: 'https://example.com/audio4.mp3',
      durationSeconds: 198,
      likesCount: 178432,
      commentsCount: 2341,
      remixesCount: 567,
      tags: ['edm', 'bass', 'house', 'club'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: '5',
      userId: 'user5',
      user: {
        id: 'user5',
        username: 'acoustic_soul',
        displayName: 'Maya Rivera',
        avatarUrl: '',
        followersCount: 34500,
        followingCount: 567,
        tracksCount: 28,
        createdAt: new Date().toISOString(),
      },
      title: 'Heartstrings',
      description: 'Original acoustic ballad. Give it a listen 🎸',
      audioUrl: 'https://example.com/audio5.mp3',
      durationSeconds: 267,
      likesCount: 24567,
      commentsCount: 456,
      remixesCount: 78,
      tags: ['acoustic', 'folk', 'singer-songwriter', 'indie'],
      isLiked: true,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
      id: '6',
      userId: 'user6',
      user: {
        id: 'user6',
        username: 'trapking',
        displayName: 'Trap King',
        avatarUrl: '',
        followersCount: 156000,
        followingCount: 178,
        tracksCount: 89,
        createdAt: new Date().toISOString(),
      },
      title: 'Streets Remember',
      description: 'Dark trap vibe. Prod by @nightowl 🎤',
      audioUrl: 'https://example.com/audio6.mp3',
      durationSeconds: 165,
      likesCount: 89432,
      commentsCount: 1234,
      remixesCount: 345,
      tags: ['trap', 'hiphop', 'dark', 'rap'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      id: '7',
      userId: 'user7',
      user: {
        id: 'user7',
        username: 'pandora_box',
        displayName: 'Pandora',
        avatarUrl: '',
        followersCount: 67800,
        followingCount: 289,
        tracksCount: 45,
        createdAt: new Date().toISOString(),
      },
      title: 'Celestial Dreams',
      description: 'Dreamy electronic ambient track ✨',
      audioUrl: 'https://example.com/audio7.mp3',
      durationSeconds: 312,
      likesCount: 18934,
      commentsCount: 234,
      remixesCount: 56,
      tags: ['ambient', 'electronic', 'dreamy', 'chill'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '8',
      userId: 'user8',
      user: {
        id: 'user8',
        username: 'reggaeton_vibes',
        displayName: 'DJ Sol',
        avatarUrl: '',
        followersCount: 91200,
        followingCount: 156,
        tracksCount: 72,
        createdAt: new Date().toISOString(),
      },
      title: 'Dale',
      description: 'Perreo vibes only! 💃🔥',
      audioUrl: 'https://example.com/audio8.mp3',
      durationSeconds: 198,
      likesCount: 67843,
      commentsCount: 876,
      remixesCount: 234,
      tags: ['reggaeton', 'latin', 'dance', 'party'],
      isLiked: true,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
    },
    {
      id: '9',
      userId: 'user9',
      user: {
        id: 'user9',
        username: 'rock_anthem',
        displayName: 'Thunder Road',
        avatarUrl: '',
        followersCount: 23400,
        followingCount: 345,
        tracksCount: 56,
        createdAt: new Date().toISOString(),
      },
      title: 'Breaking Free',
      description: 'Guitar riff heavy rock anthem 🤘',
      audioUrl: 'https://example.com/audio9.mp3',
      durationSeconds: 245,
      likesCount: 34521,
      commentsCount: 567,
      remixesCount: 89,
      tags: ['rock', 'guitar', 'anthem', 'alt'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: '10',
      userId: 'user10',
      user: {
        id: 'user10',
        username: 'chill_collective',
        displayName: 'The Chill Collective',
        avatarUrl: '',
        followersCount: 56700,
        followingCount: 234,
        tracksCount: 38,
        createdAt: new Date().toISOString(),
      },
      title: 'Golden Hour',
      description: 'Perfect sunset vibes 🌅',
      audioUrl: 'https://example.com/audio10.mp3',
      durationSeconds: 223,
      likesCount: 41234,
      commentsCount: 543,
      remixesCount: 123,
      tags: ['chill', 'indie', 'summer', 'vibes'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
    },
    {
      id: '11',
      userId: 'user11',
      user: {
        id: 'user11',
        username: 'rnb_smooth',
        displayName: 'Aaliyah Brooks',
        avatarUrl: '',
        followersCount: 78900,
        followingCount: 412,
        tracksCount: 41,
        createdAt: new Date().toISOString(),
      },
      title: 'Nights Like This',
      description: 'Smooth R&B for the late night crew 🌙',
      audioUrl: 'https://example.com/audio11.mp3',
      durationSeconds: 234,
      likesCount: 56789,
      commentsCount: 678,
      remixesCount: 145,
      tags: ['rnb', 'soul', 'smooth', 'r&b'],
      isLiked: true,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 96).toISOString(),
    },
    {
      id: '12',
      userId: 'user12',
      user: {
        id: 'user12',
        username: 'indie_rose',
        displayName: 'Rose Wilson',
        avatarUrl: '',
        followersCount: 23400,
        followingCount: 567,
        tracksCount: 23,
        createdAt: new Date().toISOString(),
      },
      title: 'Wildflower',
      description: 'Indie folk I wrote while camping last month 🌻',
      audioUrl: 'https://example.com/audio12.mp3',
      durationSeconds: 198,
      likesCount: 18765,
      commentsCount: 234,
      remixesCount: 45,
      tags: ['indie', 'folk', 'acoustic', 'nature'],
      isLiked: false,
      isMain: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
    },
  ];
}

export default Feed;
