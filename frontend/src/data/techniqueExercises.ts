/**
 * GUITAR GUIDE PRO - TECHNIQUE EXERCISES DATA
 * Complete single source of truth for all technique exercises
 * Each exercise includes fretboard paths, timing, and evaluation criteria
 */

// =============================================
// TYPES
// =============================================

export type FretPosition = {
  string: number;  // 1-6 (1 = high E, 6 = low E)
  fret: number;    // 0-24
};

export type TechniqueGlyph = 'h' | 'p' | '/' | '\\' | 'b' | 'r' | '~' | 'x' | 'PM' | '>' | 'sl' | 'tr';

export interface FretboardNote {
  position: FretPosition;
  timing: number;        // beat number (1, 1.5, 2, etc)
  duration: number;      // beats
  technique?: TechniqueGlyph;
  isRoot?: boolean;
  finger?: 1 | 2 | 3 | 4;
}

export interface FretboardPath {
  notes: FretboardNote[];
  startFret: number;
  endFret: number;
  loopable: boolean;
  beatsPerLoop: number;
}

export interface TechniqueExercise {
  id: string;
  techniqueId: string;
  levelId: number;           // 1-4
  exerciseIndex: number;     // within level
  
  // Display
  name: string;
  shortDescription: string;
  instructions: string[];
  
  // Timing
  bpmStart: number;
  bpmTarget: number;
  durationSeconds: number;
  subdivision: 'quarter' | 'eighth' | 'triplet' | 'sixteenth';
  swing?: number;            // 0-1, where 0.5 is straight
  
  // Fretboard data
  fretboardPath: FretboardPath;
  tabNotation: string;
  
  // Evaluation
  toleranceMs: number;       // timing tolerance window
  minimumAccuracy: number;   // 0-1, required to pass
  
  // Content
  tips: string[];
  commonMistakes: string[];
}

export interface TechniqueLevel {
  id: number;
  techniqueId: string;
  name: string;
  goal: string;
  targetBpmRange: [number, number];
  masteryCriteria: string;
  exercises: TechniqueExercise[];
}

// =============================================
// SYMBOL LEGEND
// =============================================

export interface TechniqueSymbol {
  symbol: string;
  name: string;
  meaning: string;
  howToExecute: string;
  miniExercise: string;
  tabExample: string;
}

