/**
 * GUITAR GUIDE PRO - EXERCISE DETAIL SCREEN
 * Shows detailed view of an individual exercise from the library
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getExerciseById } from '../../src/services/api';
import { isExerciseComplete, markExerciseComplete, markExerciseIncomplete } from '../../src/utils/completionStorage';
import { ChordFretboard } from '../../src/components/ChordFretboard';
import { ScaleFretboard } from '../../src/components/ScaleFretboard';
import { CHORD_SHAPES } from '../../src/data/curriculum';

const { width } = Dimensions.get('window');

interface Exercise {
  id: string;
  _id?: string;
  title: string;
  description: string;
  domain: string;
  difficulty_tier: string;
  bpm_start: number;
  bpm_target: number;
  technique_focus?: string;
  goal?: string;
  instructions?: string[];
  common_mistakes?: string[];
  tab_data?: any;
  chord_progression?: string[];
  scale_shape?: string;
}

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Playback state
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadExercise();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [exerciseId]);

  const loadExercise = async () => {
    if (!exerciseId) {
      setError('No exercise ID provided');
      setLoading(false);
      return;
    }

    // Debug log in development
    console.log(`[ExerciseDetail] Loading exercise with ID: "${exerciseId}"`);

    try {
      setLoading(true);
      const data = await getExerciseById(exerciseId);
      console.log(`[ExerciseDetail] Received data:`, data?.title, data?.id);
      if (data) {
        setExercise(data);
        setBpm(data.bpm_start || 80);
        // Check completion status
        const completed = await isExerciseComplete(exerciseId);
        setIsCompleted(completed);
      } else {
        setError(`Exercise not found: ${exerciseId}`);
      }
    } catch (err) {
      console.error('Error loading exercise:', err);
      setError(`Failed to load exercise: ${exerciseId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!exerciseId) return;
    
    if (isCompleted) {
      await markExerciseIncomplete(exerciseId);
      setIsCompleted(false);
    } else {
      await markExerciseComplete(exerciseId);
      setIsCompleted(true);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Stop
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
      setCurrentBeat(1);
    } else {
      // Start metronome
      setIsPlaying(true);
      const interval = 60000 / bpm;
      intervalRef.current = setInterval(() => {
        setCurrentBeat(prev => (prev % 4) + 1);
        Vibration.vibrate(10);
      }, interval);
    }
  };

  const getDomainColor = (domain?: string): string => {
    const colors: Record<string, string> = {
      'Techniques': COLORS.primary,
      'Chords & Harmony': COLORS.success,
      'Timing & Rhythm': COLORS.warning,
      'Picking': '#E07A5F',
      'Strumming & Rhythm Guitar': '#81B29A',
      'Scales & Fretboard': '#3D405B',
      'Lead / Punteos': '#F2CC8F',
      'Musical Application': '#B8C0FF',
      'Fretting Hand': '#9A6DD7',
      'Improvisation': '#FFD166',
    };
    return colors[domain || ''] || COLORS.primary;
  };

  // Render visualization based on exercise type
  const renderVisualization = () => {
    if (!exercise) return null;

    // Check if exercise has chord data
    if (exercise.chord_progression && exercise.chord_progression.length > 0) {
      const chordName = exercise.chord_progression[0];
      const chordShape = CHORD_SHAPES[chordName];
      if (chordShape) {
        return (
          <View style={styles.visualizationContainer}>
            <Text style={styles.sectionTitle}>DIAGRAMA</Text>
            <ChordFretboard
              chord={chordShape}
              size={width - 80}
            />
          </View>
        );
      }
    }

    // Check if exercise has scale data
    if (exercise.scale_shape) {
      return (
        <View style={styles.visualizationContainer}>
          <Text style={styles.sectionTitle}>ESCALA</Text>
          <ScaleFretboard
            scaleType={exercise.scale_shape.includes('blues') ? 'blues' : 'pentatonic'}
            highlightRoot={true}
            showNoteNames={true}
            startFret={0}
            numFrets={5}
          />
        </View>
      );
    }

    // Default: Show technique info
    return (
      <View style={styles.techniqueContainer}>
        <View style={[styles.techniqueIcon, { backgroundColor: getDomainColor(exercise.domain) + '20' }]}>
          <Ionicons 
            name={getDomainIcon(exercise.domain)} 
            size={48} 
            color={getDomainColor(exercise.domain)} 
          />
        </View>
        <Text style={styles.techniqueText}>
          {exercise.technique_focus || exercise.domain}
        </Text>
      </View>
    );
  };

  const getDomainIcon = (domain?: string): string => {
    const icons: Record<string, string> = {
      'Techniques': 'hand-left',
      'Chords & Harmony': 'musical-notes',
      'Timing & Rhythm': 'time',
      'Picking': 'chevron-forward',
      'Strumming & Rhythm Guitar': 'swap-horizontal',
      'Scales & Fretboard': 'grid',
      'Lead / Punteos': 'flash',
      'Musical Application': 'play-circle',
      'Fretting Hand': 'finger-print',
      'Improvisation': 'sparkles',
    };
    return icons[domain || ''] || 'musical-notes';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando ejercicio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error || 'Ejercicio no encontrado'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBackButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>{exercise.title}</Text>
          <View style={[styles.domainBadge, { backgroundColor: getDomainColor(exercise.domain) + '30' }]}>
            <Text style={[styles.domainText, { color: getDomainColor(exercise.domain) }]}>
              {exercise.domain}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleToggleComplete} style={styles.completeButton}>
          <Ionicons 
            name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={28} 
            color={isCompleted ? COLORS.success : COLORS.textMuted} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Difficulty & BPM Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Ionicons name="speedometer-outline" size={16} color={COLORS.warning} />
            <Text style={styles.infoText}>{exercise.difficulty_tier}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="pulse" size={16} color={COLORS.primary} />
            <Text style={styles.infoText}>{exercise.bpm_start} - {exercise.bpm_target} BPM</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DESCRIPCIÓN</Text>
          <Text style={styles.descriptionText}>{exercise.description}</Text>
        </View>

        {/* Goal */}
        {exercise.goal && (
          <View style={styles.goalCard}>
            <Ionicons name="flag" size={18} color={COLORS.success} />
            <Text style={styles.goalText}>{exercise.goal}</Text>
          </View>
        )}

        {/* Visualization */}
        {renderVisualization()}

        {/* Instructions */}
        {exercise.instructions && exercise.instructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INSTRUCCIONES</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Common Mistakes */}
        {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ERRORES COMUNES</Text>
            {exercise.common_mistakes.map((mistake, index) => (
              <View key={index} style={styles.mistakeRow}>
                <Ionicons name="warning" size={16} color={COLORS.warning} />
                <Text style={styles.mistakeText}>{mistake}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Metronome Controls */}
        <View style={styles.metronomeSection}>
          <Text style={styles.sectionTitle}>METRÓNOMO</Text>
          
          {/* BPM Display */}
          <View style={styles.bpmDisplay}>
            <TouchableOpacity 
              style={styles.bpmButton} 
              onPress={() => setBpm(prev => Math.max(40, prev - 5))}
            >
              <Ionicons name="remove" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.bpmCenter}>
              <Text style={styles.bpmValue}>{bpm}</Text>
              <Text style={styles.bpmLabel}>BPM</Text>
            </View>
            <TouchableOpacity 
              style={styles.bpmButton} 
              onPress={() => setBpm(prev => Math.min(200, prev + 5))}
            >
              <Ionicons name="add" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{exercise.bpm_start}</Text>
            <Slider
              style={styles.slider}
              minimumValue={exercise.bpm_start}
              maximumValue={exercise.bpm_target}
              value={bpm}
              onValueChange={(value) => setBpm(Math.round(value))}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.surfaceLight}
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.sliderLabel}>{exercise.bpm_target}</Text>
          </View>

          {/* Beat Indicators */}
          <View style={styles.beatIndicators}>
            {[1, 2, 3, 4].map(beat => (
              <View 
                key={beat}
                style={[
                  styles.beatDot,
                  currentBeat === beat && isPlaying && styles.beatDotActive,
                  currentBeat === beat && beat === 1 && isPlaying && styles.beatDotFirst,
                ]}
              />
            ))}
          </View>

          {/* Play Button */}
          <TouchableOpacity 
            style={[styles.playButton, isPlaying && styles.playButtonActive]}
            onPress={handlePlayPause}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color={COLORS.text} 
            />
          </TouchableOpacity>

          {/* Target BPM hint */}
          <Text style={styles.targetHint}>
            Objetivo: alcanzar {exercise.bpm_target} BPM
          </Text>
        </View>

        {/* Debug info - remove in production */}
        {__DEV__ && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>DEBUG ID: {exerciseId}</Text>
            <Text style={styles.debugText}>Data ID: {exercise.id}</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCta}>
        <TouchableOpacity 
          style={[styles.completeCtaButton, isCompleted && styles.completeCtaButtonDone]}
          onPress={handleToggleComplete}
        >
          <Ionicons 
            name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={COLORS.text} 
          />
          <Text style={styles.completeCtaText}>
            {isCompleted ? 'Completado ✓' : 'Marcar como completado'}
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
    marginTop: SPACING.md,
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.error,
    marginTop: SPACING.md,
  },
  errorText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.xl,
  },
  backButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: FONTS.sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerBackButton: {
    padding: SPACING.xs,
  },
  headerContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  domainBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: 4,
  },
  domainText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  completeButton: {
    padding: SPACING.xs,
  },
  scrollView: {
    flex: 1,
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  descriptionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.success + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  goalText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    lineHeight: 20,
  },
  visualizationContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  techniqueContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  techniqueIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  techniqueText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  instructionText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
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
  metronomeSection: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  bpmDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  bpmButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmCenter: {
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
  },
  bpmValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
  },
  bpmLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: -4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.md,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: SPACING.sm,
  },
  sliderLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    minWidth: 35,
    textAlign: 'center',
  },
  beatIndicators: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  beatDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
  },
  beatDotActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.2 }],
  },
  beatDotFirst: {
    backgroundColor: COLORS.secondary,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  playButtonActive: {
    backgroundColor: COLORS.error,
  },
  targetHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  bottomCta: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  completeCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  completeCtaButtonDone: {
    backgroundColor: COLORS.success,
  },
  completeCtaText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
});
