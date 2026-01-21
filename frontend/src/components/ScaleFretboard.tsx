import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/theme';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale data using simple grid format
// Value: 0 = empty, 1-4 = finger, negative = root with that finger
const SCALES: Record<string, {
  name: string;
  startFret: number;
  grid: number[][]; // [string 0-5][fret 0-3]
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    startFret: 5,
    grid: [
      [-1, 0, 0, 4], // e (high): root@5, note@8
      [1, 0, 0, 4],  // B: note@5, note@8
      [1, 0, 3, 0],  // G: note@5, note@7
      [1, 0, 3, 0],  // D: note@5, note@7
      [-1, 0, 3, 0], // A: root@5, note@7
      [-1, 0, 0, 4], // E (low): root@5, note@8
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
      [-1, 2, 3, 0], // blue note at fret 6
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

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  width = 340,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  if (!scale) {
    return <Text style={s.error}>Escala: {scaleName}</Text>;
  }

  const numFrets = scale.grid[0].length;

  return (
    <View style={s.container}>
      <Text style={s.title}>{scale.name}</Text>
      
      {/* Fretboard with labels */}
      <View style={s.board}>
        {/* String rows */}
        {scale.grid.map((row, si) => {
          const hasRoot = row.some(v => v < 0);
          return (
            <View key={si} style={s.row}>
              {/* String label */}
              <View style={[s.label, hasRoot ? s.labelRoot : s.labelNote]}>
                <Text style={s.labelText}>{STRING_NAMES[si]}</Text>
              </View>
              
              {/* Fret cells */}
              <View style={s.frets}>
                {row.map((val, fi) => (
                  <View key={fi} style={[s.cell, fi === 0 && s.firstCell]}>
                    {/* String line */}
                    <View style={[s.string, { height: 2 + si * 0.5 }]} />
                    
                    {/* Note circle */}
                    {val !== 0 && (
                      <View style={[
                        s.note,
                        val < 0 ? s.noteRoot : s.noteNormal,
                        isActive && s.noteActive
                      ]}>
                        <Text style={s.finger}>{Math.abs(val)}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
      
      {/* Fret numbers */}
      <View style={s.fretNums}>
        <View style={{ width: 32 }} />
        {Array.from({ length: numFrets }).map((_, i) => (
          <Text key={i} style={s.fretNum}>{scale.startFret + i}</Text>
        ))}
      </View>
      
      {/* Legend */}
      <View style={s.legend}>
        <View style={s.legendItem}>
          <View style={[s.dot, { backgroundColor: '#FF6B35' }]} />
          <Text style={s.legendText}>Raíz</Text>
        </View>
        <View style={s.legendItem}>
          <View style={[s.dot, { backgroundColor: '#00D68F' }]} />
          <Text style={s.legendText}>Notas</Text>
        </View>
        <Text style={s.allStrings}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 4 },
  error: { color: '#F00', fontSize: 14 },
  title: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  
  board: { 
    backgroundColor: '#1E1810', 
    borderRadius: 6, 
    padding: 8,
    paddingRight: 12,
    width: '100%',
  },
  
  row: { 
    flexDirection: 'row', 
    alignItems: 'center',
    height: 32,
  },
  
  label: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 6,
  },
  labelNote: { backgroundColor: '#00D68F' },
  labelRoot: { backgroundColor: '#FF6B35' },
  labelText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  frets: { 
    flexDirection: 'row', 
    flex: 1,
  },
  
  cell: { 
    flex: 1, 
    height: 32, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderLeftWidth: 2,
    borderLeftColor: '#555',
  },
  firstCell: {
    borderLeftWidth: 4,
    borderLeftColor: '#BBB',
  },
  
  string: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    backgroundColor: '#A08060',
  },
  
  note: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    zIndex: 5,
  },
  noteNormal: { 
    backgroundColor: '#333', 
    borderColor: '#00D68F',
  },
  noteRoot: { 
    backgroundColor: '#333', 
    borderColor: '#FF6B35',
  },
  noteActive: {
    backgroundColor: '#00D68F',
  },
  
  finger: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  fretNums: { 
    flexDirection: 'row', 
    marginTop: 4,
    width: '100%',
    paddingHorizontal: 8,
  },
  fretNum: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 11, 
    color: '#888',
    fontWeight: '600',
  },
  
  legend: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 10,
    alignItems: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#888' },
  allStrings: { fontSize: 11, color: '#00D68F', fontWeight: '600' },
});
