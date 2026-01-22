/**
 * GUITAR GUIDE PRO - TECHNIQUE MASTERY SONGS
 * 
 * REGLA INNEGOCIABLE: Ninguna técnica puede publicarse sin:
 * - Ejercicios cortos
 * - Canción final completa (24-32 compases)
 * 
 * El objetivo NO es enseñar ejercicios, es enseñar a TOCAR MÚSICA REAL.
 */

import { FretboardPath, FretboardNote, TechniqueGlyph } from './techniqueExercises';

// =============================================
// TYPES
// =============================================

export interface SongSection {
  id: 'A' | 'B' | 'C' | 'D' | 'Intro' | 'Outro';
  name: string;
  description: string;
  startMeasure: number;
  endMeasure: number;
  tabNotation: string;
  fretboardPath: FretboardPath;
  loopable: boolean;
  tips?: string[];
}

export interface TechniqueMasterySong {
  id: string;
  techniqueId: string;
  title: string;
  subtitle?: string;
  style: string;
  tonality: string;
  tempo: number;
  totalMeasures: number;
  fretZone: { start: number; end: number };
  
  // Musical content
  sections: SongSection[];
  fullTabNotation: string;
  
  // Educational
  musicalGoal: string;          // What the student learns musically
  techniqueApplication: string; // How the technique is used musically
  performanceTips: string[];
  
  // Visual/Audio
  backingTrackUrl?: string;
  demoVideoUrl?: string;
}

export interface TechniqueDidacticContent {
  techniqueId: string;
  
  // 1) RESUMEN DIDÁCTICO
  summary: {
    whatYouLearn: string;
    musicalPurpose: string;
    stylesUsed: string[];
  };
  
  // 2) EXPLICACIÓN TÉCNICA
  technicalExplanation: {
    handPosition: string;
    fingerTechnique: string;
    commonMistakes: string[];
    expertTip: string;
  };
  
  // 3) Exercises are in techniqueExercisesComplete.ts
  
  // 4) CANCIÓN FINAL
  masterySong: TechniqueMasterySong;
}

// =============================================
// HELPER: Parse Tab to FretboardPath
// =============================================

const parseTabLine = (
  stringNum: number, 
  tabLine: string, 
  startTiming: number,
  noteDuration: number = 0.5
): FretboardNote[] => {
  const notes: FretboardNote[] = [];
  let timing = startTiming;
  
  // Simple parser for common patterns
  const regex = /(\d+)([hpb\/\\~]?)(\d*)/g;
  let match;
  
  while ((match = regex.exec(tabLine)) !== null) {
    const fret = parseInt(match[1]);
    const technique = match[2] as TechniqueGlyph | '';
    const targetFret = match[3] ? parseInt(match[3]) : null;
    
    // First note
    notes.push({
      position: { string: stringNum, fret },
      timing,
      duration: noteDuration,
      finger: fret <= 5 ? 1 : fret <= 7 ? 2 : fret <= 9 ? 3 : 4,
    });
    timing += noteDuration;
    
    // Second note if technique present
    if (technique && targetFret !== null) {
      notes.push({
        position: { string: stringNum, fret: targetFret },
        timing,
        duration: noteDuration,
        technique: technique as TechniqueGlyph,
        finger: targetFret <= 5 ? 1 : targetFret <= 7 ? 2 : targetFret <= 9 ? 3 : 4,
      });
      timing += noteDuration;
    }
  }
  
  return notes;
};

// =============================================
// TECHNIQUE 1: HAMMER-ON & PULL-OFF
// "AM BLUES NARRATIVE"
// =============================================

