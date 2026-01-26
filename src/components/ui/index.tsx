"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-xl
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
      focus:ring-primary-500
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-secondary-500 text-white
      hover:bg-secondary-600 active:bg-secondary-700
      focus:ring-secondary-400
      shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-neutral-300 bg-transparent
      text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100
      focus:ring-neutral-400
      dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800
    `,
    ghost: `
      bg-transparent
      text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200
      focus:ring-neutral-400
      dark:text-neutral-300 dark:hover:bg-neutral-800 dark:active:bg-neutral-700
    `,
    danger: `
      bg-error-500 text-white
      hover:bg-error-600 active:bg-error-700
      focus:ring-error-400
      shadow-md hover:shadow-lg
    `,
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-body-md",
    lg: "h-12 px-6 text-body-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
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
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "recording";
  className?: string;
}

export function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const sizeStyles = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const statusSizes = {
    xs: "w-2 h-2",
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-3.5 h-3.5",
    xl: "w-4 h-4",
  };

  const statusColors = {
    online: "bg-success-500",
    offline: "bg-neutral-400",
    recording: "bg-error-500 animate-pulse",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          ${sizeStyles[size]} rounded-full overflow-hidden bg-neutral-200
          ring-2 ring-white dark:ring-neutral-900
        `}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
            <svg
              className={`${size === "xs" ? "w-3 h-3" : size === "sm" ? "w-4 h-4" : "w-5 h-5"}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            ${statusSizes[size]} ${statusColors[status]}
            rounded-full ring-2 ring-white dark:ring-neutral-900
          `}
        />
      )}
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    default: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
    secondary: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300",
    success: "bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300",
    warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300",
    error: "bg-error-100 text-error-700 dark:bg-error-900/50 dark:text-error-300",
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
    >
      {children}
    </span>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`
        bg-white dark:bg-neutral-900 rounded-xl
        border border-neutral-200 dark:border-neutral-800
        ${paddingStyles[padding]}
        ${hover ? "hover:shadow-md transition-shadow duration-200 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

interface WaveformProps {
  data: number[];
  currentTime?: number;
  duration?: number;
  height?: number;
  color?: string;
  progressColor?: string;
  className?: string;
}

export function Waveform({
  data,
  currentTime = 0,
  duration = 0,
  height = 40,
  color = "#d4d4d8",
  progressColor = "#8b5cf6",
  className = "",
}: WaveformProps) {
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className={`flex items-center gap-0.5 ${className}`} style={{ height }}>
      {data.map((value, index) => {
        const barProgress = index / data.length;
        const isPlayed = barProgress <= progress;
        const barHeight = Math.max(4, (value / 100) * height);

        return (
          <div
            key={index}
            className="flex-1 rounded-full transition-colors duration-75"
            style={{
              height: `${barHeight}px`,
              backgroundColor: isPlayed ? progressColor : color,
              minHeight: "2px",
            }}
          />
        );
      })}
    </div>
  );
}

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "error";
  className?: string;
}

export function Progress({
  value,
  max = 100,
  size = "md",
  color = "primary",
  className = "",
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  const colorStyles = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    success: "bg-success-500",
    error: "bg-error-500",
  };

  return (
    <div
      className={`w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden ${sizeStyles[size]} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${colorStyles[color]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "text",
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`
        animate-pulse bg-neutral-200 dark:bg-neutral-700
        ${variantStyles[variant]} ${className}
      `}
      style={{
        width: width,
        height: height || (variant === "text" ? "1em" : undefined),
      }}
    />
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  badge?: number;
}

export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  badge,
  className = "",
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const variantStyles = {
    primary: "bg-primary-500 text-white hover:bg-primary-600",
    secondary: "bg-secondary-500 text-white hover:bg-secondary-600",
    ghost: "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
    danger: "bg-error-500 text-white hover:bg-error-600",
  };

  return (
    <button
      className={`
        relative inline-flex items-center justify-center rounded-full
        transition-colors duration-200
        ${sizeStyles[size]} ${variantStyles[variant]} ${className}
      `}
      {...props}
    >
      <span className={iconSizes[size]}>{icon}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}

// Re-export all UI components
export type { ButtonProps, AvatarProps, BadgeProps, CardProps, WaveformProps, ProgressProps, SkeletonProps, IconButtonProps };

// Form Elements
export { Input, TextArea, Select, Checkbox, RadioGroup, Toggle } from "./FormElements";

// Dialog
export { Dialog, ConfirmDialog, BottomSheet } from "./Dialog";

// Toast
export { ToastProvider, useToast } from "./Toast";

// Empty State
export { EmptyState, EmptyTracks, EmptySearch, EmptyLiked, EmptyFollowers, EmptyFollowing } from "./EmptyState";

// Search
export { SearchBar, SearchWithResults } from "./SearchBar";

// Dropdown
export { Dropdown, DropdownItem, DropdownSeparator, DropdownMenu, UserMenuDropdown } from "./Dropdown";

// Pagination
export { Pagination, LoadMore, InfiniteScroll } from "./Pagination";

// Responsive
export {
  ResponsiveContainer,
  ShowAt,
  HideAt,
  ResponsiveSwitch,
  ResponsiveGrid,
  MobileNav,
  DesktopSidebar,
  SafeArea,
  useScreenSize,
  useBreakpoint,
} from "./Responsive";

// Layout
export {
  Tabs,
  TabPanel,
  SegmentedControl,
  Section,
  PageHeader,
  StatsRow,
  LoadingSpinner,
  FullPageLoader,
} from "./Layout";
