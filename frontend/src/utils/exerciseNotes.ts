import { TabNote } from '../components/TabDisplay';
import { FretboardNote } from '../components/Fretboard';

/**
 * COMPLETE EXERCISE DATA FOR WEEKS 1-24
 * Standard fingering: 1=index, 2=middle, 3=ring, 4=pinky
 */

// Helper to create notes
const note = (
  stringIndex: number, 
  fret: number | null, 
  startBeat: number, 
  options?: { direction?: 'up' | 'down'; finger?: number; technique?: string; isMute?: boolean }
): TabNote => ({
  stringIndex,
  fret,
  startBeat,
  ...options,
});

// TIMING EXERCISES
const TIMING_EXERCISES: Record<string, TabNote[]> = {
  'timing-001': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 3, { direction: 'down', isMute: true }),
    note(5, null, 4, { direction: 'down', isMute: true }),
    note(5, null, 5, { direction: 'down', isMute: true }),
    note(5, null, 6, { direction: 'down', isMute: true }),
    note(5, null, 7, { direction: 'down', isMute: true }),
    note(5, null, 8, { direction: 'down', isMute: true }),
  ],
  'timing-002': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, null, 1.5, { direction: 'up', isMute: true }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 2.5, { direction: 'up', isMute: true }),
    note(5, null, 3, { direction: 'down', isMute: true }),
    note(5, null, 3.5, { direction: 'up', isMute: true }),
    note(5, null, 4, { direction: 'down', isMute: true }),
    note(5, null, 4.5, { direction: 'up', isMute: true }),
  ],
  'timing-003': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 3, { direction: 'down', isMute: true }),
    note(5, null, 4, { direction: 'down', isMute: true }),
    note(5, null, 5, { direction: 'down', isMute: true }),
    note(5, null, 6, { direction: 'down', isMute: true }),
    note(5, null, 7, { direction: 'down', isMute: true }),
    note(5, null, 8, { direction: 'down', isMute: true }),
  ],
  'timing-004': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, null, 1.5, { direction: 'up', isMute: true }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 2.5, { direction: 'up', isMute: true }),
    note(5, null, 3, { direction: 'down', isMute: true }),
    note(5, null, 3.5, { direction: 'up', isMute: true }),
    note(5, null, 4, { direction: 'down', isMute: true }),
    note(5, null, 4.5, { direction: 'up', isMute: true }),
  ],
  'timing-005': [
    note(5, null, 1.5, { direction: 'down', isMute: true }),
    note(5, null, 2.5, { direction: 'down', isMute: true }),
    note(5, null, 3.5, { direction: 'down', isMute: true }),
    note(5, null, 4.5, { direction: 'down', isMute: true }),
    note(5, null, 5.5, { direction: 'down', isMute: true }),
    note(5, null, 6.5, { direction: 'down', isMute: true }),
    note(5, null, 7.5, { direction: 'down', isMute: true }),
  ],
  'timing-006': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, null, 1.33, { isMute: true }),
    note(5, null, 1.67, { isMute: true }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 2.33, { isMute: true }),
    note(5, null, 2.67, { isMute: true }),
    note(5, null, 3, { direction: 'down', isMute: true }),
    note(5, null, 3.33, { isMute: true }),
  ],
};

