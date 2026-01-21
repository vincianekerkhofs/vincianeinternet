import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StrumPattern } from '../data/strumPatterns';

interface Props {
  pattern: StrumPattern;
  currentSubdivision: number; // 0-7 for 8th note subdivisions
  isPlaying: boolean;
}

export const StrumVisualizer: React.FC<Props> = ({ pattern, currentSubdivision, isPlaying }) => {
  const [helpVisible, setHelpVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header with pattern name and help button */}
      <View style={styles.header}>
        <Text style={styles.patternName}>{pattern.name}</Text>
        <TouchableOpacity style={styles.helpButton} onPress={() => setHelpVisible(true)}>
          <Text style={styles.helpButtonText}>Rasgueos</Text>
          <Ionicons name="help-circle-outline" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Strum pattern grid */}
      <View style={styles.patternGrid}>
        {pattern.count.map((count, index) => {
          const arrow = pattern.pattern[index];
          const isActive = isPlaying && currentSubdivision === index;
          const hasStrum = arrow !== '';
          
          return (
            <View 
              key={index} 
              style={[
                styles.cell,
                isActive && styles.cellActive,
                hasStrum && isActive && styles.cellActiveWithStrum,
              ]}
            >
              {/* Count number */}
              <Text style={[styles.countText, isActive && styles.countTextActive]}>
                {count}
              </Text>
              
              {/* Arrow or empty */}
              <View style={[styles.arrowBox, hasStrum && isActive && styles.arrowBoxActive]}>
                <Text style={[
                  styles.arrowText, 
                  hasStrum && styles.arrowTextVisible,
                  hasStrum && isActive && styles.arrowTextActive,
                ]}>
                  {arrow || '·'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Help Modal */}
      <Modal
        visible={helpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setHelpVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Cómo tocar este rasgueo?</Text>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLine}>↓ = rasgueo hacia abajo</Text>
              <Text style={styles.modalLine}>↑ = rasgueo hacia arriba</Text>
              <Text style={styles.modalLine}>Cuenta: 1 &amp; 2 &amp; 3 &amp; 4 &amp;</Text>
              <Text style={styles.modalLine}>Sigue las flechas con el click</Text>
              <Text style={styles.modalLine}>Reggae: golpes cortos en 2 y 4</Text>
            </View>
            
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setHelpVisible(false)}>
              <Text style={styles.modalCloseText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  patternName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
  },
  helpButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  
  // Pattern grid
  patternGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    marginHorizontal: 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  cellActive: {
    backgroundColor: COLORS.primary + '40',
  },
  cellActiveWithStrum: {
    backgroundColor: COLORS.primary,
  },
  countText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  countTextActive: {
    color: COLORS.text,
  },
  arrowBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  arrowBoxActive: {
    backgroundColor: COLORS.text + '30',
  },
  arrowText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  arrowTextVisible: {
    color: COLORS.text,
  },
  arrowTextActive: {
    color: COLORS.text,
    fontSize: 24,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  modalBody: {
    marginBottom: SPACING.lg,
  },
  modalLine: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  modalCloseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
});
