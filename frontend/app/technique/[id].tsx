/**
 * GUITAR GUIDE PRO - TECHNIQUE DETAIL & MASTER CLASS
 * Individual technique learning path with 4 levels
 * All levels are freely accessible (no gating)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getTechniqueById, TechniqueDefinition } from '../../src/data/techniques';
import { getTechniqueIcon } from '../../src/components/TechniqueIcons';
import { getTechniqueMasteryById, addPracticeTime, TechniqueMastery } from '../../src/utils/techniqueStorage';
import { isTechniqueComplete, getMasterySongByTechnique } from '../../src/data/techniqueMasterySongs';

const { width } = Dimensions.get('window');

export default function TechniqueDetailScreen() {
  const { id, level: levelParam } = useLocalSearchParams<{ id: string; level?: string }>();
  const [technique, setTechnique] = useState<TechniqueDefinition | null>(null);
  const [mastery, setMastery] = useState<TechniqueMastery | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(parseInt(levelParam || '1'));
  const [recommendedPath, setRecommendedPath] = useState(false); // OFF by default - free mode

  useEffect(() => {
    if (id) {
      const tech = getTechniqueById(id);
      setTechnique(tech || null);
      loadMastery();
    }
  }, [id]);

  // Update selected level when URL param changes
  useEffect(() => {
    if (levelParam) {
      const level = parseInt(levelParam);
      if (level >= 1 && level <= 4) {
        setSelectedLevel(level);
      }
    }
  }, [levelParam]);

  const loadMastery = async () => {
    if (id) {
      const data = await getTechniqueMasteryById(id);
      setMastery(data);
    }
  };

  // Handle level selection with immediate navigation (URL update)
  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level);
    // Update URL to reflect selected level
    router.setParams({ level: String(level) });
  };

  const handleStartPractice = async () => {
    if (!technique) return;
    
    // Navigate to dedicated technique practice screen with selected level
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Niveles de Maestría</Text>
            <View style={styles.pathToggle}>
              <Text style={styles.pathToggleLabel}>Ruta Recomendada</Text>
              <Switch
                value={recommendedPath}
                onValueChange={setRecommendedPath}
                trackColor={{ false: COLORS.surfaceLight, true: COLORS.primary + '60' }}
                thumbColor={recommendedPath ? COLORS.primary : COLORS.textMuted}
              />
            </View>
          </View>
          
          {/* Level selection chips */}
          <View style={styles.levelChips}>
            {technique.levels.map((level) => {
              const isCompleted = level.level <= currentLevel;
              const isSelected = level.level === selectedLevel;
              // Only lock if "Recommended Path" is ON
              const isLocked = recommendedPath && level.level > currentLevel + 1;
              
              return (
                <TouchableOpacity
                  key={level.level}
                  style={[
                    styles.levelChip,
                    isSelected && styles.levelChipSelected,
                    isCompleted && styles.levelChipCompleted,
                    isLocked && styles.levelChipLocked,
                  ]}
                  onPress={() => !isLocked && handleLevelSelect(level.level)}
                  disabled={isLocked}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                  )}
                  {isLocked && (
                    <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
                  )}
                  <Text style={[
                    styles.levelChipText,
                    isSelected && styles.levelChipTextSelected,
                    isLocked && styles.levelChipTextLocked,
                  ]}>
                    {level.level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Selected level details */}
          {technique.levels.map((level) => {
            if (level.level !== selectedLevel) return null;
            const isCompleted = level.level <= currentLevel;
            
            return (
              <View key={`detail-${level.level}`} style={styles.levelDetailCard}>
                <View style={styles.levelDetailHeader}>
                  <View style={styles.levelDetailTitle}>
                    <Text style={styles.levelName}>{level.name}</Text>
                    {isCompleted && (
                      <View style={styles.completedBadge}>
                        <Ionicons name="checkmark" size={12} color={COLORS.text} />
                        <Text style={styles.completedBadgeText}>Completado</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </View>
                
                {/* Quick info */}
                <View style={styles.levelQuickInfo}>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="speedometer" size={16} color={COLORS.primary} />
                    <Text style={styles.quickInfoText}>60-90 BPM</Text>
                  </View>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="time" size={16} color={COLORS.primary} />
                    <Text style={styles.quickInfoText}>2 ejercicios</Text>
                  </View>
                </View>
              </View>
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

        {/* Final Song Section - Only if technique has a song */}
        {isTechniqueComplete(technique.id) && (
          <View style={styles.section}>
            <View style={styles.songSectionHeader}>
              <View style={styles.songTitleRow}>
                <Ionicons name="musical-notes" size={24} color={technique.color} />
                <View>
                  <Text style={styles.sectionTitle}>🎸 Canción Final</Text>
                  <Text style={styles.songSubtitle}>Cierra la técnica tocando música real</Text>
                </View>
              </View>
            </View>
            
            {(() => {
              const song = getMasterySongByTechnique(technique.id);
              if (!song) return null;
              
              return (
                <TouchableOpacity 
                  style={[styles.songCard, { borderColor: technique.color }]}
                  onPress={() => router.push({
                    pathname: '/technique-song/[id]',
                    params: { id: technique.id }
                  } as any)}
                  activeOpacity={0.8}
                >
                  <View style={styles.songCardContent}>
                    <View style={[styles.songIconCircle, { backgroundColor: technique.color + '20' }]}>
                      <Ionicons name="play" size={28} color={technique.color} />
                    </View>
                    <View style={styles.songInfo}>
                      <Text style={styles.songTitle}>{song.title}</Text>
                      <Text style={styles.songMeta}>
                        {song.style} • {song.tempo} BPM • {song.totalMeasures} compases
                      </Text>
                      <View style={styles.songSections}>
                        {song.sections.map(s => (
                          <View key={s.id} style={[styles.sectionBadge, { backgroundColor: technique.color + '30' }]}>
                            <Text style={[styles.sectionBadgeText, { color: technique.color }]}>{s.id}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
                  </View>
                  
                  <View style={styles.songFooter}>
                    <Ionicons name="trophy-outline" size={14} color={COLORS.success} />
                    <Text style={styles.songFooterText}>
                      Completa esta canción para dominar la técnica
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })()}
          </View>
        )}

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
  // New styles for level chips
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  pathToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  pathToggleLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  levelChips: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  levelChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelChipSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  levelChipCompleted: {
    borderColor: COLORS.success + '40',
  },
  levelChipLocked: {
    opacity: 0.5,
    backgroundColor: COLORS.surfaceLight,
  },
  levelChipText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  levelChipTextSelected: {
    color: COLORS.primary,
  },
  levelChipTextLocked: {
    color: COLORS.textMuted,
  },
  levelDetailCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  levelDetailHeader: {
    marginBottom: SPACING.md,
  },
  levelDetailTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  completedBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  levelQuickInfo: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  quickInfoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
});
