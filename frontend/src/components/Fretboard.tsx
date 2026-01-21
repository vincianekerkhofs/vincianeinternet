import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText } from 'react-native-svg';

interface FretboardProps {
  activeNotes?: { string: number; fret: number; finger?: number }[];
  width?: number;
  height?: number;
  startFret?: number;
  numFrets?: number;
}

export const Fretboard: React.FC<FretboardProps> = ({
  activeNotes = [],
  width = 340,
  height = 160,
  startFret = 0,
  numFrets = 5,
}) => {
  const padding = 30;
  const fretWidth = (width - padding * 2) / numFrets;
  const stringSpacing = (height - padding * 2) / 5;
  
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const fretMarkers = [3, 5, 7, 9, 12, 15, 17, 19, 21];

  const renderStrings = () => {
    return stringNames.map((name, i) => {
      const y = padding + i * stringSpacing;
      const thickness = 1 + (i * 0.3);
      return (
        <React.Fragment key={`string-${i}`}>
          <Line
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke={COLORS.string}
            strokeWidth={thickness}
          />
          <SvgText
            x={padding - 15}
            y={y + 4}
            fill={COLORS.textSecondary}
            fontSize={10}
            fontWeight="500"
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
            <Circle key={`marker-${i}-1`} cx={x} cy={padding + stringSpacing * 1.5} r={4} fill={COLORS.textMuted} />,
            <Circle key={`marker-${i}-2`} cx={x} cy={padding + stringSpacing * 3.5} r={4} fill={COLORS.textMuted} />
          );
        } else {
          markers.push(
            <Circle key={`marker-${i}`} cx={x} cy={height / 2} r={4} fill={COLORS.textMuted} />
          );
        }
      }
    }
    return markers;
  };

  const renderActiveNotes = () => {
    return activeNotes.map((note, i) => {
      const fretIndex = note.fret - startFret;
      if (fretIndex < 0 || fretIndex > numFrets) return null;
      
      const x = note.fret === 0 
        ? padding - 10 
        : padding + (fretIndex - 0.5) * fretWidth;
      const y = padding + note.string * stringSpacing;
      
      return (
        <React.Fragment key={`note-${i}`}>
          <Circle
            cx={x}
            cy={y}
            r={12}
            fill={COLORS.primary}
            stroke={COLORS.primaryLight}
            strokeWidth={2}
          />
          {note.finger && (
            <SvgText
              x={x}
              y={y + 4}
              fill={COLORS.text}
              fontSize={11}
              fontWeight="bold"
              textAnchor="middle"
            >
              {note.finger}
            </SvgText>
          )}
        </React.Fragment>
      );
    });
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
        {renderActiveNotes()}
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
