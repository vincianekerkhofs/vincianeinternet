import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale patterns - grid based [string][fret] = finger number (0 = no note, -1 = root)
const SCALE_PATTERNS: Record<string, {
  name: string;
  startFret: number;
  // 6 strings x frets array, value = finger (1-4), negative = root
  grid: number[][];
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    startFret: 5,
    // Frets: 5, 6, 7, 8 (4 frets)
    // Grid[string][fret] - string 0 = e (high), string 5 = E (low)
    grid: [
      [-1, 0, 0, 4], // e: 5(root), 8
      [1, 0, 0, 4],  // B: 5, 8
      [1, 0, 3, 0],  // G: 5, 7
      [1, 0, 3, 0],  // D: 5, 7
      [-1, 0, 3, 0], // A: 5(root), 7
      [-1, 0, 0, 4], // E: 5(root), 8
    ],
  },
  'Am_blues': {
    name: 'Am Blues',
    startFret: 5,
    grid: [
      [-1, 0, 0, 4], // e: 5(root), 8
      [1, 0, 0, 4],  // B: 5, 8
      [1, 0, 3, 0],  // G: 5, 7
      [1, 0, 3, 0],  // D: 5, 7
      [-1, 2, 3, 0], // A: 5(root), 6(blue), 7
      [-1, 0, 0, 4], // E: 5(root), 8
    ],
  },
  'C_major_box1': {
    name: 'Do Mayor - Posición 1',
    startFret: 7,
    // Frets: 7, 8, 9, 10 (4 frets)
    grid: [
      [1, -2, 0, 4], // e: 7, 8(root), 10
      [0, -1, 0, 3], // B: 8(root), 10
      [1, 0, 3, 0],  // G: 7, 9
      [1, 0, 3, -4], // D: 7, 9, 10(root)
      [1, 2, 0, 4],  // A: 7, 8, 10
      [1, -2, 0, 4], // E: 7, 8(root), 10
    ],
  },
};

const COLORS_SCHEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  BLUE: '#9B59B6',
  STRING: '#B8977E',
  FRET: '#5A5A5A',
  BG: '#1E1810',
};

const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  width = 340,
  height = 280,
  isActive = false,
}) => {
  const scaleData = SCALE_PATTERNS[scaleName];
  
  if (!scaleData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  const numFrets = scaleData.grid[0].length;
  const cellWidth = (width - 60) / numFrets;
  const cellHeight = 28;

  // Render a single note cell
  const renderNote = (finger: number, isActive: boolean) => {
    if (finger === 0) return null;
    
    const isRoot = finger < 0;
    const displayFinger = Math.abs(finger);
    const bgColor = isRoot ? COLORS_SCHEME.ROOT : COLORS_SCHEME.NOTE;
    
    return (
      <View style={[styles.noteCircle, { backgroundColor: isActive ? bgColor : '#333', borderColor: bgColor }]}>
        <Text style={styles.fingerText}>{displayFinger}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Scale name */}
      <Text style={styles.scaleName}>{scaleData.name}</Text>
      
      {/* Main grid container */}
      <View style={styles.gridContainer}>
        {/* String labels column */}
        <View style={styles.stringLabels}>
          {stringNames.map((name, i) => {
            const hasRoot = scaleData.grid[i].some(f => f < 0);
            return (
              <View 
                key={`label-${i}`} 
                style={[
                  styles.stringLabel, 
                  { height: cellHeight },
                  hasRoot ? styles.stringLabelRoot : styles.stringLabelNormal
                ]}
              >
                <Text style={[styles.stringLabelText, hasRoot && styles.stringLabelTextRoot]}>
                  {name}
                </Text>
              </View>
            );
          })}
        </View>
        
        {/* Fretboard grid */}
        <View style={[styles.fretboard, { width: width - 60 }]}>
          {/* Fret lines */}
          <View style={styles.fretLines}>
            {Array.from({ length: numFrets + 1 }).map((_, i) => (
              <View 
                key={`fret-${i}`} 
                style={[
                  styles.fretLine, 
                  { left: i * cellWidth - 1 },
                  i === 0 && styles.nutLine
                ]} 
              />
            ))}
          </View>
          
          {/* String rows with notes */}
          {scaleData.grid.map((row, stringIdx) => (
            <View key={`row-${stringIdx}`} style={[styles.stringRow, { height: cellHeight }]}>
              {/* String line */}
              <View style={[styles.stringLine, { height: 2 + stringIdx * 0.4 }]} />
              
              {/* Note cells */}
              {row.map((finger, fretIdx) => (
                <View key={`cell-${stringIdx}-${fretIdx}`} style={[styles.noteCell, { width: cellWidth }]}>
                  {renderNote(finger, isActive)}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
      
      {/* Fret numbers */}
      <View style={[styles.fretNumbers, { width: width - 60, marginLeft: 30 }]}>
        {Array.from({ length: numFrets }).map((_, i) => (
          <Text key={`fnum-${i}`} style={[styles.fretNumber, { width: cellWidth }]}>
            {scaleData.startFret + i}
          </Text>
        ))}
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS_SCHEME.NOTE }]} />
          <Text style={styles.legendText}>Notas</Text>
        </View>
        <Text style={styles.legendTip}>Todas las cuerdas suenan</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  errorText: {
    color: '#FF4757',
    fontSize: 14,
  },
  scaleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stringLabels: {
    width: 30,
    marginRight: 0,
  },
  stringLabel: {
    width: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    marginVertical: 1,
  },
  stringLabelNormal: {
    backgroundColor: '#00D68F',
  },
  stringLabelRoot: {
    backgroundColor: '#FF6B35',
  },
  stringLabelText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stringLabelTextRoot: {
    color: '#FFF',
  },
  fretboard: {
    backgroundColor: '#1E1810',
    borderRadius: 4,
    paddingVertical: 2,
    position: 'relative',
  },
  fretLines: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fretLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#5A5A5A',
  },
  nutLine: {
    width: 5,
    backgroundColor: '#CCC',
  },
  stringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  stringLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#B8977E',
  },
  noteCell: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fingerText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fretNumbers: {
    flexDirection: 'row',
    marginTop: 6,
  },
  fretNumber: {
    textAlign: 'center',
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#888',
  },
  legendTip: {
    fontSize: 11,
    color: '#00D68F',
    fontWeight: '600',
  },
});
