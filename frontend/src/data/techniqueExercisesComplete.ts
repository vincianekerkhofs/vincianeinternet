/**
 * GUITAR GUIDE PRO - COMPLETE TECHNIQUE EXERCISES DATABASE
 * Full exercises for ALL 12 techniques across ALL 4 mastery levels
 * Total: 12 techniques × 4 levels × 2-3 exercises = ~100 exercises
 * 
 * GOLDEN RULES:
 * 1. EVERY technique has exercises for ALL 4 levels
 * 2. EVERY exercise is musically valid and pedagogically sound
 * 3. NO empty states - if data missing, auto-generate
 * 4. All content is original (no copyrighted material)
 */

import { TechniqueExercise, FretboardPath, FretboardNote, TechniqueGlyph } from './techniqueExercises';

// =============================================
// HELPER: Create Exercise Factory
// =============================================

const createExercise = (
  id: string,
  techniqueId: string,
  levelId: number,
  exerciseIndex: number,
  name: string,
  shortDescription: string,
  instructions: string[],
  fretboardPath: FretboardPath,
  tabNotation: string,
  options: Partial<TechniqueExercise> = {}
): TechniqueExercise => {
  // Default BPM ranges by level
  const bpmDefaults: Record<number, { start: number; target: number }> = {
    1: { start: 50, target: 70 },
    2: { start: 60, target: 85 },
    3: { start: 70, target: 100 },
    4: { start: 80, target: 120 },
  };
  
  const bpm = bpmDefaults[levelId] || bpmDefaults[1];
  
  return {
    id,
    techniqueId,
    levelId,
    exerciseIndex,
    name,
    shortDescription,
    instructions,
    bpmStart: options.bpmStart ?? bpm.start,
    bpmTarget: options.bpmTarget ?? bpm.target,
    durationSeconds: options.durationSeconds ?? (90 + levelId * 30),
    subdivision: options.subdivision ?? 'eighth',
    swing: options.swing,
    fretboardPath,
    tabNotation,
    toleranceMs: options.toleranceMs ?? (180 - levelId * 30),
    minimumAccuracy: options.minimumAccuracy ?? (0.55 + levelId * 0.1),
    tips: options.tips ?? [],
    commonMistakes: options.commonMistakes ?? [],
  };
};

// =============================================
// HAMMER-ON EXERCISES (Complete)
// =============================================

