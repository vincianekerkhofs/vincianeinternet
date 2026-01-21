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
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getProgress, getStats, resetProgress } from '../../src/services/api';
import { useStore } from '../../src/store/useStore';

export default function ProgressScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { progress, setProgress } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [progressData, statsData] = await Promise.all([
        getProgress(),
        getStats(),
      ]);
      setProgress(progressData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    try {
      const newProgress = await resetProgress();
      setProgress(newProgress);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const totalHours = Math.floor(progress.total_practice_minutes / 60);
  const remainingMinutes = progress.total_practice_minutes % 60;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your guitar journey</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={32} color={COLORS.warning} />
            <Text style={styles.statValue}>{progress.streak_days}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={32} color={COLORS.info} />
            <Text style={styles.statValue}>
              {totalHours}h {remainingMinutes}m
            </Text>
            <Text style={styles.statLabel}>Total Practice</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-done" size={32} color={COLORS.success} />
            <Text style={styles.statValue}>{progress.completed_exercises?.length || 0}</Text>
            <Text style={styles.statLabel}>Exercises Done</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={32} color={COLORS.primary} />
            <Text style={styles.statValue}>{progress.completed_workouts?.length || 0}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
        </View>

        {/* Current Position */}
        <View style={styles.positionCard}>
          <Text style={styles.sectionTitle}>Current Position</Text>
          <View style={styles.positionInfo}>
            <View style={styles.positionItem}>
              <Text style={styles.positionValue}>Week {progress.current_week}</Text>
              <Text style={styles.positionLabel}>of 52 weeks</Text>
            </View>
            <View style={styles.positionDivider} />
            <View style={styles.positionItem}>
              <Text style={styles.positionValue}>Day {progress.current_day}</Text>
              <Text style={styles.positionLabel}>of 6 days</Text>
            </View>
          </View>
          <View style={styles.yearProgressBar}>
            <View
              style={[
                styles.yearProgressFill,
                { width: `${(progress.current_week / 52) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.yearProgressText}>
            {Math.round((progress.current_week / 52) * 100)}% of the year complete
          </Text>
        </View>

        {/* Domain Progress */}
        {stats && (
          <View style={styles.domainsCard}>
            <Text style={styles.sectionTitle}>Library Overview</Text>
            <Text style={styles.librarySubtitle}>
              {stats.total_exercises} total exercises across {Object.keys(stats.domains).length} skill domains
            </Text>
            <View style={styles.domainsList}>
              {Object.entries(stats.domains).map(([domain, count]: [string, any]) => (
                <View key={domain} style={styles.domainItem}>
                  <View style={styles.domainInfo}>
                    <Text style={styles.domainName} numberOfLines={1}>{domain}</Text>
                    <Text style={styles.domainCount}>{count}</Text>
                  </View>
                  <View style={styles.domainBar}>
                    <View
                      style={[
                        styles.domainBarFill,
                        { width: `${(count / Math.max(...Object.values(stats.domains).map(Number))) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Difficulty Breakdown */}
        {stats && (
          <View style={styles.difficultyCard}>
            <Text style={styles.sectionTitle}>By Difficulty</Text>
            <View style={styles.difficultyGrid}>
              {Object.entries(stats.difficulties).map(([diff, count]: [string, any]) => (
                <View key={diff} style={styles.difficultyItem}>
                  <Text style={styles.difficultyCount}>{count}</Text>
                  <Text style={styles.difficultyName}>{diff}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetProgress}
          >
            <Ionicons name="refresh" size={20} color={COLORS.error} />
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  positionCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  positionItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  positionValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  positionLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  positionDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.surfaceLight,
  },
  yearProgressBar: {
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  yearProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  yearProgressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  domainsCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  librarySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    marginTop: -SPACING.sm,
  },
  domainsList: {
    gap: SPACING.md,
  },
  domainItem: {},
  domainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  domainName: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  domainCount: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  domainBar: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  domainBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  difficultyCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  difficultyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  difficultyItem: {
    alignItems: 'center',
  },
  difficultyCount: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  difficultyName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  actionsSection: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  resetButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    fontWeight: '500',
  },
});
