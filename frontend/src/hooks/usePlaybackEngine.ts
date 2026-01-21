import { useRef, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface PlaybackEngineOptions {
  bpm: number;
  totalBeats: number;
  loop: boolean;
  soundEnabled: boolean;
  volume?: number;
  onBeatChange?: (beat: number) => void;
  onLoopComplete?: () => void;
}

/**
 * Unified playback engine that handles:
 * - Beat progression (single source of truth)
 * - Metronome audio (Web Audio API)
 * - Synced callbacks for UI updates
 */
export const usePlaybackEngine = (options: PlaybackEngineOptions) => {
  const {
    bpm,
    totalBeats,
    loop,
    soundEnabled,
    volume = 0.5,
    onBeatChange,
    onLoopComplete,
  } = options;

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [audioReady, setAudioReady] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  // Refs for audio
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Refs for timing - single source of truth
  const playbackStartTimeRef = useRef<number>(0);
  const schedulerIdRef = useRef<number | null>(null);
  const lastScheduledBeatRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  
  // Keep soundEnabled ref in sync
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Initialize AudioContext
  const initAudio = useCallback(async () => {
    if (Platform.OS !== 'web') {
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

  // Play a click sound at specific time
  const playClick = useCallback((time: number, isAccent: boolean = false) => {
    if (!audioContextRef.current || !soundEnabledRef.current) return;

    const ctx = audioContextRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.frequency.value = isAccent ? 1000 : 800;
      osc.type = 'sine';
      
      const attackTime = 0.001;
      const decayTime = 0.05;
      const clickVolume = volume * (isAccent ? 1 : 0.7);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(clickVolume, time + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + attackTime + decayTime);
      
      osc.start(time);
      osc.stop(time + attackTime + decayTime + 0.01);
    } catch (e) {
      // Ignore audio errors
    }
  }, [volume]);

  // Main scheduler - runs continuously while playing
  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx ? ctx.currentTime : (Date.now() / 1000);
    const secondsPerBeat = 60.0 / bpm;
    const scheduleAheadTime = 0.15; // Schedule 150ms ahead
    const lookaheadMs = 25; // Check every 25ms
    
    // Calculate current beat based on elapsed time
    const elapsedTime = now - playbackStartTimeRef.current;
    const currentBeatFloat = (elapsedTime / secondsPerBeat) + 1;
    const currentBeatInt = Math.floor(currentBeatFloat);
    
    // Handle loop or stop
    if (currentBeatInt > totalBeats) {
      if (loop) {
        // Reset start time for new loop
        playbackStartTimeRef.current = now;
        lastScheduledBeatRef.current = 0;
        onLoopComplete?.();
      } else {
        stop();
        return;
      }
    }
    
    // Update current beat for UI (clamped to valid range)
    const displayBeat = Math.max(1, Math.min(totalBeats, currentBeatInt));
    setCurrentBeat(displayBeat);
    onBeatChange?.(displayBeat);
    
    // Schedule upcoming metronome clicks
    if (ctx) {
      const lookAheadBeats = Math.ceil((elapsedTime + scheduleAheadTime) / secondsPerBeat);
      
      for (let beat = lastScheduledBeatRef.current + 1; beat <= lookAheadBeats && beat <= totalBeats; beat++) {
        const beatTime = playbackStartTimeRef.current + ((beat - 1) * secondsPerBeat);
        
        if (beatTime >= now && beatTime < now + scheduleAheadTime) {
          const isAccent = (beat - 1) % 4 === 0;
          playClick(beatTime, isAccent);
          lastScheduledBeatRef.current = beat;
        }
      }
      
      // Handle loop scheduling
      if (loop && lookAheadBeats > totalBeats) {
        // Schedule beats for next loop iteration
        const nextLoopStartTime = playbackStartTimeRef.current + (totalBeats * secondsPerBeat);
        const beatsIntoNextLoop = Math.ceil((now + scheduleAheadTime - nextLoopStartTime) / secondsPerBeat);
        
        for (let beat = 1; beat <= beatsIntoNextLoop; beat++) {
          const beatTime = nextLoopStartTime + ((beat - 1) * secondsPerBeat);
          if (beatTime >= now && beatTime < now + scheduleAheadTime) {
            const isAccent = (beat - 1) % 4 === 0;
            playClick(beatTime, isAccent);
          }
        }
      }
    }
    
    // Continue scheduling
    schedulerIdRef.current = window.setTimeout(runScheduler, lookaheadMs);
  }, [bpm, totalBeats, loop, playClick, onBeatChange, onLoopComplete]);

  // Start playback
  const start = useCallback(async () => {
    // Initialize audio on first interaction
    await initAudio();
    
    const ctx = audioContextRef.current;
    const now = ctx ? ctx.currentTime : (Date.now() / 1000);
    
    // Set start time
    playbackStartTimeRef.current = now;
    lastScheduledBeatRef.current = 0;
    isPlayingRef.current = true;
    
    setIsPlaying(true);
    setCurrentBeat(1);
    
    // Start scheduler
    runScheduler();
  }, [initAudio, runScheduler]);

  // Stop playback
  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (schedulerIdRef.current !== null) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    
    setCurrentBeat(1);
  }, []);

  // Toggle play/pause
  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (schedulerIdRef.current !== null) {
        clearTimeout(schedulerIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Restart scheduler when BPM changes during playback
  useEffect(() => {
    if (isPlayingRef.current && schedulerIdRef.current !== null) {
      // The scheduler will pick up the new BPM automatically
      // since it reads from the options on each run
    }
  }, [bpm]);

  return {
    isPlaying,
    currentBeat,
    audioReady,
    needsUserInteraction,
    start,
    stop,
    toggle,
    initAudio,
  };
};
