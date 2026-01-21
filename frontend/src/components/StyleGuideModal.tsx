import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { StyleGuide as StyleGuideType } from '../data/didacticContent';

interface Props {
  guide: StyleGuideType;
  visible: boolean;
  onContinue: () => void;
}

export const StyleGuideModal: React.FC<Props> = ({ guide, visible, onContinue }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onContinue}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header with icon */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name={guide.icon as any} size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>{guide.name}</Text>
            </View>

            {/* What defines it */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>¿Qué lo define?</Text>
              <Text style={styles.definitionText}>{guide.whatDefinesIt}</Text>
            </View>

            {/* Focus on */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Enfócate en:</Text>
              {guide.focusOn.map((item, index) => (
                <View key={index} style={styles.focusItem}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                  <Text style={styles.focusText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Don't overthink */}
            <View style={styles.tipBox}>
              <Ionicons name="bulb-outline" size={24} color={COLORS.warning} />
              <Text style={styles.tipText}>{guide.dontOverthink}</Text>
            </View>

            {/* Key techniques */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Técnicas clave:</Text>
              <View style={styles.techniquesRow}>
                {guide.keyTechniques.map((tech, index) => (
                  <View key={index} style={styles.techBadge}>
                    <Text style={styles.techText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>¡Vamos a tocar!</Text>
            <Ionicons name="musical-notes" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  definitionText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  focusText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    backgroundColor: COLORS.warning + '15',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  tipText: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.warning,
    fontWeight: '600',
    lineHeight: 22,
  },
  techniquesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  techBadge: {
    backgroundColor: COLORS.primary + '30',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  techText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginTop: SPACING.lg,
  },
  continueButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
});
