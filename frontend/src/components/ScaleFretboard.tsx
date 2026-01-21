import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G } from 'react-native-svg';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale data
const SCALES: Record<string, { name: string; start: number; notes: { s: number; f: number; finger: number; root?: boolean }[] }> = {
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

const STR_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const { width: SW } = Dimensions.get('window');

const COLORS_SCHEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
};

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  width = SW - 32,
  height = 220,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  if (!scale) return <Text style={{color:'red'}}>?</Text>;

  const NUM_FRETS = 4;
  const svgHeight = height - 60;
  const paddingTop = 15;
  const paddingBottom = 20;
  const paddingLeft = 15;
  const paddingRight = 15;
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / NUM_FRETS;
  const stringSpacing = fretboardHeight / 5;

  const hasRoot = (si: number) => scale.notes.some(n => n.s === si && n.root);

  // Top indicators (same structure as ChordFretboard)
  const renderTopIndicators = () => (
    <View style={styles.indicatorRow}>
      {STR_NAMES.map((name, i) => (
        <View key={i} style={hasRoot(i) ? styles.indRoot : styles.indNote}>
          <Text style={styles.indText}>{name}</Text>
        </View>
      ))}
    </View>
  );

  // SVG strings
  const renderStrings = () => 
    STR_NAMES.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.5;
      return (
        <G key={`s-${i}`}>
          {isActive && (
            <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
              stroke={COLORS_SCHEME.NOTE} strokeWidth={thickness + 5} opacity={0.3} />
          )}
          <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
            stroke={isActive ? COLORS_SCHEME.NOTE : '#B8977E'} strokeWidth={thickness} />
        </G>
      );
    });

  // SVG frets
  const renderFrets = () => {
    const frets = [];
    for (let i = 0; i <= NUM_FRETS; i++) {
      const x = paddingLeft + i * fretWidth;
      frets.push(
        <Line key={`f-${i}`} x1={x} y1={paddingTop} x2={x} y2={paddingTop + fretboardHeight}
          stroke={i === 0 ? '#CCC' : '#555'} strokeWidth={i === 0 ? 5 : 2} />
      );
    }
    return frets;
  };

  // SVG notes (all scale notes)
  const renderNotes = () =>
    scale.notes.map((note, idx) => {
      const x = paddingLeft + (note.f + 0.5) * fretWidth;
      const y = paddingTop + note.s * stringSpacing;
      const color = note.root ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE;
      return (
        <G key={`n-${idx}`}>
          {isActive && <Circle cx={x} cy={y} r={16} fill={color} opacity={0.3} />}
          <Circle cx={x} cy={y} r={12} fill={isActive ? color : '#222'} stroke={color} strokeWidth={2} />
        </G>
      );
    });

  // Finger overlays (React Native Views)
  const renderFingerOverlays = () =>
    scale.notes.map((note, idx) => {
      const xPct = ((paddingLeft + (note.f + 0.5) * fretWidth) / width) * 100;
      const yPct = ((paddingTop + note.s * stringSpacing) / svgHeight) * 100;
      return (
        <View key={`fo-${idx}`} style={[styles.fingerOverlay, {
          left: `${xPct}%`, top: `${yPct}%`,
          transform: [{ translateX: -6 }, { translateY: -8 }]
        }]}>
          <Text style={styles.fingerText}>{note.finger}</Text>
        </View>
      );
    });

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: NUM_FRETS }).map((_, i) => (
        <Text key={i} style={[styles.fretNum, { width: fretWidth }]}>{scale.start + i}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top indicators */}
      {renderTopIndicators()}
      
      {/* SVG Fretboard */}
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
      
      <Text style={styles.posText}>Trastes {scale.start}-{scale.start + NUM_FRETS - 1}</Text>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.NOTE }]} />
          <Text style={styles.legendText}>Notas</Text>
        </View>
        <Text style={[styles.legendText, { color: COLORS_SCHEME.NOTE }]}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  
  // Indicator row (same as ChordFretboard)
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  indNote: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indRoot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center',
  },
  indText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  svgContainer: { position: 'relative' },
  
  fingerOverlay: {
    position: 'absolute', width: 12, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  fingerText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  fretNumRow: {
    flexDirection: 'row',
    paddingLeft: 15,
    marginTop: -5,
  },
  fretNum: { textAlign: 'center', fontSize: 11, color: '#888', fontWeight: '600' },
  
  posText: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
  
  legend: { flexDirection: 'row', gap: 14, marginTop: 8, alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#888' },
});
