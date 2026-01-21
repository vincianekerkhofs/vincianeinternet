import React, { useState } from 'react';
import { View, StyleSheet, Text, LayoutChangeEvent, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import { getNoteAtFret, letterToSolfege, NOTE_MAPPING_REFERENCE } from '../utils/noteNames';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
  showNoteNames?: boolean;
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
// Dual naming: letter/solfege
const STRING_NAMES_DUAL = ['e/Mi', 'B/Si', 'G/Sol', 'D/Re', 'A/La', 'E/Mi'];
const NUM_FRETS = 4;

const THEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
};

// Note Names Info Modal Component
const NoteNamesModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={modalStyles.overlay}>
      <View style={modalStyles.container}>
        <View style={modalStyles.header}>
          <Text style={modalStyles.title}>Equivalencia de Notas</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <Text style={modalStyles.subtitle}>Notación Anglosajona ↔ Solfeo Latino</Text>
        <View style={modalStyles.table}>
          {NOTE_MAPPING_REFERENCE.slice(0, 7).map((item, idx) => (
            <View key={idx} style={modalStyles.row}>
              <Text style={modalStyles.letter}>{item.letter}</Text>
              <Text style={modalStyles.equals}>=</Text>
              <Text style={modalStyles.solfege}>{item.solfege}</Text>
            </View>
          ))}
        </View>
        <Text style={modalStyles.note}>
          # = sostenido (sharp) · b = bemol (flat)
        </Text>
        <Text style={modalStyles.example}>
          Ejemplo: F# = Fa# · Bb = Sib
        </Text>
      </View>
    </View>
  </Modal>
);

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 320,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  table: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  letter: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  equals: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  solfege: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.success,
    textAlign: 'center',
  },
  note: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  example: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export const ScaleFretboard: React.FC<Props> = ({
  scaleName,
  height = 260,
  isActive = false,
  showNoteNames = true,
}) => {
  // Use onLayout to get REAL measured width
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  const scale = SCALES[scaleName];
  
  if (!scale) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Escala no encontrada: {scaleName}</Text>
      </View>
    );
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== measuredWidth) {
      setMeasuredWidth(width);
    }
  };

  // Use measured width or fallback
  const actualWidth = measuredWidth || 300;
  
  // SVG dimensions based on REAL measured width
  const svgHeight = height - 100;
  const paddingTop = 15;
  const paddingBottom = 20;
  const paddingLeft = 15;
  const paddingRight = 15;
  
  const fretboardWidth = actualWidth - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / NUM_FRETS;
  const stringSpacing = fretboardHeight / 5;

  const stringHasRoot = (strIdx: number) => 
    scale.notes.some(n => n.s === strIdx && n.root);

  // Get note name at position
  const getNoteNameAtPosition = (stringNum: number, fret: number): string => {
    const actualFret = scale.start + fret;
    const note = getNoteAtFret(stringNum + 1, actualFret);
    const solfege = letterToSolfege(note);
    return `${note}/${solfege}`;
  };

  // TOP ROW: String indicators with dual naming
  const renderTopIndicators = () => (
    <View style={styles.indicatorRow}>
      {STRING_NAMES_DUAL.map((name, i) => {
        const isRoot = stringHasRoot(i);
        return (
          <View key={i} style={[styles.indicator, { backgroundColor: isRoot ? THEME.ROOT : THEME.NOTE }]}>
            <Text style={styles.indicatorText}>{name.split('/')[0]}</Text>
          </View>
        );
      })}
    </View>
  );

  // SVG: String lines
  const renderStrings = () =>
    STRING_NAMES.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.5;
      return (
        <Line key={`str-${i}`}
          x1={paddingLeft} y1={y}
          x2={actualWidth - paddingRight} y2={y}
          stroke="#B8977E" strokeWidth={thickness}
        />
      );
    });

  // SVG: Fret lines
  const renderFrets = () => {
    const lines = [];
    for (let i = 0; i <= NUM_FRETS; i++) {
      const x = paddingLeft + i * fretWidth;
      const isNut = i === 0;
      lines.push(
        <Line key={`fret-${i}`}
          x1={x} y1={paddingTop}
          x2={x} y2={paddingTop + fretboardHeight}
          stroke={isNut ? '#D4D4D4' : '#5A5A5A'}
          strokeWidth={isNut ? 5 : 2}
        />
      );
    }
    return lines;
  };

  // SVG: Note circles with note names
  const renderNotes = () => {
    const dots = [];
    for (let i = 0; i < scale.notes.length; i++) {
      const note = scale.notes[i];
      const strIdx = note.s;
      const fretOffset = note.f;
      const isRoot = note.root === true;
      
      const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
      const y = paddingTop + strIdx * stringSpacing;
      const fill = isRoot ? THEME.ROOT : (isActive ? THEME.NOTE : '#2A2A2A');
      const stroke = isRoot ? THEME.ROOT : THEME.NOTE;
      
      // Get note name if showNoteNames
      const actualFret = scale.start + fretOffset;
      const noteName = getNoteAtFret(strIdx + 1, actualFret);
      const solfegeName = letterToSolfege(noteName);
      
      dots.push(
        <G key={`d-${i}`}>
          {isActive && <Circle cx={x} cy={y} r={18} fill={fill} opacity={0.25} />}
          <Circle cx={x} cy={y} r={14} fill={fill} stroke={stroke} strokeWidth={2} />
          {showNoteNames && (
            <SvgText
              x={x}
              y={y + 4}
              fill="#FFF"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
            >
              {noteName}
            </SvgText>
          )}
        </G>
      );
    }
    return dots;
  };

  // Finger overlays
  const renderFingerOverlays = () => {
    if (actualWidth <= 0) return null;
    const overlays = [];
    for (let i = 0; i < scale.notes.length; i++) {
      const note = scale.notes[i];
      const strIdx = note.s;
      const fretOffset = note.f;
      const finger = note.finger;
      
      const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
      const y = paddingTop + strIdx * stringSpacing;
      const xPercent = (x / actualWidth) * 100;
      const yPercent = (y / svgHeight) * 100;
      
      overlays.push(
        <View key={`fo-${i}`} style={[styles.fingerOverlay, {
          left: `${xPercent}%`, top: `${yPercent}%`,
          transform: [{ translateX: -8 }, { translateY: -8 }]
        }]}>
          <Text style={styles.fingerText}>{finger}</Text>
        </View>
      );
    }
    return overlays;
  };

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: NUM_FRETS }, (_, i) => (
        <Text key={i} style={styles.fretNum}>{scale.start + i}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.outerWrapper} onLayout={handleLayout}>
      {/* Note names info modal */}
      <NoteNamesModal visible={showNoteModal} onClose={() => setShowNoteModal(false)} />
      
      {/* Top indicator row */}
      {renderTopIndicators()}
      
      {/* SVG Fretboard - only render when we have measured width */}
      {measuredWidth > 0 && (
        <View style={styles.svgContainer}>
          <Svg 
            width={actualWidth} 
            height={svgHeight}
            viewBox={`0 0 ${actualWidth} ${svgHeight}`}
          >
            <Rect x={paddingLeft} y={paddingTop} width={fretboardWidth} height={fretboardHeight}
              fill="#1E1810" rx={4} />
            {renderFrets()}
            {renderStrings()}
            {renderNotes()}
          </Svg>
          {!showNoteNames && renderFingerOverlays()}
        </View>
      )}
      
      {/* Fret numbers */}
      {renderFretNumbers()}
      
      {/* Position indicator */}
      <Text style={styles.positionText}>Trastes {scale.start}–{scale.start + NUM_FRETS - 1}</Text>
      
      {/* Legend with info button */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.ROOT }]} />
          <Text style={styles.legendText}>Raíz</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: THEME.NOTE }]} />
          <Text style={styles.legendText}>Nota</Text>
        </View>
        <TouchableOpacity 
          style={styles.infoButton} 
          onPress={() => setShowNoteModal(true)}
        >
          <Ionicons name="information-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.infoButtonText}>A=La?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Outer wrapper - ensures full width expansion
  outerWrapper: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    overflow: 'visible',
  },
  container: { alignItems: 'center' },
  errorText: { color: '#FF4757', fontSize: 14, padding: 20 },
  
  // Top indicator row
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  indicator: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  indicatorText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  
  // SVG container - no width constraints, overflow visible
  svgContainer: { 
    position: 'relative',
    overflow: 'visible',
    alignSelf: 'stretch',
  },
  
  // Finger overlays
  fingerOverlay: {
    position: 'absolute', width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  fingerText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  
  // Fret numbers
  fretNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: -5,
  },
  fretNum: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  
  // Position text
  positionText: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginTop: 4 },
  
  // Legend
  legend: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 8, 
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 10, color: COLORS.textMuted },
  fingerHint: { fontSize: 10, color: COLORS.textMuted, marginLeft: 8 },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primary + '20',
    borderRadius: BORDER_RADIUS.sm,
  },
  infoButtonText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
