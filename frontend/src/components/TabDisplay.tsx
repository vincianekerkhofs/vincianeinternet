import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface TabNote {
  string: number;
  fret: number | string;
  beat: number;
  direction?: 'up' | 'down';
  technique?: string;
}

interface TabDisplayProps {
  notes: TabNote[];
  currentBeat?: number;
  timeSignature?: string;
}

export const TabDisplay: React.FC<TabDisplayProps> = ({
  notes = [],
  currentBeat = 0,
  timeSignature = '4/4',
}) => {
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  const beatsPerMeasure = parseInt(timeSignature.split('/')[0]) || 4;
  
  // Group notes by beat
  const getNoteAtPosition = (stringIndex: number, beat: number): TabNote | null => {
    return notes.find(n => n.string === stringIndex && Math.floor(n.beat) === beat) || null;
  };

  const renderString = (stringIndex: number, stringName: string) => {
    const positions = [];
    for (let beat = 1; beat <= beatsPerMeasure * 2; beat++) {
      const note = getNoteAtPosition(stringIndex, beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat;
      
      positions.push(
        <View 
          key={`${stringIndex}-${beat}`} 
          style={[
            styles.tabPosition,
            isCurrentBeat && styles.tabPositionActive,
          ]}
        >
          {note ? (
            <Text style={[
              styles.tabNote,
              isCurrentBeat && styles.tabNoteActive,
            ]}>
              {note.fret}
            </Text>
          ) : (
            <Text style={styles.tabLine}>-</Text>
          )}
        </View>
      );
    }

    return (
      <View key={stringIndex} style={styles.stringRow}>
        <Text style={styles.stringName}>{stringName}</Text>
        <View style={styles.stringLine}>
          <Text style={styles.tabSeparator}>|</Text>
          {positions}
          <Text style={styles.tabSeparator}>|</Text>
        </View>
      </View>
    );
  };

  // Render picking directions
  const renderPickingDirection = () => {
    const directions = [];
    for (let beat = 1; beat <= beatsPerMeasure * 2; beat++) {
      const noteWithDirection = notes.find(n => Math.floor(n.beat) === beat && n.direction);
      directions.push(
        <View key={beat} style={styles.tabPosition}>
          <Text style={styles.pickingDirection}>
            {noteWithDirection?.direction === 'down' ? '↓' : 
             noteWithDirection?.direction === 'up' ? '↑' : ' '}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.stringRow}>
        <Text style={styles.stringName}></Text>
        <View style={styles.stringLine}>
          <Text style={styles.tabSeparator}> </Text>
          {directions}
          <Text style={styles.tabSeparator}> </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabContainer}>
          {renderPickingDirection()}
          {stringNames.map((name, index) => renderString(index, name))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tabContainer: {
    fontFamily: 'monospace',
  },
  stringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  stringName: {
    width: 20,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stringLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabPosition: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPositionActive: {
    backgroundColor: COLORS.primary + '30',
    borderRadius: 4,
  },
  tabNote: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  tabNoteActive: {
    color: COLORS.text,
  },
  tabLine: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  tabSeparator: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
    marginHorizontal: 4,
  },
  pickingDirection: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.secondary,
    fontWeight: '700',
  },
});
