/**
 * GUITAR GUIDE PRO - ANIMATED TECHNIQUE FRETBOARD PRO
 * Enhanced fretboard with Ghost Hand, Symbol Legend, and improved UX
 * 
 * Features:
 * A) Ghost Hand - Semi-transparent hand overlay showing movement
 *    - Toggle ON/OFF with persistence
 *    - High visibility with stroke + shadow
 *    - Clear finger identification
 * B) Symbol Legend - Dictionary of all technique symbols and colors
 * 
 * IMPORTANT: All positioning uses SVG coordinates from fretboardBBox
 * No screen pixels (window, clientWidth) for SVG internal elements
 */

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  ScrollView,
  Switch,
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
  Ellipse,
  Polygon,
  Filter,
  FeDropShadow,
  FeGaussianBlur,
  FeMerge,
  FeMergeNode,
} from 'react-native-svg';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { FretboardNote, FretboardPath, TechniqueGlyph, TechniqueSymbol, TECHNIQUE_SYMBOLS } from '../data/techniqueExercises';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================
// CONSTANTS
// =============================================

const GHOST_HAND_STORAGE_KEY = '@guitar_guide_ghost_hand_enabled';

// Ghost Hand Visual Config - OPTIMIZED FOR VISIBILITY
const GHOST_HAND_CONFIG = {
  // Opacidad principal: 55-65% como requiere el PRD
  baseOpacity: 0.60,
  activeOpacity: 0.65,
  movingOpacity: 0.55,
  
  // Colores con buen contraste
  handColor: '#E8F4FD', // Azul muy claro / blanco cálido
  strokeColor: '#FFFFFF', // Contorno blanco
  shadowColor: '#000000', // Sombra negra
  fingerHighlightColor: '#4ECDC4', // Teal para dedo activo
  
  // Stroke para separación del fondo
  strokeWidth: 2,
  strokeOpacity: 0.85,
  
  // Shadow/glow
  shadowBlur: 3,
  shadowOpacity: 0.4,
  glowRadius: 6,
  glowOpacity: 0.25,
};

// =============================================
// TYPES
// =============================================

interface FretboardBBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GhostHandPose {
  x: number;
  y: number;
  finger?: number;
  technique?: TechniqueGlyph;
}

interface NotePosition {
  x: number;
  y: number;
  fret: number;
  string: number;
}

// =============================================
// SYMBOL LEGEND DATA (Source of Truth)
// =============================================

interface SymbolLegendItem {
  symbol: string;
  displaySymbol: string;
  name: string;
  meaning: string;
  howToExecute: string;
  example: string;
  color: string;
}

