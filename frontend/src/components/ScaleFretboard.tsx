import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G, Text as SvgText } from 'react-native-svg';

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
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  // SVG dimensions
  const svgHeight = height - 100; // Space for indicators and legend
  const paddingTop = 10;
  const paddingBottom = 10;
  const paddingLeft = 15;
  const paddingRight = 15;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / NUM_FRETS;
  const stringSpacing = fretboardHeight / 5;

  // Check if string has root
  const stringHasRoot = (strIdx: number) => 
    scale.notes.some(n => n.s === strIdx && n.root);

  // Top indicators (same style as ChordFretboard)
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
      const thickness = 1.5 + i * 0.4;
      return (
        <Line key={`str-${i}`}
          x1={paddingLeft} y1={y}
          x2={width - paddingRight} y2={y}
          stroke="#B8977E" strokeWidth={thickness}
        />
      );
    });

  // SVG: Fret lines (vertical)
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

  // SVG: Note circles
  const renderNotes = () =>
    scale.notes.map((note, idx) => {
      const strIdx = note.s;
      const fretOffset = note.f;
      const isRoot = note.root === true;
      
      // Position at center of fret cell
      const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
      const y = paddingTop + strIdx * stringSpacing;
      const fill = isRoot ? THEME.ROOT : (isActive ? THEME.NOTE : '#2A2A2A');
      const stroke = isRoot ? THEME.ROOT : THEME.NOTE;
      
      // Debug: different colors for different fret offsets
      const debugColor = fretOffset === 0 ? '#FF0000' : fretOffset === 2 ? '#00FF00' : '#0000FF';
      
      return (
        <Circle key={`note-${idx}`} cx={x} cy={y} r={14} fill={debugColor} />
      );
    });

  // Finger number overlays (positioned absolutely over SVG)
  const renderFingerOverlays = () =>
    scale.notes.map((note, idx) => {
      const strIdx = note.s;
      const fretOffset = note.f;
      const finger = note.finger;
      
      const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
      const y = paddingTop + strIdx * stringSpacing;
      const xPercent = (x / width) * 100;
      const yPercent = (y / svgHeight) * 100;
      
      return (
        <View key={`fo-${idx}`} style={[styles.fingerOverlay, {
          left: `${xPercent}%`, top: `${yPercent}%`,
          transform: [{ translateX: -8 }, { translateY: -8 }]
        }]}>
          <Text style={styles.fingerText}>{finger}</Text>
        </View>
      );
    });

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: NUM_FRETS }, (_, i) => (
        <View key={i} style={[styles.fretNumCell, { width: fretWidth }]}>
          <Text style={styles.fretNumText}>{scale.start + i}</Text>
        </View>
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
      <Text style={styles.fingerHint}>1-4 = Dedos</Text>
    </View>
  );

  return (
    <View style={[styles.container, { width, backgroundColor: 'purple' }]}>
      {/* DEBUG INFO */}
      <Text style={{ color: '#FFF', backgroundColor: '#000', padding: 4 }}>
        Notes: {scale.notes.length} | Width: {width} | FretWidth: {fretWidth.toFixed(0)}
      </Text>
      
      {/* Top string indicators */}
      {renderTopIndicators()}
      
      {/* SVG Fretboard */}
      <View style={[styles.svgContainer, { width, height: svgHeight }]}>
        <Svg width={width} height={svgHeight}>
          <Rect x={paddingLeft} y={paddingTop} width={fretboardWidth} height={fretboardHeight}
            fill="#1E1810" rx={4} />
          {renderFrets()}
          {renderStrings()}
          {renderNotes()}
        </Svg>
        {/* Finger overlays on top of SVG */}
        {renderFingerOverlays()}
      </View>
      
      {/* Fret numbers */}
      <View style={{ marginLeft: paddingLeft }}>
        {renderFretNumbers()}
      </View>
      
      {/* Position text */}
      <Text style={styles.posText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      
      {/* Legend */}
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
  
  // Top indicators
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
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
  
  // SVG container
  svgContainer: {
    position: 'relative',
  },
  
  // Finger overlays
  fingerOverlay: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  
  // Fret numbers
  fretNumRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  fretNumCell: {
    alignItems: 'center',
  },
  fretNumText: {
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
  fingerHint: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
