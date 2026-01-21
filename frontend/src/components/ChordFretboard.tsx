import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';
import { CHORD_SHAPES, ChordShape } from '../data/curriculum';

interface ChordFretboardProps {
  shape: ChordShape;
  width?: number;
  height?: number;
  isActive?: boolean;
  currentBeat?: number;
}

// String colors for visual clarity
const STRING_COLORS = {
  SOUND: '#00D68F',      // Bright GREEN - must sound
  MUTED: '#FF4757',      // Bright RED - must NOT sound
};

/**
 * CHORD FRETBOARD - Premium visualization with separate indicator column
 */
export const ChordFretboard: React.FC<ChordFretboardProps> = ({
  shape,
  width = 320,
  height = 220,
  isActive = false,
  currentBeat = 0,
}) => {
  const shapeData = CHORD_SHAPES[shape];
  if (!shapeData) {
    return null;
  }

  const indicatorColumnWidth = 36;
  const fretboardOnlyWidth = width - indicatorColumnWidth;
  
  const paddingTop = 25;
  const paddingBottom = 25;
  const paddingLeft = 10;
  const paddingRight = 10;
  
  const fretboardWidth = fretboardOnlyWidth - paddingLeft - paddingRight;
  const fretboardHeight = height - paddingTop - paddingBottom;
  const numFrets = 5;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const startFret = shapeData.startFret || 0;

  // Determine string state
  const getStringState = (stringIndex: number): 'sound' | 'muted' => {
    const fret = shapeData.frets[stringIndex];
    if (fret === null) return 'muted';
    return 'sound';
  };

  // Render string indicators as React Native views (OUTSIDE SVG)
  const renderStringIndicators = () => {
    return stringNames.map((name, i) => {
      const fret = shapeData.frets[i];
      const state = getStringState(i);
      
      if (fret === null) {
        // MUTED - RED X
        return (
          <View key={`ind-${i}`} style={[styles.indicator, styles.indicatorMuted]}>
            <Text style={styles.indicatorTextMuted}>X</Text>
          </View>
        );
      } else if (fret === 0) {
        // OPEN - GREEN O
        return (
          <View key={`ind-${i}`} style={[styles.indicator, styles.indicatorOpen]}>
            <Text style={styles.indicatorTextOpen}>O</Text>
          </View>
        );
      } else {
        // FRETTED - GREEN filled with string name
        return (
          <View key={`ind-${i}`} style={[styles.indicator, styles.indicatorFretted]}>
            <Text style={styles.indicatorTextFretted}>{name}</Text>
          </View>
        );
      }
    });
  };

  // Render strings with color coding
  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = paddingTop + i * stringSpacing;
      const baseThickness = 1.5 + (i * 0.5);
      const state = getStringState(i);
      const isMuted = state === 'muted';
      const isActiveString = isActive && !isMuted;
      
      const stringColor = isMuted ? STRING_COLORS.MUTED : '#B8977E';
      const glowColor = isMuted ? STRING_COLORS.MUTED : STRING_COLORS.SOUND;
      
      return (
        <G key={`string-${i}`}>
          {/* Glow effect */}
          {(isMuted || isActiveString) && (
            <Line
              x1={paddingLeft}
              y1={y}
              x2={fretboardOnlyWidth - paddingRight}
              y2={y}
              stroke={glowColor}
              strokeWidth={baseThickness + 6}
              opacity={isMuted ? 0.35 : (isActiveString ? 0.4 : 0)}
            />
          )}
          {/* Main string */}
          <Line
            x1={paddingLeft}
            y1={y}
            x2={fretboardOnlyWidth - paddingRight}
            y2={y}
            stroke={stringColor}
            strokeWidth={baseThickness}
          />
        </G>
      );
    });
  };

  // Render frets
  const renderFrets = () => {
    const frets = [];
    for (let i = 0; i <= numFrets; i++) {
      const x = paddingLeft + i * fretWidth;
      const isNut = startFret === 0 && i === 0;
      
      frets.push(
        <Line
          key={`fret-${i}`}
          x1={x}
          y1={paddingTop}
          x2={x}
          y2={paddingTop + fretboardHeight}
          stroke={isNut ? '#D4D4D4' : '#5A5A5A'}
          strokeWidth={isNut ? 5 : 2}
        />
      );
      
      if (i > 0) {
        const fretNum = startFret + i;
        frets.push(
          <SvgText
            key={`fret-num-${i}`}
            x={x - fretWidth / 2}
            y={height - 6}
            fill={COLORS.textMuted}
            fontSize={11}
            fontWeight="600"
            textAnchor="middle"
          >
            {fretNum}
          </SvgText>
        );
      }
    }
    
    if (startFret > 0) {
      frets.push(
        <SvgText
          key="position"
          x={paddingLeft + 5}
          y={height - 6}
          fill={COLORS.primary}
          fontSize={10}
          fontWeight="bold"
          textAnchor="start"
        >
          {startFret}fr
        </SvgText>
      );
    }
    
    return frets;
  };

  // Render fret markers
  const renderFretMarkers = () => {
    const markers = [];
    const markerFrets = [3, 5, 7, 9, 12];
    
    for (let i = 1; i <= numFrets; i++) {
      const fretNum = startFret + i;
      if (markerFrets.includes(fretNum)) {
        const x = paddingLeft + (i - 0.5) * fretWidth;
        const isDouble = fretNum === 12;
        
        if (isDouble) {
          markers.push(
            <Circle key={`marker-${i}-1`} cx={x} cy={paddingTop + stringSpacing * 1.5} r={4} fill="#3A3A3A" />,
            <Circle key={`marker-${i}-2`} cx={x} cy={paddingTop + stringSpacing * 3.5} r={4} fill="#3A3A3A" />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={paddingTop + fretboardHeight / 2} r={4} fill="#3A3A3A" />
          );
        }
      }
    }
    return markers;
  };

  // Render finger dots
  const renderFingerDots = () => {
    const notes = [];
    
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const fret = shapeData.frets[stringIndex];
      const finger = shapeData.fingers[stringIndex];
      const y = paddingTop + stringIndex * stringSpacing;
      
      // Skip muted and open strings - they don't have dots on fretboard
      if (fret === null || fret === 0) continue;
      
      const fretIndex = fret - startFret;
      const x = paddingLeft + (fretIndex - 0.5) * fretWidth;
      
      notes.push(
        <G key={`note-${stringIndex}`}>
          {isActive && (
            <Circle cx={x} cy={y} r={18} fill={STRING_COLORS.SOUND} opacity={0.25} />
          )}
          <Circle
            cx={x}
            cy={y}
            r={14}
            fill={isActive ? STRING_COLORS.SOUND : '#2A2A2A'}
            stroke={STRING_COLORS.SOUND}
            strokeWidth={2}
          />
          {finger !== null && finger !== 0 && (
            <SvgText
              x={x}
              y={y + 5}
              fill="#FFFFFF"
              fontSize={13}
              fontWeight="bold"
              textAnchor="middle"
            >
              {finger}
            </SvgText>
          )}
        </G>
      );
    }
    
    return notes;
  };

  return (
    <View style={styles.container}>
      <View style={styles.fretboardRow}>
        {/* Left indicator column */}
        <View style={[styles.indicatorColumn, { height: fretboardHeight, marginTop: paddingTop }]}>
          {renderStringIndicators()}
        </View>
        
        {/* Fretboard SVG */}
        <Svg width={fretboardOnlyWidth} height={height}>
          <Rect
            x={paddingLeft}
            y={paddingTop}
            width={fretboardWidth}
            height={fretboardHeight}
            fill="#1E1810"
            rx={4}
          />
          {renderFretMarkers()}
          {renderFrets()}
          {renderStrings()}
          {renderFingerDots()}
        </Svg>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: STRING_COLORS.SOUND }]} />
          <Text style={styles.legendText}>Suena</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: STRING_COLORS.MUTED }]} />
          <Text style={styles.legendText}>Silenciar</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  fretboardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicatorColumn: {
    width: 36,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorMuted: {
    backgroundColor: STRING_COLORS.MUTED,
  },
  indicatorOpen: {
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: STRING_COLORS.SOUND,
  },
  indicatorFretted: {
    backgroundColor: STRING_COLORS.SOUND,
  },
  indicatorTextMuted: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  indicatorTextOpen: {
    color: STRING_COLORS.SOUND,
    fontSize: 13,
    fontWeight: 'bold',
  },
  indicatorTextFretted: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
