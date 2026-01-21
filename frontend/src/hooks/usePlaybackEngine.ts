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
 * Unified playback engine with REAL-TIME BPM changes
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [audioReady, setAudioReady] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  const bpmRef = useRef<number>(bpm);
  
  // Beat tracking - use beat index and calculate time dynamically
  const currentBeatIndexRef = useRef<number>(0);
  const lastBeatTimeRef = useRef<number>(0);
  const lastScheduledBeatRef = useRef<number>(-1);
  
  // Keep refs in sync with props
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  
  // REAL-TIME BPM UPDATE - recalculate timing immediately
  useEffect(() => {
    bpmRef.current = bpm;
    // When BPM changes during playback, adjust lastBeatTime to maintain position
    if (isPlayingRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      lastBeatTimeRef.current = now;
      // Keep the current beat index, just update when next beat should happen
    }
  }, [bpm]);

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

  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx ? ctx.currentTime : (Date.now() / 1000);
    
    // Use CURRENT bpm from ref for real-time updates
    const currentBpm = bpmRef.current;
    const secondsPerBeat = 60.0 / currentBpm;
    const scheduleAheadTime = 0.15;
    const lookaheadMs = 25;
    
    // Calculate time since last beat
    const timeSinceLastBeat = now - lastBeatTimeRef.current;
    
    // Check if it's time for next beat
    if (timeSinceLastBeat >= secondsPerBeat) {
      currentBeatIndexRef.current++;
      lastBeatTimeRef.current = now;
      
      // Handle loop
      if (currentBeatIndexRef.current > totalBeats) {
        if (loop) {
          currentBeatIndexRef.current = 1;
          lastScheduledBeatRef.current = 0;
          onLoopComplete?.();
        } else {
          stop();
          return;
        }
      }
      
      // Update UI
      const displayBeat = currentBeatIndexRef.current;
      setCurrentBeat(displayBeat);
      onBeatChange?.(displayBeat);
    }
    
    // Schedule upcoming metronome clicks
    if (ctx) {
      const nextBeatTime = lastBeatTimeRef.current + secondsPerBeat;
      
      if (nextBeatTime < now + scheduleAheadTime && 
          currentBeatIndexRef.current !== lastScheduledBeatRef.current) {
        const beatToSchedule = currentBeatIndexRef.current;
        const isAccent = (beatToSchedule - 1) % 4 === 0;
        playClick(nextBeatTime, isAccent);
        lastScheduledBeatRef.current = beatToSchedule;
      }
    }
    
    schedulerIdRef.current = window.setTimeout(runScheduler, lookaheadMs);
  }, [totalBeats, loop, playClick, onBeatChange, onLoopComplete]);

  const start = useCallback(async () => {
    await initAudio();
    
    const ctx = audioContextRef.current;
    const now = ctx ? ctx.currentTime : (Date.now() / 1000);
    
    currentBeatIndexRef.current = 1;
    lastBeatTimeRef.current = now;
    lastScheduledBeatRef.current = 0;
    isPlayingRef.current = true;
    
    setIsPlaying(true);
    setCurrentBeat(1);
    onBeatChange?.(1);
    
    // Play first click immediately
    if (ctx && soundEnabledRef.current) {
      playClick(now + 0.05, true);
      lastScheduledBeatRef.current = 1;
    }
    
    runScheduler();
  }, [initAudio, runScheduler, playClick, onBeatChange]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (schedulerIdRef.current !== null) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    
    currentBeatIndexRef.current = 0;
    setCurrentBeat(1);
  }, []);

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

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