const HAMMER_ON_SONG: TechniqueMasterySong = {
  id: 'song_hammer_on_am_blues',
  techniqueId: 'hammer_on',
  title: 'AM Blues Narrative',
  subtitle: 'Tu primera historia en La menor',
  style: 'Blues Rock',
  tonality: 'Am (La menor)',
  tempo: 72,
  totalMeasures: 32,
  fretZone: { start: 5, end: 10 },
  
  musicalGoal: 'Contar una historia musical usando hammer-ons y pull-offs como vocabulario expresivo',
  techniqueApplication: 'Los ligados crean fluidez entre notas, como las palabras en una frase',
  performanceTips: [
    'Piensa en cada sección como un párrafo de tu historia',
    'La sección A presenta el tema, B lo desarrolla, C es el clímax, D la conclusión',
    'Varía la dinámica: más suave en A, más intenso en C',
  ],
  
  sections: [
    // SECCIÓN A (1-8)
    {
      id: 'A',
      name: 'Introducción - El Despertar',
      description: 'Presenta el tema principal con hammer-ons ascendentes',
      startMeasure: 1,
      endMeasure: 8,
      tabNotation: `e|----------------5h8p5----------------|
B|------------5h8---------8p5----------|
G|--------5h7-----------------7p5------|
D|----5h7---------------------------7--|
A|-5h7---------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          // Ascenso por las cuerdas
          { position: { string: 5, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
          { position: { string: 5, fret: 7 }, timing: 1.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 4, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
          { position: { string: 4, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 3, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 2, fret: 5 }, timing: 4, duration: 0.5, finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 4.5, duration: 0.5, technique: 'h', finger: 4 },
          // Descenso con pull-offs
          { position: { string: 1, fret: 5 }, timing: 5, duration: 0.5, finger: 1 },
          { position: { string: 1, fret: 8 }, timing: 5.5, duration: 0.25, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 5 }, timing: 5.75, duration: 0.25, technique: 'p', finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 6, duration: 0.25, finger: 4 },
          { position: { string: 2, fret: 5 }, timing: 6.25, duration: 0.25, technique: 'p', finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 6.5, duration: 0.25, finger: 3 },
          { position: { string: 3, fret: 5 }, timing: 6.75, duration: 0.25, technique: 'p', finger: 1 },
          { position: { string: 4, fret: 7 }, timing: 7, duration: 1, finger: 3 },
        ],
        startFret: 4,
        endFret: 9,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['Mantén un flujo constante', 'El ascenso debe sentirse como subir una escalera'],
    },
    
    // SECCIÓN B (9-16)
    {
      id: 'B',
      name: 'Desarrollo - La Conversación',
      description: 'Desarrolla el tema añadiendo slides',
      startMeasure: 9,
      endMeasure: 16,
      tabNotation: `e|----------------5h8--8p5--------------|
B|------------5h8-------------8\\5------|
G|--------5h7---------------------------|
D|----5h7-------------------------------|
A|-5h7---------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 5, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
          { position: { string: 5, fret: 7 }, timing: 1.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 4, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
          { position: { string: 4, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 3, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 2, fret: 5 }, timing: 4, duration: 0.5, finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 4.5, duration: 0.5, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 5 }, timing: 5, duration: 0.5, finger: 1 },
          { position: { string: 1, fret: 8 }, timing: 5.5, duration: 0.25, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 8 }, timing: 5.75, duration: 0.25, finger: 4 },
          { position: { string: 1, fret: 5 }, timing: 6, duration: 0.5, technique: 'p', finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 6.5, duration: 0.5, finger: 4 },
          { position: { string: 2, fret: 5 }, timing: 7, duration: 1, technique: '\\', finger: 1 },
        ],
        startFret: 4,
        endFret: 9,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['El slide añade emoción', 'Piensa en esto como una pregunta musical'],
    },
    
    // SECCIÓN C (17-24)
    {
      id: 'C',
      name: 'Clímax - El Momento Intenso',
      description: 'Sube a la posición alta con vibrato para máxima expresión',
      startMeasure: 17,
      endMeasure: 24,
      tabNotation: `e|-------------8h10--10~~~-------------|
B|---------8h10------------------------|
G|-----7h9-----------------------------|
D|-7-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 7 }, timing: 1, duration: 1, finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 2, duration: 0.5, finger: 1 },
          { position: { string: 3, fret: 9 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 2, fret: 8 }, timing: 3, duration: 0.5, finger: 2 },
          { position: { string: 2, fret: 10 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 8 }, timing: 4, duration: 0.5, finger: 2 },
          { position: { string: 1, fret: 10 }, timing: 4.5, duration: 0.5, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 10 }, timing: 5, duration: 3, technique: '~', finger: 4 },
        ],
        startFret: 6,
        endFret: 11,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['Este es tu momento de brillar', 'El vibrato debe ser expresivo, no mecánico'],
    },
    
    // SECCIÓN D (25-32)
    {
      id: 'D',
      name: 'Resolución - El Regreso',
      description: 'Vuelve al punto de partida con pull-offs descendentes',
      startMeasure: 25,
      endMeasure: 32,
      tabNotation: `e|-------------8p5---------------------|
B|---------5h8-----8p5-----------------|
G|-----5h7-------------7p5-------------|
D|-7-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 7 }, timing: 1, duration: 1, finger: 3 },
          { position: { string: 3, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 2, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 8 }, timing: 4, duration: 0.5, finger: 4 },
          { position: { string: 1, fret: 5 }, timing: 4.5, duration: 0.5, technique: 'p', finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 5, duration: 0.5, finger: 4 },
          { position: { string: 2, fret: 5 }, timing: 5.5, duration: 0.5, technique: 'p', finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 6, duration: 0.5, finger: 3 },
          { position: { string: 3, fret: 5 }, timing: 6.5, duration: 1.5, technique: 'p', finger: 1 },
        ],
        startFret: 4,
        endFret: 9,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['Desciende con calma', 'La resolución debe sentirse como llegar a casa'],
    },
  ],
  
  fullTabNotation: `=== AM BLUES NARRATIVE ===
Tempo: 72 BPM | Tonalidad: Am | 32 compases

[A] INTRODUCCIÓN (1-8)
e|----------------5h8p5----------------|
B|------------5h8---------8p5----------|
G|--------5h7-----------------7p5------|
D|----5h7---------------------------7--|
A|-5h7---------------------------------|
E|-------------------------------------|

[B] DESARROLLO (9-16)
e|----------------5h8--8p5--------------|
B|------------5h8-------------8\\5------|
G|--------5h7---------------------------|
D|----5h7-------------------------------|
A|-5h7---------------------------------|
E|-------------------------------------|

[C] CLÍMAX (17-24)
e|-------------8h10--10~~~-------------|
B|---------8h10------------------------|
G|-----7h9-----------------------------|
D|-7-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|

[D] RESOLUCIÓN (25-32)
e|-------------8p5---------------------|
B|---------5h8-----8p5-----------------|
G|-----5h7-------------7p5-------------|
D|-7-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
};

const HAMMER_ON_DIDACTIC: TechniqueDidacticContent = {
  techniqueId: 'hammer_on',
  
  summary: {
    whatYouLearn: 'El hammer-on te permite conectar notas de forma fluida sin usar la púa, creando líneas melódicas que "cantan".',
    musicalPurpose: 'Es esencial para tocar rápido sin perder musicalidad. Permite crear frases legato (ligadas) que suenan profesionales.',
    stylesUsed: ['Blues', 'Rock', 'Metal', 'Jazz', 'Funk', 'Country'],
  },
  
  technicalExplanation: {
    handPosition: 'Mano izquierda relajada, muñeca ligeramente arqueada. El pulgar detrás del mástil, no por encima.',
    fingerTechnique: 'El dedo cae perpendicular a la cuerda como un martillo. Golpea cerca del traste (no encima) con la yema.',
    commonMistakes: [
      'Golpear demasiado suave: la nota no suena. Solución: más fuerza, menos movimiento.',
      'Levantar el dedo base: se pierde sustain. Solución: mantén presionado.',
      'Golpear encima del traste: sonido apagado. Solución: golpea justo detrás del traste.',
    ],
    expertTip: 'Joe Satriani dice: "El secreto está en la economía de movimiento. El dedo debe viajar la menor distancia posible pero golpear con máxima eficiencia."',
  },
  
  masterySong: HAMMER_ON_SONG,
};

// =============================================
// TECHNIQUE 2: LEGATO + CAMBIO DE POSICIÓN
// "HORIZONTAL JOURNEY"
// =============================================

const LEGATO_SONG: TechniqueMasterySong = {
  id: 'song_legato_horizontal_journey',
  techniqueId: 'legato',
  title: 'Horizontal Journey',
  subtitle: 'Explorando el mástil',
  style: 'Rock Melódico',
  tonality: 'Am (La menor)',
  tempo: 80,
  totalMeasures: 24,
  fretZone: { start: 5, end: 12 },
  
  musicalGoal: 'Conectar diferentes posiciones del mástil de forma fluida, como caminar por el diapasón',
  techniqueApplication: 'El legato permite cambiar de posición sin interrumpir la frase musical',
  performanceTips: [
    'Visualiza el mástil como un camino horizontal',
    'Cada cambio de posición debe ser suave, sin "saltos"',
    'Practica cada sección lento antes de conectarlas',
  ],
  
  sections: [
    // SECCIÓN A (1-8) - Posición 5
    {
      id: 'A',
      name: 'Base - Posición 5',
      description: 'Establece la frase en la posición inicial',
      startMeasure: 1,
      endMeasure: 8,
      tabNotation: `e|----------------5h8------------------|
