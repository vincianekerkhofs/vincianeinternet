/**
 * GUITAR GUIDE PRO - ENHANCED METRONOME
 * Features: Tap tempo, subdivisions, swing feel, real-time BPM changes
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Props {
  initialBpm?: number;
  minBpm?: number;
  maxBpm?: number;
  onBpmChange?: (bpm: number) => void;
  compact?: boolean;
}

type Subdivision = '1' | '2' | '3' | '4';
type SwingFeel = 'straight' | 'light' | 'heavy';

export const EnhancedMetronome: React.FC<Props> = ({
  initialBpm = 80,
  minBpm = 40,
  maxBpm = 200,
  onBpmChange,
  compact = false,
}) => {
  const [bpm, setBpm] = useState(initialBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [subdivision, setSubdivision] = useState<Subdivision>('1');
  const [swingFeel, setSwingFeel] = useState<SwingFeel>('straight');
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beatCount = useRef(0);

  // Calculate interval based on BPM and subdivision
  const calculateInterval = useCallback(() => {
    const baseInterval = 60000 / bpm;
    const subDivisions = parseInt(subdivision);
    return baseInterval / subDivisions;
  }, [bpm, subdivision]);

  // Start/stop metronome
  useEffect(() => {
    if (isPlaying) {
      const interval = calculateInterval();
      
      intervalRef.current = setInterval(() => {
        beatCount.current = (beatCount.current + 1) % (4 * parseInt(subdivision));
        const isMainBeat = beatCount.current % parseInt(subdivision) === 0;
        
        // Visual pulse
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: isMainBeat ? 1.3 : 1.15,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
        
        // Haptic feedback on main beats
        if (isMainBeat) {
          Vibration.vibrate(10);
          setCurrentBeat(Math.floor(beatCount.current / parseInt(subdivision)) + 1);
        }
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      beatCount.current = 0;
      setCurrentBeat(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, subdivision, calculateInterval]);

  // Handle BPM change
  const handleBpmChange = (newBpm: number) => {
    const roundedBpm = Math.round(newBpm);
    setBpm(roundedBpm);
    onBpmChange?.(roundedBpm);
  };

  // Tap tempo calculation
  const handleTapTempo = () => {
    const now = Date.now();
    const newTaps = [...tapTimes, now].filter(t => now - t < 3000); // Keep last 3 seconds
    setTapTimes(newTaps);
    
    if (newTaps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      
      if (calculatedBpm >= minBpm && calculatedBpm <= maxBpm) {
        handleBpmChange(calculatedBpm);
      }
    }
    
    // Visual feedback
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Increment/decrement BPM
  const adjustBpm = (delta: number) => {
    const newBpm = Math.max(minBpm, Math.min(maxBpm, bpm + delta));
    handleBpmChange(newBpm);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity 
          style={styles.compactPlayButton}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={16} 
            color={COLORS.text} 
          />
        </TouchableOpacity>
        
        <Animated.View style={[styles.compactBpm, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.compactBpmText}>{bpm}</Text>
        </Animated.View>
        
        <View style={styles.compactSlider}>
          <Slider
            style={{ flex: 1, height: 30 }}
            minimumValue={minBpm}
            maximumValue={maxBpm}
            value={bpm}
            onValueChange={handleBpmChange}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.surfaceLight}
            thumbTintColor={COLORS.primary}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.compactTapButton}
          onPress={handleTapTempo}
        >
          <Text style={styles.compactTapText}>TAP</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* BPM Display */}
      <View style={styles.bpmSection}>
        <TouchableOpacity 
          style={styles.bpmButton} 
          onPress={() => adjustBpm(-5)}
          onLongPress={() => adjustBpm(-10)}
        >
          <Ionicons name="remove" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Animated.View style={[styles.bpmDisplay, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.bpmValue}>{bpm}</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.bpmButton} 
          onPress={() => adjustBpm(5)}
          onLongPress={() => adjustBpm(10)}
        >
          <Ionicons name="add" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>{minBpm}</Text>
        <Slider
          style={styles.slider}
          minimumValue={minBpm}
          maximumValue={maxBpm}
          value={bpm}
          onValueChange={handleBpmChange}
          minimumTrackTintColor={COLORS.primary}
          maximumTrackTintColor={COLORS.surfaceLight}
          thumbTintColor={COLORS.primary}
        />
        <Text style={styles.sliderLabel}>{maxBpm}</Text>
      </View>

      {/* Beat indicators */}
      <View style={styles.beatIndicators}>
        {[1, 2, 3, 4].map(beat => (
          <View 
            key={beat}
            style={[
              styles.beatDot,
              currentBeat === beat && styles.beatDotActive,
              currentBeat === beat && beat === 1 && styles.beatDotFirst,
            ]}
          />
        ))}
      </View>

      {/* Controls row */}
      <View style={styles.controlsRow}>
        {/* Tap Tempo */}
        <TouchableOpacity 
          style={styles.tapButton}
          onPress={handleTapTempo}
          activeOpacity={0.7}
        >
          <Ionicons name="hand-left" size={20} color={COLORS.text} />
          <Text style={styles.tapText}>TAP</Text>
        </TouchableOpacity>

        {/* Play/Pause */}
        <TouchableOpacity 
          style={[
            styles.playButton,
            isPlaying && styles.playButtonActive
          ]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={28} 
            color={COLORS.text} 
          />
        </TouchableOpacity>

        {/* Subdivision selector */}
        <View style={styles.subdivisionSelector}>
          {(['1', '2', '4'] as Subdivision[]).map(sub => (
            <TouchableOpacity
              key={sub}
              style={[
                styles.subButton,
                subdivision === sub && styles.subButtonActive,
              ]}
              onPress={() => setSubdivision(sub)}
            >
              <Text style={[
                styles.subButtonText,
                subdivision === sub && styles.subButtonTextActive,
              ]}>
                {sub === '1' ? '♩' : sub === '2' ? '♫' : '♬'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Swing feel (optional) */}
      <View style={styles.swingRow}>
        <Text style={styles.swingLabel}>Feel:</Text>
        {(['straight', 'light', 'heavy'] as SwingFeel[]).map(feel => (
          <TouchableOpacity
            key={feel}
            style={[
              styles.swingButton,
              swingFeel === feel && styles.swingButtonActive,
            ]}
            onPress={() => setSwingFeel(feel)}
          >
            <Text style={[
              styles.swingButtonText,
              swingFeel === feel && styles.swingButtonTextActive,
            ]}>
              {feel === 'straight' ? 'Recto' : feel === 'light' ? 'Swing' : 'Heavy'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  
  // BPM Section
  bpmSection: {
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
  bpmDisplay: {
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
  },
  bpmValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  bpmLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: -4,
  },
  
  // Slider
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: SPACING.sm,
  },
  sliderLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    width: 30,
    textAlign: 'center',
  },
  
  // Beat indicators
  beatIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  
  // Controls
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  tapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  tapText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonActive: {
    backgroundColor: COLORS.error,
  },
  subdivisionSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
  },
  subButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  subButtonActive: {
    backgroundColor: COLORS.primary,
  },
  subButtonText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textMuted,
  },
  subButtonTextActive: {
    color: COLORS.text,
  },
  
  // Swing
  swingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  swingLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginRight: SPACING.xs,
  },
  swingButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surfaceLight,
  },
  swingButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  swingButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  swingButtonTextActive: {
    color: COLORS.text,
  },
  
  // Compact mode
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  compactPlayButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBpm: {
    minWidth: 40,
    alignItems: 'center',
  },
  compactBpmText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  compactSlider: {
    flex: 1,
  },
  compactTapButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
  },
  compactTapText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
});
