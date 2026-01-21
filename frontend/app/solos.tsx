import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { DidacticIntroScreen } from '../src/components/DidacticIntroScreen';
import { DIDACTIC_INTROS } from '../src/data/didacticContent';
import { GUIDED_SOLOS, FULL_NECK_COMPOSITIONS, GuidedSolo, FullNeckComposition } from '../src/data/solosContent';

const { width } = Dimensions.get('window');

export default function SolosScreen() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'solos' | 'compositions'>('solos');

  const renderSoloCard = (solo: GuidedSolo) => (
    <TouchableOpacity 
      key={solo.id} 
      style={styles.soloCard}
      onPress={() => router.push(`/solo/${solo.id}` as any)}
    >
      <View style={styles.soloHeader}>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {solo.difficulty === 'beginner' ? 'Principiante' : 
             solo.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
          </Text>
        </View>
        <Text style={styles.soloTempo}>{solo.tempo} BPM</Text>
      </View>
      
      <Text style={styles.soloTitle}>{solo.title}</Text>
      <Text style={styles.soloStyle}>{solo.style}</Text>
      
      <Text style={styles.soloObjective}>{solo.objective}</Text>
      
      <View style={styles.soloMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="musical-notes" size={16} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{solo.scale}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="layers-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{solo.bars} compases</Text>
        </View>
      </View>
      
      {solo.positions.length > 1 && (
        <View style={styles.positionsRow}>
          <Text style={styles.positionsLabel}>Posiciones:</Text>
          {solo.positions.map(pos => (
            <View key={pos} style={styles.positionBadge}>
              <Text style={styles.positionText}>Caja {pos}</Text>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.startButton}>
        <Text style={styles.startButtonText}>Comenzar</Text>
        <Ionicons name="play" size={18} color={COLORS.text} />
      </View>
    </TouchableOpacity>
  );

  const renderCompositionCard = (comp: FullNeckComposition) => (
    <TouchableOpacity 
      key={comp.id} 
      style={styles.compositionCard}
      onPress={() => router.push(`/composition/${comp.id}` as any)}
    >
      <View style={styles.compositionHeader}>
        <Ionicons name="map-outline" size={24} color={COLORS.primary} />
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {comp.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.compositionTitle}>{comp.title}</Text>
      <Text style={styles.compositionStyle}>{comp.style}</Text>
      
      <Text style={styles.compositionObjective}>{comp.objective}</Text>
      
      {/* Sections preview */}
      <View style={styles.sectionsPreview}>
        <Text style={styles.sectionsLabel}>Recorrido:</Text>
        {comp.sections.map((section, idx) => (
          <View key={idx} style={styles.sectionItem}>
            <View style={[styles.sectionDot, { backgroundColor: idx === 0 ? COLORS.success : idx === comp.sections.length - 1 ? COLORS.primary : COLORS.textMuted }]} />
            <Text style={styles.sectionName}>{section.name}</Text>
            <Text style={styles.sectionPosition}>{section.position}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.startButton}>
        <Text style={styles.startButtonText}>Explorar</Text>
        <Ionicons name="compass" size={18} color={COLORS.text} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Didactic Intro */}
      <DidacticIntroScreen
        intro={DIDACTIC_INTROS.solos}
        visible={showIntro}
        onContinue={() => setShowIntro(false)}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solos y Composición</Text>
        <TouchableOpacity onPress={() => setShowIntro(true)} style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={24} color={COLORS.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Tab selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'solos' && styles.tabActive]}
          onPress={() => setSelectedTab('solos')}
        >
          <Ionicons 
            name="musical-note" 
            size={20} 
            color={selectedTab === 'solos' ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.tabText, selectedTab === 'solos' && styles.tabTextActive]}>
            Solos Guiados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'compositions' && styles.tabActive]}
          onPress={() => setSelectedTab('compositions')}
        >
          <Ionicons 
            name="map" 
            size={20} 
            color={selectedTab === 'compositions' ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[styles.tabText, selectedTab === 'compositions' && styles.tabTextActive]}>
            Composiciones
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'solos' ? (
          <>
            {/* Intro text */}
            <View style={styles.introCard}>
              <Ionicons name="information-circle" size={24} color={COLORS.primary} />
              <Text style={styles.introText}>
                Los solos guiados te enseñan a moverte por el mástil. 
                Todas las notas se muestran con su digitación.
              </Text>
            </View>

            {/* Solo cards */}
            {GUIDED_SOLOS.map(renderSoloCard)}
          </>
        ) : (
          <>
            {/* Intro text */}
            <View style={styles.introCard}>
              <Ionicons name="compass" size={24} color={COLORS.primary} />
              <Text style={styles.introText}>
                Las composiciones te llevan desde trastes bajos hasta altos y de vuelta. 
                Aprende a ver el mástil como un todo.
              </Text>
            </View>

            {/* Composition cards */}
            {FULL_NECK_COMPOSITIONS.map(renderCompositionCard)}
          </>
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
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  helpButton: {
    padding: SPACING.sm,
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.md,
  },
  introText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  
  // Solo card
  soloCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  soloHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  difficultyBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  difficultyText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  soloTempo: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  soloTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  soloStyle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  soloObjective: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  soloMeta: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  positionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  positionsLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  positionBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  positionText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: '600',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.sm,
  },
  startButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  
  // Composition card
  compositionCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  compositionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  compositionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 2,
  },
  compositionStyle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  compositionObjective: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  sectionsPreview: {
    marginBottom: SPACING.md,
  },
  sectionsLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 4,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionName: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  sectionPosition: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});
