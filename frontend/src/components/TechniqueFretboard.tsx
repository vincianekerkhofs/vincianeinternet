import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, LayoutChangeEvent, Animated, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import Svg, { Line, Circle, Rect, G, Path, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { SoloNote } from '../data/solosContent';
import { getNoteAtFret, letterToSolfege, NOTE_MAPPING_REFERENCE } from '../utils/noteNames';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  notes: SoloNote[][];  // Array of measures
  currentBar: number;   // 0-indexed current bar
  currentNoteIndex: number; // Current note within the bar
  isPlaying: boolean;
  startFret?: number;   // Starting fret position
  numFrets?: number;    // Number of frets to show
  height?: number;
  showAllNotes?: boolean; // Show all notes or just current measure
  showNoteNames?: boolean; // Show note names on fretboard
}

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const STRING_NAMES_DUAL = ['e/Mi', 'B/Si', 'G/Sol', 'D/Re', 'A/La', 'E/Mi'];

const THEME = {
  NOTE: '#00D68F',
  ROOT: '#FF6B35',
  ACTIVE: '#FFFFFF',
  BEND: '#FF4757',
  SLIDE: '#00C2FF',
  HAMMER: '#9D4EDD',
  PULL: '#FFB547',
  VIBRATO: '#00D4AA',
};

// Get technique color
const getTechniqueColor = (technique?: string): string => {
  switch (technique) {
    case 'bend': return THEME.BEND;
    case 'slide': return THEME.SLIDE;
    case 'hammer': return THEME.HAMMER;
    case 'pull': return THEME.PULL;
    case 'vibrato': return THEME.VIBRATO;
    default: return THEME.NOTE;
  }
};

// Get technique label
const getTechniqueLabel = (technique?: string): string => {
  switch (technique) {
    case 'bend': return 'B';
    case 'slide': return 'S';
    case 'hammer': return 'H';
    case 'pull': return 'P';
    case 'vibrato': return '~';
    default: return '';
  }
};

