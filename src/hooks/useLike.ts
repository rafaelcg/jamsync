import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api';

// Like hook for tracks
export function useLike(trackId: string, initialLiked = false) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch initial like state if needed
  }, [trackId]);

  const toggleLike = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    // Optimistic update
    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    try {
      const response = isLiked 
        ? await api.tracks.unlike(trackId)
        : await api.tracks.like(trackId);

      if (response.status !== 200) {
        // Revert on error
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      }
    } catch {
      // Revert on error
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  }, [trackId, isLiked, loading]);

  return { isLiked, likesCount, loading, toggleLike };
}