const HAMMER_ON_COMPLETE: TechniqueExercise[] = [
  // Level 1: Control Básico
  createExercise(
    'hammer_on-L1-E1', 'hammer_on', 1, 1,
    'Hammer-on Simple',
    'Hammer-ons aislados en la cuerda E alta',
    [
      'Coloca el dedo 1 en el traste 5 de la cuerda E alta',
      'Toca la nota con la púa',
      'Golpea el traste 7 con el dedo 3, fuerte y perpendicular',
      'La segunda nota debe sonar claramente sin púa',
    ],
    {
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
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'e|--5h7--5h7--5h7--5h7--|',
    {
      tips: ['El dedo debe caer como un martillo, no deslizarse', 'Mantén el primer dedo presionado mientras golpeas'],
      commonMistakes: ['Golpe demasiado suave', 'Levantar el primer dedo'],
    }
  ),
  createExercise(
    'hammer_on-L1-E2', 'hammer_on', 1, 2,
    'Hammer-on Rítmico',
    'Hammer-ons sincronizados con metrónomo',
    [
      'Escucha el metrónomo antes de empezar',
      'Toca el hammer-on exactamente en cada beat',
      'Mantén el tempo constante',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 1.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 3.5, duration: 1.5, technique: 'h', finger: 3 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'e|--5h7-----5h7-----|',
    { tips: ['Cuenta los beats en voz alta'], commonMistakes: ['Acelerar gradualmente'] }
  ),

  // Level 2: Precisión
  createExercise(
    'hammer_on-L2-E1', 'hammer_on', 2, 1,
    'Hammer-on Multi-Cuerda',
    'Hammer-ons descendiendo por las cuerdas',
    [
      'Practica el patrón bajando de cuerda en cuerda',
      'Mantén la misma fuerza en cada cuerda',
      'Las cuerdas graves necesitan más fuerza',
    ],
    {
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
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 2,
    },
    'e|--5h7--|\nB|--5h7--|\nG|--5h7--|\nD|--5h7--|',
    { tips: ['Las cuerdas graves requieren más fuerza'], commonMistakes: ['Perder volumen al bajar'] }
  ),
  createExercise(
    'hammer_on-L2-E2', 'hammer_on', 2, 2,
    'Secuencia 1-2-3',
    'Hammer-ons consecutivos con tres dedos',
    [
      'Coloca el dedo 1 en el traste 5',
      'Hammer al traste 6 con dedo 2, luego al 7 con dedo 3',
      'Cada nota debe sonar clara y separada',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 6 }, timing: 1.33, duration: 0.33, technique: 'h', finger: 2 },
        { position: { string: 1, fret: 7 }, timing: 1.66, duration: 0.34, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 6 }, timing: 2.33, duration: 0.33, technique: 'h', finger: 2 },
        { position: { string: 1, fret: 7 }, timing: 2.66, duration: 0.34, technique: 'h', finger: 3 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 2,
    },
    'e|--5h6h7--5h6h7--|',
    { subdivision: 'triplet', tips: ['Prepara todos los dedos antes'], commonMistakes: ['Segundo hammer débil'] }
  ),

  // Level 3: Expresión
  createExercise(
    'hammer_on-L3-E1', 'hammer_on', 3, 1,
    'Hammer-Pull Combo',
    'Combinación fluida de hammer-ons y pull-offs',
    [
      'Toca 5h7p5 como una unidad fluida',
      'Solo usa la púa en la primera nota',
      'El sonido debe ser continuo y cantante',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.33, duration: 0.33, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.66, duration: 0.34, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.33, duration: 0.33, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2.66, duration: 0.34, technique: 'p', finger: 1 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 2,
    },
    'e|--5h7p5--5h7p5--|',
    { subdivision: 'triplet', tips: ['Mantén el dedo 1 siempre presionado'], commonMistakes: ['Pausas entre notas'] }
  ),
  createExercise(
    'hammer_on-L3-E2', 'hammer_on', 3, 2,
    'Trill Controlado',
    'Trills rápidos manteniendo el control',
    [
      'Alterna 5h7p5 lo más rápido posible',
      'Mantén todas las notas claras',
      'La velocidad viene de la relajación',
    ],
    {
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
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 1,
    },
    'e|--5tr7--|',
    { subdivision: 'sixteenth', tips: ['Empieza lento y aumenta'], commonMistakes: ['Tensión en la mano'] }
  ),

  // Level 4: Contexto Musical
  createExercise(
    'hammer_on-L4-E1', 'hammer_on', 4, 1,
    'Lick Blues con Hammer-ons',
    'Frase blues clásica usando la técnica',
    [
      'Este es un lick de blues en Am pentatónica',
      'Toca con feeling, no solo precisión',
      'El swing es sutil pero importante',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.75, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 3, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2.25, duration: 0.5, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 3, duration: 1, finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'e|--5h8---------5--|\nB|------5h8--------|\nG|----------5h7----|',
    { swing: 0.6, tips: ['Deja que la última nota respire'], commonMistakes: ['Tocar demasiado recto'] }
  ),
  createExercise(
    'hammer_on-L4-E2', 'hammer_on', 4, 2,
    'Escala Legato Pentatónica',
    'Escala Am pentatónica con máximo legato',
    [
      'Solo usa púa en la primera nota de cada cuerda',
      'El resto son hammer-ons',
      'Busca un sonido fluido y cantante',
    ],
    {
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
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'E|--5h8--|\nA|--5h7--|\nD|--5h7--|\nG|--5h7--|\nB|--5h8--|\ne|--5h8--|',
    { tips: ['Cada cuerda debe sonar igual de fuerte'], commonMistakes: ['Pausas entre cuerdas'] }
  ),
];

// =============================================
// PULL-OFF EXERCISES (Complete)
// =============================================

const PULL_OFF_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'pull_off-L1-E1', 'pull_off', 1, 1,
    'Pull-off Simple',
    'Pull-offs básicos en una cuerda',
    [
      'Coloca dedo 1 en traste 5 y dedo 3 en traste 7',
      'Toca la nota del traste 7 con púa',
      'Tira el dedo 3 hacia abajo (pequeño rasgueo)',
    ],
    {
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
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'e|--7p5--7p5--7p5--7p5--|',
    { tips: ['El dedo inferior DEBE estar presionado antes'], commonMistakes: ['Levantar en vez de tirar'] }
  ),
  createExercise(
    'pull_off-L1-E2', 'pull_off', 1, 2,
    'Pull-off con Volumen',
    'Mantener volumen consistente',
    [
      'Ambas notas deben sonar igual de fuerte',
      'Tira con suficiente fuerza',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 1.5, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 3, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 3.5, duration: 1.5, technique: 'p', finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--8p5-----8p5-----|',
    { tips: ['Imagina rasguear con el dedo'], commonMistakes: ['Segunda nota muy suave'] }
  ),

  // Level 2
  createExercise(
    'pull_off-L2-E1', 'pull_off', 2, 1,
    'Pull-off Descendente Triple',
    'Tres pull-offs consecutivos',
    [
      'Prepara los tres dedos antes de empezar',
      'Tira cada dedo con la misma fuerza',
    ],
    {
      notes: [
        { position: { string: 1, fret: 8 }, timing: 1, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 2, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 2.25, duration: 0.25, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.5, technique: 'p', finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'e|--8p7p5--8p7p5--|',
    { tips: ['Todos los dedos tiran con igual fuerza'], commonMistakes: ['Dedo del medio débil'] }
  ),
  createExercise(
    'pull_off-L2-E2', 'pull_off', 2, 2,
    'Pull-off Multi-Cuerda',
    'Pull-offs subiendo por las cuerdas',
    [
      'Practica el patrón subiendo de cuerda',
      'Ajusta la fuerza para cada cuerda',
    ],
    {
      notes: [
        { position: { string: 4, fret: 7 }, timing: 1, duration: 0.25, finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 0.25, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 1.75, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 2, duration: 0.25, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 2.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 2.5, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, technique: 'p', finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'D|--7p5--|\nG|--7p5--|\nB|--8p5--|\ne|--8p5--|',
    { tips: ['Las cuerdas agudas suenan más fácil'], commonMistakes: ['Perder volumen en cuerdas graves'] }
  ),

  // Level 3
  createExercise(
    'pull_off-L3-E1', 'pull_off', 3, 1,
    'Cascada Descendente',
    'Pull-offs continuos bajando la escala',
    [
      'Una sola púa inicial, todo lo demás son pull-offs',
      'Mantén el flujo sin pausas',
    ],
    {
      notes: [
        { position: { string: 1, fret: 8 }, timing: 1, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.25, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.75, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2, duration: 0.25, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2.5, duration: 0.25, finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 2.75, duration: 0.25, technique: 'p', finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'e|--8p5--|\nB|--8p5--|\nG|--7p5--|\nD|--7p5--|',
    { tips: ['Mantén el flujo continuo'], commonMistakes: ['Pausas al cambiar de cuerda'] }
  ),
  createExercise(
    'pull_off-L3-E2', 'pull_off', 3, 2,
    'Pull-off Expresivo',
    'Variaciones dinámicas en los pull-offs',
    [
      'Varía la intensidad del pull-off',
      'Algunos más suaves, otros más fuertes',
    ],
    {
      notes: [
        { position: { string: 2, fret: 10 }, timing: 1, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.5, technique: 'p', finger: 2 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 10 }, timing: 3, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 8 }, timing: 3.5, duration: 0.25, technique: 'p', finger: 2 },
        { position: { string: 2, fret: 7 }, timing: 3.75, duration: 0.25, technique: 'p', finger: 1 },
      ],
      startFret: 6, endFret: 11, loopable: true, beatsPerLoop: 4,
    },
    'B|--10p8p7--10p8p7--|',
    { tips: ['El primer pull-off es fuerte, el segundo suave'], commonMistakes: ['Todo igual'] }
  ),

  // Level 4
  createExercise(
    'pull_off-L4-E1', 'pull_off', 4, 1,
    'Lick Rock con Pull-offs',
    'Frase de rock clásica',
    [
      'Este lick usa pull-offs como ornamento',
      'Toca con actitud y energía',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.25, finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 0.5, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2.25, duration: 0.75, finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 3, duration: 1, technique: 'p', finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--8p5---------|\nG|------7--5p---|\nD|------------7p5|',
    { tips: ['Deja respirar las notas largas'], commonMistakes: ['Apresurar el final'] }
  ),
  createExercise(
    'pull_off-L4-E2', 'pull_off', 4, 2,
    'Escala Descendente Legato',
    'Am pentatónica bajando con pull-offs',
    [
      'Escala completa descendente',
      'Solo una púa al inicio de cada cuerda',
    ],
    {
      notes: [
        { position: { string: 1, fret: 8 }, timing: 1, duration: 0.25, finger: 4, isRoot: true },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.25, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.75, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2, duration: 0.25, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2.5, duration: 0.25, finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 2.75, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 5, fret: 7 }, timing: 3, duration: 0.25, finger: 3 },
        { position: { string: 5, fret: 5 }, timing: 3.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 6, fret: 8 }, timing: 3.5, duration: 0.25, finger: 4 },
        { position: { string: 6, fret: 5 }, timing: 3.75, duration: 0.25, technique: 'p', finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'e|--8p5--|\nB|--8p5--|\nG|--7p5--|\nD|--7p5--|\nA|--7p5--|\nE|--8p5--|',
    { tips: ['Mantén el flujo sin interrupciones'], commonMistakes: ['Perder momentum'] }
  ),
];

// =============================================
// SLIDE EXERCISES (Complete)
// =============================================

const SLIDE_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'slide-L1-E1', 'slide', 1, 1,
    'Slide Ascendente',
    'Slides hacia arriba de 2 trastes',
    [
      'Toca la nota en el traste 5',
      'Desliza hacia el traste 7 sin levantar',
      'Mantén presión constante',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 1.5, technique: '/', finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 3.5, duration: 1.5, technique: '/', finger: 1 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'G|--5/7-----5/7-----|',
    { tips: ['El sonido debe ser un glissando continuo'], commonMistakes: ['Levantar el dedo'] }
  ),
  createExercise(
    'slide-L1-E2', 'slide', 1, 2,
    'Slide Descendente',
    'Slides hacia abajo de 2 trastes',
    [
      'Toca la nota en el traste 7',
      'Desliza hacia el traste 5',
      'Controla la velocidad',
    ],
    {
      notes: [
        { position: { string: 3, fret: 7 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 1.5, duration: 1.5, technique: '\\', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 3.5, duration: 1.5, technique: '\\', finger: 1 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'G|--7\\5-----7\\5-----|',
    { tips: ['Los slides descendentes necesitan más presión'], commonMistakes: ['Slide muy rápido'] }
  ),

  // Level 2
  createExercise(
    'slide-L2-E1', 'slide', 2, 1,
    'Slide Largo',
    'Slides de 5 trastes',
    [
      'Desliza del traste 5 al 10',
      'Mantén presión firme todo el camino',
      'Llega exactamente al traste destino',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 10 }, timing: 1.5, duration: 1.5, technique: '/', finger: 1 },
        { position: { string: 3, fret: 10 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 3.5, duration: 1.5, technique: '\\', finger: 1 },
      ],
      startFret: 4, endFret: 11, loopable: true, beatsPerLoop: 4,
    },
    'G|--5/10----10\\5---|',
    { tips: ['Mira el traste destino mientras deslizas'], commonMistakes: ['Pasarse o quedarse corto'] }
  ),
  createExercise(
    'slide-L2-E2', 'slide', 2, 2,
    'Slide Combinado',
    'Arriba y abajo en secuencia',
    [
      'Slide arriba, luego slide abajo',
      'El dedo nunca deja la cuerda',
    ],
    {
      notes: [
        { position: { string: 2, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.25, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, technique: '\\', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.75, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2, duration: 1, technique: '\\', finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'B|--5/8\\5/8\\5--|',
    { tips: ['Mantén contacto continuo'], commonMistakes: ['Levantar entre slides'] }
  ),

  // Level 3
  createExercise(
    'slide-L3-E1', 'slide', 3, 1,
    'Slide Expresivo',
    'Slides con velocidad variable',
    [
      'Primer slide lento, segundo rápido',
      'Usa la velocidad como expresión',
    ],
    {
      notes: [
        { position: { string: 2, fret: 5 }, timing: 1, duration: 0.75, finger: 1 },
        { position: { string: 2, fret: 9 }, timing: 1.75, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 2, fret: 12 }, timing: 2, duration: 1, technique: '/', finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 3, duration: 1, technique: '\\', finger: 1 },
      ],
      startFret: 4, endFret: 13, loopable: true, beatsPerLoop: 4,
    },
    'B|--5/9/12-----5--|',
    { tips: ['La velocidad del slide añade emoción'], commonMistakes: ['Todos los slides iguales'] }
  ),
  createExercise(
    'slide-L3-E2', 'slide', 3, 2,
    'Slide Multi-Cuerda',
    'Slides cambiando de cuerda',
    [
      'Slide, cambio de cuerda, slide',
      'La transición debe ser suave',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.25, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.75, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 2.25, duration: 0.75, technique: '/', finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'G|--5/7--|\nB|--5/8--|\ne|--5/8--|',
    { tips: ['Prepara el cambio de cuerda anticipadamente'], commonMistakes: ['Pausas al cambiar'] }
  ),

  // Level 4
  createExercise(
    'slide-L4-E1', 'slide', 4, 1,
    'Conexión de Posiciones',
    'Usar slides para cambiar de posición',
    [
      'Slide desde posición 5 a posición 7',
      'Continúa tocando en la nueva posición',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 7 }, timing: 1.75, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 2, fret: 9 }, timing: 2, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 7 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 10 }, timing: 2.5, duration: 0.5, technique: 'h', finger: 4 },
      ],
      startFret: 4, endFret: 11, loopable: true, beatsPerLoop: 2,
    },
    'G|--5h7------|\nB|------5/7-9|\ne|----------7h10|',
    { tips: ['El slide es el puente entre posiciones'], commonMistakes: ['Slide desconectado'] }
  ),
  createExercise(
    'slide-L4-E2', 'slide', 4, 2,
    'Lick Blues con Slides',
    'Frase blues usando slides característicos',
    [
      'Los slides dan el sabor "crying" del blues',
      'Varía la velocidad de los slides',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 9 }, timing: 1.25, duration: 0.5, technique: '/', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.75, duration: 0.25, technique: '\\', finger: 1 },
        { position: { string: 3, fret: 9 }, timing: 2, duration: 0.5, finger: 3 },
        { position: { string: 3, fret: 7 }, timing: 2.5, duration: 0.25, technique: '\\', finger: 1 },
        { position: { string: 4, fret: 9 }, timing: 2.75, duration: 0.25, finger: 3 },
        { position: { string: 4, fret: 7 }, timing: 3, duration: 1, technique: '\\', finger: 1, isRoot: true },
      ],
      startFret: 6, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'B|--7/9\\7------|\nG|------9\\7----|\nD|----------9\\7|',
    { swing: 0.6, tips: ['Deja que el slide "llore"'], commonMistakes: ['Slides muy mecánicos'] }
  ),
];

// =============================================
// Continue with more techniques...
// =============================================

export { HAMMER_ON_COMPLETE, PULL_OFF_COMPLETE, SLIDE_COMPLETE };