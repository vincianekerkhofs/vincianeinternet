import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale patterns with all notes
const SCALE_PATTERNS: Record<string, {
  name: string;
  fretRange: [number, number];
  notes: { string: number; fret: number; finger: number; isRoot?: boolean }[];
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    fretRange: [5, 8],
    notes: [
      { string: 0, fret: 5, finger: 1, isRoot: true },
      { string: 0, fret: 8, finger: 4 },
      { string: 1, fret: 5, finger: 1 },
      { string: 1, fret: 8, finger: 4 },
      { string: 2, fret: 5, finger: 1 },
      { string: 2, fret: 7, finger: 3 },
      { string: 3, fret: 5, finger: 1 },
      { string: 3, fret: 7, finger: 3 },
      { string: 4, fret: 5, finger: 1, isRoot: true },
      { string: 4, fret: 7, finger: 3 },
      { string: 5, fret: 5, finger: 1, isRoot: true },
      { string: 5, fret: 8, finger: 4 },
    ],
  },
  'Am_blues': {
    name: 'Am Blues',
    fretRange: [5, 8],
    notes: [
      { string: 0, fret: 5, finger: 1, isRoot: true },
      { string: 0, fret: 8, finger: 4 },
      { string: 1, fret: 5, finger: 1 },
      { string: 1, fret: 8, finger: 4 },
      { string: 2, fret: 5, finger: 1 },
      { string: 2, fret: 7, finger: 3 },
      { string: 3, fret: 5, finger: 1 },
      { string: 3, fret: 7, finger: 3 },
      { string: 4, fret: 5, finger: 1, isRoot: true },
      { string: 4, fret: 6, finger: 2 },
      { string: 4, fret: 7, finger: 3 },
      { string: 5, fret: 5, finger: 1, isRoot: true },
      { string: 5, fret: 8, finger: 4 },
    ],
  },
  'C_major_box1': {
    name: 'C Mayor - Pos 1',
    fretRange: [7, 10],
    notes: [
      { string: 0, fret: 7, finger: 1 },
      { string: 0, fret: 8, finger: 2, isRoot: true },
      { string: 0, fret: 10, finger: 4 },
      { string: 1, fret: 8, finger: 1, isRoot: true },
      { string: 1, fret: 10, finger: 3 },
      { string: 2, fret: 7, finger: 1 },
      { string: 2, fret: 9, finger: 3 },
      { string: 3, fret: 7, finger: 1 },
      { string: 3, fret: 9, finger: 3 },
      { string: 3, fret: 10, finger: 4, isRoot: true },
      { string: 4, fret: 7, finger: 1 },
      { string: 4, fret: 8, finger: 2 },
      { string: 4, fret: 10, finger: 4 },
      { string: 5, fret: 7, finger: 1 },
      { string: 5, fret: 8, finger: 2, isRoot: true },
      { string: 5, fret: 10, finger: 4 },
    ],
  },
};

const COLORS_SCHEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  STRING: '#B8977E',
  FRET: '#5A5A5A',
  NUT: '#D4D4D4',
  BG: '#1E1810',
};

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  width = 340,
  height = 220,
  isActive = false,
}) => {
  const scaleData = SCALE_PATTERNS[scaleName];
  if (!scaleData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Escala: {scaleName}</Text>
      </View>
    );
  }

  const [startFret, endFret] = scaleData.fretRange;
  const numFrets = endFret - startFret + 1;
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  
  const fretboardHeight = 160;
  const fretboardWidth = width - 40;
  const stringSpacing = fretboardHeight / 5;
  const fretWidth = fretboardWidth / numFrets;

  // String indicators
  const renderStringIndicators = () => (
    <View style={styles.indicatorRow}>
      {stringNames.map((name, i) => (
        <View key={i} style={styles.indGreen}>
          <Text style={styles.indText}>{name}</Text>
        </View>
      ))}
    </View>
  );

  // Fretboard with strings, frets and notes
  const renderFretboard = () => (
    <View style={[styles.fretboard, { width: fretboardWidth, height: fretboardHeight, paddingVertical: 15 }]}>
      {/* Strings */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <View
          key={`s-${i}`}
          style={[
            styles.string,
            {
              top: 15 + i * stringSpacing,
              height: 2 + i * 0.5,
              backgroundColor: isActive ? COLORS_SCHEME.NOTE : COLORS_SCHEME.STRING,
            },
          ]}
        />
      ))}
      
      {/* Frets */}
      {Array.from({ length: numFrets + 1 }).map((_, i) => (
        <View
          key={`f-${i}`}
          style={[
            styles.fret,
            {
              left: i * fretWidth,
              width: i === 0 ? 5 : 2,
              backgroundColor: i === 0 ? COLORS_SCHEME.NUT : COLORS_SCHEME.FRET,
            },
          ]}
        />
      ))}
      
      {/* Notes */}
      {scaleData.notes.map((note, idx) => {
        const fretPos = note.fret - startFret;
        const left = (fretPos + 0.5) * fretWidth - 12;
        const top = 15 + note.string * stringSpacing - 12;
        const color = note.isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE;
        
        return (
          <View
            key={`n-${idx}`}
            style={[
              styles.noteCircle,
              {
                left,
                top,
                backgroundColor: isActive ? color : '#2A2A2A',
                borderColor: color,
              },
            ]}
          >
            <Text style={styles.fingerText}>{note.finger}</Text>
          </View>
        );
      })}
    </View>
  );

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={[styles.fretNumRow, { width: fretboardWidth }]}>
      {Array.from({ length: numFrets }).map((_, i) => (
        <Text key={`fn-${i}`} style={[styles.fretNum, { width: fretWidth }]}>
          {startFret + i}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderStringIndicators()}
      {renderFretboard()}
      {renderFretNumbers()}
      
      <Text style={styles.startFret}>Trastes {startFret}-{endFret}</Text>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.NOTE }]} />
          <Text style={styles.legendText}>Notas</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 8 },
  errorText: { color: '#FF4757', fontSize: 14 },
  
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  indGreen: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  fretboard: {
    backgroundColor: '#1E1810',
    borderRadius: 4,
    position: 'relative',
    marginHorizontal: 20,
  },
  string: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  fret: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  noteCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  fretNumRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginHorizontal: 20,
  },
  fretNum: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  startFret: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 6,
  },
  
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: COLORS.textMuted },
});
