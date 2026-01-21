import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';

export interface FretboardNote {
  stringIndex: number;  // 0=high e, 5=low E
  fret: number | null;  // null for muted
  isMute?: boolean;
  isActive?: boolean;   // Currently being played
  isPreview?: boolean;  // Next note preview
  finger?: number;
}

interface FretboardProps {
  notes?: FretboardNote[];
  currentNotes?: FretboardNote[];  // Currently active notes
  previewNotes?: FretboardNote[];  // Next notes preview
  width?: number;
  height?: number;
  startFret?: number;
  numFrets?: number;
}

export const Fretboard: React.FC<FretboardProps> = ({
  notes = [],
  currentNotes = [],
  previewNotes = [],
  width = 340,
  height = 160,
  startFret = 0,
  numFrets = 5,
}) => {
  const padding = 30;
  const fretWidth = (width - padding * 2) / numFrets;
  const stringSpacing = (height - padding * 2) / 5;
  
  // Standard guitar tuning: E A D G B e (low to high)
  // But displayed top to bottom as: e B G D A E
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = padding + i * stringSpacing;
      const thickness = 1 + (i * 0.3);
      
      // Check if this string has a current note
      const hasCurrentNote = currentNotes.some(n => n.stringIndex === i);
      
      return (
        <React.Fragment key={`string-${i}`}>
          <Line
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke={hasCurrentNote ? COLORS.stringHighlight : COLORS.string}
            strokeWidth={hasCurrentNote ? thickness + 1 : thickness}
          />
          <SvgText
            x={padding - 15}
            y={y + 4}
            fill={hasCurrentNote ? COLORS.primary : COLORS.textSecondary}
            fontSize={10}
            fontWeight={hasCurrentNote ? 'bold' : '500'}
          >
            {name}
          </SvgText>
        </React.Fragment>
      );
    });
  };

  const renderFrets = () => {
    const frets = [];
    for (let i = 0; i <= numFrets; i++) {
      const x = padding + i * fretWidth;
      const isNut = startFret === 0 && i === 0;
      frets.push(
        <Line
          key={`fret-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={height - padding}
          stroke={isNut ? COLORS.text : COLORS.fret}
          strokeWidth={isNut ? 4 : 2}
        />
      );
      
      // Fret number
      if (i > 0) {
        const fretNum = startFret + i;
        frets.push(
          <SvgText
            key={`fret-num-${i}`}
            x={x - fretWidth / 2}
            y={height - 8}
            fill={COLORS.textMuted}
            fontSize={10}
            textAnchor="middle"
          >
            {fretNum}
          </SvgText>
        );
      }
    }
    return frets;
  };

  const renderFretMarkers = () => {
    const markers = [];
    for (let i = 1; i <= numFrets; i++) {
      const fretNum = startFret + i;
      if (fretMarkers.includes(fretNum)) {
        const x = padding + (i - 0.5) * fretWidth;
        const isDouble = fretNum === 12;
        if (isDouble) {
          markers.push(
            <Circle key={`marker-${i}-1`} cx={x} cy={padding + stringSpacing * 1.5} r={4} fill={COLORS.textMuted} opacity={0.5} />,
            <Circle key={`marker-${i}-2`} cx={x} cy={padding + stringSpacing * 3.5} r={4} fill={COLORS.textMuted} opacity={0.5} />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={height / 2} r={4} fill={COLORS.textMuted} opacity={0.5} />
          );
        }
      }
    }
    return markers;
  };

  const renderNote = (note: FretboardNote, index: number, type: 'current' | 'preview' | 'static') => {
    const fret = note.fret ?? 0;
    const fretIndex = fret - startFret;
    
    // Skip notes outside visible range (with some tolerance)
    if (fretIndex < -0.5 || fretIndex > numFrets + 0.5) return null;
    
    // Calculate x position
    // For fret 0, show before nut
    // For other frets, center between frets
    let x: number;
    if (fret === 0) {
      x = padding - 12;
    } else if (fretIndex <= 0) {
      // Note is at or before start fret - show at left edge
      x = padding + fretWidth * 0.5;
    } else {
      x = padding + (fretIndex - 0.5) * fretWidth;
    }
    
    const y = padding + note.stringIndex * stringSpacing;
    
    // Handle muted strings
    if (note.isMute || note.fret === null) {
      const color = type === 'current' ? COLORS.primary : 
                    type === 'preview' ? COLORS.primaryLight : COLORS.textMuted;
      const fontSize = type === 'current' ? 20 : 16;
      return (
        <React.Fragment key={`note-${type}-${index}`}>
          {type === 'current' && (
            <Circle cx={x} cy={y} r={16} fill={COLORS.primary} opacity={0.3} />
          )}
          <SvgText
            x={x}
            y={y + 6}
            fill={color}
            fontSize={fontSize}
            fontWeight="bold"
            textAnchor="middle"
          >
            X
          </SvgText>
        </React.Fragment>
      );
    }
    
    // Determine colors based on type
    let fillColor = COLORS.primary;
    let strokeColor = COLORS.primaryLight;
    let opacity = 1;
    let radius = 14;
    
    if (type === 'preview') {
      fillColor = COLORS.secondary;
      strokeColor = COLORS.secondaryDark;
      opacity = 0.7;
      radius = 12;
    } else if (type === 'static') {
      fillColor = COLORS.surfaceLight;
      strokeColor = COLORS.textMuted;
      opacity = 0.4;
      radius = 10;
    } else if (type === 'current') {
      // Make current notes very prominent
      fillColor = COLORS.primary;
      strokeColor = '#FFFFFF';
      radius = 16;
    }
    
    return (
      <React.Fragment key={`note-${type}-${index}`}>
        {/* Large glow effect for current notes */}
        {type === 'current' && (
          <>
            <Circle cx={x} cy={y} r={radius + 8} fill={COLORS.primary} opacity={0.2} />
            <Circle cx={x} cy={y} r={radius + 4} fill={COLORS.primary} opacity={0.4} />
          </>
        )}
        {/* Preview glow */}
        {type === 'preview' && (
          <Circle cx={x} cy={y} r={radius + 3} fill={COLORS.secondary} opacity={0.2} />
        )}
        <Circle
          cx={x}
          cy={y}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={type === 'current' ? 3 : 2}
          opacity={opacity}
        />
        {/* Fret number or finger */}
        <SvgText
          x={x}
          y={y + 5}
          fill={type === 'static' ? COLORS.textMuted : COLORS.text}
          fontSize={type === 'current' ? 13 : 10}
          fontWeight="bold"
          textAnchor="middle"
          opacity={type === 'static' ? 0.6 : 1}
        >
          {note.finger || fret}
        </SvgText>
      </React.Fragment>
    );
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {/* Fretboard wood */}
        <Rect
          x={padding}
          y={padding}
          width={width - padding * 2}
          height={height - padding * 2}
          fill={COLORS.fretboard}
          rx={4}
        />
        {renderFretMarkers()}
        {renderFrets()}
        {renderStrings()}
        
        {/* Static/all notes (dimmed) */}
        {notes.map((note, i) => renderNote(note, i, 'static'))}
        
        {/* Preview notes (next notes) */}
        {previewNotes.map((note, i) => renderNote(note, i, 'preview'))}
        
        {/* Current active notes (highlighted) */}
        {currentNotes.map((note, i) => renderNote(note, i, 'current'))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: SPACING.sm,
  },
});
