"use client";

import React, { useState, useEffect } from "react";

// Breakpoint type
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// Breakpoint values in pixels
const breakpoints: Record<Breakpoint, number> = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Responsive Container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: Breakpoint | "full";
  className?: string;
}

export function ResponsiveContainer({
  children,
  maxWidth = "xl",
  className = "",
}: ResponsiveContainerProps) {
  const maxWidthClasses: Record<string, string> = {
    full: "max-w-full",
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

// Breakpoint-sensitive rendering
interface ShowAtProps {
  children: React.ReactNode;
  breakpoint: Breakpoint;
  direction?: "up" | "down";
}

export function ShowAt({ children, breakpoint, direction = "up" }: ShowAtProps) {
  const [matches, setMatches] = useState(false);
  const breakpointValue = breakpoints[breakpoint];

  useEffect(() => {
    const checkBreakpoint = () => {
      if (direction === "up") {
        setMatches(window.innerWidth >= breakpointValue);
      } else {
        setMatches(window.innerWidth < breakpointValue);
      }
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpointValue, direction]);

  return matches ? <>{children}</> : null;
}

// Hide at breakpoint
interface HideAtProps {
  children: React.ReactNode;
  breakpoint: Breakpoint;
  direction?: "up" | "down";
}

export function HideAt({ children, breakpoint, direction = "up" }: HideAtProps) {
  const [matches, setMatches] = useState(false);
  const breakpointValue = breakpoints[breakpoint];

  useEffect(() => {
    const checkBreakpoint = () => {
      if (direction === "up") {
        setMatches(window.innerWidth >= breakpointValue);
      } else {
        setMatches(window.innerWidth < breakpointValue);
      }
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpointValue, direction]);

  return matches ? null : <>{children}</>;
}

// Responsive layout switcher
interface ResponsiveSwitchProps {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  breakpoint?: Breakpoint;
}

export function ResponsiveSwitch({
  desktop,
  mobile,
  breakpoint = "md",
}: ResponsiveSwitchProps) {
  const [isMobile, setIsMobile] = useState(false);
  const breakpointValue = breakpoints[breakpoint];

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsMobile(window.innerWidth < breakpointValue);
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpointValue]);

  return <>{isMobile ? mobile : desktop}</>;
}

// Grid columns responsive
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 4,
  className = "",
}: ResponsiveGridProps) {
  const gridCols = {
    gridCols1: cols.default || 1,
    sm: cols.sm,
    md: cols.md,
    lg: cols.lg,
    xl: cols.xl,
  };

  return (
    <div
      className={`
        grid gap-${gap}
        grid-cols-${gridCols.gridCols1}
        ${cols.sm ? `sm:grid-cols-${cols.sm}` : ""}
        ${cols.md ? `md:grid-cols-${cols.md}` : ""}
        ${cols.lg ? `lg:grid-cols-${cols.lg}` : ""}
        ${cols.xl ? `xl:grid-cols-${cols.xl}` : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Mobile bottom navigation (shown only on mobile)
export function MobileNav({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <HideAt breakpoint="md" direction="up">
      <nav
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 ${className}`}
      >
        {children}
      </nav>
    </HideAt>
  );
}

// Desktop sidebar (shown only on desktop)
export function DesktopSidebar({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ShowAt breakpoint="md" direction="up">
      <aside className={`fixed left-0 top-0 bottom-0 w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 ${className}`}>
        {children}
      </aside>
    </ShowAt>
  );
}

// Safe area padding helper
interface SafeAreaProps {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  className?: string;
}

export function SafeArea({
  children,
  top = true,
  bottom = true,
  left = true,
  right = true,
  className = "",
}: SafeAreaProps) {
  return (
    <div
      className={`
        ${top ? "pt-safe" : ""}
        ${bottom ? "pb-safe" : ""}
        ${left ? "pl-safe" : ""}
        ${right ? "pr-safe" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Screen size hook
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<{
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        height: window.innerHeight,
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}

// Get current breakpoint
export function useBreakpoint(): Breakpoint {
  const width = typeof window !== "undefined" ? window.innerWidth : 0;

  if (width >= 1536) return "2xl";
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "xs";
}

export default {
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
};
