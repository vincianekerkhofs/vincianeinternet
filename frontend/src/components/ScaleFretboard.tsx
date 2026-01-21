import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale patterns
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
};

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  width = 340,
  height = 280,
  isActive = false,
}) => {
  const scaleData = SCALE_PATTERNS[scaleName];
  if (!scaleData) {
    return <Text style={{color: '#FF4757'}}>Escala: {scaleName}</Text>;
  }

  const [startFret, endFret] = scaleData.fretRange;
  const numFrets = endFret - startFret + 1;
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  
  // Fixed measurements
  const STRING_GAP = 28; // Gap between strings
  const FRET_WIDTH = (width - 60) / numFrets;
  const TOP_PADDING = 20;
  const FRETBOARD_HEIGHT = TOP_PADDING + STRING_GAP * 5 + TOP_PADDING;

  return (
    <View style={styles.container}>
      {/* String indicators */}
      <View style={styles.indicatorRow}>
        {stringNames.map((name, i) => (
          <View key={i} style={styles.indicator}>
            <Text style={styles.indicatorText}>{name}</Text>
          </View>
        ))}
      </View>
      
      {/* Fretboard */}
      <View style={[styles.fretboard, { width: width - 30, height: FRETBOARD_HEIGHT }]}>
        {/* Strings - 6 horizontal lines */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View
            key={`string-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: TOP_PADDING + i * STRING_GAP,
              height: 2 + i * 0.4,
              backgroundColor: COLORS_SCHEME.STRING,
            }}
          />
        ))}
        
        {/* Frets - vertical lines */}
        {Array.from({ length: numFrets + 1 }).map((_, i) => (
          <View
            key={`fret-${i}`}
            style={{
              position: 'absolute',
              top: TOP_PADDING - 5,
              bottom: TOP_PADDING - 5,
              left: i * FRET_WIDTH,
              width: i === 0 ? 4 : 2,
              backgroundColor: i === 0 ? '#CCC' : '#555',
            }}
          />
        ))}
        
        {/* Notes */}
        {scaleData.notes.map((note, idx) => {
          const fretPos = note.fret - startFret;
          const left = (fretPos + 0.5) * FRET_WIDTH - 11;
          const top = TOP_PADDING + note.string * STRING_GAP - 11;
          const bgColor = note.isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE;
          
          return (
            <View
              key={`note-${idx}`}
              style={{
                position: 'absolute',
                left,
                top,
                width: 22,
                height: 22,
                borderRadius: 11,
                backgroundColor: bgColor,
                borderWidth: 2,
                borderColor: '#FFF',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10 + idx,
              }}
            >
              <Text style={styles.fingerText}>{note.finger}</Text>
            </View>
          );
        })}
      </View>
      
      {/* Fret numbers */}
      <View style={[styles.fretNumRow, { width: width - 30 }]}>
        {Array.from({ length: numFrets }).map((_, i) => (
          <Text key={i} style={[styles.fretNum, { width: FRET_WIDTH }]}>
            {startFret + i}
          </Text>
        ))}
      </View>
      
      <Text style={styles.subtitle}>Trastes {startFret}-{endFret}</Text>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS_SCHEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: COLORS_SCHEME.NOTE }]} />
          <Text style={styles.legendText}>Notas</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 8 },
  
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 15,
  },
  indicator: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indicatorText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  fretboard: {
    backgroundColor: '#1E1810',
    borderRadius: 4,
    marginHorizontal: 15,
    overflow: 'visible',
  },
  
  fingerText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  fretNumRow: {
    flexDirection: 'row',
    marginTop: 6,
    marginHorizontal: 15,
  },
  fretNum: { fontSize: 11, color: '#888', fontWeight: '600', textAlign: 'center' },
  
  subtitle: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
  
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#888' },
});
