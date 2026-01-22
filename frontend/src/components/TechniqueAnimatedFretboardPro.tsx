/**
 * GUITAR GUIDE PRO - PEDAGOGICAL FRETBOARD
 * 
 * DESIGN PHILOSOPHY:
 * - Fretboard = WHERE to play (string/fret)
 * - Circle = WHAT sounds (note name) → WHICH finger (on pulse)
 * - Connectors = HOW notes connect (techniques)
 * 
 * VISUAL RULES:
 * 1. Notes are WHITE circles with subtle border and BLACK text
 * 2. Before pulse: circle shows NOTE NAME (C, D, E...)
 * 3. On pulse: circle shows FINGER NUMBER (1-4) + brief halo
 * 4. After pulse: circle reduces opacity
 * 5. Techniques are CONNECTORS between circles, never circles themselves
 * 
 * Each visual element has ONE function only. No duplicate information.
 */

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================
// CONSTANTS
// =============================================

const FINGER_GUIDES_STORAGE_KEY = '@guitar_guide_finger_guides_enabled';

// Note names for display
const NOTE_NAMES: Record<number, Record<number, string>> = {
  // String 1 (high E)
  1: { 0: 'E', 1: 'F', 2: 'F#', 3: 'G', 4: 'G#', 5: 'A', 6: 'A#', 7: 'B', 8: 'C', 9: 'C#', 10: 'D', 11: 'D#', 12: 'E', 13: 'F', 14: 'F#', 15: 'G' },
  // String 2 (B)
  2: { 0: 'B', 1: 'C', 2: 'C#', 3: 'D', 4: 'D#', 5: 'E', 6: 'F', 7: 'F#', 8: 'G', 9: 'G#', 10: 'A', 11: 'A#', 12: 'B', 13: 'C', 14: 'C#', 15: 'D' },
  // String 3 (G)
  3: { 0: 'G', 1: 'G#', 2: 'A', 3: 'A#', 4: 'B', 5: 'C', 6: 'C#', 7: 'D', 8: 'D#', 9: 'E', 10: 'F', 11: 'F#', 12: 'G', 13: 'G#', 14: 'A', 15: 'A#' },
  // String 4 (D)
  4: { 0: 'D', 1: 'D#', 2: 'E', 3: 'F', 4: 'F#', 5: 'G', 6: 'G#', 7: 'A', 8: 'A#', 9: 'B', 10: 'C', 11: 'C#', 12: 'D', 13: 'D#', 14: 'E', 15: 'F' },
  // String 5 (A)
  5: { 0: 'A', 1: 'A#', 2: 'B', 3: 'C', 4: 'C#', 5: 'D', 6: 'D#', 7: 'E', 8: 'F', 9: 'F#', 10: 'G', 11: 'G#', 12: 'A', 13: 'A#', 14: 'B', 15: 'C' },
  // String 6 (low E)
  6: { 0: 'E', 1: 'F', 2: 'F#', 3: 'G', 4: 'G#', 5: 'A', 6: 'A#', 7: 'B', 8: 'C', 9: 'C#', 10: 'D', 11: 'D#', 12: 'E', 13: 'F', 14: 'F#', 15: 'G' },
};

// Technique symbols for connectors
const TECHNIQUE_SYMBOLS: Record<TechniqueGlyph, string> = {
  'h': 'h',      // Hammer-on
  'p': 'p',      // Pull-off
  '/': '/',      // Slide up
  '\\': '\\',    // Slide down
  'b': 'b',      // Bend
  'r': 'r',      // Release
  '~': '~',      // Vibrato
  'x': 'x',      // Muted
  'PM': 'PM',    // Palm mute
  '>': '>',      // Accent
  'sl': 'sl',    // Legato slide
  'tr': 'tr',    // Trill
};

// Visual config
const CIRCLE_CONFIG = {
  radius: 14,
  strokeWidth: 1.5,
  strokeColor: '#9CA3AF',    // Subtle gray border
  fillColor: '#FFFFFF',       // White fill
  textColor: '#1F2937',       // Dark text
  activeHaloColor: '#F59E0B', // Amber halo on pulse
  completedOpacity: 0.4,
  upcomingOpacity: 0.85,
};

const CONNECTOR_CONFIG = {
  strokeWidth: 2,
  color: '#6B7280',           // Gray for connectors
  symbolSize: 10,
  curveHeight: 15,
};

// =============================================
// TYPES
// =============================================

