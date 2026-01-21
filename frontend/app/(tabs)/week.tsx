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
import { getWeek, getProgress } from '../../src/services/api';
import { useStore } from '../../src/store/useStore';

export default function WeekScreen() {
  const [weekData, setWeekData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { progress } = useStore();

  useEffect(() => {
    loadWeek();
  }, [progress.current_week]);

  const loadWeek = async () => {
    try {
      const data = await getWeek(progress.current_week || 1);
      setWeekData(data);
    } catch (error) {
      console.error('Error loading week:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayStatus = (dayNum: number) => {
    if (dayNum < progress.current_day) return 'completed';
    if (dayNum === progress.current_day) return 'current';
    return 'upcoming';
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
          <Text style={styles.title}>This Week</Text>
          <Text style={styles.subtitle}>{weekData?.title}</Text>
        </View>

        {/* Week Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Week Progress</Text>
            <Text style={styles.progressValue}>
              {progress.current_day - 1}/5 days
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((progress.current_day - 1) / 5) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Focus Domains */}
        {weekData?.focus_domains && (
          <View style={styles.domainsCard}>
            <Text style={styles.sectionTitle}>Focus Areas</Text>
            <View style={styles.domainsList}>
              {weekData.focus_domains.map((domain: string, i: number) => (
                <View key={i} style={styles.domainBadge}>
                  <Ionicons name="musical-notes" size={14} color={COLORS.primary} />
                  <Text style={styles.domainText}>{domain}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Days List */}
        <View style={styles.daysSection}>
          <Text style={styles.sectionTitle}>Daily Workouts</Text>
          {weekData?.days?.map((day: any, index: number) => {
            const dayNum = index + 1;
            const status = getDayStatus(dayNum);
            const totalMinutes = Math.ceil(day.total_duration_seconds / 60);
            const exerciseCount = day.routine_blocks?.reduce(
              (acc: number, b: any) => acc + (b.exercise_ids?.length || 0),
              0
            );

            return (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayCard,
                  status === 'current' && styles.dayCardCurrent,
                  status === 'completed' && styles.dayCardCompleted,
                ]}
                onPress={() => {
                  if (status !== 'upcoming') {
                    router.push({
                      pathname: '/(tabs)',
                    });
                  }
                }}
                activeOpacity={status === 'upcoming' ? 1 : 0.7}
              >
                <View style={styles.dayLeft}>
                  <View
                    style={[
                      styles.dayNumber,
                      status === 'current' && styles.dayNumberCurrent,
                      status === 'completed' && styles.dayNumberCompleted,
                    ]}
                  >
                    {status === 'completed' ? (
                      <Ionicons name="checkmark" size={18} color={COLORS.text} />
                    ) : (
                      <Text
                        style={[
                          styles.dayNumberText,
                          status === 'current' && styles.dayNumberTextCurrent,
                        ]}
                      >
                        {dayNum}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.dayContent}>
                  <Text
                    style={[
                      styles.dayTitle,
                      status === 'upcoming' && styles.dayTitleUpcoming,
                    ]}
                  >
                    {day.is_rest_day ? 'Rest & Review' : `Day ${dayNum}`}
                  </Text>
                  <Text style={styles.dayMeta}>
                    {totalMinutes} min • {exerciseCount} exercises
                  </Text>
                  {day.focus_summary && (
                    <Text style={styles.dayFocus} numberOfLines={1}>
                      {day.focus_summary}
                    </Text>
                  )}
                </View>

                {status === 'current' && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Today</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Week Description */}
        {weekData?.description && (
          <View style={styles.descriptionCard}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.info} />
            <Text style={styles.descriptionText}>{weekData.description}</Text>
          </View>
        )}

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
  progressCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  progressValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  domainsCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  domainsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  domainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  domainText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  daysSection: {
    padding: SPACING.lg,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  dayCardCurrent: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  dayCardCompleted: {
    opacity: 0.7,
  },
  dayLeft: {
    marginRight: SPACING.md,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberCurrent: {
    backgroundColor: COLORS.primary,
  },
  dayNumberCompleted: {
    backgroundColor: COLORS.success,
  },
  dayNumberText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  dayNumberTextCurrent: {
    color: COLORS.text,
  },
  dayContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  dayTitleUpcoming: {
    color: COLORS.textMuted,
  },
  dayMeta: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dayFocus: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  currentBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  currentBadgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  descriptionCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.info + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  descriptionText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.info,
    lineHeight: 20,
  },
});