export const TECHNIQUE_SYMBOLS: TechniqueSymbol[] = [
  {
    symbol: 'h',
    name: 'Hammer-on',
    meaning: 'Golpear la cuerda con un dedo de la mano izquierda para producir una nota sin púa',
    howToExecute: 'Toca la primera nota con la púa, luego golpea el siguiente traste con fuerza usando el dedo',
    miniExercise: 'Practica 5h7 en la cuerda E alta, 10 repeticiones lentas',
    tabExample: 'e|--5h7--|',
  },
  {
    symbol: 'p',
    name: 'Pull-off',
    meaning: 'Tirar de la cuerda hacia abajo con un dedo para producir una nota más baja sin púa',
    howToExecute: 'Coloca ambos dedos primero, toca la nota alta, luego tira el dedo hacia abajo',
    miniExercise: 'Practica 7p5 en la cuerda E alta, 10 repeticiones lentas',
    tabExample: 'e|--7p5--|',
  },
  {
    symbol: '/',
    name: 'Slide Up',
    meaning: 'Deslizar el dedo hacia arriba (hacia trastes más altos) manteniendo presión',
    howToExecute: 'Toca la nota inicial y desliza el dedo hacia el traste destino sin levantar',
    miniExercise: 'Practica 5/7 en la cuerda G, 10 repeticiones',
    tabExample: 'G|--5/7--|',
  },
  {
    symbol: '\\\\',
    name: 'Slide Down',
    meaning: 'Deslizar el dedo hacia abajo (hacia trastes más bajos) manteniendo presión',
    howToExecute: 'Toca la nota inicial y desliza el dedo hacia el traste destino sin levantar',
    miniExercise: 'Practica 7\\5 en la cuerda G, 10 repeticiones',
    tabExample: 'G|--7\\\\5--|',
  },
  {
    symbol: 'b',
    name: 'Bend',
    meaning: 'Empujar la cuerda hacia arriba para subir el tono',
    howToExecute: 'Usa 2-3 dedos juntos y gira la muñeca para empujar la cuerda hacia arriba',
    miniExercise: 'Practica un bend de 1 tono en el traste 7 cuerda B, escucha el traste 9',
    tabExample: 'B|--7b9--|',
  },
  {
    symbol: 'r',
    name: 'Release',
    meaning: 'Soltar un bend para volver a la nota original',
    howToExecute: 'Después de hacer el bend, regresa lentamente la cuerda a su posición normal',
    miniExercise: 'Practica bend y release: 7b9r7 en cuerda B',
    tabExample: 'B|--7b9r7--|',
  },
  {
    symbol: '~',
    name: 'Vibrato',
    meaning: 'Oscilación rápida del tono para dar expresión a las notas',
    howToExecute: 'Haz pequeños bends rítmicos arriba y abajo mientras mantienes la nota',
    miniExercise: 'Toca el traste 7 en cuerda B y aplica vibrato por 4 segundos',
    tabExample: 'B|--7~~~~--|',
  },
  {
    symbol: 'x',
    name: 'Mute / Dead Note',
    meaning: 'Nota muteada - tocar la cuerda sin que suene un tono definido',
    howToExecute: 'Toca ligeramente la cuerda con los dedos de la mano izquierda sin presionar',
    miniExercise: 'Alterna notas normales y muteadas: 5-x-5-x',
    tabExample: 'e|--5-x-5-x--|',
  },
  {
    symbol: 'PM',
    name: 'Palm Mute',
    meaning: 'Apoyar la palma en las cuerdas cerca del puente para un sonido percusivo',
    howToExecute: 'Apoya el borde de la palma derecha en las cuerdas cerca del puente',
    miniExercise: 'Toca el acorde E con palm mute, 4 golpes por compás',
    tabExample: 'E|--0-0-0-0--|PM',
  },
  {
    symbol: '>',
    name: 'Accent',
    meaning: 'Tocar la nota con más fuerza para dar énfasis',
    howToExecute: 'Aumenta la velocidad y fuerza del ataque de púa en esa nota específica',
    miniExercise: 'Toca corcheas, acentuando la 1 y la 3: >5-5->5-5',
    tabExample: 'e|-->5-5-->5-5--|',
  },
  {
    symbol: 'tr',
    name: 'Trill',
    meaning: 'Alternar rápidamente entre dos notas con hammer-ons y pull-offs',
    howToExecute: 'Toca una nota y alterna rápidamente con hammer-ons y pull-offs a otra nota',
    miniExercise: 'Practica trill entre trastes 5 y 7 por 2 segundos',
    tabExample: 'e|--5tr7--|',
  },
  {
    symbol: 'sl',
    name: 'Slur / Legato',
    meaning: 'Conectar varias notas suavemente usando solo la mano izquierda',
    howToExecute: 'Minimiza el uso de la púa, conecta notas con hammer-ons y pull-offs',
    miniExercise: 'Toca 5-7-8-7-5 usando solo una púa inicial',
    tabExample: 'e|--5sl7sl8sl7sl5--|',
  },
];

// =============================================
// HAMMER-ON EXERCISES
// =============================================

