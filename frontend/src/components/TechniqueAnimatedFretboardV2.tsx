/**
 * GUITAR GUIDE PRO - ENHANCED ANIMATED TECHNIQUE FRETBOARD V2
 * Premium fretboard visualization with technique-specific animations
 * 
 * Features:
 * - Curved paths for slides (glissando effect)
 * - Elastic arcs for hammer-ons/pull-offs
 * - Vertical arrows for bends
 * - Wave patterns for vibrato
 * - Ghost hand indicators
 * - Direction arrows for movement
 * - Micro-tutorial overlays
 */

import React, { useEffect, useRef, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
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
  RadialGradient,
  Stop,
  Polygon,
  Ellipse,
} from 'react-native-svg';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { FretboardNote, FretboardPath, TechniqueGlyph, TECHNIQUE_SYMBOLS } from '../data/techniqueExercises';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================
// TYPES
// =============================================

interface TechniqueAnimatedFretboardV2Props {
  path: FretboardPath;
  currentBeat: number;
  isPlaying: boolean;
  techniqueColor: string;
  techniqueId?: string;
  onNotePress?: (note: FretboardNote) => void;
  mode?: 'guided' | 'follow' | 'free';
  showTechniqueGlyphs?: boolean;
  showMicroTutorial?: boolean;
  showGhostHand?: boolean;
}

// =============================================
// CONSTANTS
// =============================================

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const FRET_DOTS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const DOUBLE_DOTS = [12];

// Enhanced technique symbols with colors
const TECHNIQUE_VISUALS: Record<string, { symbol: string; color: string; animation: string }> = {
  'h': { symbol: 'H', color: '#9B59B6', animation: 'bounce' },
  'p': { symbol: 'P', color: '#E67E22', animation: 'bounce' },
  '/': { symbol: '↗', color: '#3498DB', animation: 'slide' },
  '\\': { symbol: '↘', color: '#3498DB', animation: 'slide' },
  'b': { symbol: '⤴', color: '#E74C3C', animation: 'bend' },
  'r': { symbol: '⤵', color: '#E74C3C', animation: 'bend' },
  '~': { symbol: '∿', color: '#2ECC71', animation: 'wave' },
  'x': { symbol: '×', color: '#95A5A6', animation: 'none' },
  'PM': { symbol: 'PM', color: '#34495E', animation: 'pulse' },
  '>': { symbol: '>', color: '#F39C12', animation: 'accent' },
  'sl': { symbol: '⌒', color: '#1ABC9C', animation: 'legato' },
  'tr': { symbol: 'tr', color: '#9B59B6', animation: 'trill' },
};

// =============================================
// MICRO TUTORIAL MODAL
// =============================================

interface MicroTutorialProps {
  visible: boolean;
  technique?: TechniqueGlyph;
  onClose: () => void;
}

