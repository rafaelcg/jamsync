"use client";

import React from "react";

interface TopBarProps {
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  className?: string;
}

export function TopBar({
  title,
  leftAction,
  rightAction,
  transparent = false,
  className = "",
}: TopBarProps) {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        ${transparent ? "" : "bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800"}
        ${className}
      `}
    >
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left Action */}
        <div className="w-10 flex-shrink-0">
          {leftAction}
        </div>

        {/* Title */}
        <div className="flex-1 text-center">
          {title ? (
            <h1 className="text-lg font-semibold text-white truncate">
              {title}
            </h1>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-6 h-6 text-primary-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
              <span className="text-lg font-bold text-white">JamSync</span>
            </div>
          )}
        </div>

        {/* Right Action */}
        <div className="w-10 flex-shrink-0 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
