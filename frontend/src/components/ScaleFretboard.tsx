import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale patterns: s = string index (0=high e, 5=low E), f = fret offset from startFret
const SCALES: Record<string, { 
  name: string; 
  start: number; 
  notes: { s: number; f: number; finger: number; root?: boolean }[] 
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica',
    start: 5,
    notes: [
      // high e string (index 0)
      { s: 0, f: 0, finger: 1, root: true }, { s: 0, f: 3, finger: 4 },
      // B string (index 1)
      { s: 1, f: 0, finger: 1 }, { s: 1, f: 3, finger: 4 },
      // G string (index 2)
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      // D string (index 3)
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 },
      // A string (index 4) - root on fret 5
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 2, finger: 3 },
      // low E string (index 5) - root on fret 5
      { s: 5, f: 0, finger: 1, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
  'Am_blues': {
    name: 'Am Blues',
    start: 5,
    notes: [
      { s: 0, f: 0, finger: 1, root: true }, { s: 0, f: 3, finger: 4 },
      { s: 1, f: 0, finger: 1 }, { s: 1, f: 3, finger: 4 },
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 },
      // Blue note on A string (fret 6 = offset 1)
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 1, finger: 2 }, { s: 4, f: 2, finger: 3 },
      { s: 5, f: 0, finger: 1, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
  'C_major_box1': {
    name: 'Do Mayor',
    start: 7,
    notes: [
      { s: 0, f: 0, finger: 1 }, { s: 0, f: 1, finger: 2, root: true }, { s: 0, f: 3, finger: 4 },
      { s: 1, f: 1, finger: 1, root: true }, { s: 1, f: 3, finger: 3 },
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 }, { s: 3, f: 3, finger: 4, root: true },
      { s: 4, f: 0, finger: 1 }, { s: 4, f: 1, finger: 2 }, { s: 4, f: 3, finger: 4 },
      { s: 5, f: 0, finger: 1 }, { s: 5, f: 1, finger: 2, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
};

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const NUM_FRETS = 4;
const NUM_STRINGS = 6;

const COLORS_THEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  FRETBOARD_BG: '#1E1810',
  FRET_WIRE: '#5A5A5A',
  NUT: '#D4D4D4',
  STRING_NORMAL: '#B8977E',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  width = SCREEN_WIDTH - 32,
  height = 280,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  
  if (!scale) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  // Build lookup: "stringIndex-fretOffset" -> note data
  const noteMap = new Map<string, { finger: number; root?: boolean }>();
  scale.notes.forEach(note => {
    noteMap.set(`${note.s}-${note.f}`, { finger: note.finger, root: note.root });
  });

  // Check if string has any root note
  const stringHasRoot = (stringIdx: number) => 
    scale.notes.some(n => n.s === stringIdx && n.root);

  // Layout calculations
  const fretboardPadding = 8;
  const fretLabelWidth = 28;
  const stringLabelHeight = 36;
  const availableWidth = width - fretLabelWidth - fretboardPadding * 2;
  const availableHeight = height - stringLabelHeight - 60; // Space for legend
  const fretWidth = availableWidth / NUM_FRETS;
  const stringHeight = availableHeight / NUM_STRINGS;

  // Render string name indicators at top
  const renderStringLabels = () => (
    <View style={[styles.stringLabelsRow, { marginLeft: fretLabelWidth }]}>
      {STRING_NAMES.map((name, idx) => {
        const isRoot = stringHasRoot(idx);
        return (
          <View 
            key={`str-label-${idx}`}
            style={[
              styles.stringLabel,
              { 
                width: availableWidth / NUM_STRINGS,
                backgroundColor: isRoot ? COLORS_THEME.ROOT : COLORS_THEME.NOTE,
              }
            ]}
          >
            <Text style={styles.stringLabelText}>{name}</Text>
          </View>
        );
      })}
    </View>
  );

  // Render fretboard: each row is a fret, each column is a string position
  const renderFretboard = () => {
    const fretRows = [];
    
    for (let fretOffset = 0; fretOffset < NUM_FRETS; fretOffset++) {
      const fretNumber = scale.start + fretOffset;
      const isNut = fretOffset === 0 && scale.start <= 1;
      
      const stringCells = [];
      for (let strIdx = 0; strIdx < NUM_STRINGS; strIdx++) {
        const noteKey = `${strIdx}-${fretOffset}`;
        const noteData = noteMap.get(noteKey);
        const hasNote = !!noteData;
        const isRoot = noteData?.root === true;
        const finger = noteData?.finger;
        const stringThickness = 1.5 + strIdx * 0.4;
        
        stringCells.push(
          <View 
            key={`cell-${fretOffset}-${strIdx}`}
            style={[
              styles.cell,
              { 
                width: availableWidth / NUM_STRINGS,
                height: stringHeight,
              }
            ]}
          >
            {/* String line (horizontal) */}
            <View 
              style={[
                styles.stringLine,
                { 
                  height: stringThickness,
                  backgroundColor: (isActive && hasNote) ? COLORS_THEME.NOTE : COLORS_THEME.STRING_NORMAL,
                }
              ]}
            />
            
            {/* Note indicator */}
            {hasNote && (
              <View 
                style={[
                  styles.noteCircle,
                  {
                    backgroundColor: isRoot 
                      ? COLORS_THEME.ROOT 
                      : (isActive ? COLORS_THEME.NOTE : '#2A2A2A'),
                    borderColor: isRoot ? COLORS_THEME.ROOT : COLORS_THEME.NOTE,
                  }
                ]}
              >
                <Text style={styles.fingerText}>{finger}</Text>
              </View>
            )}
          </View>
        );
      }
      
      fretRows.push(
        <View key={`fret-row-${fretOffset}`} style={styles.fretRow}>
          {/* Fret number on left */}
          <View style={[styles.fretLabelBox, { width: fretLabelWidth }]}>
            <Text style={styles.fretLabelText}>{fretNumber}</Text>
          </View>
          
          {/* Fret wire (vertical bar at start of fret) */}
          <View 
            style={[
              styles.fretWire,
              { 
                width: isNut ? 5 : 2,
                height: stringHeight,
                backgroundColor: isNut ? COLORS_THEME.NUT : COLORS_THEME.FRET_WIRE,
              }
            ]}
          />
          
          {/* String cells in this fret */}
          <View style={styles.cellRow}>
            {stringCells}
          </View>
        </View>
      );
    }
    
    return (
      <View style={[styles.fretboard, { backgroundColor: COLORS_THEME.FRETBOARD_BG }]}>
        {fretRows}
        {/* Final fret wire */}
        <View style={[styles.finalFretWire, { marginLeft: fretLabelWidth, width: availableWidth + 2 }]} />
      </View>
    );
  };

  // Legend
  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS_THEME.ROOT }]} />
        <Text style={styles.legendText}>Raíz</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS_THEME.NOTE }]} />
        <Text style={styles.legendText}>Nota</Text>
      </View>
      <Text style={styles.legendFingerHint}>1-4 = Dedos</Text>
    </View>
  );

  return (
    <View style={[styles.container, { width }]}>
      {renderStringLabels()}
      {renderFretboard()}
      <Text style={styles.positionText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4757',
    fontSize: 14,
  },
  
  // String labels row
  stringLabelsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  stringLabel: {
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  stringLabelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // Fretboard
  fretboard: {
    borderRadius: 6,
    overflow: 'hidden',
    paddingTop: 2,
    paddingBottom: 2,
  },
  fretRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fretLabelBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretLabelText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
  },
  fretWire: {
    // Width and height set inline
  },
  cellRow: {
    flexDirection: 'row',
  },
  finalFretWire: {
    height: 2,
    backgroundColor: COLORS_THEME.FRET_WIRE,
    marginTop: -1,
  },
  
  // Cell
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stringLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    marginTop: -1,
  },
  noteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  fingerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Position text
  positionText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Legend
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    color: '#888',
  },
  legendFingerHint: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
