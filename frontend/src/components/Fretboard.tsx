import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';

export interface FretboardNote {
  stringIndex: number;
  fret: number | null;
  isMute?: boolean;
  isActive?: boolean;
  finger?: number;
}

interface FretboardProps {
  notes?: FretboardNote[];
  currentNotes?: FretboardNote[];
  width?: number;
  height?: number;
  startFret?: number;
  numFrets?: number;
  showFingering?: boolean;
}

/**
 * FRETBOARD COMPONENT
 * - Fret numbers displayed BELOW the fretboard for clear visibility
 * - Fingering numbers (1-4) displayed INSIDE the note markers when active
 * - Single ORANGE highlight for active notes only
 * - Static notes shown in gray with fret number
 */
export const Fretboard: React.FC<FretboardProps> = ({
  notes = [],
  currentNotes = [],
  width = 340,
  height = 220,
  startFret = 0,
  numFrets = 5,
  showFingering = true,
}) => {
  const paddingTop = 25;
  const paddingBottom = 45; // Extra space for fret numbers
  const paddingLeft = 35;
  const paddingRight = 20;
  
  const fretboardWidth = width - paddingLeft - paddingRight;
  const fretboardHeight = height - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

  // Render guitar strings
  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1 + (i * 0.5); // Thicker for bass strings
      const hasCurrentNote = currentNotes.some(n => n.stringIndex === i);
      
      return (
        <G key={`string-${i}`}>
          {/* String line */}
          <Line
            x1={paddingLeft}
            y1={y}
            x2={width - paddingRight}
            y2={y}
            stroke={hasCurrentNote ? COLORS.primary : '#8B7355'}
            strokeWidth={hasCurrentNote ? thickness + 1 : thickness}
          />
          {/* String name label */}
          <SvgText
            x={paddingLeft - 18}
            y={y + 5}
            fill={hasCurrentNote ? COLORS.primary : COLORS.textSecondary}
            fontSize={14}
            fontWeight={hasCurrentNote ? 'bold' : '600'}
            textAnchor="middle"
          >
            {name}
          </SvgText>
        </G>
      );
    });
  };

  // Render frets and fret numbers
  const renderFrets = () => {
    const frets = [];
    for (let i = 0; i <= numFrets; i++) {
      const x = paddingLeft + i * fretWidth;
      const isNut = startFret === 0 && i === 0;
      
      // Fret wire
      frets.push(
        <Line
          key={`fret-${i}`}
          x1={x}
          y1={paddingTop}
          x2={x}
          y2={paddingTop + fretboardHeight}
          stroke={isNut ? '#D4D4D4' : '#6B5B4D'}
          strokeWidth={isNut ? 6 : 2}
        />
      );
      
      // Fret number BELOW fretboard (centered in fret space)
      if (i > 0) {
        const fretNum = startFret + i;
        frets.push(
          <SvgText
            key={`fret-num-${i}`}
            x={x - fretWidth / 2}
            y={height - 10}
            fill={COLORS.textMuted}
            fontSize={14}
            fontWeight="700"
            textAnchor="middle"
          >
            {fretNum}
          </SvgText>
        );
      }
    }
    
    // Show position marker if not starting at nut
    if (startFret > 0) {
      frets.push(
        <SvgText
          key="position-marker"
          x={paddingLeft - 18}
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

  // Render fret position markers (dots)
  const renderFretMarkers = () => {
    const markers = [];
    for (let i = 1; i <= numFrets; i++) {
      const fretNum = startFret + i;
      if (fretMarkers.includes(fretNum)) {
        const x = paddingLeft + (i - 0.5) * fretWidth;
        const isDouble = fretNum === 12;
        if (isDouble) {
          markers.push(
            <Circle key={`marker-${i}-1`} cx={x} cy={paddingTop + stringSpacing * 1.5} r={6} fill="#4A4A4A" opacity={0.4} />,
            <Circle key={`marker-${i}-2`} cx={x} cy={paddingTop + stringSpacing * 3.5} r={6} fill="#4A4A4A" opacity={0.4} />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={paddingTop + fretboardHeight / 2} r={6} fill="#4A4A4A" opacity={0.4} />
          );
        }
      }
    }
    return markers;
  };

  // Render a single note marker
  const renderNote = (note: FretboardNote, index: number, isActive: boolean) => {
    const fret = note.fret ?? 0;
    const fretIndex = fret - startFret;
    
    // Skip if note is outside visible range
    if (fretIndex < -0.5 || fretIndex > numFrets + 0.5) return null;
    
    // Calculate X position
    let x: number;
    if (fret === 0) {
      x = paddingLeft - 12; // Open string position
    } else if (fretIndex <= 0) {
      x = paddingLeft + fretWidth * 0.5;
    } else {
      x = paddingLeft + (fretIndex - 0.5) * fretWidth;
    }
    
    const y = paddingTop + note.stringIndex * stringSpacing;
    
    // Handle muted strings (X marker)
    if (note.isMute || note.fret === null) {
      return (
        <G key={`note-${isActive ? 'active' : 'static'}-${index}`}>
          {isActive && (
            <Circle cx={x} cy={y} r={22} fill={COLORS.primary} opacity={0.3} />
          )}
          <SvgText
            x={x}
            y={y + 6}
            fill={isActive ? COLORS.primary : COLORS.textMuted}
            fontSize={isActive ? 26 : 20}
            fontWeight="bold"
            textAnchor="middle"
          >
            X
          </SvgText>
        </G>
      );
    }
    
    // Note marker styling
    const radius = isActive ? 22 : 14;
    const fillColor = isActive ? COLORS.primary : '#3A3A3A';
    const strokeColor = isActive ? '#FFFFFF' : '#5A5A5A';
    
    return (
      <G key={`note-${isActive ? 'active' : 'static'}-${index}`}>
        {/* Glow effect for active notes */}
        {isActive && (
          <>
            <Circle cx={x} cy={y} r={radius + 10} fill={COLORS.primary} opacity={0.15} />
            <Circle cx={x} cy={y} r={radius + 5} fill={COLORS.primary} opacity={0.3} />
          </>
        )}
        
        {/* Main note circle */}
        <Circle
          cx={x}
          cy={y}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isActive ? 3 : 1.5}
        />
        
        {/* Display content inside circle */}
        {isActive && showFingering && note.finger ? (
          // Active note: Show FINGER number prominently
          <>
            <SvgText
              x={x}
              y={y + 8}
              fill="#FFFFFF"
              fontSize={20}
              fontWeight="bold"
              textAnchor="middle"
            >
              {note.finger}
            </SvgText>
            {/* Small fret number badge */}
            <Circle
              cx={x + radius - 2}
              cy={y - radius + 2}
              r={10}
              fill="#333333"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
            <SvgText
              x={x + radius - 2}
              y={y - radius + 6}
              fill="#FFFFFF"
              fontSize={10}
              fontWeight="bold"
              textAnchor="middle"
            >
              {fret}
            </SvgText>
          </>
        ) : isActive ? (
          // Active note without fingering: Show FRET number
          <SvgText
            x={x}
            y={y + 7}
            fill="#FFFFFF"
            fontSize={18}
            fontWeight="bold"
            textAnchor="middle"
          >
            {fret}
          </SvgText>
        ) : (
          // Static note: Show fret number smaller
          <SvgText
            x={x}
            y={y + 5}
            fill={COLORS.textMuted}
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
          >
            {fret}
          </SvgText>
        )}
      </G>
    );
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
          fill="#2D2416"
          rx={4}
        />
        
        {renderFretMarkers()}
        {renderFrets()}
        {renderStrings()}
        
        {/* Static notes (dimmed) */}
        {notes.map((note, i) => renderNote(note, i, false))}
        
        {/* Active notes (ORANGE - play NOW) */}
        {currentNotes.map((note, i) => renderNote(note, i, true))}
      </Svg>
      
      {/* Legend */}
      {showFingering && (
        <View style={styles.legend}>
          <Text style={styles.legendText}>Fingers: 1=Index  2=Middle  3=Ring  4=Pinky</Text>
        </View>
      )}
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
  legend: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  legendText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