// STRUMMING EXERCISES
const STRUMMING_EXERCISES: Record<string, TabNote[]> = {
  'strum-001': [
    note(5, 0, 1, { direction: 'down' }),
    note(4, 2, 1, { finger: 2 }),
    note(3, 2, 1, { finger: 3 }),
    note(2, 1, 1, { finger: 1 }),
    note(5, 0, 3, { direction: 'down' }),
    note(5, 0, 5, { direction: 'down' }),
    note(5, 0, 7, { direction: 'down' }),
  ],
  'strum-002': [
    note(5, 0, 1, { direction: 'down' }),
    note(0, 0, 1.5, { direction: 'up' }),
    note(5, 0, 2, { direction: 'down' }),
    note(0, 0, 2.5, { direction: 'up' }),
    note(5, 0, 3, { direction: 'down' }),
    note(0, 0, 3.5, { direction: 'up' }),
    note(5, 0, 4, { direction: 'down' }),
    note(0, 0, 4.5, { direction: 'up' }),
  ],
  'strum-003': [
    note(5, 0, 1, { direction: 'down' }),
    note(5, 0, 2, { direction: 'down' }),
    note(0, 0, 2.5, { direction: 'up' }),
    note(0, 0, 3, { direction: 'up' }),
    note(5, 0, 3.5, { direction: 'down' }),
    note(0, 0, 4, { direction: 'up' }),
    note(5, 0, 5, { direction: 'down' }),
    note(5, 0, 6, { direction: 'down' }),
  ],
  'strum-004': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(4, 7, 1, { finger: 3 }),
    note(5, 5, 2, { direction: 'down', finger: 1 }),
    note(5, 5, 3, { direction: 'down', finger: 1 }),
    note(5, 5, 4, { direction: 'down', finger: 1 }),
    note(5, 5, 5, { direction: 'down', finger: 1 }),
    note(4, 7, 5, { finger: 3 }),
    note(5, 5, 7, { direction: 'down', finger: 1 }),
  ],
  'strum-005': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, 0, 1.5, { direction: 'up' }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 2.5, { direction: 'up', isMute: true }),
    note(5, 0, 3, { direction: 'down' }),
    note(5, null, 3.5, { direction: 'up', isMute: true }),
    note(5, null, 4, { direction: 'down', isMute: true }),
    note(5, 0, 4.5, { direction: 'up' }),
  ],
  'strum-006': [
    note(5, 0, 1.5, { direction: 'up' }),
    note(5, 0, 2.5, { direction: 'up' }),
    note(5, 0, 3.5, { direction: 'up' }),
    note(5, 0, 4.5, { direction: 'up' }),
    note(5, 0, 5.5, { direction: 'up' }),
    note(5, 0, 6.5, { direction: 'up' }),
    note(5, 0, 7.5, { direction: 'up' }),
  ],
  'strum-007': [
    note(5, 0, 1, { direction: 'down' }),
    note(5, 0, 2, { direction: 'down' }),
    note(0, 0, 2.5, { direction: 'up' }),
    note(5, 0, 3, { direction: 'down' }),
    note(5, 0, 4, { direction: 'down' }),
    note(0, 0, 4.5, { direction: 'up' }),
    note(5, 0, 5, { direction: 'down' }),
    note(5, 0, 7, { direction: 'down' }),
  ],
};

