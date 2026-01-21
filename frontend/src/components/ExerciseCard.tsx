import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, getDifficultyColor, getDomainColor } from '../constants/theme';

interface ExerciseCardProps {
  exercise: {
    id: string;
    title: string;
    domain: string;
    difficulty_tier: string;
    duration_seconds: number;
    bpm_start: number;
    bpm_target: number;
    description_training: string;
    tags?: string[];
  };
  onPress: () => void;
  compact?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress, compact = false }) => {
  const difficultyColor = getDifficultyColor(exercise.difficulty_tier);
  const domainColor = getDomainColor(exercise.domain);
  const minutes = Math.ceil(exercise.duration_seconds / 60);

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.domainDot, { backgroundColor: domainColor }]} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{exercise.title}</Text>
          <Text style={styles.compactMeta}>{minutes} min • {exercise.bpm_start}-{exercise.bpm_target} BPM</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={[styles.domainBadge, { backgroundColor: domainColor + '20' }]}>
          <Text style={[styles.domainText, { color: domainColor }]}>{exercise.domain}</Text>
        </View>
        <View style={[styles.difficultyBadge, { borderColor: difficultyColor }]}>
          <Text style={[styles.difficultyText, { color: difficultyColor }]}>{exercise.difficulty_tier}</Text>
        </View>
      </View>
      
      <Text style={styles.title}>{exercise.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{exercise.description_training}</Text>
      
      <View style={styles.footer}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{minutes} min</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="speedometer-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.metaText}>{exercise.bpm_start}-{exercise.bpm_target} BPM</Text>
        </View>
        <Ionicons name="play-circle" size={24} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  domainBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  domainText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  // Compact styles
  compactCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  domainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  compactMeta: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
