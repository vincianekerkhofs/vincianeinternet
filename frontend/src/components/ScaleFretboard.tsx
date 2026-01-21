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

// Scale patterns - all notes on each string
const SCALE_PATTERNS: Record<string, {
  name: string;
  startFret: number;
  notes: { string: number; fret: number; finger: number; isRoot?: boolean }[];
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    startFret: 5,
    notes: [
      // String 6 (E low) - frets 5, 8
      { string: 5, fret: 5, finger: 1, isRoot: true },
      { string: 5, fret: 8, finger: 4 },
      // String 5 (A) - frets 5, 7
      { string: 4, fret: 5, finger: 1, isRoot: true },
      { string: 4, fret: 7, finger: 3 },
      // String 4 (D) - frets 5, 7
      { string: 3, fret: 5, finger: 1 },
      { string: 3, fret: 7, finger: 3 },
      // String 3 (G) - frets 5, 7
      { string: 2, fret: 5, finger: 1 },
      { string: 2, fret: 7, finger: 3 },
      // String 2 (B) - frets 5, 8
      { string: 1, fret: 5, finger: 1 },
      { string: 1, fret: 8, finger: 4 },
      // String 1 (e high) - frets 5, 8
      { string: 0, fret: 5, finger: 1, isRoot: true },
      { string: 0, fret: 8, finger: 4 },
    ],
  },
  'Am_blues': {
    name: 'Am Blues',
    startFret: 5,
    notes: [
      // String 6 (E low)
      { string: 5, fret: 5, finger: 1, isRoot: true },
      { string: 5, fret: 8, finger: 4 },
      // String 5 (A)
      { string: 4, fret: 5, finger: 1, isRoot: true },
      { string: 4, fret: 6, finger: 2 }, // Blue note
      { string: 4, fret: 7, finger: 3 },
      // String 4 (D)
      { string: 3, fret: 5, finger: 1 },
      { string: 3, fret: 7, finger: 3 },
      // String 3 (G)
      { string: 2, fret: 5, finger: 1 },
      { string: 2, fret: 7, finger: 3 },
      // String 2 (B)
      { string: 1, fret: 5, finger: 1 },
      { string: 1, fret: 8, finger: 4 },
      // String 1 (e high)
      { string: 0, fret: 5, finger: 1, isRoot: true },
      { string: 0, fret: 8, finger: 4 },
    ],
  },
  'C_major_box1': {
    name: 'C Mayor - Posición 1',
    startFret: 7,
    notes: [
      // String 6 (E low)
      { string: 5, fret: 7, finger: 1 },
      { string: 5, fret: 8, finger: 2, isRoot: true },
      { string: 5, fret: 10, finger: 4 },
      // String 5 (A)
      { string: 4, fret: 7, finger: 1 },
      { string: 4, fret: 8, finger: 2 },
      { string: 4, fret: 10, finger: 4, isRoot: true },
      // String 4 (D)
      { string: 3, fret: 7, finger: 1 },
      { string: 3, fret: 9, finger: 3 },
      { string: 3, fret: 10, finger: 4 },
      // String 3 (G)
      { string: 2, fret: 7, finger: 1 },
      { string: 2, fret: 9, finger: 3 },
      { string: 2, fret: 10, finger: 4 },
      // String 2 (B)
      { string: 1, fret: 8, finger: 1, isRoot: true },
      { string: 1, fret: 10, finger: 3 },
      // String 1 (e high)
      { string: 0, fret: 7, finger: 1 },
      { string: 0, fret: 8, finger: 2 },
      { string: 0, fret: 10, finger: 4 },
    ],
  },
};

