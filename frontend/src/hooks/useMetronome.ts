import { useRef, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface MetronomeOptions {
  bpm: number;
  enabled: boolean;
  volume?: number;
  onBeat?: (beat: number) => void;
}

export const useMetronome = (options: MetronomeOptions) => {
  const { bpm, enabled, volume = 0.5, onBeat } = options;
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextBeatTimeRef = useRef<number>(0);
  const currentBeatRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const [audioReady, setAudioReady] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  // Initialize AudioContext
  const initAudio = useCallback(async () => {
    if (Platform.OS !== 'web') {
      // For native, we'll use a simpler approach
      setAudioReady(true);
      return true;
    }

    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }

      if (audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        setAudioReady(true);
        setNeedsUserInteraction(false);
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      setNeedsUserInteraction(true);
    }
    return false;
  }, []);

  // Play a click sound
  const playClick = useCallback((time: number, isAccent: boolean = false) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    // Create oscillator for click
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Higher pitch for accent (beat 1)
    osc.frequency.value = isAccent ? 1000 : 800;
    osc.type = 'sine';
    
    // Sharp attack, quick decay
    const attackTime = 0.001;
    const decayTime = 0.05;
    const clickVolume = volume * (isAccent ? 1 : 0.7);
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(clickVolume, time + attackTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + attackTime + decayTime);
    
    osc.start(time);
    osc.stop(time + attackTime + decayTime + 0.01);
  }, [volume]);

  // Scheduler function
  const scheduler = useCallback(() => {
    if (!audioContextRef.current || !isPlayingRef.current) return;

    const ctx = audioContextRef.current;
    const secondsPerBeat = 60.0 / bpm;
    const scheduleAheadTime = 0.1; // Schedule 100ms ahead

    while (nextBeatTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const beatNumber = currentBeatRef.current;
      const isAccent = beatNumber % 4 === 0;
      
      playClick(nextBeatTimeRef.current, isAccent);
      
      // Trigger callback
      if (onBeat) {
        // Use setTimeout to call on the UI thread at approximately the right time
        const delay = (nextBeatTimeRef.current - ctx.currentTime) * 1000;
        setTimeout(() => {
          if (isPlayingRef.current) {
            onBeat(beatNumber % 8 + 1);
          }
        }, Math.max(0, delay));
      }

      nextBeatTimeRef.current += secondsPerBeat;
      currentBeatRef.current++;
    }
  }, [bpm, playClick, onBeat]);

  // Start metronome
  const start = useCallback(async () => {
    const ready = await initAudio();
    if (!ready || !audioContextRef.current) {
      setNeedsUserInteraction(true);
      return false;
    }

    isPlayingRef.current = true;
    currentBeatRef.current = 0;
    nextBeatTimeRef.current = audioContextRef.current.currentTime + 0.05;

    // Start scheduler loop
    const scheduleInterval = () => {
      if (!isPlayingRef.current) return;
      scheduler();
      timerIdRef.current = requestAnimationFrame(scheduleInterval);
    };
    
    scheduleInterval();
    return true;
  }, [initAudio, scheduler]);

  // Stop metronome
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    if (timerIdRef.current !== null) {
      cancelAnimationFrame(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  // Handle enabled state changes
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
    return () => stop();
  }, [enabled, start, stop]);

  // Update BPM while playing
  useEffect(() => {
    // BPM change is handled in scheduler
  }, [bpm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stop]);

  return {
    audioReady,
    needsUserInteraction,
    initAudio,
    start,
    stop,
  };
};
