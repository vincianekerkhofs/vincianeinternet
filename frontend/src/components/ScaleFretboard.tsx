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

const THEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  BG: '#1E1810',
  FRET: '#5A5A5A',
  NUT: '#D4D4D4',
  STRING: '#B8977E',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  width = SCREEN_WIDTH - 32,
  height = 260,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  
  if (!scale) {
    return (
      <View style={styles.errorBox}>
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
  const stringHasRoot = (strIdx: number) => 
    scale.notes.some(n => n.s === strIdx && n.root);

  // Layout
  const stringLabelWidth = 30;
  const fretLabelHeight = 20;
  const boardWidth = width - stringLabelWidth - 16;
  const boardHeight = height - fretLabelHeight - 70; // Leave room for legend
  const fretWidth = boardWidth / NUM_FRETS;
  const stringSpacing = boardHeight / (NUM_STRINGS - 1);

  // Top row: String indicators
  const renderStringIndicators = () => (
    <View style={[styles.stringIndicatorsRow, { marginLeft: stringLabelWidth }]}>
      {STRING_NAMES.map((name, idx) => {
        const isRoot = stringHasRoot(idx);
        return (
          <View 
            key={`ind-${idx}`}
            style={[
              styles.stringIndicator,
              { backgroundColor: isRoot ? THEME.ROOT : THEME.NOTE }
            ]}
          >
            <Text style={styles.stringIndicatorText}>{name}</Text>
          </View>
        );
      })}
    </View>
  );

  // Fretboard: 6 string lines (horizontal), 4 fret lines (vertical), notes at intersections
  const renderFretboard = () => {
    // Render all string lines
    const stringLines = STRING_NAMES.map((_, strIdx) => {
      const y = strIdx * stringSpacing;
      const thickness = 1.5 + strIdx * 0.4;
      return (
        <View 
          key={`str-${strIdx}`}
          style={[
            styles.stringHorizontal,
            { 
              top: y - thickness/2, 
              height: thickness,
              backgroundColor: THEME.STRING,
            }
          ]}
        />
      );
    });

    // Render fret lines (vertical)
    const fretLines = [];
    for (let f = 0; f <= NUM_FRETS; f++) {
      const x = f * fretWidth;
      const isNut = f === 0;
      fretLines.push(
        <View 
          key={`fret-${f}`}
          style={[
            styles.fretVertical,
            { 
              left: x - (isNut ? 2.5 : 1),
              width: isNut ? 5 : 2,
              height: boardHeight,
              backgroundColor: isNut ? THEME.NUT : THEME.FRET,
            }
          ]}
        />
      );
    }

    // Render note circles at the correct positions
    const notes = scale.notes.map((note, idx) => {
      const strIdx = note.s;
      const fretOffset = note.f;
      const isRoot = note.root === true;
      
      // Position: center of the fret cell
      const x = (fretOffset + 0.5) * fretWidth;
      const y = strIdx * stringSpacing;
      
      return (
        <View 
          key={`note-${idx}`}
          style={[
            styles.noteCircle,
            {
              left: x - 14,
              top: y - 14,
              backgroundColor: isRoot 
                ? THEME.ROOT 
                : (isActive ? THEME.NOTE : '#2A2A2A'),
              borderColor: isRoot ? THEME.ROOT : THEME.NOTE,
            }
          ]}
        >
          <Text style={styles.fingerText}>{note.finger}</Text>
        </View>
      );
    });

    return (
      <View style={[styles.fretboard, { width: boardWidth, height: boardHeight, backgroundColor: THEME.BG }]}>
        {stringLines}
        {fretLines}
        {notes}
      </View>
    );
  };

  // Fret numbers row below fretboard
  const renderFretNumbers = () => (
    <View style={[styles.fretNumbersRow, { marginLeft: stringLabelWidth, width: boardWidth }]}>
      {Array.from({ length: NUM_FRETS }, (_, i) => (
        <Text key={`fnum-${i}`} style={[styles.fretNumber, { width: fretWidth }]}>
          {scale.start + i}
        </Text>
      ))}
    </View>
  );

  // Legend
  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.ROOT }]} />
        <Text style={styles.legendText}>Raíz</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.NOTE }]} />
        <Text style={styles.legendText}>Nota</Text>
      </View>
      <Text style={styles.legendFingerHint}>1-4 = Dedos</Text>
    </View>
  );

  return (
    <View style={[styles.container, { width }]}>
      {renderStringIndicators()}
      <View style={styles.boardRow}>
        {/* String names on left side */}
        <View style={[styles.stringNamesColumn, { width: stringLabelWidth }]}>
          {STRING_NAMES.map((name, idx) => (
            <View key={`sname-${idx}`} style={[styles.stringNameBox, { height: stringSpacing }]}>
              <Text style={styles.stringNameText}>{name}</Text>
            </View>
          ))}
        </View>
        {renderFretboard()}
      </View>
      {renderFretNumbers()}
      <Text style={styles.posText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  errorBox: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4757',
    fontSize: 14,
  },
  
  // String indicators row
  stringIndicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  stringIndicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stringIndicatorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // Board row
  boardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stringNamesColumn: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  stringNameBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stringNameText: {
    fontSize: 10,
    color: '#888',
    fontWeight: '600',
  },
  
  // Fretboard
  fretboard: {
    position: 'relative',
    borderRadius: 4,
    overflow: 'visible',
  },
  stringHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  fretVertical: {
    position: 'absolute',
    top: 0,
  },
  noteCircle: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fingerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Fret numbers
  fretNumbersRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  fretNumber: {
    textAlign: 'center',
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  
  // Position text
  posText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Legend
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
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