const HAMMER_ON_EXERCISES: TechniqueExercise[] = [
  // Level 1: Control Básico
  {
    id: 'hammer_on-L1-E1',
    techniqueId: 'hammer_on',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Hammer-on Simple',
    shortDescription: 'Hammer-ons aislados en la cuerda E alta',
    instructions: [
      'Coloca el dedo 1 en el traste 5 de la cuerda E alta',
      'Toca la nota con la púa',
      'Golpea el traste 7 con el dedo 3, fuerte y perpendicular',
      'La segunda nota debe sonar claramente sin púa',
    ],
    bpmStart: 50,
    bpmTarget: 70,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 0.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 4, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 4.5, duration: 0.5, technique: 'h', finger: 3 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'e|--5h7--5h7--5h7--5h7--|',
    toleranceMs: 150,
    minimumAccuracy: 0.6,
    tips: [
      'El dedo debe caer como un martillo, no deslizarse',
      'Mantén el primer dedo presionado mientras golpeas',
    ],
    commonMistakes: [
      'Golpe demasiado suave - usa más fuerza en el dedo',
      'Levantar el primer dedo - mantén ambos dedos presionados',
    ],
  },
  {
    id: 'hammer_on-L1-E2',
    techniqueId: 'hammer_on',
    levelId: 1,
    exerciseIndex: 2,
    name: 'Hammer-on Rítmico',
    shortDescription: 'Hammer-ons sincronizados con metrónomo',
    instructions: [
      'Escucha el metrónomo antes de empezar',
      'Toca el hammer-on exactamente en cada beat',
      'Mantén el tempo constante, no aceleres',
    ],
    bpmStart: 60,
    bpmTarget: 80,
    durationSeconds: 90,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 1.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 3.5, duration: 1.5, technique: 'h', finger: 3 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'e|--5h7-----5h7-----|',
    toleranceMs: 120,
    minimumAccuracy: 0.65,
    tips: [
      'Cuenta los beats en voz alta al principio',
      'Si pierdes el ritmo, para y vuelve a empezar',
    ],
    commonMistakes: [
      'Acelerar gradualmente - mantén el tempo fijo',
      'Ejecutar fuera del beat - escucha activamente el click',
    ],
  },
  // Level 2: Precisión
  {
    id: 'hammer_on-L2-E1',
    techniqueId: 'hammer_on',
    levelId: 2,
    exerciseIndex: 1,
    name: 'Hammer-on Multi-Cuerda',
    shortDescription: 'Hammer-ons en diferentes cuerdas',
    instructions: [
      'Practica el mismo patrón en cuerdas B, G y D',
      'Mantén la misma fuerza y claridad en cada cuerda',
      'El cambio entre cuerdas debe ser fluido',
    ],
    bpmStart: 60,
    bpmTarget: 85,
    durationSeconds: 150,
    subdivision: 'eighth',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 7 }, timing: 1.75, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2.75, duration: 0.25, technique: 'h', finger: 3 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 2,
    },
    tabNotation: 'e|--5h7--|\nB|--5h7--|\nG|--5h7--|\nD|--5h7--|',
    toleranceMs: 100,
    minimumAccuracy: 0.7,
    tips: [
      'Las cuerdas graves requieren más fuerza',
      'Mantén los dedos cerca del diapasón para cambios rápidos',
    ],
    commonMistakes: [
      'Perder fuerza en cuerdas graves - ajusta la presión',
      'Movimientos innecesarios - economiza movimientos',
    ],
  },
  {
    id: 'hammer_on-L2-E2',
    techniqueId: 'hammer_on',
    levelId: 2,
    exerciseIndex: 2,
    name: 'Secuencia 1-2-3',
    shortDescription: 'Hammer-ons consecutivos usando tres dedos',
    instructions: [
      'Coloca el dedo 1 en el traste 5',
      'Hammer al traste 6 con dedo 2, luego al 7 con dedo 3',
      'Cada nota debe sonar clara y separada',
    ],
    bpmStart: 50,
    bpmTarget: 75,
    durationSeconds: 120,
    subdivision: 'triplet',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 6 }, timing: 1.33, duration: 0.33, technique: 'h', finger: 2 },
        { position: { string: 1, fret: 7 }, timing: 1.66, duration: 0.34, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 6 }, timing: 2.33, duration: 0.33, technique: 'h', finger: 2 },
        { position: { string: 1, fret: 7 }, timing: 2.66, duration: 0.34, technique: 'h', finger: 3 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 2,
    },
    tabNotation: 'e|--5h6h7--5h6h7--|',
    toleranceMs: 100,
    minimumAccuracy: 0.7,
    tips: [
      'Prepara todos los dedos antes de empezar',
      'Los tresillos deben ser perfectamente uniformes',
    ],
    commonMistakes: [
      'El segundo hammer es más débil - concentra fuerza igual',
      'Dedos no preparados - visualiza antes de tocar',
    ],
  },
  // Level 3: Expresión
  {
    id: 'hammer_on-L3-E1',
    techniqueId: 'hammer_on',
    levelId: 3,
    exerciseIndex: 1,
    name: 'Hammer-Pull Combo',
    shortDescription: 'Combinar hammer-ons con pull-offs',
    instructions: [
      'Toca 5h7p5 como una unidad fluida',
      'Solo usa la púa en la primera nota',
      'Practica la fluidez del movimiento completo',
    ],
    bpmStart: 70,
    bpmTarget: 100,
    durationSeconds: 180,
    subdivision: 'triplet',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.33, duration: 0.33, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.66, duration: 0.34, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.33, duration: 0.33, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2.66, duration: 0.34, technique: 'p', finger: 1 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 2,
    },
    tabNotation: 'e|--5h7p5--5h7p5--|',
    toleranceMs: 80,
    minimumAccuracy: 0.75,
    tips: [
      'El pull-off es un pequeño rasgueo hacia abajo',
      'Mantén el dedo 1 siempre presionado',
    ],
    commonMistakes: [
      'Pull-off muy suave - tira lateralmente, no levantes',
      'Pausas entre notas - debe ser fluido y continuo',
    ],
  },
  {
    id: 'hammer_on-L3-E2',
    techniqueId: 'hammer_on',
    levelId: 3,
    exerciseIndex: 2,
    name: 'Trill Controlado',
    shortDescription: 'Trills usando hammer-ons y pull-offs rápidos',
    instructions: [
      'Alterna 5h7p5h7p5 lo más rápido posible con control',
      'Mantén todas las notas claras y uniformes',
      'Aumenta velocidad gradualmente manteniendo precisión',
    ],
    bpmStart: 80,
    bpmTarget: 120,
    durationSeconds: 120,
    subdivision: 'sixteenth',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.125, duration: 0.125, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.375, duration: 0.125, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.625, duration: 0.125, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.75, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.875, duration: 0.125, technique: 'h', finger: 3 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 1,
    },
    tabNotation: 'e|--5tr7--------|',
    toleranceMs: 60,
    minimumAccuracy: 0.75,
    tips: [
      'Empieza lento y aumenta velocidad gradualmente',
      'La velocidad viene de la relajación, no de la tensión',
    ],
    commonMistakes: [
      'Tensión en la mano - relaja los músculos',
      'Notas desiguales - practica más lento con metrónomo',
    ],
  },
  // Level 4: Contexto Musical
  {
    id: 'hammer_on-L4-E1',
    techniqueId: 'hammer_on',
    levelId: 4,
    exerciseIndex: 1,
    name: 'Lick Blues con Hammer-ons',
    shortDescription: 'Frase blues clásica usando hammer-ons',
    instructions: [
      'Este es un lick de blues estándar en Am',
      'Toca con feeling, no solo precisión',
      'Usa ligeras variaciones de timing para groove',
    ],
    bpmStart: 80,
    bpmTarget: 110,
    durationSeconds: 180,
    subdivision: 'eighth',
    swing: 0.6,
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, technique: 'h', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.75, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 3, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2.25, duration: 0.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 3, duration: 1, finger: 1, isRoot: true },
      ],
      startFret: 4,
      endFret: 9,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'e|--5h8---------5--|\nB|------5h8--------|\nG|----------5h7----|',
    toleranceMs: 80,
    minimumAccuracy: 0.8,
    tips: [
      'El swing es sutil, no exagerado',
      'Deja que la última nota respire',
    ],
    commonMistakes: [
      'Tocar demasiado recto - añade swing natural',
      'Apresurar el final - respeta la duración de cada nota',
    ],
  },
  {
    id: 'hammer_on-L4-E2',
    techniqueId: 'hammer_on',
    levelId: 4,
    exerciseIndex: 2,
    name: 'Escala con Legato',
    shortDescription: 'Escala pentatónica usando hammer-ons como técnica principal',
    instructions: [
      'Toca la escala Am pentatónica solo usando púa en la primera nota de cada cuerda',
      'El resto son hammer-ons',
      'Busca un sonido fluido y conectado',
    ],
    bpmStart: 70,
    bpmTarget: 100,
    durationSeconds: 180,
    subdivision: 'eighth',
    fretboardPath: {
      notes: [
        { position: { string: 6, fret: 5 }, timing: 1, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 6, fret: 8 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 5, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 5, fret: 7 }, timing: 1.75, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2.75, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 3, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 3.25, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 3.5, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 1, fret: 8 }, timing: 3.75, duration: 0.25, technique: 'h', finger: 4 },
      ],
      startFret: 4,
      endFret: 9,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'E|--5h8--------|\nA|------5h7----|\nD|----------5h7|\nG|-5h7---------|\nB|-----5h8-----|\ne|---------5h8-|',
    toleranceMs: 70,
    minimumAccuracy: 0.8,
    tips: [
      'Cada cuerda debe sonar igual de fuerte',
      'Minimiza el número de ataques de púa',
    ],
    commonMistakes: [
      'Perder volumen en cuerdas graves - más fuerza en hammer',
      'Pausas entre cuerdas - mantén el flujo continuo',
    ],
  },
];