const MicroTutorial: React.FC<MicroTutorialProps> = ({ visible, technique, onClose }) => {
  if (!technique) return null;
  
  const symbol = TECHNIQUE_SYMBOLS.find(s => s.symbol === technique);
  if (!symbol) return null;
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.tutorialOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.tutorialCard}>
          <View style={styles.tutorialHeader}>
            <Text style={styles.tutorialSymbol}>{TECHNIQUE_VISUALS[technique]?.symbol || technique}</Text>
            <Text style={styles.tutorialName}>{symbol.name}</Text>
          </View>
          <Text style={styles.tutorialMeaning}>{symbol.meaning}</Text>
          <View style={styles.tutorialSection}>
            <Text style={styles.tutorialSectionTitle}>Cómo ejecutar:</Text>
            <Text style={styles.tutorialText}>{symbol.howToExecute}</Text>
          </View>
          <View style={styles.tutorialSection}>
            <Text style={styles.tutorialSectionTitle}>Mini ejercicio:</Text>
            <Text style={styles.tutorialText}>{symbol.miniExercise}</Text>
          </View>
          <View style={styles.tutorialTab}>
            <Text style={styles.tutorialTabText}>{symbol.tabExample}</Text>
          </View>
          <TouchableOpacity style={styles.tutorialCloseBtn} onPress={onClose}>
            <Text style={styles.tutorialCloseBtnText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

// =============================================
// TECHNIQUE PATH GENERATOR
// =============================================

const generateTechniquePath = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  technique?: TechniqueGlyph
): string => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  switch (technique) {
    case 'h': // Hammer-on: elastic arc upward
      const hArcHeight = -20;
      return `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${Math.min(fromY, toY) + hArcHeight} ${toX} ${toY}`;
      
    case 'p': // Pull-off: elastic arc downward
      const pArcHeight = 20;
      return `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${Math.max(fromY, toY) + pArcHeight} ${toX} ${toY}`;
      
    case '/': // Slide up: smooth curve with direction
      const slideUpOffset = -15;
      return `M ${fromX} ${fromY} C ${fromX + dx * 0.3} ${fromY + slideUpOffset} ${toX - dx * 0.3} ${toY + slideUpOffset} ${toX} ${toY}`;
      
    case '\\': // Slide down: smooth curve
      const slideDownOffset = 15;
      return `M ${fromX} ${fromY} C ${fromX + dx * 0.3} ${fromY + slideDownOffset} ${toX - dx * 0.3} ${toY + slideDownOffset} ${toX} ${toY}`;
      
    case 'b': // Bend: vertical curve upward
      return `M ${fromX} ${fromY} Q ${fromX} ${fromY - 25} ${fromX + 5} ${fromY - 30}`;
      
    case 'r': // Release: vertical curve downward
      return `M ${fromX} ${fromY - 30} Q ${fromX} ${fromY - 5} ${fromX} ${fromY}`;
      
    case '~': // Vibrato: wave pattern
      const waveAmp = 5;
      const waves = 4;
      let vibPath = `M ${fromX} ${fromY}`;
      for (let i = 0; i < waves; i++) {
        const wx = fromX + (i + 0.5) * 8;
        const wy = fromY + (i % 2 === 0 ? -waveAmp : waveAmp);
        vibPath += ` Q ${wx - 4} ${wy} ${wx} ${fromY}`;
      }
      return vibPath;
      
    case 'sl': // Legato: smooth connection
      return `M ${fromX} ${fromY} C ${fromX + dx * 0.4} ${fromY} ${toX - dx * 0.4} ${toY} ${toX} ${toY}`;
      
    default: // Default: simple quadratic curve
      return `M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2 - 10} ${toX} ${toY}`;
  }
};

// =============================================
// DIRECTION ARROW
// =============================================

interface DirectionArrowProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
}

const DirectionArrow: React.FC<DirectionArrowProps> = ({ fromX, fromY, toX, toY, color }) => {
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  
  return (
    <G transform={`translate(${midX}, ${midY}) rotate(${angle})`}>
      <Polygon
        points="0,-4 8,0 0,4"
        fill={color}
        opacity={0.7}
      />
    </G>
  );
};

// =============================================
// GHOST HAND INDICATOR
// =============================================

interface GhostHandProps {
  x: number;
  y: number;
  finger: number;
  technique?: TechniqueGlyph;
  color: string;
}

