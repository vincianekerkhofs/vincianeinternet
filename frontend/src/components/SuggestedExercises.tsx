import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, getDomainColor } from '../constants/theme';

interface Exercise {
  id: string;
  title: string;
  domain: string;
  difficulty_tier: string;
  bpm_start: number;
  bpm_target: number;
}

interface Props {
  warmUpExercises: Exercise[];
  reinforceExercises: Exercise[];
  weekNum: number;
  onClose?: () => void;
}

export const SuggestedExercises: React.FC<Props> = ({
  warmUpExercises,
  reinforceExercises,
  weekNum,
  onClose
}) => {
  const hasExercises = warmUpExercises.length > 0 || reinforceExercises.length > 0;

  if (!hasExercises) {
    return null;
  }

  const renderExerciseCard = (exercise: Exercise, type: 'warmUp' | 'reinforce') => {
    const domainColor = getDomainColor(exercise.domain);
    const typeIcon = type === 'warmUp' ? 'fitness-outline' : 'barbell-outline';
    const typeColor = type === 'warmUp' ? COLORS.success : COLORS.primary;

    return (
      <TouchableOpacity
        key={exercise.id}
        style={styles.exerciseCard}
        onPress={() => {
          router.push({
            pathname: '/practice',
            params: { exerciseId: exercise.id }
          });
        }}
      >
        <View style={styles.exerciseHeader}>
          <View style={[styles.typeIndicator, { backgroundColor: typeColor + '20' }]}>
            <Ionicons name={typeIcon as any} size={14} color={typeColor} />
          </View>
          <Text style={styles.exerciseTitle} numberOfLines={1}>{exercise.title}</Text>
        </View>
        
        <View style={styles.exerciseMeta}>
          <View style={[styles.domainBadge, { backgroundColor: domainColor + '20' }]}>
            <Text style={[styles.domainText, { color: domainColor }]}>
              {exercise.domain?.split(' ')[0]}
            </Text>
          </View>
          <Text style={styles.bpmText}>{exercise.bpm_start}-{exercise.bpm_target} BPM</Text>
        </View>
        
        <Ionicons 
          name="play-circle" 
          size={24} 
          color={typeColor} 
          style={styles.playIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="library-outline" size={20} color={COLORS.primary} />
          <Text style={styles.headerTitle}>Ejercicios Sugeridos</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/(tabs)/exercises')}
        >
          <Text style={styles.viewAllText}>Ver Biblioteca</Text>
          <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Basado en Semana {weekNum} del programa
      </Text>

      {/* Warm-up Exercises */}
      {warmUpExercises.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="fitness" size={16} color={COLORS.success} />
            <Text style={styles.sectionTitle}>Calentamiento</Text>
            <Text style={styles.sectionCount}>{warmUpExercises.length}</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exerciseScroll}
          >
            {warmUpExercises.map(ex => renderExerciseCard(ex, 'warmUp'))}
          </ScrollView>
        </View>
      )}

      {/* Reinforce Exercises */}
      {reinforceExercises.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="barbell" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Refuerzo</Text>
            <Text style={styles.sectionCount}>{reinforceExercises.length}</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.exerciseScroll}
          >
            {reinforceExercises.map(ex => renderExerciseCard(ex, 'reinforce'))}
          </ScrollView>
        </View>
      )}

      {/* Connection explanation */}
      <View style={styles.connectionCard}>
        <Ionicons name="link-outline" size={16} color={COLORS.textMuted} />
        <Text style={styles.connectionText}>
          Estos ejercicios complementan la lección actual del programa
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  
  // Sections
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
  },
  sectionCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  exerciseScroll: {
    paddingRight: SPACING.md,
    gap: SPACING.sm,
  },
  
  // Exercise Card
  exerciseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    width: 180,
    position: 'relative',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  typeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  domainBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  domainText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  bpmText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  playIcon: {
    position: 'absolute',
    right: SPACING.sm,
    bottom: SPACING.sm,
    opacity: 0.7,
  },
  
  // Connection
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  connectionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    flex: 1,
  },
});
