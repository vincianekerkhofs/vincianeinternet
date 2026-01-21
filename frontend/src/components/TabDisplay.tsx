import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

export interface TabNote {
  stringIndex: number;
  fret: number | null;
  startBeat: number;
  duration?: number;
  direction?: 'up' | 'down';
  technique?: string;
  isMute?: boolean;
  finger?: number;
}

interface TabDisplayProps {
  notes: TabNote[];
  currentBeat: number;
  totalBeats?: number;
  timeSignature?: string;
  isPlaying?: boolean;
  showFingering?: boolean;
}

export const TabDisplay: React.FC<TabDisplayProps> = ({
  notes = [],
  currentBeat = 1,
  totalBeats = 8,
  timeSignature = '4/4',
  isPlaying = false,
  showFingering = true,
}) => {
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  
  const getNoteAtPosition = (stringIndex: number, beat: number): TabNote | null => {
    return notes.find(n => 
      n.stringIndex === stringIndex && 
      Math.floor(n.startBeat) === beat
    ) || null;
  };

  const getDirectionAtBeat = (beat: number): string | null => {
    const noteWithDirection = notes.find(n => 
      Math.floor(n.startBeat) === beat && n.direction
    );
    if (noteWithDirection?.direction === 'down') return '⬇';
    if (noteWithDirection?.direction === 'up') return '⬆';
    return null;
  };

  const renderString = (stringIndex: number, stringName: string) => {
    const positions = [];
    
    for (let beat = 1; beat <= totalBeats; beat++) {
      const note = getNoteAtPosition(stringIndex, beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      const isPastBeat = currentBeat > beat && isPlaying;
      
      let displayValue = '—';
      let fingerValue: number | undefined;
      let hasNote = false;
      
      if (note) {
        hasNote = true;
        if (note.isMute || note.fret === null) {
          displayValue = 'X';
        } else {
          displayValue = String(note.fret);
          fingerValue = note.finger;
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
          <View style={styles.noteContainer}>
            <Text style={[
              styles.tabNote,
              hasNote && styles.tabNoteWithValue,
              isCurrentBeat && hasNote && styles.tabNoteActive,
              isPastBeat && hasNote && styles.tabNotePast,
              !hasNote && styles.tabLine,
            ]}>
              {displayValue}
            </Text>
            {showFingering && fingerValue && (
              <Text style={[
                styles.fingerNumber,
                isCurrentBeat && styles.fingerNumberActive,
              ]}>
                {fingerValue}
              </Text>
            )}
          </View>
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
      <View style={styles.directionRow}>
        <Text style={styles.stringName}></Text>
        <View style={styles.stringLine}>
          <Text style={styles.tabSeparator}> </Text>
          {directions}
          <Text style={styles.tabSeparator}> </Text>
        </View>
      </View>
    );
  };

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
      <View style={styles.beatRow}>
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
  beatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    marginBottom: 2,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginBottom: 4,
  },
  stringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 34,
  },
  stringName: {
    width: 22,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  stringNameActive: {
    color: COLORS.primary,
  },
  stringLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabPosition: {
    width: 52,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  tabPositionActive: {
    backgroundColor: COLORS.primary,
  },
  tabPositionPast: {
    backgroundColor: COLORS.success + '30',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tabNote: {
    fontSize: 18,
    fontWeight: '800',
  },
  tabNoteWithValue: {
    color: COLORS.primary,
  },
  tabNoteActive: {
    color: COLORS.text,
  },
  tabNotePast: {
    color: COLORS.success,
  },
  tabLine: {
    color: COLORS.textMuted,
    fontWeight: '400',
    fontSize: 14,
  },
  fingerNumber: {
    fontSize: 13,
    color: COLORS.warning,
    fontWeight: '700',
    marginLeft: 2,
  },
  fingerNumberActive: {
    color: COLORS.text,
  },
  tabSeparator: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginHorizontal: 4,
    fontWeight: '500',
  },
  techniqueMarker: {
    position: 'absolute',
    top: -4,
    fontSize: 10,
    color: COLORS.info,
    fontWeight: '700',
  },
  pickingDirection: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  pickingDirectionActive: {
    color: COLORS.secondary,
  },
  beatNumber: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  beatNumberActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  playbackIndicator: {
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    marginTop: SPACING.md,
    position: 'relative',
  },
  playbackDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    top: -5,
    marginLeft: -7,
  },
});
