import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  isActive?: boolean;
}

// Scale data
const SCALES: Record<string, { name: string; start: number; notes: { s: number; f: number; finger: number; root?: boolean }[] }> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica - Box 1',
    start: 5,
    notes: [
      { s: 0, f: 0, finger: 1, root: true }, { s: 0, f: 3, finger: 4 },
      { s: 1, f: 0, finger: 1 }, { s: 1, f: 3, finger: 4 },
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 },
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 2, finger: 3 },
      { s: 5, f: 0, finger: 1, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
  'Am_blues': {
    name: 'Am Blues',
    start: 5,
    notes: [
      { s: 0, f: 0, finger: 1, root: true }, { s: 0, f: 3, finger: 4 },
      { s: 1, f: 0, finger: 1 }, { s: 1, f: 3, finger: 4 },
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 },
      { s: 4, f: 0, finger: 1, root: true }, { s: 4, f: 1, finger: 2 }, { s: 4, f: 2, finger: 3 },
      { s: 5, f: 0, finger: 1, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
  'C_major_box1': {
    name: 'Do Mayor',
    start: 7,
    notes: [
      { s: 0, f: 0, finger: 1 }, { s: 0, f: 1, finger: 2, root: true }, { s: 0, f: 3, finger: 4 },
      { s: 1, f: 1, finger: 1, root: true }, { s: 1, f: 3, finger: 3 },
      { s: 2, f: 0, finger: 1 }, { s: 2, f: 2, finger: 3 },
      { s: 3, f: 0, finger: 1 }, { s: 3, f: 2, finger: 3 }, { s: 3, f: 3, finger: 4, root: true },
      { s: 4, f: 0, finger: 1 }, { s: 4, f: 1, finger: 2 }, { s: 4, f: 3, finger: 4 },
      { s: 5, f: 0, finger: 1 }, { s: 5, f: 1, finger: 2, root: true }, { s: 5, f: 3, finger: 4 },
    ],
  },
};

const STR_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const { width: SCREEN_W } = Dimensions.get('window');

export const ScaleFretboard: React.FC<Props> = ({ scaleName, isActive = false }) => {
  const scale = SCALES[scaleName];
  if (!scale) return <Text>Escala no encontrada</Text>;

  const NUM_FRETS = 4;
  const CELL_W = Math.floor((SCREEN_W - 80) / NUM_FRETS);
  const ROW_H = 36;

  // Check if string has root note
  const hasRoot = (si: number) => scale.notes.some(n => n.s === si && n.root);
  
  // Get note at position
  const getNote = (si: number, fi: number) => scale.notes.find(n => n.s === si && n.f === fi);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{scale.name}</Text>
      <Text style={styles.subtitle}>Trastes {scale.start}-{scale.start + NUM_FRETS - 1}</Text>
      
      {/* Fretboard */}
      <View style={styles.fretboard}>
        {/* String rows */}
        {STR_NAMES.map((strName, si) => (
          <View key={si} style={styles.row}>
            {/* String label */}
            <Text style={[styles.strLabel, hasRoot(si) ? styles.strLabelRoot : styles.strLabelNormal]}>
              {strName}
            </Text>
            
            {/* Fret cells */}
            {[0, 1, 2, 3].map(fi => {
              const note = getNote(si, fi);
              return (
                <View key={fi} style={[styles.cell, { width: CELL_W }]}>
                  {/* Fret line */}
                  <View style={fi === 0 ? styles.nutLine : styles.fretLine} />
                  
                  {/* Note circle or string line */}
                  {note ? (
                    <Text style={[
                      styles.noteCircle,
                      note.root ? styles.noteRoot : styles.noteGreen,
                      isActive && styles.noteActive
                    ]}>
                      {note.finger}
                    </Text>
                  ) : (
                    <View style={[styles.stringLine, { height: 2 + si * 0.5 }]} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
        
        {/* Fret numbers */}
        <View style={styles.fretNumRow}>
          <View style={{ width: 32 }} />
          {[0, 1, 2, 3].map(fi => (
            <Text key={fi} style={[styles.fretNum, { width: CELL_W }]}>
              {scale.start + fi}
            </Text>
          ))}
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendRoot}>● Raíz</Text>
        <Text style={styles.legendNote}>● Notas</Text>
        <Text style={styles.legendAll}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 8 },
  title: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  subtitle: { fontSize: 12, color: '#888', marginBottom: 8 },
  
  fretboard: { backgroundColor: '#1E1810', borderRadius: 6, padding: 8 },
  
  row: { flexDirection: 'row', alignItems: 'center', height: 36 },
  
  strLabel: { 
    width: 24, 
    textAlign: 'center',
    fontSize: 12, 
    fontWeight: 'bold', 
    marginRight: 6,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  strLabelNormal: { backgroundColor: '#00D68F', color: '#FFF' },
  strLabelRoot: { backgroundColor: '#FF6B35', color: '#FFF' },
  
  cell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 32 },
  
  nutLine: { width: 4, height: 28, backgroundColor: '#AAA', marginRight: 2 },
  fretLine: { width: 2, height: 28, backgroundColor: '#555', marginRight: 2 },
  
  stringLine: { flex: 1, backgroundColor: '#A08060' },
  
  noteCircle: { 
    width: 26, 
    height: 26, 
    lineHeight: 26,
    textAlign: 'center',
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#FFF',
    borderRadius: 13,
    borderWidth: 2,
    overflow: 'hidden',
  },
  noteGreen: { backgroundColor: '#333', borderColor: '#00D68F' },
  noteRoot: { backgroundColor: '#333', borderColor: '#FF6B35' },
  noteActive: { backgroundColor: '#00D68F' },
  
  fretNumRow: { flexDirection: 'row', marginTop: 4 },
  fretNum: { textAlign: 'center', fontSize: 10, color: '#888' },
  
  legend: { flexDirection: 'row', gap: 12, marginTop: 10 },
  legendRoot: { fontSize: 11, color: '#FF6B35' },
  legendNote: { fontSize: 11, color: '#00D68F' },
  legendAll: { fontSize: 11, color: '#00D68F' },
});
