/**
 * NOTE NAME UTILITIES
 * Dual naming system: Letter (A B C) ↔ Solfege (Do Re Mi)
 */

// Letter to Solfege mapping
export const NOTE_LETTER_TO_SOLFEGE: Record<string, string> = {
  'C': 'Do',
  'D': 'Re',
  'E': 'Mi',
  'F': 'Fa',
  'G': 'Sol',
  'A': 'La',
  'B': 'Si',
};

// Solfege to Letter mapping
export const NOTE_SOLFEGE_TO_LETTER: Record<string, string> = {
  'Do': 'C',
  'Re': 'D',
  'Mi': 'E',
  'Fa': 'F',
  'Sol': 'G',
  'La': 'A',
  'Si': 'B',
};

// Accidentals
export const ACCIDENTAL_NAMES: Record<string, string> = {
  '#': '#',    // Sharp stays the same
  'b': 'b',    // Flat stays the same
  '♯': '#',
  '♭': 'b',
};

/**
 * Parse a note name into base note and accidental
 * e.g., "F#" -> { base: "F", accidental: "#" }
 */
export function parseNoteName(note: string): { base: string; accidental: string } {
  const match = note.match(/^([A-Ga-g]|Do|Re|Mi|Fa|Sol|La|Si)(#|b|♯|♭)?$/i);
  if (!match) {
    return { base: note, accidental: '' };
  }
  return {
    base: match[1],
    accidental: match[2] || '',
  };
}

/**
 * Get the solfege name for a letter note
 * e.g., "C" -> "Do", "F#" -> "Fa#", "Bb" -> "Sib"
 */
export function letterToSolfege(letterNote: string): string {
  const { base, accidental } = parseNoteName(letterNote);
  const upperBase = base.toUpperCase();
  const solfege = NOTE_LETTER_TO_SOLFEGE[upperBase];
  if (!solfege) return letterNote; // Return original if not found
  return solfege + accidental;
}

/**
 * Get the letter name for a solfege note
 * e.g., "Do" -> "C", "Fa#" -> "F#", "Sib" -> "Bb"
 */
export function solfegeToLetter(solfegeNote: string): string {
  const { base, accidental } = parseNoteName(solfegeNote);
  // Capitalize first letter for solfege lookup
  const capitalBase = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
  const letter = NOTE_SOLFEGE_TO_LETTER[capitalBase];
  if (!letter) return solfegeNote; // Return original if not found
  return letter + accidental;
}

/**
 * Get dual note name format: "C (Do)" or "F# (Fa#)"
 */
export function getDualNoteName(note: string, format: 'letter-first' | 'solfege-first' = 'letter-first'): string {
  const { base, accidental } = parseNoteName(note);
  const upperBase = base.toUpperCase();
  
  // Check if it's already in letter format
  const isLetter = /^[A-G]$/i.test(base);
  
  if (isLetter) {
    const solfege = letterToSolfege(note);
    return format === 'letter-first' 
      ? `${upperBase}${accidental} (${solfege})`
      : `${solfege} (${upperBase}${accidental})`;
  } else {
    // It's solfege, convert to letter
    const letter = solfegeToLetter(note);
    return format === 'letter-first'
      ? `${letter} (${note})`
      : `${note} (${letter})`;
  }
}

/**
 * Get compact dual note name for fretboard labels: "C/Do" or "F#/Fa#"
 */
export function getCompactDualName(note: string): string {
  const { base, accidental } = parseNoteName(note);
  const upperBase = base.toUpperCase();
  
  const isLetter = /^[A-G]$/i.test(base);
  
  if (isLetter) {
    const solfege = letterToSolfege(note);
    return `${upperBase}${accidental}/${solfege}`;
  } else {
    const letter = solfegeToLetter(note);
    return `${letter}/${note}`;
  }
}

/**
 * Standard tuning notes for each string (from string 1 to 6)
 * String 1 = High E, String 6 = Low E
 */
export const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];
export const STANDARD_TUNING_SOLFEGE = ['Mi', 'Si', 'Sol', 'Re', 'La', 'Mi'];
export const STANDARD_TUNING_DUAL = ['E/Mi', 'B/Si', 'G/Sol', 'D/Re', 'A/La', 'E/Mi'];

/**
 * Get the note at a specific fret on a specific string
 * @param stringNum 1-6 (1 = high E, 6 = low E)
 * @param fret 0-24
 */
export function getNoteAtFret(stringNum: number, fret: number): string {
  const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const openNotes = [4, 11, 7, 2, 9, 4]; // E, B, G, D, A, E as indices in CHROMATIC
  
  const stringIndex = stringNum - 1;
  if (stringIndex < 0 || stringIndex > 5) return '';
  
  const noteIndex = (openNotes[stringIndex] + fret) % 12;
  return CHROMATIC[noteIndex];
}

/**
 * Get dual name for a note at specific position
 */
export function getDualNoteAtFret(stringNum: number, fret: number): string {
  const note = getNoteAtFret(stringNum, fret);
  return getDualNoteName(note);
}

/**
 * Complete note mapping reference for info modal
 */
export const NOTE_MAPPING_REFERENCE = [
  { letter: 'C', solfege: 'Do', spanish: 'Do' },
  { letter: 'C#/Db', solfege: 'Do#/Reb', spanish: 'Do sostenido / Re bemol' },
  { letter: 'D', solfege: 'Re', spanish: 'Re' },
  { letter: 'D#/Eb', solfege: 'Re#/Mib', spanish: 'Re sostenido / Mi bemol' },
  { letter: 'E', solfege: 'Mi', spanish: 'Mi' },
  { letter: 'F', solfege: 'Fa', spanish: 'Fa' },
  { letter: 'F#/Gb', solfege: 'Fa#/Solb', spanish: 'Fa sostenido / Sol bemol' },
  { letter: 'G', solfege: 'Sol', spanish: 'Sol' },
  { letter: 'G#/Ab', solfege: 'Sol#/Lab', spanish: 'Sol sostenido / La bemol' },
  { letter: 'A', solfege: 'La', spanish: 'La' },
  { letter: 'A#/Bb', solfege: 'La#/Sib', spanish: 'La sostenido / Si bemol' },
  { letter: 'B', solfege: 'Si', spanish: 'Si' },
];

/**
 * Chord name to Spanish name mapping
 */
export const CHORD_NAME_SPANISH: Record<string, string> = {
  'C': 'Do Mayor',
  'Cm': 'Do menor',
  'C7': 'Do 7',
  'Cmaj7': 'Do Maj7',
  'Cm7': 'Do m7',
  'D': 'Re Mayor',
  'Dm': 'Re menor',
  'D7': 'Re 7',
  'E': 'Mi Mayor',
  'Em': 'Mi menor',
  'E7': 'Mi 7',
  'F': 'Fa Mayor',
  'Fm': 'Fa menor',
  'F7': 'Fa 7',
  'G': 'Sol Mayor',
  'Gm': 'Sol menor',
  'G7': 'Sol 7',
  'A': 'La Mayor',
  'Am': 'La menor',
  'A7': 'La 7',
  'B': 'Si Mayor',
  'Bm': 'Si menor',
  'B7': 'Si 7',
  'Bb': 'Sib Mayor',
  'Bbm': 'Sib menor',
};

/**
 * Get Spanish name for a chord
 */
export function getChordSpanishName(chord: string): string {
  return CHORD_NAME_SPANISH[chord] || chord;
}