B|------------5h8----------------------|
G|--------5h7--------------------------|
D|----5h7------------------------------|
A|------------------------------------|
E|------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
          { position: { string: 4, fret: 7 }, timing: 1.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 3, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 2, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 4 },
          { position: { string: 1, fret: 5 }, timing: 4, duration: 0.5, finger: 1 },
          { position: { string: 1, fret: 8 }, timing: 4.5, duration: 1.5, technique: 'h', finger: 4 },
        ],
        startFret: 4,
        endFret: 9,
        loopable: true,
        beatsPerLoop: 6,
      },
      loopable: true,
      tips: ['Esta es tu zona de confort', 'Memoriza bien esta posición'],
    },
    
    // SECCIÓN B (9-16) - Transición a posición 8
    {
      id: 'B',
      name: 'Ascenso - Hacia Posición 8',
      description: 'Sube al siguiente registro manteniendo el legato',
      startMeasure: 9,
      endMeasure: 16,
      tabNotation: `e|-------------8h10h12----------------|
B|---------8h10-----------------------|
G|-----7h9----------------------------|
D|-7----------------------------------|
A|------------------------------------|
E|------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 7 }, timing: 1, duration: 1, finger: 1 },
          { position: { string: 3, fret: 7 }, timing: 2, duration: 0.5, finger: 1 },
          { position: { string: 3, fret: 9 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 2, fret: 8 }, timing: 3, duration: 0.5, finger: 1 },
          { position: { string: 2, fret: 10 }, timing: 3.5, duration: 0.5, technique: 'h', finger: 3 },
          { position: { string: 1, fret: 8 }, timing: 4, duration: 0.33, finger: 1 },
          { position: { string: 1, fret: 10 }, timing: 4.33, duration: 0.33, technique: 'h', finger: 3 },
          { position: { string: 1, fret: 12 }, timing: 4.66, duration: 1.34, technique: 'h', finger: 4 },
        ],
        startFret: 6,
        endFret: 13,
        loopable: true,
        beatsPerLoop: 6,
      },
      loopable: true,
      tips: ['El cambio de posición ocurre gradualmente', 'No mires tus manos, confía en tu oído'],
    },
    
    // SECCIÓN C (17-24) - Descenso
    {
      id: 'C',
      name: 'Descenso - El Regreso',
      description: 'Desciende usando slides para conectar posiciones',
      startMeasure: 17,
      endMeasure: 24,
      tabNotation: `e|-------------12\\10\\8\\5---------------|
B|---------10--------------------------|
G|-----9-------------------------------|
D|-7----------------------------------|
A|------------------------------------|
E|------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 7 }, timing: 1, duration: 1, finger: 1 },
          { position: { string: 3, fret: 9 }, timing: 2, duration: 1, finger: 3 },
          { position: { string: 2, fret: 10 }, timing: 3, duration: 1, finger: 3 },
          { position: { string: 1, fret: 12 }, timing: 4, duration: 0.5, finger: 4 },
          { position: { string: 1, fret: 10 }, timing: 4.5, duration: 0.5, technique: '\\', finger: 3 },
          { position: { string: 1, fret: 8 }, timing: 5, duration: 0.5, technique: '\\', finger: 1 },
          { position: { string: 1, fret: 5 }, timing: 5.5, duration: 1.5, technique: '\\', finger: 1 },
        ],
        startFret: 4,
        endFret: 13,
        loopable: true,
        beatsPerLoop: 7,
      },
      loopable: true,
      tips: ['Los slides deben sonar conectados', 'Mantén la presión durante todo el slide'],
    },
  ],
  
  fullTabNotation: `=== HORIZONTAL JOURNEY ===
Tempo: 80 BPM | Tonalidad: Am | 24 compases

[A] BASE - POSICIÓN 5 (1-8)
e|----------------5h8------------------|
B|------------5h8----------------------|
G|--------5h7--------------------------|
D|----5h7------------------------------|
A|------------------------------------|
E|------------------------------------|

[B] ASCENSO - HACIA POSICIÓN 8 (9-16)
e|-------------8h10h12----------------|
B|---------8h10-----------------------|
G|-----7h9----------------------------|
D|-7----------------------------------|
A|------------------------------------|
E|------------------------------------|

[C] DESCENSO - EL REGRESO (17-24)
e|-------------12\\10\\8\\5---------------|
B|---------10--------------------------|
G|-----9-------------------------------|
D|-7----------------------------------|
A|------------------------------------|
E|------------------------------------|`,
};