// PICKING EXERCISES
const PICKING_EXERCISES: Record<string, TabNote[]> = {
  'pick-001': [
    note(0, 5, 1, { direction: 'down', finger: 1 }),
    note(0, 5, 2, { direction: 'up', finger: 1 }),
    note(0, 5, 3, { direction: 'down', finger: 1 }),
    note(0, 5, 4, { direction: 'up', finger: 1 }),
    note(0, 5, 5, { direction: 'down', finger: 1 }),
    note(0, 5, 6, { direction: 'up', finger: 1 }),
    note(0, 5, 7, { direction: 'down', finger: 1 }),
    note(0, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'pick-002': [
    note(0, 5, 1, { direction: 'down', finger: 1 }),
    note(1, 5, 2, { direction: 'up', finger: 1 }),
    note(0, 5, 3, { direction: 'down', finger: 1 }),
    note(1, 5, 4, { direction: 'up', finger: 1 }),
    note(0, 5, 5, { direction: 'down', finger: 1 }),
    note(1, 5, 6, { direction: 'up', finger: 1 }),
    note(0, 5, 7, { direction: 'down', finger: 1 }),
    note(1, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'pick-003': [
    note(0, 5, 1, { direction: 'down', finger: 1 }),
    note(1, 7, 2, { direction: 'up', finger: 3 }),
    note(0, 5, 3, { direction: 'down', finger: 1 }),
    note(1, 7, 4, { direction: 'up', finger: 3 }),
    note(0, 8, 5, { direction: 'down', finger: 4 }),
    note(1, 5, 6, { direction: 'up', finger: 1 }),
    note(0, 8, 7, { direction: 'down', finger: 4 }),
    note(1, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'pick-004': [
    note(1, 5, 1, { direction: 'down', finger: 1 }),
    note(0, 7, 2, { direction: 'up', finger: 3 }),
    note(1, 5, 3, { direction: 'down', finger: 1 }),
    note(0, 7, 4, { direction: 'up', finger: 3 }),
    note(1, 8, 5, { direction: 'down', finger: 4 }),
    note(0, 5, 6, { direction: 'up', finger: 1 }),
    note(1, 8, 7, { direction: 'down', finger: 4 }),
    note(0, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'pick-005': [
    note(2, 5, 1, { direction: 'down', finger: 1 }),
    note(2, 7, 2, { direction: 'up', finger: 3 }),
    note(1, 5, 3, { direction: 'down', finger: 1 }),
    note(1, 8, 4, { direction: 'up', finger: 4 }),
    note(0, 5, 5, { direction: 'down', finger: 1 }),
    note(0, 8, 6, { direction: 'up', finger: 4 }),
    note(1, 5, 7, { direction: 'down', finger: 1 }),
    note(2, 5, 8, { direction: 'down', finger: 1 }),
  ],
  'pick-006': [
    note(0, 5, 1, { direction: 'down', finger: 1 }),
    note(0, 5, 1.5, { direction: 'up', finger: 1 }),
    note(0, 5, 2, { direction: 'down', finger: 1 }),
    note(0, 5, 2.5, { direction: 'up', finger: 1 }),
    note(0, 5, 3, { direction: 'down', finger: 1 }),
    note(0, 5, 3.5, { direction: 'up', finger: 1 }),
    note(0, 5, 4, { direction: 'down', finger: 1 }),
    note(0, 5, 4.5, { direction: 'up', finger: 1 }),
  ],
  'pick-007': [
    note(4, 5, 1, { direction: 'down', finger: 1 }),
    note(1, 5, 2, { finger: 1 }),
    note(4, 7, 3, { direction: 'down', finger: 3 }),
    note(1, 5, 4, { finger: 1 }),
    note(4, 5, 5, { direction: 'down', finger: 1 }),
    note(0, 5, 6, { finger: 1 }),
    note(4, 7, 7, { direction: 'down', finger: 3 }),
    note(0, 5, 8, { finger: 1 }),
  ],
};

// FRETTING EXERCISES
const FRETTING_EXERCISES: Record<string, TabNote[]> = {
  'fret-001': [
    note(5, 1, 1, { direction: 'down', finger: 1 }),
    note(5, 2, 2, { direction: 'up', finger: 2 }),
    note(5, 3, 3, { direction: 'down', finger: 3 }),
    note(5, 4, 4, { direction: 'up', finger: 4 }),
    note(4, 1, 5, { direction: 'down', finger: 1 }),
    note(4, 2, 6, { direction: 'up', finger: 2 }),
    note(4, 3, 7, { direction: 'down', finger: 3 }),
    note(4, 4, 8, { direction: 'up', finger: 4 }),
  ],
  'fret-002': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 6, 2, { direction: 'up', finger: 2 }),
    note(5, 7, 3, { direction: 'down', finger: 3 }),
    note(5, 8, 4, { direction: 'up', finger: 4 }),
    note(4, 5, 5, { direction: 'down', finger: 1 }),
    note(4, 6, 6, { direction: 'up', finger: 2 }),
    note(4, 7, 7, { direction: 'down', finger: 3 }),
    note(4, 8, 8, { direction: 'up', finger: 4 }),
  ],
  'fret-003': [
    note(5, 1, 1, { direction: 'down', finger: 1 }),
    note(5, 5, 2, { direction: 'up', finger: 4 }),
    note(5, 1, 3, { direction: 'down', finger: 1 }),
    note(5, 5, 4, { direction: 'up', finger: 4 }),
    note(4, 1, 5, { direction: 'down', finger: 1 }),
    note(4, 5, 6, { direction: 'up', finger: 4 }),
    note(4, 1, 7, { direction: 'down', finger: 1 }),
    note(4, 5, 8, { direction: 'up', finger: 4 }),
  ],
  'fret-004': [
    note(5, 1, 1, { direction: 'down', finger: 1 }),
    note(5, 2, 2, { finger: 2 }),
    note(5, 3, 3, { finger: 3 }),
    note(5, 4, 4, { finger: 4 }),
    note(5, 5, 5, { direction: 'down', finger: 1 }),
    note(5, 6, 6, { finger: 2 }),
    note(5, 7, 7, { finger: 3 }),
    note(5, 8, 8, { finger: 4 }),
  ],
  'fret-005': [
    note(2, 5, 1, { direction: 'down', finger: 1 }),
    note(1, 5, 2, { finger: 1 }),
    note(0, 5, 3, { finger: 1 }),
    note(1, 5, 4, { finger: 1 }),
    note(2, 5, 5, { direction: 'down', finger: 1 }),
    note(1, 5, 6, { finger: 1 }),
    note(0, 5, 7, { finger: 1 }),
    note(1, 5, 8, { finger: 1 }),
  ],
};

// CHORD EXERCISES
const CHORD_EXERCISES: Record<string, TabNote[]> = {
  'chord-001': [
    note(5, 0, 1, { direction: 'down' }),
    note(4, 2, 1, { finger: 2 }),
    note(3, 2, 1, { finger: 3 }),
    note(2, 1, 1, { finger: 1 }),
    note(5, 0, 3, { direction: 'down' }),
    note(5, 0, 5, { direction: 'down' }),
    note(5, 0, 7, { direction: 'down' }),
  ],
  'chord-002': [
    note(4, 0, 1, { direction: 'down' }),
    note(3, 2, 1, { finger: 2 }),
    note(2, 2, 1, { finger: 3 }),
    note(1, 2, 1, { finger: 4 }),
    note(4, 0, 3, { direction: 'down' }),
    note(4, 0, 5, { direction: 'down' }),
    note(4, 0, 7, { direction: 'down' }),
  ],
  'chord-003': [
    note(3, 0, 1, { direction: 'down' }),
    note(2, 2, 1, { finger: 1 }),
    note(1, 3, 1, { finger: 3 }),
    note(0, 2, 1, { finger: 2 }),
    note(3, 0, 3, { direction: 'down' }),
    note(3, 0, 5, { direction: 'down' }),
    note(3, 0, 7, { direction: 'down' }),
  ],
  'chord-004': [
    note(5, 0, 1, { direction: 'down' }),
    note(4, 2, 1, { finger: 2 }),
    note(3, 2, 1, { finger: 3 }),
    note(2, 1, 1, { finger: 1 }),
    note(4, 0, 3, { direction: 'down' }),
    note(3, 2, 3, { finger: 2 }),
    note(3, 0, 5, { direction: 'down' }),
    note(2, 2, 5, { finger: 1 }),
    note(5, 0, 7, { direction: 'down' }),
  ],
  'chord-005': [
    note(4, 0, 1, { direction: 'down' }),
    note(3, 2, 1, { finger: 2 }),
    note(2, 2, 1, { finger: 3 }),
    note(1, 1, 1, { finger: 1 }),
    note(5, 0, 3, { direction: 'down' }),
    note(4, 2, 3, { finger: 2 }),
    note(3, 2, 3, { finger: 3 }),
    note(3, 0, 5, { direction: 'down' }),
    note(2, 2, 5, { finger: 2 }),
    note(4, 0, 7, { direction: 'down' }),
  ],
  'chord-006': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(4, 7, 1, { finger: 3 }),
    note(5, 5, 2, { direction: 'down', finger: 1 }),
    note(5, 7, 3, { direction: 'down', finger: 1 }),
    note(4, 9, 3, { finger: 3 }),
    note(5, 3, 5, { direction: 'down', finger: 1 }),
    note(4, 5, 5, { finger: 3 }),
    note(5, 5, 7, { direction: 'down', finger: 1 }),
  ],
  'chord-007': [
    note(5, 1, 1, { direction: 'down', finger: 1 }),
    note(4, 3, 1, { finger: 3 }),
    note(3, 3, 1, { finger: 4 }),
    note(2, 2, 1, { finger: 2 }),
    note(5, 1, 3, { direction: 'down' }),
    note(5, 1, 5, { direction: 'down' }),
    note(5, 1, 7, { direction: 'down' }),
  ],
  'chord-008': [
    note(4, 0, 1, { direction: 'down' }),
    note(3, 2, 1, { finger: 2 }),
    note(2, 0, 1, {}),
    note(1, 2, 1, { finger: 3 }),
    note(5, 0, 3, { direction: 'down' }),
    note(4, 2, 3, { finger: 2 }),
    note(3, 0, 5, { direction: 'down' }),
    note(2, 2, 5, { finger: 2 }),
    note(4, 0, 7, { direction: 'down' }),
  ],
  'chord-009': [
    note(2, 5, 1, { direction: 'down', finger: 2 }),
    note(1, 5, 1, { finger: 3 }),
    note(0, 3, 1, { finger: 1 }),
    note(2, 9, 3, { direction: 'down', finger: 3 }),
    note(1, 8, 3, { finger: 2 }),
    note(0, 8, 3, { finger: 1 }),
    note(2, 12, 5, { direction: 'down', finger: 1 }),
    note(1, 13, 5, { finger: 2 }),
    note(2, 5, 7, { direction: 'down', finger: 2 }),
  ],
};

// SCALE EXERCISES
const SCALE_EXERCISES: Record<string, TabNote[]> = {
  'scale-001': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 8, 2, { direction: 'up', finger: 4 }),
    note(4, 5, 3, { direction: 'down', finger: 1 }),
    note(4, 7, 4, { direction: 'up', finger: 3 }),
    note(3, 5, 5, { direction: 'down', finger: 1 }),
    note(3, 7, 6, { direction: 'up', finger: 3 }),
    note(2, 5, 7, { direction: 'down', finger: 1 }),
    note(2, 8, 8, { direction: 'up', finger: 4 }),
  ],
  'scale-002': [
    note(5, 8, 1, { direction: 'down', finger: 1 }),
    note(5, 10, 2, { direction: 'up', finger: 3 }),
    note(4, 7, 3, { direction: 'down', finger: 1 }),
    note(4, 10, 4, { direction: 'up', finger: 4 }),
    note(3, 7, 5, { direction: 'down', finger: 1 }),
    note(3, 9, 6, { direction: 'up', finger: 3 }),
    note(2, 8, 7, { direction: 'down', finger: 1 }),
    note(2, 10, 8, { direction: 'up', finger: 3 }),
  ],
  'scale-003': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 8, 2, { direction: 'up', finger: 4 }),
    note(4, 5, 3, { direction: 'down', finger: 1 }),
    note(4, 6, 4, { direction: 'up', finger: 2 }),
    note(4, 7, 5, { direction: 'down', finger: 3 }),
    note(3, 5, 6, { direction: 'up', finger: 1 }),
    note(3, 7, 7, { direction: 'down', finger: 3 }),
    note(2, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'scale-004': [
    note(5, 3, 1, { direction: 'down', finger: 2 }),
    note(5, 5, 2, { direction: 'up', finger: 4 }),
    note(4, 2, 3, { direction: 'down', finger: 1 }),
    note(4, 3, 4, { direction: 'up', finger: 2 }),
    note(4, 5, 5, { direction: 'down', finger: 4 }),
    note(3, 2, 6, { direction: 'up', finger: 1 }),
    note(3, 4, 7, { direction: 'down', finger: 3 }),
    note(3, 5, 8, { direction: 'up', finger: 4 }),
  ],
  'scale-005': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 7, 2, { direction: 'up', finger: 3 }),
    note(5, 8, 3, { direction: 'down', finger: 4 }),
    note(4, 5, 4, { direction: 'up', finger: 1 }),
    note(4, 7, 5, { direction: 'down', finger: 3 }),
    note(4, 8, 6, { direction: 'up', finger: 4 }),
    note(3, 5, 7, { direction: 'down', finger: 1 }),
    note(3, 7, 8, { direction: 'up', finger: 3 }),
  ],
  'scale-006': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 8, 2, { direction: 'up', finger: 4 }),
    note(4, 7, 3, { direction: 'down', finger: 3 }),
    note(4, 10, 4, { direction: 'up', finger: 1 }),
    note(3, 9, 5, { direction: 'down', finger: 3 }),
    note(3, 12, 6, { direction: 'up', finger: 1 }),
    note(2, 10, 7, { direction: 'down', finger: 3 }),
    note(2, 13, 8, { direction: 'up', finger: 1 }),
  ],
  'scale-007': [
    note(3, 0, 1, { direction: 'down' }),
    note(3, 2, 2, { direction: 'up', finger: 2 }),
    note(3, 3, 3, { direction: 'down', finger: 3 }),
    note(2, 0, 4, { direction: 'up' }),
    note(2, 2, 5, { direction: 'down', finger: 2 }),
    note(2, 3, 6, { direction: 'up', finger: 3 }),
    note(1, 0, 7, { direction: 'down' }),
    note(1, 2, 8, { direction: 'up', finger: 2 }),
  ],
};

