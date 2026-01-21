import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, getDifficultyColor, getDomainColor } from '../src/constants/theme';
import { getExercise, getExercises } from '../src/services/api';
import { Fretboard, FretboardNote } from '../src/components/Fretboard';
import { TabDisplay, TabNote } from '../src/components/TabDisplay';
import { useStore } from '../src/store/useStore';
import { usePlaybackEngine } from '../src/hooks/usePlaybackEngine';
import { generateExerciseNotes, tabNotesToFretboard, calculateFretRange } from '../src/utils/exerciseNotes';
import { 
  isExerciseComplete, 
  markExerciseComplete, 
  markExerciseIncomplete,
  getCompletedExercises 
} from '../src/utils/completionStorage';

const { width } = Dimensions.get('window');
const TOTAL_BEATS = 8;

export default function PracticeScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [showFingering, setShowFingering] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const { bpm, setBpm } = useStore();
  
  // Navigation state
  const [allExerciseIds, setAllExerciseIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  // Exercise notes state
  const [exerciseNotes, setExerciseNotes] = useState<TabNote[]>([]);
  const [fretRange, setFretRange] = useState({ startFret: 0, numFrets: 5 });
  
  // Fretboard notes
  const [currentFretboardNotes, setCurrentFretboardNotes] = useState<FretboardNote[]>([]);
  const [allFretboardNotes, setAllFretboardNotes] = useState<FretboardNote[]>([]);

  // Unified playback engine
  const {
    isPlaying,
    currentBeat,
    audioReady,
    needsUserInteraction,
    start,
    stop,
    toggle,
    initAudio,
  } = usePlaybackEngine({
    bpm,
    totalBeats: TOTAL_BEATS,
    loop: loopEnabled,
    soundEnabled,
    volume: 0.6,
    onBeatChange: (beat) => {
      if (exerciseNotes.length > 0) {
        const { allNotes, currentNotes } = tabNotesToFretboard(exerciseNotes, beat);
        setAllFretboardNotes(allNotes);
        setCurrentFretboardNotes(currentNotes);
      }
    },
  });

  // Load exercise and navigation data
  useEffect(() => {
    if (exerciseId) {
      loadExercise();
      loadAllExercises();
      checkCompletionStatus();
    }
    return () => {
      stop();
    };
  }, [exerciseId]);

  // Update fretboard when not playing
  useEffect(() => {
    if (exerciseNotes.length > 0 && !isPlaying) {
      const { allNotes } = tabNotesToFretboard(exerciseNotes, 1);
      setAllFretboardNotes(allNotes);
      setCurrentFretboardNotes([]);
    }
  }, [exerciseNotes, isPlaying]);

  const loadExercise = async () => {
    try {
      const data = await getExercise(exerciseId as string);
      setExercise(data);
      setBpm(data.bpm_start || 80);
      
      const notes = generateExerciseNotes(exerciseId as string);
      setExerciseNotes(notes);
      
      const range = calculateFretRange(notes);
      setFretRange(range);
      
      const { allNotes } = tabNotesToFretboard(notes, 1);
      setAllFretboardNotes(allNotes);
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllExercises = async () => {
    try {
      const data = await getExercises({ limit: 100 });
      const ids = data.exercises.map((ex: any) => ex.id);
      setAllExerciseIds(ids);
      const index = ids.indexOf(exerciseId);
      setCurrentIndex(index);
    } catch (error) {
      console.error('Error loading exercises list:', error);
    }
  };

  const checkCompletionStatus = async () => {
    const completed = await isExerciseComplete(exerciseId as string);
    setIsCompleted(completed);
  };

  const handleMarkComplete = async () => {
    if (isCompleted) {
      await markExerciseIncomplete(exerciseId as string);
      setIsCompleted(false);
    } else {
      await markExerciseComplete(exerciseId as string);
      setIsCompleted(true);
    }
  };

  const navigateToPrevious = () => {
    if (currentIndex > 0) {
      stop();
      const prevId = allExerciseIds[currentIndex - 1];
      router.replace({
        pathname: '/practice',
        params: { exerciseId: prevId },
      });
    }
  };

  const navigateToNext = () => {
    if (currentIndex < allExerciseIds.length - 1) {
      stop();
      const nextId = allExerciseIds[currentIndex + 1];
      router.replace({
        pathname: '/practice',
        params: { exerciseId: nextId },
      });
    }
  };

  const adjustBpm = (delta: number) => {
    const newBpm = Math.max(40, Math.min(200, bpm + delta));
    setBpm(newBpm);
  };

  const handleSliderChange = (value: number) => {
    setBpm(Math.round(value));
  };

  const handleSoundToggle = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading exercise...</Text>
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
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allExerciseIds.length - 1;

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
                {exercise.domain?.split(' ')[0] || 'Exercise'}
              </Text>
            </View>
            <View style={[styles.badge, { borderColor: difficultyColor, borderWidth: 1 }]}>
              <Text style={[styles.badgeText, { color: difficultyColor }]}>
                {exercise.difficulty_tier}
              </Text>
            </View>
            {isCompleted && (
              <View style={[styles.badge, { backgroundColor: COLORS.success + '30' }]}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.infoButton}>
          <Ionicons name={showInfo ? 'information-circle' : 'information-circle-outline'} size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Navigation bar */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]} 
          onPress={navigateToPrevious}
          disabled={!hasPrevious}
        >
          <Ionicons name="chevron-back" size={20} color={hasPrevious ? COLORS.text : COLORS.textMuted} />
          <Text style={[styles.navButtonText, !hasPrevious && styles.navButtonTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        
        <Text style={styles.navProgress}>
          {currentIndex + 1} / {allExerciseIds.length}
        </Text>
        
        <TouchableOpacity 
          style={[styles.navButton, !hasNext && styles.navButtonDisabled]} 
          onPress={navigateToNext}
          disabled={!hasNext}
        >
          <Text style={[styles.navButtonText, !hasNext && styles.navButtonTextDisabled]}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color={hasNext ? COLORS.text : COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Audio Warning */}
      {needsUserInteraction && (
        <TouchableOpacity style={styles.audioWarning} onPress={initAudio}>
          <Ionicons name="volume-mute" size={20} color={COLORS.warning} />
          <Text style={styles.audioWarningText}>Tap to enable audio</Text>
        </TouchableOpacity>
      )}

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
          </View>
        )}

        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Ionicons name="speedometer-outline" size={18} color={COLORS.primary} />
            <Text style={styles.overviewLabel}>Tempo</Text>
            <Text style={styles.overviewValue}>{exercise.bpm_start}-{exercise.bpm_target} BPM</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={styles.overviewLabel}>Duration</Text>
            <Text style={styles.overviewValue}>{Math.ceil(exercise.duration_seconds / 60)} min</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Ionicons name="fitness-outline" size={18} color={COLORS.primary} />
            <Text style={styles.overviewLabel}>Focus</Text>
            <Text style={styles.overviewValue} numberOfLines={1}>{exercise.subdomain || 'General'}</Text>
          </View>
        </View>

        {/* Fretboard */}
        <View style={styles.fretboardSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Fretboard</Text>
            {isPlaying && (
              <View style={styles.beatIndicator}>
                <Text style={styles.beatIndicatorText}>Beat {currentBeat}</Text>
              </View>
            )}
          </View>
          <Fretboard
            notes={allFretboardNotes}
            currentNotes={currentFretboardNotes}
            width={width - SPACING.lg * 2}
            height={220}
            startFret={fretRange.startFret}
            numFrets={fretRange.numFrets}
            showFingering={showFingering}
          />
        </View>

        {/* Tablature */}
        <View style={styles.tabSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Tablature</Text>
            <TouchableOpacity 
              style={styles.fingeringToggle}
              onPress={() => setShowFingering(!showFingering)}
            >
              <Ionicons 
                name={showFingering ? 'hand-left' : 'hand-left-outline'} 
                size={16} 
                color={showFingering ? COLORS.secondary : COLORS.textMuted} 
              />
              <Text style={[styles.fingeringToggleText, showFingering && styles.fingeringToggleActive]}>
                {showFingering ? 'Fingering' : 'No Fingering'}
              </Text>
            </TouchableOpacity>
          </View>
          <TabDisplay
            notes={exerciseNotes}
            currentBeat={currentBeat}
            totalBeats={TOTAL_BEATS}
            timeSignature="4/4"
            isPlaying={isPlaying}
            showFingering={showFingering}
          />
        </View>

        {/* Tempo Control */}
        <View style={styles.tempoSection}>
          <Text style={styles.sectionLabel}>Tempo</Text>
          <View style={styles.bpmDisplayLarge}>
            <Text style={styles.bpmValueLarge}>{bpm}</Text>
            <Text style={styles.bpmLabelLarge}>BPM</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>40</Text>
            <Slider
              style={styles.slider}
              minimumValue={40}
              maximumValue={200}
              value={bpm}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.surfaceLight}
              thumbTintColor={COLORS.primary}
            />
            <Text style={styles.sliderLabel}>200</Text>
          </View>
          <View style={styles.bpmButtons}>
            <TouchableOpacity style={styles.bpmStepButton} onPress={() => adjustBpm(-5)}>
              <Text style={styles.bpmStepButtonText}>-5</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bpmStepButton} onPress={() => adjustBpm(-1)}>
              <Text style={styles.bpmStepButtonText}>-1</Text>
            </TouchableOpacity>
            <View style={styles.bpmTargetDisplay}>
              <Text style={styles.bpmTargetText}>
                Target: {exercise.bpm_start}-{exercise.bpm_target}
              </Text>
            </View>
            <TouchableOpacity style={styles.bpmStepButton} onPress={() => adjustBpm(1)}>
              <Text style={styles.bpmStepButtonText}>+1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bpmStepButton} onPress={() => adjustBpm(5)}>
              <Text style={styles.bpmStepButtonText}>+5</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mark Complete Button */}
        <TouchableOpacity 
          style={[styles.completeButton, isCompleted && styles.completeButtonDone]}
          onPress={handleMarkComplete}
        >
          <Ionicons 
            name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'} 
            size={24} 
            color={isCompleted ? COLORS.text : COLORS.success} 
          />
          <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextDone]}>
            {isCompleted ? 'Completed!' : 'Mark as Done'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 150 }} />
      </ScrollView>

      {/* Play Controls */}
      <View style={styles.playControls}>
        <TouchableOpacity 
          style={[styles.controlButton, loopEnabled && styles.controlButtonActive]} 
          onPress={() => setLoopEnabled(!loopEnabled)}
        >
          <Ionicons name="repeat" size={24} color={loopEnabled ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.controlLabel, loopEnabled && styles.controlLabelActive]}>Loop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={toggle}
          activeOpacity={0.8}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, soundEnabled && styles.controlButtonActive]} 
          onPress={handleSoundToggle}
        >
          <Ionicons name={soundEnabled ? 'volume-high' : 'volume-mute'} size={24} color={soundEnabled ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.controlLabel, soundEnabled && styles.controlLabelActive]}>
            {soundEnabled ? 'Sound' : 'Muted'}
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
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.md,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  infoButton: {
    padding: SPACING.sm,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: COLORS.textMuted,
  },
  navProgress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  audioWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning + '20',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  audioWarningText: {
    color: COLORS.warning,
    fontWeight: '600',
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
  overviewCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  overviewLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  overviewValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  overviewDivider: {
    width: 1,
    backgroundColor: COLORS.surfaceLight,
    marginVertical: SPACING.xs,
  },
  fretboardSection: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  beatIndicator: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  beatIndicatorText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  fingeringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  fingeringToggleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  fingeringToggleActive: {
    color: COLORS.secondary,
  },
  tempoSection: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
  },
  bpmDisplayLarge: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  bpmValueLarge: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 70,
  },
  bpmLabelLarge: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    width: 30,
    textAlign: 'center',
  },
  bpmButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  bpmStepButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmStepButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  bpmTargetDisplay: {
    paddingHorizontal: SPACING.md,
  },
  bpmTargetText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.success,
    gap: SPACING.sm,
  },
  completeButtonDone: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  completeButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.success,
  },
  completeButtonTextDone: {
    color: COLORS.text,
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
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 70,
  },
  controlButtonActive: {
    backgroundColor: COLORS.primary + '20',
  },
  controlLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  controlLabelActive: {
    color: COLORS.primary,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: COLORS.error,
  },
});
