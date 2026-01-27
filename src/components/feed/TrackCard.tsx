'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDuration, formatCount, formatRelativeTime } from '@/lib/utils';
import type { Track } from '@/types';
import { AudioPlayer } from '@/components/audio/AudioPlayer';

interface TrackCardProps {
  track: Track;
  variant?: 'default' | 'compact' | 'horizontal' | 'feed';
  onLike?: () => void;
  onRemix?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

export function TrackCard({
  track,
  variant = 'default',
  onLike,
  onRemix,
  onClick,
}: TrackCardProps) {
  if (variant === 'horizontal') {
    return <HorizontalTrackCard track={track} onClick={onClick} />;
  }

  if (variant === 'compact') {
    return <CompactTrackCard track={track} onClick={onClick} />;
  }

  if (variant === 'feed') {
    return <FeedTrackCard track={track} onLike={onLike} onRemix={onRemix} onClick={onClick} />;
  }

  return <DefaultTrackCard track={track} onLike={onLike} onRemix={onRemix} onClick={onClick} />;
}

// Default card for grid/list views
function DefaultTrackCard({
  track,
  onLike,
  onRemix,
  onClick,
}: {
  track: Track;
  onLike?: () => void;
  onRemix?: () => void;
  onClick?: () => void;
}) {
  return (
    <div 
      className="group relative bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-neutral-100 dark:bg-neutral-800">
        {track.videoUrl ? (
          <video
            src={track.videoUrl}
            className="w-full h-full object-cover"
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
            </svg>
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-medium">
          {formatDuration(track.durationSeconds)}
        </div>

        {/* Remix Badge */}
        {track.originalTrackId && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-purple-600/90 backdrop-blur-sm rounded text-white text-xs font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Remix
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemix?.();
              }}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <Link 
          href={`/${encodeURIComponent(track.user?.username || '')}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200">
            {track.user?.avatarUrl ? (
              <Image
                src={track.user.avatarUrl}
                alt={track.user.username}
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-neutral-600">
                {track.user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="font-medium text-sm text-neutral-900 dark:text-white hover:text-indigo-600">
            @{track.user?.username}
          </span>
        </Link>

        <h3 className="font-semibold text-sm text-neutral-900 dark:text-white mb-1 line-clamp-1">
          {track.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {formatCount(track.likesCount)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {formatCount(track.remixesCount)}
          </span>
          <span>{formatRelativeTime(track.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

// Compact card for horizontal scrolling
function CompactTrackCard({
  track,
  onClick,
}: {
  track: Track;
  onClick?: () => void;
}) {
  return (
    <div 
      className="flex gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200">
        {track.videoUrl ? (
          <video
            src={track.videoUrl}
            className="w-full h-full object-cover"
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 py-1">
        <h4 className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-1">
          {track.title}
        </h4>
        <p className="text-xs text-neutral-500 mt-0.5">
          @{track.user?.username}
        </p>
        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
          <span>{formatDuration(track.durationSeconds)}</span>
          <span>•</span>
          <span>{formatCount(track.likesCount)} likes</span>
        </div>
      </div>

      <div className="flex items-center">
        <button className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-indigo-500 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Horizontal card for sidebar/list views
function HorizontalTrackCard({
  track,
  onClick,
}: {
  track: Track;
  onClick?: () => void;
}) {
  return (
    <div 
      className="flex gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200">
        {track.videoUrl ? (
          <video
            src={track.videoUrl}
            className="w-full h-full object-cover"
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-white text-xs">
          {formatDuration(track.durationSeconds)}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
          {track.title}
        </h3>
        
        <Link 
          href={`/${encodeURIComponent(track.user?.username || '')}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 mt-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden bg-neutral-200">
            {track.user?.avatarUrl && (
              <Image
                src={track.user.avatarUrl}
                alt={track.user.username}
                width={20}
                height={20}
                className="object-cover"
              />
            )}
          </div>
          @{track.user?.username}
        </Link>

        {track.description && (
          <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
            {track.description}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {formatCount(track.likesCount)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {formatCount(track.remixesCount)}
          </span>
          <span>{formatRelativeTime(track.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center">
        <button className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-indigo-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Feed card for vertical video feed (TikTok/Reels style)
function FeedTrackCard({
  track,
  onLike,
  onRemix,
  onShare,
  onClick,
}: {
  track: Track;
  onLike?: () => void;
  onRemix?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}) {
  return (
    <div 
      className="relative w-full h-full bg-black"
      onClick={onClick}
    >
      {/* Video/Thumbnail */}
      <div className="relative w-full h-full">
        {track.videoUrl ? (
          <video
            src={track.videoUrl}
            className="w-full h-full object-cover"
            preload="metadata"
            playsInline
            muted
            loop
          />
        ) : track.audioUrl ? (
          <AudioPlayer
            track={track}
            onLike={onLike}
            onRemix={onRemix}
            onShare={onShare}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
            <div className="text-center text-white">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <p className="text-lg font-medium">No media available</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-4">
          {/* Avatar with follow */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                <img
                  src={track.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${track.user?.username}`}
                  alt={track.user?.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
              +
            </button>
          </div>

          {/* Like */}
          <button
            onClick={(e) => { e.stopPropagation(); onLike?.(); }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">{formatCount(track.likesCount)}</span>
          </button>

          {/* Comments */}
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">{formatCount(track.commentsCount)}</span>
          </button>

          {/* Remix */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemix?.(); }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">{formatCount(track.remixesCount)}</span>
          </button>

          {/* Share */}
          <button
            onClick={(e) => { e.stopPropagation(); onShare?.(); }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-white text-xs font-medium">Share</span>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6">
          <div className="flex items-end gap-3 mb-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={track.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${track.user?.username}`}
                alt={track.user?.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">@{track.user?.username}</p>
              <p className="text-white/80 text-sm">{track.user?.displayName}</p>
            </div>
            <button className="px-4 py-1.5 bg-primary-500 text-white text-sm font-semibold rounded-full">
              Follow
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="text-white font-semibold text-lg mb-1">{track.title}</h3>
          {track.description && (
            <p className="text-white/90 text-sm line-clamp-2">{track.description}</p>
          )}

          {/* Tags */}
          {track.tags && track.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {track.tags.map((tag) => (
                <span key={tag} className="text-white/80 text-sm">#{tag}</span>
              ))}
            </div>
          )}

          {/* Audio visualizer */}
          <div className="flex items-center gap-1 mt-3">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
            </svg>
            <div className="flex items-center gap-0.5 h-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-white animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackCard;
