import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { ChordFretboard } from '../src/components/ChordFretboard';
import { useStore } from '../src/store/useStore';
import { 
  CURRICULUM, 
  CHORD_SHAPES, 
  getTodayLesson, 
  getWeek,
  ChordShape,
  DayLesson 
} from '../src/data/curriculum';
import { 
  isExerciseComplete, 
  markExerciseComplete, 
  markExerciseIncomplete,
} from '../src/utils/completionStorage';

const { width } = Dimensions.get('window');

// Stages
type Stage = 'aprender' | 'practicar' | 'aplicar';

export default function PracticeScreen() {
  const params = useLocalSearchParams<{ week?: string; day?: string }>();
  const weekNum = parseInt(params.week || '1');
  const dayNum = parseInt(params.day || '1');
  
  const [lesson, setLesson] = useState<DayLesson | null>(null);
  const [weekData, setWeekData] = useState<any>(null);
  const [stage, setStage] = useState<Stage>('aprender');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  
  const { bpm, setBpm } = useStore();
  
  const lessonId = `week${weekNum}-day${dayNum}`;

  useEffect(() => {
    loadLesson();
    checkCompletion();
  }, [weekNum, dayNum]);

  const loadLesson = () => {
    const week = getWeek(weekNum);
    const day = getTodayLesson(weekNum, dayNum);
    setWeekData(week);
    setLesson(day);
    if (day) {
      setBpm(day.practice.tempoMin);
    }
  };

  const checkCompletion = async () => {
    const completed = await isExerciseComplete(lessonId);
    setIsCompleted(completed);
  };

  const handleMarkComplete = async () => {
    if (isCompleted) {
      await markExerciseIncomplete(lessonId);
      setIsCompleted(false);
    } else {
      await markExerciseComplete(lessonId);
      setIsCompleted(true);
    }
  };

  const navigateToDay = (week: number, day: number) => {
    if (week >= 25) return; // Paywall
    router.replace({ pathname: '/practice', params: { week: String(week), day: String(day) } });
  };

  const goToPreviousDay = () => {
    if (dayNum > 1) {
      navigateToDay(weekNum, dayNum - 1);
    } else if (weekNum > 1) {
      navigateToDay(weekNum - 1, 7);
    }
  };

  const goToNextDay = () => {
    if (dayNum < 7) {
      navigateToDay(weekNum, dayNum + 1);
    } else if (weekNum < 24) {
      navigateToDay(weekNum + 1, 1);
    }
  };

  const adjustBpm = (delta: number) => {
    const newBpm = Math.max(40, Math.min(200, bpm + delta));
    setBpm(newBpm);
  };

  const hasPrevious = weekNum > 1 || dayNum > 1;
  const hasNext = weekNum < 24 || dayNum < 7;

  if (!lesson || !weekData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentShape = lesson.learn.shapes[0];
  const shapeData = CHORD_SHAPES[currentShape];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Semana {weekNum} · Día {dayNum}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{lesson.objective}</Text>
        </View>
        {isCompleted && (
          <Ionicons name="checkmark-circle" size={28} color={COLORS.success} style={styles.completedIcon} />
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]} 
          onPress={goToPreviousDay}
          disabled={!hasPrevious}
        >
          <Ionicons name="chevron-back" size={20} color={hasPrevious ? COLORS.text : COLORS.textMuted} />
          <Text style={[styles.navButtonText, !hasPrevious && styles.navButtonTextDisabled]}>Anterior</Text>
        </TouchableOpacity>
        
        <Text style={styles.navProgress}>{lesson.title}</Text>
        
        <TouchableOpacity 
          style={[styles.navButton, !hasNext && styles.navButtonDisabled]} 
          onPress={goToNextDay}
          disabled={!hasNext}
        >
          <Text style={[styles.navButtonText, !hasNext && styles.navButtonTextDisabled]}>Siguiente</Text>
          <Ionicons name="chevron-forward" size={20} color={hasNext ? COLORS.text : COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Stage Tabs */}
      <View style={styles.stageTabs}>
        <TouchableOpacity 
          style={[styles.stageTab, stage === 'aprender' && styles.stageTabActive]}
          onPress={() => setStage('aprender')}
        >
          <Text style={[styles.stageTabText, stage === 'aprender' && styles.stageTabTextActive]}>
            APRENDER
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.stageTab, stage === 'practicar' && styles.stageTabActive]}
          onPress={() => setStage('practicar')}
        >
          <Text style={[styles.stageTabText, stage === 'practicar' && styles.stageTabTextActive]}>
            PRACTICAR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.stageTab, stage === 'aplicar' && styles.stageTabActive]}
          onPress={() => setStage('aplicar')}
        >
          <Text style={[styles.stageTabText, stage === 'aplicar' && styles.stageTabTextActive]}>
            APLICAR
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stage: APRENDER */}
        {stage === 'aprender' && (
          <View style={styles.stageContent}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionText}>{lesson.learn.notes}</Text>
            </View>

            <View style={styles.fretboardContainer}>
              <Text style={styles.sectionLabel}>{shapeData?.name || currentShape}</Text>
              <ChordFretboard
                shape={currentShape}
                width={width - SPACING.lg * 2}
                height={240}
              />
            </View>

            {lesson.learn.shapes.length > 1 && (
              <View style={styles.additionalShapes}>
                <Text style={styles.additionalLabel}>También usarás:</Text>
                <View style={styles.shapeChips}>
                  {lesson.learn.shapes.slice(1).map((s, i) => (
                    <View key={i} style={styles.shapeChip}>
                      <Text style={styles.shapeChipText}>{CHORD_SHAPES[s]?.name || s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.nextStageButton}
              onPress={() => setStage('practicar')}
            >
              <Text style={styles.nextStageButtonText}>Continuar a Practicar</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: PRACTICAR */}
        {stage === 'practicar' && (
          <View style={styles.stageContent}>
            <View style={styles.fretboardContainer}>
              <View style={styles.fretboardHeader}>
                <Text style={styles.sectionLabel}>Practica a {bpm} BPM</Text>
                <TouchableOpacity 
                  style={styles.tabToggle}
                  onPress={() => setShowTab(!showTab)}
                >
                  <Text style={[styles.tabToggleText, showTab && styles.tabToggleTextActive]}>
                    {showTab ? 'Ocultar tab' : 'Ver tablatura'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <ChordFretboard
                shape={currentShape}
                width={width - SPACING.lg * 2}
                height={200}
                isActive={isPlaying}
              />
            </View>

            {lesson.practice.cue && (
              <View style={styles.cueCard}>
                <Ionicons name="bulb-outline" size={18} color={COLORS.warning} />
                <Text style={styles.cueText}>{lesson.practice.cue}</Text>
              </View>
            )}

            {/* Tempo Control */}
            <View style={styles.tempoSection}>
              <View style={styles.bpmDisplay}>
                <Text style={styles.bpmValue}>{bpm}</Text>
                <Text style={styles.bpmLabel}>BPM</Text>
              </View>
              <View style={styles.tempoControls}>
                <TouchableOpacity style={styles.tempoButton} onPress={() => adjustBpm(-5)}>
                  <Text style={styles.tempoButtonText}>-5</Text>
                </TouchableOpacity>
                <Slider
                  style={styles.tempoSlider}
                  minimumValue={lesson.practice.tempoMin}
                  maximumValue={lesson.practice.tempoMax}
                  value={bpm}
                  onValueChange={(v) => setBpm(Math.round(v))}
                  minimumTrackTintColor={COLORS.primary}
                  maximumTrackTintColor={COLORS.surfaceLight}
                  thumbTintColor={COLORS.primary}
                />
                <TouchableOpacity style={styles.tempoButton} onPress={() => adjustBpm(5)}>
                  <Text style={styles.tempoButtonText}>+5</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.tempoRange}>
                Rango: {lesson.practice.tempoMin}–{lesson.practice.tempoMax} BPM
              </Text>
            </View>

            {/* Play Button */}
            <TouchableOpacity 
              style={[styles.playButton, isPlaying && styles.playButtonActive]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={COLORS.text} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.nextStageButton}
              onPress={() => setStage('aplicar')}
            >
              <Text style={styles.nextStageButtonText}>Continuar a Aplicar</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: APLICAR */}
        {stage === 'aplicar' && (
          <View style={styles.stageContent}>
            <View style={styles.applyHeader}>
              <Text style={styles.applyTitle}>¡Hora de hacer música!</Text>
              <Text style={styles.applyStyle}>{lesson.apply.style}</Text>
            </View>

            {/* Chord Progression Bar */}
            <View style={styles.progressionCard}>
              <Text style={styles.progressionLabel}>Progresión</Text>
              <View style={styles.progressionBar}>
                {lesson.apply.progression.split('|').filter(p => p.trim()).map((chord, i) => (
                  <View key={i} style={styles.progressionChord}>
                    <Text style={styles.progressionChordText}>{chord.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>

            {lesson.apply.notes && (
              <View style={styles.applyNotes}>
                <Text style={styles.applyNotesText}>{lesson.apply.notes}</Text>
              </View>
            )}

            {/* Mini Fretboard Reference */}
            <View style={styles.fretboardContainer}>
              <Text style={styles.sectionLabel}>Referencia</Text>
              <ChordFretboard
                shape={currentShape}
                width={width - SPACING.lg * 2}
                height={160}
              />
            </View>

            {/* Play Button */}
            <TouchableOpacity 
              style={[styles.playButton, isPlaying && styles.playButtonActive]}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color={COLORS.text} />
            </TouchableOpacity>

            {/* Mark Complete */}
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
                {isCompleted ? '¡Completado!' : 'Marcar como hecho'}
              </Text>
            </TouchableOpacity>

            {/* Next Day */}
            {hasNext && (
              <TouchableOpacity 
                style={styles.nextDayButton}
                onPress={goToNextDay}
              >
                <Text style={styles.nextDayButtonText}>Siguiente día</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerButton: {
    padding: SPACING.sm,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  completedIcon: {
    marginRight: SPACING.sm,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '700',
  },
  stageTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: 4,
  },
  stageTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  stageTabActive: {
    backgroundColor: COLORS.primary,
  },
  stageTabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  stageTabTextActive: {
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  stageContent: {
    padding: SPACING.md,
  },
  instructionCard: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  instructionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  fretboardContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  fretboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  tabToggle: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  tabToggleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  tabToggleTextActive: {
    color: COLORS.primary,
  },
  additionalShapes: {
    marginBottom: SPACING.md,
  },
  additionalLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  shapeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  shapeChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  shapeChipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  nextStageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  nextStageButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  cueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  cueText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '500',
  },
  tempoSection: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bpmDisplay: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bpmValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
  },
  bpmLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  tempoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  tempoButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempoButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  tempoSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: SPACING.sm,
  },
  tempoRange: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: SPACING.lg,
  },
  playButtonActive: {
    backgroundColor: COLORS.error,
  },
  applyHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  applyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  applyStyle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  progressionCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  progressionLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  progressionBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  progressionChord: {
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 60,
    alignItems: 'center',
  },
  progressionChordText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  applyNotes: {
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  applyNotesText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    textAlign: 'center',
    fontWeight: '500',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
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
  nextDayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  nextDayButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