const LEGATO_DIDACTIC: TechniqueDidacticContent = {
  techniqueId: 'legato',
  
  summary: {
    whatYouLearn: 'El legato con cambio de posición te permite tocar frases largas que cruzan todo el mástil sin perder fluidez.',
    musicalPurpose: 'Los grandes guitarristas como Allan Holdsworth o Guthrie Govan son famosos por su legato "horizontal" que suena como un instrumento de viento.',
    stylesUsed: ['Fusion', 'Progressive Rock', 'Jazz', 'Neo-Classical Metal'],
  },
  
  technicalExplanation: {
    handPosition: 'La mano se mueve como un bloque. El pulgar guía el movimiento detrás del mástil.',
    fingerTechnique: 'Anticipa el siguiente grupo de notas mientras tocas el actual. Piensa siempre "una posición adelante".',
    commonMistakes: [
      'Pausa entre posiciones: el legato se rompe. Solución: practica el cambio aislado.',
      'Tensión en el brazo: fatiga rápida. Solución: relaja el hombro.',
      'Perder el tempo: el cambio desincroniza. Solución: usa metrónomo lento.',
    ],
    expertTip: 'Allan Holdsworth: "No pienses en posiciones, piensa en sonido. Deja que tu oído guíe tu mano."',
  },
  
  masterySong: LEGATO_SONG,
};

