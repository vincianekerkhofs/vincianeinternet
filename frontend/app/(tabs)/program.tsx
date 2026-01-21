import React, { useEffect, useState, useCallback } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { CURRICULUM, isWeekLocked } from '../../src/data/curriculum';
import { getCompletedExercises } from '../../src/utils/completionStorage';

export default function ProgramScreen() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompletions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCompletions();
    }, [])
  );

  const loadCompletions = async () => {
    const completed = await getCompletedExercises();
    setCompletedLessons(completed);
    setLoading(false);
  };

  // Find the next incomplete lesson
  const findNextLesson = (): { week: number; day: number } => {
    for (const weekData of CURRICULUM) {
      if (isWeekLocked(weekData.week)) continue;
      
      for (const dayData of weekData.days) {
        const lessonId = `week${weekData.week}-day${dayData.day}`;
        if (!completedLessons.includes(lessonId)) {
          return { week: weekData.week, day: dayData.day };
        }
      }
    }
    // If all complete, return week 1 day 1
    return { week: 1, day: 1 };
  };

  // Calculate week progress
  const getWeekProgress = (weekNum: number): number => {
    const completedInWeek = completedLessons.filter(id => id.startsWith(`week${weekNum}-`)).length;
    return Math.round((completedInWeek / 7) * 100);
  };

  const isDayComplete = (week: number, day: number): boolean => {
    return completedLessons.includes(`week${week}-day${day}`);
  };

  const handleContinue = () => {
    const next = findNextLesson();
    router.push({
      pathname: '/practice',
      params: { week: String(next.week), day: String(next.day) }
    });
  };

  const openDay = (week: number, day: number) => {
    if (isWeekLocked(week)) return;
    router.push({
      pathname: '/practice',
      params: { week: String(week), day: String(day) }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const nextLesson = findNextLesson();
  const currentWeekData = CURRICULUM.find(w => w.week === nextLesson.week);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Programa</Text>
        <Text style={styles.subtitle}>24 semanas de guitarra</Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <View style={styles.continueContent}>
          <View style={styles.continueInfo}>
            <Text style={styles.continueLabel}>HOY</Text>
            <Text style={styles.continueTitle}>
              Semana {nextLesson.week} · Día {nextLesson.day}
            </Text>
            {currentWeekData && (
              <Text style={styles.continueTheme}>{currentWeekData.theme}</Text>
            )}
          </View>
          <View style={styles.continueArrow}>
            <Ionicons name="play-circle" size={48} color={COLORS.text} />
          </View>
        </View>
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Weeks List */}
        {CURRICULUM.map((weekData) => {
          const locked = isWeekLocked(weekData.week);
          const isExpanded = expandedWeek === weekData.week;
          const progress = getWeekProgress(weekData.week);
          const isCurrentWeek = weekData.week === nextLesson.week;

          return (
            <View key={weekData.week} style={styles.weekContainer}>
              <TouchableOpacity
                style={[
                  styles.weekHeader,
                  isCurrentWeek && styles.weekHeaderCurrent,
                  locked && styles.weekHeaderLocked,
                ]}
                onPress={() => {
                  if (locked) return;
                  setExpandedWeek(isExpanded ? null : weekData.week);
                }}
                disabled={locked}
              >
                <View style={styles.weekLeft}>
                  <View style={[
                    styles.weekNumber,
                    isCurrentWeek && styles.weekNumberCurrent,
                    locked && styles.weekNumberLocked,
                  ]}>
                    {locked ? (
                      <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />
                    ) : (
                      <Text style={[
                        styles.weekNumberText,
                        isCurrentWeek && styles.weekNumberTextCurrent,
                      ]}>
                        {weekData.week}
                      </Text>
                    )}
                  </View>
                  <View style={styles.weekInfo}>
                    <Text style={[
                      styles.weekTitle,
                      locked && styles.weekTitleLocked,
                    ]}>
                      {weekData.theme}
                    </Text>
                    <View style={styles.weekMeta}>
                      {weekData.styleFocus.slice(0, 2).map((style, i) => (
                        <Text key={i} style={styles.weekStyle}>{style}</Text>
                      ))}
                    </View>
                  </View>
                </View>
                
                <View style={styles.weekRight}>
                  {locked ? (
                    <View style={styles.proBadge}>
                      <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={[
                        styles.progressText,
                        progress === 100 && styles.progressTextComplete,
                      ]}>
                        {progress}%
                      </Text>
                      <Ionicons 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={20} 
                        color={COLORS.textMuted} 
                      />
                    </>
                  )}
                </View>
              </TouchableOpacity>

              {/* Days List */}
              {isExpanded && !locked && (
                <View style={styles.daysContainer}>
                  {weekData.days.map((dayData) => {
                    const dayComplete = isDayComplete(weekData.week, dayData.day);
                    const isToday = weekData.week === nextLesson.week && dayData.day === nextLesson.day;

                    return (
                      <TouchableOpacity
                        key={dayData.day}
                        style={[
                          styles.dayItem,
                          isToday && styles.dayItemCurrent,
                          dayComplete && styles.dayItemComplete,
                        ]}
                        onPress={() => openDay(weekData.week, dayData.day)}
                      >
                        <View style={[
                          styles.dayIndicator,
                          isToday && styles.dayIndicatorCurrent,
                          dayComplete && styles.dayIndicatorComplete,
                        ]}>
                          {dayComplete ? (
                            <Ionicons name="checkmark" size={14} color={COLORS.text} />
                          ) : (
                            <Text style={[
                              styles.dayNumber,
                              isToday && styles.dayNumberCurrent,
                            ]}>
                              {dayData.day}
                            </Text>
                          )}
                        </View>
                        <View style={styles.dayInfo}>
                          <Text style={styles.dayTitle}>{dayData.title}</Text>
                          <Text style={styles.dayObjective} numberOfLines={1}>
                            {dayData.objective}
                          </Text>
                        </View>
                        {isToday && (
                          <View style={styles.todayBadge}>
                            <Text style={styles.todayBadgeText}>HOY</Text>
                          </View>
                        )}
                        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 100 }} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  continueButton: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  continueInfo: {
    flex: 1,
  },
  continueLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    color: COLORS.text,
    opacity: 0.8,
    letterSpacing: 1,
  },
  continueTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  continueTheme: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    opacity: 0.8,
    marginTop: 4,
  },
  continueArrow: {
    marginLeft: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  weekContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  weekHeaderCurrent: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  weekHeaderLocked: {
    opacity: 0.6,
  },
  weekLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  weekNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  weekNumberCurrent: {
    backgroundColor: COLORS.primary,
  },
  weekNumberLocked: {
    backgroundColor: COLORS.surfaceLight,
  },
  weekNumberText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  weekNumberTextCurrent: {
    color: COLORS.text,
  },
  weekInfo: {
    flex: 1,
  },
  weekTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  weekTitleLocked: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  weekMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: 2,
  },
  weekStyle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  weekRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  progressTextComplete: {
    color: COLORS.success,
  },
  proBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.background,
  },
  daysContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  dayItemCurrent: {
    backgroundColor: COLORS.primary + '15',
  },
  dayItemComplete: {
    opacity: 0.7,
  },
  dayIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  dayIndicatorCurrent: {
    backgroundColor: COLORS.primary,
  },
  dayIndicatorComplete: {
    backgroundColor: COLORS.success,
  },
  dayNumber: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  dayNumberCurrent: {
    color: COLORS.text,
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayObjective: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  todayBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.text,
  },
});
