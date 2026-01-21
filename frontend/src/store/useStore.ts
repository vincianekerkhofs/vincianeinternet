import { create } from 'zustand';

interface Progress {
  current_week: number;
  current_day: number;
  streak_days: number;
  total_practice_minutes: number;
  completed_exercises: string[];
}

interface Settings {
  preferred_duration: number;
  metronome_enabled: boolean;
  onboarding_completed: boolean;
  guitar_type: string;
}

interface AppState {
  // Progress
  progress: Progress;
  setProgress: (progress: Progress) => void;
  
  // Settings
  settings: Settings;
  setSettings: (settings: Settings) => void;
  
  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Current practice
  currentExerciseId: string | null;
  setCurrentExercise: (id: string | null) => void;
  
  // Metronome
  bpm: number;
  setBpm: (bpm: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Progress
  progress: {
    current_week: 1,
    current_day: 1,
    streak_days: 0,
    total_practice_minutes: 0,
    completed_exercises: [],
  },
  setProgress: (progress) => set({ progress }),
  
  // Settings
  settings: {
    preferred_duration: 30,
    metronome_enabled: true,
    onboarding_completed: false,
    guitar_type: 'electric',
  },
  setSettings: (settings) => set({ settings }),
  
  // UI State
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  
  // Current practice
  currentExerciseId: null,
  setCurrentExercise: (currentExerciseId) => set({ currentExerciseId }),
  
  // Metronome
  bpm: 80,
  setBpm: (bpm) => set({ bpm }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
