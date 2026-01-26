"use client";

import React from "react";
import { Button, IconButton } from "./index";

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showFirstLast = true,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add first pages
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    // Add visible page range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last pages
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center gap-1 ${className}`} aria-label="Pagination">
      {/* First Page */}
      {showFirstLast && (
        <IconButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          }
          variant="ghost"
          size="sm"
        />
      )}

      {/* Previous Page */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        }
        variant="ghost"
        size="sm"
      />

      {/* Page Numbers */}
      {pages.map((page, index) =>
        typeof page === "string" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              min-w-[36px] h-9 rounded-lg text-sm font-medium
              transition-colors
              ${
                currentPage === page
                  ? "bg-primary-500 text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }
            `}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next Page */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        }
        variant="ghost"
        size="sm"
      />

      {/* Last Page */}
      {showFirstLast && (
        <IconButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" />
            </svg>
          }
          variant="ghost"
          size="sm"
        />
      )}
    </nav>
  );
}

// Simple Load More Button
interface LoadMoreProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function LoadMore({ hasMore, isLoading, onLoadMore, className = "" }: LoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className={`flex justify-center py-4 ${className}`}>
      <Button
        onClick={onLoadMore}
        isLoading={isLoading}
        variant="outline"
        size="md"
      >
        {isLoading ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
}

// Infinite Scroll Trigger with Intersection Observer
interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  children?: React.ReactNode;
  className?: string;
  threshold?: number;
  loadingMessage?: string;
  endMessage?: string;
}

export function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  children,
  className = "",
  threshold = 100,
  loadingMessage = "Loading more...",
  endMessage = "You've seen it all! 🎵",
}: InfiniteScrollProps) {
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div className={className}>
      {children}
      
      {/* Trigger element for intersection observer */}
      <div ref={loadMoreRef} className="py-4">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-4">
            <svg className="animate-spin h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-neutral-500">{loadingMessage}</span>
          </div>
        )}
        
        {!hasMore && !isLoading && (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm">{endMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pagination;