const SYMBOLS_LEGEND: SymbolLegendItem[] = [
  {
    symbol: 'h',
    displaySymbol: 'H',
    name: 'Hammer-on',
    meaning: 'Golpear la cuerda con el dedo sin usar la púa',
    howToExecute: 'Mantén el primer dedo presionado y golpea fuerte con otro dedo',
    example: '5h7',
    color: '#9B59B6',
  },
  {
    symbol: 'p',
    displaySymbol: 'P',
    name: 'Pull-off',
    meaning: 'Tirar del dedo para hacer sonar la nota inferior',
    howToExecute: 'Tira el dedo hacia abajo (como un pequeño rasgueo) al levantarlo',
    example: '7p5',
    color: '#E67E22',
  },
  {
    symbol: '/',
    displaySymbol: '/',
    name: 'Slide Ascendente',
    meaning: 'Deslizar el dedo hacia arriba (notas más agudas)',
    howToExecute: 'Mantén presión constante mientras deslizas hacia el cuerpo',
    example: '5/7',
    color: '#3498DB',
  },
  {
    symbol: '\\',
    displaySymbol: '\\',
    name: 'Slide Descendente',
    meaning: 'Deslizar el dedo hacia abajo (notas más graves)',
    howToExecute: 'Mantén presión mientras deslizas hacia la cejuela',
    example: '7\\5',
    color: '#3498DB',
  },
  {
    symbol: 'b',
    displaySymbol: '↑',
    name: 'Bend',
    meaning: 'Empujar la cuerda para subir el tono',
    howToExecute: 'Empuja la cuerda hacia arriba (o abajo en cuerdas graves) girando la muñeca',
    example: '7b9',
    color: '#E74C3C',
  },
  {
    symbol: 'r',
    displaySymbol: '↓',
    name: 'Release',
    meaning: 'Soltar el bend para volver al tono original',
    howToExecute: 'Baja lentamente la cuerda a su posición normal',
    example: '9r7',
    color: '#E74C3C',
  },
  {
    symbol: '~',
    displaySymbol: '∿',
    name: 'Vibrato',
    meaning: 'Oscilación rápida del tono para expresividad',
    howToExecute: 'Mueve el dedo rápidamente arriba y abajo como mini-bends',
    example: '7~~~',
    color: '#2ECC71',
  },
  {
    symbol: 'PM',
    displaySymbol: 'PM',
    name: 'Palm Mute',
    meaning: 'Amortiguar las cuerdas con la palma',
    howToExecute: 'Apoya el borde de la palma sobre las cuerdas cerca del puente',
    example: 'PM---|',
    color: '#34495E',
  },
  {
    symbol: 'x',
    displaySymbol: '×',
    name: 'Dead Note / Mute',
    meaning: 'Nota silenciada, sonido percusivo',
    howToExecute: 'Toca la cuerda sin presionar completamente el traste',
    example: 'x-x-x',
    color: '#7F8C8D',
  },
  {
    symbol: '>',
    displaySymbol: '>',
    name: 'Acento',
    meaning: 'Nota tocada con más fuerza',
    howToExecute: 'Ataca la cuerda con más intensidad',
    example: '>5',
    color: '#F39C12',
  },
  {
    symbol: 'sl',
    displaySymbol: '⌒',
    name: 'Legato Slur',
    meaning: 'Conexión suave entre notas',
    howToExecute: 'Une las notas sin separación, usando hammer/pull',
    example: '5⌒7',
    color: '#1ABC9C',
  },
  {
    symbol: 'tr',
    displaySymbol: 'tr',
    name: 'Trill',
    meaning: 'Alternancia rápida entre dos notas',
    howToExecute: 'Hammer-on y pull-off repetidos muy rápido',
    example: '5tr7',
    color: '#9B59B6',
  },
];

// Color meanings for the fretboard
interface ColorMeaning {
  color: string;
  name: string;
  meaning: string;
}

const FRETBOARD_COLORS: ColorMeaning[] = [
  { color: '#F5A623', name: 'Ámbar/Naranja', meaning: 'Nota ACTIVA - Tócala ahora' },
  { color: '#4ECDC4', name: 'Teal/Verde-Azul', meaning: 'Nota PRÓXIMA - Prepárate' },
  { color: '#4A5568', name: 'Gris', meaning: 'Nota COMPLETADA - Ya la tocaste' },
  { color: '#FFD700', name: 'Dorado (borde)', meaning: 'Nota RAÍZ - Fundamental de la escala' },
  { color: '#9B59B6', name: 'Púrpura', meaning: 'Hammer-on' },
  { color: '#E67E22', name: 'Naranja oscuro', meaning: 'Pull-off' },
  { color: '#3498DB', name: 'Azul', meaning: 'Slide' },
  { color: '#E74C3C', name: 'Rojo', meaning: 'Bend / Release' },
];

// =============================================
// CONSTANTS
// =============================================

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const FRET_DOTS = [3, 5, 7, 9, 12, 15, 17, 19, 21];
const DOUBLE_DOTS = [12];

const TECHNIQUE_GLYPHS: Record<TechniqueGlyph, string> = {
  'h': 'H', 'p': 'P', '/': '/', '\\': '\\',
  'b': '↑', 'r': '↓', '~': '∿', 'x': '×',
  'PM': 'PM', '>': '>', 'sl': '⌒', 'tr': 'tr',
};

// Techniques that trigger ghost hand
const GHOST_HAND_TECHNIQUES: TechniqueGlyph[] = ['h', 'p', '/', '\\', 'b', 'r', '~', 'PM'];

// =============================================
// GHOST HAND SVG COMPONENT
// =============================================

interface GhostHandProps {
  poseA: GhostHandPose | null;
  poseB: GhostHandPose;
  fretboardBBox: FretboardBBox;
  color: string;
  showArrow: boolean;
  animationPhase: 'start' | 'moving' | 'end' | 'hidden';
  finger?: number;
  debugMode?: boolean;
}

