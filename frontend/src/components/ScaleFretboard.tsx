import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

const SCALES: Record<string, { 
  name: string; 
  start: number; 
  notes: { s: number; f: number; finger: number; root?: boolean }[] 
}> = {
  'Am_pent_box1': {
    name: 'Am Pentatónica',
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

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const NUM_FRETS = 4;
const NUM_STRINGS = 6;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  width = SCREEN_WIDTH - 32,
  isActive = false,
}) => {
  const scale = SCALES[scaleName];
  
  if (!scale) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  // Build lookup
  const getNote = (s: number, f: number) => {
    return scale.notes.find(n => n.s === s && n.f === f);
  };
  
  const stringHasRoot = (strIdx: number) => 
    scale.notes.some(n => n.s === strIdx && n.root);

  // Build flat array of all 24 cells
  const allCells: { strIdx: number; fretIdx: number }[] = [];
  for (let s = 0; s < NUM_STRINGS; s++) {
    for (let f = 0; f < NUM_FRETS; f++) {
      allCells.push({ strIdx: s, fretIdx: f });
    }
  }

  const cellW = (width - 40) / NUM_FRETS;
  const cellH = 32;

  return (
    <View style={[styles.container, { width }]}>
      {/* String indicators at top */}
      <View style={styles.indicatorRow}>
        {STRING_NAMES.map((name, idx) => (
          <View 
            key={idx}
            style={[
              styles.indicator,
              { backgroundColor: stringHasRoot(idx) ? '#FF6B35' : '#00D68F' }
            ]}
          >
            <Text style={styles.indicatorText}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Fretboard grid */}
      <View style={[styles.fretboard, { width: width - 20 }]}>
        {/* Row 0 (high e) */}
        <View style={styles.row}>
          {[0, 1, 2, 3].map(f => {
            const note = getNote(0, f);
            return (
              <View key={f} style={styles.cell}>
                <View style={[styles.string, { height: 1.5 }]} />
                {note && (
                  <View style={[styles.note, { backgroundColor: note.root ? '#FF6B35' : (isActive ? '#00D68F' : '#2A2A2A'), borderColor: note.root ? '#FF6B35' : '#00D68F' }]}>
                    <Text style={styles.finger}>{note.finger}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Row 1 (B) */}
        <View style={styles.row}>
          {[0, 1, 2, 3].map(f => {
            const note = getNote(1, f);
            return (
              <View key={f} style={styles.cell}>
                <View style={[styles.string, { height: 1.9 }]} />
                {note && (
                  <View style={[styles.note, { backgroundColor: note.root ? '#FF6B35' : (isActive ? '#00D68F' : '#2A2A2A'), borderColor: note.root ? '#FF6B35' : '#00D68F' }]}>
                    <Text style={styles.finger}>{note.finger}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Row 2 (G) */}
        <View style={styles.row}>
          {[0, 1, 2, 3].map(f => {
            const note = getNote(2, f);
            return (
              <View key={f} style={styles.cell}>
                <View style={[styles.string, { height: 2.3 }]} />
                {note && (
                  <View style={[styles.note, { backgroundColor: note.root ? '#FF6B35' : (isActive ? '#00D68F' : '#2A2A2A'), borderColor: note.root ? '#FF6B35' : '#00D68F' }]}>
                    <Text style={styles.finger}>{note.finger}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Row 3 (D) */}
        <View style={styles.row}>
          {[0, 1, 2, 3].map(f => {
            const note = getNote(3, f);
            return (
              <View key={f} style={styles.cell}>
                <View style={[styles.string, { height: 2.7 }]} />
                {note && (
                  <View style={[styles.note, { backgroundColor: note.root ? '#FF6B35' : (isActive ? '#00D68F' : '#2A2A2A'), borderColor: note.root ? '#FF6B35' : '#00D68F' }]}>
                    <Text style={styles.finger}>{note.finger}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Row 4 (A) */}
        <View style={styles.row}>
          {[0, 1, 2, 3].map(f => {
            const note = getNote(4, f);
            return (
              <View key={f} style={styles.cell}>
                <View style={[styles.string, { height: 3.1 }]} />
                {note && (
                  <View style={[styles.note, { backgroundColor: note.root ? '#FF6B35' : (isActive ? '#00D68F' : '#2A2A2A'), borderColor: note.root ? '#FF6B35' : '#00D68F' }]}>
                    <Text style={styles.finger}>{note.finger}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        
        {/* Row 5 (E) */}
        <View style={styles.row}>
          {[0, 1, 2, 3].map(f => {
            const note = getNote(5, f);
            return (
              <View key={f} style={styles.cell}>
                <View style={[styles.string, { height: 3.5 }]} />
                {note && (
                  <View style={[styles.note, { backgroundColor: note.root ? '#FF6B35' : (isActive ? '#00D68F' : '#2A2A2A'), borderColor: note.root ? '#FF6B35' : '#00D68F' }]}>
                    <Text style={styles.finger}>{note.finger}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Fret numbers */}
      <View style={[styles.fretNumbers, { width: width - 20 }]}>
        <View style={[styles.fretNum, { width: cellW }]}><Text style={styles.fretNumText}>{scale.start}</Text></View>
        <View style={[styles.fretNum, { width: cellW }]}><Text style={styles.fretNumText}>{scale.start + 1}</Text></View>
        <View style={[styles.fretNum, { width: cellW }]}><Text style={styles.fretNumText}>{scale.start + 2}</Text></View>
        <View style={[styles.fretNum, { width: cellW }]}><Text style={styles.fretNumText}>{scale.start + 3}</Text></View>
      </View>

      {/* Position and legend */}
      <Text style={styles.posText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
          <Text style={styles.legendLabel}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#00D68F' }]} />
          <Text style={styles.legendLabel}>Nota</Text>
        </View>
        <Text style={styles.fingerHint}>1-4 = Dedos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  errorBox: {
    padding: 20,
  },
  errorText: {
    color: '#F00',
    fontSize: 14,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  indicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  fretboard: {
    backgroundColor: '#1E1810',
    borderRadius: 6,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F00',
  },
  string: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#B8977E',
  },
  note: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finger: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  fretNumbers: {
    flexDirection: 'row',
    marginTop: 4,
  },
  fretNum: {
    alignItems: 'center',
  },
  fretNumText: {
    fontSize: 11,
    color: '#888',
    fontWeight: '600',
  },
  posText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
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
  legendLabel: {
    fontSize: 11,
    color: '#888',
  },
  fingerHint: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
