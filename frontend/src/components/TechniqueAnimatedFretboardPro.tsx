/**
 * GUITAR GUIDE PRO - ANIMATED TECHNIQUE FRETBOARD PRO
 * Enhanced fretboard with FINGER GUIDES and Symbol Legend
 * 
 * Features:
 * A) Finger Guides - Individual finger markers showing exact fingering
 *    - Toggle ON/OFF with persistence
 *    - Clean, minimal design (NO full hand)
 *    - Color-coded fingers: 1=blue, 2=green, 3=yellow, 4=red
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
} from 'react-native-svg';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { FretboardNote, FretboardPath, TechniqueGlyph, TechniqueSymbol, TECHNIQUE_SYMBOLS } from '../data/techniqueExercises';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// =============================================
// CONSTANTS
// =============================================

const FINGER_GUIDES_STORAGE_KEY = '@guitar_guide_finger_guides_enabled';

// Finger Guide Colors - Consistent per finger
const FINGER_COLORS: Record<number, string> = {
  1: '#3498DB', // Azul - Índice
  2: '#27AE60', // Verde - Medio
  3: '#F1C40F', // Amarillo - Anular
  4: '#E74C3C', // Rojo - Meñique
};

// Finger Guide Visual Config
const FINGER_GUIDE_CONFIG = {
  // Opacidad: 70-90%
  baseOpacity: 0.85,
  fadeOpacity: 0.5,
  
  // Tamaño relativo al fretboard
  sizeMultiplier: 1.4, // Ligeramente mayor que la cuerda
  
  // Stroke para contraste
  strokeWidth: 1.5,
  strokeColor: '#FFFFFF',
  strokeOpacity: 0.9,
  
  // Sombra sutil
  shadowOffsetX: 1,
  shadowOffsetY: 1,
  shadowOpacity: 0.3,
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

interface FingerGuideData {
  x: number;
  y: number;
  finger: number;
  fret: number;
  string: number;
  isActive: boolean;
  isNext: boolean;
  technique?: TechniqueGlyph;
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
    name: 'Slide Up',
    meaning: 'Deslizar el dedo hacia un traste más alto',
    howToExecute: 'Mantén la presión mientras deslizas hacia arriba',
    example: '5/7',
    color: '#3498DB',
  },
  {
    symbol: '\\',
    displaySymbol: '\\',
    name: 'Slide Down',
    meaning: 'Deslizar el dedo hacia un traste más bajo',
    howToExecute: 'Mantén la presión mientras deslizas hacia abajo',
    example: '7\\5',
    color: '#3498DB',
  },
  {
    symbol: 'b',
    displaySymbol: '↑',
    name: 'Bend',
    meaning: 'Estirar la cuerda para subir el tono',
    howToExecute: 'Empuja la cuerda hacia arriba con 2-3 dedos de apoyo',
    example: '7b9',
    color: '#E74C3C',
  },
  {
    symbol: 'r',
    displaySymbol: '↓',
    name: 'Release',
    meaning: 'Soltar el bend para volver al tono original',
    howToExecute: 'Relaja la presión gradualmente',
    example: '9r7',
    color: '#E74C3C',
  },
  {
    symbol: '~',
    displaySymbol: '∿',
    name: 'Vibrato',
    meaning: 'Oscilar el tono rápidamente',
    howToExecute: 'Mueve la muñeca en un movimiento de "abanico"',
    example: '7~~~',
    color: '#9B59B6',
  },
  {
    symbol: 'x',
    displaySymbol: '×',
    name: 'Muted Note',
    meaning: 'Nota apagada (sin tono definido)',
    howToExecute: 'Toca la cuerda sin presionar completamente',
    example: 'x-x-x',
    color: '#7F8C8D',
  },
  {
    symbol: 'PM',
    displaySymbol: 'PM',
    name: 'Palm Mute',
    meaning: 'Silenciar parcialmente con la palma',
    howToExecute: 'Apoya el canto de la palma sobre las cuerdas cerca del puente',
    example: 'PM---|',
    color: '#34495E',
  },
  {
    symbol: '>',
    displaySymbol: '>',
    name: 'Accent',
    meaning: 'Tocar más fuerte esta nota',
    howToExecute: 'Ataca con más fuerza de púa',
    example: '>5',
    color: '#F39C12',
  },
  {
    symbol: 'sl',
    displaySymbol: '⌒',
    name: 'Legato Slide',
    meaning: 'Deslizamiento suave sin reataque',
    howToExecute: 'Desliza manteniendo el sonido continuo',
    example: '5sl7',
    color: '#1ABC9C',
  },
  {
    symbol: 'tr',
    displaySymbol: 'tr',
    name: 'Trill',
    meaning: 'Hammer-on y pull-off rápidos alternados',
    howToExecute: 'Alterna rápidamente entre dos notas con ligados',
    example: '5tr7',
    color: '#8E44AD',
  },
];

const COLORS_LEGEND = [
  { color: '#F59E0B', name: 'Ámbar/Naranja', meaning: 'Nota ACTIVA - la que debes tocar ahora' },
  { color: '#14B8A6', name: 'Teal/Verde-Azul', meaning: 'Nota PRÓXIMA - prepárate para esta' },
  { color: '#6B7280', name: 'Gris', meaning: 'Nota COMPLETADA - ya la tocaste' },
  { color: '#FFD700', name: 'Dorado (borde)', meaning: 'Nota RAÍZ - referencia tonal' },
  { color: FINGER_COLORS[1], name: 'Azul (dedo 1)', meaning: 'Dedo ÍNDICE' },
  { color: FINGER_COLORS[2], name: 'Verde (dedo 2)', meaning: 'Dedo MEDIO' },
  { color: FINGER_COLORS[3], name: 'Amarillo (dedo 3)', meaning: 'Dedo ANULAR' },
  { color: FINGER_COLORS[4], name: 'Rojo (dedo 4)', meaning: 'Dedo MEÑIQUE' },
];

const TECHNIQUE_GLYPHS: Record<TechniqueGlyph, string> = {
  'h': 'H', 'p': 'P', '/': '/', '\\': '\\',
  'b': '↑', 'r': '↓', '~': '∿', 'x': '×',
  'PM': 'PM', '>': '>', 'sl': '⌒', 'tr': 'tr',
};

// =============================================
// FINGER GUIDE SVG COMPONENT
// Clean, minimal finger markers
// =============================================

interface FingerGuideProps {
  guides: FingerGuideData[];
  scale: number;
  debugMode?: boolean;
}

const FingerGuideSVG: React.FC<FingerGuideProps> = ({
  guides,
  scale,
  debugMode = false,
}) => {
  if (!guides || guides.length === 0) return null;
  
  const config = FINGER_GUIDE_CONFIG;
  const baseRadius = 11 * scale * config.sizeMultiplier;
  
  return (
    <G id="finger-guides-layer">
      {guides.map((guide, index) => {
        if (!guide.finger || guide.finger < 1 || guide.finger > 4) return null;
        
        const fingerColor = FINGER_COLORS[guide.finger];
        const radius = guide.isActive ? baseRadius * 1.1 : baseRadius * 0.9;
        const opacity = guide.isActive ? config.baseOpacity : config.fadeOpacity;
        
        return (
          <G key={`finger-guide-${index}`} opacity={opacity}>
            {/* Shadow */}
            <Circle
              cx={guide.x + config.shadowOffsetX * scale}
              cy={guide.y + config.shadowOffsetY * scale}
              r={radius}
              fill="#000000"
              opacity={config.shadowOpacity}
            />
            
            {/* Main finger circle */}
            <Circle
              cx={guide.x}
              cy={guide.y}
              r={radius}
              fill={fingerColor}
              stroke={config.strokeColor}
              strokeWidth={config.strokeWidth * scale}
              strokeOpacity={config.strokeOpacity}
            />
            
            {/* Finger number */}
            <SvgText
              x={guide.x}
              y={guide.y + 4 * scale}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={12 * scale}
              fontWeight="bold"
            >
              {guide.finger}
            </SvgText>
            
            {/* Active indicator - pulsing ring */}
            {guide.isActive && (
              <Circle
                cx={guide.x}
                cy={guide.y}
                r={radius + 3 * scale}
                fill="none"
                stroke={fingerColor}
                strokeWidth={2 * scale}
                strokeOpacity={0.5}
                strokeDasharray={`${4 * scale} ${2 * scale}`}
              />
            )}
            
            {/* Technique indicator (small badge) */}
            {guide.technique && guide.isActive && (
              <G>
                <Circle
                  cx={guide.x + radius * 0.8}
                  cy={guide.y - radius * 0.8}
                  r={6 * scale}
                  fill="#FFFFFF"
                  stroke={fingerColor}
                  strokeWidth={1 * scale}
                />
                <SvgText
                  x={guide.x + radius * 0.8}
                  y={guide.y - radius * 0.8 + 3 * scale}
                  textAnchor="middle"
                  fill={fingerColor}
                  fontSize={7 * scale}
                  fontWeight="bold"
                >
                  {TECHNIQUE_GLYPHS[guide.technique] || guide.technique}
                </SvgText>
              </G>
            )}
            
            {/* Debug info */}
            {debugMode && (
              <SvgText
                x={guide.x}
                y={guide.y + radius + 10 * scale}
                textAnchor="middle"
                fill="#FF0000"
                fontSize={8 * scale}
              >
                T{guide.fret}/C{guide.string}
              </SvgText>
            )}
          </G>
        );
      })}
    </G>
  );
};

