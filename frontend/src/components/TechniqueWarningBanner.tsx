/**
 * GUITAR GUIDE PRO - TECHNIQUE WARNING BANNER
 * Shows when a solo contains unmastered techniques
 * Non-blocking - just a suggestion
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { getTechniqueById, mapSoloTechniqueToId } from '../data/techniques';
import { getTechniqueIcon } from './TechniqueIcons';
import { checkSoloTechniques } from '../utils/techniqueStorage';

interface Props {
  techniques: string[]; // Solo technique names like 'bend', 'slide', etc.
}

export const TechniqueWarningBanner: React.FC<Props> = ({ techniques }) => {
  const [unmastered, setUnmastered] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [animValue] = useState(new Animated.Value(0));

  useEffect(() => {
    checkTechniques();
  }, [techniques]);

  const checkTechniques = async () => {
    // Convert solo techniques to technique IDs
    const techniqueIds = techniques
      .map(t => mapSoloTechniqueToId(t))
      .filter(Boolean) as string[];
    
    const result = await checkSoloTechniques(techniqueIds);
    setUnmastered(result.unmastered);
    
    // Animate in if there are unmastered techniques
    if (result.unmastered.length > 0) {
      Animated.spring(animValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  if (unmastered.length === 0) return null;

  const handlePracticeTechnique = (techniqueId: string) => {
    router.push({
      pathname: '/technique/[id]',
      params: { id: techniqueId }
    } as any);
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: animValue,
          transform: [{
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          }],
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <Ionicons name="bulb-outline" size={18} color={COLORS.warning} />
          <Text style={styles.headerText}>
            {unmastered.length === 1 
              ? 'Este solo usa una técnica nueva'
              : `Este solo usa ${unmastered.length} técnicas nuevas`
            }
          </Text>
        </View>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={18} 
          color={COLORS.textMuted} 
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.suggestion}>Practica recomendada:</Text>
          
          {unmastered.map(techniqueId => {
            const technique = getTechniqueById(techniqueId);
            if (!technique) return null;
            
            return (
              <TouchableOpacity
                key={techniqueId}
                style={styles.techniqueRow}
                onPress={() => handlePracticeTechnique(techniqueId)}
              >
                <View style={[styles.iconContainer, { backgroundColor: technique.color + '20' }]}>
                  {getTechniqueIcon(techniqueId, { size: 20, color: technique.color })}
                </View>
                <View style={styles.techniqueInfo}>
                  <Text style={styles.techniqueName}>{technique.name}</Text>
                  <Text style={styles.techniqueHint}>Toca para aprender</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            );
          })}

          <Text style={styles.disclaimer}>
            Puedes continuar sin dominar estas técnicas
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.warning,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  suggestion: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  techniqueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  techniqueInfo: {
    flex: 1,
  },
  techniqueName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  techniqueHint: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  disclaimer: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.sm,
    fontStyle: 'italic',
  },
});
