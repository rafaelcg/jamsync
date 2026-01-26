import { useCallback, useRef } from 'react';

// Swipe gesture hook for TikTok-style navigation
export function useSwipeNavigation(onSwipeUp?: () => void, onSwipeDown?: () => void) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEndY = e.touches[0].clientY;
    const deltaY = touchEndY - touchStartRef.current.y;

    if (Math.abs(deltaY) < minSwipeDistance) return;

    if (deltaY < -minSwipeDistance) {
      // Swipe up
      onSwipeUp?.();
    } else if (deltaY > minSwipeDistance) {
      // Swipe down
      onSwipeDown?.();
    }

    touchStartRef.current = null;
  }, [onSwipeUp, onSwipeDown]);

  return { handleTouchStart, handleTouchMove };
}