// =============================================
// TECHNIQUE 3: BENDING + VIBRATO
// "EMOTIONAL PEAK"
// =============================================

const BENDING_SONG: TechniqueMasterySong = {
  id: 'song_bending_emotional_peak',
  techniqueId: 'bend',
  title: 'Emotional Peak',
  subtitle: 'Expresión máxima',
  style: 'Rock Emotivo',
  tonality: 'Em (Mi menor)',
  tempo: 65,
  totalMeasures: 32,
  fretZone: { start: 7, end: 12 },
  
  musicalGoal: 'Usar bends y vibrato para expresar emoción, como un cantante usa su voz',
  techniqueApplication: 'El bend "llora" y el vibrato "canta". Juntos son el vocabulario emocional del guitarrista.',
  performanceTips: [
    'Escucha a B.B. King: cada bend cuenta una historia',
    'El vibrato debe ser controlado, no errático',
    'Menos notas, más expresión. No toques rápido, toca con sentimiento.',
  ],
  
  sections: [
    // SECCIÓN A (1-8) - Tema simple
    {
      id: 'A',
      name: 'Tema - La Calma',
      description: 'Presenta el tema con notas simples, sin bend aún',
      startMeasure: 1,
      endMeasure: 8,
      tabNotation: `e|-------------------------------------|
B|---------8---------------------------|
G|-----7--------------------------------|
D|-9-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 9 }, timing: 1, duration: 2, finger: 3 },
          { position: { string: 3, fret: 7 }, timing: 3, duration: 2, finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 5, duration: 3, finger: 2 },
        ],
        startFret: 6,
        endFret: 10,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['Deja que las notas respiren', 'Este es el "antes" emocional'],
    },
    
    // SECCIÓN B (9-16) - Introducción del bend
    {
      id: 'B',
      name: 'Desarrollo - Primera Emoción',
      description: 'Introduce el primer bend, medio tono',
      startMeasure: 9,
      endMeasure: 16,
      tabNotation: `e|-------------------------------------|
B|--8b9----8---------------------------|
G|-------------9--7--------------------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 2, fret: 8 }, timing: 1, duration: 1, finger: 2 },
          { position: { string: 2, fret: 9 }, timing: 2, duration: 1, technique: 'b', finger: 3 }, // bend target
          { position: { string: 2, fret: 8 }, timing: 3, duration: 1, finger: 2 },
          { position: { string: 3, fret: 9 }, timing: 4, duration: 1, finger: 3 },
          { position: { string: 3, fret: 7 }, timing: 5, duration: 3, finger: 1 },
        ],
        startFret: 6,
        endFret: 10,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['El bend debe llegar exactamente al tono', 'Usa el apoyo de varios dedos'],
    },
    
    // SECCIÓN C (17-24) - Clímax emocional
    {
      id: 'C',
      name: 'Clímax - El Grito',
      description: 'Bend de tono completo con vibrato expresivo',
      startMeasure: 17,
      endMeasure: 24,
      tabNotation: `e|-------------------------------------|
B|--10b12~~~--10b12r10------------------|
G|--------------------------9----------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 2, fret: 10 }, timing: 1, duration: 0.5, finger: 3 },
          { position: { string: 2, fret: 12 }, timing: 1.5, duration: 2.5, technique: 'b', finger: 3 }, // full bend + vibrato
          { position: { string: 2, fret: 10 }, timing: 4, duration: 0.5, finger: 3 },
          { position: { string: 2, fret: 12 }, timing: 4.5, duration: 1, technique: 'b', finger: 3 },
          { position: { string: 2, fret: 10 }, timing: 5.5, duration: 0.5, technique: 'r', finger: 3 }, // release
          { position: { string: 3, fret: 9 }, timing: 6, duration: 2, finger: 3 },
        ],
        startFret: 8,
        endFret: 13,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['Este es tu momento de máxima expresión', 'El vibrato debe ser lento y amplio'],
    },
    
    // SECCIÓN D (25-32) - Resolución
    {
      id: 'D',
      name: 'Resolución - La Paz',
      description: 'Vuelve a la calma con vibrato suave',
      startMeasure: 25,
      endMeasure: 32,
      tabNotation: `e|-------------------------------------|
B|---------8~~~------------------------|
G|-----7--------------------------------|
D|-9-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
      fretboardPath: {
        notes: [
          { position: { string: 4, fret: 9 }, timing: 1, duration: 2, finger: 3 },
          { position: { string: 3, fret: 7 }, timing: 3, duration: 2, finger: 1 },
          { position: { string: 2, fret: 8 }, timing: 5, duration: 3, technique: '~', finger: 2 },
        ],
        startFret: 6,
        endFret: 10,
        loopable: true,
        beatsPerLoop: 8,
      },
      loopable: true,
      tips: ['Vuelve al tema inicial pero con vibrato', 'La resolución debe sentirse satisfactoria'],
    },
  ],
  
  fullTabNotation: `=== EMOTIONAL PEAK ===
Tempo: 65 BPM | Tonalidad: Em | 32 compases

[A] TEMA - LA CALMA (1-8)
e|-------------------------------------|
B|---------8---------------------------|
G|-----7--------------------------------|
D|-9-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|

[B] DESARROLLO - PRIMERA EMOCIÓN (9-16)
e|-------------------------------------|
B|--8b9----8---------------------------|
G|-------------9--7--------------------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|

[C] CLÍMAX - EL GRITO (17-24)
e|-------------------------------------|
B|--10b12~~~--10b12r10------------------|
G|--------------------------9----------|
D|-------------------------------------|
A|-------------------------------------|
E|-------------------------------------|

[D] RESOLUCIÓN - LA PAZ (25-32)
e|-------------------------------------|
B|---------8~~~------------------------|
G|-----7--------------------------------|
D|-9-----------------------------------|
A|-------------------------------------|
E|-------------------------------------|`,
};

