import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getPhases, getWeeks, getProgress } from '../../src/services/api';
import { useStore } from '../../src/store/useStore';

export default function ProgramScreen() {
  const [phases, setPhases] = useState<any[]>([]);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const { progress } = useStore();

  useEffect(() => {
    loadProgram();
  }, []);

  const loadProgram = async () => {
    try {
      const [phasesData, weeksData] = await Promise.all([
        getPhases(),
        getWeeks(),
      ]);
      setPhases(phasesData.phases);
      setWeeks(weeksData.weeks);
      
      // Expand current phase by default
      const currentPhase = phasesData.phases.find(
        (p: any) => p.weeks_start <= progress.current_week && p.weeks_end >= progress.current_week
      );
      if (currentPhase) {
        setExpandedPhase(currentPhase.id);
      }
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseProgress = (phase: any) => {
    if (progress.current_week > phase.weeks_end) return 100;
    if (progress.current_week < phase.weeks_start) return 0;
    const total = phase.weeks_end - phase.weeks_start + 1;
    const completed = progress.current_week - phase.weeks_start;
    return Math.round((completed / total) * 100);
  };

  const getPhaseIcon = (phaseName: string) => {
    switch (phaseName.toLowerCase()) {
      case 'foundations': return 'school-outline';
      case 'core skills': return 'build-outline';
      case 'advanced control': return 'rocket-outline';
      case 'proficiency': return 'star-outline';
      default: return 'trophy-outline';
    }
  };

  const getPhaseColor = (index: number) => {
    const colors = [COLORS.success, COLORS.info, COLORS.warning, COLORS.primary];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>52-Week Program</Text>
          <Text style={styles.subtitle}>Your journey to guitar mastery</Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.overallProgress}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>
              {Math.round((progress.current_week / 52) * 100)}%
            </Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStatItem}>
              <Text style={styles.progressStatValue}>{progress.current_week}</Text>
              <Text style={styles.progressStatLabel}>Current Week</Text>
            </View>
            <View style={styles.progressStatItem}>
              <Text style={styles.progressStatValue}>{52 - progress.current_week}</Text>
              <Text style={styles.progressStatLabel}>Weeks Left</Text>
            </View>
          </View>
        </View>

        {/* Phases */}
        <View style={styles.phasesSection}>
          {phases.map((phase, index) => {
            const isExpanded = expandedPhase === phase.id;
            const phaseProgress = getPhaseProgress(phase);
            const color = getPhaseColor(index);
            const phaseWeeks = weeks.filter((w: any) => w.phase_id === phase.id);
            const isCurrent = progress.current_week >= phase.weeks_start && 
                            progress.current_week <= phase.weeks_end;

            return (
              <View key={phase.id} style={styles.phaseContainer}>
                <TouchableOpacity
                  style={[
                    styles.phaseHeader,
                    isCurrent && { borderColor: color },
                  ]}
                  onPress={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.phaseIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name={getPhaseIcon(phase.name) as any} size={24} color={color} />
                  </View>
                  
                  <View style={styles.phaseInfo}>
                    <Text style={styles.phaseName}>{phase.name}</Text>
                    <Text style={styles.phaseWeeks}>
                      Weeks {phase.weeks_start}-{phase.weeks_end}
                    </Text>
                    <View style={styles.phaseProgressBar}>
                      <View
                        style={[
                          styles.phaseProgressFill,
                          { width: `${phaseProgress}%`, backgroundColor: color },
                        ]}
                      />
                    </View>
                  </View>

                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.phaseContent}>
                    <Text style={styles.phaseDescription}>{phase.description}</Text>
                    
                    <View style={styles.goalsSection}>
                      <Text style={styles.goalsSectionTitle}>Goals</Text>
                      {phase.goals.map((goal: string, i: number) => (
                        <View key={i} style={styles.goalItem}>
                          <Ionicons name="checkmark-circle" size={16} color={color} />
                          <Text style={styles.goalText}>{goal}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.weeksList}>
                      {phaseWeeks.map((week: any) => {
                        const isCurrentWeek = week.number === progress.current_week;
                        const isCompleted = week.number < progress.current_week;
                        const isLocked = week.number >= 25; // Paywall: weeks 25-52 are locked

                        return (
                          <TouchableOpacity
                            key={week.id}
                            style={[
                              styles.weekItem,
                              isCurrentWeek && styles.weekItemCurrent,
                              isCompleted && styles.weekItemCompleted,
                              isLocked && styles.weekItemLocked,
                            ]}
                            onPress={() => {
                              if (isLocked) {
                                // Show lock message or paywall
                                return;
                              }
                              // Navigate to week detail
                            }}
                            disabled={isLocked}
                          >
                            <View
                              style={[
                                styles.weekIndicator,
                                isCurrentWeek && { backgroundColor: color },
                                isCompleted && { backgroundColor: COLORS.success },
                                isLocked && styles.weekIndicatorLocked,
                              ]}
                            >
                              {isLocked ? (
                                <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
                              ) : isCompleted ? (
                                <Ionicons name="checkmark" size={12} color={COLORS.text} />
                              ) : (
                                <Text style={styles.weekNumber}>{week.number}</Text>
                              )}
                            </View>
                            <Text
                              style={[
                                styles.weekTitle,
                                isCurrentWeek && { color: COLORS.text },
                                isLocked && styles.weekTitleLocked,
                              ]}
                              numberOfLines={1}
                            >
                              {week.title}
                            </Text>
                            {isLocked && (
                              <View style={styles.proBadge}>
                                <Text style={styles.proBadgeText}>PRO</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  progressPercent: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  progressLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  progressStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: SPACING.lg,
  },
  progressStatItem: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  progressStatLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  phasesSection: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  phaseContainer: {
    marginBottom: SPACING.md,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  phaseIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  phaseWeeks: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  phaseProgressBar: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  phaseProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  phaseContent: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: 2,
  },
  phaseDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  goalsSection: {
    marginBottom: SPACING.lg,
  },
  goalsSectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  goalText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  weeksList: {
    gap: SPACING.xs,
  },
  weekItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  weekItemCurrent: {
    backgroundColor: COLORS.primary + '15',
  },
  weekItemCompleted: {
    opacity: 0.6,
  },
  weekIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  weekNumber: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  weekTitle: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
});
