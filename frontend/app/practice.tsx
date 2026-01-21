import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, getDifficultyColor, getDomainColor } from '../src/constants/theme';
import { getExercise } from '../src/services/api';
import { Fretboard } from '../src/components/Fretboard';
import { TabDisplay } from '../src/components/TabDisplay';
import { useStore } from '../src/store/useStore';

const { width } = Dimensions.get('window');

export default function PracticeScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const { bpm, setBpm } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (exerciseId) {
      loadExercise();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [exerciseId]);

  const loadExercise = async () => {
    try {
      const data = await getExercise(exerciseId as string);
      setExercise(data);
      setBpm(data.bpm_start || 80);
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const beatInterval = (60 / bpm) * 1000;
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => (prev % 8) + 1);
      }, beatInterval);
    }
  }, [isPlaying, bpm]);

  const adjustBpm = (delta: number) => {
    const newBpm = Math.max(40, Math.min(200, bpm + delta));
    setBpm(newBpm);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>Exercise not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const difficultyColor = getDifficultyColor(exercise.difficulty_tier);
  const domainColor = getDomainColor(exercise.domain);

  // Generate sample active notes for fretboard
  const activeNotes = exercise.tab_data?.notes?.slice(0, 3).map((note: any, i: number) => ({
    string: note.string,
    fret: typeof note.fret === 'number' ? note.fret : 0,
    finger: i + 1,
  })) || [
    { string: 0, fret: 5, finger: 1 },
    { string: 1, fret: 5, finger: 1 },
    { string: 2, fret: 5, finger: 1 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{exercise.title}</Text>
          <View style={styles.headerBadges}>
            <View style={[styles.badge, { backgroundColor: domainColor + '30' }]}>
              <Text style={[styles.badgeText, { color: domainColor }]}>
                {exercise.domain.split(' ')[0]}
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: difficultyColor, borderWidth: 1, backgroundColor: 'transparent' }]}>
              <Text style={[styles.badgeText, { color: difficultyColor }]}>
                {exercise.difficulty_tier}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.infoButton}>
          <Ionicons name={showInfo ? 'information-circle' : 'information-circle-outline'} size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Info Panel */}
        {showInfo && (
          <View style={styles.infoPanel}>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>What you train</Text>
              <Text style={styles.infoText}>{exercise.description_training}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Why it matters</Text>
              <Text style={styles.infoText}>{exercise.description_why}</Text>
            </View>
            {exercise.steps && exercise.steps.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Steps</Text>
                {exercise.steps.map((step: string, i: number) => (
                  <View key={i} style={styles.stepItem}>
                    <Text style={styles.stepNumber}>{i + 1}</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
            {exercise.mistakes_and_fixes && exercise.mistakes_and_fixes.length > 0 && (
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Common Mistakes</Text>
                {exercise.mistakes_and_fixes.map((fix: string, i: number) => (
                  <View key={i} style={styles.mistakeItem}>
                    <Ionicons name="warning" size={14} color={COLORS.warning} />
                    <Text style={styles.mistakeText}>{fix}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Fretboard Visualization */}
        <View style={styles.fretboardSection}>
          <Text style={styles.sectionLabel}>Fretboard</Text>
          <Fretboard
            activeNotes={activeNotes}
            width={width - SPACING.lg * 2}
            height={180}
            startFret={3}
            numFrets={5}
          />
        </View>

        {/* Tab Display */}
        <View style={styles.tabSection}>
          <Text style={styles.sectionLabel}>Tablature</Text>
          <TabDisplay
            notes={exercise.tab_data?.notes || []}
            currentBeat={currentBeat}
            timeSignature={exercise.tab_data?.time_signature || '4/4'}
          />
        </View>

        {/* BPM Control */}
        <View style={styles.bpmSection}>
          <Text style={styles.sectionLabel}>Tempo</Text>
          <View style={styles.bpmControl}>
            <TouchableOpacity
              style={styles.bpmButton}
              onPress={() => adjustBpm(-5)}
            >
              <Ionicons name="remove" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.bpmDisplay}>
              <Text style={styles.bpmValue}>{bpm}</Text>
              <Text style={styles.bpmLabel}>BPM</Text>
            </View>
            <TouchableOpacity
              style={styles.bpmButton}
              onPress={() => adjustBpm(5)}
            >
              <Ionicons name="add" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.bpmRange}>
            <Text style={styles.bpmRangeText}>
              Target: {exercise.bpm_start} - {exercise.bpm_target} BPM
            </Text>
          </View>
        </View>

        {/* Success Criteria */}
        {exercise.success_criteria && Object.keys(exercise.success_criteria).length > 0 && (
          <View style={styles.criteriaSection}>
            <Text style={styles.sectionLabel}>Success Criteria</Text>
            <View style={styles.criteriaGrid}>
              {Object.entries(exercise.success_criteria).map(([key, value]: [string, any]) => (
                <View key={key} style={styles.criteriaItem}>
                  <Text style={styles.criteriaValue}>{value}%</Text>
                  <Text style={styles.criteriaLabel}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Play Controls */}
      <View style={styles.playControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="repeat" size={24} color={COLORS.textSecondary} />
          <Text style={styles.controlLabel}>Loop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlay}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={36}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="metronome-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.controlLabel}>Metronome</Text>
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  backButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
  },
  backButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  infoButton: {
    padding: SPACING.sm,
  },
  scrollView: {
    flex: 1,
  },
  infoPanel: {
    margin: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  infoSection: {
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  stepText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  mistakeText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
  },
  fretboardSection: {
    padding: SPACING.lg,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  tabSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bpmSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  bpmControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  bpmButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmDisplay: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  bpmValue: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bpmLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  bpmRange: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  bpmRangeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  criteriaSection: {
    paddingHorizontal: SPACING.lg,
  },
  criteriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  criteriaItem: {
    alignItems: 'center',
    minWidth: '30%',
  },
  criteriaValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.success,
  },
  criteriaLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  playControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  controlButton: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  controlLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
