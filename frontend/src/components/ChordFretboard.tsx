import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';
import { CHORD_SHAPES, ChordShape } from '../data/curriculum';

interface ChordFretboardProps {
  shape: ChordShape;
  width?: number;
  height?: number;
  isActive?: boolean;
}

/**
 * CHORD FRETBOARD - Clean, minimal visualization
 * Shows one chord shape with fingering numbers
 * Fret numbers below, string names on left
 */
export const ChordFretboard: React.FC<ChordFretboardProps> = ({
  shape,
  width = 320,
  height = 200,
  isActive = false,
}) => {
  const shapeData = CHORD_SHAPES[shape];
  if (!shapeData) {
    return null;
  }

  const paddingTop = 30;
  const paddingBottom = 35;
  const paddingLeft = 30;
  const paddingRight = 15;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = height - paddingTop - paddingBottom;
  const numFrets = 5;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const startFret = shapeData.startFret || 0;

  // Render strings
  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1 + (i * 0.4);
      const fret = shapeData.frets[i];
      const hasNote = fret !== null;
      
      return (
        <G key={`string-${i}`}>
          <Line
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            stroke={hasNote && isActive ? COLORS.primary : '#8B7355'}
            strokeWidth={thickness}
          />
          <SvgText
            x={paddingLeft - 15}
            y={y + 5}
            fill={COLORS.textSecondary}
            fontSize={13}
            fontWeight="600"
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
          stroke={isNut ? '#E0E0E0' : '#5A5A5A'}
          strokeWidth={isNut ? 6 : 2}
        />
      );
      
      // Fret number below
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
    
    // Position marker if not starting at nut
    if (startFret > 0) {
      frets.push(
        <SvgText
          key="position"
          x={paddingLeft - 15}
          y={height - 8}
          fill={COLORS.primary}
          fontSize={11}
          fontWeight="bold"
          textAnchor="middle"
        >
          {startFret}fr
        </SvgText>
      );
    }
    
    return frets;
  };

  // Render note markers
  const renderNotes = () => {
    const notes = [];
    
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      const fret = shapeData.frets[stringIndex];
      const finger = shapeData.fingers[stringIndex];
      const y = paddingTop + stringIndex * stringSpacing;
      
      // Muted string (X)
      if (fret === null) {
        notes.push(
          <SvgText
            key={`mute-${stringIndex}`}
            x={paddingLeft - 15}
            y={y + 5}
            fill={COLORS.textMuted}
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
          >
            ✕
          </SvgText>
        );
        continue;
      }
      
      // Open string (O) or fretted note
      const fretIndex = fret - startFret;
      let x: number;
      
      if (fret === 0) {
        // Open string marker
        x = paddingLeft - 15;
        notes.push(
          <Circle
            key={`open-${stringIndex}`}
            cx={x}
            cy={y}
            r={8}
            fill="transparent"
            stroke={COLORS.text}
            strokeWidth={2}
          />
        );
      } else {
        // Fretted note
        x = paddingLeft + (fretIndex - 0.5) * fretWidth;
        
        // Note circle
        notes.push(
          <G key={`note-${stringIndex}`}>
            {isActive && (
              <Circle cx={x} cy={y} r={20} fill={COLORS.primary} opacity={0.2} />
            )}
            <Circle
              cx={x}
              cy={y}
              r={16}
              fill={isActive ? COLORS.primary : '#3A3A3A'}
              stroke={isActive ? '#FFFFFF' : '#5A5A5A'}
              strokeWidth={2}
            />
            {/* Finger number */}
            {finger !== null && finger !== 0 && (
              <SvgText
                x={x}
                y={y + 5}
                fill="#FFFFFF"
                fontSize={14}
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
          fill="#2A2015"
          rx={4}
        />
        
        {renderFrets()}
        {renderStrings()}
        {renderNotes()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