export const TechniqueFretboard: React.FC<Props> = ({
  notes,
  currentBar,
  currentNoteIndex,
  isPlaying,
  startFret = 5,
  numFrets = 5,
  height = 280,
  showAllNotes = true,
  showNoteNames = true,
}) => {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [showNoteModal, setShowNoteModal] = useState(false);

  // Pulse animation for active note
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && width !== measuredWidth) {
      setMeasuredWidth(width);
    }
  };

  // Get all notes from all bars for complete visualization, or just current bar
  const getVisibleNotes = (): { note: SoloNote; barIdx: number; noteIdx: number }[] => {
    const result: { note: SoloNote; barIdx: number; noteIdx: number }[] = [];
    
    if (showAllNotes) {
      notes.forEach((bar, barIdx) => {
        bar.forEach((note, noteIdx) => {
          result.push({ note, barIdx, noteIdx });
        });
      });
    } else {
      // Only current bar
      if (notes[currentBar]) {
        notes[currentBar].forEach((note, noteIdx) => {
          result.push({ note, barIdx: currentBar, noteIdx });
        });
      }
    }
    
    return result;
  };

  const actualWidth = measuredWidth || 320;
  const svgHeight = height - 90;
  const paddingTop = 15;
  const paddingBottom = 20;
  const paddingLeft = 20;
  const paddingRight = 20;
  
  const fretboardWidth = actualWidth - paddingLeft - paddingRight;
  const fretboardHeight = svgHeight - paddingTop - paddingBottom;
  const fretWidth = fretboardWidth / numFrets;
  const stringSpacing = fretboardHeight / 5;

  // Calculate note position
  const getNotePosition = (note: SoloNote) => {
    const stringIdx = note.string - 1; // 1-indexed to 0-indexed
    const fretOffset = note.fret - startFret;
    const x = paddingLeft + (fretOffset + 0.5) * fretWidth;
    const y = paddingTop + stringIdx * stringSpacing;
    return { x, y };
  };

  // Render string lines
  const renderStrings = () =>
    STRING_NAMES.map((_, i) => {
      const y = paddingTop + i * stringSpacing;
      const thickness = 1.5 + i * 0.5;
      return (
        <Line key={`str-${i}`}
          x1={paddingLeft} y1={y}
          x2={actualWidth - paddingRight} y2={y}
          stroke="#B8977E" strokeWidth={thickness}
        />
      );
    });

  // Render fret lines
  const renderFrets = () => {
    const lines = [];
    for (let i = 0; i <= numFrets; i++) {
      const x = paddingLeft + i * fretWidth;
      const isNut = startFret === 0 && i === 0;
      lines.push(
        <Line key={`fret-${i}`}
          x1={x} y1={paddingTop}
          x2={x} y2={paddingTop + fretboardHeight}
          stroke={isNut ? '#D4D4D4' : '#5A5A5A'}
          strokeWidth={isNut ? 5 : 2}
        />
      );
    }
    return lines;
  };

  // Render technique connections (slides, hammer-ons, etc.)
  const renderTechniqueConnections = () => {
    const visibleNotes = getVisibleNotes();
    const connections: JSX.Element[] = [];
    
    for (let i = 0; i < visibleNotes.length - 1; i++) {
      const current = visibleNotes[i];
      const next = visibleNotes[i + 1];
      
      // Check if current note has a technique that connects to next note
      if (current.note.technique && current.note.string === next.note.string) {
        const pos1 = getNotePosition(current.note);
        const pos2 = getNotePosition(next.note);
        const color = getTechniqueColor(current.note.technique);
        
        if (current.note.technique === 'slide') {
          // Draw slide line
          connections.push(
            <Line
              key={`slide-${i}`}
              x1={pos1.x + 14}
              y1={pos1.y}
              x2={pos2.x - 14}
              y2={pos2.y}
              stroke={color}
              strokeWidth={3}
              strokeDasharray="5,3"
            />
          );
        } else if (current.note.technique === 'hammer' || current.note.technique === 'pull') {
          // Draw curved line for hammer-on/pull-off
          const midX = (pos1.x + pos2.x) / 2;
          const curveHeight = -15; // Curve upward
          connections.push(
            <Path
              key={`hammer-${i}`}
              d={`M ${pos1.x + 14} ${pos1.y} Q ${midX} ${pos1.y + curveHeight} ${pos2.x - 14} ${pos2.y}`}
              fill="none"
              stroke={color}
              strokeWidth={2}
            />
          );
        }
      }
      
      // Bend indicator (curved arrow up)
      if (current.note.technique === 'bend') {
        const pos = getNotePosition(current.note);
        connections.push(
          <G key={`bend-${i}`}>
            <Path
              d={`M ${pos.x} ${pos.y - 14} Q ${pos.x + 10} ${pos.y - 25} ${pos.x + 5} ${pos.y - 30}`}
              fill="none"
              stroke={THEME.BEND}
              strokeWidth={2}
            />
            <Path
              d={`M ${pos.x + 2} ${pos.y - 28} L ${pos.x + 5} ${pos.y - 32} L ${pos.x + 8} ${pos.y - 28}`}
              fill="none"
              stroke={THEME.BEND}
              strokeWidth={2}
            />
          </G>
        );
      }
      
      // Vibrato indicator (wavy line)
      if (current.note.technique === 'vibrato') {
        const pos = getNotePosition(current.note);
        connections.push(
          <Path
            key={`vibrato-${i}`}
            d={`M ${pos.x - 12} ${pos.y - 20} q 4,-5 8,0 t 8,0 t 8,0`}
            fill="none"
            stroke={THEME.VIBRATO}
            strokeWidth={2}
          />
        );
      }
    }
    
    return connections;
  };

  // Render note circles
  const renderNotes = () => {
    const visibleNotes = getVisibleNotes();
    const dots: JSX.Element[] = [];
    
    visibleNotes.forEach(({ note, barIdx, noteIdx }, i) => {
      const pos = getNotePosition(note);
      const isActive = isPlaying && barIdx === currentBar && noteIdx === currentNoteIndex;
      const isPast = showAllNotes && (barIdx < currentBar || (barIdx === currentBar && noteIdx < currentNoteIndex));
      const isRoot = note.isRoot === true;
      
      // Skip notes outside visible fret range
      if (note.fret < startFret || note.fret >= startFret + numFrets) return;
      
      let fill = isRoot ? THEME.ROOT : THEME.NOTE;
      let stroke = isRoot ? THEME.ROOT : THEME.NOTE;
      let opacity = 1;
      
      if (isPast && isPlaying) {
        opacity = 0.4;
      }
      
      if (isActive) {
        fill = THEME.ACTIVE;
        stroke = THEME.ACTIVE;
      }
      
      const radius = isActive ? 16 : 14;
      
      dots.push(
        <G key={`note-${i}`} opacity={opacity}>
          {isActive && (
            <Circle cx={pos.x} cy={pos.y} r={22} fill={THEME.ROOT} opacity={0.4} />
          )}
          <Circle 
            cx={pos.x} 
            cy={pos.y} 
            r={radius} 
            fill={fill} 
            stroke={stroke} 
            strokeWidth={2} 
          />
          {/* Finger number */}
          <SvgText
            x={pos.x}
            y={pos.y + 4}
            fill="#FFF"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
          >
            {note.finger}
          </SvgText>
        </G>
      );
    });
    
    return dots;
  };

  // String indicator row
  const renderStringIndicators = () => (
    <View style={styles.indicatorRow}>
      {STRING_NAMES.map((name, i) => (
        <View key={i} style={[styles.indicator, { backgroundColor: COLORS.surfaceLight }]}>
          <Text style={styles.indicatorText}>{name}</Text>
        </View>
      ))}
    </View>
  );

  // Fret numbers
  const renderFretNumbers = () => (
    <View style={styles.fretNumRow}>
      {Array.from({ length: numFrets }, (_, i) => (
        <Text key={i} style={styles.fretNum}>{startFret + i}</Text>
      ))}
    </View>
  );

  // Technique legend
  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.ROOT }]} />
        <Text style={styles.legendText}>Raíz</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.BEND }]} />
        <Text style={styles.legendText}>Bend</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.SLIDE }]} />
        <Text style={styles.legendText}>Slide</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: THEME.VIBRATO }]} />
        <Text style={styles.legendText}>Vibrato</Text>
      </View>
    </View>
  );

  // Current bar info
  const currentBarNotes = notes[currentBar] || [];
  const currentNote = currentBarNotes[currentNoteIndex];

  return (
    <View style={styles.outerWrapper} onLayout={handleLayout}>
      {/* String indicators */}
      {renderStringIndicators()}
      
      {/* SVG Fretboard */}
      {measuredWidth > 0 && (
        <View style={styles.svgContainer}>
          <Svg 
            width={actualWidth} 
            height={svgHeight}
            viewBox={`0 0 ${actualWidth} ${svgHeight}`}
          >
            <Rect 
              x={paddingLeft} 
              y={paddingTop} 
              width={fretboardWidth} 
              height={fretboardHeight}
              fill="#1E1810" 
              rx={4} 
            />
            {renderFrets()}
            {renderStrings()}
            {renderTechniqueConnections()}
            {renderNotes()}
          </Svg>
        </View>
      )}
      
      {/* Fret numbers */}
      {renderFretNumbers()}
      
      {/* Position indicator */}
      <Text style={styles.positionText}>Trastes {startFret}–{startFret + numFrets - 1}</Text>
      
      {/* Current note info */}
      {isPlaying && currentNote && (
        <View style={styles.currentNoteInfo}>
          <Text style={styles.currentNoteLabel}>Compás {currentBar + 1}</Text>
          {currentNote.technique && (
            <View style={[styles.techniqueBadge, { backgroundColor: getTechniqueColor(currentNote.technique) + '40' }]}>
              <Text style={[styles.techniqueText, { color: getTechniqueColor(currentNote.technique) }]}>
                {currentNote.technique.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}
      
      {/* Legend */}
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'center',
    overflow: 'visible',
  },
  
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
    paddingHorizontal: 15,
  },
  indicator: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  svgContainer: { 
    position: 'relative',
    overflow: 'visible',
    alignSelf: 'stretch',
  },
  
  fretNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 35,
    marginTop: -5,
  },
  fretNum: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  
  positionText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  
  currentNoteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  currentNoteLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  techniqueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  techniqueText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});