interface NoteState {
  note: FretboardNote;
  state: 'upcoming' | 'active' | 'completed';
  showFinger: boolean;  // true = show finger, false = show note name
}

// =============================================
// HELPER: Get note name
// =============================================

const getNoteName = (string: number, fret: number): string => {
  return NOTE_NAMES[string]?.[fret] || `${fret}`;
};

// =============================================
// TECHNIQUE CONNECTOR COMPONENT
// Renders lines/curves between notes with technique symbols
// =============================================

interface TechniqueConnectorProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  technique: TechniqueGlyph;
  scale: number;
  isActive: boolean;
}

const TechniqueConnector: React.FC<TechniqueConnectorProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  technique,
  scale,
  isActive,
}) => {
  const config = CONNECTOR_CONFIG;
  const symbol = TECHNIQUE_SYMBOLS[technique] || technique;
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  
  // Calculate curve control point
  const curveY = midY - config.curveHeight * scale;
  
  // Determine connector style based on technique
  const isSlide = technique === '/' || technique === '\\';
  const isBend = technique === 'b' || technique === 'r';
  const isLegato = technique === 'h' || technique === 'p';
  
  const opacity = isActive ? 1 : 0.5;
  const strokeColor = isActive ? '#F59E0B' : config.color;
  
  return (
    <G opacity={opacity}>
      {/* Connector line/curve */}
      {isLegato || isBend ? (
        // Curved connector for legato techniques
        <Path
          d={`M ${fromX} ${fromY - CIRCLE_CONFIG.radius * scale} 
              Q ${midX} ${curveY} 
              ${toX} ${toY - CIRCLE_CONFIG.radius * scale}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={config.strokeWidth * scale}
          strokeLinecap="round"
        />
      ) : isSlide ? (
        // Straight diagonal line for slides
        <Line
          x1={fromX}
          y1={fromY}
          x2={toX}
          y2={toY}
          stroke={strokeColor}
          strokeWidth={config.strokeWidth * scale}
          strokeLinecap="round"
          strokeDasharray={`${4 * scale} ${2 * scale}`}
        />
      ) : (
        // Default straight line
        <Line
          x1={fromX}
          y1={fromY - CIRCLE_CONFIG.radius * scale}
          x2={toX}
          y2={toY - CIRCLE_CONFIG.radius * scale}
          stroke={strokeColor}
          strokeWidth={config.strokeWidth * scale}
          strokeLinecap="round"
        />
      )}
      
      {/* Technique symbol */}
      <G>
        {/* Symbol background */}
        <Rect
          x={midX - 8 * scale}
          y={curveY - 8 * scale}
          width={16 * scale}
          height={14 * scale}
          rx={3 * scale}
          fill={COLORS.background}
          stroke={strokeColor}
          strokeWidth={1 * scale}
        />
        {/* Symbol text */}
        <SvgText
          x={midX}
          y={curveY + 1 * scale}
          textAnchor="middle"
          fill={strokeColor}
          fontSize={config.symbolSize * scale}
          fontWeight="bold"
        >
          {symbol}
        </SvgText>
      </G>
    </G>
  );
};

// =============================================
// NOTE CIRCLE COMPONENT
// White circle showing note name OR finger number
// =============================================

interface NoteCircleProps {
  x: number;
  y: number;
  noteName: string;
  finger?: number;
  state: 'upcoming' | 'active' | 'completed';
  showFinger: boolean;
  scale: number;
}

const NoteCircle: React.FC<NoteCircleProps> = ({
  x,
  y,
  noteName,
  finger,
  state,
  showFinger,
  scale,
}) => {
  const config = CIRCLE_CONFIG;
  const radius = config.radius * scale;
  
  // Determine opacity based on state
  let opacity = config.upcomingOpacity;
  if (state === 'completed') {
    opacity = config.completedOpacity;
  } else if (state === 'active') {
    opacity = 1;
  }
  
  // Display content: finger number if active and has finger, otherwise note name
  // When active, ALWAYS show finger if available (this is the key change)
  const hasFinger = finger !== undefined && finger > 0;
  const isActive = state === 'active';
  const shouldShowFinger = isActive && hasFinger;
  
  // FORCE finger display when active and finger exists
  const displayText = shouldShowFinger ? String(finger) : noteName;
  
  return (
    <G opacity={opacity}>
      {/* Active halo - brief pulse indicator */}
      {state === 'active' && (
        <Circle
          cx={x}
          cy={y}
          r={radius + 6 * scale}
          fill={config.activeHaloColor}
          opacity={0.3}
        />
      )}
      
      {/* Main white circle */}
      <Circle
        cx={x}
        cy={y}
        r={radius}
        fill={config.fillColor}
        stroke={state === 'active' ? config.activeHaloColor : config.strokeColor}
        strokeWidth={state === 'active' ? 2.5 * scale : config.strokeWidth * scale}
      />
      
      {/* Text content - note name or finger */}
      <SvgText
        x={x}
        y={y + 4.5 * scale}
        textAnchor="middle"
        fill={config.textColor}
        fontSize={shouldShowFinger ? 14 * scale : 11 * scale}
        fontWeight={state === 'active' ? 'bold' : '600'}
      >
        {displayText}
      </SvgText>
    </G>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

interface TechniqueAnimatedFretboardProProps {
  path: FretboardPath;
  currentBeat: number;
  isPlaying: boolean;
  techniqueColor: string;
  onNotePress?: (note: FretboardNote) => void;
  mode?: 'guided' | 'follow' | 'free';
  showTechniqueGlyphs?: boolean;
  showFingerGuides?: boolean;
  debugMode?: boolean;
}

export const TechniqueAnimatedFretboardPro: React.FC<TechniqueAnimatedFretboardProProps> = ({
  path,
  currentBeat,
  isPlaying,
  techniqueColor,
  onNotePress,
  mode = 'guided',
  showTechniqueGlyphs = true,
  showFingerGuides: showFingerGuidesProp = true,
  debugMode = false,
}) => {
  // DEBUG: Verify this is the component being rendered
  console.log("[FRETBOARD_PRO] mounted", Date.now());
  
  // =============================================
  // STATE
  // =============================================
  
  // State - default to TRUE
  const [fingerGuidesEnabled, setFingerGuidesEnabled] = useState(true);
  
  // Load saved preference (but default is always true)
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(FINGER_GUIDES_STORAGE_KEY);
        // If saved value exists, use it; otherwise keep default (true)
        if (saved !== null) {
          setFingerGuidesEnabled(saved === 'true');
        }
        // If nothing saved, save the default
        else {
          await AsyncStorage.setItem(FINGER_GUIDES_STORAGE_KEY, 'true');
        }
      } catch (e) {
        console.warn('[Fretboard] Failed to load preference');
      }
    };
    loadPreference();
  }, []);
  
  // Toggle finger guides
  const toggleFingerGuides = useCallback(async () => {
    const newValue = !fingerGuidesEnabled;
    setFingerGuidesEnabled(newValue);
    try {
      await AsyncStorage.setItem(FINGER_GUIDES_STORAGE_KEY, String(newValue));
    } catch (e) {
      console.warn('[Fretboard] Failed to save preference');
    }
  }, [fingerGuidesEnabled]);
  
  // Show fingers when toggle is enabled - simplified logic
  const showFingers = fingerGuidesEnabled;
  
  // =============================================
  // FRETBOARD DIMENSIONS
  // =============================================
  
  const maxWidth = Math.min(SCREEN_WIDTH, 400);
  const fretboardWidth = maxWidth - 32;
  const fretboardHeight = 180;
  const numStrings = 6;
  const numFrets = (path.endFret - path.startFret) + 1;
  
  // Padding for string numbers and fret numbers
  const leftPadding = 30;  // Space for string numbers
  const rightPadding = 15;
  const topPadding = 20;
  const bottomPadding = 25; // Space for fret numbers
  
  const stringAreaHeight = fretboardHeight - topPadding - bottomPadding;
  const stringSpacing = stringAreaHeight / (numStrings - 1);
  const fretSpacing = (fretboardWidth - leftPadding - rightPadding) / numFrets;
  const scale = fretboardHeight / 180;
  
  // =============================================
  // NOTE POSITIONING
  // =============================================
  
  const computeNotePosition = useCallback((fret: number, string: number) => {
    const fretIndex = fret - path.startFret;
    const x = leftPadding + (fretIndex + 0.5) * fretSpacing;
    const y = topPadding + ((string - 1) * stringSpacing);
    return { x, y };
  }, [path.startFret, leftPadding, fretSpacing, topPadding, stringSpacing]);
  
  // =============================================
  // CURRENT NOTE TRACKING
  // =============================================
  
  const effectiveBeat = useMemo(() => {
    return path.loopable && path.beatsPerLoop 
      ? currentBeat % path.beatsPerLoop 
      : currentBeat;
  }, [currentBeat, path.loopable, path.beatsPerLoop]);
  
  const currentNoteIndex = useMemo(() => {
    for (let i = path.notes.length - 1; i >= 0; i--) {
      if (path.notes[i].timing <= effectiveBeat) {
        return i;
      }
    }
    return 0;
  }, [path.notes, effectiveBeat]);
  
  const currentNote = path.notes[currentNoteIndex] || null;
  
  // =============================================
  // RENDER FRETBOARD BASE
  // =============================================
  
  const renderFretboard = () => {
    const elements: JSX.Element[] = [];
    
    // Fretboard background
    elements.push(
      <Rect
        key="bg"
        x={leftPadding - 5}
        y={topPadding - 5}
        width={fretboardWidth - leftPadding - rightPadding + 10}
        height={stringAreaHeight + 10}
        fill="#1A0F0A"
        rx={4}
      />
    );
    
    // Frets (vertical lines)
    for (let i = 0; i <= numFrets; i++) {
      const x = leftPadding + i * fretSpacing;
      const isNut = i === 0;
      elements.push(
        <Line
          key={`fret-${i}`}
          x1={x}
          y1={topPadding - 3}
          x2={x}
          y2={topPadding + stringAreaHeight + 3}
          stroke={isNut ? '#E5E5E5' : '#6B6B6B'}
          strokeWidth={isNut ? 4 : 1.5}
        />
      );
    }
    
    // Strings (horizontal lines)
    for (let i = 0; i < numStrings; i++) {
      const y = topPadding + i * stringSpacing;
      const thickness = 1 + (i * 0.35);
      elements.push(
        <Line
          key={`string-${i}`}
          x1={leftPadding}
          y1={y}
          x2={fretboardWidth - rightPadding}
          y2={y}
          stroke="#B8B8B8"
          strokeWidth={thickness}
        />
      );
    }
    
    // Fret markers (dots)
    const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19];
    markerFrets.forEach(fret => {
      if (fret >= path.startFret && fret <= path.endFret) {
        const fretIndex = fret - path.startFret;
        const x = leftPadding + (fretIndex + 0.5) * fretSpacing;
        const yCenter = topPadding + stringAreaHeight / 2;
        
        if (fret === 12) {
          elements.push(
            <Circle key={`marker-${fret}-1`} cx={x} cy={yCenter - 18} r={3.5} fill="#4A4A4A" />,
            <Circle key={`marker-${fret}-2`} cx={x} cy={yCenter + 18} r={3.5} fill="#4A4A4A" />
          );
        } else {
          elements.push(
            <Circle key={`marker-${fret}`} cx={x} cy={yCenter} r={3.5} fill="#4A4A4A" />
          );
        }
      }
    });
    
    return elements;
  };
  
  // =============================================
  // RENDER STRING NUMBERS (Left side, 6 to 1)
  // =============================================
  
  const renderStringNumbers = () => {
    return Array.from({ length: numStrings }, (_, i) => {
      const stringNum = 6 - i; // 6 at top, 1 at bottom
      const y = topPadding + i * stringSpacing;
      return (
        <SvgText
          key={`string-num-${i}`}
          x={12}
          y={y + 4}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={11}
          fontWeight="600"
        >
          {stringNum}
        </SvgText>
      );
    });
  };
  
  // =============================================
  // RENDER FRET NUMBERS (Bottom)
  // =============================================
  
  const renderFretNumbers = () => {
    const elements: JSX.Element[] = [];
    
    for (let i = 0; i <= numFrets; i++) {
      const fretNum = path.startFret + i;
      const x = leftPadding + (i + 0.5) * fretSpacing;
      elements.push(
        <SvgText
          key={`fret-num-${i}`}
          x={x}
          y={fretboardHeight - 6}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={10}
          fontWeight="500"
        >
          {fretNum}
        </SvgText>
      );
    }
    
    return elements;
  };
  
  // =============================================
  // RENDER TECHNIQUE CONNECTORS
  // =============================================
  
  const renderConnectors = () => {
    const connectors: JSX.Element[] = [];
    
    for (let i = 1; i < path.notes.length; i++) {
      const note = path.notes[i];
      const prevNote = path.notes[i - 1];
      
      if (note.technique) {
        const fromPos = computeNotePosition(prevNote.position.fret, prevNote.position.string);
        const toPos = computeNotePosition(note.position.fret, note.position.string);
        
        const isActive = currentNoteIndex === i || currentNoteIndex === i - 1;
        
        connectors.push(
          <TechniqueConnector
            key={`connector-${i}`}
            fromX={fromPos.x}
            fromY={fromPos.y}
            toX={toPos.x}
            toY={toPos.y}
            technique={note.technique}
            scale={scale}
            isActive={isActive}
          />
        );
      }
    }
    
    return connectors;
  };
  
  // =============================================
  // RENDER NOTE CIRCLES
  // =============================================
  
  const renderNotes = () => {
    // First, create array of notes with their states
    const notesWithStates = path.notes.map((note, index) => {
      const pos = computeNotePosition(note.position.fret, note.position.string);
      const noteName = getNoteName(note.position.string, note.position.fret);
      
      // Determine state
      let state: 'upcoming' | 'active' | 'completed' = 'upcoming';
      if (index === currentNoteIndex) {
        state = 'active';
      } else if (index < currentNoteIndex) {
        state = 'completed';
      }
      
      return { note, pos, noteName, state, index };
    });
    
    // Group by position to avoid overlapping circles
    const uniquePositions = new Map<string, typeof notesWithStates[0]>();
    notesWithStates.forEach(item => {
      const key = `${item.pos.x}-${item.pos.y}`;
      // Prioritize active state, then next upcoming
      const existing = uniquePositions.get(key);
      if (!existing || item.state === 'active' || 
          (item.state === 'upcoming' && existing.state === 'completed')) {
        uniquePositions.set(key, item);
      }
    });
    
    // Render unique positions
    return Array.from(uniquePositions.values()).map(({ note, pos, noteName, state, index }) => {
      // Show finger on active note
      const hasFinger = note.finger !== undefined && note.finger > 0;
      const isActive = state === 'active';
      const showFinger = isActive && hasFinger;
      
      return (
        <NoteCircle
          key={`note-${index}`}
          x={pos.x}
          y={pos.y}
          noteName={noteName}
          finger={note.finger}
          state={state}
          showFinger={showFinger}
          scale={scale}
        />
      );
    });
  };
  
  // =============================================
  // RENDER
  // =============================================
  
  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controlsRow}>
        {/* Finger guides toggle - always visible */}
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            fingerGuidesEnabled && styles.toggleBtnActive
          ]}
          onPress={toggleFingerGuides}
          accessibilityLabel="Mostrar/ocultar número de dedo"
        >
          <Ionicons 
            name="finger-print-outline" 
            size={16} 
            color={fingerGuidesEnabled ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[
            styles.toggleText,
            fingerGuidesEnabled && styles.toggleTextActive
          ]}>
            Dedos {fingerGuidesEnabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
        
        {debugMode && (
          <Text style={styles.debugText}>Beat: {effectiveBeat.toFixed(1)}</Text>
        )}
      </View>
      
      {/* SVG Fretboard */}
      <View style={styles.fretboardContainer}>
        <Svg 
          width={fretboardWidth} 
          height={fretboardHeight}
          viewBox={`0 0 ${fretboardWidth} ${fretboardHeight}`}
        >
          {/* Layer 1: Fretboard base (frets, strings) */}
          {renderFretboard()}
          
          {/* Layer 2: String numbers (left side) */}
          {renderStringNumbers()}
          
          {/* Layer 3: Fret numbers (bottom) */}
          {renderFretNumbers()}
          
          {/* Layer 4: Technique connectors */}
          {renderConnectors()}
          
          {/* Layer 5: Note circles (topmost) */}
          {renderNotes()}
        </Svg>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendCircle}>
            <Text style={styles.legendCircleText}>A</Text>
          </View>
          <Text style={styles.legendText}>Nota</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendCircle, styles.legendCircleActive]}>
            <Text style={styles.legendCircleTextActive}>1</Text>
          </View>
          <Text style={styles.legendText}>Dedo (al pulsar)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendConnector}>
            <Text style={styles.legendConnectorText}>h</Text>
          </View>
          <Text style={styles.legendText}>Técnica</Text>
        </View>
      </View>
    </View>
  );
};

// =============================================
// STYLES
// =============================================

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  toggleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.primary,
  },
  debugText: {
    fontSize: FONTS.sizes.xs,
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  fretboardContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.sm,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCircleActive: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  legendCircleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1F2937',
  },
  legendCircleTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  legendConnector: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: '#6B7280',
    borderRadius: 4,
  },
  legendConnectorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});

export default TechniqueAnimatedFretboardPro;
