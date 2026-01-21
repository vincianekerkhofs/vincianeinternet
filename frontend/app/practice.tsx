import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, getDifficultyColor, getDomainColor } from '../src/constants/theme';
import { getExercise } from '../src/services/api';
import { Fretboard, FretboardNote } from '../src/components/Fretboard';
import { TabDisplay, TabNote } from '../src/components/TabDisplay';
import { useStore } from '../src/store/useStore';
import { useMetronome } from '../src/hooks/useMetronome';
import { generateExerciseNotes, tabNotesToFretboard, calculateFretRange } from '../src/utils/exerciseNotes';

const { width } = Dimensions.get('window');

export default function PracticeScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [loopEnabled, setLoopEnabled] = useState(true);
  const { bpm, setBpm } = useStore();
  
  const totalBeats = 8;
  const playbackRef = useRef<NodeJS.Timeout | null>(null);
  
  // Exercise notes
  const [exerciseNotes, setExerciseNotes] = useState<TabNote[]>([]);
  const [fretRange, setFretRange] = useState({ startFret: 0, numFrets: 5 });
  
  // Fretboard notes derived from current beat
  const [currentFretboardNotes, setCurrentFretboardNotes] = useState<FretboardNote[]>([]);
  const [previewFretboardNotes, setPreviewFretboardNotes] = useState<FretboardNote[]>([]);
  const [allFretboardNotes, setAllFretboardNotes] = useState<FretboardNote[]>([]);

  // Metronome
  const { audioReady, needsUserInteraction, initAudio } = useMetronome({
    bpm,
    enabled: isPlaying && metronomeEnabled,
    volume: 0.6,
    onBeat: (beat) => {
      setCurrentBeat(beat);
    },
  });

  // Load exercise
  useEffect(() => {
    if (exerciseId) {
      loadExercise();
    }
    return () => {
      stopPlayback();
    };
  }, [exerciseId]);

  // Update fretboard when beat changes
  useEffect(() => {
    if (exerciseNotes.length > 0) {
      const { allNotes, currentNotes, previewNotes } = tabNotesToFretboard(exerciseNotes, currentBeat);
      setAllFretboardNotes(allNotes);
      setCurrentFretboardNotes(currentNotes);
      setPreviewFretboardNotes(previewNotes);
      
      // Debug logging
      if (currentNotes.length > 0) {
        console.log(`Beat ${currentBeat}: Current notes:`, currentNotes);
      }
    }
  }, [currentBeat, exerciseNotes]);

  const loadExercise = async () => {
    try {
      const data = await getExercise(exerciseId as string);
      setExercise(data);
      setBpm(data.bpm_start || 80);
      
      // Generate or use exercise notes
      const notes = generateExerciseNotes(exerciseId as string);
      setExerciseNotes(notes);
      
      // Calculate fret range
      const range = calculateFretRange(notes);
      setFretRange(range);
      
      // Initialize fretboard display
      const { allNotes } = tabNotesToFretboard(notes, 1);
      setAllFretboardNotes(allNotes);
    } catch (error) {
      console.error('Error loading exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopPlayback = () => {
    if (playbackRef.current) {
      clearInterval(playbackRef.current);
      playbackRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
      setCurrentBeat(1);
    } else {
      // Initialize audio on user interaction
      if (Platform.OS === 'web') {
        await initAudio();
      }
      
      setIsPlaying(true);
      setCurrentBeat(1);
      
      // If metronome is disabled, handle beat progression manually
      if (!metronomeEnabled) {
        const beatInterval = (60 / bpm) * 1000;
        playbackRef.current = setInterval(() => {
          setCurrentBeat((prev) => {
            const next = prev + 1;
            if (next > totalBeats) {
              if (loopEnabled) {
                return 1;
              } else {
                stopPlayback();
                return 1;
              }
            }
            return next;
          });
        }, beatInterval);
      }
    }
  }, [isPlaying, bpm, metronomeEnabled, loopEnabled, initAudio]);

  // Handle loop completion
  useEffect(() => {
    if (isPlaying && currentBeat > totalBeats) {
      if (loopEnabled) {
        setCurrentBeat(1);
      } else {
        stopPlayback();
      }
    }
  }, [currentBeat, isPlaying, loopEnabled]);

  const adjustBpm = (delta: number) => {
    const newBpm = Math.max(40, Math.min(200, bpm + delta));
    setBpm(newBpm);
  };

  const handleSliderChange = (value: number) => {
    setBpm(Math.round(value));
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

        {/* Fretboard Visualization */}
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
            previewNotes={previewFretboardNotes}
            width={width - SPACING.lg * 2}
            height={180}
            startFret={fretRange.startFret}
            numFrets={fretRange.numFrets}
          />
        </View>

        {/* Tab Display */}
        <View style={styles.tabSection}>
          <Text style={styles.sectionLabel}>Tablature</Text>
          <TabDisplay
            notes={exerciseNotes}
            currentBeat={currentBeat}
            totalBeats={totalBeats}
            timeSignature="4/4"
            isPlaying={isPlaying}
          />
        </View>

        {/* Tempo Control Section */}
        <View style={styles.tempoSection}>
          <Text style={styles.sectionLabel}>Tempo</Text>
          
          {/* Large BPM Display */}
          <View style={styles.bpmDisplayLarge}>
            <Text style={styles.bpmValueLarge}>{bpm}</Text>
            <Text style={styles.bpmLabelLarge}>BPM</Text>
          </View>

          {/* Slider */}
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

          {/* Step Buttons */}
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

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Play Controls */}
      <View style={styles.playControls}>
        {/* Loop Button */}
        <TouchableOpacity 
          style={[styles.controlButton, loopEnabled && styles.controlButtonActive]} 
          onPress={() => setLoopEnabled(!loopEnabled)}
        >
          <Ionicons 
            name="repeat" 
            size={24} 
            color={loopEnabled ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.controlLabel, loopEnabled && styles.controlLabelActive]}>
            Loop
          </Text>
        </TouchableOpacity>

        {/* Play Button */}
        <TouchableOpacity
          style={[styles.playButton, isPlaying && styles.playButtonActive]}
          onPress={togglePlay}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={36}
            color={COLORS.text}
          />
        </TouchableOpacity>

        {/* Metronome Button */}
        <TouchableOpacity 
          style={[styles.controlButton, metronomeEnabled && styles.controlButtonActive]} 
          onPress={() => setMetronomeEnabled(!metronomeEnabled)}
        >
          <Ionicons 
            name={metronomeEnabled ? 'musical-notes' : 'musical-notes-outline'} 
            size={24} 
            color={metronomeEnabled ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.controlLabel, metronomeEnabled && styles.controlLabelActive]}>
            {metronomeEnabled ? 'Sound On' : 'Sound Off'}
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
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
  infoButton: {
    padding: SPACING.sm,
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
  tempoSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.lg,
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
  criteriaSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  criteriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    marginTop: SPACING.sm,
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
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
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