// =============================================
// SYMBOL LEGEND MODAL COMPONENT
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
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          {/* Header */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Diccionario</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          {/* Tabs */}
          <View style={modalStyles.tabs}>
            <TouchableOpacity 
              style={[modalStyles.tab, activeTab === 'symbols' && modalStyles.tabActive]}
              onPress={() => setActiveTab('symbols')}
            >
              <Text style={[modalStyles.tabText, activeTab === 'symbols' && modalStyles.tabTextActive]}>
                Símbolos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[modalStyles.tab, activeTab === 'colors' && modalStyles.tabActive]}
              onPress={() => setActiveTab('colors')}
            >
              <Text style={[modalStyles.tabText, activeTab === 'colors' && modalStyles.tabTextActive]}>
                Colores
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          <ScrollView style={modalStyles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'symbols' ? (
              // Symbols Tab
              SYMBOLS_LEGEND.map((item, index) => (
                <View key={index} style={modalStyles.symbolItem}>
                  <View style={[modalStyles.symbolBadge, { backgroundColor: item.color }]}>
                    <Text style={modalStyles.symbolText}>{item.displaySymbol}</Text>
                  </View>
                  <View style={modalStyles.symbolInfo}>
                    <Text style={modalStyles.symbolName}>{item.name}</Text>
                    <Text style={modalStyles.symbolMeaning}>{item.meaning}</Text>
                    <Text style={modalStyles.symbolHow}>
                      <Text style={modalStyles.symbolHowLabel}>Cómo: </Text>
                      {item.howToExecute}
                    </Text>
                    <View style={modalStyles.exampleContainer}>
                      <Text style={modalStyles.exampleLabel}>Ejemplo: </Text>
                      <Text style={modalStyles.exampleText}>{item.example}</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              // Colors Tab
              COLORS_LEGEND.map((item, index) => (
                <View key={index} style={modalStyles.colorItem}>
                  <View style={[modalStyles.colorDot, { backgroundColor: item.color }]} />
                  <View style={modalStyles.colorInfo}>
                    <Text style={modalStyles.colorName}>{item.name}</Text>
                    <Text style={modalStyles.colorMeaning}>{item.meaning}</Text>
                  </View>
                </View>
              ))
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// =============================================
// NOTE COMPONENT
// =============================================

interface NoteComponentProps {
  note: FretboardNote;
  x: number;
  y: number;
  state: 'active' | 'next' | 'completed' | 'upcoming';
  techniqueColor: string;
  showTechniqueGlyph: boolean;
  scale: number;
}

const NoteComponent: React.FC<NoteComponentProps> = ({
  note,
  x,
  y,
  state,
  techniqueColor,
  showTechniqueGlyph,
  scale,
}) => {
  const isActive = state === 'active';
  const radius = isActive ? 13 * scale : 11 * scale;
  
  // Color based on state
  let fillColor = COLORS.textMuted;
  let strokeColor = 'transparent';
  let textColor = '#FFFFFF';
  
  switch (state) {
    case 'active':
      fillColor = techniqueColor;
      strokeColor = '#FFFFFF';
      break;
    case 'next':
      fillColor = COLORS.secondaryDark;
      strokeColor = techniqueColor;
      break;
    case 'completed':
      fillColor = COLORS.surfaceLight;
      textColor = COLORS.textMuted;
      break;
    case 'upcoming':
      fillColor = COLORS.surfaceDark;
      textColor = COLORS.textMuted;
      break;
  }
  
  // Get technique glyph
  const glyph = note.technique ? TECHNIQUE_GLYPHS[note.technique] : null;
  
  return (
    <G>
      {/* Outer glow for active */}
      {isActive && (
        <Circle
          cx={x}
          cy={y}
          r={radius + 4 * scale}
          fill={techniqueColor}
          opacity={0.3}
        />
      )}
      
      {/* Main note circle */}
      <Circle
        cx={x}
        cy={y}
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isActive ? 2 * scale : 1 * scale}
      />
      
      {/* Fret number or technique glyph */}
      <SvgText
        x={x}
        y={y + 4 * scale}
        textAnchor="middle"
        fill={textColor}
        fontSize={11 * scale}
        fontWeight={isActive ? 'bold' : '600'}
      >
        {showTechniqueGlyph && glyph ? glyph : note.position.fret}
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
  onSymbolPress?: (symbol: TechniqueGlyph) => void;
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
  onSymbolPress,
  mode = 'guided',
  showTechniqueGlyphs = true,
  showFingerGuides: showFingerGuidesProp = true,
  debugMode = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [showLegendModal, setShowLegendModal] = useState(false);
  
  // =============================================
  // FINGER GUIDES TOGGLE STATE WITH PERSISTENCE
  // =============================================
  
  const [fingerGuidesEnabled, setFingerGuidesEnabled] = useState(true); // Default ON
  const [isLoadingPreference, setIsLoadingPreference] = useState(true);
  
  // Load saved preference on mount
  useEffect(() => {
    const loadFingerGuidesPreference = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(FINGER_GUIDES_STORAGE_KEY);
        if (savedValue !== null) {
          setFingerGuidesEnabled(savedValue === 'true');
        }
      } catch (error) {
        console.warn('[FingerGuides] Failed to load preference:', error);
      } finally {
        setIsLoadingPreference(false);
      }
    };
    loadFingerGuidesPreference();
  }, []);
  
  // Save preference when changed
  const toggleFingerGuides = useCallback(async () => {
    const newValue = !fingerGuidesEnabled;
    setFingerGuidesEnabled(newValue);
    try {
      await AsyncStorage.setItem(FINGER_GUIDES_STORAGE_KEY, String(newValue));
    } catch (error) {
      console.warn('[FingerGuides] Failed to save preference:', error);
    }
  }, [fingerGuidesEnabled]);
  
  // Final finger guides visibility (considers prop + toggle + mode)
  const showFingerGuides = showFingerGuidesProp && fingerGuidesEnabled && mode === 'guided';
  
  // =============================================
  // FRETBOARD DIMENSIONS (All in SVG units)
  // =============================================
  
  const rawScreenWidth = SCREEN_WIDTH;
  const maxMobileWidth = 400;
  const effectiveScreenWidth = Math.min(rawScreenWidth, maxMobileWidth);
  
  const fretboardWidth = effectiveScreenWidth - 32;
  const fretboardHeight = 160;
  const numStrings = 6;
  const numFrets = (path.endFret - path.startFret) + 1;
  const leftPadding = 25;
  const rightPadding = 15;
  const topPadding = 25;
  const bottomPadding = 20;
  const stringAreaHeight = fretboardHeight - topPadding - bottomPadding;
  const stringSpacing = stringAreaHeight / (numStrings - 1);
  const fretSpacing = (fretboardWidth - leftPadding - rightPadding) / numFrets;
  const scale = fretboardHeight / 160;
  
  // Fretboard bounding box for reference
  const fretboardBBox: FretboardBBox = useMemo(() => ({
    x: leftPadding,
    y: topPadding,
    width: fretboardWidth - leftPadding - rightPadding,
    height: stringAreaHeight,
  }), [fretboardWidth, leftPadding, rightPadding, topPadding, stringAreaHeight]);
  
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
  // CURRENT & PREVIOUS NOTE TRACKING
  // =============================================
  
  const currentNote = useMemo(() => {
    if (!path.notes.length) return null;
    
    const effectiveBeat = path.loopable && path.beatsPerLoop 
      ? currentBeat % path.beatsPerLoop 
      : currentBeat;
    
    // Find the note that should be active at this beat
    for (let i = path.notes.length - 1; i >= 0; i--) {
      if (path.notes[i].timing <= effectiveBeat) {
        return path.notes[i];
      }
    }
    return path.notes[0];
  }, [path.notes, currentBeat, path.loopable, path.beatsPerLoop]);
  
  const previousNote = useMemo(() => {
    if (!currentNote || !path.notes.length) return null;
    const currentIndex = path.notes.findIndex(n => 
      n.timing === currentNote.timing && 
      n.position.fret === currentNote.position.fret
    );
    return currentIndex > 0 ? path.notes[currentIndex - 1] : null;
  }, [currentNote, path.notes]);
  
  const nextNote = useMemo(() => {
    if (!currentNote || !path.notes.length) return null;
    const currentIndex = path.notes.findIndex(n => 
      n.timing === currentNote.timing && 
      n.position.fret === currentNote.position.fret
    );
    return currentIndex >= 0 && currentIndex < path.notes.length - 1 
      ? path.notes[currentIndex + 1] 
      : null;
  }, [currentNote, path.notes]);
  
  // =============================================
  // FINGER GUIDES DATA
  // =============================================
  
  const fingerGuidesData = useMemo((): FingerGuideData[] => {
    if (!showFingerGuides) return [];
    
    const guides: FingerGuideData[] = [];
    
    // Add current note finger guide
    if (currentNote && currentNote.finger) {
      const pos = computeNotePosition(currentNote.position.fret, currentNote.position.string);
      guides.push({
        x: pos.x,
        y: pos.y,
        finger: currentNote.finger,
        fret: currentNote.position.fret,
        string: currentNote.position.string,
        isActive: true,
        isNext: false,
        technique: currentNote.technique,
      });
    }
    
    // Add next note finger guide (anticipation)
    if (nextNote && nextNote.finger && nextNote.finger !== currentNote?.finger) {
      const pos = computeNotePosition(nextNote.position.fret, nextNote.position.string);
      guides.push({
        x: pos.x,
        y: pos.y,
        finger: nextNote.finger,
        fret: nextNote.position.fret,
        string: nextNote.position.string,
        isActive: false,
        isNext: true,
        technique: nextNote.technique,
      });
    }
    
    return guides;
  }, [showFingerGuides, currentNote, nextNote, computeNotePosition]);
  
  // =============================================
  // RENDER FUNCTIONS
  // =============================================
  
  const renderStrings = () => {
    return Array.from({ length: numStrings }, (_, i) => {
      const y = topPadding + i * stringSpacing;
      const thickness = 1 + (i * 0.3); // Thicker strings at bottom
      return (
        <Line
          key={`string-${i}`}
          x1={leftPadding}
          y1={y}
          x2={fretboardWidth - rightPadding}
          y2={y}
          stroke="#C0C0C0"
          strokeWidth={thickness}
          opacity={0.8}
        />
      );
    });
  };
  
  const renderFrets = () => {
    return Array.from({ length: numFrets + 1 }, (_, i) => {
      const x = leftPadding + i * fretSpacing;
      const isNut = i === 0;
      return (
        <Line
          key={`fret-${i}`}
          x1={x}
          y1={topPadding - 5}
          x2={x}
          y2={topPadding + stringAreaHeight + 5}
          stroke={isNut ? '#E0E0E0' : '#808080'}
          strokeWidth={isNut ? 4 : 1.5}
          opacity={isNut ? 1 : 0.6}
        />
      );
    });
  };
  
  const renderFretMarkers = () => {
    const markers: JSX.Element[] = [];
    const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21];
    const doubleDotFrets = [12, 24];
    
    markerFrets.forEach(fret => {
      if (fret >= path.startFret && fret <= path.endFret) {
        const fretIndex = fret - path.startFret;
        const x = leftPadding + (fretIndex + 0.5) * fretSpacing;
        const yCenter = topPadding + stringAreaHeight / 2;
        
        if (doubleDotFrets.includes(fret)) {
          markers.push(
            <Circle key={`marker-${fret}-1`} cx={x} cy={yCenter - 20} r={4} fill="#555" opacity={0.5} />,
            <Circle key={`marker-${fret}-2`} cx={x} cy={yCenter + 20} r={4} fill="#555" opacity={0.5} />
          );
        } else {
          markers.push(
            <Circle key={`marker-${fret}`} cx={x} cy={yCenter} r={4} fill="#555" opacity={0.5} />
          );
        }
      }
    });
    
    // Fret numbers
    for (let i = 0; i <= numFrets; i++) {
      const fretNum = path.startFret + i;
      const x = leftPadding + (i + 0.5) * fretSpacing;
      markers.push(
        <SvgText
          key={`fret-num-${i}`}
          x={x}
          y={fretboardHeight - 5}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={9}
          opacity={0.7}
        >
          {fretNum}
        </SvgText>
      );
    }
    
    return markers;
  };
  
  const renderNotes = () => {
    const effectiveBeat = path.loopable && path.beatsPerLoop 
      ? currentBeat % path.beatsPerLoop 
      : currentBeat;
    
    return path.notes.map((note, index) => {
      const pos = computeNotePosition(note.position.fret, note.position.string);
      
      let state: 'active' | 'next' | 'completed' | 'upcoming' = 'upcoming';
      
      if (currentNote && 
          note.timing === currentNote.timing && 
          note.position.fret === currentNote.position.fret &&
          note.position.string === currentNote.position.string) {
        state = 'active';
      } else if (nextNote &&
          note.timing === nextNote.timing && 
          note.position.fret === nextNote.position.fret &&
          note.position.string === nextNote.position.string) {
        state = 'next';
      } else if (note.timing < effectiveBeat) {
        state = 'completed';
      }
      
      return (
        <NoteComponent
          key={`note-${index}`}
          note={note}
          x={pos.x}
          y={pos.y}
          state={state}
          techniqueColor={techniqueColor}
          showTechniqueGlyph={showTechniqueGlyphs}
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
        
        {/* Finger Guides Toggle Button - ON/OFF */}
        {mode === 'guided' && showFingerGuidesProp && (
          <TouchableOpacity 
            style={[
              styles.fingerGuidesToggleBtn,
              fingerGuidesEnabled && styles.fingerGuidesToggleBtnActive
            ]}
            onPress={toggleFingerGuides}
            accessibilityLabel="Mostrar/ocultar dedos guía"
            accessibilityRole="switch"
            accessibilityState={{ checked: fingerGuidesEnabled }}
          >
            <View style={styles.fingerIconsRow}>
              {[1, 2, 3, 4].map(f => (
                <View 
                  key={f} 
                  style={[
                    styles.miniFingerDot, 
                    { backgroundColor: fingerGuidesEnabled ? FINGER_COLORS[f] : COLORS.textMuted }
                  ]} 
                />
              ))}
            </View>
            <Text style={[
              styles.fingerGuidesToggleText,
              fingerGuidesEnabled && styles.fingerGuidesToggleTextActive
            ]}>
              Dedos
            </Text>
            <View style={[
              styles.toggleIndicator,
              fingerGuidesEnabled ? styles.toggleIndicatorOn : styles.toggleIndicatorOff
            ]}>
              <Text style={[
                styles.toggleIndicatorText,
                !fingerGuidesEnabled && styles.toggleIndicatorTextOff
              ]}>
                {fingerGuidesEnabled ? 'ON' : 'OFF'}
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
          
          {/* LAYER 5: Finger Guides (ABOVE fretboard/strings, BELOW notes) */}
          {showFingerGuides && fingerGuidesData.length > 0 && (
            <FingerGuideSVG
              guides={fingerGuidesData}
              scale={scale}
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
        {showFingerGuides && (
          <>
            <View style={styles.legendSeparator} />
            {[1, 2, 3, 4].map(f => (
              <View key={f} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: FINGER_COLORS[f] }]} />
                <Text style={styles.legendText}>{f}</Text>
              </View>
            ))}
          </>
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
  // Finger Guides Toggle Button Styles
  fingerGuidesToggleBtn: {
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
  fingerGuidesToggleBtnActive: {
    backgroundColor: COLORS.backgroundCard,
    borderColor: COLORS.primary,
  },
  fingerIconsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  miniFingerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  fingerGuidesToggleText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  fingerGuidesToggleTextActive: {
    color: COLORS.text,
  },
  toggleIndicator: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: 2,
  },
  toggleIndicatorOn: {
    backgroundColor: COLORS.success,
  },
  toggleIndicatorOff: {
    backgroundColor: COLORS.surfaceDark,
  },
  toggleIndicatorText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  toggleIndicatorTextOff: {
    color: COLORS.textMuted,
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
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
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
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  legendSeparator: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.surfaceLight,
  },
});

// Modal Styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
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
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLight,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.md,
  },
  symbolItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
  },
  symbolBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  symbolText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  symbolInfo: {
    flex: 1,
  },
  symbolName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  symbolMeaning: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  symbolHow: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  symbolHowLabel: {
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  exampleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exampleLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  exampleText: {
    fontSize: FONTS.sizes.sm,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: COLORS.primary,
    fontWeight: '600',
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.md,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: SPACING.sm,
    borderWidth: 2,
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
  },
});

export default TechniqueAnimatedFretboardPro;
