import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getTodayWorkout, getProgress } from '../../src/services/api';
import { RoutineBlockCard } from '../../src/components/RoutineBlock';
import { useStore } from '../../src/store/useStore';

export default function TodayScreen() {
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { progress, setProgress } = useStore();

  const loadData = async () => {
    try {
      // Load progress first
      const progressData = await getProgress();
      setProgress(progressData);
      
      // Then load today's workout
      const todayData = await getTodayWorkout(
        progressData.current_week || 1,
        progressData.current_day || 1
      );
      setWorkout(todayData);
    } catch (error) {
      console.error('Error loading today workout:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleBlockPress = (block: any, index: number) => {
    if (block.exercises && block.exercises.length > 0) {
      router.push({
        pathname: '/practice',
        params: { exerciseId: block.exercises[0].id },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your workout...</Text>
      </View>
    );
  }

  const totalMinutes = workout?.total_duration_minutes || 30;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Today's Workout</Text>
              <Text style={styles.subtitle}>
                Week {progress.current_week} • Day {progress.current_day}
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={18} color={COLORS.warning} />
              <Text style={styles.streakText}>{progress.streak_days} day streak</Text>
            </View>
          </View>
        </View>

        {/* Phase Card */}
        <View style={styles.phaseCard}>
          <View style={styles.phaseHeader}>
            <Text style={styles.phaseName}>{workout?.phase?.name || 'Foundations'}</Text>
            <Text style={styles.weekTitle}>{workout?.week_title}</Text>
          </View>
          <View style={styles.phaseStats}>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{totalMinutes}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="list-outline" size={20} color={COLORS.secondary} />
              <Text style={styles.statValue}>{workout?.day?.routine_blocks?.length || 4}</Text>
              <Text style={styles.statLabel}>blocks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={20} color={COLORS.info} />
              <Text style={styles.statValue}>
                {workout?.day?.routine_blocks?.reduce(
                  (acc: number, b: any) => acc + (b.exercises?.length || 0),
                  0
                ) || 0}
              </Text>
              <Text style={styles.statLabel}>exercises</Text>
            </View>
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            const firstBlock = workout?.day?.routine_blocks?.[0];
            if (firstBlock?.exercises?.[0]) {
              router.push({
                pathname: '/practice',
                params: { exerciseId: firstBlock.exercises[0].id },
              });
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={24} color={COLORS.text} />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>

        {/* Explore Mode Button */}
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/explore')}
          activeOpacity={0.8}
        >
          <Ionicons name="musical-notes" size={22} color={COLORS.secondary} />
          <View style={styles.exploreTextContainer}>
            <Text style={styles.exploreButtonTitle}>Explore Mode</Text>
            <Text style={styles.exploreButtonSubtitle}>Improvise freely over backing tracks</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* Routine Blocks */}
        <View style={styles.blocksSection}>
          <Text style={styles.sectionTitle}>Today's Routine</Text>
          {workout?.day?.routine_blocks?.map((block: any, index: number) => (
            <RoutineBlockCard
              key={block.id}
              block={block}
              index={index}
              onPress={() => handleBlockPress(block, index)}
              isActive={index === 0}
            />
          ))}
        </View>

        {/* Focus Summary */}
        {workout?.day?.focus_summary && (
          <View style={styles.focusCard}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
            <Text style={styles.focusText}>{workout.day.focus_summary}</Text>
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
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  streakText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.warning,
  },
  phaseCard: {
    margin: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  phaseHeader: {
    marginBottom: SPACING.lg,
  },
  phaseName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  weekTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  phaseStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.surfaceLight,
  },
  startButton: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  startButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  exploreButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.secondary + '40',
  },
  exploreTextContainer: {
    flex: 1,
  },
  exploreButtonTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  exploreButtonSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  blocksSection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  focusCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  focusText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.warning,
    fontWeight: '500',
  },
});
