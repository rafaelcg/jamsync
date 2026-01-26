import { useState, useEffect, useRef } from 'react';

// Video auto-play hook
export function useVideoAutoPlay(videoRef: React.RefObject<HTMLVideoElement>, enabled = true) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;

    const play = async () => {
      try {
        await video.play();
        setIsPlaying(true);
        setHasError(false);
      } catch {
        setHasError(true);
        // Auto-play was prevented, wait for user interaction
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => setHasError(true);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    play();

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.pause();
    };
  }, [videoRef, enabled]);

  return { isPlaying, hasError };
}
