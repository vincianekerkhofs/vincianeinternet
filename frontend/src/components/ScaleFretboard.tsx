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

const THEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  BG: '#1E1810',
  STRING: '#B8977E',
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  width = SCREEN_WIDTH - 32,
  height = 260,
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
  const noteMap = new Map<string, { finger: number; root?: boolean }>();
  scale.notes.forEach(note => {
    noteMap.set(`${note.s}-${note.f}`, { finger: note.finger, root: note.root });
  });

  const stringHasRoot = (strIdx: number) => 
    scale.notes.some(n => n.s === strIdx && n.root);

  // Calculate cell size
  const boardWidth = width - 20;
  const cellWidth = boardWidth / NUM_FRETS;
  const cellHeight = 32;

  return (
    <View style={{ width, alignItems: 'center' }}>
      {/* String indicators */}
      <View style={{ flexDirection: 'row', marginBottom: 8, justifyContent: 'space-around', width: boardWidth }}>
        {STRING_NAMES.map((name, idx) => (
          <View 
            key={`ind-${idx}`}
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: stringHasRoot(idx) ? THEME.ROOT : THEME.NOTE,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: 'bold' }}>{name}</Text>
          </View>
        ))}
      </View>

      {/* Fretboard */}
      <View style={{ width: boardWidth, backgroundColor: THEME.BG, borderRadius: 6, padding: 4 }}>
        {/* 6 string rows */}
        {STRING_NAMES.map((_, strIdx) => (
          <View 
            key={`str-${strIdx}`}
            style={{ 
              flexDirection: 'row', 
              height: cellHeight,
            }}
          >
            {/* 4 fret cells */}
            {Array.from({ length: NUM_FRETS }).map((_, fretIdx) => {
              const noteKey = `${strIdx}-${fretIdx}`;
              const noteData = noteMap.get(noteKey);
              const hasNote = !!noteData;
              const isRoot = noteData?.root === true;
              const finger = noteData?.finger;
              const stringThickness = 1.5 + strIdx * 0.4;

              return (
                <View 
                  key={`cell-${strIdx}-${fretIdx}`}
                  style={{
                    flex: 1,
                    height: cellHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRightWidth: fretIdx < NUM_FRETS - 1 ? 2 : 0,
                    borderRightColor: '#5A5A5A',
                    borderLeftWidth: fretIdx === 0 ? 4 : 0,
                    borderLeftColor: '#CCC',
                  }}
                >
                  {/* String line */}
                  <View 
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: stringThickness,
                      backgroundColor: THEME.STRING,
                    }}
                  />
                  
                  {/* Note circle or debug number */}
                  {hasNote ? (
                    <View 
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isRoot ? THEME.ROOT : (isActive ? THEME.NOTE : '#2A2A2A'),
                        borderWidth: 2,
                        borderColor: isRoot ? THEME.ROOT : THEME.NOTE,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFF', fontSize: 14, fontWeight: 'bold' }}>{finger}</Text>
                    </View>
                  ) : (
                    <Text style={{ color: '#444', fontSize: 10 }}>{fretIdx}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Fret numbers */}
      <View style={{ flexDirection: 'row', width: boardWidth, marginTop: 4 }}>
        {Array.from({ length: NUM_FRETS }).map((_, i) => (
          <View key={`fn-${i}`} style={{ width: cellWidth, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: '#888', fontWeight: '600' }}>{scale.start + i}</Text>
          </View>
        ))}
      </View>

      {/* Position text */}
      <Text style={{ marginTop: 6, fontSize: 12, color: COLORS.primary, fontWeight: '600' }}>
        Trastes {scale.start}–{scale.start + NUM_FRETS - 1}
      </Text>

      {/* Legend */}
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: THEME.ROOT }} />
          <Text style={{ fontSize: 11, color: '#888' }}>Raíz</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: THEME.NOTE }} />
          <Text style={{ fontSize: 11, color: '#888' }}>Nota</Text>
        </View>
        <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '500' }}>1-4 = Dedos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorBox: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4757',
    fontSize: 14,
  },
});
