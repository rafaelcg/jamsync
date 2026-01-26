"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-primary-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-white font-medium">{message}</p>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded ${className}`} />
  );
}

interface TrackCardSkeletonProps {
  variant?: "default" | "horizontal";
}

export function TrackCardSkeleton({ variant = "default" }: TrackCardSkeletonProps) {
  if (variant === "horizontal") {
    return (
      <div className="flex gap-4 p-4 rounded-xl bg-white dark:bg-neutral-900 shadow-sm">
        <LoadingSkeleton className="w-32 h-32 rounded-lg" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-5 w-3/4" />
          <LoadingSkeleton className="h-4 w-1/2" />
          <LoadingSkeleton className="h-4 w-full" />
          <div className="flex gap-4">
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
      <LoadingSkeleton className="aspect-[9/16]" />
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <LoadingSkeleton className="w-8 h-8 rounded-full" />
          <LoadingSkeleton className="h-4 w-20" />
        </div>
        <LoadingSkeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-3 w-12" />
          <LoadingSkeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function FeedLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <TrackCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileLoadingSkeleton() {
  return (
    <div className="p-4 space-y-6">
      {/* Profile header skeleton */}
      <div className="flex items-start gap-4">
        <LoadingSkeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="h-6 w-32" />
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-4 w-full" />
        </div>
      </div>
      
      {/* Stats skeleton */}
      <div className="flex gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <LoadingSkeleton className="h-6 w-12 mx-auto mb-1" />
            <LoadingSkeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      
      {/* Button skeleton */}
      <LoadingSkeleton className="h-12 w-full rounded-xl" />
      
      {/* Tabs skeleton */}
      <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-8 w-20" />
        ))}
      </div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <LoadingSkeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default {
  LoadingSpinner,
  LoadingOverlay,
  LoadingSkeleton,
  TrackCardSkeleton,
  FeedLoadingSkeleton,
  ProfileLoadingSkeleton,
};
