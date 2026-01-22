/**
 * GUITAR GUIDE PRO - TECHNIQUE DETAIL & MASTER CLASS
 * Individual technique learning path with 4 levels
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getTechniqueById, TechniqueDefinition } from '../../src/data/techniques';
import { getTechniqueIcon } from '../../src/components/TechniqueIcons';
import { getTechniqueMasteryById, addPracticeTime, TechniqueMastery } from '../../src/utils/techniqueStorage';

const { width } = Dimensions.get('window');

export default function TechniqueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [technique, setTechnique] = useState<TechniqueDefinition | null>(null);
  const [mastery, setMastery] = useState<TechniqueMastery | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(1);

  useEffect(() => {
    if (id) {
      const tech = getTechniqueById(id);
      setTechnique(tech || null);
      loadMastery();
    }
  }, [id]);

  const loadMastery = async () => {
    if (id) {
      const data = await getTechniqueMasteryById(id);
      setMastery(data);
      if (data?.level) {
        setSelectedLevel(Math.min(data.level + 1, 4));
      }
    }
  };

  const handleStartPractice = async () => {
    if (!technique) return;
    
    // Navigate to dedicated technique practice screen
    router.push({
      pathname: '/technique-practice/[id]',
      params: { id: technique.id, level: String(selectedLevel) }
    } as any);
  };

  if (!technique) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentLevel = mastery?.level || 0;
  const practiceMinutes = mastery?.totalPracticeMinutes || 0;
  const handLabel = technique.hand === 'left' ? 'Mano Izquierda' : 'Mano Derecha';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Master Class</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Technique Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: technique.color + '20' }]}>
            {getTechniqueIcon(technique.id, { size: 64, color: technique.color })}
          </View>
          <Text style={styles.techniqueName}>{technique.name}</Text>
          <View style={styles.handBadge}>
            <Ionicons 
              name={technique.hand === 'left' ? 'hand-left-outline' : 'hand-right-outline'} 
              size={14} 
              color={COLORS.textMuted} 
            />
            <Text style={styles.handText}>{handLabel}</Text>
          </View>
          
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{practiceMinutes}</Text>
                <Text style={styles.statLabel}>min practicados</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Nivel {currentLevel}</Text>
                <Text style={styles.statLabel}>de 4</Text>
              </View>
            </View>
            
            <View style={styles.levelDots}>
              {[1, 2, 3, 4].map(level => (
                <View 
                  key={level}
                  style={[
                    styles.levelDot,
                    level <= currentLevel && { backgroundColor: COLORS.success },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* What it is */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué es?</Text>
          <Text style={styles.description}>{technique.whatItIs}</Text>
        </View>

        {/* How to do it */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cómo hacerlo</Text>
          {technique.howToDo.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Levels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Niveles de Maestría</Text>
          {technique.levels.map((level) => {
            const isCompleted = level.level <= currentLevel;
            const isSelected = level.level === selectedLevel;
            const isLocked = level.level > currentLevel + 1;
            
            return (
              <TouchableOpacity
                key={level.level}
                style={[
                  styles.levelCard,
                  isSelected && styles.levelCardSelected,
                  isCompleted && styles.levelCardCompleted,
                  isLocked && styles.levelCardLocked,
                ]}
                onPress={() => !isLocked && setSelectedLevel(level.level)}
                disabled={isLocked}
              >
                <View style={styles.levelHeader}>
                  <View style={[
                    styles.levelBadge,
                    isCompleted && { backgroundColor: COLORS.success },
                    isLocked && { backgroundColor: COLORS.surfaceLight },
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={14} color={COLORS.text} />
                    ) : (
                      <Text style={styles.levelBadgeText}>{level.level}</Text>
                    )}
                  </View>
                  <View style={styles.levelInfo}>
                    <Text style={[
                      styles.levelName,
                      isLocked && { color: COLORS.textMuted }
                    ]}>
                      {level.name}
                    </Text>
                    <Text style={styles.levelDescription}>{level.description}</Text>
                  </View>
                  {isLocked && (
                    <Ionicons name="lock-closed" size={16} color={COLORS.textMuted} />
                  )}
                  {isSelected && !isLocked && (
                    <Ionicons name="radio-button-on" size={20} color={COLORS.primary} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Common mistakes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Errores Comunes</Text>
          {technique.commonMistakes.map((mistake, index) => (
            <View key={index} style={styles.mistakeRow}>
              <Ionicons name="warning" size={16} color={COLORS.warning} />
              <Text style={styles.mistakeText}>{mistake}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Practice CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.practiceButton} onPress={handleStartPractice}>
          <Ionicons name="play" size={20} color={COLORS.text} />
          <Text style={styles.practiceButtonText}>
            Practicar Nivel {selectedLevel}: {technique.levels[selectedLevel - 1]?.name}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  heroIcon: {
    width: 100,
    height: 100,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  techniqueName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  handBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  handText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  progressSection: {
    width: '100%',
    marginTop: SPACING.lg,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.surfaceLight,
  },
  levelDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceLight,
  },
  section: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  levelCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  levelCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  levelCardCompleted: {
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  levelCardLocked: {
    opacity: 0.5,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  levelBadgeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  levelDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  mistakeText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
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