// =============================================
// PULL-OFF EXERCISES
// =============================================

const PULL_OFF_EXERCISES: TechniqueExercise[] = [
  // Level 1: Control Básico
  {
    id: 'pull_off-L1-E1',
    techniqueId: 'pull_off',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Pull-off Simple',
    shortDescription: 'Pull-offs básicos en una cuerda',
    instructions: [
      'Coloca dedo 1 en traste 5 y dedo 3 en traste 7',
      'Toca la nota del traste 7 con la púa',
      'Tira el dedo 3 hacia abajo (como un pequeño rasgueo)',
      'El dedo 1 ya está presionado para que suene la nota',
    ],
    bpmStart: 50,
    bpmTarget: 70,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2, duration: 0.5, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 3, duration: 0.5, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 3.5, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 4, duration: 0.5, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 4.5, duration: 0.5, technique: 'p', finger: 1 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'e|--7p5--7p5--7p5--7p5--|',
    toleranceMs: 150,
    minimumAccuracy: 0.6,
    tips: [
      'El dedo inferior DEBE estar ya presionado antes de tirar',
      'Tira hacia el suelo, no hacia arriba',
    ],
    commonMistakes: [
      'Levantar en vez de tirar - el movimiento es lateral/abajo',
      'Dedo inferior no presionado - prepara ambos dedos primero',
    ],
  },
  {
    id: 'pull_off-L1-E2',
    techniqueId: 'pull_off',
    levelId: 1,
    exerciseIndex: 2,
    name: 'Pull-off con Volumen',
    shortDescription: 'Practicar pull-offs con volumen consistente',
    instructions: [
      'Ambas notas deben sonar con el mismo volumen',
      'Tira con suficiente fuerza para igualar la púa',
      'Escucha la claridad de cada nota',
    ],
    bpmStart: 60,
    bpmTarget: 80,
    durationSeconds: 90,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 1.5, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 3, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 3.5, duration: 1.5, technique: 'p', finger: 1 },
      ],
      startFret: 4,
      endFret: 9,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'B|--8p5-----8p5-----|',
    toleranceMs: 120,
    minimumAccuracy: 0.65,
    tips: [
      'Imagina que estás "rasgueando" la cuerda con el dedo que tiras',
      'El volumen debe ser igual o casi igual a la primera nota',
    ],
    commonMistakes: [
      'Segunda nota muy suave - tira con más autoridad',
      'Sonido apagado - mantén presión firme con el dedo inferior',
    ],
  },
  // Level 2-4 abbreviated for brevity...
  {
    id: 'pull_off-L2-E1',
    techniqueId: 'pull_off',
    levelId: 2,
    exerciseIndex: 1,
    name: 'Pull-off Multi-Dedo',
    shortDescription: 'Pull-offs usando diferentes combinaciones de dedos',
    instructions: [
      'Practica pull-offs con diferentes combinaciones de dedos',
      'Mantén la claridad y volumen consistente',
    ],
    bpmStart: 60,
    bpmTarget: 90,
    durationSeconds: 120,
    subdivision: 'eighth',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 8 }, timing: 1, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 2, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 2.25, duration: 0.25, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.5, technique: 'p', finger: 1 },
      ],
      startFret: 4,
      endFret: 9,
      loopable: true,
      beatsPerLoop: 2,
    },
    tabNotation: 'e|--8p7p5--8p7p5--|',
    toleranceMs: 100,
    minimumAccuracy: 0.7,
    tips: ['Todos los dedos deben tirar con la misma fuerza'],
    commonMistakes: ['El dedo del medio es más débil - practica aisladamente'],
  },
];

