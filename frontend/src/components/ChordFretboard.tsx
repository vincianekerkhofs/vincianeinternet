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
  SOUND: '#22C55E',      // GREEN - must sound
  MUTED: '#EF4444',      // RED - must NOT sound
  UNUSED: '#6B6B6B',     // GREY - not used
};

/**
 * CHORD FRETBOARD - Premium visualization
 * 
 * STRING COLOR CODING:
 * - GREEN = must sound (play this string)
 * - RED = must NOT sound (mute this string)
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

  const paddingTop = 45;  // Extra space for top indicators
  const paddingBottom = 30;
  const paddingLeft = 15;
  const paddingRight = 15;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
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

  // Render TOP indicators for each string - O, X, or finger number
  const renderTopIndicators = () => {
    const indicators = [];
    
    for (let i = 0; i < 6; i++) {
      const fret = shapeData.frets[i];
      // Calculate X position to align with strings
      const x = paddingLeft + (fretWidth / 2) + (i * (fretboardWidth - fretWidth) / 5);
      const y = paddingTop - 20;
      const state = getStringState(i);
      
      if (fret === null) {
        // MUTED - RED X at top
        indicators.push(
          <G key={`top-${i}`}>
            <Circle cx={x} cy={y} r={14} fill={STRING_COLORS.MUTED} />
            <SvgText
              x={x}
              y={y + 5}
              fill="#FFFFFF"
              fontSize={16}
              fontWeight="bold"
              textAnchor="middle"
            >
              ✕
            </SvgText>
          </G>
        );
      } else if (fret === 0) {
        // OPEN STRING - GREEN O at top
        indicators.push(
          <G key={`top-${i}`}>
            <Circle cx={x} cy={y} r={14} fill="none" stroke={STRING_COLORS.SOUND} strokeWidth={2.5} />
            <SvgText
              x={x}
              y={y + 5}
              fill={STRING_COLORS.SOUND}
              fontSize={14}
              fontWeight="bold"
              textAnchor="middle"
            >
              O
            </SvgText>
          </G>
        );
      } else {
        // FRETTED - GREEN filled circle at top with string name
        indicators.push(
          <G key={`top-${i}`}>
            <Circle cx={x} cy={y} r={14} fill={STRING_COLORS.SOUND} />
            <SvgText
              x={x}
              y={y + 5}
              fill="#FFFFFF"
              fontSize={11}
              fontWeight="bold"
              textAnchor="middle"
            >
              {stringNames[i]}
            </SvgText>
          </G>
        );
      }
    }
    return indicators;
  };

  // Render strings with color coding
  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + (i * 0.5);
      const state = getStringState(i);
      const isActiveString = isActive && state === 'sound';
      
      const lineColor = state === 'muted' 
        ? STRING_COLORS.MUTED 
        : isActiveString 
          ? STRING_COLORS.SOUND 
          : '#9D8B78';
      
      return (
        <G key={`string-${i}`}>
          {/* Glow when active */}
          {isActiveString && (
            <Line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke={STRING_COLORS.SOUND}
              strokeWidth={thickness + 8}
              opacity={0.35}
            />
          )}
          {/* Red glow for muted */}
          {state === 'muted' && (
            <Line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke={STRING_COLORS.MUTED}
              strokeWidth={thickness + 5}
              opacity={0.25}
            />
          )}
          {/* Main string */}
          <Line
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            stroke={lineColor}
            strokeWidth={thickness}
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
          strokeWidth={isNut ? 6 : 2}
        />
      );
      
      if (i > 0) {
        const fretNum = startFret + i;
        frets.push(
          <SvgText
            key={`fret-num-${i}`}
            x={x - fretWidth / 2}
            y={height - 8}
            fill={COLORS.textMuted}
            fontSize={12}
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
          y={height - 8}
          fill={COLORS.primary}
          fontSize={11}
          fontWeight="bold"
          textAnchor="start"
        >
          Traste {startFret}
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
      
      if (fret === null || fret === 0) continue;
      
      const fretIndex = fret - startFret;
      const x = paddingLeft + (fretIndex - 0.5) * fretWidth;
      
      notes.push(
        <G key={`note-${stringIndex}`}>
          {isActive && (
            <Circle cx={x} cy={y} r={20} fill={STRING_COLORS.SOUND} opacity={0.25} />
          )}
          <Circle
            cx={x}
            cy={y}
            r={16}
            fill={isActive ? STRING_COLORS.SOUND : '#2A2A2A'}
            stroke={STRING_COLORS.SOUND}
            strokeWidth={2.5}
          />
          {finger !== null && finger !== 0 && (
            <SvgText
              x={x}
              y={y + 6}
              fill="#FFFFFF"
              fontSize={15}
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
      <Svg width={width} height={height}>
        {/* Fretboard background */}
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
        {renderTopIndicators()}
      </Svg>
      
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