const GhostHandSVG: React.FC<GhostHandProps> = ({
  poseA,
  poseB,
  fretboardBBox,
  color,
  showArrow,
  animationPhase,
  finger,
  debugMode = false,
}) => {
  if (animationPhase === 'hidden') return null;
  
  // Calculate hand size relative to fretboard (not screen pixels!)
  const handScale = fretboardBBox.height / 145; // Relative to bbox height
  const palmWidth = 18 * handScale;
  const palmHeight = 22 * handScale;
  const fingerWidth = 4 * handScale;
  const fingerHeight = 14 * handScale;
  const fingerGap = 1.5 * handScale;
  
  // Offset from note position (relative to fretboard, not px)
  const handOffsetY = -palmHeight * 0.3;
  const handOffsetX = -palmWidth * 0.5;
  
  // Current position based on animation phase
  let currentX = poseB.x;
  let currentY = poseB.y;
  let opacity = 0.45; // Increased base opacity for better visibility
  
  if (animationPhase === 'start' && poseA) {
    currentX = poseA.x;
    currentY = poseA.y;
    opacity = 0.5;
  } else if (animationPhase === 'moving' && poseA) {
    // Interpolate between A and B (50% for now - could be animated)
    currentX = (poseA.x + poseB.x) / 2;
    currentY = (poseA.y + poseB.y) / 2;
    opacity = 0.45;
  } else if (animationPhase === 'end') {
    opacity = 0.4;
  }
  
  // Validate positions are within fretboard
  const isWithinBBox = (x: number, y: number) => {
    return x >= fretboardBBox.x && 
           x <= fretboardBBox.x + fretboardBBox.width &&
           y >= fretboardBBox.y && 
           y <= fretboardBBox.y + fretboardBBox.height;
  };
  
  // Render simple hand (palm + 4 fingers)
  const renderSimpleHand = (x: number, y: number, handOpacity: number) => {
    const palmX = x + handOffsetX;
    const palmY = y + handOffsetY;
    const fingersStartY = palmY - fingerHeight;
    
    // Validate position
    if (!isWithinBBox(x, y)) {
      if (debugMode) {
        console.warn('[GhostHand] Position outside fretboard bbox:', { x, y, fretboardBBox });
      }
    }
    
    return (
      <G opacity={handOpacity}>
        {/* Outer glow for visibility */}
        <Ellipse
          cx={palmX + palmWidth / 2}
          cy={palmY + palmHeight / 2}
          rx={palmWidth / 2 + 4 * handScale}
          ry={palmHeight / 2 + 4 * handScale}
          fill={color}
          opacity={0.15}
        />
        
        {/* Palm - Ellipse */}
        <Ellipse
          cx={palmX + palmWidth / 2}
          cy={palmY + palmHeight / 2}
          rx={palmWidth / 2}
          ry={palmHeight / 2}
          fill={color}
          opacity={0.5}
          stroke={color}
          strokeWidth={1.5 * handScale}
        />
        
        {/* Fingers - 4 rectangles */}
        {[0, 1, 2, 3].map((i) => {
          const fingerX = palmX + (fingerWidth + fingerGap) * i + fingerGap;
          return (
            <Rect
              key={`finger-${i}`}
              x={fingerX}
              y={fingersStartY}
              width={fingerWidth}
              height={fingerHeight}
              rx={fingerWidth / 2}
              ry={fingerWidth / 2}
              fill={color}
              opacity={0.45}
              stroke={color}
              strokeWidth={0.75 * handScale}
            />
          );
        })}
        
        {/* Finger number indicator if specified */}
        {finger && (
          <G>
            <Circle
              cx={palmX + palmWidth / 2}
              cy={fingersStartY - 6 * handScale}
              r={9 * handScale}
              fill={color}
              opacity={0.8}
            />
            <SvgText
              x={palmX + palmWidth / 2}
              y={fingersStartY - 3 * handScale}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={10 * handScale}
              fontWeight="bold"
            >
              {finger}
            </SvgText>
          </G>
        )}
      </G>
    );
  };
  
  // Render movement arrow from A to B
  const renderArrow = () => {
    if (!showArrow || !poseA) return null;
    
    const arrowHeadSize = 6 * handScale;
    const angle = Math.atan2(poseB.y - poseA.y, poseB.x - poseA.x);
    
    // Arrow line
    const midX = (poseA.x + poseB.x) / 2;
    const midY = (poseA.y + poseB.y) / 2 - 15 * handScale;
    
    // Calculate arrow head points
    const arrowTipX = poseB.x;
    const arrowTipY = poseB.y - 10 * handScale;
    const arrowBackX = arrowTipX - arrowHeadSize * Math.cos(angle);
    const arrowBackY = arrowTipY - arrowHeadSize * Math.sin(angle);
    const arrowLeft = {
      x: arrowBackX - arrowHeadSize * 0.5 * Math.cos(angle + Math.PI / 2),
      y: arrowBackY - arrowHeadSize * 0.5 * Math.sin(angle + Math.PI / 2),
    };
    const arrowRight = {
      x: arrowBackX - arrowHeadSize * 0.5 * Math.cos(angle - Math.PI / 2),
      y: arrowBackY - arrowHeadSize * 0.5 * Math.sin(angle - Math.PI / 2),
    };
    
    // Determine if slide (dashed line)
    const isSlide = poseB.technique === '/' || poseB.technique === '\\';
    
    return (
      <G opacity={0.4}>
        {/* Movement path */}
        <Path
          d={`M ${poseA.x} ${poseA.y - 10 * handScale} Q ${midX} ${midY} ${arrowTipX} ${arrowTipY}`}
          fill="none"
          stroke={color}
          strokeWidth={2 * handScale}
          strokeDasharray={isSlide ? `${4 * handScale} ${3 * handScale}` : '0'}
          strokeLinecap="round"
        />
        
        {/* Arrow head */}
        <Polygon
          points={`${arrowTipX},${arrowTipY} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
          fill={color}
        />
      </G>
    );
  };
  
  return (
    <G id="ghost-hand-layer">
      {/* Debug: Show fretboard bbox */}
      {debugMode && (
        <Rect
          x={fretboardBBox.x}
          y={fretboardBBox.y}
          width={fretboardBBox.width}
          height={fretboardBBox.height}
          fill="none"
          stroke="#FF0000"
          strokeWidth={1}
          strokeDasharray="4 2"
        />
      )}
      
      {/* Arrow/trail from A to B */}
      {renderArrow()}
      
      {/* Ghost hand at current position */}
      {renderSimpleHand(currentX, currentY, opacity)}
      
      {/* If showing start, also show ghost at pose A */}
      {animationPhase === 'moving' && poseA && (
        renderSimpleHand(poseA.x, poseA.y, 0.1)
      )}
    </G>
  );
};

// =============================================
// SYMBOL LEGEND MODAL
// =============================================

interface SymbolLegendModalProps {
  visible: boolean;
  onClose: () => void;
}

const SymbolLegendModal: React.FC<SymbolLegendModalProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'symbols' | 'colors'>('symbols');
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={legendStyles.overlay}>
        <View style={legendStyles.container}>
          {/* Header */}
          <View style={legendStyles.header}>
            <Text style={legendStyles.title}>Diccionario de Símbolos</Text>
            <TouchableOpacity onPress={onClose} style={legendStyles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          {/* Tabs */}
          <View style={legendStyles.tabs}>
            <TouchableOpacity 
              style={[legendStyles.tab, activeTab === 'symbols' && legendStyles.tabActive]}
              onPress={() => setActiveTab('symbols')}
            >
              <Ionicons name="musical-notes" size={18} color={activeTab === 'symbols' ? COLORS.primary : COLORS.textMuted} />
              <Text style={[legendStyles.tabText, activeTab === 'symbols' && legendStyles.tabTextActive]}>
                Símbolos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[legendStyles.tab, activeTab === 'colors' && legendStyles.tabActive]}
              onPress={() => setActiveTab('colors')}
            >
              <Ionicons name="color-palette" size={18} color={activeTab === 'colors' ? COLORS.primary : COLORS.textMuted} />
              <Text style={[legendStyles.tabText, activeTab === 'colors' && legendStyles.tabTextActive]}>
                Colores
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <ScrollView style={legendStyles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'symbols' ? (
              <View style={legendStyles.symbolsList}>
                {SYMBOLS_LEGEND.map((item, index) => (
                  <View key={item.symbol} style={legendStyles.symbolItem}>
                    <View style={[legendStyles.symbolBadge, { backgroundColor: item.color }]}>
                      <Text style={legendStyles.symbolBadgeText}>{item.displaySymbol}</Text>
                    </View>
                    <View style={legendStyles.symbolInfo}>
                      <Text style={legendStyles.symbolName}>{item.name}</Text>
                      <Text style={legendStyles.symbolMeaning}>{item.meaning}</Text>
                      <View style={legendStyles.symbolDetails}>
                        <Text style={legendStyles.symbolHow}>
                          <Text style={legendStyles.symbolLabel}>Cómo: </Text>
                          {item.howToExecute}
                        </Text>
                        <View style={legendStyles.symbolExampleBox}>
                          <Text style={legendStyles.symbolExample}>{item.example}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={legendStyles.colorsList}>
                <Text style={legendStyles.colorsIntro}>
                  Los colores en el diapasón indican el estado de cada nota:
                </Text>
                {FRETBOARD_COLORS.map((item, index) => (
                  <View key={index} style={legendStyles.colorItem}>
                    <View style={[legendStyles.colorSwatch, { backgroundColor: item.color }]} />
                    <View style={legendStyles.colorInfo}>
                      <Text style={legendStyles.colorName}>{item.name}</Text>
                      <Text style={legendStyles.colorMeaning}>{item.meaning}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// =============================================
// NOTE MARKER COMPONENT
// =============================================

interface NoteMarkerProps {
  note: FretboardNote;
  x: number;
  y: number;
  state: 'active' | 'upcoming' | 'completed' | 'reference';
  techniqueColor: string;
  showGlyph: boolean;
  pulseAnim: Animated.Value;
  scale: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const NoteMarker: React.FC<NoteMarkerProps> = ({
  note,
  x,
  y,
  state,
  techniqueColor,
  showGlyph,
  pulseAnim,
  scale,
}) => {
  const getColors = () => {
    switch (state) {
      case 'active':
        return { fill: techniqueColor, stroke: '#FFFFFF', opacity: 1 };
      case 'upcoming':
        return { fill: COLORS.secondaryDark, stroke: COLORS.secondary, opacity: 0.8 };
      case 'completed':
        return { fill: '#4A5568', stroke: COLORS.success, opacity: 0.5 };
      default:
        return { fill: COLORS.surfaceLight, stroke: COLORS.textMuted, opacity: 0.6 };
    }
  };
  
  const colors = getColors();
  const isActive = state === 'active';
  const radius = isActive ? 13 * scale : 11 * scale;
  
  // Get glyph symbol for technique
  const glyphSymbol = note.technique ? TECHNIQUE_GLYPHS[note.technique] : null;
  const glyphColor = SYMBOLS_LEGEND.find(s => s.symbol === note.technique)?.color || '#FFFFFF';
  
  return (
    <G>
      {/* Glow effect for active notes */}
      {isActive && (
        <>
          <Circle cx={x} cy={y} r={radius + 8 * scale} fill={techniqueColor} opacity={0.15} />
          <Circle cx={x} cy={y} r={radius + 4 * scale} fill={techniqueColor} opacity={0.25} />
        </>
      )}
      
      {/* Main note circle */}
      <Circle
        cx={x}
        cy={y}
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={isActive ? 2.5 * scale : 1.5 * scale}
        opacity={colors.opacity}
      />
      
      {/* Root note indicator */}
      {note.isRoot && (
        <Circle
          cx={x}
          cy={y}
          r={radius - 3 * scale}
          fill="none"
          stroke="#FFD700"
          strokeWidth={1.5 * scale}
          strokeDasharray={`${3 * scale} ${2 * scale}`}
        />
      )}
      
      {/* Finger number */}
      {note.finger && state !== 'completed' && (
        <SvgText
          x={x}
          y={y + 3.5 * scale}
          textAnchor="middle"
          fill={isActive ? '#FFFFFF' : COLORS.text}
          fontSize={10 * scale}
          fontWeight="bold"
        >
          {note.finger}
        </SvgText>
      )}
      
      {/* Technique glyph badge */}
      {showGlyph && glyphSymbol && state !== 'completed' && (
        <G>
          <Circle
            cx={x + 11 * scale}
            cy={y - 11 * scale}
            r={8 * scale}
            fill={glyphColor}
            stroke="#FFFFFF"
            strokeWidth={1 * scale}
          />
          <SvgText
            x={x + 11 * scale}
            y={y - 8 * scale}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={7 * scale}
            fontWeight="bold"
          >
            {glyphSymbol}
          </SvgText>
        </G>
      )}
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
  onSymbolPress?: (symbol: SymbolLegendItem) => void;
  mode?: 'guided' | 'follow' | 'free';
  showTechniqueGlyphs?: boolean;
  showGhostHand?: boolean;
  debugMode?: boolean;
}

export const TechniqueAnimatedFretboardPro: React.FC<TechniqueAnimatedFretboardProProps> = ({
  path,
  currentBeat,
  isPlaying,
  techniqueColor,
  onNotePress,
  onSymbolPress,
  mode = 'guided',
  showTechniqueGlyphs = true,
  showGhostHand = true,
  debugMode = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [ghostHandPhase, setGhostHandPhase] = useState<'start' | 'moving' | 'end' | 'hidden'>('hidden');
  
  // =============================================
  // FRETBOARD DIMENSIONS (All in SVG units)
  // =============================================
  
  const rawScreenWidth = SCREEN_WIDTH;
  const maxMobileWidth = 400;
  const effectiveScreenWidth = Math.min(rawScreenWidth, maxMobileWidth);
  const fretboardWidth = effectiveScreenWidth - SPACING.lg * 2;
  const fretboardHeight = 200;
  const topPadding = 25;
  const bottomPadding = 30;
  const stringAreaHeight = fretboardHeight - topPadding - bottomPadding;
  const stringSpacing = stringAreaHeight / 5;
  const nutWidth = 12;
  
  // Scale factor for elements (relative to fretboard)
  const scale = fretboardHeight / 200;
  
  // Fretboard BBox (for ghost hand calculations)
  const fretboardBBox: FretboardBBox = useMemo(() => ({
    x: 0,
    y: topPadding,
    width: fretboardWidth,
    height: stringAreaHeight,
  }), [fretboardWidth, stringAreaHeight, topPadding]);
  
  // =============================================
  // FRET CALCULATIONS
  // =============================================
  
  const computedFrets = useMemo(() => {
    if (!path.notes || path.notes.length === 0) {
      return { min: 0, max: 12 };
    }
    const frets = path.notes.map(n => n.position.fret);
    return { min: Math.min(...frets), max: Math.max(...frets) };
  }, [path.notes]);
  
  const startFret = typeof path.startFret === 'number' && !isNaN(path.startFret) 
    ? path.startFret 
    : Math.max(0, computedFrets.min - 1);
    
  const endFret = typeof path.endFret === 'number' && !isNaN(path.endFret) 
    ? path.endFret 
    : computedFrets.max + 1;
  
  const numFrets = Math.max(3, endFret - startFret + 1);
  const fretWidth = (fretboardWidth - nutWidth) / numFrets;
  
  // =============================================
  // POSITION CALCULATORS (SVG Coordinates)
  // =============================================
  
  const computeNotePosition = useCallback((fret: number, stringIndex: number): NotePosition => {
    const relativeFret = fret - startFret;
    const x = nutWidth + (relativeFret * fretWidth) + (fretWidth / 2);
    const y = topPadding + ((stringIndex - 1) * stringSpacing);
    return { x, y, fret, string: stringIndex };
  }, [startFret, fretWidth, nutWidth, topPadding, stringSpacing]);
  
  const getFretX = (fret: number): number => {
    const relativeFret = fret - startFret;
    return nutWidth + (relativeFret * fretWidth) + (fretWidth / 2);
  };
  
  const getStringY = (string: number): number => {
    return topPadding + ((string - 1) * stringSpacing);
  };
  
  // =============================================
  // NOTE STATES
  // =============================================
  
  const { uniqueNotes, noteStates, activeNoteIndex, previousNote, currentNote } = useMemo(() => {
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
    let prevNote: FretboardNote | null = null;
    let currNote: FretboardNote | null = null;
    
    if (!isPlaying) {
      states = uniqueNotesList.map((_, index) => index === 0 ? 'active' : 'upcoming');
      currNote = path.notes[0] || null;
    } else {
      const loopBeat = ((currentBeat - 1) % path.beatsPerLoop) + 1;
      
      const currentNoteIndex = path.notes.findIndex((note) => {
        const noteStart = note.timing;
        const noteEnd = noteStart + note.duration;
        return loopBeat >= noteStart && loopBeat < noteEnd;
      });
      
      currNote = currentNoteIndex >= 0 ? path.notes[currentNoteIndex] : null;
      prevNote = currentNoteIndex > 0 ? path.notes[currentNoteIndex - 1] : null;
      
      const currentPosKey = currNote ? `${currNote.position.string}-${currNote.position.fret}` : '';
      
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
    
    return { 
      uniqueNotes: uniqueNotesList, 
      noteStates: states, 
      activeNoteIndex: activeIdx,
      previousNote: prevNote,
      currentNote: currNote,
    };
  }, [currentBeat, path, isPlaying]);
  
  // =============================================
  // GHOST HAND LOGIC
  // =============================================
  
  // Find the next note after current one
  const nextNote = useMemo(() => {
    if (!currentNote) return null;
    const currentIndex = path.notes.findIndex(n => 
      n.position.string === currentNote.position.string && 
      n.position.fret === currentNote.position.fret &&
      n.timing === currentNote.timing
    );
    return currentIndex >= 0 && currentIndex < path.notes.length - 1 
      ? path.notes[currentIndex + 1] 
      : null;
  }, [currentNote, path.notes]);
  
  const ghostHandData = useMemo(() => {
    if (!showGhostHand) {
      return { poseA: null, poseB: null, shouldShow: false };
    }
    
    // If no current note, show ghost at first note position
    const targetNote = currentNote || (path.notes.length > 0 ? path.notes[0] : null);
    if (!targetNote) {
      return { poseA: null, poseB: null, shouldShow: false };
    }
    
    const targetPos = computeNotePosition(targetNote.position.fret, targetNote.position.string);
    const poseB: GhostHandPose = {
      x: targetPos.x,
      y: targetPos.y,
      finger: targetNote.finger,
      technique: targetNote.technique,
    };
    
    let poseA: GhostHandPose | null = null;
    let shouldShow = false;
    
    // Show ghost hand when:
    // 1. Current note has a technique
    if (targetNote.technique && GHOST_HAND_TECHNIQUES.includes(targetNote.technique)) {
      shouldShow = true;
    }
    
    // 2. Next note has a technique (anticipate the movement)
    if (nextNote?.technique && GHOST_HAND_TECHNIQUES.includes(nextNote.technique)) {
      shouldShow = true;
    }
    
    // 3. Large fret jumps (> 2 frets)
    if (previousNote) {
      const fretDiff = Math.abs(targetNote.position.fret - previousNote.position.fret);
      if (fretDiff > 2) {
        shouldShow = true;
      }
    }
    
    // Always show ghost hand in guided mode during practice for better UX
    // When not playing, show it at the first note position
    if (mode === 'guided' && !isPlaying && path.notes.length > 0) {
      shouldShow = true;
    }
    
    // Set poseA from previous note if available (for arrow/trail)
    if (previousNote && shouldShow) {
      const prevPos = computeNotePosition(previousNote.position.fret, previousNote.position.string);
      poseA = {
        x: prevPos.x,
        y: prevPos.y,
        finger: previousNote.finger,
        technique: previousNote.technique,
      };
    }
    
    return { poseA, poseB, shouldShow };
  }, [currentNote, previousNote, nextNote, showGhostHand, computeNotePosition, mode, isPlaying, path.notes]);
  
  // Update ghost hand animation phase
  useEffect(() => {
    if (ghostHandData.shouldShow && mode === 'guided') {
      setGhostHandPhase('end');
      
      // Animate if there's a previous position
      if (ghostHandData.poseA) {
        setGhostHandPhase('start');
        const timer1 = setTimeout(() => setGhostHandPhase('moving'), 200);
        const timer2 = setTimeout(() => setGhostHandPhase('end'), 600);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      setGhostHandPhase('hidden');
    }
  }, [ghostHandData.shouldShow, ghostHandData.poseA, mode]);
  
  // =============================================
  // ANIMATIONS
  // =============================================
  
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
  
  // =============================================
  // RENDER FUNCTIONS
  // =============================================
  
  const renderStrings = () => {
    return STRING_NAMES.map((name, index) => {
      const y = getStringY(index + 1);
      const thickness = 1 + (index * 0.3);
      
      return (
        <G key={`string-${index}`}>
          <Line
            x1={nutWidth}
            y1={y}
            x2={fretboardWidth}
            y2={y}
            stroke="#B8860B"
            strokeWidth={thickness}
            opacity={0.5}
          />
          <SvgText
            x={5}
            y={y + 3.5 * scale}
            fill={COLORS.textMuted}
            fontSize={9 * scale}
            fontWeight="600"
          >
            {name}
          </SvgText>
        </G>
      );
    });
  };
  
  const renderFrets = () => {
    const frets: JSX.Element[] = [];
    const firstStringY = getStringY(1);
    const lastStringY = getStringY(6);
    
    // Nut
    frets.push(
      <Rect
        key="nut"
        x={nutWidth - 4}
        y={firstStringY - 4}
        width={5}
        height={lastStringY - firstStringY + 8}
        fill="#D4A574"
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
          stroke="#C0C0C0"
          strokeWidth={1.5}
          opacity={0.3}
        />
      );
    }
    
    return frets;
  };
  
  const renderFretMarkers = () => {
    const markers: JSX.Element[] = [];
    
    for (let fret = startFret; fret <= endFret; fret++) {
      const x = getFretX(fret);
      
      markers.push(
        <SvgText
          key={`fret-num-${fret}`}
          x={x}
          y={fretboardHeight - 8}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={9 * scale}
          fontWeight="500"
        >
          {fret}
        </SvgText>
      );
      
      if (FRET_DOTS.includes(fret)) {
        const isDouble = DOUBLE_DOTS.includes(fret);
        if (isDouble) {
          markers.push(
            <Circle key={`dot-${fret}-1`} cx={x} cy={getStringY(2)} r={3 * scale} fill={COLORS.textMuted} opacity={0.2} />
          );
          markers.push(
            <Circle key={`dot-${fret}-2`} cx={x} cy={getStringY(5)} r={3 * scale} fill={COLORS.textMuted} opacity={0.2} />
          );
        } else {
          markers.push(
            <Circle key={`dot-${fret}`} cx={x} cy={getStringY(3.5)} r={3 * scale} fill={COLORS.textMuted} opacity={0.2} />
          );
        }
      }
    }
    
    return markers;
  };
  
  const renderNotes = () => {
    return uniqueNotes.map((note, index) => {
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
      {/* Controls row */}
      <View style={styles.controlsRow}>
        <TouchableOpacity 
          style={styles.legendButton}
          onPress={() => setShowLegendModal(true)}
        >
          <Ionicons name="book-outline" size={18} color={COLORS.primary} />
          <Text style={styles.legendButtonText}>Símbolos</Text>
        </TouchableOpacity>
        
        {mode === 'guided' && (
          <View style={styles.ghostHandToggle}>
            <Text style={styles.ghostHandLabel}>Mano guía</Text>
            <View style={[styles.toggleDot, showGhostHand && styles.toggleDotActive]} />
          </View>
        )}
        
        {debugMode && (
          <Text style={styles.debugLabel}>DEBUG ON</Text>
        )}
      </View>
      
      {/* SVG Fretboard */}
      <View style={styles.fretboardContainer}>
        <Svg 
          width={fretboardWidth} 
          height={fretboardHeight}
          viewBox={`0 0 ${fretboardWidth} ${fretboardHeight}`}
        >
          <Defs>
            <LinearGradient id="fretboardBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#2D1F1A" stopOpacity={1} />
              <Stop offset="100%" stopColor="#1A0F0A" stopOpacity={1} />
            </LinearGradient>
          </Defs>
          
          {/* Background */}
          <Rect
            x={0}
            y={topPadding - 8}
            width={fretboardWidth}
            height={stringAreaHeight + 16}
            fill="url(#fretboardBg)"
            rx={6}
          />
          
          {/* Frets */}
          {renderFrets()}
          
          {/* Fret markers */}
          {renderFretMarkers()}
          
          {/* Strings */}
          {renderStrings()}
          
          {/* Ghost Hand Layer (above fretboard, below notes) */}
          {showGhostHand && ghostHandData.poseB && mode === 'guided' && (
            <GhostHandSVG
              poseA={ghostHandData.poseA}
              poseB={ghostHandData.poseB}
              fretboardBBox={fretboardBBox}
              color={techniqueColor}
              showArrow={!!ghostHandData.poseA}
              animationPhase={ghostHandPhase}
              finger={currentNote?.finger}
              debugMode={debugMode}
            />
          )}
          
          {/* Notes (topmost layer) */}
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
          <View style={[styles.legendDot, { backgroundColor: COLORS.secondaryDark }]} />
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
      
      {/* Symbol Legend Modal */}
      <SymbolLegendModal 
        visible={showLegendModal} 
        onClose={() => setShowLegendModal(false)} 
      />
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
    marginBottom: SPACING.xs,
  },
  legendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  legendButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  ghostHandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ghostHandLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  toggleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textMuted,
  },
  toggleDotActive: {
    backgroundColor: COLORS.success,
  },
  debugLabel: {
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
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
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
  legendRoot: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  legendText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
});

// Legend Modal Styles
const legendStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  title: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    padding: SPACING.xs,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceLight,
  },
  tabActive: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
  },
  symbolsList: {
    gap: SPACING.md,
  },
  symbolItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  symbolBadge: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolBadgeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  symbolInfo: {
    flex: 1,
  },
  symbolName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  symbolMeaning: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  symbolDetails: {
    marginTop: SPACING.xs,
  },
  symbolHow: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  symbolLabel: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  symbolExampleBox: {
    marginTop: 4,
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  symbolExample: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  colorsList: {
    gap: SPACING.sm,
  },
  colorsIntro: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  colorInfo: {
    flex: 1,
  },
  colorName: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  colorMeaning: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
});

export default TechniqueAnimatedFretboardPro;
