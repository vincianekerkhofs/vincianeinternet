/**
 * TECHNIQUE MASTERY SONG SCREEN
 * 
 * La canción final obligatoria para cada técnica.
 * Incluye:
 * - Tablatura completa por secciones
 * - Diapasón animado
 * - Loop por sección
 * - Información musical
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { TechniqueAnimatedFretboardPro } from '../../src/components/TechniqueAnimatedFretboardPro';
import { 
  getMasterySongByTechnique, 
  getDidacticContentByTechnique,
  TechniqueMasterySong,
  SongSection,
  TechniqueDidacticContent,
} from '../../src/data/techniqueMasterySongs';
import { LEFT_HAND_TECHNIQUES, RIGHT_HAND_TECHNIQUES } from '../../src/data/techniques';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================
// SECTION PLAYER COMPONENT
// =============================================

interface SectionPlayerProps {
  section: SongSection;
  isActive: boolean;
  isPlaying: boolean;
  currentBeat: number;
  techniqueColor: string;
  onSelect: () => void;
  onPlayToggle: () => void;
}

const SectionPlayer: React.FC<SectionPlayerProps> = ({
  section,
  isActive,
  isPlaying,
  currentBeat,
  techniqueColor,
  onSelect,
  onPlayToggle,
}) => {
  return (
    <View style={[styles.sectionCard, isActive && { borderColor: techniqueColor, borderWidth: 2 }]}>
      {/* Section Header */}
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={onSelect}
        activeOpacity={0.7}
      >
        <View style={styles.sectionTitleRow}>
          <View style={[styles.sectionBadge, { backgroundColor: techniqueColor }]}>
            <Text style={styles.sectionBadgeText}>{section.id}</Text>
          </View>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionName}>{section.name}</Text>
            <Text style={styles.sectionDescription}>{section.description}</Text>
          </View>
          <View style={styles.sectionMeasures}>
            <Text style={styles.measureText}>c.{section.startMeasure}-{section.endMeasure}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Expanded Content when active */}
      {isActive && (
        <View style={styles.sectionContent}>
          {/* Fretboard */}
          <View style={styles.fretboardWrapper}>
            <TechniqueAnimatedFretboardPro
              path={section.fretboardPath}
              currentBeat={currentBeat}
              isPlaying={isPlaying}
              techniqueColor={techniqueColor}
              mode="guided"
              showTechniqueGlyphs={true}
              showFingerGuides={true}
            />
          </View>
          
          {/* Tab Notation */}
          <View style={styles.tabContainer}>
            <Text style={styles.tabTitle}>Tablatura:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.tabNotation}>{section.tabNotation}</Text>
            </ScrollView>
          </View>
          
          {/* Tips */}
          {section.tips && section.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              {section.tips.map((tip, index) => (
                <View key={index} style={styles.tipRow}>
                  <Ionicons name="bulb-outline" size={14} color={COLORS.warning} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Play Controls */}
          <View style={styles.playControls}>
            <TouchableOpacity 
              style={[styles.playButton, { backgroundColor: techniqueColor }]}
              onPress={onPlayToggle}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={24} 
                color="#FFFFFF" 
              />
              <Text style={styles.playButtonText}>
                {isPlaying ? 'Pausar' : 'Reproducir'} Sección {section.id}
              </Text>
            </TouchableOpacity>
            
            {section.loopable && (
              <View style={styles.loopBadge}>
                <Ionicons name="repeat" size={14} color={COLORS.success} />
                <Text style={styles.loopText}>Loop activo</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export default function TechniqueSongScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // States
  const [activeSection, setActiveSection] = useState<string>('A');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [showFullTab, setShowFullTab] = useState(false);
  
  // Timer ref for playback
  const playbackTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Get data
  const song = getMasterySongByTechnique(id || '');
  const didactic = getDidacticContentByTechnique(id || '');
  const technique = [...LEFT_HAND_TECHNIQUES, ...RIGHT_HAND_TECHNIQUES].find(t => t.id === id);
  
  // Current active section object
  const currentSection = useMemo(() => {
    return song?.sections.find(s => s.id === activeSection) || song?.sections[0];
  }, [song, activeSection]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, []);
  
  // Playback logic
  useEffect(() => {
    if (isPlaying && currentSection) {
      const bpm = song?.tempo || 72;
      const msPerBeat = (60 / bpm) * 1000;
      const beatsPerLoop = currentSection.fretboardPath.beatsPerLoop || 8;
      
      playbackTimer.current = setInterval(() => {
        setCurrentBeat(prev => {
          const next = prev + 0.5;
          if (next >= beatsPerLoop) {
            return 0; // Loop
          }
          return next;
        });
      }, msPerBeat / 2);
      
      return () => {
        if (playbackTimer.current) {
          clearInterval(playbackTimer.current);
        }
      };
    }
  }, [isPlaying, currentSection, song?.tempo]);
  
  // Handlers
  const handleSectionSelect = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);
  
  const handlePlayToggle = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  // Early return if no data
  if (!song || !technique) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Canción no encontrada' }} />
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Canción no disponible</Text>
          <Text style={styles.emptyText}>
            Esta técnica aún no tiene canción final.
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: song.title,
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Song Header */}
        <View style={styles.songHeader}>
          <View style={[styles.songIcon, { backgroundColor: technique.color + '20' }]}>
            <Ionicons name="musical-notes" size={32} color={technique.color} />
          </View>
          <Text style={styles.songTitle}>{song.title}</Text>
          {song.subtitle && (
            <Text style={styles.songSubtitle}>{song.subtitle}</Text>
          )}
          
          {/* Song Meta */}
          <View style={styles.songMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="musical-note-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{song.style}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="speedometer-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{song.tempo} BPM</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="grid-outline" size={16} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{song.totalMeasures} compases</Text>
            </View>
          </View>
          
          <View style={styles.tonalityBadge}>
            <Text style={styles.tonalityText}>{song.tonality}</Text>
          </View>
        </View>
        
        {/* Musical Goal */}
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Ionicons name="trophy-outline" size={20} color={technique.color} />
            <Text style={styles.goalTitle}>Objetivo Musical</Text>
          </View>
          <Text style={styles.goalText}>{song.musicalGoal}</Text>
          <Text style={styles.applicationText}>
            <Text style={styles.applicationLabel}>Aplicación: </Text>
            {song.techniqueApplication}
          </Text>
        </View>
        
        {/* Performance Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Consejos de Interpretación</Text>
          {song.performanceTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={[styles.tipNumber, { color: technique.color }]}>{index + 1}</Text>
              <Text style={styles.tipItemText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        {/* Sections */}
        <View style={styles.sectionsContainer}>
          <Text style={styles.sectionsTitle}>Secciones</Text>
          <Text style={styles.sectionsSubtitle}>
            Toca en cada sección para practicarla con loop
          </Text>
          
          {song.sections.map((section) => (
            <SectionPlayer
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
              isPlaying={isPlaying && activeSection === section.id}
              currentBeat={currentBeat}
              techniqueColor={technique.color}
              onSelect={() => handleSectionSelect(section.id)}
              onPlayToggle={handlePlayToggle}
            />
          ))}
        </View>
        
        {/* Full Tab Toggle */}
        <TouchableOpacity 
          style={styles.fullTabToggle}
          onPress={() => setShowFullTab(!showFullTab)}
        >
          <Ionicons 
            name={showFullTab ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={technique.color} 
          />
          <Text style={[styles.fullTabToggleText, { color: technique.color }]}>
            {showFullTab ? 'Ocultar' : 'Ver'} Tablatura Completa
          </Text>
        </TouchableOpacity>
        
        {showFullTab && (
          <View style={styles.fullTabContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <Text style={styles.fullTabNotation}>{song.fullTabNotation}</Text>
            </ScrollView>
          </View>
        )}
        
        {/* Didactic Content */}
        {didactic && (
          <View style={styles.didacticSection}>
            <Text style={styles.didacticTitle}>Contenido Didáctico</Text>
            
            {/* Summary */}
            <View style={styles.didacticCard}>
              <View style={styles.didacticHeader}>
                <Ionicons name="book-outline" size={18} color={technique.color} />
                <Text style={styles.didacticCardTitle}>Resumen</Text>
              </View>
              <Text style={styles.didacticText}>{didactic.summary.whatYouLearn}</Text>
              <Text style={styles.didacticSubtext}>
                <Text style={styles.boldText}>Propósito musical: </Text>
                {didactic.summary.musicalPurpose}
              </Text>
              <View style={styles.stylesRow}>
                {didactic.summary.stylesUsed.map((style, index) => (
                  <View key={index} style={styles.styleBadge}>
                    <Text style={styles.styleBadgeText}>{style}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Expert Tip */}
            <View style={[styles.didacticCard, styles.expertCard]}>
              <View style={styles.didacticHeader}>
                <Ionicons name="star" size={18} color={COLORS.warning} />
                <Text style={styles.didacticCardTitle}>Consejo de Experto</Text>
              </View>
              <Text style={styles.expertTip}>{didactic.technicalExplanation.expertTip}</Text>
            </View>
          </View>
        )}
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// =============================================
// STYLES
// =============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  backButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Song Header
  songHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  songIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  songTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  songSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  songMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  tonalityBadge: {
    marginTop: SPACING.sm,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
  },
  tonalityText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  
  // Goal Card
  goalCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  goalTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  goalText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  applicationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  applicationLabel: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  
  // Tips Card
  tipsCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  tipsTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  tipNumber: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    width: 20,
  },
  tipItemText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  // Sections
  sectionsContainer: {
    marginBottom: SPACING.lg,
  },
  sectionsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionsSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  
  // Section Card
  sectionCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionBadgeText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionDescription: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  sectionMeasures: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  measureText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  
  // Section Content
  sectionContent: {
    padding: SPACING.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  fretboardWrapper: {
    marginBottom: SPACING.md,
  },
  tabContainer: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tabTitle: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  tabNotation: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 16,
  },
  tipsContainer: {
    marginBottom: SPACING.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    flex: 1,
  },
  
  // Play Controls
  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  playButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  playButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: COLORS.success + '20',
    borderRadius: BORDER_RADIUS.sm,
  },
  loopText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
  },
  
  // Full Tab Toggle
  fullTabToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
  },
  fullTabToggleText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
  },
  fullTabContainer: {
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  fullTabNotation: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 14,
  },
  
  // Didactic Section
  didacticSection: {
    marginTop: SPACING.md,
  },
  didacticTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  didacticCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  expertCard: {
    backgroundColor: COLORS.warning + '10',
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  didacticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  didacticCardTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  didacticText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  didacticSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
  stylesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: SPACING.sm,
  },
  styleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  styleBadgeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  expertTip: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
});
