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
      { s: 0, f: 0, finger: 1, root: true }, { s: 0, f: 3, finger: 4 },
      { s: 1, f: 0, finger: 1 }, { s: 1, f: 3, finger: 4 },
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 },
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 2, finger: 3 },
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
  NUT: '#CCC',
  STRING: '#B8977E',
  CELL_BG: 'transparent',
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

  // Render one cell
  const renderCell = (strIdx: number, fretOffset: number, cellWidth: number) => {
    const noteKey = `${strIdx}-${fretOffset}`;
    const noteData = noteMap.get(noteKey);
    const hasNote = !!noteData;
    const isRoot = noteData?.root === true;
    const finger = noteData?.finger;
    const stringThickness = 1.5 + strIdx * 0.4;

    return (
      <View key={`cell-${strIdx}-${fretOffset}`} style={[styles.cell, { width: cellWidth }]}>
        {/* String line through the cell */}
        <View style={[styles.stringLine, { height: stringThickness }]} />
        
        {/* Note indicator (if present) */}
        {hasNote && (
          <View 
            style={[
              styles.noteCircle,
              {
                backgroundColor: isRoot 
                  ? THEME.ROOT 
                  : (isActive ? THEME.NOTE : '#2A2A2A'),
                borderColor: isRoot ? THEME.ROOT : THEME.NOTE,
              }
            ]}
          >
            <Text style={styles.fingerText}>{finger}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render one string row
  const renderStringRow = (strIdx: number, rowWidth: number) => {
    const cellWidth = rowWidth / NUM_FRETS;
    const cells = [];
    for (let f = 0; f < NUM_FRETS; f++) {
      cells.push(renderCell(strIdx, f, cellWidth));
    }
    
    return (
      <View key={`row-${strIdx}`} style={[styles.stringRow, { width: rowWidth }]}>
        {cells}
      </View>
    );
  };

  // Render all string rows
  const renderFretboard = () => {
    const boardWidth = width - 20; // Account for padding
    const rows = [];
    for (let s = 0; s < NUM_STRINGS; s++) {
      rows.push(renderStringRow(s, boardWidth));
    }
    return (
      <View style={[styles.fretboard, { backgroundColor: THEME.BG, width: boardWidth }]}>
        {/* String rows */}
        <View style={[styles.stringsContainer, { width: boardWidth }]}>
          {rows}
        </View>
      </View>
    );
  };

  // Top indicators
  const renderTopIndicators = () => (
    <View style={styles.indicatorRow}>
      {STRING_NAMES.map((name, idx) => {
        const isRoot = stringHasRoot(idx);
        return (
          <View 
            key={`ind-${idx}`}
            style={[
              styles.indicator,
              { backgroundColor: isRoot ? THEME.ROOT : THEME.NOTE }
            ]}
          >
            <Text style={styles.indicatorText}>{name}</Text>
          </View>
        );
      })}
    </View>
  );

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumberRow}>
      {Array.from({ length: NUM_FRETS }, (_, i) => (
        <View key={`fn-${i}`} style={styles.fretNumberCell}>
          <Text style={styles.fretNumberText}>{scale.start + i}</Text>
        </View>
      ))}
    </View>
  );

  // Legend
  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.ROOT }]} />
        <Text style={styles.legendLabel}>Raíz</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.NOTE }]} />
        <Text style={styles.legendLabel}>Nota</Text>
      </View>
      <Text style={styles.legendFingerHint}>Números = Dedos (1-4)</Text>
    </View>
  );

  return (
    <View style={[styles.container, { width }]}>
      {renderTopIndicators()}
      {renderFretboard()}
      {renderFretNumbers()}
      <Text style={styles.posText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  errorBox: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4757',
    fontSize: 14,
  },
  
  // Indicators
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // Fretboard
  fretboard: {
    width: '100%',
    borderRadius: 6,
    overflow: 'hidden',
    paddingVertical: 8,
  },
  fretWiresOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  fretWire: {
    width: 2,
    backgroundColor: '#5A5A5A',
  },
  nutWire: {
    width: 5,
    backgroundColor: '#CCC',
  },
  stringsContainer: {
    width: '100%',
  },
  
  // String row
  stringRow: {
    flexDirection: 'row',
    width: '100%',
    height: 32,
  },
  
  // Cell
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stringLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#B8977E',
  },
  noteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  fingerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Fret numbers
  fretNumberRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 4,
  },
  fretNumberCell: {
    flex: 1,
    alignItems: 'center',
  },
  fretNumberText: {
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
    marginTop: 10,
    flexWrap: 'wrap',
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
  legendLabel: {
    fontSize: 11,
    color: '#888',
  },
  legendFingerHint: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
