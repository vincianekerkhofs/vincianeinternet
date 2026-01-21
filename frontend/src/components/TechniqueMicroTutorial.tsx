/**
 * GUITAR GUIDE PRO - TECHNIQUE MICRO-TUTORIAL
 * Floating panel with technique explanation
 * Shows when user taps a technique icon
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { TechniqueDefinition } from '../data/techniques';
import { getTechniqueIcon } from './TechniqueIcons';

interface Props {
  technique: TechniqueDefinition | null;
  visible: boolean;
  onClose: () => void;
  onPractice?: () => void;
}

export const TechniqueMicroTutorial: React.FC<Props> = ({
  technique,
  visible,
  onClose,
  onPractice,
}) => {
  if (!technique) return null;

  const handLabel = technique.hand === 'left' ? 'Mano Izquierda' : 'Mano Derecha';
  const handIcon = technique.hand === 'left' ? 'hand-left-outline' : 'hand-right-outline';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: technique.color + '30' }]}>
                {getTechniqueIcon(technique.id, { size: 28, color: technique.color })}
              </View>
              <View>
                <Text style={styles.title}>{technique.name}</Text>
                <View style={styles.handBadge}>
                  <Ionicons name={handIcon as any} size={12} color={COLORS.textMuted} />
                  <Text style={styles.handText}>{handLabel}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* What it is */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="help-circle-outline" size={18} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>¿Qué es?</Text>
              </View>
              <Text style={styles.whatItIs}>{technique.whatItIs}</Text>
            </View>

            {/* How to do it */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="hand-left-outline" size={18} color={COLORS.secondary} />
                <Text style={styles.sectionTitle}>Cómo hacerlo</Text>
              </View>
              {technique.howToDo.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>

            {/* Audio description */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="musical-notes-outline" size={18} color={COLORS.warning} />
                <Text style={styles.sectionTitle}>Cómo suena</Text>
              </View>
              <View style={styles.audioCard}>
                <Text style={styles.audioText}>{technique.audioDescription}</Text>
              </View>
            </View>

            {/* Common mistakes */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="warning-outline" size={18} color={COLORS.error} />
                <Text style={styles.sectionTitle}>Errores comunes</Text>
              </View>
              {technique.commonMistakes.map((mistake, index) => (
                <View key={index} style={styles.mistakeRow}>
                  <Ionicons name="close-circle" size={14} color={COLORS.error} style={{ marginTop: 2 }} />
                  <Text style={styles.mistakeText}>{mistake}</Text>
                </View>
              ))}
            </View>

            {/* Notation hint */}
            {technique.notation && (
              <View style={styles.notationHint}>
                <Text style={styles.notationLabel}>En tablatura:</Text>
                <View style={styles.notationBadge}>
                  <Text style={styles.notationText}>{technique.notation}</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Practice CTA */}
          {onPractice && (
            <TouchableOpacity style={styles.practiceButton} onPress={onPractice}>
              <Ionicons name="fitness-outline" size={20} color={COLORS.text} />
              <Text style={styles.practiceButtonText}>Practicar esta técnica</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: COLORS.backgroundCard,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '85%',
    paddingBottom: SPACING.xl,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  handBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  handText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  
  // Content
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  // What it is
  whatItIs: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  
  // How to do it
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  // Audio
  audioCard: {
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  audioText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  
  // Mistakes
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  mistakeText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  
  // Notation
  notationHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  notationLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  notationBadge: {
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  notationText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  
  // Practice button
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  practiceButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
});
