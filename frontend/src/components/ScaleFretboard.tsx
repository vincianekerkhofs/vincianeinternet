import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

const SCALES: Record<string, {
  name: string;
  startFret: number;
  grid: number[][]; // negative = root
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

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const { width: SW } = Dimensions.get('window');

export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({ scaleName, isActive = false }) => {
  const scale = SCALES[scaleName];
  if (!scale) return <Text style={{ color: 'red' }}>Escala: {scaleName}</Text>;

  const nFrets = scale.grid[0].length;
  const cw = Math.floor((SW - 90) / nFrets); // cell width

  // Note component
  const Note = ({ val }: { val: number }) => {
    if (val === 0) return <View style={{ width: 28, height: 28 }} />;
    const isRoot = val < 0;
    const bg = isActive 
      ? (isRoot ? '#FF6B35' : '#00D68F')
      : '#333';
    const border = isRoot ? '#FF6B35' : '#00D68F';
    return (
      <View style={[st.note, { backgroundColor: bg, borderColor: border }]}>
        <Text style={st.finger}>{Math.abs(val)}</Text>
      </View>
    );
  };

  return (
    <View style={st.container}>
      <Text style={st.title}>{scale.name}</Text>
      
      {/* Fretboard table */}
      <View style={st.table}>
        {scale.grid.map((row, si) => {
          const hasRoot = row.some(v => v < 0);
          return (
            <View key={si} style={st.row}>
              {/* String label */}
              <View style={[st.label, hasRoot ? st.labelR : st.labelG]}>
                <Text style={st.labelTxt}>{STRING_NAMES[si]}</Text>
              </View>
              {/* Nut (first fret line) */}
              <View style={st.nut} />
              {/* Fret cells */}
              {row.map((val, fi) => (
                <View key={fi} style={[st.cell, { width: cw }]}>
                  <Note val={val} />
                  {/* Fret line on right edge */}
                  <View style={st.fret} />
                </View>
              ))}
            </View>
          );
        })}
      </View>
      
      {/* Fret numbers */}
      <View style={st.fretNums}>
        <View style={{ width: 36 }} />
        {Array.from({ length: nFrets }).map((_, i) => (
          <View key={i} style={[st.fretNumC, { width: cw }]}>
            <Text style={st.fretNumT}>{scale.startFret + i}</Text>
          </View>
        ))}
      </View>
      
      {/* Legend */}
      <View style={st.legend}>
        <View style={st.legI}><View style={[st.dot, { backgroundColor: '#FF6B35' }]} /><Text style={st.legT}>Raíz</Text></View>
        <View style={st.legI}><View style={[st.dot, { backgroundColor: '#00D68F' }]} /><Text style={st.legT}>Notas</Text></View>
        <Text style={st.allS}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 4 },
  title: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginBottom: 8 },
  
  table: { backgroundColor: '#1E1810', borderRadius: 6, padding: 4 },
  
  row: { flexDirection: 'row', alignItems: 'center', height: 36 },
  
  label: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 2 },
  labelG: { backgroundColor: '#00D68F' },
  labelR: { backgroundColor: '#FF6B35' },
  labelTxt: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  nut: { width: 4, height: 32, backgroundColor: '#AAA', marginRight: 1 },
  
  cell: { height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E1810' },
  
  fret: { width: 2, height: 32, backgroundColor: '#555', marginLeft: 'auto' },
  
  note: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  finger: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  
  fretNums: { flexDirection: 'row', marginTop: 4 },
  fretNumC: { alignItems: 'center' },
  fretNumT: { fontSize: 11, color: '#888', fontWeight: '600' },
  
  legend: { flexDirection: 'row', gap: 12, marginTop: 8, alignItems: 'center' },
  legI: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legT: { fontSize: 11, color: '#888' },
  allS: { fontSize: 11, color: '#00D68F', fontWeight: '600' },
});
