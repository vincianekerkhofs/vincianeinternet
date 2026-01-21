import { useRef, useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { TabNote } from '../components/TabDisplay';

interface PlaybackEngineOptions {
  bpm: number;
  totalBeats: number;
  loop: boolean;
  metronomeEnabled: boolean;
  backingTrackEnabled: boolean;
  volume?: number;
  onBeatChange?: (beat: number) => void;
  onLoopComplete?: () => void;
  onDemoComplete?: () => void;
}

// Guitar string frequencies (standard tuning)
const STRING_FREQUENCIES = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41]; // e, B, G, D, A, E

/**
 * Enhanced Playback Engine with:
 * - Real-time BPM changes
 * - Backing track (drums + bass)
 * - Demo playback
 * - Guitar note synthesis
 */
export const usePlaybackEngine = (options: PlaybackEngineOptions) => {
  const {
    bpm,
    totalBeats,
    loop,
    metronomeEnabled,
    backingTrackEnabled,
    volume = 0.5,
    onBeatChange,
    onLoopComplete,
    onDemoComplete,
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [audioReady, setAudioReady] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const isDemoPlayingRef = useRef<boolean>(false);
  const metronomeEnabledRef = useRef<boolean>(metronomeEnabled);
  const backingTrackEnabledRef = useRef<boolean>(backingTrackEnabled);
  const bpmRef = useRef<number>(bpm);
  const demoNotesRef = useRef<TabNote[]>([]);
  
  // Beat tracking
  const currentBeatIndexRef = useRef<number>(0);
  const lastBeatTimeRef = useRef<number>(0);
  const lastScheduledBeatRef = useRef<number>(-1);
  
  // Backing track nodes
  const bassOscRef = useRef<OscillatorNode | null>(null);
  const bassGainRef = useRef<GainNode | null>(null);
  
  // Keep refs in sync
  useEffect(() => {
    metronomeEnabledRef.current = metronomeEnabled;
  }, [metronomeEnabled]);
  
  useEffect(() => {
    backingTrackEnabledRef.current = backingTrackEnabled;
  }, [backingTrackEnabled]);
  
  useEffect(() => {
    bpmRef.current = bpm;
    if (isPlayingRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      lastBeatTimeRef.current = now;
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

  // Play metronome click
  const playClick = useCallback((time: number, isAccent: boolean = false) => {
    if (!audioContextRef.current || !metronomeEnabledRef.current) return;

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
      const clickVolume = volume * 0.3 * (isAccent ? 1 : 0.7);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(clickVolume, time + attackTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + attackTime + decayTime);
      
      osc.start(time);
      osc.stop(time + attackTime + decayTime + 0.01);
    } catch (e) {}
  }, [volume]);

  // Play kick drum
  const playKick = useCallback((time: number) => {
    if (!audioContextRef.current || !backingTrackEnabledRef.current) return;

    const ctx = audioContextRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
      osc.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.6, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      
      osc.start(time);
      osc.stop(time + 0.2);
    } catch (e) {}
  }, [volume]);

  // Play hi-hat
  const playHiHat = useCallback((time: number, isOpen: boolean = false) => {
    if (!audioContextRef.current || !backingTrackEnabledRef.current) return;

    const ctx = audioContextRef.current;
    
    try {
      // Create noise
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      // High-pass filter for hi-hat sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      
      const gainNode = ctx.createGain();
      
      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const decay = isOpen ? 0.15 : 0.05;
      gainNode.gain.setValueAtTime(volume * 0.15, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + decay);
      
      noise.start(time);
      noise.stop(time + decay);
    } catch (e) {}
  }, [volume]);

  // Play guitar note (for demo)
  const playGuitarNote = useCallback((time: number, stringIndex: number, fret: number, duration: number = 0.5) => {
    if (!audioContextRef.current || fret === null) return;

    const ctx = audioContextRef.current;
    
    try {
      const baseFreq = STRING_FREQUENCIES[stringIndex];
      const freq = baseFreq * Math.pow(2, fret / 12);
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Add slight distortion for guitar sound
      const distortion = ctx.createWaveShaper();
      const curve = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        const x = (i - 128) / 128;
        curve[i] = Math.tanh(x * 2);
      }
      distortion.curve = curve;
      
      osc.connect(distortion);
      distortion.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sawtooth';
      
      // Guitar-like envelope
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(volume * 0.4, time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.2, time + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
      
      osc.start(time);
      osc.stop(time + duration + 0.01);
    } catch (e) {}
  }, [volume]);

  // Start bass pad
  const startBassPad = useCallback(() => {
    if (!audioContextRef.current || !backingTrackEnabledRef.current) return;
    
    const ctx = audioContextRef.current;
    
    try {
      // Stop existing bass
      if (bassOscRef.current) {
        bassOscRef.current.stop();
        bassOscRef.current = null;
      }
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      filter.type = 'lowpass';
      filter.frequency.value = 200;
      
      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.frequency.value = 82.41; // Low E
      osc.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
      
      bassOscRef.current = osc;
      bassGainRef.current = gainNode;
      
      osc.start();
    } catch (e) {}
  }, [volume]);

  // Stop bass pad
  const stopBassPad = useCallback(() => {
    if (bassOscRef.current && bassGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      bassGainRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      setTimeout(() => {
        if (bassOscRef.current) {
          bassOscRef.current.stop();
          bassOscRef.current = null;
        }
      }, 150);
    }
  }, []);

  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx ? ctx.currentTime : (Date.now() / 1000);
    
    const currentBpm = bpmRef.current;
    const secondsPerBeat = 60.0 / currentBpm;
    const scheduleAheadTime = 0.15;
    const lookaheadMs = 25;
    
    const timeSinceLastBeat = now - lastBeatTimeRef.current;
    
    if (timeSinceLastBeat >= secondsPerBeat) {
      currentBeatIndexRef.current++;
      lastBeatTimeRef.current = now;
      
      if (currentBeatIndexRef.current > totalBeats) {
        if (loop && !isDemoPlayingRef.current) {
          currentBeatIndexRef.current = 1;
          lastScheduledBeatRef.current = 0;
          onLoopComplete?.();
        } else if (isDemoPlayingRef.current) {
          stopDemo();
          onDemoComplete?.();
          return;
        } else {
          stop();
          return;
        }
      }
      
      const displayBeat = currentBeatIndexRef.current;
      setCurrentBeat(displayBeat);
      onBeatChange?.(displayBeat);
    }
    
    // Schedule audio events
    if (ctx) {
      const nextBeatTime = lastBeatTimeRef.current + secondsPerBeat;
      const beatNum = currentBeatIndexRef.current;
      
      if (nextBeatTime < now + scheduleAheadTime && 
          beatNum !== lastScheduledBeatRef.current) {
        
        // Metronome
        const isAccent = (beatNum - 1) % 4 === 0;
        playClick(nextBeatTime, isAccent);
        
        // Drums (basic rock pattern)
        if (backingTrackEnabledRef.current) {
          const beatInBar = ((beatNum - 1) % 4) + 1;
          if (beatInBar === 1 || beatInBar === 3) {
            playKick(nextBeatTime);
          }
          playHiHat(nextBeatTime, beatInBar === 4);
        }
        
        // Demo notes
        if (isDemoPlayingRef.current && demoNotesRef.current.length > 0) {
          demoNotesRef.current.forEach(note => {
            if (Math.floor(note.startBeat) === beatNum && note.fret !== null && !note.isMute) {
              playGuitarNote(nextBeatTime, note.stringIndex, note.fret);
            }
          });
        }
        
        lastScheduledBeatRef.current = beatNum;
      }
    }
    
    schedulerIdRef.current = window.setTimeout(runScheduler, lookaheadMs);
  }, [totalBeats, loop, playClick, playKick, playHiHat, playGuitarNote, onBeatChange, onLoopComplete, onDemoComplete]);

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
    
    // Start backing track
    if (backingTrackEnabledRef.current) {
      startBassPad();
    }
    
    // Play first click immediately
    if (ctx && metronomeEnabledRef.current) {
      playClick(now + 0.05, true);
      lastScheduledBeatRef.current = 1;
    }
    
    runScheduler();
  }, [initAudio, runScheduler, playClick, startBassPad, onBeatChange]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    isDemoPlayingRef.current = false;
    setIsPlaying(false);
    setIsDemoPlaying(false);
    
    if (schedulerIdRef.current !== null) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    
    stopBassPad();
    
    currentBeatIndexRef.current = 0;
    setCurrentBeat(1);
  }, [stopBassPad]);

  const toggle = useCallback(() => {
    if (isPlayingRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

  // Play demo with exercise notes
  const playDemo = useCallback(async (notes: TabNote[], slowMode: boolean = false) => {
    await initAudio();
    
    const ctx = audioContextRef.current;
    const now = ctx ? ctx.currentTime : (Date.now() / 1000);
    
    demoNotesRef.current = notes;
    
    // Slow mode plays at 60% speed
    if (slowMode) {
      bpmRef.current = Math.round(bpmRef.current * 0.6);
    }
    
    currentBeatIndexRef.current = 1;
    lastBeatTimeRef.current = now;
    lastScheduledBeatRef.current = 0;
    isPlayingRef.current = true;
    isDemoPlayingRef.current = true;
    
    setIsPlaying(true);
    setIsDemoPlaying(true);
    setCurrentBeat(1);
    onBeatChange?.(1);
    
    if (backingTrackEnabledRef.current) {
      startBassPad();
    }
    
    runScheduler();
  }, [initAudio, runScheduler, startBassPad, onBeatChange]);

  const stopDemo = useCallback(() => {
    isDemoPlayingRef.current = false;
    setIsDemoPlaying(false);
    stop();
  }, [stop]);

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      isDemoPlayingRef.current = false;
      if (schedulerIdRef.current !== null) {
        clearTimeout(schedulerIdRef.current);
      }
      stopBassPad();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopBassPad]);

  return {
    isPlaying,
    isDemoPlaying,
    currentBeat,
    audioReady,
    needsUserInteraction,
    start,
    stop,
    toggle,
    playDemo,
    stopDemo,
    initAudio,
  };
};