// LEAD EXERCISES
const LEAD_EXERCISES: Record<string, TabNote[]> = {
  'lead-001': [
    note(1, 8, 1, { direction: 'down', finger: 4 }),
    note(1, 5, 2, { direction: 'up', finger: 1 }),
    note(1, 8, 3, { direction: 'down', finger: 4 }),
    note(1, 5, 5, { direction: 'up', finger: 1 }),
    note(1, 8, 7, { direction: 'down', finger: 4 }),
    note(1, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'lead-002': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 8, 2, { direction: 'up', finger: 4 }),
    note(4, 5, 3, { direction: 'down', finger: 1 }),
    note(4, 7, 4, { direction: 'up', finger: 3 }),
    note(4, 5, 5, { direction: 'down', finger: 1 }),
    note(4, 7, 6, { direction: 'up', finger: 3 }),
    note(3, 5, 7, { direction: 'down', finger: 1 }),
    note(3, 7, 8, { direction: 'up', finger: 3 }),
  ],
  'lead-003': [
    note(2, 7, 1, { direction: 'down', finger: 3, technique: 'B' }),
    note(2, 5, 2, { direction: 'up', finger: 1 }),
    note(1, 8, 3, { direction: 'down', finger: 4 }),
    note(1, 5, 4, { direction: 'up', finger: 1 }),
    note(2, 7, 5, { direction: 'down', finger: 3 }),
    note(2, 5, 6, { direction: 'up', finger: 1 }),
    note(3, 7, 7, { direction: 'down', finger: 3 }),
    note(3, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'lead-004': [
    note(4, 7, 1, { direction: 'down', finger: 3 }),
    note(3, 5, 2, { direction: 'up', finger: 1 }),
    note(3, 7, 3, { direction: 'down', finger: 3 }),
    note(2, 5, 4, { direction: 'up', finger: 1 }),
    note(4, 5, 5, { direction: 'down', finger: 1 }),
    note(3, 7, 6, { direction: 'up', finger: 3 }),
    note(3, 5, 7, { direction: 'down', finger: 1 }),
    note(4, 7, 8, { direction: 'up', finger: 3 }),
  ],
  'lead-005': [
    note(1, 8, 1, { direction: 'down', finger: 4 }),
    note(1, 5, 2, { direction: 'up', finger: 1 }),
    note(2, 5, 5, { direction: 'down', finger: 1 }),
    note(2, 8, 6, { direction: 'up', finger: 4 }),
    note(1, 5, 7, { direction: 'down', finger: 1 }),
  ],
  'lead-006': [
    note(0, 5, 1, { direction: 'down', finger: 1 }),
    note(0, 8, 1.5, { direction: 'up', finger: 4 }),
    note(1, 5, 2, { direction: 'down', finger: 1 }),
    note(1, 8, 2.5, { direction: 'up', finger: 4 }),
    note(2, 5, 3, { direction: 'down', finger: 1 }),
    note(2, 8, 3.5, { direction: 'up', finger: 4 }),
    note(1, 5, 4, { direction: 'down', finger: 1 }),
    note(0, 5, 4.5, { direction: 'up', finger: 1 }),
  ],
};

// TECHNIQUE EXERCISES
const TECHNIQUE_EXERCISES: Record<string, TabNote[]> = {
  'tech-001': [
    note(2, 0, 1, { direction: 'down' }),
    note(2, 2, 2, { finger: 2, technique: 'H' }),
    note(2, 0, 3, { direction: 'down' }),
    note(2, 2, 4, { finger: 2, technique: 'H' }),
    note(1, 0, 5, { direction: 'down' }),
    note(1, 2, 6, { finger: 2, technique: 'H' }),
    note(1, 0, 7, { direction: 'down' }),
    note(1, 2, 8, { finger: 2, technique: 'H' }),
  ],
  'tech-002': [
    note(2, 2, 1, { direction: 'down', finger: 2 }),
    note(2, 0, 2, { technique: 'P' }),
    note(2, 2, 3, { direction: 'down', finger: 2 }),
    note(2, 0, 4, { technique: 'P' }),
    note(1, 2, 5, { direction: 'down', finger: 2 }),
    note(1, 0, 6, { technique: 'P' }),
    note(1, 2, 7, { direction: 'down', finger: 2 }),
    note(1, 0, 8, { technique: 'P' }),
  ],
  'tech-003': [
    note(2, 5, 1, { direction: 'down', finger: 1 }),
    note(2, 7, 2, { finger: 1, technique: 'S' }),
    note(2, 5, 3, { direction: 'down', finger: 1 }),
    note(2, 7, 4, { finger: 1, technique: 'S' }),
    note(1, 5, 5, { direction: 'down', finger: 1 }),
    note(1, 8, 6, { finger: 1, technique: 'S' }),
    note(1, 5, 7, { direction: 'down', finger: 1 }),
    note(1, 8, 8, { finger: 1, technique: 'S' }),
  ],
  'tech-004': [
    note(1, 8, 1, { direction: 'down', finger: 4, technique: 'V' }),
    note(1, 8, 3, { direction: 'down', finger: 4, technique: 'V' }),
    note(2, 8, 5, { direction: 'down', finger: 4, technique: 'V' }),
    note(2, 8, 7, { direction: 'down', finger: 4, technique: 'V' }),
  ],
  'tech-005': [
    note(2, 7, 1, { direction: 'down', finger: 3, technique: 'B' }),
    note(2, 5, 3, { direction: 'up', finger: 1 }),
    note(2, 7, 5, { direction: 'down', finger: 3, technique: 'B' }),
    note(2, 5, 7, { direction: 'up', finger: 1 }),
  ],
  'tech-006': [
    note(5, 0, 1, { direction: 'down', technique: 'PM' }),
    note(5, 0, 2, { direction: 'down', technique: 'PM' }),
    note(5, 0, 3, { direction: 'down', technique: 'PM' }),
    note(5, 0, 4, { direction: 'down' }),
    note(5, 0, 5, { direction: 'down', technique: 'PM' }),
    note(5, 0, 6, { direction: 'down', technique: 'PM' }),
    note(5, 0, 7, { direction: 'down', technique: 'PM' }),
    note(5, 0, 8, { direction: 'down' }),
  ],
  'tech-007': [
    note(2, 5, 1, { direction: 'down', finger: 1 }),
    note(2, 7, 1.5, { finger: 3, technique: 'H' }),
    note(2, 5, 2, { finger: 1, technique: 'P' }),
    note(2, 5, 3, { direction: 'down', finger: 1 }),
    note(2, 7, 3.5, { finger: 3, technique: 'H' }),
    note(2, 5, 4, { finger: 1, technique: 'P' }),
    note(1, 5, 5, { direction: 'down', finger: 1 }),
    note(1, 8, 5.5, { finger: 4, technique: 'H' }),
  ],
  'tech-008': [
    note(2, 7, 1, { direction: 'down', finger: 3, technique: 'B' }),
    note(2, 7, 3, { finger: 3, technique: 'R' }),
    note(2, 7, 5, { direction: 'down', finger: 3, technique: 'B' }),
    note(2, 7, 7, { finger: 3, technique: 'R' }),
  ],
  'tech-009': [
    note(0, 12, 1, { finger: 1, technique: 'T' }),
    note(0, 5, 2, { finger: 1, technique: 'P' }),
    note(0, 8, 3, { finger: 4 }),
    note(0, 12, 4, { finger: 1, technique: 'T' }),
    note(0, 5, 5, { finger: 1, technique: 'P' }),
    note(0, 8, 6, { finger: 4 }),
    note(0, 12, 7, { finger: 1, technique: 'T' }),
    note(0, 5, 8, { finger: 1, technique: 'P' }),
  ],
};

// APPLICATION EXERCISES
const APPLICATION_EXERCISES: Record<string, TabNote[]> = {
  'app-001': [
    note(5, 0, 1, { direction: 'down' }),
    note(5, 0, 2, { direction: 'down' }),
    note(5, 0, 3, { direction: 'down' }),
    note(5, 0, 4, { direction: 'down' }),
    note(4, 0, 5, { direction: 'down' }),
    note(4, 0, 6, { direction: 'down' }),
    note(5, 0, 7, { direction: 'down' }),
    note(5, 0, 8, { direction: 'down' }),
  ],
  'app-002': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(4, 7, 1.5, { finger: 3 }),
    note(5, 5, 2, { direction: 'down', finger: 1 }),
    note(5, 3, 3, { direction: 'down', finger: 1 }),
    note(4, 5, 3.5, { finger: 3 }),
    note(5, 5, 4, { direction: 'down', finger: 1 }),
    note(5, 5, 5, { direction: 'down', finger: 1 }),
    note(4, 7, 5.5, { finger: 3 }),
  ],
  'app-003': [
    note(4, 0, 1, {}),
    note(2, 1, 1.5, { finger: 1 }),
    note(5, 0, 2, {}),
    note(1, 0, 2.5, {}),
    note(4, 0, 3, {}),
    note(2, 1, 3.5, { finger: 1 }),
    note(5, 0, 4, {}),
    note(0, 0, 4.5, {}),
  ],
  'app-004': [
    note(5, null, 1, { direction: 'down', isMute: true }),
    note(5, 5, 1.5, { direction: 'up', finger: 1 }),
    note(5, null, 2, { direction: 'down', isMute: true }),
    note(5, null, 2.5, { direction: 'up', isMute: true }),
    note(5, 5, 3, { direction: 'down', finger: 1 }),
    note(5, null, 3.5, { direction: 'up', isMute: true }),
    note(5, null, 4, { direction: 'down', isMute: true }),
    note(5, 5, 4.5, { direction: 'up', finger: 1 }),
  ],
  'app-005': [
    note(5, 3, 1, { direction: 'down', finger: 2 }),
    note(3, 0, 3, { direction: 'down' }),
    note(5, 0, 5, { direction: 'down' }),
    note(4, 3, 7, { direction: 'down', finger: 3 }),
  ],
};

// IMPROVISATION EXERCISES
const IMPROV_EXERCISES: Record<string, TabNote[]> = {
  'improv-001': [
    note(1, 8, 1, { direction: 'down', finger: 4 }),
    note(1, 8, 3, { direction: 'down', finger: 4 }),
    note(1, 8, 4, { direction: 'down', finger: 4 }),
    note(1, 8, 5, { direction: 'down', finger: 4 }),
    note(1, 8, 7, { direction: 'down', finger: 4 }),
  ],
  'improv-002': [
    note(1, 5, 1, { direction: 'down', finger: 1 }),
    note(1, 8, 2, { direction: 'up', finger: 4 }),
    note(2, 5, 3, { direction: 'down', finger: 1 }),
    note(1, 8, 4, { direction: 'up', finger: 4 }),
    note(1, 5, 5, { direction: 'down', finger: 1 }),
    note(2, 5, 6, { direction: 'up', finger: 1 }),
    note(1, 8, 7, { direction: 'down', finger: 4 }),
    note(1, 5, 8, { direction: 'up', finger: 1 }),
  ],
  'improv-003': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(4, 7, 2, { direction: 'up', finger: 3 }),
    note(3, 5, 3, { direction: 'down', finger: 1 }),
    note(2, 8, 4, { direction: 'up', finger: 4 }),
    note(1, 5, 5, { direction: 'down', finger: 1 }),
    note(1, 8, 6, { direction: 'up', finger: 4 }),
    note(2, 5, 7, { direction: 'down', finger: 1 }),
    note(3, 7, 8, { direction: 'up', finger: 3 }),
  ],
  'improv-004': [
    note(4, 7, 1, { direction: 'down', finger: 3 }),
    note(3, 5, 2, { finger: 1 }),
    note(2, 5, 3, { direction: 'down', finger: 1 }),
    note(2, 8, 4, { finger: 4 }),
    note(4, 5, 5, { direction: 'down', finger: 1 }),
    note(3, 7, 6, { finger: 3 }),
    note(4, 7, 7, { direction: 'down', finger: 3 }),
    note(3, 5, 8, { finger: 1 }),
  ],
  'improv-005': [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(4, 7, 2, { finger: 3 }),
    note(3, 9, 3, { direction: 'down', finger: 1 }),
    note(2, 10, 4, { finger: 3 }),
    note(1, 12, 5, { direction: 'down', finger: 1 }),
    note(0, 15, 6, { finger: 4 }),
    note(1, 12, 7, { direction: 'down', finger: 1 }),
    note(2, 10, 8, { finger: 3 }),
  ],
};

