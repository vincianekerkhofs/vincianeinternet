import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Exercise {
  id: string;
  title: string;
  duration_seconds: number;
}

interface RoutineBlockProps {
  block: {
    id: string;
    block_type: string;
    duration_seconds: number;
    exercises?: Exercise[];
    notes?: string;
    explanation?: string;
  };
  index: number;
  onPress: () => void;
  isActive?: boolean;
  isCompleted?: boolean;
}

const getBlockIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'warmup': return 'flame-outline';
    case 'technique': return 'hand-left-outline';
    case 'main': return 'musical-notes-outline';
    case 'application': return 'guitar-outline';
    case 'review': return 'refresh-outline';
    default: return 'play-outline';
  }
};

const getBlockColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'warmup': return COLORS.warning;
    case 'technique': return COLORS.info;
    case 'main': return COLORS.primary;
    case 'application': return COLORS.success;
    case 'review': return COLORS.secondary;
    default: return COLORS.textSecondary;
  }
};

export const RoutineBlockCard: React.FC<RoutineBlockProps> = ({
  block,
  index,
  onPress,
  isActive = false,
  isCompleted = false,
}) => {
  const color = getBlockColor(block.block_type);
  const icon = getBlockIcon(block.block_type);
  const minutes = Math.ceil(block.duration_seconds / 60);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
        isCompleted && styles.completedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {isCompleted ? (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        ) : (
          <Ionicons name={icon as any} size={24} color={color} />
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.blockType}>
            {block.block_type.charAt(0).toUpperCase() + block.block_type.slice(1)}
          </Text>
          <Text style={styles.duration}>{minutes} min</Text>
        </View>
        
        {block.notes && (
          <Text style={styles.notes} numberOfLines={1}>{block.notes}</Text>
        )}
        
        {block.exercises && block.exercises.length > 0 && (
          <View style={styles.exerciseList}>
            {block.exercises.slice(0, 3).map((ex, i) => (
              <Text key={ex.id} style={styles.exerciseItem} numberOfLines={1}>
                {i + 1}. {ex.title}
              </Text>
            ))}
          </View>
        )}
      </View>
      
      <Ionicons
        name={isActive ? 'play-circle' : 'chevron-forward'}
        size={isActive ? 28 : 20}
        color={isActive ? COLORS.primary : COLORS.textMuted}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  activeContainer: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  completedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  blockType: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  duration: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  notes: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  exerciseList: {
    marginTop: SPACING.xs,
  },
  exerciseItem: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
});
