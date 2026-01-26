'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { formatDuration } from '@/lib/utils';
import { useVideoAutoPlay, useSwipeNavigation } from '@/hooks';
import type { Track } from '@/types';

interface VideoPlayerProps {
  track: Track;
  isActive: boolean;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLike?: () => void;
  onRemix?: () => void;
  onShare?: () => void;
  onComment?: () => void;
}

export function VideoPlayer({
  track,
  isActive,
  onSwipeUp,
  onSwipeDown,
  onLike,
  onRemix,
  onShare,
  onComment,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(track.isLiked || false);
  const [likesCount, setLikesCount] = useState(track.likesCount);

  const { isPlaying, hasError } = useVideoAutoPlay(videoRef, isActive);

  // Handle swipe gestures
  const { handleTouchStart, handleTouchMove } = useSwipeNavigation(
    () => onSwipeUp?.(),
    () => onSwipeDown?.()
  );

  // Sync mute state with active state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isActive ? isMuted : true;
    }
  }, [isActive, isMuted]);

  // Update current time
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  // Handle loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  // Toggle play/pause on click
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  // Toggle like
  const handleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike?.();
  }, [isLiked, onLike]);

  // Generate waveform bars based on track data or generate random visualization
  const waveformBars = track.waveformData && track.waveformData.length > 0 
    ? track.waveformData 
    : Array.from({ length: 40 }, () => 20 + Math.random() * 60);

  return (
    <div 
      className="relative w-full h-full bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Video Element */}
      {track.videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={track.videoUrl}
          playsInline
          loop
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={togglePlay}
        />
      ) : (
        // Fallback: Audio-only with waveform visualization
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Animated Waveform */}
          <div className="flex items-end justify-center gap-1 h-32 mb-8 px-8">
            {waveformBars.map((height, index) => (
              <div
                key={index}
                className="w-2 rounded-full bg-white/80 animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 0.05}s`,
                  animationDuration: '0.5s',
                }}
              />
            ))}
          </div>
          
          {/* Track Info */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v18a9 9 0 1 0-9-9c2.52 0 4.93 1.15 6.66 3.05a9.01 9.01 0 0 0 2.34 4.55 9 9 0 0 0 0-17.6z" />
              </svg>
            </div>
            <p className="text-white/90 text-lg font-semibold">{track.title}</p>
            <p className="text-white/60 text-sm">@{track.user?.username}</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <svg className="w-12 h-12 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>Failed to load video</p>
          </div>
        </div>
      )}

      {/* Overlay Controls - Show on hover or tap */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={() => setShowControls(!showControls)}
      >
        {/* Play/Pause Center Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Side Action Buttons */}
        <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
              {track.user?.avatarUrl ? (
                <Image
                  src={track.user.avatarUrl}
                  alt={track.user.username}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-white font-medium">
                  {track.user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
          </div>

          {/* Like Button */}
          <ActionButton
            icon={
              <svg className="w-7 h-7" fill={isLiked ? '#ef4444' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
            count={likesCount}
            onClick={handleLike}
            isActive={isLiked}
          />

          {/* Comment Button */}
          <ActionButton
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            count={track.commentsCount || 0}
            onClick={onComment}
          />

          {/* Remix Button */}
          <ActionButton
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
            count={track.remixesCount}
            label="Remix"
            onClick={onRemix}
          />

          {/* Share Button */}
          <ActionButton
            icon={
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            }
            label="Share"
            onClick={onShare}
          />
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="mb-2">
            <h3 className="text-white font-semibold text-lg">@{track.user?.username}</h3>
            <p className="text-white/90 text-sm">{track.title}</p>
          </div>
          
          {track.description && (
            <p className="text-white/70 text-sm mb-2 line-clamp-2">{track.description}</p>
          )}

          {/* Progress Bar */}
          <div className="h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-white/60 text-xs mt-1">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted(!isMuted);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          {isMuted ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  count?: number;
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
}

function ActionButton({ icon, count, label, onClick, isActive }: ActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="flex flex-col items-center gap-1 group"
    >
      <div className={`w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transition-transform group-active:scale-90 ${isActive ? 'text-red-500' : 'text-white'}`}>
        {icon}
      </div>
      {count !== undefined && (
        <span className="text-white text-xs font-medium">{count >= 1000 ? `${(count / 1000).toFixed(1)}K` : count}</span>
      )}
      {label && (
        <span className="text-white text-xs">{label}</span>
      )}
    </button>
  );
}

export default VideoPlayer;