// =============================================
// SLIDE EXERCISES  
// =============================================

const SLIDE_EXERCISES: TechniqueExercise[] = [
  {
    id: 'slide-L1-E1',
    techniqueId: 'slide',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Slide Ascendente',
    shortDescription: 'Slides hacia arriba (hacia trastes más altos)',
    instructions: [
      'Toca la nota en el traste 5',
      'Desliza el dedo hacia el traste 7 sin levantar',
      'Mantén presión constante durante todo el deslizamiento',
    ],
    bpmStart: 50,
    bpmTarget: 75,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 1.5, technique: '/', finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 3.5, duration: 1.5, technique: '/', finger: 1 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'G|--5/7-----5/7-----|',
    toleranceMs: 150,
    minimumAccuracy: 0.6,
    tips: ['El sonido debe ser continuo, como un "glissando"'],
    commonMistakes: ['Levantar el dedo - mantén presión constante'],
  },
  {
    id: 'slide-L1-E2',
    techniqueId: 'slide',
    levelId: 1,
    exerciseIndex: 2,
    name: 'Slide Descendente',
    shortDescription: 'Slides hacia abajo (hacia trastes más bajos)',
    instructions: [
      'Toca la nota en el traste 7',
      'Desliza hacia el traste 5',
      'Controla la velocidad del deslizamiento',
    ],
    bpmStart: 50,
    bpmTarget: 75,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 3, fret: 7 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 1.5, duration: 1.5, technique: '\\', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 3.5, duration: 1.5, technique: '\\', finger: 1 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'G|--7\\5-----7\\5-----|',
    toleranceMs: 150,
    minimumAccuracy: 0.6,
    tips: ['Los slides descendentes pueden necesitar más presión'],
    commonMistakes: ['Slide demasiado rápido - controla la velocidad'],
  },
];

