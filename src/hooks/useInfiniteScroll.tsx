import { useState, useEffect, useCallback, useRef } from 'react';
import type { Track, FeedResponse, FeedParams } from '@/types';
import { api } from '@/lib/api';

// Infinite scroll hook for feed
export function useInfiniteScroll(params: FeedParams = {}) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(params.cursor);
  const loadingRef = useRef(false);

  const fetchTracks = useCallback(async () => {
    if (loadingRef.current || (!hasMore && cursor)) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      let response;
      const feedParams: Record<string, string> = {};
      if (cursor) feedParams.cursor = cursor;
      
      switch (params.type) {
        case 'trending':
          response = await api.feed.getTrending({ limit: 10, offset: cursor ? parseInt(cursor) : 0 });
          break;
        case 'discover':
          response = await api.feed.getDiscover({ limit: 10, offset: cursor ? parseInt(cursor) : 0 });
          break;
        case 'following':
        default:
          response = await api.feed.getTimeline({ limit: 10, offset: cursor ? parseInt(cursor) : 0 });
      }

      if (response.data && response.status === 200) {
        const feedData = response.data as FeedResponse;
        setTracks((prev) => 
          cursor ? [...prev, ...feedData.tracks] : feedData.tracks
        );
        setHasMore(feedData.hasMore);
        setCursor(feedData.nextCursor);
      } else {
        setError(response.error || 'Failed to load tracks');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [cursor, hasMore, params.type]);

  useEffect(() => {
    fetchTracks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingRef.current) {
      fetchTracks();
    }
  }, [hasMore, fetchTracks]);

  // Reset feed when params change
  useEffect(() => {
    setTracks([]);
    setCursor(undefined);
    setHasMore(true);
    fetchTracks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.type]);

  return { tracks, loading, error, hasMore, loadMore, refetch: fetchTracks };
}
