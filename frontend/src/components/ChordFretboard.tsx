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

// String colors for visual clarity
const COLORS_SCHEME = {
  SOUND: '#00D68F',      // Bright GREEN - must sound
  MUTED: '#FF4757',      // Bright RED - must NOT sound
};

/**
 * CHORD FRETBOARD - Premium visualization
 * 
 * STRING COLOR CODING:
 * - GREEN = must sound (play this string)  
 * - RED = must NOT sound (mute this string)
 * 
 * Indicators shown as React Native Views on the left side
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

  const indicatorColumnWidth = 38;
  const svgWidth = width - indicatorColumnWidth;
  
  const paddingTop = 20;
  const paddingBottom = 25;
  const paddingLeft = 5;
  const paddingRight = 10;
  
  const fretboardWidth = svgWidth - paddingLeft - paddingRight;
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

  // Render string indicators as React Native views
  const renderIndicatorColumn = () => {
    return (
      <View style={[styles.indicatorColumn, { height: fretboardHeight, marginTop: paddingTop }]}>
        {stringNames.map((name, i) => {
          const fret = shapeData.frets[i];
          
          if (fret === null) {
            // MUTED - RED X
            return (
              <View key={`ind-${i}`} style={styles.indicatorMuted}>
                <Text style={styles.indicatorTextMuted}>X</Text>
              </View>
            );
          } else if (fret === 0) {
            // OPEN - GREEN O
            return (
              <View key={`ind-${i}`} style={styles.indicatorOpen}>
                <Text style={styles.indicatorTextOpen}>O</Text>
              </View>
            );
          } else {
            // FRETTED - GREEN filled
            return (
              <View key={`ind-${i}`} style={styles.indicatorFretted}>
                <Text style={styles.indicatorTextFretted}>{name}</Text>
              </View>
            );
          }
        })}
      </View>
    );
  };

  // Render strings
  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = paddingTop + i * stringSpacing;
      const baseThickness = 1.5 + (i * 0.5);
      const state = getStringState(i);
      const isMuted = state === 'muted';
      const isActiveString = isActive && !isMuted;
      
      const stringColor = isMuted ? COLORS_SCHEME.MUTED : '#B8977E';
      const glowColor = isMuted ? COLORS_SCHEME.MUTED : COLORS_SCHEME.SOUND;
      
      return (
        <G key={`string-${i}`}>
          {/* Glow effect */}
          {(isMuted || isActiveString) && (
            <Line
              x1={paddingLeft}
              y1={y}
              x2={svgWidth - paddingRight}
              y2={y}
              stroke={glowColor}
              strokeWidth={baseThickness + 6}
              opacity={isMuted ? 0.35 : 0.4}
            />
          )}
          {/* Main string */}
          <Line
            x1={paddingLeft}
            y1={y}
            x2={svgWidth - paddingRight}
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
      
      if (fret === null || fret === 0) continue;
      
      const fretIndex = fret - startFret;
      const x = paddingLeft + (fretIndex - 0.5) * fretWidth;
      
      notes.push(
        <G key={`note-${stringIndex}`}>
          {isActive && (
            <Circle cx={x} cy={y} r={18} fill={COLORS_SCHEME.SOUND} opacity={0.25} />
          )}
          <Circle
            cx={x}
            cy={y}
            r={14}
            fill={isActive ? COLORS_SCHEME.SOUND : '#2A2A2A'}
            stroke={COLORS_SCHEME.SOUND}
            strokeWidth={2}
          />
        </G>
      );
    }
    
    return notes;
  };

  // Render fret numbers as React Native Text
  const renderFretNumbers = () => {
    const nums = [];
    for (let i = 1; i <= numFrets; i++) {
      const fretNum = startFret + i;
      nums.push(
        <Text key={`fnum-${i}`} style={styles.fretNumber}>
          {fretNum}
        </Text>
      );
    }
    return nums;
  };

  // Render finger numbers as overlay
  const renderFingerNumbers = () => {
    const fingerViews = [];
    
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const fret = shapeData.frets[stringIndex];
      const finger = shapeData.fingers[stringIndex];
      
      if (fret === null || fret === 0 || finger === null || finger === 0) continue;
      
      const fretIndex = fret - startFret;
      const x = paddingLeft + (fretIndex - 0.5) * fretWidth - 8;
      const y = paddingTop + stringIndex * stringSpacing - 8;
      
      fingerViews.push(
        <View 
          key={`finger-${stringIndex}`} 
          style={[styles.fingerNumber, { left: x + indicatorColumnWidth, top: y }]}
        >
          <Text style={styles.fingerNumberText}>{finger}</Text>
        </View>
      );
    }
    
    return fingerViews;
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        {/* Left indicator column */}
        {renderIndicatorColumn()}
        
        {/* Fretboard */}
        <View style={styles.fretboardWrapper}>
          <Svg width={svgWidth} height={height - 20}>
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
          
          {/* Finger numbers overlay */}
          {renderFingerNumbers()}
          
          {/* Fret numbers */}
          <View style={styles.fretNumberRow}>
            {renderFretNumbers()}
          </View>
        </View>
      </View>
      
      {/* Start fret indicator */}
      {startFret > 0 && (
        <Text style={styles.startFret}>Traste {startFret}</Text>
      )}
      
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
  container: {
    alignItems: 'center',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicatorColumn: {
    width: 38,
    justifyContent: 'space-between',
    paddingVertical: 0,
  },
  indicatorMuted: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF4757',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorOpen: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#00D68F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorFretted: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00D68F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorTextMuted: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorTextOpen: {
    color: '#00D68F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  indicatorTextFretted: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fretboardWrapper: {
    position: 'relative',
  },
  fretNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: -5,
  },
  fretNumber: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    width: 20,
    textAlign: 'center',
  },
  fingerNumber: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerNumberText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  startFret: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 4,
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
