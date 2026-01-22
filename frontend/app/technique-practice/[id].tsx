/**
 * GUITAR GUIDE PRO - TECHNIQUE PRACTICE SCREEN
 * Interactive practice session for mastering guitar techniques
 * Each level has specific exercises with real-time feedback
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  Vibration,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getTechniqueById, TechniqueDefinition } from '../../src/data/techniques';
import { getTechniqueIcon } from '../../src/components/TechniqueIcons';
import { 
  addPracticeTime, 
  getTechniqueMasteryById, 
  updateTechniqueMastery,
  TechniqueMastery 
} from '../../src/utils/techniqueStorage';

const { width } = Dimensions.get('window');

// Exercise definitions for each technique level
interface LevelExercise {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  repetitions?: number;
  bpmStart: number;
  bpmTarget: number;
  instructions: string[];
  tabExample?: string;
}

// Get exercises for a specific technique and level
const getExercisesForLevel = (techniqueId: string, level: number): LevelExercise[] => {
  // Base exercises that adapt to each technique
  const baseExercises: Record<number, LevelExercise[]> = {
    1: [
      {
        id: `${techniqueId}-L1-E1`,
        name: 'Aislamiento Básico',
        description: 'Practica la técnica de forma aislada en una sola cuerda',
        duration: 120,
        repetitions: 20,
        bpmStart: 60,
        bpmTarget: 80,
        instructions: [
          'Comienza muy lento para desarrollar la memoria muscular',
          'Concéntrate en la precisión, no en la velocidad',
          'Repite cada movimiento hasta que se sienta natural',
        ],
      },
      {
        id: `${techniqueId}-L1-E2`,
        name: 'Repetición Rítmica',
        description: 'Ejecuta la técnica al ritmo del metrónomo',
        duration: 90,
        bpmStart: 50,
        bpmTarget: 70,
        instructions: [
          'Sincroniza cada ejecución con el click del metrónomo',
          'Mantén un tempo constante durante toda la duración',
          'Si pierdes el ritmo, reduce el BPM',
        ],
      },
    ],
    2: [
      {
        id: `${techniqueId}-L2-E1`,
        name: 'Precisión de Tono',
        description: 'Asegura que cada nota suene clara y afinada',
        duration: 150,
        repetitions: 30,
        bpmStart: 70,
        bpmTarget: 90,
        instructions: [
          'Cada nota debe sonar claramente, sin zumbidos',
          'Escucha activamente el tono producido',
          'Ajusta la presión y posición según sea necesario',
        ],
      },
      {
        id: `${techniqueId}-L2-E2`,
        name: 'Cruce de Cuerdas',
        description: 'Aplica la técnica moviéndote entre cuerdas',
        duration: 120,
        bpmStart: 60,
        bpmTarget: 85,
        instructions: [
          'Practica el movimiento de una cuerda a otra',
          'Mantén la técnica consistente en cada cuerda',
          'El cambio debe ser suave y fluido',
        ],
      },
    ],
    3: [
      {
        id: `${techniqueId}-L3-E1`,
        name: 'Expresión Dinámica',
        description: 'Varía la intensidad y velocidad de la técnica',
        duration: 180,
        bpmStart: 80,
        bpmTarget: 110,
        instructions: [
          'Alterna entre ejecuciones suaves y fuertes',
          'Experimenta con diferentes velocidades',
          'Desarrolla tu voz personal con esta técnica',
        ],
      },
      {
        id: `${techniqueId}-L3-E2`,
        name: 'Combinaciones',
        description: 'Combina esta técnica con otras técnicas relacionadas',
        duration: 150,
        bpmStart: 75,
        bpmTarget: 100,
        instructions: [
          'Mezcla con otras técnicas que ya domines',
          'Crea pequeñas frases usando múltiples técnicas',
          'Mantén la fluidez entre cada técnica',
        ],
      },
    ],
    4: [
      {
        id: `${techniqueId}-L4-E1`,
        name: 'Contexto Musical',
        description: 'Aplica la técnica en frases y licks reales',
        duration: 240,
        bpmStart: 90,
        bpmTarget: 130,
        instructions: [
          'Practica licks clásicos que usen esta técnica',
          'Improvisa usando la técnica en una progresión',
          'Integra naturalmente en tu vocabulario musical',
        ],
      },
      {
        id: `${techniqueId}-L4-E2`,
        name: 'Maestría Expresiva',
        description: 'Usa la técnica con intención artística plena',
        duration: 180,
        bpmStart: 100,
        bpmTarget: 140,
        instructions: [
          'Toca con emoción y convicción',
          'Cada ejecución debe ser intencional',
          'La técnica es ahora parte de tu expresión musical',
        ],
      },
    ],
  };

  return baseExercises[level] || baseExercises[1];
};

// Get tab example based on technique
const getTabExample = (techniqueId: string): string => {
  const tabExamples: Record<string, string> = {
    'hammer_on': 'e|---5h7---5h7---5h7---5h7---|',
    'pull_off': 'e|---7p5---7p5---7p5---7p5---|',
    'slide': 'e|---5/7---7\\5---5/7---7\\5---|',
    'bend_half': 'B|---7b(7½)---7b(7½)----------|',
    'bend_full': 'B|---7b(8)---7b(8)------------|',
    'vibrato': 'B|---7~~~~~~~---7~~~~~~~------|',
    'position_shift': 'e|--5-7-5--|--12-14-12--|',
    'finger_rolling': 'e|-8-|\nB|-8-|\nG|-9-|',
    'alternate_picking': 'e|--5-6-7-8-7-6-5----|',
    'palm_mute': 'E|--0-0-0-0--|PM------------|',
    'accented_picking': 'e|--5-5-5>5--5-5-5>5--|',
    'legato': 'e|--5h7p5h8p5h7p5----|',
  };
  return tabExamples[techniqueId] || 'e|--5-5-5-5--|';
};

export default function TechniquePracticeScreen() {
  const { id, level: levelParam } = useLocalSearchParams<{ id: string; level?: string }>();
  const [technique, setTechnique] = useState<TechniqueDefinition | null>(null);
  const [mastery, setMastery] = useState<TechniqueMastery | null>(null);
  const [currentLevel, setCurrentLevel] = useState(parseInt(levelParam || '1'));
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<LevelExercise[]>([]);
  
  // Practice state
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bpm, setBpm] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [totalPracticeTime, setTotalPracticeTime] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [metronomeVolume, setMetronomeVolume] = useState(0.7);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerIdRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const lastBeatTimeRef = useRef(0);
  const bpmRef = useRef(bpm);
  const volumeRef = useRef(metronomeVolume);
  
  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const tech = getTechniqueById(id);
      setTechnique(tech || null);
      loadMastery();
    }
    return () => {
      stopPractice();
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      const levelExercises = getExercisesForLevel(id, currentLevel);
      setExercises(levelExercises);
      if (levelExercises.length > 0) {
        const exercise = levelExercises[0];
        setBpm(exercise.bpmStart);
        setTimeRemaining(exercise.duration);
      }
    }
  }, [id, currentLevel]);

  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { volumeRef.current = metronomeVolume; }, [metronomeVolume]);

  const loadMastery = async () => {
    if (id) {
      const data = await getTechniqueMasteryById(id);
      setMastery(data);
    }
  };

  // Initialize Web Audio
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

  // Play metronome click
  const playClick = useCallback((time: number, isAccent: boolean) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const vol = volumeRef.current;
    
    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.frequency.value = isAccent ? 1200 : 900;
      osc.type = 'sine';
      
      const clickVol = vol * (isAccent ? 0.6 : 0.4);
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(clickVol, time + 0.001);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      
      osc.start(time);
      osc.stop(time + 0.1);
    } catch (e) {}
  }, []);

  // Metronome scheduler
  const runScheduler = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const currentBpm = bpmRef.current;
    const secondsPerBeat = 60.0 / currentBpm;
    const scheduleAhead = 0.1;
    const lookahead = 25;
    
    const timeSinceLast = now - lastBeatTimeRef.current;
    
    if (timeSinceLast >= secondsPerBeat * 0.95) {
      const nextTime = lastBeatTimeRef.current + secondsPerBeat;
      
      if (nextTime < now + scheduleAhead) {
        const nextBeat = (currentBeat % 4) + 1;
        setCurrentBeat(nextBeat);
        
        // Pulse animation on beat
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Vibrate on mobile
        if (Platform.OS !== 'web') {
          Vibration.vibrate(10);
        }
        
        playClick(nextTime, nextBeat === 1);
        lastBeatTimeRef.current = nextTime;
      }
    }
    
    schedulerIdRef.current = setTimeout(runScheduler, lookahead);
  }, [currentBeat, playClick, pulseAnim]);

  // Start practice session
  const startPractice = async () => {
    const ready = await initAudio();
    if (!ready && Platform.OS === 'web') return;
    
    const ctx = audioContextRef.current;
    if (ctx) {
      lastBeatTimeRef.current = ctx.currentTime;
      playClick(ctx.currentTime + 0.05, true);
    }
    
    isPlayingRef.current = true;
    setIsActive(true);
    setIsPaused(false);
    setCurrentBeat(1);
    
    runScheduler();
    
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Exercise complete
          handleExerciseComplete();
          return 0;
        }
        return prev - 1;
      });
      setTotalPracticeTime(prev => prev + 1);
    }, 1000);
  };

  // Pause practice
  const pausePractice = () => {
    isPlayingRef.current = false;
    setIsPaused(true);
    
    if (schedulerIdRef.current) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Resume practice
  const resumePractice = async () => {
    const ready = await initAudio();
    if (!ready && Platform.OS === 'web') return;
    
    const ctx = audioContextRef.current;
    if (ctx) {
      lastBeatTimeRef.current = ctx.currentTime;
    }
    
    isPlayingRef.current = true;
    setIsPaused(false);
    
    runScheduler();
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleExerciseComplete();
          return 0;
        }
        return prev - 1;
      });
      setTotalPracticeTime(prev => prev + 1);
    }, 1000);
  };

  // Stop practice completely
  const stopPractice = () => {
    isPlayingRef.current = false;
    setIsActive(false);
    setIsPaused(false);
    
    if (schedulerIdRef.current) {
      clearTimeout(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Handle exercise completion
  const handleExerciseComplete = async () => {
    stopPractice();
    
    // Save practice time
    if (id) {
      const minutesPracticed = Math.ceil(totalPracticeTime / 60);
      await addPracticeTime(id, minutesPracticed);
      await loadMastery();
    }
    
    // Check if there are more exercises
    if (currentExerciseIndex < exercises.length - 1) {
      // Move to next exercise
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      const nextExercise = exercises[nextIndex];
      setTimeRemaining(nextExercise.duration);
      setBpm(nextExercise.bpmStart);
      setTotalPracticeTime(0);
    } else {
      // Level complete!
      setShowCompletionModal(true);
      
      // Update mastery level if completed all exercises at this level
      if (id && mastery) {
        const newLevel = Math.max(mastery.level || 0, currentLevel);
        await updateTechniqueMastery(id, { level: newLevel });
        await loadMastery();
      }
    }
  };

  // Handle level completion confirmation
  const handleLevelComplete = async () => {
    setShowCompletionModal(false);
    
    if (currentLevel < 4) {
      // Offer to continue to next level
      setCurrentLevel(currentLevel + 1);
      setCurrentExerciseIndex(0);
      setTotalPracticeTime(0);
    } else {
      // Mastered! Go back to technique detail
      router.back();
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!technique) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const levelInfo = technique.levels[currentLevel - 1];
  const tabExample = getTabExample(technique.id);
  const progress = currentExercise ? ((currentExercise.duration - timeRemaining) / currentExercise.duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => { stopPractice(); router.back(); }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{technique.name}</Text>
          <Text style={styles.headerSubtitle}>Nivel {currentLevel}: {levelInfo?.name}</Text>
        </View>
        <View style={[styles.levelBadge, { backgroundColor: technique.color }]}>
          <Text style={styles.levelBadgeText}>{currentLevel}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Technique Icon with Pulse Animation */}
        <Animated.View 
          style={[
            styles.iconSection,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={[styles.techniqueIconLarge, { backgroundColor: technique.color + '20' }]}>
            {getTechniqueIcon(technique.id, { size: 80, color: technique.color })}
          </View>
        </Animated.View>

        {/* Current Exercise Info */}
        {currentExercise && (
          <View style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseNumber}>
                Ejercicio {currentExerciseIndex + 1} de {exercises.length}
              </Text>
              <View style={styles.exerciseProgress}>
                {exercises.map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.exerciseDot,
                      i < currentExerciseIndex && styles.exerciseDotComplete,
                      i === currentExerciseIndex && styles.exerciseDotCurrent,
                    ]} 
                  />
                ))}
              </View>
            </View>
            <Text style={styles.exerciseName}>{currentExercise.name}</Text>
            <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
          </View>
        )}

        {/* Tab Example */}
        <View style={styles.tabSection}>
          <Text style={styles.sectionTitle}>EJEMPLO EN TAB</Text>
          <View style={styles.tabContainer}>
            <Text style={styles.tabText}>{tabExample}</Text>
          </View>
        </View>

        {/* Timer & Progress */}
        <View style={styles.timerSection}>
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
            <Text style={styles.timerLabel}>restantes</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress}%`, backgroundColor: technique.color }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
        </View>

        {/* Beat Indicator */}
        {isActive && (
          <View style={styles.beatIndicator}>
            {[1, 2, 3, 4].map(beat => (
              <View 
                key={beat}
                style={[
                  styles.beatDot,
                  currentBeat === beat && styles.beatDotActive,
                  currentBeat === beat && beat === 1 && styles.beatDotAccent,
                ]}
              >
                <Text style={[
                  styles.beatNumber,
                  currentBeat === beat && styles.beatNumberActive,
                ]}>{beat}</Text>
              </View>
            ))}
          </View>
        )}

        {/* BPM Control */}
        <View style={styles.bpmSection}>
          <View style={styles.bpmHeader}>
            <Text style={styles.sectionTitle}>TEMPO</Text>
            {currentExercise && (
              <Text style={styles.bpmRange}>
                Objetivo: {currentExercise.bpmStart} → {currentExercise.bpmTarget} BPM
              </Text>
            )}
          </View>
          
          <View style={styles.bpmControls}>
            <TouchableOpacity 
              style={styles.bpmButton}
              onPress={() => setBpm(prev => Math.max(40, prev - 5))}
            >
              <Text style={styles.bpmButtonText}>-5</Text>
            </TouchableOpacity>
            
            <View style={styles.bpmDisplay}>
              <Text style={styles.bpmValue}>{bpm}</Text>
              <Text style={styles.bpmLabel}>BPM</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.bpmButton}
              onPress={() => setBpm(prev => Math.min(200, prev + 5))}
            >
              <Text style={styles.bpmButtonText}>+5</Text>
            </TouchableOpacity>
          </View>
          
          <Slider
            style={styles.bpmSlider}
            minimumValue={40}
            maximumValue={180}
            value={bpm}
            onValueChange={(v) => setBpm(Math.round(v))}
            minimumTrackTintColor={technique.color}
            maximumTrackTintColor={COLORS.surfaceLight}
            thumbTintColor={technique.color}
          />
        </View>

        {/* Volume Control */}
        <View style={styles.volumeSection}>
          <View style={styles.volumeRow}>
            <Ionicons name="volume-low" size={20} color={COLORS.textMuted} />
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
            <Ionicons name="volume-high" size={20} color={COLORS.textMuted} />
            <Text style={styles.volumeLabel}>{Math.round(metronomeVolume * 100)}%</Text>
          </View>
        </View>

        {/* Instructions */}
        {currentExercise && (
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>INSTRUCCIONES</Text>
            {currentExercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionRow}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={20} color={COLORS.warning} />
          <Text style={styles.tipText}>
            {technique.commonMistakes[0] || 'Mantén la relajación en ambas manos para evitar fatiga.'}
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {!isActive ? (
          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: technique.color }]}
            onPress={startPractice}
          >
            <Ionicons name="play" size={32} color={COLORS.text} />
            <Text style={styles.mainButtonText}>Comenzar Práctica</Text>
          </TouchableOpacity>
        ) : isPaused ? (
          <View style={styles.controlRow}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.stopButton]}
              onPress={stopPractice}
            >
              <Ionicons name="stop" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.mainButton, { backgroundColor: COLORS.success }]}
              onPress={resumePractice}
            >
              <Ionicons name="play" size={32} color={COLORS.text} />
              <Text style={styles.mainButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.controlRow}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.stopButton]}
              onPress={stopPractice}
            >
              <Ionicons name="stop" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.mainButton, styles.pauseButton]}
              onPress={pausePractice}
            >
              <Ionicons name="pause" size={32} color={COLORS.text} />
              <Text style={styles.mainButtonText}>Pausar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.controlButton, styles.skipButton]}
              onPress={handleExerciseComplete}
            >
              <Ionicons name="play-skip-forward" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Level Completion Modal */}
      {showCompletionModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.completionModal}>
            <View style={[styles.completionIcon, { backgroundColor: technique.color + '20' }]}>
              {getTechniqueIcon(technique.id, { size: 64, color: technique.color })}
            </View>
            <Text style={styles.completionTitle}>
              {currentLevel < 4 ? '¡Nivel Completado!' : '¡Técnica Dominada!'}
            </Text>
            <Text style={styles.completionSubtitle}>
              {currentLevel < 4 
                ? `Has completado el Nivel ${currentLevel}: ${levelInfo?.name}`
                : `¡Felicidades! Has dominado ${technique.name}`
              }
            </Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.ceil(totalPracticeTime / 60)}</Text>
                <Text style={styles.statLabel}>min hoy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{mastery?.totalPracticeMinutes || 0}</Text>
                <Text style={styles.statLabel}>min total</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.completionButton, { backgroundColor: technique.color }]}
              onPress={handleLevelComplete}
            >
              <Text style={styles.completionButtonText}>
                {currentLevel < 4 ? `Continuar al Nivel ${currentLevel + 1}` : 'Finalizar'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => { setShowCompletionModal(false); router.back(); }}
            >
              <Text style={styles.secondaryButtonText}>Volver a Técnicas</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  backButton: {
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
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  levelBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  iconSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  techniqueIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCard: {
    backgroundColor: COLORS.backgroundCard,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  exerciseNumber: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  exerciseProgress: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  exerciseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
  },
  exerciseDotComplete: {
    backgroundColor: COLORS.success,
  },
  exerciseDotCurrent: {
    backgroundColor: COLORS.primary,
  },
  exerciseName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  exerciseDescription: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  tabSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  tabContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  tabText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    lineHeight: 20,
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '800',
    color: COLORS.text,
  },
  timerLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: -4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    width: 40,
    textAlign: 'right',
  },
  beatIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  beatDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beatDotActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  beatDotAccent: {
    backgroundColor: COLORS.secondary,
  },
  beatNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  beatNumberActive: {
    color: COLORS.text,
  },
  bpmSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  bpmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  bpmRange: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  bpmControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  bpmButton: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  bpmDisplay: {
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
  bpmSlider: {
    width: '100%',
    height: 40,
  },
  volumeSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  volumeSlider: {
    flex: 1,
    height: 30,
  },
  volumeLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  instructionsSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
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
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warning + '15',
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    lineHeight: 20,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  mainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  mainButtonText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  pauseButton: {
    backgroundColor: COLORS.warning,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  skipButton: {
    backgroundColor: COLORS.backgroundCard,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  completionModal: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  completionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  completionTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  completionSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.surfaceLight,
  },
  completionButton: {
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  completionButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
  },
  secondaryButtonText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
  },
});
