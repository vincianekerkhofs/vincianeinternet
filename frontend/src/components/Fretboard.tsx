import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';

export interface FretboardNote {
  stringIndex: number;
  fret: number | null;
  isMute?: boolean;
  isActive?: boolean;
  isPreview?: boolean;
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

export const Fretboard: React.FC<FretboardProps> = ({
  notes = [],
  currentNotes = [],
  width = 340,
  height = 200,
  startFret = 0,
  numFrets = 5,
  showFingering = true,
}) => {
  const padding = 40;
  const fretWidth = (width - padding * 2) / numFrets;
  const stringSpacing = (height - padding * 2) / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = padding + i * stringSpacing;
      const thickness = 1 + (i * 0.4);
      const hasCurrentNote = currentNotes.some(n => n.stringIndex === i);
      
      return (
        <G key={`string-${i}`}>
          <Line
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke={hasCurrentNote ? COLORS.primary : COLORS.string}
            strokeWidth={hasCurrentNote ? thickness + 1.5 : thickness}
          />
          <SvgText
            x={padding - 20}
            y={y + 5}
            fill={hasCurrentNote ? COLORS.primary : COLORS.textSecondary}
            fontSize={13}
            fontWeight={hasCurrentNote ? 'bold' : '600'}
          >
            {name}
          </SvgText>
        </G>
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
            <Circle key={`marker-${i}-1`} cx={x} cy={padding + stringSpacing * 1.5} r={5} fill={COLORS.textMuted} opacity={0.35} />,
            <Circle key={`marker-${i}-2`} cx={x} cy={padding + stringSpacing * 3.5} r={5} fill={COLORS.textMuted} opacity={0.35} />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={height / 2} r={5} fill={COLORS.textMuted} opacity={0.35} />
          );
        }
      }
    }
    return markers;
  };

  // Render note - SIMPLIFIED: Only ORANGE for active notes
  const renderNote = (note: FretboardNote, index: number, isActive: boolean) => {
    const fret = note.fret ?? 0;
    const fretIndex = fret - startFret;
    
    if (fretIndex < -0.5 || fretIndex > numFrets + 0.5) return null;
    
    let x: number;
    if (fret === 0) {
      x = padding - 16;
    } else if (fretIndex <= 0) {
      x = padding + fretWidth * 0.5;
    } else {
      x = padding + (fretIndex - 0.5) * fretWidth;
    }
    
    const y = padding + note.stringIndex * stringSpacing;
    
    // Handle muted strings
    if (note.isMute || note.fret === null) {
      return (
        <G key={`note-${isActive ? 'active' : 'static'}-${index}`}>
          {isActive && (
            <Circle cx={x} cy={y} r={20} fill={COLORS.primary} opacity={0.4} />
          )}
          <SvgText
            x={x}
            y={y + 7}
            fill={isActive ? COLORS.primary : COLORS.textMuted}
            fontSize={isActive ? 24 : 18}
            fontWeight="bold"
            textAnchor="middle"
          >
            X
          </SvgText>
        </G>
      );
    }
    
    // SIMPLIFIED: Only two states - active (orange) or static (gray)
    const radius = isActive ? 20 : 13;
    const fillColor = isActive ? COLORS.primary : COLORS.surfaceLight;
    const strokeColor = isActive ? '#FFFFFF' : COLORS.textMuted;
    const opacity = isActive ? 1 : 0.5;
    
    return (
      <G key={`note-${isActive ? 'active' : 'static'}-${index}`}>
        {/* BIG GLOW for active notes - VERY OBVIOUS */}
        {isActive && (
          <>
            <Circle cx={x} cy={y} r={radius + 12} fill={COLORS.primary} opacity={0.2} />
            <Circle cx={x} cy={y} r={radius + 6} fill={COLORS.primary} opacity={0.4} />
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
          opacity={opacity}
        />
        
        {/* Fret number - LARGER for active */}
        <SvgText
          x={x}
          y={y + (isActive ? 2 : 1)}
          fill={isActive ? COLORS.text : COLORS.textMuted}
          fontSize={isActive ? 16 : 11}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {fret}
        </SvgText>
        
        {/* Finger badge - only for active notes, ORANGE background */}
        {showFingering && note.finger && isActive && (
          <>
            <Circle
              cx={x + radius - 3}
              cy={y - radius + 3}
              r={10}
              fill={COLORS.warning}
              stroke={COLORS.background}
              strokeWidth={2}
            />
            <SvgText
              x={x + radius - 3}
              y={y - radius + 3}
              fill={COLORS.background}
              fontSize={11}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {note.finger}
            </SvgText>
          </>
        )}
      </G>
    );
  };

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
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
        
        {/* Static notes (dimmed) */}
        {notes.map((note, i) => renderNote(note, i, false))}
        
        {/* Active notes (ORANGE - play NOW) */}
        {currentNotes.map((note, i) => renderNote(note, i, true))}
      </Svg>
      
      {/* Fingering legend */}
      {showFingering && (
        <View style={styles.legend}>
          <Text style={styles.legendText}>
            Finger: 1=index  2=middle  3=ring  4=pinky
          </Text>
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
    paddingTop: SPACING.xs,
  },
  legendText: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
