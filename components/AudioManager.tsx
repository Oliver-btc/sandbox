import { useEffect, useRef, useCallback } from 'react';

const audioSources = {
  marbleHitObstacle: '/sounds/marble-hit-obstacle.wav',
  marbleInBucket: '/sounds/marble-in-bucket.wav',
  gameOver: '/sounds/game-over.wav',
};

const useAudioManager = (isMuted: boolean) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  useEffect(() => {
    initAudioContext();

    // Preload audio files
    Object.entries(audioSources).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => audio.pause());
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [initAudioContext]);

  const playSound = useCallback((soundName: string, volume: number = 1) => {
    if (isMuted) return;

    initAudioContext(); // Ensure audio context is initialized and resumed

    const audio = audioRefs.current[soundName];
    if (audio) {
      audio.volume = volume;
      audio.currentTime = 0;
      audio.play().catch(error => console.error('Error playing sound:', error));
    } else {
      console.warn(`Sound not found: ${soundName}`);
    }
  }, [isMuted, initAudioContext]);

  return { playSound };
};

export default useAudioManager;

