"use client";

import React from "react";
import { motion } from "framer-motion";

// Tab Component
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  badge?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills" | "underline";
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = "underline", className = "" }: TabsProps) {
  if (variant === "pills") {
    return (
      <div className={`flex gap-2 overflow-x-auto scrollbar-hide ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
              whitespace-nowrap transition-colors
              ${
                activeTab === tab.id
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`text-xs ${
                  activeTab === tab.id ? "text-white/80" : "text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge}
          </button>
        ))}
      </div>
    );
  }

  // Default underline variant
  return (
    <div className={`border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-3 text-sm font-medium
              transition-colors
              ${
                activeTab === tab.id
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`text-xs ${
                  activeTab === tab.id ? "text-primary-500" : "text-neutral-400"
                }`}
              >
                {tab.count}
              </span>
            )}
            {tab.badge}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Tab Panel
interface TabPanelProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className = "" }: TabPanelProps) {
  if (id !== activeTab) return null;
  return <div className={className}>{children}</div>;
}

// Segmented Control
interface SegmentedControlProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className = "" }: SegmentedControlProps) {
  return (
    <div className={`inline-flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${
              value === option.value
                ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// Section Component
interface SectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Section({
  title,
  subtitle,
  action,
  children,
  className = "",
  noPadding = false,
}: SectionProps) {
  return (
    <section className={`${noPadding ? "" : "py-6"} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// Page Header
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  showBack = false,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Stats Row
interface StatsRowProps {
  stats: Array<{
    label: string;
    value: string | number;
    onClick?: () => void;
  }>;
  className?: string;
}

export function StatsRow({ stats, className = "" }: StatsRowProps) {
  return (
    <div className={`flex gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <button
          key={index}
          onClick={stat.onClick}
          className={`text-center ${stat.onClick ? "hover:opacity-75" : ""}`}
          disabled={!stat.onClick}
        >
          <p className="text-xl font-bold text-neutral-900 dark:text-white">
            {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
          </p>
          <p className="text-xs text-neutral-500">{stat.label}</p>
        </button>
      ))}
    </div>
  );
}

// Loading Spinner
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <svg
      className={`animate-spin text-primary-500 ${sizes[size]} ${className}`}
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// Full Page Loader
export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 z-50">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="mt-4 text-neutral-500">{message}</p>
      )}
    </div>
  );
}

export default {
  Tabs,
  TabPanel,
  SegmentedControl,
  Section,
  PageHeader,
  StatsRow,
  LoadingSpinner,
  FullPageLoader,
};
