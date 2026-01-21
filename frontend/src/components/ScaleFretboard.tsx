import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale data - grid[string][fret] = finger (negative = root)
const SCALES: Record<string, {
  name: string;
  startFret: number;
  grid: number[][];
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    startFret: 5,
    grid: [
      [-1, 0, 0, 4],
      [1, 0, 0, 4],
      [1, 0, 3, 0],
      [1, 0, 3, 0],
      [-1, 0, 3, 0],
      [-1, 0, 0, 4],
    ],
  },
  'Am_blues': {
    name: 'Am Blues',
    startFret: 5,
    grid: [
      [-1, 0, 0, 4],
      [1, 0, 0, 4],
      [1, 0, 3, 0],
      [1, 0, 3, 0],
      [-1, 2, 3, 0],
      [-1, 0, 0, 4],
    ],
  },
  'C_major_box1': {
    name: 'Do Mayor',
    startFret: 7,
    grid: [
      [1, -2, 0, 4],
      [0, -1, 0, 3],
      [1, 0, 3, 0],
      [1, 0, 3, -4],
      [1, 2, 0, 4],
      [1, -2, 0, 4],
    ],
  },
};

const STRINGS = ['e', 'B', 'G', 'D', 'A', 'E'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  if (!scale) return <Text style={styles.err}>Escala: {scaleName}</Text>;

  const numFrets = scale.grid[0].length;
  const cellWidth = (SCREEN_WIDTH - 80) / numFrets;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{scale.name}</Text>
      
      {/* Fretboard */}
      <View style={styles.board}>
        {scale.grid.map((row, si) => {
          const hasRoot = row.some(v => v < 0);
          return (
            <View key={si} style={styles.stringRow}>
              {/* String label */}
              <View style={[styles.strLabel, hasRoot ? styles.strRoot : styles.strNote]}>
                <Text style={styles.strText}>{STRINGS[si]}</Text>
              </View>
              
              {/* Cells */}
              <View style={styles.cells}>
                {row.map((val, fi) => {
                  const isRoot = val < 0;
                  const finger = Math.abs(val);
                  return (
                    <View key={fi} style={[styles.cell, { width: cellWidth }]}>
                      {/* Fret line */}
                      <View style={[styles.fretLine, fi === 0 && styles.nutLine]} />
                      {/* String line */}
                      <View style={[styles.strLine, { height: 2 + si * 0.5 }]} />
                      {/* Note */}
                      {val !== 0 && (
                        <View style={[
                          styles.noteCircle,
                          isRoot ? styles.noteRoot : styles.noteGreen,
                          isActive && (isRoot ? styles.noteRootActive : styles.noteGreenActive),
                        ]}>
                          <Text style={styles.fingerTxt}>{finger}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
      
      {/* Fret numbers */}
      <View style={styles.fretNums}>
        <View style={styles.fretNumSpacer} />
        {Array.from({ length: numFrets }).map((_, i) => (
          <View key={i} style={[styles.fretNumCell, { width: cellWidth }]}>
            <Text style={styles.fretNumText}>{scale.startFret + i}</Text>
          </View>
        ))}
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legItem}>
          <View style={[styles.legDot, { backgroundColor: '#FF6B35' }]} />
          <Text style={styles.legText}>Raíz</Text>
        </View>
        <View style={styles.legItem}>
          <View style={[styles.legDot, { backgroundColor: '#00D68F' }]} />
          <Text style={styles.legText}>Notas</Text>
        </View>
        <Text style={styles.allPlay}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 4 },
  err: { color: '#F00' },
  title: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  
  board: { 
    backgroundColor: '#1E1810', 
    borderRadius: 6,
  },
  
  stringRow: { 
    flexDirection: 'row', 
    height: 34,
    alignItems: 'center',
  },
  
  strLabel: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
  },
  strNote: { backgroundColor: '#00D68F' },
  strRoot: { backgroundColor: '#FF6B35' },
  strText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  cells: { flexDirection: 'row' },
  
  cell: { 
    height: 34, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  
  fretLine: {
    position: 'absolute',
    left: 0,
    top: 2,
    bottom: 2,
    width: 2,
    backgroundColor: '#555',
  },
  nutLine: {
    width: 4,
    backgroundColor: '#BBB',
  },
  
  strLine: { 
    position: 'absolute', 
    left: 4, 
    right: 0, 
    backgroundColor: '#A08060',
  },
  
  noteCircle: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: '#222',
    zIndex: 10,
  },
  noteGreen: { borderColor: '#00D68F' },
  noteRoot: { borderColor: '#FF6B35' },
  noteGreenActive: { backgroundColor: '#00D68F' },
  noteRootActive: { backgroundColor: '#FF6B35' },
  
  fingerTxt: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  
  fretNums: { 
    flexDirection: 'row', 
    marginTop: 6,
    alignItems: 'center',
  },
  fretNumSpacer: { width: 36 },
  fretNumCell: { alignItems: 'center' },
  fretNumText: { fontSize: 11, color: '#888', fontWeight: '600' },
  
  legend: { 
    flexDirection: 'row', 
    gap: 14, 
    marginTop: 10,
    alignItems: 'center',
  },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legDot: { width: 10, height: 10, borderRadius: 5 },
  legText: { fontSize: 11, color: '#888' },
  allPlay: { fontSize: 11, color: '#00D68F', fontWeight: '600' },
});
