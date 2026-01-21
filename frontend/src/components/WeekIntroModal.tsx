import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { WeekIntro, WarmUpExercise } from '../data/pedagogicalContent';

interface Props {
  intro: WeekIntro;
  visible: boolean;
  onContinue: () => void;
  onStartWarmUp?: () => void;
}

export const WeekIntroModal: React.FC<Props> = ({ intro, visible, onContinue, onStartWarmUp }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onContinue}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>SEMANA {intro.weekId}</Text>
              </View>
              <Text style={styles.title}>{intro.title}</Text>
            </View>

            {/* What You'll Learn */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="book-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Qué Aprenderás</Text>
              </View>
              {intro.whatYouWillLearn.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Why It Matters */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flash-outline" size={20} color={COLORS.warning} />
                <Text style={styles.sectionTitle}>Por Qué Importa</Text>
              </View>
              <Text style={styles.whyText}>{intro.whyItMatters}</Text>
            </View>

            {/* Styles Used */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="musical-notes-outline" size={20} color={COLORS.secondary} />
                <Text style={styles.sectionTitle}>Estilos</Text>
              </View>
              <View style={styles.stylesRow}>
                {intro.stylesUsed.map((style, idx) => (
                  <View key={idx} style={styles.styleBadge}>
                    <Text style={styles.styleText}>{style}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Warm-Up Preview */}
            {intro.warmUp.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="fitness-outline" size={20} color={COLORS.success} />
                  <Text style={styles.sectionTitle}>Calentamiento</Text>
                </View>
                <View style={styles.warmUpCard}>
                  {intro.warmUp.map((exercise, idx) => (
                    <View key={idx} style={styles.warmUpItem}>
                      <View style={styles.warmUpHeader}>
                        <Text style={styles.warmUpName}>{exercise.name}</Text>
                        <Text style={styles.warmUpDuration}>{exercise.duration}</Text>
                      </View>
                      <Text style={styles.warmUpDesc}>{exercise.description}</Text>
                      {exercise.bpm && exercise.bpm.max > 0 && (
                        <Text style={styles.warmUpBpm}>{exercise.bpm.min}-{exercise.bpm.max} BPM</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Connection */}
            <View style={styles.connectionSection}>
              <View style={styles.connectionCard}>
                <View style={styles.connectionItem}>
                  <Ionicons name="arrow-back-circle-outline" size={18} color={COLORS.textMuted} />
                  <View style={styles.connectionContent}>
                    <Text style={styles.connectionLabel}>Consolida</Text>
                    <Text style={styles.connectionText}>{intro.consolidates.join(' • ')}</Text>
                  </View>
                </View>
                <View style={styles.connectionDivider} />
                <View style={styles.connectionItem}>
                  <Ionicons name="arrow-forward-circle-outline" size={18} color={COLORS.primary} />
                  <View style={styles.connectionContent}>
                    <Text style={styles.connectionLabel}>Desbloquea</Text>
                    <Text style={styles.connectionTextPrimary}>{intro.unlocks.join(' • ')}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {onStartWarmUp && (
              <TouchableOpacity style={styles.warmUpButton} onPress={onStartWarmUp}>
                <Ionicons name="fitness" size={20} color={COLORS.success} />
                <Text style={styles.warmUpButtonText}>Calentar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
              <Text style={styles.continueButtonText}>Comenzar Lección</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  scrollView: {
    padding: SPACING.lg,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  weekBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.sm,
  },
  weekBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 28,
  },
  
  // Sections
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
  
  // List items
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 7,
    marginRight: SPACING.sm,
  },
  listText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  // Why section
  whyText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  
  // Styles badges
  stylesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  styleBadge: {
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  styleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  
  // Warm-up card
  warmUpCard: {
    backgroundColor: COLORS.success + '10',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  warmUpItem: {
    marginBottom: SPACING.md,
  },
  warmUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  warmUpName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.success,
  },
  warmUpDuration: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  warmUpDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  warmUpBpm: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  
  // Connection section
  connectionSection: {
    marginBottom: SPACING.lg,
  },
  connectionCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  connectionContent: {
    flex: 1,
  },
  connectionLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  connectionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  connectionTextPrimary: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  connectionDivider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: SPACING.sm,
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  warmUpButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.success + '20',
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  warmUpButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.success,
  },
  continueButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  continueButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
});