// =============================================
// ALTERNATE PICKING EXERCISES
// =============================================

const ALTERNATE_PICKING_EXERCISES: TechniqueExercise[] = [
  {
    id: 'alternate_picking-L1-E1',
    techniqueId: 'alternate_picking',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Púa Alternada Básica',
    shortDescription: 'Alternar abajo-arriba en una cuerda',
    instructions: [
      'Abajo en los beats (1, 2, 3, 4)',
      'Arriba en los "y" (entre beats)',
      'Movimiento pequeño desde la muñeca',
    ],
    bpmStart: 60,
    bpmTarget: 90,
    durationSeconds: 120,
    subdivision: 'eighth',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4,
      endFret: 6,
      loopable: true,
      beatsPerLoop: 2,
    },
    tabNotation: 'e|--5-5-5-5-5-5-5-5--|',
    toleranceMs: 100,
    minimumAccuracy: 0.7,
    tips: ['El ataque debe ser igual en ambas direcciones'],
    commonMistakes: ['Movimiento muy grande - minimiza el recorrido'],
  },
  {
    id: 'alternate_picking-L2-E1',
    techniqueId: 'alternate_picking',
    levelId: 2,
    exerciseIndex: 1,
    name: 'Cruce de Cuerdas',
    shortDescription: 'Alternar púa cambiando de cuerdas',
    instructions: [
      'Mantén el patrón abajo-arriba al cambiar cuerdas',
      'El cruce debe ser fluido',
    ],
    bpmStart: 60,
    bpmTarget: 85,
    durationSeconds: 150,
    subdivision: 'eighth',
    fretboardPath: {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4,
      endFret: 6,
      loopable: true,
      beatsPerLoop: 2,
    },
    tabNotation: 'e|--5---5---5---5---|\nB|----5---5---5---5-|',
    toleranceMs: 80,
    minimumAccuracy: 0.7,
    tips: ['El cruce inside (hacia cuerdas graves) puede ser más difícil'],
    commonMistakes: ['Perder el patrón al cruzar - practica lento'],
  },
];

// =============================================
// VIBRATO EXERCISES
// =============================================

const VIBRATO_EXERCISES: TechniqueExercise[] = [
  {
    id: 'vibrato-L1-E1',
    techniqueId: 'vibrato',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Vibrato Lento',
    shortDescription: 'Vibrato controlado y lento',
    instructions: [
      'Toca la nota y mantenla',
      'Haz pequeños bends rítmicos (arriba-normal-arriba-normal)',
      'El movimiento debe ser regular como un péndulo',
    ],
    bpmStart: 40,
    bpmTarget: 60,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 4, technique: '~', finger: 3 },
      ],
      startFret: 5,
      endFret: 9,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'B|--7~~~~~~~~~~~~--|',
    toleranceMs: 200,
    minimumAccuracy: 0.5,
    tips: ['El vibrato lento es más difícil de controlar que el rápido'],
    commonMistakes: ['Vibrato irregular - usa un metrónomo lento como guía'],
  },
];

// =============================================
// BEND EXERCISES
// =============================================

