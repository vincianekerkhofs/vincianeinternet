import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import Svg, { Line, Circle, Rect, Text as SvgText, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Musical keys
const KEYS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// Moods/Styles
const MOODS = [
  { id: 'blues', name: 'Blues', color: '#3B82F6' },
  { id: 'rock', name: 'Rock', color: '#EF4444' },
  { id: 'chill', name: 'Chill', color: '#10B981' },
];

// Scale patterns (relative to root, in semitones)
const SCALE_PATTERNS = {
  minor_pentatonic: [0, 3, 5, 7, 10], // Root, m3, 4, 5, m7
  blues: [0, 3, 5, 6, 7, 10], // Minor pentatonic + blue note (b5)
};

// Note progression levels
const PROGRESSION_LEVELS = [
  { notes: 3, label: '3 Notes', description: 'Root, 4th, 5th' },
  { notes: 5, label: '5 Notes', description: 'Full Pentatonic' },
  { notes: 6, label: 'Full Box', description: 'With Blue Note' },
];

// String tuning (semitones from A2)
const STRING_TUNING = [
  { name: 'e', semitones: 28 }, // E4
  { name: 'B', semitones: 23 }, // B3
  { name: 'G', semitones: 19 }, // G3
  { name: 'D', semitones: 14 }, // D3
  { name: 'A', semitones: 9 },  // A2
  { name: 'E', semitones: 4 },  // E2
];

// Note names
const NOTE_NAMES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

export default function ExploreScreen() {
  const [selectedKey, setSelectedKey] = useState('A');
  const [selectedMood, setSelectedMood] = useState('blues');
  const [progressionLevel, setProgressionLevel] = useState(0);
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backingEnabled, setBackingEnabled] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const bassOscRef = useRef<OscillatorNode | null>(null);
  const drumIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get the semitone offset for the selected key (A = 0)
  const keyOffset = NOTE_NAMES.indexOf(selectedKey);

  // Get scale notes based on mood and level
  const getScaleNotes = useCallback(() => {
    const pattern = selectedMood === 'blues' ? SCALE_PATTERNS.blues : SCALE_PATTERNS.minor_pentatonic;
    const levelConfig = PROGRESSION_LEVELS[progressionLevel];
    return pattern.slice(0, levelConfig.notes).map(n => (n + keyOffset) % 12);
  }, [selectedKey, selectedMood, progressionLevel, keyOffset]);

  // Check if a fret position is in the scale
  const isInScale = useCallback((stringIndex: number, fret: number) => {
    const scaleNotes = getScaleNotes();
    const stringTuning = STRING_TUNING[stringIndex].semitones;
    const noteSemitone = (stringTuning + fret) % 12;
    return scaleNotes.includes(noteSemitone);
  }, [getScaleNotes]);

  // Get note name at position
  const getNoteName = (stringIndex: number, fret: number) => {
    const stringTuning = STRING_TUNING[stringIndex].semitones;
    const noteSemitone = (stringTuning + fret) % 12;
    return NOTE_NAMES[noteSemitone];
  };

  // Check if note is the root
  const isRoot = (stringIndex: number, fret: number) => {
    const stringTuning = STRING_TUNING[stringIndex].semitones;
    const noteSemitone = (stringTuning + fret) % 12;
    return noteSemitone === keyOffset;
  };

  // Initialize audio
  const initAudio = async () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  // Play backing track
  const startBacking = useCallback(async () => {
    await initAudio();
    const ctx = audioContextRef.current;
    if (!ctx) return;

    // Bass drone on root note
    const rootFreq = 110 * Math.pow(2, keyOffset / 12); // A2 = 110Hz
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = rootFreq;
    osc.type = 'sine';
    gain.gain.value = 0.15;
    
    osc.start();
    bassOscRef.current = osc;

    // Simple drum pattern
    const playDrum = (isKick: boolean) => {
      const drumOsc = ctx.createOscillator();
      const drumGain = ctx.createGain();
      
      drumOsc.connect(drumGain);
      drumGain.connect(ctx.destination);
      
      if (isKick) {
        drumOsc.frequency.setValueAtTime(150, ctx.currentTime);
        drumOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
        drumGain.gain.setValueAtTime(0.4, ctx.currentTime);
        drumGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      } else {
        // Hi-hat
        drumOsc.frequency.value = 8000;
        drumOsc.type = 'square';
        drumGain.gain.setValueAtTime(0.08, ctx.currentTime);
        drumGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      }
      
      drumOsc.start();
      drumOsc.stop(ctx.currentTime + 0.2);
    };

    let beatCount = 0;
    const msPerBeat = (60 / bpm) * 1000;
    
    drumIntervalRef.current = setInterval(() => {
      const isKick = beatCount % 2 === 0;
      playDrum(isKick);
      playDrum(false); // Always hi-hat
      beatCount++;
    }, msPerBeat);

  }, [keyOffset, bpm]);

  // Stop backing track
  const stopBacking = useCallback(() => {
    if (bassOscRef.current) {
      bassOscRef.current.stop();
      bassOscRef.current = null;
    }
    if (drumIntervalRef.current) {
      clearInterval(drumIntervalRef.current);
      drumIntervalRef.current = null;
    }
  }, []);

  // Toggle playback
  const togglePlay = async () => {
    if (isPlaying) {
      stopBacking();
      setIsPlaying(false);
    } else {
      if (backingEnabled) {
        await startBacking();
      }
      setIsPlaying(true);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBacking();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopBacking]);

  // Render fretboard with highlighted scale notes
  const renderExploreFretboard = () => {
    const paddingTop = 25;
    const paddingBottom = 40;
    const paddingLeft = 35;
    const paddingRight = 20;
    const fretboardWidth = width - SPACING.lg * 2 - paddingLeft - paddingRight;
    const fretboardHeight = 200;
    const numFrets = 12;
    const fretWidth = fretboardWidth / numFrets;
    const stringSpacing = (fretboardHeight - paddingTop - paddingBottom) / 5;

    return (
      <View style={styles.fretboardContainer}>
        <Svg width={width - SPACING.lg * 2} height={fretboardHeight + paddingTop + paddingBottom}>
          {/* Fretboard background */}
          <Rect
            x={paddingLeft}
            y={paddingTop}
            width={fretboardWidth}
            height={fretboardHeight - paddingTop}
            fill="#2D2416"
            rx={4}
          />
          
          {/* Frets */}
          {Array.from({ length: numFrets + 1 }, (_, i) => {
            const x = paddingLeft + i * fretWidth;
            const isNut = i === 0;
            return (
              <G key={`fret-${i}`}>
                <Line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={fretboardHeight}
                  stroke={isNut ? '#D4D4D4' : '#6B5B4D'}
                  strokeWidth={isNut ? 6 : 2}
                />
                {/* Fret number */}
                {i > 0 && (
                  <SvgText
                    x={x - fretWidth / 2}
                    y={fretboardHeight + 20}
                    fill={COLORS.textMuted}
                    fontSize={12}
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {i}
                  </SvgText>
                )}
              </G>
            );
          })}
          
          {/* Strings */}
          {STRING_TUNING.map((string, i) => {
            const y = paddingTop + i * stringSpacing;
            return (
              <G key={`string-${i}`}>
                <Line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + fretboardWidth}
                  y2={y}
                  stroke="#8B7355"
                  strokeWidth={1 + i * 0.5}
                />
                <SvgText
                  x={paddingLeft - 18}
                  y={y + 5}
                  fill={COLORS.textSecondary}
                  fontSize={14}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {string.name}
                </SvgText>
              </G>
            );
          })}
          
          {/* Scale notes */}
          {STRING_TUNING.map((_, stringIndex) => {
            const y = paddingTop + stringIndex * stringSpacing;
            return Array.from({ length: numFrets + 1 }, (_, fret) => {
              if (!isInScale(stringIndex, fret)) return null;
              
              const x = fret === 0 
                ? paddingLeft - 12 
                : paddingLeft + (fret - 0.5) * fretWidth;
              
              const isRootNote = isRoot(stringIndex, fret);
              const mood = MOODS.find(m => m.id === selectedMood);
              const noteColor = isRootNote ? COLORS.primary : mood?.color || COLORS.secondary;
              
              return (
                <G key={`note-${stringIndex}-${fret}`}>
                  {/* Glow for root */}
                  {isRootNote && (
                    <Circle cx={x} cy={y} r={20} fill={noteColor} opacity={0.2} />
                  )}
                  {/* Note circle */}
                  <Circle
                    cx={x}
                    cy={y}
                    r={isRootNote ? 16 : 12}
                    fill={noteColor}
                    stroke="#FFF"
                    strokeWidth={isRootNote ? 3 : 1.5}
                  />
                  {/* Note name */}
                  <SvgText
                    x={x}
                    y={y + 5}
                    fill="#FFF"
                    fontSize={isRootNote ? 12 : 10}
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {fret}
                  </SvgText>
                </G>
              );
            });
          })}
        </Svg>
      </View>
    );
  };

  const currentLevel = PROGRESSION_LEVELS[progressionLevel];
  const currentMood = MOODS.find(m => m.id === selectedMood);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Mode</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Key Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Key</Text>
        <View style={styles.keySelector}>
          {KEYS.map(key => (
            <TouchableOpacity
              key={key}
              style={[
                styles.keyButton,
                selectedKey === key && styles.keyButtonActive,
              ]}
              onPress={() => setSelectedKey(key)}
            >
              <Text style={[
                styles.keyButtonText,
                selectedKey === key && styles.keyButtonTextActive,
              ]}>
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mood Selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Mood</Text>
        <View style={styles.moodSelector}>
          {MOODS.map(mood => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodButton,
                selectedMood === mood.id && { backgroundColor: mood.color },
              ]}
              onPress={() => setSelectedMood(mood.id)}
            >
              <Text style={[
                styles.moodButtonText,
                selectedMood === mood.id && styles.moodButtonTextActive,
              ]}>
                {mood.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Progression Level */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Notes to Use</Text>
        <View style={styles.levelSelector}>
          {PROGRESSION_LEVELS.map((level, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.levelButton,
                progressionLevel === index && styles.levelButtonActive,
              ]}
              onPress={() => setProgressionLevel(index)}
            >
              <Text style={[
                styles.levelButtonLabel,
                progressionLevel === index && styles.levelButtonTextActive,
              ]}>
                {level.label}
              </Text>
              <Text style={styles.levelButtonDesc}>{level.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Fretboard */}
      <View style={styles.fretboardSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>{selectedKey} {currentMood?.name} Scale</Text>
          <Text style={styles.hintText}>Play any highlighted note!</Text>
        </View>
        {renderExploreFretboard()}
      </View>

      {/* Tempo Control */}
      <View style={styles.tempoRow}>
        <TouchableOpacity 
          style={[styles.backingButton, backingEnabled && styles.backingButtonActive]}
          onPress={() => setBackingEnabled(!backingEnabled)}
        >
          <Ionicons name="musical-notes" size={18} color={backingEnabled ? COLORS.primary : COLORS.textMuted} />
          <Text style={[styles.backingText, backingEnabled && styles.backingTextActive]}>Backing</Text>
        </TouchableOpacity>
        
        <View style={styles.tempoControl}>
          <Text style={styles.bpmValue}>{bpm} BPM</Text>
          <Slider
            style={styles.tempoSlider}
            minimumValue={50}
            maximumValue={120}
            value={bpm}
            onValueChange={(v) => setBpm(Math.round(v))}
            minimumTrackTintColor={currentMood?.color || COLORS.primary}
            maximumTrackTintColor={COLORS.surfaceLight}
            thumbTintColor={currentMood?.color || COLORS.primary}
          />
        </View>
      </View>

      {/* Play Button */}
      <View style={styles.playSection}>
        <TouchableOpacity
          style={[styles.playButton, isPlaying && { backgroundColor: COLORS.error }]}
          onPress={togglePlay}
        >
          <Ionicons name={isPlaying ? 'stop' : 'play'} size={36} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.playHint}>
          {isPlaying ? 'Playing - Explore the fretboard!' : 'Start the backing track'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  keySelector: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  keyButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
  },
  keyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  keyButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  keyButtonTextActive: {
    color: COLORS.text,
  },
  moodSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
  },
  moodButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  moodButtonTextActive: {
    color: COLORS.text,
  },
  levelSelector: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  levelButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
  },
  levelButtonActive: {
    backgroundColor: COLORS.primary,
  },
  levelButtonLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  levelButtonTextActive: {
    color: COLORS.text,
  },
  levelButtonDesc: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  fretboardSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  hintText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontStyle: 'italic',
  },
  fretboardContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
  },
  tempoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  backingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
  },
  backingButtonActive: {
    backgroundColor: COLORS.primary + '20',
  },
  backingText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  backingTextActive: {
    color: COLORS.primary,
  },
  tempoControl: {
    flex: 1,
  },
  bpmValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  tempoSlider: {
    height: 30,
  },
  playSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  playHint: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
});
