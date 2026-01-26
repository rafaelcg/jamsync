import { useState, useEffect, useCallback, useRef } from 'react';

// Audio volume hook with persistence
export function useVolume(initialVolume = 0.8) {
  const [volume, setVolumeState] = useState(initialVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedVolume = localStorage.getItem('jamsync_volume');
    if (savedVolume) {
      setVolumeState(parseFloat(savedVolume));
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    localStorage.setItem('jamsync_volume', clampedVolume.toString());
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  return { volume, setVolume, audioRef };
}
