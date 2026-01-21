import { TabNote } from '../components/TabDisplay';
import { FretboardNote } from '../components/Fretboard';

// Generate default exercise notes for common exercises
export const generateExerciseNotes = (exerciseId: string): TabNote[] => {
  // Default patterns for different exercise types
  const patterns: Record<string, TabNote[]> = {
    // Timing exercises - quarter notes on low E
    'timing-001': [
      { stringIndex: 5, fret: null, startBeat: 1, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 2, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 3, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 4, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 5, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 6, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 7, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 8, direction: 'down', isMute: true },
    ],
    // Eighth notes
    'timing-002': [
      { stringIndex: 5, fret: null, startBeat: 1, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 1.5, direction: 'up', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 2, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 2.5, direction: 'up', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 3, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 3.5, direction: 'up', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 4, direction: 'down', isMute: true },
      { stringIndex: 5, fret: null, startBeat: 4.5, direction: 'up', isMute: true },
    ],
    // Scale pattern - minor pentatonic box 1
    'scale-001': [
      { stringIndex: 5, fret: 5, startBeat: 1, direction: 'down' },
      { stringIndex: 5, fret: 8, startBeat: 2, direction: 'up' },
      { stringIndex: 4, fret: 5, startBeat: 3, direction: 'down' },
      { stringIndex: 4, fret: 7, startBeat: 4, direction: 'up' },
      { stringIndex: 3, fret: 5, startBeat: 5, direction: 'down' },
      { stringIndex: 3, fret: 7, startBeat: 6, direction: 'up' },
      { stringIndex: 2, fret: 5, startBeat: 7, direction: 'down' },
      { stringIndex: 2, fret: 8, startBeat: 8, direction: 'up' },
    ],
    // Picking exercise
    'pick-001': [
      { stringIndex: 0, fret: 5, startBeat: 1, direction: 'down' },
      { stringIndex: 0, fret: 5, startBeat: 2, direction: 'up' },
      { stringIndex: 0, fret: 5, startBeat: 3, direction: 'down' },
      { stringIndex: 0, fret: 5, startBeat: 4, direction: 'up' },
      { stringIndex: 0, fret: 5, startBeat: 5, direction: 'down' },
      { stringIndex: 0, fret: 5, startBeat: 6, direction: 'up' },
      { stringIndex: 0, fret: 5, startBeat: 7, direction: 'down' },
      { stringIndex: 0, fret: 5, startBeat: 8, direction: 'up' },
    ],
    // Chord - E major
    'chord-001': [
      { stringIndex: 0, fret: 0, startBeat: 1, direction: 'down' },
      { stringIndex: 1, fret: 0, startBeat: 1 },
      { stringIndex: 2, fret: 1, startBeat: 1 },
      { stringIndex: 3, fret: 2, startBeat: 1 },
      { stringIndex: 4, fret: 2, startBeat: 1 },
      { stringIndex: 5, fret: 0, startBeat: 1 },
      // Repeat
      { stringIndex: 0, fret: 0, startBeat: 3, direction: 'down' },
      { stringIndex: 1, fret: 0, startBeat: 3 },
      { stringIndex: 2, fret: 1, startBeat: 3 },
      { stringIndex: 3, fret: 2, startBeat: 3 },
      { stringIndex: 4, fret: 2, startBeat: 3 },
      { stringIndex: 5, fret: 0, startBeat: 3 },
    ],
    // Hammer-on
    'tech-001': [
      { stringIndex: 2, fret: 0, startBeat: 1, direction: 'down' },
      { stringIndex: 2, fret: 2, startBeat: 2, technique: 'H' },
      { stringIndex: 2, fret: 0, startBeat: 3, direction: 'down' },
      { stringIndex: 2, fret: 2, startBeat: 4, technique: 'H' },
      { stringIndex: 1, fret: 0, startBeat: 5, direction: 'down' },
      { stringIndex: 1, fret: 2, startBeat: 6, technique: 'H' },
      { stringIndex: 1, fret: 0, startBeat: 7, direction: 'down' },
      { stringIndex: 1, fret: 2, startBeat: 8, technique: 'H' },
    ],
    // Spider exercise
    'fret-001': [
      { stringIndex: 5, fret: 1, startBeat: 1, direction: 'down' },
      { stringIndex: 5, fret: 2, startBeat: 2, direction: 'up' },
      { stringIndex: 5, fret: 3, startBeat: 3, direction: 'down' },
      { stringIndex: 5, fret: 4, startBeat: 4, direction: 'up' },
      { stringIndex: 4, fret: 1, startBeat: 5, direction: 'down' },
      { stringIndex: 4, fret: 2, startBeat: 6, direction: 'up' },
      { stringIndex: 4, fret: 3, startBeat: 7, direction: 'down' },
      { stringIndex: 4, fret: 4, startBeat: 8, direction: 'up' },
    ],
  };

  // Return specific pattern or generate a default
  if (patterns[exerciseId]) {
    return patterns[exerciseId];
  }

  // Default pattern: simple scale fragment
  return [
    { stringIndex: 5, fret: 5, startBeat: 1, direction: 'down' },
    { stringIndex: 5, fret: 7, startBeat: 2, direction: 'up' },
    { stringIndex: 4, fret: 5, startBeat: 3, direction: 'down' },
    { stringIndex: 4, fret: 7, startBeat: 4, direction: 'up' },
    { stringIndex: 3, fret: 5, startBeat: 5, direction: 'down' },
    { stringIndex: 3, fret: 7, startBeat: 6, direction: 'up' },
    { stringIndex: 2, fret: 5, startBeat: 7, direction: 'down' },
    { stringIndex: 2, fret: 7, startBeat: 8, direction: 'up' },
  ];
};

