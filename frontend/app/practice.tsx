import React, { useEffect, useState, useCallback } from 'react';
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
} from '../src/utils/completionStorage';

const { width } = Dimensions.get('window');
const TOTAL_BEATS = 8;

// View modes
type ViewMode = 'fretboard' | 'fretboard+tab' | 'tab';

// Focus tips for exercises (max 10 words)
const FOCUS_TIPS: Record<string, string> = {
  'timing': 'Lock with the beat. Feel the pulse.',
  'strum': 'Relax your wrist. Let gravity help.',
  'pick': 'Small motions. Stay close to strings.',
  'fret': 'Press near the fret. Curve your fingers.',
  'chord': 'Place all fingers together. Check each string.',
  'scale': 'One finger per fret. Smooth and even.',
  'lead': 'Sing the melody in your head first.',
  'tech': 'Slow is smooth. Smooth becomes fast.',
  'app': 'Make music. Express yourself freely.',
  'improv': 'No wrong notes. Just explore the sound.',
};

export default function PracticeScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { bpm, setBpm } = useStore();
  
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('fretboard');
  
  // Audio settings
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);
  const [backingTrackEnabled, setBackingTrackEnabled] = useState(true);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const [showFingering, setShowFingering] = useState(true);
  
  // Navigation state
  const [allExerciseIds, setAllExerciseIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  // Exercise notes state
  const [exerciseNotes, setExerciseNotes] = useState<TabNote[]>([]);
  const [fretRange, setFretRange] = useState({ startFret: 0, numFrets: 5 });
  
  // Fretboard notes
  const [currentFretboardNotes, setCurrentFretboardNotes] = useState<FretboardNote[]>([]);
  const [allFretboardNotes, setAllFretboardNotes] = useState<FretboardNote[]>([]);

  // Enhanced playback engine with backing tracks
  const {
    isPlaying,
    isDemoPlaying,
    currentBeat,
    audioReady,
    needsUserInteraction,
    start,
    stop,
    toggle,
    playDemo,
    stopDemo,
    initAudio,
  } = usePlaybackEngine({
    bpm,
    totalBeats: TOTAL_BEATS,
    loop: loopEnabled,
    metronomeEnabled,
    backingTrackEnabled,
    volume: 0.6,
    onBeatChange: (beat) => {
      if (exerciseNotes.length > 0) {
        const { allNotes, currentNotes } = tabNotesToFretboard(exerciseNotes, beat);
        setAllFretboardNotes(allNotes);
        setCurrentFretboardNotes(currentNotes);
      }
    },
    onDemoComplete: () => {
      // Demo finished
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
      router.replace({ pathname: '/practice', params: { exerciseId: prevId } });
    }
  };

  const navigateToNext = () => {
    if (currentIndex < allExerciseIds.length - 1) {
      stop();
      const nextId = allExerciseIds[currentIndex + 1];
      router.replace({ pathname: '/practice', params: { exerciseId: nextId } });
    }
  };

  const adjustBpm = (delta: number) => {
    const newBpm = Math.max(40, Math.min(200, bpm + delta));
    setBpm(newBpm);
  };

  const handleSliderChange = (value: number) => {
    setBpm(Math.round(value));
  };

  const handlePlayDemo = (slow: boolean = false) => {
    if (isDemoPlaying) {
      stopDemo();
    } else {
      playDemo(exerciseNotes, slow);
    }
  };

  const getFocusTip = () => {
    const prefix = exerciseId?.split('-')[0] || 'timing';
    return FOCUS_TIPS[prefix] || 'Focus on clean, even notes.';
  };

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
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            )}
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowInfo(!showInfo)} style={styles.infoButton}>
          <Ionicons name={showInfo ? 'information-circle' : 'information-circle-outline'} size={28} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Focus Banner */}
      <View style={styles.focusBanner}>
        <Ionicons name="bulb-outline" size={16} color={COLORS.warning} />
        <Text style={styles.focusText}>{getFocusTip()}</Text>
      </View>

      {/* Navigation bar */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]} 
          onPress={navigateToPrevious}
          disabled={!hasPrevious}
        >
          <Ionicons name="chevron-back" size={20} color={hasPrevious ? COLORS.text : COLORS.textMuted} />
          <Text style={[styles.navButtonText, !hasPrevious && styles.navButtonTextDisabled]}>Prev</Text>
        </TouchableOpacity>
        
        <Text style={styles.navProgress}>{currentIndex + 1} / {allExerciseIds.length}</Text>
        
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
          </View>
        )}

        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'fretboard' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('fretboard')}
          >
            <Ionicons name="grid-outline" size={18} color={viewMode === 'fretboard' ? COLORS.text : COLORS.textMuted} />
            <Text style={[styles.viewModeText, viewMode === 'fretboard' && styles.viewModeTextActive]}>Fretboard</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'fretboard+tab' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('fretboard+tab')}
          >
            <Ionicons name="layers-outline" size={18} color={viewMode === 'fretboard+tab' ? COLORS.text : COLORS.textMuted} />
            <Text style={[styles.viewModeText, viewMode === 'fretboard+tab' && styles.viewModeTextActive]}>Both</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'tab' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('tab')}
          >
            <Ionicons name="list-outline" size={18} color={viewMode === 'tab' ? COLORS.text : COLORS.textMuted} />
            <Text style={[styles.viewModeText, viewMode === 'tab' && styles.viewModeTextActive]}>Tab</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Buttons */}
        <View style={styles.demoContainer}>
          <TouchableOpacity 
            style={[styles.demoButton, isDemoPlaying && styles.demoButtonActive]}
            onPress={() => handlePlayDemo(false)}
          >
            <Ionicons 
              name={isDemoPlaying ? 'stop' : 'play-circle'} 
              size={22} 
              color={isDemoPlaying ? COLORS.text : COLORS.primary} 
            />
            <Text style={[styles.demoButtonText, isDemoPlaying && styles.demoButtonTextActive]}>
              {isDemoPlaying ? 'Stop Demo' : 'Demo'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={() => handlePlayDemo(true)}
            disabled={isDemoPlaying}
          >
            <Ionicons name="speedometer-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.demoButtonText}>Slow Demo</Text>
          </TouchableOpacity>
        </View>

        {/* Fretboard (shown in fretboard and fretboard+tab modes) */}
        {(viewMode === 'fretboard' || viewMode === 'fretboard+tab') && (
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
              height={viewMode === 'fretboard' ? 250 : 200}
              startFret={fretRange.startFret}
              numFrets={fretRange.numFrets}
              showFingering={showFingering}
            />
          </View>
        )}

        {/* Tablature (shown in tab and fretboard+tab modes) */}
        {(viewMode === 'tab' || viewMode === 'fretboard+tab') && (
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
                  Fingering
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
        )}

        {/* Audio Controls */}
        <View style={styles.audioControlsContainer}>
          <Text style={styles.sectionLabel}>Sound</Text>
          <View style={styles.audioControls}>
            <TouchableOpacity 
              style={[styles.audioControlButton, backingTrackEnabled && styles.audioControlButtonActive]}
              onPress={() => setBackingTrackEnabled(!backingTrackEnabled)}
            >
              <Ionicons 
                name="musical-notes" 
                size={20} 
                color={backingTrackEnabled ? COLORS.primary : COLORS.textMuted} 
              />
              <Text style={[styles.audioControlText, backingTrackEnabled && styles.audioControlTextActive]}>
                Backing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.audioControlButton, metronomeEnabled && styles.audioControlButtonActive]}
              onPress={() => setMetronomeEnabled(!metronomeEnabled)}
            >
              <Ionicons 
                name="timer-outline" 
                size={20} 
                color={metronomeEnabled ? COLORS.primary : COLORS.textMuted} 
              />
              <Text style={[styles.audioControlText, metronomeEnabled && styles.audioControlTextActive]}>
                Click
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.audioControlButton, loopEnabled && styles.audioControlButtonActive]}
              onPress={() => setLoopEnabled(!loopEnabled)}
            >
              <Ionicons 
                name="repeat" 
                size={20} 
                color={loopEnabled ? COLORS.primary : COLORS.textMuted} 
              />
              <Text style={[styles.audioControlText, loopEnabled && styles.audioControlTextActive]}>
                Loop
              </Text>
            </TouchableOpacity>
          </View>
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
              <Text style={styles.bpmTargetText}>Target: {exercise.bpm_start}-{exercise.bpm_target}</Text>
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
        <View style={styles.playControlsLeft}>
          <Text style={styles.playControlsBpm}>{bpm} BPM</Text>
          {backingTrackEnabled && <Ionicons name="musical-notes" size={14} color={COLORS.primary} />}
        </View>

        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={toggle}
          activeOpacity={0.8}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.playControlsRight}>
          {isPlaying && (
            <Text style={styles.beatDisplay}>Beat {currentBeat}/{TOTAL_BEATS}</Text>
          )}
        </View>
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
    paddingBottom: SPACING.sm,
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
    alignItems: 'center',
    marginTop: 2,
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
  focusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.warning + '15',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  focusText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.backgroundCard,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    gap: 2,
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
    margin: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  infoSection: {
    marginBottom: SPACING.sm,
  },
  infoTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  viewModeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  viewModeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  viewModeTextActive: {
    color: COLORS.text,
  },
  demoContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  demoButtonActive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  demoButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  demoButtonTextActive: {
    color: COLORS.text,
  },
  fretboardSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  beatIndicator: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.round,
  },
  beatIndicatorText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.text,
  },
  tabSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  fingeringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  fingeringToggleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  fingeringToggleActive: {
    color: COLORS.secondary,
  },
  audioControlsContainer: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  audioControls: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  audioControlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  audioControlButtonActive: {
    backgroundColor: COLORS.primary + '20',
  },
  audioControlText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  audioControlTextActive: {
    color: COLORS.primary,
  },
  tempoSection: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  bpmDisplayLarge: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  bpmValueLarge: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 52,
  },
  bpmLabelLarge: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    width: 28,
    textAlign: 'center',
  },
  bpmButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },
  bpmStepButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmStepButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  bpmTargetDisplay: {
    paddingHorizontal: SPACING.sm,
  },
  bpmTargetText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
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
    fontSize: FONTS.sizes.md,
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
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  playControlsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    minWidth: 80,
  },
  playControlsBpm: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  playControlsRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  beatDisplay: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
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