const BENDING_DIDACTIC: TechniqueDidacticContent = {
  techniqueId: 'bend',
  
  summary: {
    whatYouLearn: 'El bending te permite "cantar" con la guitarra, subiendo el tono de una nota para expresar emoción.',
    musicalPurpose: 'Es la técnica más expresiva de la guitarra. Ningún otro instrumento puede hacer esto exactamente igual.',
    stylesUsed: ['Blues', 'Rock', 'Country', 'Soul', 'R&B'],
  },
  
  technicalExplanation: {
    handPosition: 'Pulgar por encima del mástil (estilo blues). La fuerza viene de la muñeca, no de los dedos.',
    fingerTechnique: 'Usa 2-3 dedos juntos para reforzar. Empuja hacia arriba en cuerdas agudas, hacia abajo en graves.',
    commonMistakes: [
      'Bend desafinado: no llega al tono correcto. Solución: practica con afinador.',
      'Vibrato errático: suena amateur. Solución: practica vibrato aislado.',
      'Demasiada tensión: fatiga y dolor. Solución: usa el peso del brazo, no fuerza.',
    ],
    expertTip: 'David Gilmour: "El bend es tu voz. Practica cantando la nota que quieres alcanzar ANTES de hacerla con la guitarra."',
  },
  
  masterySong: BENDING_SONG,
};