const COLORS_SCHEME = {
  NOTE: '#00D68F',       // Green for normal notes
  ROOT: '#FF6B35',       // Orange for root notes
  BLUE_NOTE: '#9B59B6',  // Purple for blue notes
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

  // Calculate fret range from actual notes
  const minFret = Math.min(...scaleData.notes.map(n => n.fret));
  const maxFret = Math.max(...scaleData.notes.map(n => n.fret));
  const numFrets = maxFret - minFret + 2; // Add buffer
  const startFret = minFret;

  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 10;
  const paddingRight = 10;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = height - paddingTop - paddingBottom - 30;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];

  // All strings sound in scales
  const renderStrings = () =>
    stringNames.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.5;
      
      return (
        <G key={`s-${i}`}>
          {isActive && (
            <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
              stroke={COLORS_SCHEME.NOTE} strokeWidth={thickness + 6} opacity={0.3} />
          )}
          <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
            stroke={isActive ? COLORS_SCHEME.NOTE : '#B8977E'} strokeWidth={thickness} />
        </G>
      );
    });

  const renderFrets = () => {
    const frets = [];
    for (let i = 0; i <= numFrets; i++) {
      const x = paddingLeft + i * fretWidth;
      const isNut = startFret === 0 && i === 0;
      frets.push(
        <Line key={`f-${i}`} x1={x} y1={paddingTop} x2={x} y2={paddingTop + fretboardHeight}
          stroke={isNut ? '#D4D4D4' : '#5A5A5A'} strokeWidth={isNut ? 5 : 2} />
      );
    }
    return frets;
  };

  const renderFretMarkers = () => {
    const markers = [];
    const markerFrets = [3, 5, 7, 9, 12];
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

  // Render ALL scale notes
  const renderScaleNotes = () => {
    return scaleData.notes.map((note, idx) => {
      const fretIndex = note.fret - startFret + 1; // +1 because fret 5 is after the nut line
      if (fretIndex < 1 || fretIndex > numFrets) return null;
      
      const x = paddingLeft + (fretIndex - 0.5) * fretWidth;
      const y = paddingTop + note.string * stringSpacing;
      const color = note.isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE;
      
      return (
        <G key={`n-${idx}`}>
          {isActive && <Circle cx={x} cy={y} r={16} fill={color} opacity={0.25} />}
          <Circle cx={x} cy={y} r={12} fill={isActive ? color : '#2A2A2A'} stroke={color} strokeWidth={2} />
        </G>
      );
    });
  };

  // Finger number overlays
  const renderFingerOverlays = () => {
    return scaleData.notes.map((note, idx) => {
      const fretIndex = note.fret - startFret;
      if (fretIndex < 0 || fretIndex > numFrets) return null;
      
      const xPct = ((paddingLeft + (fretIndex - 0.5) * fretWidth) / width) * 100;
      const yPct = ((paddingTop + note.string * stringSpacing) / (height - 30)) * 100;
      
      return (
        <View key={`fo-${idx}`} style={[styles.fingerOverlay, {
          left: `${xPct}%`, top: `${yPct}%`,
          transform: [{ translateX: -6 }, { translateY: -7 }]
        }]}>
          <Text style={[styles.fingerText, note.isRoot && styles.rootFingerText]}>{note.finger}</Text>
        </View>
      );
    });
  };

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: numFrets }, (_, i) => (
        <Text key={`fn-${i}`} style={styles.fretNum}>{startFret + i + 1}</Text>
      ))}
    </View>
  );

  // String status indicators (all green for scales - all strings used)
  const renderStringIndicators = () => (
    <View style={styles.indicatorRow}>
      {stringNames.map((name, i) => (
        <View key={i} style={styles.indFretted}>
          <Text style={styles.indTextFretted}>{name}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* String indicators */}
      {renderStringIndicators()}
      
      {/* Fretboard */}
      <View style={styles.svgContainer}>
        <Svg width={width} height={height - 60}>
          <Rect x={paddingLeft} y={paddingTop} width={fretboardWidth} height={fretboardHeight}
            fill="#1E1810" rx={4} />
          {renderFretMarkers()}
          {renderFrets()}
          {renderStrings()}
          {renderScaleNotes()}
        </Svg>
        {renderFingerOverlays()}
      </View>
      
      {/* Fret numbers */}
      {renderFretNumbers()}
      
      {/* Start fret */}
      <Text style={styles.startFret}>Desde traste {startFret}</Text>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz (A)</Text>
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
  errorText: { color: COLORS.error, fontSize: 14 },
  
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  indFretted: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indTextFretted: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  svgContainer: { position: 'relative' },
  
  fingerOverlay: {
    position: 'absolute', width: 12, height: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  fingerText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  rootFingerText: { color: '#FFF' },
  
  fretNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: -5,
  },
  fretNum: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  
  startFret: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
  
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: COLORS.textMuted },
});
