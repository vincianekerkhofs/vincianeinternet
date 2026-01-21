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

/**
 * TABLATURE DISPLAY COMPONENT
 * - LARGER font sizes for fret numbers (22px)
 * - Clear picking direction arrows (↓ ↑)
 * - Finger numbers displayed below fret numbers
 * - Better spacing and no clipping
 * - Synchronized with metronome
 */
export const TabDisplay: React.FC<TabDisplayProps> = ({
  notes = [],
  currentBeat = 1,
  totalBeats = 8,
  timeSignature = '4/4',
  isPlaying = false,
  showFingering = true,
}) => {
  const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
  
  // Get note at specific string and beat
  const getNoteAtPosition = (stringIndex: number, beat: number): TabNote | null => {
    return notes.find(n => 
      n.stringIndex === stringIndex && 
      Math.floor(n.startBeat) === beat
    ) || null;
  };

  // Get picking direction at beat
  const getDirectionAtBeat = (beat: number): 'up' | 'down' | null => {
    const noteWithDirection = notes.find(n => 
      Math.floor(n.startBeat) === beat && n.direction
    );
    return noteWithDirection?.direction || null;
  };

  // Get finger number at beat (for any string)
  const getFingerAtBeat = (beat: number): number | null => {
    const noteWithFinger = notes.find(n => 
      Math.floor(n.startBeat) === beat && n.finger
    );
    return noteWithFinger?.finger || null;
  };

  // Render beat numbers row
  const renderBeatNumbers = () => {
    const beats = [];
    for (let beat = 1; beat <= totalBeats; beat++) {
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      beats.push(
        <View key={beat} style={styles.tabColumn}>
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
      <View style={styles.row}>
        <View style={styles.labelColumn} />
        {beats}
      </View>
    );
  };

  // Render picking direction arrows
  const renderPickingDirections = () => {
    const directions = [];
    for (let beat = 1; beat <= totalBeats; beat++) {
      const direction = getDirectionAtBeat(beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      
      let arrow = ' ';
      if (direction === 'down') arrow = '↓';
      if (direction === 'up') arrow = '↑';
      
      directions.push(
        <View key={beat} style={styles.tabColumn}>
          <Text style={[
            styles.pickingArrow,
            isCurrentBeat && styles.pickingArrowActive,
          ]}>
            {arrow}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <View style={styles.labelColumn}>
          <Text style={styles.rowLabel}>Pick</Text>
        </View>
        {directions}
      </View>
    );
  };

  // Render finger numbers row
  const renderFingerNumbers = () => {
    if (!showFingering) return null;
    
    const fingers = [];
    for (let beat = 1; beat <= totalBeats; beat++) {
      const finger = getFingerAtBeat(beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      
      fingers.push(
        <View key={beat} style={styles.tabColumn}>
          <Text style={[
            styles.fingerNumber,
            isCurrentBeat && styles.fingerNumberActive,
          ]}>
            {finger || ' '}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <View style={styles.labelColumn}>
          <Text style={styles.rowLabel}>Fing</Text>
        </View>
        {fingers}
      </View>
    );
  };

  // Render a single string row
  const renderStringRow = (stringIndex: number, stringName: string) => {
    const positions = [];
    
    for (let beat = 1; beat <= totalBeats; beat++) {
      const note = getNoteAtPosition(stringIndex, beat);
      const isCurrentBeat = Math.floor(currentBeat) === beat && isPlaying;
      const isPastBeat = currentBeat > beat && isPlaying;
      
      let displayValue = '—';
      let hasNote = false;
      
      if (note) {
        hasNote = true;
        if (note.isMute || note.fret === null) {
          displayValue = 'X';
        } else {
          displayValue = String(note.fret);
        }
      }
      
      positions.push(
        <View 
          key={`${stringIndex}-${beat}`} 
          style={[
            styles.tabColumn,
            isCurrentBeat && hasNote && styles.tabColumnActive,
            isPastBeat && hasNote && styles.tabColumnPast,
          ]}
        >
          <Text style={[
            styles.tabNote,
            hasNote && styles.tabNoteWithValue,
            isCurrentBeat && hasNote && styles.tabNoteActive,
            isPastBeat && hasNote && styles.tabNotePast,
            !hasNote && styles.tabNoteLine,
          ]}>
            {displayValue}
          </Text>
          {note?.technique && (
            <Text style={styles.techniqueMarker}>{note.technique}</Text>
          )}
        </View>
      );
    }

    const hasActiveNote = notes.some(n => 
      n.stringIndex === stringIndex && 
      Math.floor(n.startBeat) === Math.floor(currentBeat)
    ) && isPlaying;

    return (
      <View key={stringIndex} style={styles.row}>
        <View style={styles.labelColumn}>
          <Text style={[
            styles.stringLabel,
            hasActiveNote && styles.stringLabelActive
          ]}>
            {stringName}
          </Text>
        </View>
        <View style={styles.stringLine}>
          {positions}
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
          <View style={styles.separator} />
          {stringNames.map((name, index) => renderStringRow(index, name))}
          <View style={styles.separator} />
          {renderFingerNumbers()}
        </View>
      </ScrollView>
      
      {/* Playback progress bar */}
      {isPlaying && (
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentBeat - 1) / totalBeats) * 100}%` }
            ]} 
          />
          <View 
            style={[
              styles.progressDot, 
              { left: `${((currentBeat - 1) / totalBeats) * 100}%` }
            ]} 
          />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
  },
  labelColumn: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  stringLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  stringLabelActive: {
    color: COLORS.primary,
  },
  stringLine: {
    flexDirection: 'row',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: COLORS.textMuted,
  },
  tabColumn: {
    width: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  tabColumnActive: {
    backgroundColor: COLORS.primary,
  },
  tabColumnPast: {
    backgroundColor: COLORS.success + '30',
  },
  tabNote: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  tabNoteWithValue: {
    color: COLORS.primary,
  },
  tabNoteActive: {
    color: '#FFFFFF',
  },
  tabNotePast: {
    color: COLORS.success,
  },
  tabNoteLine: {
    color: COLORS.textMuted,
    fontWeight: '400',
    fontSize: 16,
  },
  techniqueMarker: {
    position: 'absolute',
    top: 0,
    fontSize: 10,
    color: COLORS.info,
    fontWeight: '700',
  },
  beatNumber: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  beatNumberActive: {
    color: COLORS.primary,
    fontSize: 16,
  },
  pickingArrow: {
    fontSize: 28,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  pickingArrowActive: {
    color: COLORS.warning,
  },
  fingerNumber: {
    fontSize: 18,
    color: COLORS.warning,
    fontWeight: '800',
  },
  fingerNumberActive: {
    color: COLORS.primary,
  },
  separator: {
    height: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 3,
    marginTop: SPACING.md,
    position: 'relative',
    overflow: 'visible',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary + '60',
    borderRadius: 3,
  },
  progressDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    top: -5,
    marginLeft: -8,
  },
});
