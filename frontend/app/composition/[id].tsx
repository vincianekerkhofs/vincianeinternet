import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { getCompositionById, FullNeckComposition } from '../../src/data/solosContent';
import { TechniqueFretboard } from '../../src/components/TechniqueFretboard';
import { DidacticIntroScreen } from '../../src/components/DidacticIntroScreen';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function CompositionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [composition, setComposition] = useState<FullNeckComposition | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentBar, setCurrentBar] = useState(0);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [tempo, setTempo] = useState(70);
  
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const found = getCompositionById(id);
      if (found) {
        setComposition(found);
        setTempo(found.tempo);
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

  // Current section
  const currentSection = composition?.sections[currentSectionIndex];
  const currentSectionNotes = currentSection?.notes || [];

  // Playback logic
  useEffect(() => {
    if (isPlaying && composition && currentSection) {
      const beatDuration = 60000 / tempo;
      const noteInterval = beatDuration / 2;
      
      playbackRef.current = setInterval(() => {
        setCurrentNoteIndex(prev => {
          const currentBarNotes = currentSectionNotes[currentBar];
          if (!currentBarNotes) return 0;
          
          if (prev >= currentBarNotes.length - 1) {
            // Move to next bar
            setCurrentBar(prevBar => {
              if (prevBar >= currentSectionNotes.length - 1) {
                // Move to next section
                setCurrentSectionIndex(prevSection => {
                  if (prevSection >= composition.sections.length - 1) {
                    // End of composition
                    setIsPlaying(false);
                    return 0;
                  }
                  return prevSection + 1;
                });
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
  }, [isPlaying, currentBar, currentSectionIndex, composition, tempo, currentSectionNotes]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSectionIndex(0);
    setCurrentBar(0);
    setCurrentNoteIndex(0);
  };

  const handleSectionSelect = (index: number) => {
    setIsPlaying(false);
    setCurrentSectionIndex(index);
    setCurrentBar(0);
    setCurrentNoteIndex(0);
  };

  if (!composition) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando composición...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Create didactic intro from composition data
  const compIntro = {
    id: composition.id,
    title: composition.title,
    icon: 'map-outline',
    lines: composition.didacticIntro,
  };

  // Calculate fret range for current section
  const sectionNotes = currentSection?.notes.flat() || [];
  const allFrets = sectionNotes.map(n => n.fret);
  const minFret = allFrets.length > 0 ? Math.max(0, Math.min(...allFrets) - 1) : 0;
  const maxFret = allFrets.length > 0 ? Math.max(...allFrets) + 1 : 12;
  const numFrets = Math.min(8, Math.max(5, maxFret - minFret + 1));

  // Calculate total progress
  const totalBars = composition.sections.reduce((acc, s) => acc + s.notes.length, 0);
  const completedBars = composition.sections.slice(0, currentSectionIndex).reduce((acc, s) => acc + s.notes.length, 0) + currentBar;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Didactic Intro Modal */}
      <DidacticIntroScreen
        intro={compIntro}
        visible={showIntro}
        onContinue={() => setShowIntro(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>{composition.title}</Text>
          <Text style={styles.headerSubtitle}>{composition.style}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowIntro(true)} style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Composition Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="speedometer-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{tempo} BPM</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="layers-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{composition.bars} compases</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="map-outline" size={18} color={COLORS.primary} />
              <Text style={styles.infoLabel}>{composition.sections.length} secciones</Text>
            </View>
          </View>
        </View>

        {/* Objective */}
        <View style={styles.objectiveCard}>
          <Ionicons name="compass" size={18} color={COLORS.secondary} />
          <Text style={styles.objectiveText}>{composition.objective}</Text>
        </View>

        {/* Journey Map - Section Selector */}
        <View style={styles.journeySection}>
          <Text style={styles.sectionTitle}>RECORRIDO</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.journeyMap}>
              {composition.sections.map((section, idx) => {
                const isActive = idx === currentSectionIndex;
                const isPast = idx < currentSectionIndex;
                return (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.journeyItem}
                    onPress={() => handleSectionSelect(idx)}
                  >
                    {idx > 0 && (
                      <View style={[styles.journeyLine, isPast && styles.journeyLinePast]} />
                    )}
                    <View style={[
                      styles.journeyDot,
                      isActive && styles.journeyDotActive,
                      isPast && styles.journeyDotPast,
                    ]}>
                      <Text style={[
                        styles.journeyDotText,
                        (isActive || isPast) && styles.journeyDotTextActive,
                      ]}>
                        {idx + 1}
                      </Text>
                    </View>
                    <Text style={[
                      styles.journeyLabel,
                      isActive && styles.journeyLabelActive,
                    ]} numberOfLines={2}>
                      {section.name}
                    </Text>
                    <Text style={styles.journeyPosition}>{section.position}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Current Section Info */}
        {currentSection && (
          <View style={styles.currentSectionCard}>
            <View style={styles.currentSectionHeader}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <Text style={styles.currentSectionName}>{currentSection.name}</Text>
            </View>
            <View style={styles.currentSectionMeta}>
              <Text style={styles.currentSectionPosition}>{currentSection.position}</Text>
              <Text style={styles.currentSectionScale}>{currentSection.scale}</Text>
            </View>
          </View>
        )}

        {/* Fretboard Visualization */}
        {currentSection && currentSectionNotes.length > 0 && (
          <View style={styles.fretboardContainer}>
            <Text style={styles.sectionTitle}>DIAPASÓN</Text>
            <TechniqueFretboard
              notes={currentSectionNotes}
              currentBar={currentBar}
              currentNoteIndex={currentNoteIndex}
              isPlaying={isPlaying}
              startFret={minFret}
              numFrets={numFrets}
              height={300}
              showAllNotes={true}
            />
          </View>
        )}

        {/* Overall Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Progreso total: {Math.round((completedBars / totalBars) * 100)}%
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(completedBars / totalBars) * 100}%` }
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
            <Text style={styles.tempoMarkerText}>Original ({composition.tempo})</Text>
            <Text style={styles.tempoMarkerText}>Rápido</Text>
          </View>
        </View>

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
          style={styles.skipButton}
          onPress={() => {
            if (currentSectionIndex < composition.sections.length - 1) {
              handleSectionSelect(currentSectionIndex + 1);
            }
          }}
        >
          <Ionicons name="play-skip-forward" size={24} color={COLORS.text} />
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
  
  // Objective
  objectiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.secondary + '15',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  objectiveText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  
  // Section title
  sectionTitle: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  
  // Journey Map
  journeySection: {
    marginTop: SPACING.xl,
  },
  journeyMap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
  },
  journeyItem: {
    alignItems: 'center',
    width: 90,
    position: 'relative',
  },
  journeyLine: {
    position: 'absolute',
    top: 18,
    left: -30,
    width: 60,
    height: 3,
    backgroundColor: COLORS.surfaceLight,
  },
  journeyLinePast: {
    backgroundColor: COLORS.primary,
  },
  journeyDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  journeyDotActive: {
    backgroundColor: COLORS.primary,
    transform: [{ scale: 1.1 }],
  },
  journeyDotPast: {
    backgroundColor: COLORS.success,
  },
  journeyDotText: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  journeyDotTextActive: {
    color: COLORS.text,
  },
  journeyLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  journeyLabelActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  journeyPosition: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  
  // Current Section Card
  currentSectionCard: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  currentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  currentSectionName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  currentSectionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentSectionPosition: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  currentSectionScale: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  
  // Fretboard
  fretboardContainer: {
    marginTop: SPACING.xl,
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
  skipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
