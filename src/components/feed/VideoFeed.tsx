"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { TrackCard } from "./TrackCard";
import type { Track } from "@/types";

interface VideoFeedProps {
  tracks: Track[];
  onTrackClick?: (track: Track) => void;
  onLike?: (trackId: string) => void;
  onRemix?: (track: Track) => void;
  onShare?: (trackId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function VideoFeed({
  tracks,
  onTrackClick,
  onLike,
  onRemix,
  onShare,
  onLoadMore,
  hasMore = false,
  isLoading = false,
}: VideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);

  // Auto-play current track
  useEffect(() => {
    const videoElements = containerRef.current?.querySelectorAll("video");
    videoElements?.forEach((video, index) => {
      if (index === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // Load more when approaching end
  useEffect(() => {
    if (currentIndex >= tracks.length - 3 && hasMore && !isLoading) {
      onLoadMore?.();
    }
  }, [currentIndex, tracks.length, hasMore, isLoading, onLoadMore]);

  const handleScroll = useCallback(
    (direction: "up" | "down") => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      if (direction === "up") {
        if (currentIndex < tracks.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      } else {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      }

      setTimeout(() => setIsTransitioning(false), 300);
    },
    [currentIndex, tracks.length, isTransitioning]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      y: e.changedTouches[0].clientY,
      time: Date.now(),
    };

    const deltaY = touchStartRef.current.y - touchEnd.y;
    const deltaTime = touchEnd.time - touchStartRef.current.time;

    // Minimum swipe distance and time
    if (Math.abs(deltaY) > 50 && deltaTime < 300) {
      if (deltaY > 0) {
        handleScroll("up");
      } else {
        handleScroll("down");
      }
    }

    touchStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      handleScroll("up");
    } else {
      handleScroll("down");
    }
  };

  if (tracks.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-neutral-900 text-white p-8">
        <svg
          className="w-16 h-16 text-neutral-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
        <h2 className="text-xl font-semibold mb-2">No tracks yet</h2>
        <p className="text-neutral-400 text-center">
          Be the first to share your music!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-neutral-950"
      onWheel={handleWheel}
    >
      {/* Track Stack */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {tracks.map((track, index) => {
          const offset = index - currentIndex;
          const isVisible = Math.abs(offset) < 2;
          const zIndex = 10 - Math.abs(offset);

          if (!isVisible) return null;

          return (
            <div
              key={track.id}
              className={`absolute w-full h-full transition-all duration-300 ease-out`}
              style={{
                transform: `translateY(${offset * 10}%) scale(${1 - Math.abs(offset) * 0.05})`,
                opacity: 1 - Math.abs(offset) * 0.3,
                zIndex,
                pointerEvents: offset === 0 ? "auto" : "none",
              }}
            >
              <TrackCard
                track={track}
                variant="feed"
                onClick={() => offset === 0 && onTrackClick?.(track)}
                onLike={() => offset === 0 && onLike?.(track.id)}
                onRemix={() => offset === 0 && onRemix?.(track)}
                onShare={() => offset === 0 && onShare?.(track.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 bg-neutral-900/80 px-4 py-2 rounded-full">
            <svg
              className="animate-spin w-5 h-5 text-primary-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-white text-sm">Loading more...</span>
          </div>
        </div>
      )}

      {/* Navigation Hints */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <svg
          className="w-6 h-6 text-white animate-bounce-soft"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
        <span className="text-white text-xs">Swipe up for more</span>
      </div>
    </div>
  );
}
