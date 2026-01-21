import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { ChordFretboard } from '../src/components/ChordFretboard';
import { ScaleFretboard } from '../src/components/ScaleFretboard';
import { StrumVisualizer } from '../src/components/StrumVisualizer';
import { useStore } from '../src/store/useStore';
import { 
  CURRICULUM, 
  CHORD_SHAPES, 
  getTodayLesson, 
  getWeek,
  ChordShape,
  DayLesson 
} from '../src/data/curriculum';
import { getStrumPatternByStyle, STRUM_PATTERNS } from '../src/data/strumPatterns';
import { 
  isExerciseComplete, 
  markExerciseComplete, 
  markExerciseIncomplete,
} from '../src/utils/completionStorage';

const { width } = Dimensions.get('window');

type Stage = 'aprender' | 'practicar' | 'aplicar';

// Scale shapes that should use ScaleFretboard
const SCALE_SHAPES = ['Am_pent_box1', 'Am_blues', 'C_major_box1'];

export default function PracticeScreen() {
  const params = useLocalSearchParams<{ week?: string; day?: string }>();
  const weekNum = parseInt(params.week || '1');
  const dayNum = parseInt(params.day || '1');
  
  const [lesson, setLesson] = useState<DayLesson | null>(null);
  const [weekData, setWeekData] = useState<any>(null);
  const [stage, setStage] = useState<Stage>('aprender');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTablature, setShowTablature] = useState(false);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [currentSubdivision, setCurrentSubdivision] = useState(0); // 0-7 for 8th note subdivisions
  const [currentChordIndex, setCurrentChordIndex] = useState(0);
  const [metronomeVolume, setMetronomeVolume] = useState(0.7);
  
  const { bpm, setBpm } = useStore();
  const lessonId = `week${weekNum}-day${dayNum}`;
  
  // Audio context refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const lastBeatTimeRef = useRef(0);
  
  // Refs for scheduler to avoid stale closures
  const stageRef = useRef<Stage>(stage);
  const progressionChordsRef = useRef<string[]>([]);
  const bpmRef = useRef(bpm);
  const metronomeVolumeRef = useRef(metronomeVolume);
  const currentBeatRef = useRef(1);
  const currentSubdivisionRef = useRef(0);
  const currentChordIndexRef = useRef(0);
  const barCountRef = useRef(0); // Track which bar we're on

  // Parse chord progression
  const parseProgression = (prog: string): string[] => {
    return prog
      .split('|')
      .map(c => c.trim())
      .filter(c => c.length > 0 && !c.includes('('));
  };

  const progressionChords = lesson ? parseProgression(lesson.apply.progression) : [];

  // Keep refs in sync with state
  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { progressionChordsRef.current = progressionChords; }, [progressionChords]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { metronomeVolumeRef.current = metronomeVolume; }, [metronomeVolume]);

  useEffect(() => {
    loadLesson();
    checkCompletion();
    return () => stopPlayback();
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

  // Initialize audio context
  const initAudio = async () => {
    if (Platform.OS !== 'web') return true;
    
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      return true;
    } catch (e) {
      console.error('Audio init failed:', e);
      return false;
    }
  };

  // Play metronome click - LOUD and CLEAR
  const playClick = useCallback((time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const vol = metronomeVolumeRef.current;
    
    try {
      // Main click oscillator
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // High frequency for clarity - accent is higher
      osc.frequency.value = isAccent ? 1200 : 900;
      osc.type = 'sine';
      
      // Sharp attack, quick decay for crisp click
      const clickVol = vol * (isAccent ? 0.6 : 0.4);
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(clickVol, time + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      
      osc.start(time);
      osc.stop(time + 0.1);
      
      // Add a second harmonic for more presence
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = isAccent ? 2400 : 1800;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0, time);
      gain2.gain.linearRampToValueAtTime(clickVol * 0.3, time + 0.001);
      gain2.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc2.start(time);
      osc2.stop(time + 0.06);
    } catch (e) {}
  }, []);

  // Metronome scheduler - uses refs to avoid stale closures
  // Now tracks 8th note subdivisions (0-7 per bar)
  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const currentBpm = bpmRef.current;
    // 8th note subdivision = half a beat
    const secondsPerSubdivision = 30.0 / currentBpm;
    const scheduleAhead = 0.1;
    const lookahead = 25;
    
    const timeSinceLast = now - lastBeatTimeRef.current;
    
    if (timeSinceLast >= secondsPerSubdivision * 0.95) {
      const nextTime = lastBeatTimeRef.current + secondsPerSubdivision;
      
      if (nextTime < now + scheduleAhead) {
        // Update subdivision counter (0-7)
        const prevSub = currentSubdivisionRef.current;
        const newSub = (prevSub + 1) % 8;
        currentSubdivisionRef.current = newSub;
        setCurrentSubdivision(newSub);
        
        // Update beat counter (1-4) - beat changes on even subdivisions
        const newBeat = Math.floor(newSub / 2) + 1;
        if (newBeat !== currentBeatRef.current) {
          currentBeatRef.current = newBeat;
          setCurrentBeat(newBeat);
        }
        
        // On subdivision 0 (start of new bar), advance chord in APLICAR mode
        if (newSub === 0 && prevSub === 7 && stageRef.current === 'aplicar') {
          const chords = progressionChordsRef.current;
          if (chords.length > 0) {
            barCountRef.current += 1;
            const newChordIndex = barCountRef.current % chords.length;
            currentChordIndexRef.current = newChordIndex;
            setCurrentChordIndex(newChordIndex);
          }
        }
        
        // Play click - accent on subdivision 0 (beat 1), quieter on even subdivisions (downbeats)
        const isDownbeat = newSub % 2 === 0;
        const isAccent = newSub === 0;
        if (isDownbeat) {
          playClick(nextTime, isAccent);
        }
        
        lastBeatTimeRef.current = nextTime;
      }
    }
    
    schedulerIdRef.current = window.setTimeout(runScheduler, lookahead);
  }, [playClick]);

  // Start playback
  const startPlayback = async () => {
    const ready = await initAudio();
    if (!ready) return;
    
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    isPlayingRef.current = true;
    lastBeatTimeRef.current = ctx.currentTime;
    currentBeatRef.current = 1;
    currentSubdivisionRef.current = 0;
    currentChordIndexRef.current = 0;
    barCountRef.current = 0; // Start at bar 0 (first chord)
    
    setCurrentBeat(1);
    setCurrentSubdivision(0);
    setCurrentChordIndex(0);
    setIsPlaying(true);
    
    // Play first click immediately
    playClick(ctx.currentTime + 0.05, true);
    
    runScheduler();
  };

  // Stop playback
  const stopPlayback = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    if (schedulerIdRef.current !== null) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    
    // Reset refs
    currentBeatRef.current = 1;
    currentSubdivisionRef.current = 0;
    currentChordIndexRef.current = 0;
    barCountRef.current = 0;
  };

  // Toggle playback
  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const navigateToDay = (week: number, day: number) => {
    if (week >= 25) return;
    stopPlayback();
    router.replace({ pathname: '/practice', params: { week: String(week), day: String(day) } });
  };

  const goToPreviousDay = () => {
    if (dayNum > 1) navigateToDay(weekNum, dayNum - 1);
    else if (weekNum > 1) navigateToDay(weekNum - 1, 7);
  };

  const goToNextDay = () => {
    if (dayNum < 7) navigateToDay(weekNum, dayNum + 1);
    else if (weekNum < 24) navigateToDay(weekNum + 1, 1);
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
  const currentProgressionChord = progressionChords[currentChordIndex] || progressionChords[0] || 'C';
  const displayShape = stage === 'aplicar' ? (currentProgressionChord as ChordShape) : currentShape;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { stopPlayback(); router.back(); }} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Semana {weekNum} · Día {dayNum}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{lesson.objective}</Text>
        </View>
        {isCompleted && (
          <Ionicons name="checkmark-circle" size={28} color={COLORS.success} style={{ marginRight: SPACING.sm }} />
        )}
      </View>

      {/* Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]} onPress={goToPreviousDay} disabled={!hasPrevious}>
          <Ionicons name="chevron-back" size={20} color={hasPrevious ? COLORS.text : COLORS.textMuted} />
          <Text style={[styles.navButtonText, !hasPrevious && styles.navButtonTextDisabled]}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.navProgress}>{lesson.title}</Text>
        <TouchableOpacity style={[styles.navButton, !hasNext && styles.navButtonDisabled]} onPress={goToNextDay} disabled={!hasNext}>
          <Text style={[styles.navButtonText, !hasNext && styles.navButtonTextDisabled]}>Siguiente</Text>
          <Ionicons name="chevron-forward" size={20} color={hasNext ? COLORS.text : COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Stage Tabs */}
      <View style={styles.stageTabs}>
        {(['aprender', 'practicar', 'aplicar'] as Stage[]).map((s) => (
          <TouchableOpacity 
            key={s}
            style={[styles.stageTab, stage === s && styles.stageTabActive]}
            onPress={() => { setStage(s); if (s !== stage) stopPlayback(); }}
          >
            <Text style={[styles.stageTabText, stage === s && styles.stageTabTextActive]}>
              {s.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stage: APRENDER */}
        {stage === 'aprender' && (
          <View style={styles.stageContent}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionText}>{lesson.learn.notes || 'Observa la posición de los dedos en el mástil.'}</Text>
            </View>

            <View style={styles.fretboardContainer}>
              <Text style={styles.sectionLabel}>{CHORD_SHAPES[currentShape]?.name || currentShape}</Text>
              {SCALE_SHAPES.includes(currentShape) ? (
                <ScaleFretboard scaleName={currentShape} width={width - SPACING.lg * 2} height={280} />
              ) : (
                <ChordFretboard shape={currentShape} width={width - SPACING.lg * 2} height={260} />
              )}
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

            <TouchableOpacity style={styles.nextStageButton} onPress={() => setStage('practicar')}>
              <Text style={styles.nextStageButtonText}>Continuar a Practicar</Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}

        {/* Stage: PRACTICAR */}
        {stage === 'practicar' && (
          <View style={styles.stageContent}>
            {/* Beat indicator */}
            {isPlaying && (
              <View style={styles.beatIndicatorRow}>
                {[1, 2, 3, 4].map(b => (
                  <View key={b} style={[styles.beatDot, currentBeat === b && styles.beatDotActive]}>
                    <Text style={[styles.beatDotText, currentBeat === b && styles.beatDotTextActive]}>{b}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.fretboardContainer}>
              <View style={styles.fretboardHeader}>
                <Text style={styles.sectionLabel}>Practica a {bpm} BPM</Text>
              </View>
              {SCALE_SHAPES.includes(currentShape) ? (
                <ScaleFretboard scaleName={currentShape} width={width - SPACING.lg * 2} height={260} isActive={isPlaying} />
              ) : (
                <ChordFretboard shape={currentShape} width={width - SPACING.lg * 2} height={240} isActive={isPlaying} />
              )}
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
                <TouchableOpacity style={styles.tempoButton} onPress={() => adjustBpm(-5)}><Text style={styles.tempoButtonText}>-5</Text></TouchableOpacity>
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
                <TouchableOpacity style={styles.tempoButton} onPress={() => adjustBpm(5)}><Text style={styles.tempoButtonText}>+5</Text></TouchableOpacity>
              </View>
              <Text style={styles.tempoRange}>Rango: {lesson.practice.tempoMin}–{lesson.practice.tempoMax} BPM</Text>
            </View>

            {/* Metronome Volume */}
            <View style={styles.volumeRow}>
              <Ionicons name="volume-high" size={20} color={COLORS.textSecondary} />
              <Slider
                style={styles.volumeSlider}
                minimumValue={0}
                maximumValue={1}
                value={metronomeVolume}
                onValueChange={setMetronomeVolume}
                minimumTrackTintColor={COLORS.success}
                maximumTrackTintColor={COLORS.surfaceLight}
                thumbTintColor={COLORS.success}
              />
              <Text style={styles.volumeLabel}>{Math.round(metronomeVolume * 100)}%</Text>
            </View>

            {/* Play Button */}
            <TouchableOpacity style={[styles.playButton, isPlaying && styles.playButtonActive]} onPress={togglePlayback}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={COLORS.text} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextStageButton} onPress={() => { stopPlayback(); setStage('aplicar'); }}>
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

            {/* Beat indicator */}
            {isPlaying && (
              <View style={styles.beatIndicatorRow}>
                {[1, 2, 3, 4].map(b => (
                  <View key={b} style={[styles.beatDot, currentBeat === b && styles.beatDotActive]}>
                    <Text style={[styles.beatDotText, currentBeat === b && styles.beatDotTextActive]}>{b}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Chord Progression - synced to metronome */}
            <View style={styles.progressionCard}>
              <Text style={styles.progressionLabel}>PROGRESIÓN</Text>
              <View style={styles.progressionBar}>
                {progressionChords.map((chord, i) => (
                  <View key={i} style={[styles.progressionChord, currentChordIndex === i && isPlaying && styles.progressionChordActive]}>
                    <Text style={[styles.progressionChordText, currentChordIndex === i && isPlaying && styles.progressionChordTextActive]}>
                      {chord}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Dynamic Fretboard - updates with progression */}
            <View style={styles.fretboardContainer}>
              <Text style={styles.sectionLabel}>
                {isPlaying ? `Acorde actual: ${currentProgressionChord}` : 'Referencia'}
              </Text>
              <ChordFretboard 
                shape={CHORD_SHAPES[displayShape] ? displayShape : currentShape} 
                width={width - SPACING.lg * 2} 
                height={220} 
                isActive={isPlaying}
                currentBeat={currentBeat}
              />
            </View>

            {/* Tempo + Volume Controls */}
            <View style={styles.miniControls}>
              <View style={styles.miniControl}>
                <Text style={styles.miniControlLabel}>{bpm} BPM</Text>
                <View style={styles.miniControlButtons}>
                  <TouchableOpacity style={styles.miniButton} onPress={() => adjustBpm(-5)}><Text style={styles.miniButtonText}>-</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.miniButton} onPress={() => adjustBpm(5)}><Text style={styles.miniButtonText}>+</Text></TouchableOpacity>
                </View>
              </View>
              <View style={styles.miniControl}>
                <Text style={styles.miniControlLabel}>Vol: {Math.round(metronomeVolume * 100)}%</Text>
                <Slider
                  style={{ width: 100 }}
                  minimumValue={0}
                  maximumValue={1}
                  value={metronomeVolume}
                  onValueChange={setMetronomeVolume}
                  minimumTrackTintColor={COLORS.success}
                  maximumTrackTintColor={COLORS.surfaceLight}
                  thumbTintColor={COLORS.success}
                />
              </View>
            </View>

            {lesson.apply.notes && (
              <View style={styles.applyNotes}>
                <Text style={styles.applyNotesText}>{lesson.apply.notes}</Text>
              </View>
            )}

            {/* Play Button */}
            <TouchableOpacity style={[styles.playButton, isPlaying && styles.playButtonActive]} onPress={togglePlayback}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={36} color={COLORS.text} />
            </TouchableOpacity>

            {/* Mark Complete */}
            <TouchableOpacity style={[styles.completeButton, isCompleted && styles.completeButtonDone]} onPress={handleMarkComplete}>
              <Ionicons name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'} size={24} color={isCompleted ? COLORS.text : COLORS.success} />
              <Text style={[styles.completeButtonText, isCompleted && styles.completeButtonTextDone]}>
                {isCompleted ? '¡Completado!' : 'Marcar como hecho'}
              </Text>
            </TouchableOpacity>

            {hasNext && (
              <TouchableOpacity style={styles.nextDayButton} onPress={goToNextDay}>
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
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.lg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceLight },
  headerButton: { padding: SPACING.sm },
  headerCenter: { flex: 1, marginHorizontal: SPACING.sm },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  headerSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.backgroundCard },
  navButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navButtonDisabled: { opacity: 0.4 },
  navButtonText: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '600' },
  navButtonTextDisabled: { color: COLORS.textMuted },
  navProgress: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '700' },
  stageTabs: { flexDirection: 'row', backgroundColor: COLORS.backgroundCard, marginHorizontal: SPACING.md, marginTop: SPACING.md, borderRadius: BORDER_RADIUS.lg, padding: 4 },
  stageTab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
  stageTabActive: { backgroundColor: COLORS.primary },
  stageTabText: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.5 },
  stageTabTextActive: { color: COLORS.text },
  scrollView: { flex: 1 },
  stageContent: { padding: SPACING.md },
  instructionCard: { backgroundColor: COLORS.primary + '15', borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md },
  instructionText: { fontSize: FONTS.sizes.md, color: COLORS.text, lineHeight: 24, textAlign: 'center' },
  fretboardContainer: { backgroundColor: COLORS.backgroundCard, borderRadius: BORDER_RADIUS.xl, padding: SPACING.md, marginBottom: SPACING.md, overflow: 'visible' },
  fretboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  sectionLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm },
  additionalShapes: { marginBottom: SPACING.md },
  additionalLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  shapeChips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  shapeChip: { backgroundColor: COLORS.surfaceLight, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.round },
  shapeChipText: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: '500' },
  nextStageButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.md, gap: SPACING.sm, marginTop: SPACING.md },
  nextStageButtonText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  cueCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.warning + '15', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.md },
  cueText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.warning, fontWeight: '500' },
  tempoSection: { backgroundColor: COLORS.backgroundCard, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.sm },
  bpmDisplay: { alignItems: 'center', marginBottom: SPACING.sm },
  bpmValue: { fontSize: 48, fontWeight: '800', color: COLORS.primary },
  bpmLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  tempoControls: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  tempoButton: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  tempoButtonText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.text },
  tempoSlider: { flex: 1, height: 40, marginHorizontal: SPACING.sm },
  tempoRange: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: SPACING.xs },
  volumeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundCard, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.sm },
  volumeSlider: { flex: 1, height: 30 },
  volumeLabel: { fontSize: FONTS.sizes.sm, color: COLORS.success, fontWeight: '600', width: 45, textAlign: 'right' },
  playButton: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: SPACING.md },
  playButtonActive: { backgroundColor: COLORS.error },
  beatIndicatorRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  beatDot: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  beatDotActive: { backgroundColor: COLORS.primary, transform: [{ scale: 1.1 }] },
  beatDotText: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textMuted },
  beatDotTextActive: { color: COLORS.text },
  applyHeader: { alignItems: 'center', marginBottom: SPACING.md },
  applyTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.text },
  applyStyle: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '600', marginTop: SPACING.xs },
  progressionCard: { backgroundColor: COLORS.backgroundCard, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.md },
  progressionLabel: { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.md, textAlign: 'center' },
  progressionBar: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: SPACING.sm },
  progressionChord: { backgroundColor: COLORS.surfaceLight, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.md, minWidth: 60, alignItems: 'center' },
  progressionChordActive: { backgroundColor: COLORS.primary, transform: [{ scale: 1.05 }] },
  progressionChordText: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.text },
  progressionChordTextActive: { color: COLORS.text },
  miniControls: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.md },
  miniControl: { alignItems: 'center' },
  miniControlLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  miniControlButtons: { flexDirection: 'row', gap: SPACING.sm },
  miniButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  miniButtonText: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.text },
  applyNotes: { backgroundColor: COLORS.success + '15', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  applyNotesText: { fontSize: FONTS.sizes.sm, color: COLORS.success, textAlign: 'center', fontWeight: '500' },
  completeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.backgroundCard, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.md, borderWidth: 2, borderColor: COLORS.success, gap: SPACING.sm },
  completeButtonDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  completeButtonText: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.success },
  completeButtonTextDone: { color: COLORS.text },
  nextDayButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SPACING.md, paddingVertical: SPACING.md, gap: SPACING.sm },
  nextDayButtonText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary },
});
