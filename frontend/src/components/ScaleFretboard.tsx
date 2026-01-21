import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G } from 'react-native-svg';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

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

const THEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
};

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  width = 320,
  height = 260,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  
  if (!scale) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  // SVG dimensions - SAME PATTERN AS ChordFretboard
  const svgHeight = height - 100;
  const paddingTop = 15;
  const paddingBottom = 20;
  const paddingLeft = 10;
  const paddingRight = 10;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / NUM_FRETS;
  const stringSpacing = fretboardHeight / 5;

  const stringHasRoot = (strIdx: number) => 
    scale.notes.some(n => n.s === strIdx && n.root);

  // TOP ROW: String indicators - SAME PATTERN AS ChordFretboard
  const renderTopIndicators = () => (
    <View style={styles.indicatorRow}>
      {STRING_NAMES.map((name, i) => {
        const isRoot = stringHasRoot(i);
        return (
          <View key={i} style={[styles.indicator, { backgroundColor: isRoot ? THEME.ROOT : THEME.NOTE }]}>
            <Text style={styles.indicatorText}>{name}</Text>
          </View>
        );
      })}
    </View>
  );

  // SVG: String lines
  const renderStrings = () =>
    STRING_NAMES.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.5;
      return (
        <Line key={`str-${i}`}
          x1={paddingLeft} y1={y}
          x2={width - paddingRight} y2={y}
          stroke="#B8977E" strokeWidth={thickness}
        />
      );
    });

  // SVG: Fret lines
  const renderFrets = () => {
    const lines = [];
    for (let i = 0; i <= NUM_FRETS; i++) {
      const x = paddingLeft + i * fretWidth;
      const isNut = i === 0;
      lines.push(
        <Line key={`fret-${i}`}
          x1={x} y1={paddingTop}
          x2={x} y2={paddingTop + fretboardHeight}
          stroke={isNut ? '#D4D4D4' : '#5A5A5A'}
          strokeWidth={isNut ? 5 : 2}
        />
      );
    }
    return lines;
  };

  // SVG: Note circles - SAME PATTERN AS ChordFretboard's renderFingerDots
  const renderNotes = () => {
    const dots = [];
    for (let i = 0; i < scale.notes.length; i++) {
      const note = scale.notes[i];
      const strIdx = note.s;
      const fretOffset = note.f;
      const isRoot = note.root === true;
      
      const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
      const y = paddingTop + strIdx * stringSpacing;
      const fill = isRoot ? THEME.ROOT : (isActive ? THEME.NOTE : '#2A2A2A');
      const stroke = isRoot ? THEME.ROOT : THEME.NOTE;
      
      dots.push(
        <G key={`d-${i}`}>
          {isActive && <Circle cx={x} cy={y} r={18} fill={fill} opacity={0.25} />}
          <Circle cx={x} cy={y} r={14} fill={fill} stroke={stroke} strokeWidth={2} />
        </G>
      );
    }
    return dots;
  };

  // Finger overlays - SAME PATTERN AS ChordFretboard
  const renderFingerOverlays = () => {
    const overlays = [];
    for (let i = 0; i < scale.notes.length; i++) {
      const note = scale.notes[i];
      const strIdx = note.s;
      const fretOffset = note.f;
      const finger = note.finger;
      
      const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
      const y = paddingTop + strIdx * stringSpacing;
      const xPercent = (x / width) * 100;
      const yPercent = (y / svgHeight) * 100;
      
      overlays.push(
        <View key={`fo-${i}`} style={[styles.fingerOverlay, {
          left: `${xPercent}%`, top: `${yPercent}%`,
          transform: [{ translateX: -8 }, { translateY: -8 }]
        }]}>
          <Text style={styles.fingerText}>{finger}</Text>
        </View>
      );
    }
    return overlays;
  };

  // Fret numbers - SAME PATTERN AS ChordFretboard
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: NUM_FRETS }, (_, i) => (
        <Text key={i} style={styles.fretNum}>{scale.start + i}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top indicator row */}
      {renderTopIndicators()}
      
      {/* Fretboard SVG */}
      <View style={styles.svgContainer}>
        <Svg width={width} height={svgHeight}>
          <Rect x={paddingLeft} y={paddingTop} width={fretboardWidth} height={fretboardHeight}
            fill="#1E1810" rx={4} />
          {renderFrets()}
          {renderStrings()}
          {renderNotes()}
        </Svg>
        {renderFingerOverlays()}
      </View>
      
      {/* Fret numbers */}
      {renderFretNumbers()}
      
      {/* Position indicator */}
      <Text style={styles.positionText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.NOTE }]} />
          <Text style={styles.legendText}>Nota</Text>
        </View>
        <Text style={styles.fingerHint}>1-4 = Dedos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  errorText: { color: '#FF4757', fontSize: 14, padding: 20 },
  
  // Top indicator row - SAME AS ChordFretboard
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  indicator: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  indicatorText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  // SVG container - SAME AS ChordFretboard
  svgContainer: { position: 'relative' },
  
  // Finger overlays - SAME AS ChordFretboard
  fingerOverlay: {
    position: 'absolute', width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  fingerText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  
  // Fret numbers - SAME AS ChordFretboard
  fretNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: -5,
  },
  fretNum: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  
  // Position text
  positionText: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
  
  // Legend
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 11, color: '#888' },
  fingerHint: { fontSize: 11, color: COLORS.primary, fontWeight: '500' },
});
