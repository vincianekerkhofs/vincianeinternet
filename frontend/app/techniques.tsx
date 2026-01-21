/**
 * GUITAR GUIDE PRO - TECHNIQUE MASTER CLASSES
 * Learning paths for each guitar technique
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import { ALL_TECHNIQUES, LEFT_HAND_TECHNIQUES, RIGHT_HAND_TECHNIQUES, TechniqueDefinition } from '../src/data/techniques';
import { getTechniqueIcon } from '../src/components/TechniqueIcons';
import { getTechniqueMastery, TechniqueMastery } from '../src/utils/techniqueStorage';

const { width } = Dimensions.get('window');

export default function TechniquesScreen() {
  const [selectedHand, setSelectedHand] = useState<'left' | 'right' | 'all'>('all');
  const [masteryData, setMasteryData] = useState<Record<string, TechniqueMastery>>({});

  useEffect(() => {
    loadMasteryData();
  }, []);

  const loadMasteryData = async () => {
    const data = await getTechniqueMastery();
    setMasteryData(data);
  };

  const getTechniques = (): TechniqueDefinition[] => {
    if (selectedHand === 'left') return LEFT_HAND_TECHNIQUES;
    if (selectedHand === 'right') return RIGHT_HAND_TECHNIQUES;
    return ALL_TECHNIQUES;
  };

  const getMasteryLevel = (techniqueId: string): number => {
    return masteryData[techniqueId]?.level || 0;
  };

  const getLevelLabel = (level: number): string => {
    switch (level) {
      case 0: return 'Nuevo';
      case 1: return 'Básico';
      case 2: return 'Intermedio';
      case 3: return 'Avanzado';
      case 4: return 'Dominado';
      default: return 'Nuevo';
    }
  };

  const getLevelColor = (level: number): string => {
    switch (level) {
      case 0: return COLORS.textMuted;
      case 1: return COLORS.warning;
      case 2: return COLORS.secondary;
      case 3: return COLORS.primary;
      case 4: return COLORS.success;
      default: return COLORS.textMuted;
    }
  };

  const renderTechniqueCard = (technique: TechniqueDefinition) => {
    const level = getMasteryLevel(technique.id);
    const levelColor = getLevelColor(level);
    const isMastered = level === 4;

    return (
      <TouchableOpacity
        key={technique.id}
        style={[
          styles.techniqueCard,
          isMastered && styles.masteredCard
        ]}
        onPress={() => router.push({
          pathname: '/technique/[id]',
          params: { id: technique.id }
        } as any)}
      >
        <View style={[styles.iconContainer, { backgroundColor: technique.color + '20' }]}>
          {getTechniqueIcon(technique.id, { size: 32, color: technique.color })}
        </View>
        
        <View style={styles.techniqueInfo}>
          <Text style={styles.techniqueName}>{technique.name}</Text>
          <Text style={styles.techniqueHand}>
            {technique.hand === 'left' ? 'Mano Izquierda' : 'Mano Derecha'}
          </Text>
          
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${level * 25}%`, backgroundColor: levelColor }
                ]} 
              />
            </View>
            <Text style={[styles.levelLabel, { color: levelColor }]}>
              {getLevelLabel(level)}
            </Text>
          </View>
        </View>

        {isMastered ? (
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        )}
      </TouchableOpacity>
    );
  };

  const totalMastered = Object.values(masteryData).filter(m => m.level === 4).length;
  const totalTechniques = ALL_TECHNIQUES.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Técnicas</Text>
          <Text style={styles.subtitle}>
            {totalMastered} de {totalTechniques} dominadas
          </Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, selectedHand === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedHand('all')}
        >
          <Text style={[styles.filterTabText, selectedHand === 'all' && styles.filterTabTextActive]}>
            Todas ({ALL_TECHNIQUES.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedHand === 'left' && styles.filterTabActive]}
          onPress={() => setSelectedHand('left')}
        >
          <Ionicons 
            name="hand-left-outline" 
            size={16} 
            color={selectedHand === 'left' ? COLORS.text : COLORS.textMuted} 
          />
          <Text style={[styles.filterTabText, selectedHand === 'left' && styles.filterTabTextActive]}>
            Izq ({LEFT_HAND_TECHNIQUES.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedHand === 'right' && styles.filterTabActive]}
          onPress={() => setSelectedHand('right')}
        >
          <Ionicons 
            name="hand-right-outline" 
            size={16} 
            color={selectedHand === 'right' ? COLORS.text : COLORS.textMuted} 
          />
          <Text style={[styles.filterTabText, selectedHand === 'right' && styles.filterTabTextActive]}>
            Der ({RIGHT_HAND_TECHNIQUES.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Technique list */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {getTechniques().map(renderTechniqueCard)}
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
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.backgroundCard,
    gap: SPACING.xs,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  techniqueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
  },
  masteredCard: {
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  techniqueInfo: {
    flex: 1,
  },
  techniqueName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  techniqueHand: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  levelLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
    minWidth: 65,
    textAlign: 'right',
  },
});
