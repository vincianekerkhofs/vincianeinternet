import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  isActive?: boolean;
}

const SCALES: Record<string, { name: string; start: number; g: number[][] }> = {
  'Am_pent_box1': { name: 'Am Pentatónica', start: 5, g: [[-1,0,0,4], [1,0,0,4], [1,0,3,0], [1,0,3,0], [-1,0,3,0], [-1,0,0,4]] },
  'Am_blues': { name: 'Am Blues', start: 5, g: [[-1,0,0,4], [1,0,0,4], [1,0,3,0], [1,0,3,0], [-1,2,3,0], [-1,0,0,4]] },
  'C_major_box1': { name: 'Do Mayor', start: 7, g: [[1,-2,0,4], [0,-1,0,3], [1,0,3,0], [1,0,3,-4], [1,2,0,4], [1,-2,0,4]] },
};

const STR = ['e','B','G','D','A','E'];
const W = Dimensions.get('window').width;

export const ScaleFretboard: React.FC<Props> = ({ scaleName, isActive = false }) => {
  const d = SCALES[scaleName];
  if (!d) return <Text style={{color:'red'}}>?</Text>;
  
  const nf = d.g[0].length;
  const cw = Math.floor((W - 100) / nf);

  // Simple cell with optional note
  const Cell = ({ v, si, fi }: { v: number; si: number; fi: number }) => {
    const hasNote = v !== 0;
    const isRoot = v < 0;
    const finger = Math.abs(v);
    
    return (
      <View style={[S.cell, { width: cw }]}>
        {/* Left border = fret line */}
        <View style={[S.fretL, fi === 0 && S.nutL]} />
        {/* Cell content - either note or empty with string line */}
        {hasNote ? (
          <View style={[S.note, isRoot ? S.noteR : S.noteG, isActive && (isRoot ? S.noteRA : S.noteGA)]}>
            <Text style={S.noteT}>{finger}</Text>
          </View>
        ) : (
          <View style={[S.emptyStr, { height: 2 + si * 0.4 }]} />
        )}
      </View>
    );
  };

  return (
    <View style={S.wrap}>
      <Text style={S.title}>{d.name} - Trastes {d.start}-{d.start + nf - 1}</Text>
      
      {/* Fretboard grid */}
      <View style={S.board}>
        {d.g.map((row, si) => {
          const hasRoot = row.some(x => x < 0);
          return (
            <View key={si} style={S.row}>
              {/* String label */}
              <View style={[S.lbl, hasRoot ? S.lblR : S.lblG]}>
                <Text style={S.lblT}>{STR[si]}</Text>
              </View>
              
              {/* Cells */}
              {row.map((v, fi) => <Cell key={fi} v={v} si={si} fi={fi} />)}
            </View>
          );
        })}
        
        {/* Fret numbers row */}
        <View style={S.fnRow}>
          <View style={{ width: 32 }} />
          {[...Array(nf)].map((_, i) => (
            <View key={i} style={[S.fnCell, { width: cw }]}>
              <Text style={S.fnT}>{d.start + i}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Legend */}
      <View style={S.leg}>
        <View style={S.legI}><View style={[S.dot, { backgroundColor: '#FF6B35' }]} /><Text style={S.legT}>Raíz</Text></View>
        <View style={S.legI}><View style={[S.dot, { backgroundColor: '#00D68F' }]} /><Text style={S.legT}>Notas</Text></View>
        <Text style={[S.legT, { color: '#00D68F' }]}>✓ Todas suenan</Text>
      </View>
    </View>
  );
};

const S = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8 },
  title: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  
  board: { backgroundColor: '#1E1810', borderRadius: 6, padding: 8 },
  
  row: { flexDirection: 'row', alignItems: 'center', height: 36 },
  
  lbl: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  lblG: { backgroundColor: '#00D68F' },
  lblR: { backgroundColor: '#FF6B35' },
  lblT: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  cell: { height: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  
  fretL: { width: 2, height: 30, backgroundColor: '#555' },
  nutL: { width: 4, backgroundColor: '#AAA' },
  
  emptyStr: { flex: 1, backgroundColor: '#A08060' },
  
  note: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#222', marginLeft: 4 },
  noteG: { borderColor: '#00D68F' },
  noteR: { borderColor: '#FF6B35' },
  noteGA: { backgroundColor: '#00D68F' },
  noteRA: { backgroundColor: '#FF6B35' },
  noteT: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  fnRow: { flexDirection: 'row', marginTop: 4 },
  fnCell: { alignItems: 'center' },
  fnT: { fontSize: 10, color: '#888', fontWeight: '600' },
  
  leg: { flexDirection: 'row', marginTop: 10, alignItems: 'center', gap: 12 },
  legI: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legT: { fontSize: 11, color: '#888' },
});
