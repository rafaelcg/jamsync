"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// Dropdown Props
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

export function Dropdown({ trigger, children, align = "left", className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const alignments = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 min-w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 ${alignments[align]}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown Item
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({
  children,
  onClick,
  variant = "default",
  icon,
  disabled = false,
  className = "",
}: DropdownItemProps) {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 text-left
        transition-colors
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}
        ${variant === "danger" ? "text-error-500" : "text-neutral-700 dark:text-neutral-300"}
        ${className}
      `}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
}

// Dropdown Separator
export function DropdownSeparator() {
  return <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />;
}

// Dropdown with Menu Items
interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: Array<{
    label: string;
    onClick?: () => void;
    variant?: "default" | "danger";
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  align?: "left" | "right" | "center";
}

export function DropdownMenu({ trigger, items, align = "left" }: DropdownMenuProps) {
  return (
    <Dropdown trigger={trigger} align={align}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <DropdownSeparator />}
          <DropdownItem
            onClick={item.onClick}
            variant={item.variant}
            icon={item.icon}
            disabled={item.disabled}
          >
            {item.label}
          </DropdownItem>
        </React.Fragment>
      ))}
    </Dropdown>
  );
}

// User Menu Dropdown
interface UserMenuDropdownProps {
  user: {
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  menuItems: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
  onLogout?: () => void;
}

export function UserMenuDropdown({ user, menuItems, onLogout }: UserMenuDropdownProps) {
  return (
    <Dropdown
      align="right"
      trigger={
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <img
            src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
        </button>
      }
    >
      <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-800">
        <p className="font-medium text-neutral-900 dark:text-white">{user.displayName}</p>
        <p className="text-sm text-neutral-500">@{user.username}</p>
      </div>

      {menuItems.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <DropdownSeparator />}
          <DropdownItem onClick={item.onClick} icon={item.icon}>
            {item.label}
          </DropdownItem>
        </React.Fragment>
      ))}

      {onLogout && (
        <>
          <DropdownSeparator />
          <DropdownItem onClick={onLogout} variant="danger" icon={<LogoutIcon />}>
            Log out
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}

// Logout Icon
function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

export default Dropdown;