// Convert TabNotes to FretboardNotes for display
export const tabNotesToFretboard = (tabNotes: TabNote[], currentBeat: number): {
  allNotes: FretboardNote[];
  currentNotes: FretboardNote[];
  previewNotes: FretboardNote[];
} => {
  const allNotes: FretboardNote[] = [];
  const currentNotes: FretboardNote[] = [];
  const previewNotes: FretboardNote[] = [];
  
  // Get unique notes (no duplicates for same string/fret)
  const seenNotes = new Set<string>();
  
  tabNotes.forEach(note => {
    const key = `${note.stringIndex}-${note.fret}`;
    const fretboardNote: FretboardNote = {
      stringIndex: note.stringIndex,
      fret: note.fret,
      isMute: note.isMute,
    };
    
    // Check if this note is current
    const beatDiff = note.startBeat - currentBeat;
    
    if (beatDiff >= -0.5 && beatDiff < 0.5) {
      // Current beat
      currentNotes.push({ ...fretboardNote, isActive: true });
    } else if (beatDiff >= 0.5 && beatDiff < 1.5) {
      // Next beat preview
      previewNotes.push({ ...fretboardNote, isPreview: true });
    }
    
    // Add to all notes (for static display)
    if (!seenNotes.has(key) && note.fret !== null && !note.isMute) {
      allNotes.push(fretboardNote);
      seenNotes.add(key);
    }
  });
  
  return { allNotes, currentNotes, previewNotes };
};

// Calculate optimal fretboard range for notes
export const calculateFretRange = (notes: TabNote[]): { startFret: number; numFrets: number } => {
  const frets = notes
    .filter(n => n.fret !== null && !n.isMute)
    .map(n => n.fret as number);
  
  if (frets.length === 0) {
    return { startFret: 0, numFrets: 5 };
  }
  
  const minFret = Math.min(...frets);
  const maxFret = Math.max(...frets);
  
  // Start 1 fret before minimum to give visual space
  let startFret = Math.max(0, minFret - 1);
  
  // Calculate range needed
  let numFrets = maxFret - startFret + 2;
  
  // Ensure at least 5 frets visible
  numFrets = Math.max(5, numFrets);
  
  // Cap at 8 frets for readability
  if (numFrets > 8) {
    numFrets = 8;
  }
  
  return { startFret, numFrets };
};
