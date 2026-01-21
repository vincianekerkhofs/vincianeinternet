import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface TabNote {
  stringIndex: number;  // 0=high e, 5=low E
  fret: number | null;  // null for muted (X)
  startBeat: number;    // 1-based beat position
  duration?: number;    // in beats
  direction?: 'up' | 'down';
  technique?: string;   // H, P, S, B, etc.
  isMute?: boolean;
}

interface TabDisplayProps {
  notes: TabNote[];
  currentBeat: number;  // Current playback position (1-based)
  totalBeats?: number;
  timeSignature?: string;
  isPlaying?: boolean;
}

export const TabDisplay: React.FC<TabDisplayProps> = ({
  notes = [],
  currentBeat = 1,
  totalBeats = 8,
  timeSignature = '4/4',
  isPlaying = false,
}) => {
  // Standard guitar string order: e B G D A E (high to low, displayed top to bottom)
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  
  // Get note at a specific position
  const getNoteAtPosition = (stringIndex: number, beat: number): TabNote | null => {
    return notes.find(n => 
      n.stringIndex === stringIndex && 
      Math.floor(n.startBeat) === beat
    ) || null;
  };

  // Get picking direction at beat
  const getDirectionAtBeat = (beat: number): string | null => {
    const noteWithDirection = notes.find(n => 
      Math.floor(n.startBeat) === beat && n.direction
    );
    if (noteWithDirection?.direction === 'down') return '↓';
    if (noteWithDirection?.direction === 'up') return '↑';
    return null;
  };

  // Render a single string row
  const renderString = (stringIndex: number, stringName: string) => {
    const positions = [];
    
    for (let beat = 1; beat <= totalBeats; beat++) {
      const note = getNoteAtPosition(stringIndex, beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      const isPastBeat = currentBeat > beat && isPlaying;
      
      let displayValue = '-';
      let hasNote = false;
      
      if (note) {
        hasNote = true;
        if (note.isMute || note.fret === null) {
          displayValue = 'x';
        } else {
          displayValue = String(note.fret);
        }
      }
      
      positions.push(
        <View 
          key={`${stringIndex}-${beat}`} 
          style={[
            styles.tabPosition,
            isCurrentBeat && styles.tabPositionActive,
            isPastBeat && hasNote && styles.tabPositionPast,
          ]}
        >
          <Text style={[
            styles.tabNote,
            hasNote && styles.tabNoteWithValue,
            isCurrentBeat && hasNote && styles.tabNoteActive,
            isPastBeat && hasNote && styles.tabNotePast,
            !hasNote && styles.tabLine,
          ]}>
            {displayValue}
          </Text>
          {/* Technique marker */}
          {note?.technique && (
            <Text style={styles.techniqueMarker}>{note.technique}</Text>
          )}
        </View>
      );
    }

    return (
      <View key={stringIndex} style={styles.stringRow}>
        <Text style={[
          styles.stringName,
          notes.some(n => n.stringIndex === stringIndex && Math.floor(n.startBeat) === Math.floor(currentBeat)) && 
          isPlaying && styles.stringNameActive
        ]}>
          {stringName}
        </Text>
        <View style={styles.stringLine}>
          <Text style={styles.tabSeparator}>|</Text>
          {positions}
          <Text style={styles.tabSeparator}>|</Text>
        </View>
      </View>
    );
  };

  // Render picking direction row
  const renderPickingDirections = () => {
    const directions = [];
    
    for (let beat = 1; beat <= totalBeats; beat++) {
      const direction = getDirectionAtBeat(beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      
      directions.push(
        <View key={beat} style={styles.tabPosition}>
          <Text style={[
            styles.pickingDirection,
            isCurrentBeat && styles.pickingDirectionActive,
          ]}>
            {direction || ' '}
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

  // Render beat numbers
  const renderBeatNumbers = () => {
    const beats = [];
    
    for (let beat = 1; beat <= totalBeats; beat++) {
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      
      beats.push(
        <View key={beat} style={styles.tabPosition}>
          <Text style={[
            styles.beatNumber,
            isCurrentBeat && styles.beatNumberActive,
          ]}>
            {beat}
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.stringRow}>
        <Text style={styles.stringName}></Text>
        <View style={styles.stringLine}>
          <Text style={styles.tabSeparator}> </Text>
          {beats}
          <Text style={styles.tabSeparator}> </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabContainer}>
          {renderBeatNumbers()}
          {renderPickingDirections()}
          {stringNames.map((name, index) => renderString(index, name))}
        </View>
      </ScrollView>
      
      {/* Playback indicator */}
      {isPlaying && (
        <View style={styles.playbackIndicator}>
          <View style={[styles.playbackDot, { left: `${((currentBeat - 1) / totalBeats) * 100}%` }]} />
        </View>
      )}
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
    minWidth: '100%',
  },
  stringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 26,
  },
  stringName: {
    width: 20,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stringNameActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  stringLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabPosition: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  tabPositionActive: {
    backgroundColor: COLORS.primary,
  },
  tabPositionPast: {
    backgroundColor: COLORS.success + '30',
  },
  tabNote: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  tabNoteWithValue: {
    color: COLORS.primary,
  },
  tabNoteActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  tabNotePast: {
    color: COLORS.success,
  },
  tabLine: {
    color: COLORS.textMuted,
  },
  tabSeparator: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    marginHorizontal: 4,
  },
  techniqueMarker: {
    position: 'absolute',
    top: -8,
    fontSize: 8,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  pickingDirection: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  pickingDirectionActive: {
    color: COLORS.secondary,
  },
  beatNumber: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  beatNumberActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  playbackIndicator: {
    height: 3,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    marginTop: SPACING.sm,
    position: 'relative',
  },
  playbackDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    top: -4,
    marginLeft: -6,
  },
});
