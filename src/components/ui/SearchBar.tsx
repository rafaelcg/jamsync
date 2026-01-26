"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "./FormElements";

// Search Bar Component
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  showClear?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className = "",
  autoFocus = false,
  showClear = true,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
        rightIcon={
          value && showClear ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null
        }
      />
    </form>
  );
}

// Search with Results Dropdown
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  type?: "track" | "user" | "tag";
  onClick?: () => void;
}

interface SearchWithResultsProps {
  value: string;
  onChange: (value: string) => void;
  results?: SearchResult[];
  isLoading?: boolean;
  placeholder?: string;
  onSelect?: (result: SearchResult) => void;
  emptyMessage?: string;
  className?: string;
}

export function SearchWithResults({
  value,
  onChange,
  results = [],
  isLoading = false,
  placeholder = "Search tracks, artists, hashtags...",
  onSelect,
  emptyMessage = "No results found",
  className = "",
}: SearchWithResultsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when there's input and results/loading
  useEffect(() => {
    setIsOpen(value.length > 0 && (results.length > 0 || isLoading));
  }, [value, results.length, isLoading]);

  const handleSelect = (result: SearchResult) => {
    onSelect?.(result);
    setIsOpen(false);
    onChange("");
  };

  const getResultIcon = (type?: string) => {
    switch (type) {
      case "track":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        );
      case "user":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "tag":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        );
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <SearchBar
        value={value}
        onChange={(v) => {
          onChange(v);
          setIsOpen(true);
        }}
        placeholder={placeholder}
      />

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-500">
              <svg className="animate-spin w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2 max-h-80 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500">
                    {result.image ? (
                      <img src={result.image} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      getResultIcon(result.type)
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-neutral-900 dark:text-white">{result.title}</p>
                    {result.subtitle && (
                      <p className="text-sm text-neutral-500">{result.subtitle}</p>
                    )}
                  </div>
                  {result.type && (
                    <span className="text-xs text-neutral-400 capitalize">{result.type}</span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-neutral-500">
              <p className="text-sm">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
