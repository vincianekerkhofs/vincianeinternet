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

// Finger names for display
const FINGER_NAMES: Record<number, string> = {
  1: 'Índice',
  2: 'Medio', 
  3: 'Anular',
  4: 'Meñique',
};

// =============================================
// GHOST HAND SVG COMPONENT - ENHANCED VERSION
// High visibility with stroke, shadow, and clear finger identification
// =============================================

interface GhostHandProps {
  poseA: GhostHandPose | null;
  poseB: GhostHandPose;
  fretboardBBox: FretboardBBox;
  techniqueColor: string;
  showArrow: boolean;
  animationPhase: 'start' | 'moving' | 'end' | 'hidden';
  finger?: number;
  targetString?: number;
  targetFret?: number;
  debugMode?: boolean;
}

const GhostHandSVG: React.FC<GhostHandProps> = ({
  poseA,
  poseB,
  fretboardBBox,
  techniqueColor,
  showArrow,
  animationPhase,
  finger,
  targetString,
  targetFret,
  debugMode = false,
}) => {
  if (animationPhase === 'hidden') return null;
  
  // ===== SIZING (relative to fretboard, not pixels) =====
  const handScale = fretboardBBox.height / 120; // Larger scale for better visibility
  const palmWidth = 24 * handScale;
  const palmHeight = 28 * handScale;
  const fingerWidth = 6 * handScale;
  const fingerHeight = 20 * handScale;
  const fingerGap = 2 * handScale;
  const thumbWidth = 7 * handScale;
  const thumbHeight = 16 * handScale;
  
  // Offset from note position
  const handOffsetY = -palmHeight * 0.4;
  const handOffsetX = -palmWidth * 0.5;
  
  // ===== VISUAL CONFIG (PRD requirements) =====
  const config = GHOST_HAND_CONFIG;
  const handColor = config.handColor;
  const strokeColor = config.strokeColor;
  const strokeWidth = config.strokeWidth * handScale;
  const strokeOpacity = config.strokeOpacity;
  
  // ===== POSITION CALCULATION =====
  let currentX = poseB.x;
  let currentY = poseB.y;
  let opacity = config.baseOpacity;
  
  if (animationPhase === 'start' && poseA) {
    currentX = poseA.x;
    currentY = poseA.y;
    opacity = config.activeOpacity;
  } else if (animationPhase === 'moving' && poseA) {
    currentX = (poseA.x + poseB.x) / 2;
    currentY = (poseA.y + poseB.y) / 2;
    opacity = config.movingOpacity;
  } else if (animationPhase === 'end') {
    opacity = config.baseOpacity;
  }
  
  // ===== RENDER ENHANCED HAND =====
  const renderEnhancedHand = (x: number, y: number, handOpacity: number, isActive: boolean = true) => {
    const palmX = x + handOffsetX;
    const palmY = y + handOffsetY;
    const fingersStartY = palmY - fingerHeight + 4 * handScale;
    
    // Which finger is active (1-4, or 0 for none)
    const activeFinger = finger || 0;
    
    return (
      <G opacity={handOpacity}>
        {/* ===== LAYER 1: OUTER GLOW/SHADOW ===== */}
        <Ellipse
          cx={palmX + palmWidth / 2}
          cy={palmY + palmHeight / 2}
          rx={palmWidth / 2 + config.glowRadius * handScale}
          ry={palmHeight / 2 + config.glowRadius * handScale}
          fill={config.shadowColor}
          opacity={config.glowOpacity}
        />
        
        {/* ===== LAYER 2: PALM SHADOW (offset) ===== */}
        <Ellipse
          cx={palmX + palmWidth / 2 + 2 * handScale}
          cy={palmY + palmHeight / 2 + 2 * handScale}
          rx={palmWidth / 2}
          ry={palmHeight / 2}
          fill={config.shadowColor}
          opacity={config.shadowOpacity}
        />
        
        {/* ===== LAYER 3: PALM BASE ===== */}
        <Ellipse
          cx={palmX + palmWidth / 2}
          cy={palmY + palmHeight / 2}
          rx={palmWidth / 2}
          ry={palmHeight / 2}
          fill={handColor}
          opacity={0.85}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeOpacity={strokeOpacity}
        />
        
        {/* ===== LAYER 4: THUMB (on left side) ===== */}
        <G>
          {/* Thumb shadow */}
          <Ellipse
            cx={palmX - thumbWidth * 0.3 + 1 * handScale}
            cy={palmY + palmHeight * 0.4 + 1 * handScale}
            rx={thumbWidth / 2}
            ry={thumbHeight / 2}
            fill={config.shadowColor}
            opacity={0.25}
          />
          {/* Thumb */}
          <Ellipse
            cx={palmX - thumbWidth * 0.3}
            cy={palmY + palmHeight * 0.4}
            rx={thumbWidth / 2}
            ry={thumbHeight / 2}
            fill={handColor}
            opacity={0.8}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.8}
            strokeOpacity={strokeOpacity}
          />
          {/* Thumb indicator "P" for pulgar */}
          <SvgText
            x={palmX - thumbWidth * 0.3}
            y={palmY + palmHeight * 0.4 + 3 * handScale}
            textAnchor="middle"
            fill={techniqueColor}
            fontSize={7 * handScale}
            fontWeight="bold"
            opacity={0.7}
          >
            P
          </SvgText>
        </G>
        
        {/* ===== LAYER 5: FINGERS (1-4) ===== */}
        {[1, 2, 3, 4].map((fingerNum) => {
          const i = fingerNum - 1;
          const fingerX = palmX + (fingerWidth + fingerGap) * i + fingerGap * 2;
          const isThisFingerActive = activeFinger === fingerNum;
          
          // Active finger is highlighted and slightly longer
          const thisFingerHeight = isThisFingerActive ? fingerHeight * 1.15 : fingerHeight;
          const thisFingerY = isThisFingerActive ? fingersStartY - 3 * handScale : fingersStartY;
          const fingerFill = isThisFingerActive ? config.fingerHighlightColor : handColor;
          const fingerOpacity = isThisFingerActive ? 0.95 : 0.75;
          
          return (
            <G key={`finger-${fingerNum}`}>
              {/* Finger shadow */}
              <Rect
                x={fingerX + 1 * handScale}
                y={thisFingerY + 1 * handScale}
                width={fingerWidth}
                height={thisFingerHeight}
                rx={fingerWidth / 2}
                ry={fingerWidth / 2}
                fill={config.shadowColor}
                opacity={0.2}
              />
              
              {/* Finger base */}
              <Rect
                x={fingerX}
                y={thisFingerY}
                width={fingerWidth}
                height={thisFingerHeight}
                rx={fingerWidth / 2}
                ry={fingerWidth / 2}
                fill={fingerFill}
                opacity={fingerOpacity}
                stroke={isThisFingerActive ? strokeColor : strokeColor}
                strokeWidth={isThisFingerActive ? strokeWidth * 1.2 : strokeWidth * 0.7}
                strokeOpacity={strokeOpacity}
              />
              
              {/* Finger number on each finger */}
              <Circle
                cx={fingerX + fingerWidth / 2}
                cy={thisFingerY + thisFingerHeight - 5 * handScale}
                r={4 * handScale}
                fill={isThisFingerActive ? techniqueColor : 'rgba(0,0,0,0.4)'}
                opacity={isThisFingerActive ? 1 : 0.6}
              />
              <SvgText
                x={fingerX + fingerWidth / 2}
                y={thisFingerY + thisFingerHeight - 2.5 * handScale}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize={6 * handScale}
                fontWeight="bold"
              >
                {fingerNum}
              </SvgText>
            </G>
          );
        })}
        
        {/* ===== LAYER 6: ACTIVE FINGER CALLOUT (prominent) ===== */}
        {activeFinger > 0 && isActive && (
          <G>
            {/* Big badge above active finger */}
            <Circle
              cx={palmX + (fingerWidth + fingerGap) * (activeFinger - 1) + fingerGap * 2 + fingerWidth / 2}
              cy={fingersStartY - 14 * handScale}
              r={12 * handScale}
              fill={techniqueColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              opacity={0.95}
            />
            <SvgText
              x={palmX + (fingerWidth + fingerGap) * (activeFinger - 1) + fingerGap * 2 + fingerWidth / 2}
              y={fingersStartY - 10 * handScale}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={12 * handScale}
              fontWeight="bold"
            >
              {activeFinger}
            </SvgText>
            
            {/* Finger name label */}
            <Rect
              x={palmX + palmWidth / 2 - 20 * handScale}
              y={fingersStartY - 28 * handScale}
              width={40 * handScale}
              height={10 * handScale}
              rx={3 * handScale}
              fill="rgba(0,0,0,0.7)"
            />
            <SvgText
              x={palmX + palmWidth / 2}
              y={fingersStartY - 20.5 * handScale}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={7 * handScale}
              fontWeight="600"
            >
              {FINGER_NAMES[activeFinger] || `Dedo ${activeFinger}`}
            </SvgText>
          </G>
        )}
        
        {/* ===== LAYER 7: POSITION INFO (fret/string) ===== */}
        {isActive && targetFret !== undefined && targetString !== undefined && (
          <G>
            <Rect
              x={palmX + palmWidth + 4 * handScale}
              y={palmY + palmHeight * 0.2}
              width={28 * handScale}
              height={22 * handScale}
              rx={4 * handScale}
              fill="rgba(0,0,0,0.75)"
              stroke={techniqueColor}
              strokeWidth={1 * handScale}
            />
            <SvgText
              x={palmX + palmWidth + 18 * handScale}
              y={palmY + palmHeight * 0.2 + 9 * handScale}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={7 * handScale}
              fontWeight="600"
            >
              T{targetFret}
            </SvgText>
            <SvgText
              x={palmX + palmWidth + 18 * handScale}
              y={palmY + palmHeight * 0.2 + 18 * handScale}
              textAnchor="middle"
              fill={techniqueColor}
              fontSize={6 * handScale}
              fontWeight="600"
            >
              C{targetString}
            </SvgText>
          </G>
        )}
      </G>
    );
  };
  
  // ===== RENDER MOVEMENT ARROW =====
  const renderArrow = () => {
    if (!showArrow || !poseA) return null;
    
    const arrowHeadSize = 8 * handScale;
    const angle = Math.atan2(poseB.y - poseA.y, poseB.x - poseA.x);
    const midX = (poseA.x + poseB.x) / 2;
    const midY = (poseA.y + poseB.y) / 2 - 20 * handScale;
    const arrowTipX = poseB.x;
    const arrowTipY = poseB.y - 15 * handScale;
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
    const isSlide = poseB.technique === '/' || poseB.technique === '\\';
    
    return (
      <G opacity={0.6}>
        {/* Arrow shadow */}
        <Path
          d={`M ${poseA.x + 1} ${poseA.y - 14 * handScale} Q ${midX + 1} ${midY + 1} ${arrowTipX + 1} ${arrowTipY + 1}`}
          fill="none"
          stroke={config.shadowColor}
          strokeWidth={3 * handScale}
          strokeLinecap="round"
          opacity={0.3}
        />
        {/* Arrow line */}
        <Path
          d={`M ${poseA.x} ${poseA.y - 15 * handScale} Q ${midX} ${midY} ${arrowTipX} ${arrowTipY}`}
          fill="none"
          stroke={techniqueColor}
          strokeWidth={2.5 * handScale}
          strokeDasharray={isSlide ? `${5 * handScale} ${3 * handScale}` : '0'}
          strokeLinecap="round"
        />
        {/* Arrow head */}
        <Polygon
          points={`${arrowTipX},${arrowTipY} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
          fill={techniqueColor}
          stroke={strokeColor}
          strokeWidth={1 * handScale}
        />
      </G>
    );
  };
  
  return (
    <G id="ghost-hand-layer">
      {/* Debug bbox */}
      {debugMode && (
        <Rect
          x={fretboardBBox.x}
          y={fretboardBBox.y}
          width={fretboardBBox.width}
          height={fretboardBBox.height}
          fill="none"
          stroke="#FF0000"
          strokeWidth={2}
          strokeDasharray="6 3"
        />
      )}
      
      {/* Movement arrow */}
      {renderArrow()}
      
      {/* Ghost hand at previous position (faded) */}
      {animationPhase === 'moving' && poseA && (
        renderEnhancedHand(poseA.x, poseA.y, 0.25, false)
      )}
      
      {/* Main ghost hand at current position */}
      {renderEnhancedHand(currentX, currentY, opacity, true)}
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
  showGhostHand: showGhostHandProp = true,
  debugMode = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [ghostHandPhase, setGhostHandPhase] = useState<'start' | 'moving' | 'end' | 'hidden'>('hidden');
  
  // =============================================
  // GHOST HAND TOGGLE STATE WITH PERSISTENCE
  // =============================================
  
  const [ghostHandEnabled, setGhostHandEnabled] = useState(true); // Default ON for beginners
  const [isLoadingPreference, setIsLoadingPreference] = useState(true);
  
  // Load saved preference on mount
  useEffect(() => {
    const loadGhostHandPreference = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(GHOST_HAND_STORAGE_KEY);
        if (savedValue !== null) {
          setGhostHandEnabled(savedValue === 'true');
        }
      } catch (error) {
        console.warn('[GhostHand] Failed to load preference:', error);
      } finally {
        setIsLoadingPreference(false);
      }
    };
    loadGhostHandPreference();
  }, []);
  
  // Save preference when changed
  const toggleGhostHand = useCallback(async () => {
    const newValue = !ghostHandEnabled;
    setGhostHandEnabled(newValue);
    try {
      await AsyncStorage.setItem(GHOST_HAND_STORAGE_KEY, String(newValue));
    } catch (error) {
      console.warn('[GhostHand] Failed to save preference:', error);
    }
  }, [ghostHandEnabled]);
  
  // Final ghost hand visibility (considers prop + toggle)
  const showGhostHand = showGhostHandProp && ghostHandEnabled && mode === 'guided';
  
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
          accessibilityLabel="Abrir diccionario de símbolos"
        >
          <Ionicons name="book-outline" size={18} color={COLORS.primary} />
          <Text style={styles.legendButtonText}>Símbolos</Text>
        </TouchableOpacity>
        
        {/* Ghost Hand Toggle Button - ON/OFF */}
        {mode === 'guided' && showGhostHandProp && (
          <TouchableOpacity 
            style={[
              styles.ghostHandToggleBtn,
              ghostHandEnabled && styles.ghostHandToggleBtnActive
            ]}
            onPress={toggleGhostHand}
            accessibilityLabel="Mostrar/ocultar mano guía"
            accessibilityRole="switch"
            accessibilityState={{ checked: ghostHandEnabled }}
          >
            <Ionicons 
              name={ghostHandEnabled ? "hand-left" : "hand-left-outline"} 
              size={18} 
              color={ghostHandEnabled ? '#FFFFFF' : COLORS.textMuted} 
            />
            <Text style={[
              styles.ghostHandToggleText,
              ghostHandEnabled && styles.ghostHandToggleTextActive
            ]}>
              Mano
            </Text>
            <View style={[
              styles.toggleIndicator,
              ghostHandEnabled ? styles.toggleIndicatorOn : styles.toggleIndicatorOff
            ]}>
              <Text style={styles.toggleIndicatorText}>
                {ghostHandEnabled ? 'ON' : 'OFF'}
              </Text>
            </View>
          </TouchableOpacity>
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
          
          {/* LAYER 1: Background */}
          <Rect
            x={0}
            y={topPadding - 8}
            width={fretboardWidth}
            height={stringAreaHeight + 16}
            fill="url(#fretboardBg)"
            rx={6}
          />
          
          {/* LAYER 2: Frets */}
          {renderFrets()}
          
          {/* LAYER 3: Fret markers */}
          {renderFretMarkers()}
          
          {/* LAYER 4: Strings */}
          {renderStrings()}
          
          {/* LAYER 5: Ghost Hand (ABOVE fretboard/strings, BELOW notes) */}
          {/* Only render if enabled - no opacity:0 trick, truly not rendered */}
          {showGhostHand && ghostHandData.poseB && (
            <GhostHandSVG
              poseA={ghostHandData.poseA}
              poseB={ghostHandData.poseB}
              fretboardBBox={fretboardBBox}
              techniqueColor={techniqueColor}
              showArrow={!!ghostHandData.poseA}
              animationPhase={ghostHandPhase}
              finger={currentNote?.finger}
              targetString={currentNote?.position.string}
              targetFret={currentNote?.position.fret}
              debugMode={debugMode}
            />
          )}
          
          {/* LAYER 6: Notes (topmost layer) */}
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
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  legendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
  },
  legendButtonText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Ghost Hand Toggle Button Styles
  ghostHandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceLight,
  },
  ghostHandToggleBtnActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  ghostHandToggleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  ghostHandToggleTextActive: {
    color: '#FFFFFF',
  },
  toggleIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: 2,
  },
  toggleIndicatorOn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  toggleIndicatorOff: {
    backgroundColor: COLORS.backgroundCard,
  },
  toggleIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  // Legacy styles (kept for compatibility)
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
