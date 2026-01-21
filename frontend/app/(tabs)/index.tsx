import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { CURRICULUM, isWeekLocked } from '../../src/data/curriculum';
import { getCompletedExercises, getCompletionStats } from '../../src/utils/completionStorage';

export default function HomeScreen() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [stats, setStats] = useState({ totalCompleted: 0, percentComplete: 0 });

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const completed = await getCompletedExercises();
    const s = await getCompletionStats();
    setCompletedLessons(completed);
    setStats(s);
  };

  // Find next incomplete lesson
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
    return { week: 1, day: 1 };
  };

  const nextLesson = findNextLesson();
  const currentWeekData = CURRICULUM.find(w => w.week === nextLesson.week);
  const currentDayData = currentWeekData?.days.find(d => d.day === nextLesson.day);

  const handleContinue = () => {
    router.push({
      pathname: '/practice',
      params: { week: String(nextLesson.week), day: String(nextLesson.day) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Guitar Gym</Text>
          <Text style={styles.subtitle}>Tu progreso</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>{stats.percentComplete}%</Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Semanas 1–24</Text>
            <Text style={styles.progressSubtitle}>
              {stats.totalCompleted} de 168 días completados
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${stats.percentComplete}%` }]} />
            </View>
          </View>
        </View>

        {/* Today's Lesson - Main CTA */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>HOY</Text>
          
          <TouchableOpacity style={styles.todayCard} onPress={handleContinue}>
            <View style={styles.todayHeader}>
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>CONTINUAR</Text>
              </View>
            </View>
            
            <Text style={styles.todayWeek}>Semana {nextLesson.week} · Día {nextLesson.day}</Text>
            <Text style={styles.todayTitle}>{currentDayData?.title}</Text>
            <Text style={styles.todayObjective}>{currentDayData?.objective}</Text>
            
            {currentWeekData && (
              <View style={styles.todayMeta}>
                <Ionicons name="musical-notes" size={14} color={COLORS.primary} />
                <Text style={styles.todayMetaText}>{currentWeekData.theme}</Text>
              </View>
            )}
            
            <View style={styles.todayButton}>
              <Ionicons name="play" size={20} color={COLORS.text} />
              <Text style={styles.todayButtonText}>Empezar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => router.push('/(tabs)/program')}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Ionicons name="calendar" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickLinkTitle}>Programa</Text>
            <Text style={styles.quickLinkSubtitle}>24 semanas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => router.push('/solos')}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <Ionicons name="rocket" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.quickLinkTitle}>Solos</Text>
            <Text style={styles.quickLinkSubtitle}>Composición</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Quick Links */}
        <View style={styles.quickLinks}>
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => router.push('/(tabs)/exercises')}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: COLORS.warning + '20' }]}>
              <Ionicons name="library" size={24} color={COLORS.warning} />
            </View>
            <Text style={styles.quickLinkTitle}>Biblioteca</Text>
            <Text style={styles.quickLinkSubtitle}>Ejercicios</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickLink}
            onPress={() => router.push('/tuner')}
          >
            <View style={[styles.quickLinkIcon, { backgroundColor: COLORS.success + '20' }]}>
              <Ionicons name="radio" size={24} color={COLORS.success} />
            </View>
            <Text style={styles.quickLinkTitle}>Afinador</Text>
            <Text style={styles.quickLinkSubtitle}>Afina tu guitarra</Text>
          </TouchableOpacity>
        </View>

        {/* Tip of the Day */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
          <Text style={styles.tipText}>
            Practica 15 minutos al día. La consistencia supera a la intensidad.
          </Text>
        </View>

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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  todaySection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  todayCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: SPACING.sm,
  },
  todayBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  todayWeek: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    opacity: 0.8,
  },
  todayTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  todayObjective: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    opacity: 0.9,
    marginTop: SPACING.xs,
  },
  todayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  todayMetaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    opacity: 0.8,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  todayButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  quickLinks: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  quickLink: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  quickLinkIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickLinkTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  quickLinkSubtitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontStyle: 'italic',
  },
});
