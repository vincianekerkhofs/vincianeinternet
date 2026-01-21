import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';

export interface FretboardNote {
  stringIndex: number;  // 0=high e, 5=low E
  fret: number | null;  // null for muted
  isMute?: boolean;
  isActive?: boolean;
  isPreview?: boolean;
  finger?: number;      // 1-4 for left hand fingering
}

interface FretboardProps {
  notes?: FretboardNote[];
  currentNotes?: FretboardNote[];
  previewNotes?: FretboardNote[];
  width?: number;
  height?: number;
  startFret?: number;
  numFrets?: number;
  showFingering?: boolean;
}

export const Fretboard: React.FC<FretboardProps> = ({
  notes = [],
  currentNotes = [],
  previewNotes = [],
  width = 340,
  height = 180,
  startFret = 0,
  numFrets = 5,
  showFingering = true,
}) => {
  const padding = 35;
  const fretWidth = (width - padding * 2) / numFrets;
  const stringSpacing = (height - padding * 2) / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = padding + i * stringSpacing;
      const thickness = 1 + (i * 0.3);
      const hasCurrentNote = currentNotes.some(n => n.stringIndex === i);
      
      return (
        <G key={`string-${i}`}>
          <Line
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke={hasCurrentNote ? COLORS.stringHighlight : COLORS.string}
            strokeWidth={hasCurrentNote ? thickness + 1 : thickness}
          />
          <SvgText
            x={padding - 18}
            y={y + 4}
            fill={hasCurrentNote ? COLORS.primary : COLORS.textSecondary}
            fontSize={11}
            fontWeight={hasCurrentNote ? 'bold' : '500'}
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
          strokeWidth={isNut ? 4 : 2}
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
            <Circle key={`marker-${i}-1`} cx={x} cy={padding + stringSpacing * 1.5} r={4} fill={COLORS.textMuted} opacity={0.4} />,
            <Circle key={`marker-${i}-2`} cx={x} cy={padding + stringSpacing * 3.5} r={4} fill={COLORS.textMuted} opacity={0.4} />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={height / 2} r={4} fill={COLORS.textMuted} opacity={0.4} />
          );
        }
      }
    }
    return markers;
  };

  const renderNote = (note: FretboardNote, index: number, type: 'current' | 'preview' | 'static') => {
    const fret = note.fret ?? 0;
    const fretIndex = fret - startFret;
    
    if (fretIndex < -0.5 || fretIndex > numFrets + 0.5) return null;
    
    let x: number;
    if (fret === 0) {
      x = padding - 14;
    } else if (fretIndex <= 0) {
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
        <G key={`note-${type}-${index}`}>
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
        </G>
      );
    }
    
    // Determine colors and sizes based on type
    let fillColor = COLORS.primary;
    let strokeColor = COLORS.primaryLight;
    let opacity = 1;
    let radius = 15;
    
    if (type === 'preview') {
      fillColor = COLORS.secondary;
      strokeColor = COLORS.secondaryDark;
      opacity = 0.7;
      radius = 13;
    } else if (type === 'static') {
      fillColor = COLORS.surfaceLight;
      strokeColor = COLORS.textMuted;
      opacity = 0.5;
      radius = 11;
    } else if (type === 'current') {
      fillColor = COLORS.primary;
      strokeColor = '#FFFFFF';
      radius = 17;
    }
    
    return (
      <G key={`note-${type}-${index}`}>
        {/* Glow effects for current notes */}
        {type === 'current' && (
          <>
            <Circle cx={x} cy={y} r={radius + 10} fill={COLORS.primary} opacity={0.15} />
            <Circle cx={x} cy={y} r={radius + 5} fill={COLORS.primary} opacity={0.3} />
          </>
        )}
        {type === 'preview' && (
          <Circle cx={x} cy={y} r={radius + 4} fill={COLORS.secondary} opacity={0.2} />
        )}
        
        {/* Main note circle */}
        <Circle
          cx={x}
          cy={y}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={type === 'current' ? 3 : 2}
          opacity={opacity}
        />
        
        {/* Fret number (primary) */}
        <SvgText
          x={x}
          y={y + (type === 'current' ? 1 : 0)}
          fill={type === 'static' ? COLORS.textMuted : COLORS.text}
          fontSize={type === 'current' ? 13 : type === 'preview' ? 11 : 10}
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          opacity={type === 'static' ? 0.7 : 1}
        >
          {fret}
        </SvgText>
        
        {/* Finger number badge (for current and preview notes) */}
        {showFingering && note.finger && (type === 'current' || type === 'preview') && (
          <>
            {/* Finger badge background */}
            <Circle
              cx={x + radius - 2}
              cy={y - radius + 2}
              r={8}
              fill={type === 'current' ? COLORS.secondary : COLORS.info}
              stroke={COLORS.background}
              strokeWidth={1.5}
            />
            {/* Finger number */}
            <SvgText
              x={x + radius - 2}
              y={y - radius + 2}
              fill={COLORS.text}
              fontSize={9}
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {note.finger}
            </SvgText>
          </>
        )}
        
        {/* Static notes show finger number below */}
        {showFingering && note.finger && type === 'static' && (
          <SvgText
            x={x}
            y={y + radius + 10}
            fill={COLORS.textMuted}
            fontSize={8}
            textAnchor="middle"
            opacity={0.7}
          >
            {note.finger}
          </SvgText>
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
        
        {/* Static notes */}
        {notes.map((note, i) => renderNote(note, i, 'static'))}
        
        {/* Preview notes */}
        {previewNotes.map((note, i) => renderNote(note, i, 'preview'))}
        
        {/* Current notes */}
        {currentNotes.map((note, i) => renderNote(note, i, 'current'))}
      </Svg>
      
      {/* Fingering legend */}
      {showFingering && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBadge, { backgroundColor: COLORS.secondary }]}>
              <SvgText style={styles.legendBadgeText}>1</SvgText>
            </View>
            <SvgText style={styles.legendLabel}>= Finger number</SvgText>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  legendBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
});
