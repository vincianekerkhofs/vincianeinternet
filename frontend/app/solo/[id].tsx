import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getSoloById, GuidedSolo } from '../../src/data/solosContent';
import { TechniqueFretboard } from '../../src/components/TechniqueFretboard';
import { DidacticIntroScreen } from '../../src/components/DidacticIntroScreen';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function SoloDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [solo, setSolo] = useState<GuidedSolo | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBar, setCurrentBar] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(70);
  
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const foundSolo = getSoloById(id);
      if (foundSolo) {
        setSolo(foundSolo);
        setTempo(foundSolo.tempo);
      }
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
    };
  }, []);

  // Playback logic
  useEffect(() => {
    if (isPlaying && solo) {
      // Calculate interval based on tempo and note durations
      // Simplified: each note gets equal time based on tempo
      const beatDuration = 60000 / tempo; // ms per beat
      const noteInterval = beatDuration / 2; // Eighth note default
      
      playbackRef.current = setInterval(() => {
        setCurrentNoteIndex(prev => {
          const currentBarNotes = solo.notes[currentBar];
          if (!currentBarNotes) return 0;
          
          if (prev >= currentBarNotes.length - 1) {
            // Move to next bar
            setCurrentBar(prevBar => {
              if (prevBar >= solo.notes.length - 1) {
                // End of solo
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
  }, [isPlaying, currentBar, solo, tempo]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Start from beginning if at end
      if (solo && currentBar >= solo.notes.length - 1 && currentNoteIndex >= (solo.notes[currentBar]?.length || 0) - 1) {
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

  if (!solo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando solo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Create didactic intro from solo data
  const soloIntro = {
    id: solo.id,
    title: solo.title,
    icon: 'musical-notes-outline',
    lines: solo.didacticIntro,
  };

  // Calculate fret range from notes
  const allFrets = solo.notes.flat().map(n => n.fret);
  const minFret = Math.max(0, Math.min(...allFrets) - 1);
  const maxFret = Math.max(...allFrets) + 1;
  const numFrets = Math.max(5, maxFret - minFret + 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Solo Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="speedometer-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{tempo} BPM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="musical-notes" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{solo.scale}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="layers-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{solo.bars} compases</Text>
            </View>
          </View>
          
          {/* Positions used */}
          {solo.positions.length > 0 && (
            <View style={styles.positionsContainer}>
              <Text style={styles.positionsLabel}>Posiciones:</Text>
              <View style={styles.positionBadges}>
                {solo.positions.map(pos => (
                  <View key={pos} style={styles.positionBadge}>
                    <Text style={styles.positionBadgeText}>Caja {pos}</Text>
                  </View>
                ))}
              </View>
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

        {/* Progress Indicator */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Compás {currentBar + 1} de {solo.notes.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentBar + 1) / solo.notes.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Tempo Control */}
        <View style={styles.tempoSection}>
          <Text style={styles.tempoLabel}>Tempo: {tempo} BPM</Text>
          <Slider
            style={styles.tempoSlider}
            minimumValue={40}
            maximumValue={120}
            value={tempo}
            onValueChange={setTempo}
            step={5}
            minimumTrackTintColor={COLORS.primary}
            maximumTrackTintColor={COLORS.surfaceLight}
            thumbTintColor={COLORS.primary}
          />
          <View style={styles.tempoMarkers}>
            <Text style={styles.tempoMarkerText}>Lento</Text>
            <Text style={styles.tempoMarkerText}>Original ({solo.tempo})</Text>
            <Text style={styles.tempoMarkerText}>Rápido</Text>
          </View>
        </View>

        {/* Transition Points (if any) */}
        {solo.transitionPoints && solo.transitionPoints.length > 0 && (
          <View style={styles.transitionsSection}>
            <Text style={styles.sectionTitle}>TRANSICIONES DE ESCALA</Text>
            {solo.transitionPoints.map((tp, idx) => (
              <View key={idx} style={styles.transitionCard}>
                <View style={styles.transitionHeader}>
                  <Ionicons name="swap-horizontal" size={18} color={COLORS.info} />
                  <Text style={styles.transitionBar}>Compás {tp.bar}</Text>
                </View>
                <Text style={styles.transitionScales}>
                  {tp.fromScale} → {tp.toScale}
                </Text>
                <Text style={styles.transitionExplanation}>{tp.explanation}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Playback Controls */}
      <View style={styles.playbackControls}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="refresh" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={32} 
            color={COLORS.text} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loopButton}
          onPress={() => {
            // Future: toggle loop mode
          }}
        >
          <Ionicons name="repeat" size={24} color={COLORS.textMuted} />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
  },
  
  // Header
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
  },
  helpButton: {
    padding: SPACING.sm,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  
  // Info Card
  infoCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  positionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  positionsLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginRight: SPACING.sm,
  },
  positionBadges: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  positionBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  positionBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: '600',
  },
  
  // Objective
  objectiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  objectiveText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  
  // Fretboard
  fretboardContainer: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  
  // Progress
  progressSection: {
    marginTop: SPACING.lg,
  },
  progressLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  
  // Tempo
  tempoSection: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tempoLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  tempoSlider: {
    width: '100%',
    height: 40,
  },
  tempoMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempoMarkerText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  
  // Transitions
  transitionsSection: {
    marginTop: SPACING.xl,
  },
  transitionCard: {
    backgroundColor: COLORS.info + '15',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  transitionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  transitionBar: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.info,
    fontWeight: '600',
  },
  transitionScales: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  transitionExplanation: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  // Playback Controls
  playbackControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
    backgroundColor: COLORS.backgroundCard,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loopButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