const BEND_EXERCISES: TechniqueExercise[] = [
  {
    id: 'bend_half-L1-E1',
    techniqueId: 'bend_half',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Bend de Medio Tono',
    shortDescription: 'Bend que sube la nota medio tono',
    instructions: [
      'Toca el traste 7 en la cuerda B',
      'Empuja la cuerda hacia arriba hasta que suene como el traste 8',
      'Usa 2-3 dedos para más control',
    ],
    bpmStart: 40,
    bpmTarget: 60,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 2, technique: 'b', finger: 3 },
      ],
      startFret: 5,
      endFret: 9,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'B|--7--7b(7.5)--|',
    toleranceMs: 200,
    minimumAccuracy: 0.5,
    tips: ['Escucha el traste 8 primero para saber cómo debe sonar'],
    commonMistakes: ['Bend insuficiente - empuja más, usa la muñeca'],
  },
  {
    id: 'bend_full-L1-E1',
    techniqueId: 'bend_full',
    levelId: 1,
    exerciseIndex: 1,
    name: 'Bend de Tono Completo',
    shortDescription: 'Bend que sube la nota un tono completo',
    instructions: [
      'Toca el traste 7 en la cuerda B',
      'Empuja hasta que suene como el traste 9',
      'Usa 3 dedos y gira la muñeca',
    ],
    bpmStart: 40,
    bpmTarget: 60,
    durationSeconds: 120,
    subdivision: 'quarter',
    fretboardPath: {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 2, technique: 'b', finger: 3 },
      ],
      startFret: 5,
      endFret: 10,
      loopable: true,
      beatsPerLoop: 4,
    },
    tabNotation: 'B|--7--7b(9)--|',
    toleranceMs: 200,
    minimumAccuracy: 0.5,
    tips: ['El giro de muñeca es clave - no solo los dedos'],
    commonMistakes: ['Quedarse corto - compara con el traste 9'],
  },
];

// =============================================
// IMPORT COMPLETE EXERCISES DATABASE
// =============================================

import { 
  ALL_COMPLETE_EXERCISES,
  getCompleteExercisesForLevel,
  getCompleteExercisesForTechnique,
  generateFallbackExercise,
} from './techniqueExercisesComplete';

// =============================================
// ALL EXERCISES COMBINED (Using complete database)
// =============================================

export const ALL_TECHNIQUE_EXERCISES: TechniqueExercise[] = ALL_COMPLETE_EXERCISES;

// =============================================
// HELPER FUNCTIONS (With fallback generation)
// =============================================

export const getExerciseById = (exerciseId: string): TechniqueExercise | undefined => {
  return ALL_TECHNIQUE_EXERCISES.find(e => e.id === exerciseId);
};

export const getExercisesForTechnique = (techniqueId: string): TechniqueExercise[] => {
  return getCompleteExercisesForTechnique(techniqueId);
};

/**
 * Get exercises for a specific level - NEVER returns empty array
 * Uses complete database with automatic fallback generation
 */
export const getExercisesForLevel = (techniqueId: string, levelId: number): TechniqueExercise[] => {
  return getCompleteExercisesForLevel(techniqueId, levelId);
};

/**
 * Get all levels for a technique - ALWAYS returns 4 levels
 */
export const getLevelsForTechnique = (techniqueId: string): TechniqueLevel[] => {
  const levelNames: Record<number, string> = {
    1: 'Control Básico',
    2: 'Precisión',
    3: 'Expresión',
    4: 'Contexto Musical',
  };
  
  const levelGoals: Record<number, string> = {
    1: 'Ejecutar la técnica correctamente de forma aislada',
    2: 'Aplicar la técnica con precisión y consistencia',
    3: 'Usar la técnica con variaciones expresivas',
    4: 'Integrar la técnica en contextos musicales reales',
  };
  
  // ALWAYS return all 4 levels
  return [1, 2, 3, 4].map(levelId => {
    const levelExercises = getExercisesForLevel(techniqueId, levelId);
    const bpmRanges = levelExercises.length > 0 
      ? levelExercises.map(e => [e.bpmStart, e.bpmTarget]).flat()
      : [60, 100]; // Default BPM range
    
    return {
      id: levelId,
      techniqueId,
      name: levelNames[levelId] || `Nivel ${levelId}`,
      goal: levelGoals[levelId] || '',
      targetBpmRange: [Math.min(...bpmRanges), Math.max(...bpmRanges)] as [number, number],
      masteryCriteria: `Completar todos los ejercicios con ${70 + levelId * 5}% de precisión`,
      exercises: levelExercises,
    };
  });
};

export const getSymbolByKey = (symbol: string): TechniqueSymbol | undefined => {
  return TECHNIQUE_SYMBOLS.find(s => s.symbol === symbol);
};

// Re-export generator for direct access
export { generateFallbackExercise };
