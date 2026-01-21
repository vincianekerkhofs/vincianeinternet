import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G } from 'react-native-svg';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale patterns with all notes
const SCALE_PATTERNS: Record<string, {
  name: string;
  fretRange: [number, number]; // [start, end]
  notes: { string: number; fret: number; finger: number; isRoot?: boolean }[];
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    fretRange: [5, 8],
    notes: [
      // String 0 (e high) - trastes 5, 8
      { string: 0, fret: 5, finger: 1, isRoot: true },
      { string: 0, fret: 8, finger: 4 },
      // String 1 (B) - trastes 5, 8
      { string: 1, fret: 5, finger: 1 },
      { string: 1, fret: 8, finger: 4 },
      // String 2 (G) - trastes 5, 7
      { string: 2, fret: 5, finger: 1 },
      { string: 2, fret: 7, finger: 3 },
      // String 3 (D) - trastes 5, 7
      { string: 3, fret: 5, finger: 1 },
      { string: 3, fret: 7, finger: 3 },
      // String 4 (A) - trastes 5, 7
      { string: 4, fret: 5, finger: 1, isRoot: true },
      { string: 4, fret: 7, finger: 3 },
      // String 5 (E low) - trastes 5, 8
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
      { string: 4, fret: 6, finger: 2 }, // Blue note!
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
};

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  width = 320,
  height = 260,
  isActive = false,
}) => {
  const scaleData = SCALE_PATTERNS[scaleName];
  if (!scaleData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  const [startFret, endFret] = scaleData.fretRange;
  const numFrets = endFret - startFret + 2; // Add extra fret for visibility

  const paddingTop = 30;
  const paddingBottom = 30;
  const paddingLeft = 25;  // More padding for circles
  const paddingRight = 25;
  
  const svgHeight = height - 70;
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];

  // Render strings
  const renderStrings = () =>
    stringNames.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.4;
      return (
        <G key={`s-${i}`}>
          {isActive && (
            <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
              stroke={COLORS_SCHEME.NOTE} strokeWidth={thickness + 5} opacity={0.25} />
          )}
          <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
            stroke={isActive ? COLORS_SCHEME.NOTE : '#B8977E'} strokeWidth={thickness} />
        </G>
      );
    });

  // Render frets
  const renderFrets = () => {
    const frets = [];
    for (let i = 0; i <= numFrets; i++) {
      const x = paddingLeft + i * fretWidth;
      frets.push(
        <Line key={`f-${i}`} x1={x} y1={paddingTop} x2={x} y2={paddingTop + fretboardHeight}
          stroke={i === 0 ? '#888' : '#5A5A5A'} strokeWidth={i === 0 ? 3 : 2} />
      );
    }
    return frets;
  };

  // Render fret markers (dots at 5, 7, 9, 12)
  const renderFretMarkers = () => {
    const markers = [];
    const markerFrets = [5, 7, 9, 12];
    for (let i = 1; i <= numFrets; i++) {
      const fretNum = startFret + i;
      if (markerFrets.includes(fretNum)) {
        const x = paddingLeft + (i - 0.5) * fretWidth;
        if (fretNum === 12) {
          markers.push(<Circle key={`m-${i}-1`} cx={x} cy={paddingTop + stringSpacing * 1.5} r={4} fill="#3A3A3A" />);
          markers.push(<Circle key={`m-${i}-2`} cx={x} cy={paddingTop + stringSpacing * 3.5} r={4} fill="#3A3A3A" />);
        } else {
          markers.push(<Circle key={`m-${i}`} cx={x} cy={paddingTop + fretboardHeight / 2} r={4} fill="#3A3A3A" />);
        }
      }
    }
    return markers;
  };

  // Render ALL scale notes - position between fret lines
  const renderScaleNotes = () => {
    return scaleData.notes.map((note, idx) => {
      // fretPos: 0 for notes at startFret, 1 for startFret+1, etc.
      const fretPos = note.fret - startFret;
      // x: center of each fret space
      const x = paddingLeft + (fretPos + 0.5) * fretWidth;
      const y = paddingTop + note.string * stringSpacing;
      const color = note.isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE;
      
      return (
        <G key={`n-${idx}`}>
          {isActive && <Circle cx={x} cy={y} r={14} fill={color} opacity={0.3} />}
          <Circle cx={x} cy={y} r={11} fill={isActive ? color : '#2A2A2A'} stroke={color} strokeWidth={2} />
        </G>
      );
    });
  };

  // Finger overlays
  const renderFingerOverlays = () => {
    return scaleData.notes.map((note, idx) => {
      const fretPos = note.fret - startFret;
      const xPct = ((paddingLeft + (fretPos + 0.5) * fretWidth) / width) * 100;
      const yPct = ((paddingTop + note.string * stringSpacing) / svgHeight) * 100;
      
      return (
        <View key={`fo-${idx}`} style={[styles.fingerOverlay, {
          left: `${xPct}%`, top: `${yPct}%`,
          transform: [{ translateX: -5 }, { translateY: -7 }]
        }]}>
          <Text style={styles.fingerText}>{note.finger}</Text>
        </View>
      );
    });
  };

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: numFrets }, (_, i) => (
        <Text key={`fn-${i}`} style={styles.fretNum}>{startFret + i}</Text>
      ))}
    </View>
  );

  // String indicators (all green - all strings play)
  const renderStringIndicators = () => (
    <View style={styles.indicatorRow}>
      {stringNames.map((name, i) => (
        <View key={i} style={styles.indGreen}>
          <Text style={styles.indText}>{name}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderStringIndicators()}
      
      <View style={styles.svgContainer}>
        <Svg width={width} height={svgHeight}>
          <Rect x={paddingLeft} y={paddingTop} width={fretboardWidth} height={fretboardHeight}
            fill="#1E1810" rx={4} />
          {renderFretMarkers()}
          {renderFrets()}
          {renderStrings()}
          {renderScaleNotes()}
        </Svg>
      </View>
      
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
  container: { alignItems: 'center' },
  errorText: { color: '#FF4757', fontSize: 14 },
  
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 6,
    paddingHorizontal: 15,
  },
  indGreen: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  svgContainer: { position: 'relative' },
  
  fingerOverlay: {
    position: 'absolute', width: 10, height: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  fingerText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  fretNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 35,
    marginTop: -8,
  },
  fretNum: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  
  startFret: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 6 },
  
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: COLORS.textMuted },
});