// =============================================
// EXPORTS
// =============================================

export const TECHNIQUE_DIDACTIC_CONTENT: Record<string, TechniqueDidacticContent> = {
  'hammer_on': HAMMER_ON_DIDACTIC,
  'legato': LEGATO_DIDACTIC,
  'bend': BENDING_DIDACTIC,
};

export const TECHNIQUE_MASTERY_SONGS: Record<string, TechniqueMasterySong> = {
  'hammer_on': HAMMER_ON_SONG,
  'legato': LEGATO_SONG,
  'bend': BENDING_SONG,
};

// Helper to get song by technique
export const getMasterySongByTechnique = (techniqueId: string): TechniqueMasterySong | null => {
  return TECHNIQUE_MASTERY_SONGS[techniqueId] || null;
};

// Helper to get didactic content
export const getDidacticContentByTechnique = (techniqueId: string): TechniqueDidacticContent | null => {
  return TECHNIQUE_DIDACTIC_CONTENT[techniqueId] || null;
};

// Helper to check if technique has complete content
export const isTechniqueComplete = (techniqueId: string): boolean => {
  return !!TECHNIQUE_MASTERY_SONGS[techniqueId] && !!TECHNIQUE_DIDACTIC_CONTENT[techniqueId];
};

export default TECHNIQUE_MASTERY_SONGS;
