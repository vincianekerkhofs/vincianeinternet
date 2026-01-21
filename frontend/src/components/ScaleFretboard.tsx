import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { ChordFretboard } from './ChordFretboard';
import { CHORD_SHAPES } from '../data/curriculum';

interface ScaleFretboardProps {
  scaleName: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

// Scale descriptions for display
const SCALE_INFO: Record<string, {
  name: string;
  pattern: string;
  fingers: string;
  tips: string;
}> = {
  'Am_pent_box1': {
    name: 'La menor Pentatónica - Posición 1',
    pattern: 'Trastes 5-8 | Todas las cuerdas suenan',
    fingers: '1-1-1-1-1-1 (traste 5) | 3-3-3 (traste 7) | 4-4-4 (traste 8)',
    tips: 'La raíz (A) está en las cuerdas 1, 5 y 6 en el traste 5',
  },
  'Am_blues': {
    name: 'La menor Blues',
    pattern: 'Trastes 5-8 | Incluye la "blue note" en traste 6',
    fingers: '1-1-1-1-1-1 (traste 5) | 2 (traste 6, cuerda A) | 3-3-3 (traste 7) | 4-4-4 (traste 8)',
    tips: 'La blue note está en el traste 6, cuerda A',
  },
  'C_major_box1': {
    name: 'Do Mayor - Posición 1',
    pattern: 'Trastes 7-10 | Escala de 7 notas',
    fingers: '1 (trastes 7-8) | 2-3 (trastes 8-9) | 4 (traste 10)',
    tips: 'La raíz (C) está en traste 8 cuerda 1 y traste 10 cuerda 5',
  },
};

/**
 * Scale Fretboard Component
 * Shows the scale using ChordFretboard (single note per string) 
 * plus detailed text instructions for the full scale pattern
 */
export const ScaleFretboard: React.FC<ScaleFretboardProps> = ({
  scaleName,
  width = 320,
  height = 260,
  isActive = false,
}) => {
  const scaleInfo = SCALE_INFO[scaleName];
  const chordShape = CHORD_SHAPES[scaleName];
  
  if (!scaleInfo || !chordShape) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Escala: {scaleName}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scale name */}
      <Text style={styles.title}>{scaleInfo.name}</Text>
      
      {/* Use ChordFretboard to show the basic shape */}
      <ChordFretboard 
        shape={scaleName as any} 
        width={width} 
        height={height - 80} 
        isActive={isActive} 
      />
      
      {/* Scale pattern info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Patrón completo:</Text>
        <Text style={styles.infoText}>{scaleInfo.pattern}</Text>
        
        <Text style={styles.infoLabel}>Digitación:</Text>
        <Text style={styles.infoText}>{scaleInfo.fingers}</Text>
        
        <Text style={styles.tipText}>💡 {scaleInfo.tips}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: SPACING.md,
    width: '100%',
    marginTop: SPACING.sm,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.warning,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