// MASTER MAP
const ALL_EXERCISES: Record<string, TabNote[]> = {
  ...TIMING_EXERCISES,
  ...STRUMMING_EXERCISES,
  ...PICKING_EXERCISES,
  ...FRETTING_EXERCISES,
  ...CHORD_EXERCISES,
  ...SCALE_EXERCISES,
  ...LEAD_EXERCISES,
  ...TECHNIQUE_EXERCISES,
  ...APPLICATION_EXERCISES,
  ...IMPROV_EXERCISES,
};

export const generateExerciseNotes = (exerciseId: string): TabNote[] => {
  if (ALL_EXERCISES[exerciseId]) {
    return ALL_EXERCISES[exerciseId];
  }
  // Default pattern
  return [
    note(5, 5, 1, { direction: 'down', finger: 1 }),
    note(5, 7, 2, { direction: 'up', finger: 3 }),
    note(4, 5, 3, { direction: 'down', finger: 1 }),
    note(4, 7, 4, { direction: 'up', finger: 3 }),
    note(3, 5, 5, { direction: 'down', finger: 1 }),
    note(3, 7, 6, { direction: 'up', finger: 3 }),
    note(2, 5, 7, { direction: 'down', finger: 1 }),
    note(2, 7, 8, { direction: 'up', finger: 3 }),
  ];
};

