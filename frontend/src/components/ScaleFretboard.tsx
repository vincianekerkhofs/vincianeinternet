import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale data: s = string (0=high e, 5=low E), f = fret offset from start, finger = 1-4
const SCALES: Record<string, { 
  name: string; 
  start: number; 
  notes: { s: number; f: number; finger: number; root?: boolean }[] 
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica',
    start: 5,
    notes: [
      // String 0 (high e): frets 5, 8
      { s: 0, f: 0, finger: 1, root: true }, { s: 0, f: 3, finger: 4 },
      // String 1 (B): frets 5, 8
      { s: 1, f: 0, finger: 1 }, { s: 1, f: 3, finger: 4 },
      // String 2 (G): frets 5, 7
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      // String 3 (D): frets 5, 7
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 },
      // String 4 (A): frets 5, 7 - root on 5
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 2, finger: 3 },
      // String 5 (E): frets 5, 8 - root on 5
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
      // Blue note added on string 4, fret 6 (f=1)
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 1, finger: 2 }, { s: 4, f: 2, finger: 3 },
      { s: 5, f: 0, finger: 1, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
  'C_major_box1': {
    name: 'Do Mayor',
    start: 7,
    notes: [
      // C major scale box starting at fret 7
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

const COLORS_SCHEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  FRETBOARD: '#1E1810',
  FRET_LINE: '#555',
  NUT: '#CCC',
  STRING: '#B8977E',
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

  // Build a lookup map: key = "string-fret" -> note data
  const noteMap = new Map<string, { finger: number; root?: boolean }>();
  scale.notes.forEach(note => {
    noteMap.set(`${note.s}-${note.f}`, { finger: note.finger, root: note.root });
  });

  // Check if string has root note (for top indicators)
  const hasRoot = (stringIndex: number) => 
    scale.notes.some(n => n.s === stringIndex && n.root);

  // Calculate dimensions
  const fretboardHeight = height - 100; // Leave space for indicators and legend
  const cellHeight = fretboardHeight / NUM_STRINGS;
  const cellWidth = (width - 40) / NUM_FRETS; // 40px for string names on left

  // Render top indicators showing string names with root highlighting
  const renderTopIndicators = () => (
    <View style={styles.indicatorRow}>
      <View style={{ width: 40 }} />
      {STRING_NAMES.map((name, i) => {
        const isRoot = hasRoot(i);
        return (
          <View 
            key={i} 
            style={[
              styles.indicator,
              { backgroundColor: isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE }
            ]}
          >
            <Text style={styles.indicatorText}>{name}</Text>
          </View>
        );
      })}
    </View>
  );

  // Render the fretboard grid
  const renderFretboard = () => {
    const rows = [];
    
    for (let fret = 0; fret < NUM_FRETS; fret++) {
      const isNut = fret === 0;
      const cells = [];
      
      for (let string = 0; string < NUM_STRINGS; string++) {
        const noteKey = `${string}-${fret}`;
        const noteData = noteMap.get(noteKey);
        const hasNote = !!noteData;
        const isRoot = noteData?.root;
        const finger = noteData?.finger;
        
        // String thickness increases from high to low
        const stringThickness = 1.5 + string * 0.5;
        
        cells.push(
          <View key={`${fret}-${string}`} style={[styles.cell, { width: cellWidth, height: cellHeight }]}>
            {/* Horizontal string line */}
            <View 
              style={[
                styles.stringLine,
                { 
                  height: stringThickness,
                  backgroundColor: isActive && hasNote ? COLORS_SCHEME.NOTE : COLORS_SCHEME.STRING,
                }
              ]} 
            />
            
            {/* Note circle */}
            {hasNote && (
              <View 
                style={[
                  styles.noteCircle,
                  {
                    backgroundColor: isRoot ? COLORS_SCHEME.ROOT : (isActive ? COLORS_SCHEME.NOTE : '#333'),
                    borderColor: isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE,
                  }
                ]}
              >
                <Text style={styles.fingerText}>{finger}</Text>
              </View>
            )}
          </View>
        );
      }
      
      rows.push(
        <View key={`fret-${fret}`} style={styles.fretRow}>
          {/* Fret number label */}
          <View style={styles.fretLabel}>
            <Text style={styles.fretLabelText}>{scale.start + fret}</Text>
          </View>
          
          {/* Fret wire (vertical line at start of fret) */}
          <View 
            style={[
              styles.fretWire,
              { 
                width: isNut ? 5 : 2,
                backgroundColor: isNut ? COLORS_SCHEME.NUT : COLORS_SCHEME.FRET_LINE,
              }
            ]} 
          />
          
          {/* String cells for this fret */}
          <View style={styles.cellsContainer}>
            {cells}
          </View>
        </View>
      );
    }
    
    // Add final fret wire at the end
    rows.push(
      <View key="fret-end" style={styles.fretRow}>
        <View style={styles.fretLabel}>
          <Text style={styles.fretLabelText}>{scale.start + NUM_FRETS}</Text>
        </View>
        <View style={[styles.fretWire, { width: 2, backgroundColor: COLORS_SCHEME.FRET_LINE }]} />
      </View>
    );
    
    return (
      <View style={[styles.fretboard, { backgroundColor: COLORS_SCHEME.FRETBOARD }]}>
        {rows}
      </View>
    );
  };

  // Render position text
  const renderPositionText = () => (
    <Text style={styles.positionText}>
      Posición: Trastes {scale.start}–{scale.start + NUM_FRETS - 1}
    </Text>
  );

  // Render legend
  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.ROOT }]} />
        <Text style={styles.legendText}>Raíz (tónica)</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.NOTE }]} />
        <Text style={styles.legendText}>Notas de escala</Text>
      </View>
      <Text style={styles.legendFingerText}>Números = Dedos (1-4)</Text>
    </View>
  );

  return (
    <View style={[styles.container, { width }]}>
      {renderTopIndicators()}
      {renderFretboard()}
      {renderPositionText()}
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
  
  // Top indicators
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // Fretboard
  fretboard: {
    borderRadius: 8,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  fretRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fretLabel: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fretLabelText: {
    color: '#888',
    fontSize: 11,
    fontWeight: '600',
  },
  fretWire: {
    height: '100%',
  },
  cellsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  
  // Cell (one fret position on one string)
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stringLine: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    marginTop: -1,
  },
  noteCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fingerText: {
    color: '#FFF',
    fontSize: 13,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  legendFingerText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
