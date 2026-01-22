/**
 * GUITAR GUIDE PRO - SOLO DETAIL SCREEN
 * Shows guided solo with fretboard visualization and playback
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getSoloById, GuidedSolo } from '../../src/data/solosContent';
import { TechniqueFretboard } from '../../src/components/TechniqueFretboard';
import { DidacticIntroScreen } from '../../src/components/DidacticIntroScreen';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

// Separate component for the main content to avoid hook issues
const SoloContent: React.FC<{ solo: GuidedSolo }> = ({ solo }) => {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBar, setCurrentBar] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(solo.tempo);
  
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    };
  }, []);

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      const beatDuration = 60000 / tempo;
      const noteInterval = beatDuration / 2;
      
      playbackRef.current = setInterval(() => {
        setCurrentNoteIndex(prev => {
          const currentBarNotes = solo.notes[currentBar];
          if (!currentBarNotes) return 0;
          
          if (prev >= currentBarNotes.length - 1) {
            setCurrentBar(prevBar => {
              if (prevBar >= solo.notes.length - 1) {
                setIsPlaying(false);
                return 0;
              }
              return prevBar + 1;
            });
            return 0;
          }
          return prev + 1;
        });
      }, noteInterval);
    } else if (playbackRef.current) {
      clearInterval(playbackRef.current);
    }
    
    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    };
  }, [isPlaying, currentBar, tempo, solo.notes]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      if (currentBar >= solo.notes.length - 1 && currentNoteIndex >= (solo.notes[currentBar]?.length || 0) - 1) {
        setCurrentBar(0);
        setCurrentNoteIndex(0);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentBar(0);
    setCurrentNoteIndex(0);
  };

  // Calculate fret range from notes
  const allFrets = solo.notes.flat().map(n => n.fret);
  const minFret = Math.max(0, Math.min(...allFrets) - 1);
  const maxFret = Math.max(...allFrets) + 1;
  const numFrets = Math.max(5, maxFret - minFret + 1);

  const soloIntro = {
    id: solo.id,
    title: solo.title,
    icon: 'musical-notes-outline',
    lines: solo.didacticIntro,
  };

  return (
    <>
      {/* Didactic Intro Modal */}
      <DidacticIntroScreen
        intro={soloIntro}
        visible={showIntro}
        onContinue={() => setShowIntro(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{solo.title}</Text>
          <Text style={styles.headerSubtitle}>{solo.style}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowIntro(true)} style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key & Scale Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Ionicons name="musical-note" size={14} color={COLORS.primary} />
            <Text style={styles.infoText}>{solo.key}</Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons name="layers" size={14} color={COLORS.secondary} />
            <Text style={styles.infoText}>{solo.scale}</Text>
          </View>
          {solo.positions && solo.positions.length > 0 && (
            <View style={styles.infoBadge}>
              <Ionicons name="navigate" size={14} color={COLORS.warning} />
              <Text style={styles.infoText}>{solo.positions.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* Objective */}
        <View style={styles.objectiveCard}>
          <Ionicons name="flag" size={18} color={COLORS.success} />
          <Text style={styles.objectiveText}>{solo.objective}</Text>
        </View>

        {/* Fretboard Visualization */}
        <View style={styles.fretboardContainer}>
          <Text style={styles.sectionTitle}>DIAPASÓN</Text>
          <TechniqueFretboard
            notes={solo.notes}
            currentBar={currentBar}
            currentNoteIndex={currentNoteIndex}
            isPlaying={isPlaying}
            startFret={minFret}
            numFrets={numFrets}
            height={300}
            showAllNotes={true}
          />
        </View>

        {/* Bar Counter */}
        <View style={styles.barCounter}>
          <Text style={styles.barText}>
            Compás {currentBar + 1} de {solo.notes.length}
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
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
          
          <View style={styles.tempoContainer}>
            <Text style={styles.tempoValue}>{tempo}</Text>
            <Text style={styles.tempoLabel}>BPM</Text>
          </View>
        </View>

        {/* Tempo Slider */}
        <View style={styles.tempoSliderContainer}>
          <Text style={styles.tempoSliderLabel}>40</Text>
          <Slider
            style={styles.tempoSlider}
            minimumValue={40}
            maximumValue={180}
            value={tempo}
            onValueChange={(value) => setTempo(Math.round(value))}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.surfaceLight}
            thumbTintColor={COLORS.primary}
          />
          <Text style={styles.tempoSliderLabel}>180</Text>
        </View>

        {/* Tips Section */}
        {solo.tips && solo.tips.length > 0 && (
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>CONSEJOS</Text>
            {solo.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Ionicons name="bulb-outline" size={16} color={COLORS.warning} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};

// Main screen component
export default function SoloDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [solo, setSolo] = useState<GuidedSolo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundSolo = getSoloById(id);
      setSolo(foundSolo || null);
    }
    setLoading(false);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando solo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Not found state
  if (!solo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.loadingText}>Solo no encontrado</Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main content - rendered in separate component to maintain hook consistency
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SoloContent solo={solo} />
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
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  backButtonLarge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  backButtonText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerCenter: {
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
  },
  helpButton: {
    padding: SPACING.xs,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.xs,
  },
  infoText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  objectiveCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.success + '15',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  objectiveText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    lineHeight: 20,
  },
  fretboardContainer: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    letterSpacing: 1,
  },
  barCounter: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  barText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginBottom: SPACING.md,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
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
  tempoContainer: {
    alignItems: 'center',
    minWidth: 48,
  },
  tempoValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  tempoLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  tempoSliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  tempoSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: SPACING.sm,
  },
  tempoSliderLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    minWidth: 30,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
