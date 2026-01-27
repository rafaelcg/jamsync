"use client";

import React from "react";
import type { NavigationProps } from "@/types";

export function Navigation({
  activeTab,
  onTabChange,
  unreadNotifications = 0,
}: NavigationProps) {
  const tabs: Array<{
    id: NavigationProps["activeTab"];
    icon: React.ReactNode;
    label: string;
    badge?: number;
  }> = [
    {
      id: "home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      label: "Home",
    },
    {
      id: "discover",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      label: "Discover",
    },
    {
      id: "upload",
      icon: (
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center -mt-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      ),
      label: "Create",
    },
    {
      id: "notifications",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
      label: "Inbox",
      badge: unreadNotifications,
    },
    {
      id: "profile",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      label: "Profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      {/* Gradient blur effect */}
      <div className="absolute inset-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800" />

      {/* Tab bar */}
      <div className="relative flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            className={`
              flex flex-col items-center justify-center gap-1
              min-w-[64px] h-12 rounded-xl
              transition-all duration-200
              ${
                activeTab === tab.id
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }
            `}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {tab.badge > 9 ? "9+" : tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Safe area for home indicator on iOS */}
      <div className="h-safe-area-bottom bg-white dark:bg-neutral-950" />
    </nav>
  );
}

export function TopBar({
  title,
  leftAction,
  rightAction,
  transparent = false,
}: {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 h-14 ${
        transparent
          ? "bg-transparent"
          : "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 max-w-lg mx-auto">
        <div className="w-10">{leftAction}</div>
        {title && (
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white">
            {title}
          </h1>
        )}
        <div className="w-10 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
}
