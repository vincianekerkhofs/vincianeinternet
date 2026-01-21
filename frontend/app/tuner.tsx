import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';

const { width } = Dimensions.get('window');

// Standard guitar tuning strings (low to high)
const TUNINGS = {
  standard: { name: 'Estándar', notes: ['E', 'A', 'D', 'G', 'B', 'E'], freqs: [82.41, 110, 146.83, 196, 246.94, 329.63] },
  dropD: { name: 'Drop D', notes: ['D', 'A', 'D', 'G', 'B', 'E'], freqs: [73.42, 110, 146.83, 196, 246.94, 329.63] },
  halfDown: { name: '½ tono abajo', notes: ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'], freqs: [77.78, 103.83, 138.59, 185, 233.08, 311.13] },
};

type TuningKey = keyof typeof TUNINGS;

export default function TunerScreen() {
  const [selectedTuning, setSelectedTuning] = useState<TuningKey>('standard');
  const [selectedString, setSelectedString] = useState(0); // 0 = low E (6th string)
  const [tuningOffset, setTuningOffset] = useState(0); // -50 to +50 cents simulation
  
  const tuning = TUNINGS[selectedTuning];
  const currentNote = tuning.notes[selectedString];
  const stringNumber = 6 - selectedString; // 6th string = low E
  
  // Simulated tuning indicator (in real app, this would come from audio analysis)
  const getTuningStatus = () => {
    if (Math.abs(tuningOffset) < 5) return 'tuned';
    if (tuningOffset < 0) return 'flat';
    return 'sharp';
  };
  
  const tuningStatus = getTuningStatus();
  
  const getIndicatorColor = () => {
    if (tuningStatus === 'tuned') return COLORS.success;
    return COLORS.error;
  };
  
  const getStatusText = () => {
    if (tuningStatus === 'tuned') return 'Afinado';
    if (tuningStatus === 'flat') return 'Bajo';
    return 'Alto';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Afinador</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Tuning selector */}
      <View style={styles.tuningSelector}>
        {(Object.keys(TUNINGS) as TuningKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.tuningButton, selectedTuning === key && styles.tuningButtonActive]}
            onPress={() => setSelectedTuning(key)}
          >
            <Text style={[styles.tuningButtonText, selectedTuning === key && styles.tuningButtonTextActive]}>
              {TUNINGS[key].name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main note display */}
      <View style={styles.noteDisplay}>
        <Text style={styles.stringLabel}>Cuerda {stringNumber}</Text>
        <Text style={[styles.noteLetter, { color: getIndicatorColor() }]}>
          {currentNote}
        </Text>
        <Text style={[styles.statusText, { color: getIndicatorColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      {/* Tuning indicator bar */}
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorLabel}>Bajo</Text>
        <View style={styles.indicatorBar}>
          {/* Center marker */}
          <View style={styles.centerMarker} />
          
          {/* Moving indicator */}
          <View 
            style={[
              styles.indicator,
              { 
                left: `${50 + tuningOffset}%`,
                backgroundColor: getIndicatorColor(),
              }
            ]}
          />
          
          {/* Color zones */}
          <View style={[styles.zone, styles.zoneLeft, { backgroundColor: COLORS.error + '30' }]} />
          <View style={[styles.zone, styles.zoneCenter, { backgroundColor: COLORS.success + '30' }]} />
          <View style={[styles.zone, styles.zoneRight, { backgroundColor: COLORS.error + '30' }]} />
        </View>
        <Text style={styles.indicatorLabel}>Alto</Text>
      </View>

      {/* String selector */}
      <View style={styles.stringSelector}>
        <Text style={styles.stringSelectorLabel}>Selecciona la cuerda:</Text>
        <View style={styles.stringButtons}>
          {tuning.notes.map((note, index) => {
            const strNum = 6 - index;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.stringButton, selectedString === index && styles.stringButtonActive]}
                onPress={() => {
                  setSelectedString(index);
                  // Simulate different tuning offsets
                  setTuningOffset(Math.random() * 40 - 20);
                }}
              >
                <Text style={[styles.stringButtonNumber, selectedString === index && styles.stringButtonNumberActive]}>
                  {strNum}
                </Text>
                <Text style={[styles.stringButtonNote, selectedString === index && styles.stringButtonNoteActive]}>
                  {note}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Simulate tuning button (for demo) */}
      <TouchableOpacity 
        style={styles.tuneButton}
        onPress={() => setTuningOffset(0)}
      >
        <Ionicons name="checkmark-circle" size={24} color={COLORS.text} />
        <Text style={styles.tuneButtonText}>Simular afinado</Text>
      </TouchableOpacity>

      {/* Tips */}
      <View style={styles.tips}>
        <Ionicons name="information-circle" size={20} color={COLORS.textMuted} />
        <Text style={styles.tipsText}>
          Toca la cuerda y observa el indicador. Verde = afinado.
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
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  
  // Tuning selector
  tuningSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  tuningButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
  },
  tuningButtonActive: {
    backgroundColor: COLORS.primary,
  },
  tuningButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tuningButtonTextActive: {
    color: COLORS.text,
  },
  
  // Note display
  noteDisplay: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  stringLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  noteLetter: {
    fontSize: 120,
    fontWeight: '900',
    lineHeight: 140,
  },
  statusText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    marginTop: SPACING.sm,
  },
  
  // Indicator
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  indicatorLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    width: 40,
    textAlign: 'center',
  },
  indicatorBar: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  centerMarker: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: COLORS.text,
    marginLeft: -1.5,
    zIndex: 2,
  },
  indicator: {
    position: 'absolute',
    top: 5,
    bottom: 5,
    width: 8,
    borderRadius: 4,
    marginLeft: -4,
    zIndex: 3,
  },
  zone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  zoneLeft: {
    left: 0,
    width: '35%',
  },
  zoneCenter: {
    left: '35%',
    width: '30%',
  },
  zoneRight: {
    right: 0,
    width: '35%',
  },
  
  // String selector
  stringSelector: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  stringSelectorLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  stringButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stringButton: {
    width: 50,
    height: 70,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  stringButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  stringButtonNumber: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  stringButtonNumberActive: {
    color: COLORS.primary,
  },
  stringButtonNote: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  stringButtonNoteActive: {
    color: COLORS.primary,
  },
  
  // Tune button
  tuneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.success,
    marginHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  tuneButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  // Tips
  tips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  tipsText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
});
