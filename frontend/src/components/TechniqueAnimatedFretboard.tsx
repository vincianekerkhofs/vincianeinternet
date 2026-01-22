/**
 * GUITAR GUIDE PRO - ANIMATED TECHNIQUE FRETBOARD
 * Interactive fretboard with movement visualization for technique practice
 * Shows active notes, upcoming notes, paths, and technique glyphs
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import Svg, { 
  Rect, 
  Line, 
  Circle, 
  Text as SvgText, 
  G, 
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { FretboardNote, FretboardPath, TechniqueGlyph } from '../data/techniqueExercises';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================
// TYPES
// =============================================

interface TechniqueAnimatedFretboardProps {
  path: FretboardPath;
  currentBeat: number;
  isPlaying: boolean;
  techniqueColor: string;
  onNotePress?: (note: FretboardNote) => void;
  mode?: 'guided' | 'continuous';
  showTechniqueGlyphs?: boolean;
}

interface NoteMarkerProps {
  note: FretboardNote;
  x: number;
  y: number;
  state: 'active' | 'upcoming' | 'completed' | 'reference';
  techniqueColor: string;
  showGlyph: boolean;
  pulseAnim: Animated.Value;
}

// =============================================
// CONSTANTS
// =============================================

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E']; // 1-6
const FRET_DOTS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const DOUBLE_DOTS = [12];

// Technique glyph symbols for display
const TECHNIQUE_GLYPHS: Record<TechniqueGlyph, string> = {
  'h': 'H',
  'p': 'P',
  '/': '↗',
  '\\': '↘',
  'b': '↑',
  'r': '↓',
  '~': '∿',
  'x': '×',
  'PM': 'PM',
  '>': '>',
  'sl': '⌒',
  'tr': 'tr',
};

// =============================================
// ANIMATED NOTE MARKER
// =============================================

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const NoteMarker: React.FC<NoteMarkerProps> = ({
  note,
  x,
  y,
  state,
  techniqueColor,
  showGlyph,
  pulseAnim,
}) => {
  const getColors = () => {
    switch (state) {
      case 'active':
        return { fill: techniqueColor, stroke: '#FFFFFF', opacity: 1 };
      case 'upcoming':
        return { fill: COLORS.secondaryDark, stroke: COLORS.secondary, opacity: 0.6 };
      case 'completed':
        return { fill: COLORS.completedNote, stroke: COLORS.success, opacity: 0.5 };
      case 'reference':
        return { fill: COLORS.referenceNote, stroke: COLORS.textMuted, opacity: 0.7 };
      default:
        return { fill: COLORS.surfaceLight, stroke: COLORS.textMuted, opacity: 0.5 };
    }
  };

  const colors = getColors();
  const radius = state === 'active' ? 14 : 12;
  const fingerLabel = note.finger ? String(note.finger) : '';
  
  return (
    <G>
      {/* Outer glow for active notes */}
      {state === 'active' && (
        <Circle
          cx={x}
          cy={y}
          r={radius + 6}
          fill={techniqueColor}
          opacity={0.2}
        />
      )}
      
      {/* Main note circle */}
      <Circle
        cx={x}
        cy={y}
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={state === 'active' ? 2.5 : 1.5}
        opacity={colors.opacity}
      />
      
      {/* Root note indicator */}
      {note.isRoot && (
        <Circle
          cx={x}
          cy={y}
          r={radius - 4}
          fill="none"
          stroke={COLORS.rootNote}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
      )}
      
      {/* Finger number */}
      {fingerLabel && state !== 'completed' && (
        <SvgText
          x={x}
          y={y + 4}
          textAnchor="middle"
          fill={state === 'active' ? COLORS.text : COLORS.textMuted}
          fontSize={10}
          fontWeight="bold"
        >
          {fingerLabel}
        </SvgText>
      )}
      
      {/* Technique glyph */}
      {showGlyph && note.technique && state !== 'completed' && (
        <G>
          <Circle
            cx={x + 12}
            cy={y - 12}
            r={8}
            fill={COLORS.backgroundCard}
            stroke={techniqueColor}
            strokeWidth={1}
          />
          <SvgText
            x={x + 12}
            y={y - 8}
            textAnchor="middle"
            fill={techniqueColor}
            fontSize={8}
            fontWeight="bold"
          >
            {TECHNIQUE_GLYPHS[note.technique] || note.technique}
          </SvgText>
        </G>
      )}
    </G>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export const TechniqueAnimatedFretboard: React.FC<TechniqueAnimatedFretboardProps> = ({
  path,
  currentBeat,
  isPlaying,
  techniqueColor,
  onNotePress,
  mode = 'continuous',
  showTechniqueGlyphs = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const trailOpacity = useRef(new Animated.Value(0.5)).current;
  
  // Fretboard dimensions - adjusted for better visibility
  const fretboardWidth = SCREEN_WIDTH - SPACING.lg * 2;
  const fretboardHeight = 180; // Increased height
  const topPadding = 20; // Padding at top for first string
  const bottomPadding = 25; // Padding at bottom for fret numbers
  const stringAreaHeight = fretboardHeight - topPadding - bottomPadding;
  const stringSpacing = stringAreaHeight / 5; // 5 gaps for 6 strings
  const nutWidth = 12;
  
  // Calculate fret range
  const startFret = path.startFret;
  const endFret = path.endFret;
  const numFrets = endFret - startFret + 1;
  const fretWidth = (fretboardWidth - nutWidth) / numFrets;
  
  // Animation for active note pulse
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
    
    return () => pulseAnim.stopAnimation();
  }, [isPlaying]);
  
  // Calculate note states based on current beat
  const noteStates = useMemo(() => {
    // When not playing, show first note as active and rest as upcoming
    if (!isPlaying) {
      return path.notes.map((note, index) => {
        if (index === 0) return 'active';
        return 'upcoming';
      });
    }
    
    const loopBeat = ((currentBeat - 1) % path.beatsPerLoop) + 1;
    
    return path.notes.map((note, index) => {
      const noteStart = note.timing;
      const noteEnd = noteStart + note.duration;
      
      if (loopBeat >= noteStart && loopBeat < noteEnd) {
        return 'active';
      } else if (loopBeat < noteStart) {
        return 'upcoming';
      } else {
        return 'completed';
      }
    });
  }, [currentBeat, path, isPlaying]);
  
  // Get X position for a fret
  const getFretX = (fret: number): number => {
    const relativeFret = fret - startFret;
    return nutWidth + (relativeFret * fretWidth) + (fretWidth / 2);
  };
  
  // Get Y position for a string (1 = high E at top)
  const getStringY = (string: number): number => {
    // string 1 = high E at top, string 6 = low E at bottom
    return topPadding + ((string - 1) * stringSpacing);
  };
  
  // Generate connection path between notes
  const generateConnectionPath = (): string => {
    if (path.notes.length < 2) return '';
    
    let d = '';
    const activeIndex = noteStates.findIndex(s => s === 'active');
    const relevantNotes = activeIndex >= 0 
      ? path.notes.slice(Math.max(0, activeIndex - 1), activeIndex + 3)
      : path.notes.slice(0, 4);
    
    relevantNotes.forEach((note, index) => {
      const x = getFretX(note.position.fret);
      const y = getStringY(note.position.string);
      
      if (index === 0) {
        d += `M ${x} ${y}`;
      } else {
        // Smooth curve through points
        const prevNote = relevantNotes[index - 1];
        const prevX = getFretX(prevNote.position.fret);
        const prevY = getStringY(prevNote.position.string);
        
        const cpX = (prevX + x) / 2;
        d += ` Q ${cpX} ${prevY} ${x} ${y}`;
      }
    });
    
    return d;
  };
  
  // Render fret markers
  const renderFretMarkers = () => {
    const markers = [];
    for (let fret = startFret; fret <= endFret; fret++) {
      const x = getFretX(fret);
      
      // Fret number
      markers.push(
        <SvgText
          key={`fret-num-${fret}`}
          x={x}
          y={fretboardHeight - 4}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={9}
        >
          {fret}
        </SvgText>
      );
      
      // Fret dots
      if (FRET_DOTS.includes(fret)) {
        const isDouble = DOUBLE_DOTS.includes(fret);
        if (isDouble) {
          markers.push(
            <Circle key={`dot-${fret}-1`} cx={x} cy={getStringY(2)} r={3} fill={COLORS.textMuted} opacity={0.3} />
          );
          markers.push(
            <Circle key={`dot-${fret}-2`} cx={x} cy={getStringY(5)} r={3} fill={COLORS.textMuted} opacity={0.3} />
          );
        } else {
          markers.push(
            <Circle key={`dot-${fret}`} cx={x} cy={getStringY(3.5)} r={3} fill={COLORS.textMuted} opacity={0.3} />
          );
        }
      }
    }
    return markers;
  };
  
  // Render strings
  const renderStrings = () => {
    return STRING_NAMES.map((name, index) => {
      const y = getStringY(index + 1);
      const thickness = 1 + (index * 0.3); // Thicker bass strings
      
      return (
        <G key={`string-${index}`}>
          {/* String line */}
          <Line
            x1={nutWidth}
            y1={y}
            x2={fretboardWidth}
            y2={y}
            stroke={COLORS.string}
            strokeWidth={thickness}
            opacity={0.6}
          />
          {/* String label */}
          <SvgText
            x={4}
            y={y + 4}
            fill={COLORS.textMuted}
            fontSize={10}
            fontWeight="600"
          >
            {name}
          </SvgText>
        </G>
      );
    });
  };
  
  // Render frets
  const renderFrets = () => {
    const frets = [];
    
    // Nut
    // Nut
    const firstStringY = getStringY(1);
    const lastStringY = getStringY(6);
    
    frets.push(
      <Rect
        key="nut"
        x={nutWidth - 4}
        y={firstStringY - 4}
        width={6}
        height={lastStringY - firstStringY + 8}
        fill={COLORS.fret}
        rx={2}
      />
    );
    
    // Fret wires
    for (let i = 0; i <= numFrets; i++) {
      const x = nutWidth + (i * fretWidth);
      frets.push(
        <Line
          key={`fret-${i}`}
          x1={x}
          y1={firstStringY - 4}
          x2={x}
          y2={lastStringY + 4}
          stroke={COLORS.fret}
          strokeWidth={1.5}
          opacity={0.4}
        />
      );
    }
    
    return frets;
  };
  
  // Render motion trail/path
  const renderMotionPath = () => {
    const pathD = generateConnectionPath();
    if (!pathD) return null;
    
    return (
      <G>
        {/* Glow effect */}
        <Path
          d={pathD}
          fill="none"
          stroke={techniqueColor}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.15}
        />
        {/* Main path */}
        <Path
          d={pathD}
          fill="none"
          stroke={techniqueColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity={0.5}
        />
      </G>
    );
  };
  
  // Render note markers
  const renderNotes = () => {
    return path.notes.map((note, index) => {
      const x = getFretX(note.position.fret);
      const y = getStringY(note.position.string);
      const state = noteStates[index] as 'active' | 'upcoming' | 'completed' | 'reference';
      
      return (
        <NoteMarker
          key={`note-${index}`}
          note={note}
          x={x}
          y={y}
          state={state}
          techniqueColor={techniqueColor}
          showGlyph={showTechniqueGlyphs}
          pulseAnim={pulseAnim}
        />
      );
    });
  };
  
  return (
    <View style={styles.container}>
      {/* Fretboard background */}
      <View style={styles.fretboardBackground}>
        <Svg 
          width={fretboardWidth} 
          height={fretboardHeight} 
          viewBox={`0 0 ${fretboardWidth} ${fretboardHeight}`}
        >
          <Defs>
            <LinearGradient id="fretboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={COLORS.fretboard} stopOpacity={1} />
              <Stop offset="100%" stopColor="#1A0F0A" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          
          {/* Fretboard wood */}
          <Rect
            x={0}
            y={topPadding - 8}
            width={fretboardWidth}
            height={stringAreaHeight + 16}
            fill="url(#fretboardGrad)"
            rx={4}
          />
          
          {/* Frets */}
          {renderFrets()}
          
          {/* Fret markers */}
          {renderFretMarkers()}
          
          {/* Strings */}
          {renderStrings()}
          
          {/* Motion path */}
          {isPlaying && renderMotionPath()}
          
          {/* Note markers */}
          {renderNotes()}
        </Svg>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: techniqueColor }]} />
          <Text style={styles.legendText}>Activa</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.secondaryDark, opacity: 0.6 }]} />
          <Text style={styles.legendText}>Próxima</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.completedNote }]} />
          <Text style={styles.legendText}>Completada</Text>
        </View>
        {path.notes.some(n => n.isRoot) && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendRoot]} />
            <Text style={styles.legendText}>Raíz</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// =============================================
// STYLES
// =============================================

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  fretboardBackground: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendRoot: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.rootNote,
    borderStyle: 'dashed',
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});

export default TechniqueAnimatedFretboard;
