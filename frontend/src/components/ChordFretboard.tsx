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
  UNUSED: '#4A4A4A',     // GREY - not used
};

/**
 * CHORD FRETBOARD - Premium visualization
 * 
 * STRING COLOR CODING:
 * - GREEN = must sound (play this string)
 * - RED = must NOT sound (mute this string)
 * - GREY = not used in this exercise
 * 
 * Features:
 * - Clear finger numbers (1-4) on fretted notes
 * - Fret numbers below fretboard
 * - String names on left
 * - Open strings marked with O
 * - Muted strings marked with X in RED
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

  const paddingTop = 35;
  const paddingBottom = 40;
  const paddingLeft = 40;
  const paddingRight = 20;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = height - paddingTop - paddingBottom;
  const numFrets = 5;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const startFret = shapeData.startFret || 0;

  // Determine string state: 'sound', 'muted', or 'unused'
  const getStringState = (stringIndex: number): 'sound' | 'muted' | 'unused' => {
    const fret = shapeData.frets[stringIndex];
    if (fret === null) return 'muted';  // Explicitly muted (X)
    return 'sound';  // Open (0) or fretted = should sound
  };

  // Get string color based on state
  const getStringColor = (stringIndex: number): string => {
    const state = getStringState(stringIndex);
    switch (state) {
      case 'sound': return STRING_COLORS.SOUND;
      case 'muted': return STRING_COLORS.MUTED;
      default: return STRING_COLORS.UNUSED;
    }
  };

  // Render strings with color coding
  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + (i * 0.5);
      const stringColor = getStringColor(i);
      const state = getStringState(i);
      const isActiveString = isActive && state === 'sound';
      
      return (
        <G key={`string-${i}`}>
          {/* String glow effect when active */}
          {isActiveString && (
            <Line
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke={stringColor}
              strokeWidth={thickness + 6}
              opacity={0.3}
            />
          )}
          {/* Main string line */}
          <Line
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            stroke={isActiveString ? stringColor : (state === 'muted' ? STRING_COLORS.MUTED : '#8B7355')}
            strokeWidth={isActiveString ? thickness + 1 : thickness}
          />
          {/* String name with color indicator */}
          <Circle
            cx={paddingLeft - 22}
            cy={y}
            r={12}
            fill={state === 'muted' ? STRING_COLORS.MUTED + '30' : STRING_COLORS.SOUND + '30'}
            stroke={state === 'muted' ? STRING_COLORS.MUTED : STRING_COLORS.SOUND}
            strokeWidth={2}
          />
          <SvgText
            x={paddingLeft - 22}
            y={y + 5}
            fill={state === 'muted' ? STRING_COLORS.MUTED : STRING_COLORS.SOUND}
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
          >
            {name}
          </SvgText>
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
          strokeWidth={isNut ? 7 : 2}
        />
      );
      
      // Fret number below
      if (i > 0) {
        const fretNum = startFret + i;
        frets.push(
          <SvgText
            key={`fret-num-${i}`}
            x={x - fretWidth / 2}
            y={height - 10}
            fill={COLORS.textMuted}
            fontSize={13}
            fontWeight="700"
            textAnchor="middle"
          >
            {fretNum}
          </SvgText>
        );
      }
    }
    
    // Position marker if not starting at nut
    if (startFret > 0) {
      frets.push(
        <SvgText
          key="position"
          x={paddingLeft - 22}
          y={height - 10}
          fill={COLORS.primary}
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
        >
          {startFret}fr
        </SvgText>
      );
    }
    
    return frets;
  };

  // Render fret markers (dots at 3, 5, 7, 9, 12)
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
            <Circle key={`marker-${i}-1`} cx={x} cy={paddingTop + stringSpacing * 1.5} r={5} fill="#3A3A3A" />,
            <Circle key={`marker-${i}-2`} cx={x} cy={paddingTop + stringSpacing * 3.5} r={5} fill="#3A3A3A" />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={paddingTop + fretboardHeight / 2} r={5} fill="#3A3A3A" />
          );
        }
      }
    }
    return markers;
  };

  // Render note markers
  const renderNotes = () => {
    const notes = [];
    
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const fret = shapeData.frets[stringIndex];
      const finger = shapeData.fingers[stringIndex];
      const y = paddingTop + stringIndex * stringSpacing;
      const state = getStringState(stringIndex);
      
      // Muted string - big red X
      if (fret === null) {
        notes.push(
          <G key={`mute-${stringIndex}`}>
            <Circle
              cx={paddingLeft - 22}
              cy={y}
              r={12}
              fill={STRING_COLORS.MUTED + '30'}
              stroke={STRING_COLORS.MUTED}
              strokeWidth={2}
            />
            <SvgText
              x={paddingLeft - 22}
              y={y + 1}
              fill={STRING_COLORS.MUTED}
              fontSize={16}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              ✕
            </SvgText>
          </G>
        );
        continue;
      }
      
      const fretIndex = fret - startFret;
      
      // Open string (fret 0)
      if (fret === 0) {
        notes.push(
          <G key={`open-${stringIndex}`}>
            <Circle
              cx={paddingLeft - 22}
              cy={y}
              r={12}
              fill={STRING_COLORS.SOUND + '30'}
              stroke={STRING_COLORS.SOUND}
              strokeWidth={2}
            />
            <SvgText
              x={paddingLeft - 22}
              y={y + 5}
              fill={STRING_COLORS.SOUND}
              fontSize={12}
              fontWeight="bold"
              textAnchor="middle"
            >
              {stringNames[stringIndex]}
            </SvgText>
          </G>
        );
      } else {
        // Fretted note
        const x = paddingLeft + (fretIndex - 0.5) * fretWidth;
        
        notes.push(
          <G key={`note-${stringIndex}`}>
            {/* Glow effect when active */}
            {isActive && (
              <Circle cx={x} cy={y} r={22} fill={STRING_COLORS.SOUND} opacity={0.25} />
            )}
            {/* Note circle */}
            <Circle
              cx={x}
              cy={y}
              r={17}
              fill={isActive ? STRING_COLORS.SOUND : '#2A2A2A'}
              stroke={STRING_COLORS.SOUND}
              strokeWidth={2.5}
            />
            {/* Finger number */}
            {finger !== null && finger !== 0 && (
              <SvgText
                x={x}
                y={y + 6}
                fill="#FFFFFF"
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
              >
                {finger}
              </SvgText>
            )}
          </G>
        );
      }
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
        {renderNotes()}
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
