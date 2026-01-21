import { TabNote } from '../components/TabDisplay';
import { FretboardNote } from '../components/Fretboard';

/**
 * Standard fingering logic:
 * - Finger 1 (index) for lowest fret in position
 * - Finger 2 (middle) for second fret
 * - Finger 3 (ring) for third fret  
 * - Finger 4 (pinky) for fourth fret
 * 
 * For pentatonic box 1 (starting fret 5):
 * - Fret 5 = finger 1
 * - Fret 7 = finger 3
 * - Fret 8 = finger 4
 */

// Calculate standard fingering based on fret position
const getFingerForFret = (fret: number | null, positionBaseFret: number): number | undefined => {
  if (fret === null) return undefined;
  
  const offset = fret - positionBaseFret;
  
  // Standard 4-fret position fingering
  if (offset === 0) return 1;
  if (offset === 1) return 2;
  if (offset === 2) return 3;
  if (offset === 3) return 4;
  
  // Extended position
  if (offset === 4) return 4; // Pinky stretch
  if (offset < 0) return 1;   // Index reach back
  
  return undefined;
};

// Generate default exercise notes for common exercises
export const generateExerciseNotes = (exerciseId: string): TabNote[] => {
  const patterns: Record<string, TabNote[]> = {
    // Timing exercises - quarter notes on low E (muted, no fingering needed)
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
    
    // Eighth notes (muted)
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
    
    // Scale pattern - minor pentatonic box 1 (position 5)
    // Fingering: fret 5=1, 7=3, 8=4
    'scale-001': [
      { stringIndex: 5, fret: 5, startBeat: 1, direction: 'down', finger: 1 },
      { stringIndex: 5, fret: 8, startBeat: 2, direction: 'up', finger: 4 },
      { stringIndex: 4, fret: 5, startBeat: 3, direction: 'down', finger: 1 },
      { stringIndex: 4, fret: 7, startBeat: 4, direction: 'up', finger: 3 },
      { stringIndex: 3, fret: 5, startBeat: 5, direction: 'down', finger: 1 },
      { stringIndex: 3, fret: 7, startBeat: 6, direction: 'up', finger: 3 },
      { stringIndex: 2, fret: 5, startBeat: 7, direction: 'down', finger: 1 },
      { stringIndex: 2, fret: 8, startBeat: 8, direction: 'up', finger: 4 },
    ],
    
    // Picking exercise - single note at fret 5 (finger 1)
    'pick-001': [
      { stringIndex: 0, fret: 5, startBeat: 1, direction: 'down', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 2, direction: 'up', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 3, direction: 'down', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 4, direction: 'up', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 5, direction: 'down', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 6, direction: 'up', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 7, direction: 'down', finger: 1 },
      { stringIndex: 0, fret: 5, startBeat: 8, direction: 'up', finger: 1 },
    ],
    
    // Chord - E major (open position)
    // Fingering: G string fret 1 = finger 1, A string fret 2 = finger 2, D string fret 2 = finger 3
    'chord-001': [
      { stringIndex: 0, fret: 0, startBeat: 1, direction: 'down' }, // open e
      { stringIndex: 1, fret: 0, startBeat: 1 }, // open B
      { stringIndex: 2, fret: 1, startBeat: 1, finger: 1 }, // G string fret 1
      { stringIndex: 3, fret: 2, startBeat: 1, finger: 3 }, // D string fret 2
      { stringIndex: 4, fret: 2, startBeat: 1, finger: 2 }, // A string fret 2
      { stringIndex: 5, fret: 0, startBeat: 1 }, // open E
      // Repeat
      { stringIndex: 0, fret: 0, startBeat: 3, direction: 'down' },
      { stringIndex: 1, fret: 0, startBeat: 3 },
      { stringIndex: 2, fret: 1, startBeat: 3, finger: 1 },
      { stringIndex: 3, fret: 2, startBeat: 3, finger: 3 },
      { stringIndex: 4, fret: 2, startBeat: 3, finger: 2 },
      { stringIndex: 5, fret: 0, startBeat: 3 },
      // More strums
      { stringIndex: 0, fret: 0, startBeat: 5, direction: 'down' },
      { stringIndex: 0, fret: 0, startBeat: 7, direction: 'down' },
    ],
    
    // Hammer-on exercise - open to fret 2 (finger 2)
    'tech-001': [
      { stringIndex: 2, fret: 0, startBeat: 1, direction: 'down' },
      { stringIndex: 2, fret: 2, startBeat: 2, technique: 'H', finger: 2 },
      { stringIndex: 2, fret: 0, startBeat: 3, direction: 'down' },
      { stringIndex: 2, fret: 2, startBeat: 4, technique: 'H', finger: 2 },
      { stringIndex: 1, fret: 0, startBeat: 5, direction: 'down' },
      { stringIndex: 1, fret: 2, startBeat: 6, technique: 'H', finger: 2 },
      { stringIndex: 1, fret: 0, startBeat: 7, direction: 'down' },
      { stringIndex: 1, fret: 2, startBeat: 8, technique: 'H', finger: 2 },
    ],
    
    // Spider/chromatic exercise - 1-2-3-4 fingering
    'fret-001': [
      { stringIndex: 5, fret: 1, startBeat: 1, direction: 'down', finger: 1 },
      { stringIndex: 5, fret: 2, startBeat: 2, direction: 'up', finger: 2 },
      { stringIndex: 5, fret: 3, startBeat: 3, direction: 'down', finger: 3 },
      { stringIndex: 5, fret: 4, startBeat: 4, direction: 'up', finger: 4 },
      { stringIndex: 4, fret: 1, startBeat: 5, direction: 'down', finger: 1 },
      { stringIndex: 4, fret: 2, startBeat: 6, direction: 'up', finger: 2 },
      { stringIndex: 4, fret: 3, startBeat: 7, direction: 'down', finger: 3 },
      { stringIndex: 4, fret: 4, startBeat: 8, direction: 'up', finger: 4 },
    ],
    
    // Spider walk exercise 
    'fret-002': [
      { stringIndex: 5, fret: 5, startBeat: 1, direction: 'down', finger: 1 },
      { stringIndex: 5, fret: 6, startBeat: 2, direction: 'up', finger: 2 },
      { stringIndex: 5, fret: 7, startBeat: 3, direction: 'down', finger: 3 },
      { stringIndex: 5, fret: 8, startBeat: 4, direction: 'up', finger: 4 },
      { stringIndex: 4, fret: 5, startBeat: 5, direction: 'down', finger: 1 },
      { stringIndex: 4, fret: 6, startBeat: 6, direction: 'up', finger: 2 },
      { stringIndex: 4, fret: 7, startBeat: 7, direction: 'down', finger: 3 },
      { stringIndex: 4, fret: 8, startBeat: 8, direction: 'up', finger: 4 },
    ],
  };

  if (patterns[exerciseId]) {
    return patterns[exerciseId];
  }

  // Default pattern with standard fingering
  return [
    { stringIndex: 5, fret: 5, startBeat: 1, direction: 'down', finger: 1 },
    { stringIndex: 5, fret: 7, startBeat: 2, direction: 'up', finger: 3 },
    { stringIndex: 4, fret: 5, startBeat: 3, direction: 'down', finger: 1 },
    { stringIndex: 4, fret: 7, startBeat: 4, direction: 'up', finger: 3 },
    { stringIndex: 3, fret: 5, startBeat: 5, direction: 'down', finger: 1 },
    { stringIndex: 3, fret: 7, startBeat: 6, direction: 'up', finger: 3 },
    { stringIndex: 2, fret: 5, startBeat: 7, direction: 'down', finger: 1 },
    { stringIndex: 2, fret: 7, startBeat: 8, direction: 'up', finger: 3 },
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
  
  const seenNotes = new Set<string>();
  
  tabNotes.forEach(note => {
    const key = `${note.stringIndex}-${note.fret}`;
    const fretboardNote: FretboardNote = {
      stringIndex: note.stringIndex,
      fret: note.fret,
      isMute: note.isMute,
      finger: note.finger,
    };
    
    const beatDiff = note.startBeat - currentBeat;
    
    if (beatDiff >= -0.5 && beatDiff < 0.5) {
      currentNotes.push({ ...fretboardNote, isActive: true });
    } else if (beatDiff >= 0.5 && beatDiff < 1.5) {
      previewNotes.push({ ...fretboardNote, isPreview: true });
    }
    
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
  
  let startFret = Math.max(0, minFret - 1);
  let numFrets = maxFret - startFret + 2;
  numFrets = Math.max(5, numFrets);
  
  if (numFrets > 8) {
    numFrets = 8;
  }
  
  return { startFret, numFrets };
};
