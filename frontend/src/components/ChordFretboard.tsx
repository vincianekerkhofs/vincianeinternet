import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G } from 'react-native-svg';
import { CHORD_SHAPES, ChordShape } from '../data/curriculum';

interface ChordFretboardProps {
  shape: ChordShape;
  width?: number;
  height?: number;
  isActive?: boolean;
  currentBeat?: number;
}

const COLORS_SCHEME = {
  SOUND: '#00D68F',
  MUTED: '#FF4757',
};

export const ChordFretboard: React.FC<ChordFretboardProps> = ({
  shape,
  width = 320,
  height = 220,
  isActive = false,
}) => {
  const shapeData = CHORD_SHAPES[shape];
  if (!shapeData) {
    return null;
  }

  const svgHeight = height - 60; // Reserve space for top indicators and legend
  const paddingTop = 15;
  const paddingBottom = 20;
  const paddingLeft = 10;
  const paddingRight = 10;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const numFrets = 5;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const startFret = shapeData.startFret || 0;

  const getStringState = (i: number) => shapeData.frets[i] === null ? 'muted' : 'sound';

  // TOP ROW: String status indicators (O, X, or filled circle)
  const renderTopIndicators = () => (
    <View style={styles.indicatorRow}>
      {stringNames.map((name, i) => {
        const fret = shapeData.frets[i];
        
        if (fret === null) {
          return (
            <View key={i} style={styles.indMuted}>
              <Text style={styles.indTextMuted}>X</Text>
            </View>
          );
        } else if (fret === 0) {
          return (
            <View key={i} style={styles.indOpen}>
              <Text style={styles.indTextOpen}>O</Text>
            </View>
          );
        } else {
          return (
            <View key={i} style={styles.indFretted}>
              <Text style={styles.indTextFretted}>{name}</Text>
            </View>
          );
        }
      })}
    </View>
  );

  // SVG: Fretboard with strings and finger dots
  const renderStrings = () =>
    stringNames.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.5;
      const state = getStringState(i);
      const isMuted = state === 'muted';
      const isActiveString = isActive && !isMuted;
      const color = isMuted ? COLORS_SCHEME.MUTED : (isActiveString ? COLORS_SCHEME.SOUND : '#B8977E');
      
      return (
        <G key={`s-${i}`}>
          {(isMuted || isActiveString) && (
            <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
              stroke={isMuted ? COLORS_SCHEME.MUTED : COLORS_SCHEME.SOUND}
              strokeWidth={thickness + 6} opacity={isMuted ? 0.3 : 0.4} />
          )}
          <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y}
            stroke={color} strokeWidth={thickness} />
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

  const renderFingerDots = () => {
    const dots = [];
    for (let i = 0; i < 6; i++) {
      const fret = shapeData.frets[i];
      const finger = shapeData.fingers[i];
      if (fret === null || fret === 0) continue;
      
      const fretIndex = fret - startFret;
      const x = paddingLeft + (fretIndex - 0.5) * fretWidth;
      const y = paddingTop + i * stringSpacing;
      
      dots.push(
        <G key={`d-${i}`}>
          {isActive && <Circle cx={x} cy={y} r={18} fill={COLORS_SCHEME.SOUND} opacity={0.25} />}
          <Circle cx={x} cy={y} r={14} fill={isActive ? COLORS_SCHEME.SOUND : '#2A2A2A'}
            stroke={COLORS_SCHEME.SOUND} strokeWidth={2} />
        </G>
      );
    }
    return dots;
  };

  // Finger number overlays
  const renderFingerOverlays = () => {
    const overlays = [];
    for (let i = 0; i < 6; i++) {
      const fret = shapeData.frets[i];
      const finger = shapeData.fingers[i];
      if (!fret || fret === 0 || !finger || finger === 0) continue;
      
      const fretIndex = fret - startFret;
      const xPercent = ((paddingLeft + (fretIndex - 0.5) * fretWidth) / width) * 100;
      const yPercent = ((paddingTop + i * stringSpacing) / svgHeight) * 100;
      
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

  // Fret numbers row
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: numFrets }, (_, i) => (
        <Text key={`fn-${i}`} style={styles.fretNum}>{startFret + i + 1}</Text>
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
          {renderFretMarkers()}
          {renderFrets()}
          {renderStrings()}
          {renderFingerDots()}
        </Svg>
        {renderFingerOverlays()}
      </View>
      
      {/* Fret numbers */}
      {renderFretNumbers()}
      
      {/* Start fret indicator */}
      {startFret > 0 && <Text style={styles.startFret}>Desde traste {startFret}</Text>}
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.SOUND }]} />
          <Text style={styles.legendText}>Suena</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.MUTED }]} />
          <Text style={styles.legendText}>Silenciar</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  
  // Top indicator row
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  indMuted: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FF4757',
    alignItems: 'center', justifyContent: 'center',
  },
  indOpen: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 2.5, borderColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indFretted: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#00D68F',
    alignItems: 'center', justifyContent: 'center',
  },
  indTextMuted: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  indTextOpen: { color: '#00D68F', fontSize: 13, fontWeight: 'bold' },
  indTextFretted: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  // SVG container
  svgContainer: { position: 'relative' },
  
  // Finger overlays
  fingerOverlay: {
    position: 'absolute', width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  fingerText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  
  // Fret numbers
  fretNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: -5,
  },
  fretNum: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  
  startFret: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
  
  // Legend
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 12, color: COLORS.textMuted },
});
