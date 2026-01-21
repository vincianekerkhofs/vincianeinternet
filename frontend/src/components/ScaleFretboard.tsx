import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  isActive?: boolean;
}

// Scale data - notes list format
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
const { width: SW } = Dimensions.get('window');

export const ScaleFretboard: React.FC<Props> = ({ scaleName, isActive = false }) => {
  const scale = SCALES[scaleName];
  if (!scale) return <Text style={{color:'red'}}>?</Text>;

  const NUM_FRETS = 4;
  const CELL_W = Math.floor((SW - 90) / NUM_FRETS);

  const hasRoot = (si: number) => scale.notes.some(n => n.s === si && n.root);
  const getNote = (si: number, fi: number) => scale.notes.find(n => n.s === si && n.f === fi);

  // String Label Component
  const StrLabel = ({ si }: { si: number }) => {
    const root = hasRoot(si);
    return (
      <View style={[s.strLbl, root ? s.strLblRoot : s.strLblNote]}>
        <Text style={s.strLblTxt}>{STR_NAMES[si]}</Text>
      </View>
    );
  };

  // Note Circle Component  
  const NoteCircle = ({ note }: { note: { finger: number; root?: boolean } }) => (
    <View style={[s.noteC, note.root ? s.noteCRoot : s.noteCNote, isActive && s.noteCActive]}>
      <Text style={s.noteCTxt}>{note.finger}</Text>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.title}>{scale.name}</Text>
      <Text style={s.sub}>Trastes {scale.start}-{scale.start + NUM_FRETS - 1}</Text>
      
      {/* Fretboard */}
      <View style={s.board}>
        {STR_NAMES.map((_, si) => (
          <View key={si} style={s.row}>
            <StrLabel si={si} />
            
            {[0, 1, 2, 3].map(fi => {
              const note = getNote(si, fi);
              return (
                <View key={fi} style={[s.cell, { width: CELL_W }]}>
                  <View style={fi === 0 ? s.nut : s.fret} />
                  {note ? <NoteCircle note={note} /> : <View style={[s.strLine, { height: 2 + si * 0.5 }]} />}
                </View>
              );
            })}
          </View>
        ))}
        
        {/* Fret numbers */}
        <View style={s.fnRow}>
          <View style={{ width: 34 }} />
          {[0, 1, 2, 3].map(fi => (
            <View key={fi} style={[s.fnCell, { width: CELL_W }]}>
              <Text style={s.fnTxt}>{scale.start + fi}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Legend */}
      <View style={s.leg}>
        <View style={s.legItem}><View style={[s.legDot, { backgroundColor: '#FF6B35' }]} /><Text style={s.legTxt}>Raíz</Text></View>
        <View style={s.legItem}><View style={[s.legDot, { backgroundColor: '#00D68F' }]} /><Text style={s.legTxt}>Notas</Text></View>
        <Text style={[s.legTxt, { color: '#00D68F' }]}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { alignItems: 'center', padding: 8 },
  title: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
  sub: { fontSize: 12, color: '#888', marginBottom: 8 },
  
  board: { backgroundColor: '#1E1810', borderRadius: 6, padding: 8 },
  
  row: { flexDirection: 'row', alignItems: 'center', height: 36 },
  
  // String labels as View+Text
  strLbl: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  strLblNote: { backgroundColor: '#00D68F' },
  strLblRoot: { backgroundColor: '#FF6B35' },
  strLblTxt: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  cell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 32 },
  
  nut: { width: 4, height: 28, backgroundColor: '#AAA', marginRight: 2 },
  fret: { width: 2, height: 28, backgroundColor: '#555', marginRight: 2 },
  
  strLine: { flex: 1, backgroundColor: '#A08060' },
  
  // Note circles as View+Text
  noteC: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#222' },
  noteCNote: { borderColor: '#00D68F' },
  noteCRoot: { borderColor: '#FF6B35' },
  noteCActive: { backgroundColor: '#00D68F' },
  noteCTxt: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  
  fnRow: { flexDirection: 'row', marginTop: 4 },
  fnCell: { alignItems: 'center' },
  fnTxt: { fontSize: 10, color: '#888' },
  
  leg: { flexDirection: 'row', gap: 12, marginTop: 10, alignItems: 'center' },
  legItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legDot: { width: 10, height: 10, borderRadius: 5 },
  legTxt: { fontSize: 11, color: '#888' },
});