const GhostHand: React.FC<GhostHandProps> = ({ x, y, finger, technique, color }) => {
  // Simple finger indicator showing which finger to use
  const fingerLabels = ['', 'Índice', 'Medio', 'Anular', 'Meñique'];
  
  return (
    <G>
      {/* Finger circle */}
      <Circle
        cx={x}
        cy={y - 30}
        r={10}
        fill={color}
        opacity={0.3}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <SvgText
        x={x}
        y={y - 26}
        textAnchor="middle"
        fill={color}
        fontSize={8}
        fontWeight="bold"
      >
        {finger}
      </SvgText>
      
      {/* Movement hint based on technique */}
      {technique === 'h' && (
        <Path
          d={`M ${x} ${y - 20} L ${x} ${y - 8}`}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="2 2"
          markerEnd="url(#arrowDown)"
        />
      )}
      {technique === 'p' && (
        <Path
          d={`M ${x} ${y - 8} C ${x - 8} ${y - 4} ${x - 8} ${y + 4} ${x - 12} ${y}`}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="2 2"
          fill="none"
        />
      )}
    </G>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================

export const TechniqueAnimatedFretboardV2: React.FC<TechniqueAnimatedFretboardV2Props> = ({
  path,
  currentBeat,
  isPlaying,
  techniqueColor,
  techniqueId,
  onNotePress,
  mode = 'guided',
  showTechniqueGlyphs = true,
  showMicroTutorial = true,
  showGhostHand = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [selectedTechnique, setSelectedTechnique] = useState<TechniqueGlyph | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Fretboard dimensions
  const fretboardWidth = SCREEN_WIDTH - SPACING.lg * 2;
  const fretboardHeight = 220;
  const topPadding = 30;
  const bottomPadding = 35;
  const stringAreaHeight = fretboardHeight - topPadding - bottomPadding;
  const stringSpacing = stringAreaHeight / 5;
  const nutWidth = 14;
  
  // Calculate fret range
  const startFret = path.startFret;
  const endFret = path.endFret;
  const numFrets = endFret - startFret + 1;
  const fretWidth = (fretboardWidth - nutWidth) / numFrets;
  
  // Animations
  useEffect(() => {
    if (isPlaying) {
      // Pulse animation for active note
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Glow animation for path
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
    
    return () => {
      pulseAnim.stopAnimation();
      glowAnim.stopAnimation();
    };
  }, [isPlaying]);
  
  // Calculate note states
  const { uniqueNotes, noteStates, activeNoteIndex } = useMemo(() => {
    const seenPositions = new Map<string, number>();
    const uniqueNotesList: typeof path.notes = [];
    
    path.notes.forEach((note) => {
      const posKey = `${note.position.string}-${note.position.fret}`;
      if (!seenPositions.has(posKey)) {
        seenPositions.set(posKey, uniqueNotesList.length);
        uniqueNotesList.push(note);
      }
    });
    
    let states: string[];
    let activeIdx = 0;
    
    if (!isPlaying) {
      states = uniqueNotesList.map((_, index) => index === 0 ? 'active' : 'upcoming');
    } else {
      const loopBeat = ((currentBeat - 1) % path.beatsPerLoop) + 1;
      
      const currentNoteIndex = path.notes.findIndex((note) => {
        const noteStart = note.timing;
        const noteEnd = noteStart + note.duration;
        return loopBeat >= noteStart && loopBeat < noteEnd;
      });
      
      const currentNote = currentNoteIndex >= 0 ? path.notes[currentNoteIndex] : null;
      const currentPosKey = currentNote ? `${currentNote.position.string}-${currentNote.position.fret}` : '';
      
      states = uniqueNotesList.map((note, index) => {
        const posKey = `${note.position.string}-${note.position.fret}`;
        if (posKey === currentPosKey) {
          activeIdx = index;
          return 'active';
        }
        const noteInPath = path.notes.find(n => 
          n.position.string === note.position.string && n.position.fret === note.position.fret
        );
        if (noteInPath && noteInPath.timing > loopBeat) return 'upcoming';
        return 'completed';
      });
    }
    
    return { uniqueNotes: uniqueNotesList, noteStates: states, activeNoteIndex: activeIdx };
  }, [currentBeat, path, isPlaying]);
  
  // Position helpers
  const getFretX = (fret: number): number => {
    const relativeFret = fret - startFret;
    return nutWidth + (relativeFret * fretWidth) + (fretWidth / 2);
  };
  
  const getStringY = (string: number): number => {
    return topPadding + ((string - 1) * stringSpacing);
  };
  
  // Get colors for note state
  const getNoteColors = (state: string, technique?: TechniqueGlyph) => {
    const techVisual = technique ? TECHNIQUE_VISUALS[technique] : null;
    
    switch (state) {
      case 'active':
        return { 
          fill: techVisual?.color || techniqueColor, 
          stroke: '#FFFFFF', 
          opacity: 1,
          glowColor: techVisual?.color || techniqueColor,
        };
      case 'upcoming':
        return { 
          fill: COLORS.secondaryDark, 
          stroke: COLORS.secondary, 
          opacity: 0.7,
          glowColor: 'transparent',
        };
      case 'completed':
        return { 
          fill: COLORS.completedNote || '#4A5568', 
          stroke: COLORS.success, 
          opacity: 0.4,
          glowColor: 'transparent',
        };
      default:
        return { 
          fill: COLORS.surfaceLight, 
          stroke: COLORS.textMuted, 
          opacity: 0.5,
          glowColor: 'transparent',
        };
    }
  };
  
  // Handle technique glyph tap
  const handleTechniqueTap = (technique: TechniqueGlyph) => {
    if (showMicroTutorial) {
      setSelectedTechnique(technique);
      setShowTutorial(true);
    }
  };
  
  // Render technique-specific paths between notes
  const renderTechniquePaths = () => {
    if (path.notes.length < 2) return null;
    
    const paths: JSX.Element[] = [];
    
    for (let i = 0; i < path.notes.length - 1; i++) {
      const note = path.notes[i];
      const nextNote = path.notes[i + 1];
      
      const fromX = getFretX(note.position.fret);
      const fromY = getStringY(note.position.string);
      const toX = getFretX(nextNote.position.fret);
      const toY = getStringY(nextNote.position.string);
      
      const technique = nextNote.technique;
      const techVisual = technique ? TECHNIQUE_VISUALS[technique] : null;
      const pathColor = techVisual?.color || techniqueColor;
      
      // Generate technique-specific path
      const pathD = generateTechniquePath(fromX, fromY, toX, toY, technique);
      
      // Determine if this path segment is active
      const isActiveSegment = noteStates[i] === 'active' || noteStates[i + 1] === 'active';
      
      paths.push(
        <G key={`path-${i}`}>
          {/* Glow effect for active paths */}
          {isActiveSegment && isPlaying && (
            <Path
              d={pathD}
              fill="none"
              stroke={pathColor}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={0.2}
            />
          )}
          
          {/* Main path */}
          <Path
            d={pathD}
            fill="none"
            stroke={pathColor}
            strokeWidth={isActiveSegment ? 3 : 2}
            strokeLinecap="round"
            strokeDasharray={isActiveSegment ? "0" : "6 4"}
            opacity={isActiveSegment ? 0.8 : 0.4}
          />
          
          {/* Direction arrow for slides and position shifts */}
          {(technique === '/' || technique === '\\' || !technique) && Math.abs(toX - fromX) > 30 && (
            <DirectionArrow
              fromX={fromX}
              fromY={fromY}
              toX={toX}
              toY={toY}
              color={pathColor}
            />
          )}
        </G>
      );
    }
    
    return paths;
  };
  
  // Render note markers
  const renderNotes = () => {
    return uniqueNotes.map((note, index) => {
      const x = getFretX(note.position.fret);
      const y = getStringY(note.position.string);
      const state = noteStates[index];
      const colors = getNoteColors(state, note.technique);
      const isActive = state === 'active';
      const radius = isActive ? 16 : 13;
      
      const techVisual = note.technique ? TECHNIQUE_VISUALS[note.technique] : null;
      
      return (
        <G key={`note-${index}`}>
          {/* Outer glow for active notes */}
          {isActive && (
            <>
              <Circle
                cx={x}
                cy={y}
                r={radius + 10}
                fill={colors.glowColor}
                opacity={0.15}
              />
              <Circle
                cx={x}
                cy={y}
                r={radius + 5}
                fill={colors.glowColor}
                opacity={0.25}
              />
            </>
          )}
          
          {/* Main note circle */}
          <Circle
            cx={x}
            cy={y}
            r={radius}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={isActive ? 3 : 1.5}
            opacity={colors.opacity}
          />
          
          {/* Root note indicator */}
          {note.isRoot && (
            <Circle
              cx={x}
              cy={y}
              r={radius - 4}
              fill="none"
              stroke="#FFD700"
              strokeWidth={2}
              strokeDasharray="4 2"
            />
          )}
          
          {/* Finger number */}
          {note.finger && state !== 'completed' && (
            <SvgText
              x={x}
              y={y + 4}
              textAnchor="middle"
              fill={isActive ? '#FFFFFF' : COLORS.textMuted}
              fontSize={11}
              fontWeight="bold"
            >
              {note.finger}
            </SvgText>
          )}
          
          {/* Technique glyph badge */}
          {showTechniqueGlyphs && note.technique && state !== 'completed' && (
            <G onPress={() => handleTechniqueTap(note.technique!)}>
              <Circle
                cx={x + 14}
                cy={y - 14}
                r={10}
                fill={techVisual?.color || COLORS.backgroundCard}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
              <SvgText
                x={x + 14}
                y={y - 10}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={9}
                fontWeight="bold"
              >
                {techVisual?.symbol || note.technique}
              </SvgText>
            </G>
          )}
          
          {/* Ghost hand for active note */}
          {showGhostHand && isActive && note.finger && isPlaying && (
            <GhostHand
              x={x}
              y={y}
              finger={note.finger}
              technique={note.technique}
              color={colors.fill}
            />
          )}
        </G>
      );
    });
  };
  
  // Render strings
  const renderStrings = () => {
    return STRING_NAMES.map((name, index) => {
      const y = getStringY(index + 1);
      const thickness = 1 + (index * 0.35);
      
      return (
        <G key={`string-${index}`}>
          <Line
            x1={nutWidth}
            y1={y}
            x2={fretboardWidth}
            y2={y}
            stroke={COLORS.string || '#B8860B'}
            strokeWidth={thickness}
            opacity={0.5}
          />
          <SvgText
            x={5}
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
    const frets: JSX.Element[] = [];
    const firstStringY = getStringY(1);
    const lastStringY = getStringY(6);
    
    // Nut
    frets.push(
      <Rect
        key="nut"
        x={nutWidth - 5}
        y={firstStringY - 5}
        width={7}
        height={lastStringY - firstStringY + 10}
        fill={COLORS.fret || '#D4A574'}
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
          y1={firstStringY - 5}
          x2={x}
          y2={lastStringY + 5}
          stroke={COLORS.fret || '#C0C0C0'}
          strokeWidth={1.5}
          opacity={0.35}
        />
      );
    }
    
    return frets;
  };
  
  // Render fret markers and numbers
  const renderFretMarkers = () => {
    const markers: JSX.Element[] = [];
    
    for (let fret = startFret; fret <= endFret; fret++) {
      const x = getFretX(fret);
      
      // Fret number
      markers.push(
        <SvgText
          key={`fret-num-${fret}`}
          x={x}
          y={fretboardHeight - 6}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={10}
          fontWeight="500"
        >
          {fret}
        </SvgText>
      );
      
      // Fret dots
      if (FRET_DOTS.includes(fret)) {
        const isDouble = DOUBLE_DOTS.includes(fret);
        if (isDouble) {
          markers.push(
            <Circle key={`dot-${fret}-1`} cx={x} cy={getStringY(2)} r={4} fill={COLORS.textMuted} opacity={0.25} />
          );
          markers.push(
            <Circle key={`dot-${fret}-2`} cx={x} cy={getStringY(5)} r={4} fill={COLORS.textMuted} opacity={0.25} />
          );
        } else {
          markers.push(
            <Circle key={`dot-${fret}`} cx={x} cy={getStringY(3.5)} r={4} fill={COLORS.textMuted} opacity={0.25} />
          );
        }
      }
    }
    
    return markers;
  };
  
  return (
    <View style={styles.container}>
      {/* Mode indicator */}
      <View style={styles.modeIndicator}>
        <Text style={[styles.modeText, { color: techniqueColor }]}>
          {mode === 'guided' ? '🎯 Guiado' : mode === 'follow' ? '👀 Seguimiento' : '🎸 Libre'}
        </Text>
      </View>
      
      {/* Fretboard SVG */}
      <View style={styles.fretboardContainer}>
        <Svg 
          width={fretboardWidth} 
          height={fretboardHeight}
          viewBox={`0 0 ${fretboardWidth} ${fretboardHeight}`}
        >
          <Defs>
            <LinearGradient id="fretboardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#2D1F1A" stopOpacity={1} />
              <Stop offset="100%" stopColor="#1A0F0A" stopOpacity={1} />
            </LinearGradient>
            <RadialGradient id="noteGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={techniqueColor} stopOpacity={0.6} />
              <Stop offset="100%" stopColor={techniqueColor} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          
          {/* Fretboard wood background */}
          <Rect
            x={0}
            y={topPadding - 10}
            width={fretboardWidth}
            height={stringAreaHeight + 20}
            fill="url(#fretboardGrad)"
            rx={6}
          />
          
          {/* Frets */}
          {renderFrets()}
          
          {/* Fret markers */}
          {renderFretMarkers()}
          
          {/* Strings */}
          {renderStrings()}
          
          {/* Technique paths */}
          {renderTechniquePaths()}
          
          {/* Notes */}
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
          <View style={[styles.legendDot, { backgroundColor: COLORS.secondaryDark, opacity: 0.7 }]} />
          <Text style={styles.legendText}>Próxima</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4A5568' }]} />
          <Text style={styles.legendText}>Hecha</Text>
        </View>
        {uniqueNotes.some(n => n.isRoot) && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendRoot]} />
            <Text style={styles.legendText}>Raíz</Text>
          </View>
        )}
      </View>
      
      {/* Symbol legend hint */}
      {showTechniqueGlyphs && uniqueNotes.some(n => n.technique) && (
        <Text style={styles.tapHint}>
          Toca los símbolos de técnica para ver instrucciones
        </Text>
      )}
      
      {/* Micro Tutorial Modal */}
      <MicroTutorial
        visible={showTutorial}
        technique={selectedTechnique || undefined}
        onClose={() => setShowTutorial(false)}
      />
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
  modeIndicator: {
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  modeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
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
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendRoot: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  tapHint: {
    textAlign: 'center',
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
  
  // Tutorial styles
  tutorialOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  tutorialCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 340,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  tutorialSymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
  },
  tutorialName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  tutorialMeaning: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 22,
  },
  tutorialSection: {
    marginBottom: SPACING.md,
  },
  tutorialSectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  tutorialText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tutorialTab: {
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  tutorialTabText: {
    fontFamily: 'monospace',
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    textAlign: 'center',
  },
  tutorialCloseBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  tutorialCloseBtnText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TechniqueAnimatedFretboardV2;