export const tabNotesToFretboard = (tabNotes: TabNote[], currentBeat: number): {
  allNotes: FretboardNote[];
  currentNotes: FretboardNote[];
} => {
  const allNotes: FretboardNote[] = [];
  const currentNotes: FretboardNote[] = [];
  const seenNotes = new Set<string>();
  
  tabNotes.forEach(n => {
    const key = `${n.stringIndex}-${n.fret}`;
    const fretboardNote: FretboardNote = {
      stringIndex: n.stringIndex,
      fret: n.fret,
      isMute: n.isMute,
      finger: n.finger,
    };
    
    const beatDiff = n.startBeat - currentBeat;
    if (beatDiff >= -0.5 && beatDiff < 0.5) {
      currentNotes.push({ ...fretboardNote, isActive: true });
    }
    
    if (!seenNotes.has(key) && n.fret !== null && !n.isMute) {
      allNotes.push(fretboardNote);
      seenNotes.add(key);
    }
  });
  
  return { allNotes, currentNotes };
};

export const calculateFretRange = (notes: TabNote[]): { startFret: number; numFrets: number } => {
  const frets = notes.filter(n => n.fret !== null && !n.isMute).map(n => n.fret as number);
  if (frets.length === 0) return { startFret: 0, numFrets: 5 };
  
  const minFret = Math.min(...frets);
  const maxFret = Math.max(...frets);
  let startFret = Math.max(0, minFret - 1);
  let numFrets = Math.max(5, maxFret - startFret + 2);
  if (numFrets > 8) numFrets = 8;
  
  return { startFret, numFrets };
};
