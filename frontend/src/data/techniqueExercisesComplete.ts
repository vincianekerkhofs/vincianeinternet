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
// BEND HALF STEP EXERCISES (Complete)
// =============================================

const BEND_HALF_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'bend_half-L1-E1', 'bend_half', 1, 1,
    'Bend Medio Tono Básico',
    'Bend que sube la nota medio tono',
    [
      'Toca el traste 7 en la cuerda B',
      'Empuja hacia arriba hasta que suene como traste 8',
      'Usa 2-3 dedos para más control',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 2, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7--7b8--|',
    { bpmStart: 40, bpmTarget: 60, tips: ['Escucha el traste 8 primero como referencia'], commonMistakes: ['Bend insuficiente'] }
  ),
  createExercise(
    'bend_half-L1-E2', 'bend_half', 1, 2,
    'Bend y Sostener',
    'Hacer bend y mantener la nota',
    [
      'Haz el bend y mantén la nota arriba',
      'Cuenta hasta 4 manteniendo el bend',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 2.5, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7b8~~~~~--|',
    { bpmStart: 40, bpmTarget: 60, tips: ['Mantén la presión constante arriba'], commonMistakes: ['Soltar antes de tiempo'] }
  ),

  // Level 2
  createExercise(
    'bend_half-L2-E1', 'bend_half', 2, 1,
    'Bend con Afinación',
    'Precisión en la afinación del bend',
    [
      'El bend debe llegar exactamente a medio tono',
      'Compara con la nota de referencia',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.5, finger: 4 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 1, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 3, duration: 1, finger: 4 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--8--7--7b8--8--|',
    { tips: ['La nota con bend debe sonar igual que la de referencia'], commonMistakes: ['Bend desafinado'] }
  ),
  createExercise(
    'bend_half-L2-E2', 'bend_half', 2, 2,
    'Bend Rítmico',
    'Bends sincronizados con el beat',
    [
      'Haz el bend exactamente en el beat',
      'El timing es crucial',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 0.5, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 3, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 3.5, duration: 0.5, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7b8--7b8--7b8--|',
    { tips: ['El bend cae en el "y" de cada beat'], commonMistakes: ['Timing irregular'] }
  ),

  // Level 3
  createExercise(
    'bend_half-L3-E1', 'bend_half', 3, 1,
    'Bend y Release',
    'Subir y bajar el bend controladamente',
    [
      'Sube el bend, luego baja lentamente',
      'El release debe ser tan controlado como la subida',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 1, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2.5, duration: 1.5, technique: 'r', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7b8r7-------|',
    { tips: ['El release es tan importante como el bend'], commonMistakes: ['Release brusco'] }
  ),
  createExercise(
    'bend_half-L3-E2', 'bend_half', 3, 2,
    'Bend con Vibrato',
    'Añadir vibrato al bend',
    [
      'Haz el bend y añade vibrato arriba',
      'El vibrato debe ser controlado',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 2.5, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7b8~~~~~~--|',
    { tips: ['Vibrato pequeño y rítmico'], commonMistakes: ['Vibrato descontrolado'] }
  ),

  // Level 4
  createExercise(
    'bend_half-L4-E1', 'bend_half', 4, 1,
    'Lick Blues con Bends',
    'Frase blues usando bends expresivos',
    [
      'Los bends son el alma del blues',
      'Cada bend cuenta una historia',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.25, finger: 4 },
        { position: { string: 2, fret: 7 }, timing: 1.25, duration: 0.5, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.75, duration: 0.25, technique: 'r', finger: 3 },
        { position: { string: 3, fret: 7 }, timing: 2, duration: 0.5, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2.5, duration: 0.5, technique: 'p', finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 3, duration: 1, finger: 3, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--8--7b8r7-----|\\nG|----------7p5--|\\nD|--------------7|',
    { swing: 0.6, tips: ['Deja que el bend "cante"'], commonMistakes: ['Bends mecánicos'] }
  ),
  createExercise(
    'bend_half-L4-E2', 'bend_half', 4, 2,
    'Doble Parada con Bend',
    'Bend en una cuerda mientras otra suena',
    [
      'Toca dos cuerdas, bend solo en una',
      'Técnica avanzada de country/blues',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1, duration: 1, finger: 1 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 1, technique: 'b', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 1, finger: 1 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'e|--5-----5-----|\\nB|--7-----7b8---|',
    { tips: ['La cuerda e suena fija mientras la B hace bend'], commonMistakes: ['Mover ambas cuerdas'] }
  ),
];

// =============================================
// BEND FULL STEP EXERCISES (Complete)
// =============================================

const BEND_FULL_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'bend_full-L1-E1', 'bend_full', 1, 1,
    'Bend Tono Completo',
    'Bend que sube la nota un tono (2 trastes)',
    [
      'Toca el traste 7 en la cuerda B',
      'Empuja hasta que suene como el traste 9',
      'Usa 3 dedos y gira la muñeca',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 2, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'B|--7--7b9--|',
    { bpmStart: 40, bpmTarget: 60, tips: ['El giro de muñeca es clave'], commonMistakes: ['Solo usar dedos'] }
  ),
  createExercise(
    'bend_full-L1-E2', 'bend_full', 1, 2,
    'Referencia de Afinación',
    'Comparar bend con nota de referencia',
    [
      'Toca el traste 9 primero como referencia',
      'Luego haz el bend desde traste 7',
      'Deben sonar igual',
    ],
    {
      notes: [
        { position: { string: 2, fret: 9 }, timing: 1, duration: 1, finger: 4 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2.5, duration: 1.5, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'B|--9-----7b9---|',
    { bpmStart: 40, bpmTarget: 60, tips: ['Memoriza el sonido de la nota objetivo'], commonMistakes: ['Quedarse corto'] }
  ),

  // Level 2
  createExercise(
    'bend_full-L2-E1', 'bend_full', 2, 1,
    'Pre-bend',
    'Hacer el bend antes de tocar',
    [
      'Primero sube el bend en silencio',
      'Luego toca la nota ya arriba',
      'Baja lentamente',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1.5, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2.5, duration: 1.5, technique: 'r', finger: 3 },
      ],
      startFret: 5, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'B|--(b9)r7------|',
    { tips: ['El bend silencioso requiere práctica'], commonMistakes: ['Sonar al subir'] }
  ),
  createExercise(
    'bend_full-L2-E2', 'bend_full', 2, 2,
    'Bend Consecutivo',
    'Múltiples bends en secuencia',
    [
      'Bend, release, bend, release',
      'Mantén control en cada repetición',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 0.5, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 0.5, technique: 'r', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2.5, duration: 0.5, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 3, duration: 0.5, technique: 'r', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 3.5, duration: 0.5, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'B|--7b9r7b9r7b9--|',
    { tips: ['Cada bend debe llegar al mismo punto'], commonMistakes: ['Bends desiguales'] }
  ),

  // Level 3
  createExercise(
    'bend_full-L3-E1', 'bend_full', 3, 1,
    'Bend Gradual',
    'Subir el bend lentamente',
    [
      'El bend sube gradualmente durante 2 beats',
      'Control total de la velocidad',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 2, technique: 'b', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 3, duration: 2, technique: 'r', finger: 3 },
      ],
      startFret: 5, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'B|--7~~~b9~~~r7---|',
    { tips: ['Imagina un crescendo sonoro'], commonMistakes: ['Subir demasiado rápido'] }
  ),
  createExercise(
    'bend_full-L3-E2', 'bend_full', 3, 2,
    'Unison Bend',
    'Bend hacia una nota que ya suena',
    [
      'Toca nota en cuerda 1, bend en cuerda 2',
      'El bend debe igualar la nota de arriba',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 2, finger: 1 },
        { position: { string: 2, fret: 3 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 2, fret: 3 }, timing: 1.5, duration: 1.5, technique: 'b', finger: 1 },
      ],
      startFret: 2, endFret: 6, loopable: true, beatsPerLoop: 4,
    },
    'e|--5-----------|\\nB|--3b5---------|',
    { tips: ['Las dos notas deben sonar como una'], commonMistakes: ['Bend desafinado'] }
  ),

  // Level 4
  createExercise(
    'bend_full-L4-E1', 'bend_full', 4, 1,
    'Lick Blues Clásico',
    'La frase de bend más icónica del blues',
    [
      'Este es EL lick de blues',
      'Expresión sobre precisión',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.25, finger: 4 },
        { position: { string: 2, fret: 8 }, timing: 1.25, duration: 0.75, technique: 'b', finger: 4 },
        { position: { string: 2, fret: 8 }, timing: 2, duration: 0.5, technique: 'r', finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 2.5, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2.75, duration: 0.25, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 3, duration: 1, technique: 'p', finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--8b10r8p5-----|\\nG|----------7p5--|',
    { swing: 0.6, tips: ['Deja que el bend cuente la historia'], commonMistakes: ['Demasiado rápido'] }
  ),
  createExercise(
    'bend_full-L4-E2', 'bend_full', 4, 2,
    'Bend con Melodía',
    'Integrar bends en una línea melódica',
    [
      'El bend es parte de la melodía',
      'No es un efecto, es una nota',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.75, technique: 'b', finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 2.5, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 3, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 3.25, duration: 0.75, finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'e|--5---------5--|\\nB|----8b10--5----|\\nG|----------7----|',
    { tips: ['Cada nota tiene su lugar en la frase'], commonMistakes: ['Bends fuera de contexto'] }
  ),
];

// =============================================
// VIBRATO EXERCISES (Complete)
// =============================================

const VIBRATO_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'vibrato-L1-E1', 'vibrato', 1, 1,
    'Vibrato Lento',
    'Vibrato básico y controlado',
    [
      'Toca la nota y mantenla',
      'Haz pequeños bends rítmicos',
      'El movimiento es como un péndulo',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 4, technique: '~', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7~~~~~~~~~~~~--|',
    { bpmStart: 40, bpmTarget: 60, tips: ['Cuenta las oscilaciones'], commonMistakes: ['Vibrato irregular'] }
  ),
  createExercise(
    'vibrato-L1-E2', 'vibrato', 1, 2,
    'Vibrato en Diferentes Cuerdas',
    'Practicar vibrato en cada cuerda',
    [
      'El vibrato cambia según la cuerda',
      'Las agudas son más fáciles',
    ],
    {
      notes: [
        { position: { string: 1, fret: 7 }, timing: 1, duration: 2, technique: '~', finger: 3 },
        { position: { string: 3, fret: 7 }, timing: 3, duration: 2, technique: '~', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'e|--7~~~~--------|\\nG|--------7~~~~--|',
    { bpmStart: 40, bpmTarget: 60, tips: ['Ajusta la amplitud por cuerda'], commonMistakes: ['Mismo vibrato para todas'] }
  ),

  // Level 2
  createExercise(
    'vibrato-L2-E1', 'vibrato', 2, 1,
    'Vibrato con Timing',
    'Vibrato sincronizado con el beat',
    [
      'Cada oscilación cae en subdivisión',
      'Practica contando',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 4, technique: '~', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7~~|~~|~~|~~|',
    { tips: ['Una oscilación por beat'], commonMistakes: ['Vibrato desfasado'] }
  ),
  createExercise(
    'vibrato-L2-E2', 'vibrato', 2, 2,
    'Vibrato Ancho vs Estrecho',
    'Controlar la amplitud del vibrato',
    [
      'Primero vibrato estrecho',
      'Luego vibrato ancho',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 2, technique: '~', finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 3, duration: 2, technique: '~', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7~~(sutil)--7~~(amplio)--|',
    { tips: ['El estrecho es más rápido, el ancho más lento'], commonMistakes: ['No hay diferencia'] }
  ),

  // Level 3
  createExercise(
    'vibrato-L3-E1', 'vibrato', 3, 1,
    'Vibrato Progresivo',
    'Empezar sin vibrato, añadir gradualmente',
    [
      'Nota limpia primero',
      'Vibrato crece poco a poco',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 3, technique: '~', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7----7~~~~~~--|',
    { tips: ['El vibrato aparece naturalmente'], commonMistakes: ['Empezar con vibrato'] }
  ),
  createExercise(
    'vibrato-L3-E2', 'vibrato', 3, 2,
    'Vibrato Rápido',
    'Vibrato de alta velocidad controlado',
    [
      'Vibrato rápido estilo rock',
      'Mantén el control',
    ],
    {
      notes: [
        { position: { string: 2, fret: 10 }, timing: 1, duration: 4, technique: '~', finger: 3 },
      ],
      startFret: 8, endFret: 12, loopable: true, beatsPerLoop: 4,
    },
    'B|--10~~~~~~~~~~~~--|',
    { bpmStart: 70, bpmTarget: 100, tips: ['La velocidad viene de la relajación'], commonMistakes: ['Tensión excesiva'] }
  ),

  // Level 4
  createExercise(
    'vibrato-L4-E1', 'vibrato', 4, 1,
    'Vibrato en Notas Finales',
    'El vibrato clásico de fin de frase',
    [
      'La nota final siempre lleva vibrato',
      'Es la firma del guitarrista',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.25, finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 0.5, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 2, duration: 2, technique: '~', finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--8p5--------|\\nG|------7--5~~~~|',
    { tips: ['El vibrato final define tu sonido'], commonMistakes: ['Olvidar el vibrato'] }
  ),
  createExercise(
    'vibrato-L4-E2', 'vibrato', 4, 2,
    'Vibrato con Bend',
    'Añadir vibrato mientras mantienes un bend',
    [
      'Haz el bend, luego vibrato',
      'Técnica avanzada muy expresiva',
    ],
    {
      notes: [
        { position: { string: 2, fret: 7 }, timing: 1, duration: 0.5, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 2.5, technique: 'b', finger: 3 },
      ],
      startFret: 5, endFret: 9, loopable: true, beatsPerLoop: 4,
    },
    'B|--7b9~~~~~~--|',
    { tips: ['El vibrato es SOBRE el bend'], commonMistakes: ['Perder el bend al vibrar'] }
  ),
];

// =============================================
// ALTERNATE PICKING EXERCISES (Complete)
// =============================================

const ALTERNATE_PICKING_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'alternate_picking-L1-E1', 'alternate_picking', 1, 1,
    'Púa Alternada Básica',
    'Alternar abajo-arriba en una nota',
    [
      'Abajo en beats (1, 2, 3, 4)',
      'Arriba en los "y"',
      'Movimiento desde la muñeca',
    ],
    {
      notes: Array.from({ length: 8 }, (_, i) => ({
        position: { string: 1, fret: 5 },
        timing: 1 + i * 0.25,
        duration: 0.25,
        finger: 1 as const,
      })),
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-5-5-5-5-5-5-5--|',
    { tips: ['El ataque debe ser igual en ambas direcciones'], commonMistakes: ['Movimiento muy grande'] }
  ),
  createExercise(
    'alternate_picking-L1-E2', 'alternate_picking', 1, 2,
    'Patrón de Dos Notas',
    'Alternar entre dos notas',
    [
      'Mantén el patrón abajo-arriba',
      'No importa qué nota sea',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.25, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.75, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.25, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.75, duration: 0.25, finger: 3 },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-7-5-7-5-7-5-7--|',
    { tips: ['Abajo en 5, arriba en 7, siempre'], commonMistakes: ['Perder el patrón'] }
  ),

  // Level 2
  createExercise(
    'alternate_picking-L2-E1', 'alternate_picking', 2, 1,
    'Cruce de Cuerdas',
    'Mantener alternancia al cambiar cuerdas',
    [
      'El patrón no cambia al cruzar',
      'Inside picking vs outside picking',
    ],
    {
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
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5---5---5---5---|\\nB|----5---5---5---5-|',
    { tips: ['Inside picking es más difícil'], commonMistakes: ['Romper el patrón al cruzar'] }
  ),
  createExercise(
    'alternate_picking-L2-E2', 'alternate_picking', 2, 2,
    'Escala en Una Cuerda',
    'Escala cromática con púa alternada',
    [
      'Cada nota recibe púa alternada',
      'Practica subiendo y bajando',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 6 }, timing: 1.25, duration: 0.25, finger: 2 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.75, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 8 }, timing: 2, duration: 0.25, finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 2.25, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 6 }, timing: 2.5, duration: 0.25, finger: 2 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-6-7-8-8-7-6-5--|',
    { tips: ['El ataque es igual en cada dirección'], commonMistakes: ['Acentos involuntarios'] }
  ),

  // Level 3
  createExercise(
    'alternate_picking-L3-E1', 'alternate_picking', 3, 1,
    'Tresillos con Púa Alternada',
    'Mantener alternancia en subdivisión impar',
    [
      'Los tresillos cambian qué nota es abajo/arriba',
      'No te dejes confundir',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.33, duration: 0.33, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.66, duration: 0.34, finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.33, duration: 0.33, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 2.66, duration: 0.34, finger: 4 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-7-8--5-7-8--|',
    { subdivision: 'triplet', tips: ['Cada compás empieza con diferente dirección'], commonMistakes: ['Usar economy picking'] }
  ),
  createExercise(
    'alternate_picking-L3-E2', 'alternate_picking', 3, 2,
    'Salto de Cuerdas',
    'Alternar saltando cuerdas',
    [
      'Saltar cuerdas manteniendo alternancia',
      'Muy útil para arpegios',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 4, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 4, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5---5---|\\nB|--------5---5|\\nG|----5---5-----|\\nD|----------5---5|',
    { tips: ['El salto requiere precisión de la mano derecha'], commonMistakes: ['Golpear cuerdas intermedias'] }
  ),

  // Level 4
  createExercise(
    'alternate_picking-L4-E1', 'alternate_picking', 4, 1,
    'Escala Pentatónica Rápida',
    'Am pentatónica con alternate picking',
    [
      'Escala completa a velocidad',
      'Cada nota alternada estrictamente',
    ],
    {
      notes: [
        { position: { string: 6, fret: 5 }, timing: 1, duration: 0.125, finger: 1, isRoot: true },
        { position: { string: 6, fret: 8 }, timing: 1.125, duration: 0.125, finger: 4 },
        { position: { string: 5, fret: 5 }, timing: 1.25, duration: 0.125, finger: 1 },
        { position: { string: 5, fret: 7 }, timing: 1.375, duration: 0.125, finger: 3 },
        { position: { string: 4, fret: 5 }, timing: 1.5, duration: 0.125, finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 1.625, duration: 0.125, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 1.75, duration: 0.125, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.875, duration: 0.125, finger: 3 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 1,
    },
    'E|--5-8--|\\nA|--5-7--|\\nD|--5-7--|\\nG|--5-7--|',
    { subdivision: 'sixteenth', bpmStart: 80, bpmTarget: 120, tips: ['Velocidad viene de economía de movimiento'], commonMistakes: ['Tensión'] }
  ),
  createExercise(
    'alternate_picking-L4-E2', 'alternate_picking', 4, 2,
    'Lick de Paul Gilbert',
    'Secuencia 3 notas por cuerda',
    [
      'Patrón de escala descendente',
      'Clásico del rock técnico',
    ],
    {
      notes: [
        { position: { string: 1, fret: 8 }, timing: 1, duration: 0.125, finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 1.125, duration: 0.125, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.125, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.375, duration: 0.125, finger: 4 },
        { position: { string: 2, fret: 7 }, timing: 1.5, duration: 0.125, finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 1.625, duration: 0.125, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.75, duration: 0.125, finger: 4 },
        { position: { string: 3, fret: 5 }, timing: 1.875, duration: 0.125, finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 1,
    },
    'e|--8-7-5--------|\\nB|------8-7-5----|\\nG|----------7-5--|',
    { subdivision: 'sixteenth', bpmStart: 80, bpmTarget: 140, tips: ['3 notas por cuerda = acentos naturales'], commonMistakes: ['Perder sincronización manos'] }
  ),
];

// =============================================
// PALM MUTE EXERCISES (Complete)
// =============================================

const PALM_MUTE_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'palm_mute-L1-E1', 'palm_mute', 1, 1,
    'Palm Mute Básico',
    'El sonido "chug" del rock',
    [
      'Apoya la palma en el puente',
      'Las cuerdas deben vibrar pero amortiguadas',
      'Usa púa hacia abajo',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.5, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.5, technique: 'PM', finger: 1 },
      ],
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 2,
    },
    'E|--0--0--0--0--| PM',
    { tips: ['El borde de la palma toca las cuerdas'], commonMistakes: ['Demasiado mute = sin sonido'] }
  ),
  createExercise(
    'palm_mute-L1-E2', 'palm_mute', 1, 2,
    'Palm Mute en E5',
    'Power chord con palm mute',
    [
      'Toca E5 (cuerdas 6 y 5)',
      'Mantén el palm mute',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 5, fret: 2 }, timing: 1, duration: 0.5, technique: 'PM', finger: 3 },
        { position: { string: 6, fret: 0 }, timing: 1.5, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 5, fret: 2 }, timing: 1.5, duration: 0.5, technique: 'PM', finger: 3 },
        { position: { string: 6, fret: 0 }, timing: 2, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 5, fret: 2 }, timing: 2, duration: 0.5, technique: 'PM', finger: 3 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 5, fret: 2 }, timing: 2.5, duration: 0.5, technique: 'PM', finger: 3 },
      ],
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 2,
    },
    'A|--2--2--2--2--| PM\\nE|--0--0--0--0--|',
    { tips: ['Power chords suenan pesados con palm mute'], commonMistakes: ['Palm mute inconsistente'] }
  ),

  // Level 2
  createExercise(
    'palm_mute-L2-E1', 'palm_mute', 2, 1,
    'Alternar Mute y Abierto',
    'Contraste entre mute y notas limpias',
    [
      'Palm mute en notas rápidas',
      'Levantar para las notas acentuadas',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.25, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.5, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.75, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.25, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.75, duration: 0.25, technique: '>', finger: 1 },
      ],
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 2,
    },
    'E|--0-0-0->0--0-0-0->0--|',
    { tips: ['El acento es OPEN, sin palm mute'], commonMistakes: ['No hay contraste'] }
  ),
  createExercise(
    'palm_mute-L2-E2', 'palm_mute', 2, 2,
    'Gallop Pattern',
    'El ritmo galope del metal',
    [
      'Patrón: corta-corta-larga',
      'Iconic del heavy metal',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.25, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.5, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.25, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.5, technique: 'PM', finger: 1 },
      ],
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 2,
    },
    'E|--0-0--0--0-0--0--| PM (gallop)',
    { tips: ['Piensa en un caballo galopando'], commonMistakes: ['Ritmo inconsistente'] }
  ),

  // Level 3
  createExercise(
    'palm_mute-L3-E1', 'palm_mute', 3, 1,
    'Intensidad Variable',
    'Diferentes niveles de palm mute',
    [
      'Ligero → medio → pesado',
      'Ajusta la presión de la palma',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.5, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2, duration: 0.5, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.5, technique: 'PM', finger: 1 },
      ],
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 2,
    },
    'E|--0(light)-0(med)-0(heavy)-0(med)--|',
    { tips: ['Más presión = más mute'], commonMistakes: ['Todo igual'] }
  ),
  createExercise(
    'palm_mute-L3-E2', 'palm_mute', 3, 2,
    'Tremolo Picking con PM',
    'Palm mute a alta velocidad',
    [
      'Tremolo picking manteniendo el mute',
      'Muy usado en metal extremo',
    ],
    {
      notes: Array.from({ length: 16 }, (_, i) => ({
        position: { string: 6, fret: 0 },
        timing: 1 + i * 0.125,
        duration: 0.125,
        technique: 'PM' as TechniqueGlyph,
        finger: 1 as const,
      })),
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 2,
    },
    'E|--0000000000000000--| PM tremolo',
    { subdivision: 'sixteenth', bpmStart: 100, bpmTarget: 160, tips: ['Relajación es clave para velocidad'], commonMistakes: ['Tensión en el brazo'] }
  ),

  // Level 4
  createExercise(
    'palm_mute-L4-E1', 'palm_mute', 4, 1,
    'Riff de Rock Clásico',
    'Riff estilo AC/DC',
    [
      'Combinación de power chords y palm mute',
      'El groove del rock',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.25, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 2 }, timing: 1.5, duration: 0.25, technique: '>', finger: 3 },
        { position: { string: 5, fret: 2 }, timing: 1.5, duration: 0.25, technique: '>', finger: 3 },
        { position: { string: 6, fret: 0 }, timing: 1.75, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 3 }, timing: 2.25, duration: 0.25, technique: '>', finger: 4 },
        { position: { string: 5, fret: 3 }, timing: 2.25, duration: 0.25, technique: '>', finger: 4 },
        { position: { string: 6, fret: 2 }, timing: 2.5, duration: 0.5, technique: '>', finger: 3 },
        { position: { string: 5, fret: 2 }, timing: 2.5, duration: 0.5, technique: '>', finger: 3 },
      ],
      startFret: 0, endFret: 4, loopable: true, beatsPerLoop: 2,
    },
    'A|----2-----3--2--|\\nE|--0-0-2-0-0-3--2--|',
    { swing: 0.55, tips: ['El groove está en el contraste PM/open'], commonMistakes: ['Sin swing'] }
  ),
  createExercise(
    'palm_mute-L4-E2', 'palm_mute', 4, 2,
    'Breakdown de Metal',
    'Riff pesado de metalcore',
    [
      'Ritmo sincopado con palm mute',
      'Potencia y precisión',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.5, technique: '>', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.75, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.25, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.25, technique: 'PM', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 3, duration: 0.5, technique: '>', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 3.75, duration: 0.25, technique: 'PM', finger: 1 },
      ],
      startFret: 0, endFret: 3, loopable: true, beatsPerLoop: 4,
    },
    'E|-->0---0-0-0-->0---0--|',
    { tips: ['Los silencios son tan importantes como las notas'], commonMistakes: ['Llenar los espacios'] }
  ),
];

// =============================================
// POSITION SHIFT EXERCISES (Complete)
// =============================================

const POSITION_SHIFT_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'position_shift-L1-E1', 'position_shift', 1, 1,
    'Cambio de 2 Trastes',
    'Cambio pequeño de posición',
    [
      'De posición 5 a posición 7',
      'Usa una nota de conexión',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 2, duration: 0.5, finger: 2 },
        { position: { string: 1, fret: 9 }, timing: 2.5, duration: 0.5, finger: 3 },
        { position: { string: 1, fret: 7 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 3.5, duration: 0.5, finger: 1 },
      ],
      startFret: 4, endFret: 10, loopable: true, beatsPerLoop: 4,
    },
    'e|--5--7-8-9--7--5--|',
    { tips: ['El pulgar guía el movimiento'], commonMistakes: ['Cambio brusco'] }
  ),
  createExercise(
    'position_shift-L1-E2', 'position_shift', 1, 2,
    'Cambio en Una Cuerda',
    'Practicar cambios en cuerda G',
    [
      'Todos los cambios en una sola cuerda',
      'Más fácil de controlar',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 0.5, finger: 3 },
        { position: { string: 3, fret: 9 }, timing: 2, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 12 }, timing: 2.5, duration: 0.5, finger: 4 },
        { position: { string: 3, fret: 9 }, timing: 3, duration: 0.5, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 3.5, duration: 0.5, finger: 3 },
      ],
      startFret: 4, endFret: 13, loopable: true, beatsPerLoop: 4,
    },
    'G|--5-7-9-12-9-7--|',
    { tips: ['Mira el traste destino antes de moverte'], commonMistakes: ['Perderse en el mástil'] }
  ),

  // Level 2
  createExercise(
    'position_shift-L2-E1', 'position_shift', 2, 1,
    'Cambio de 5 Trastes',
    'Salto más largo',
    [
      'De posición 3 a posición 8',
      'Requiere más práctica',
    ],
    {
      notes: [
        { position: { string: 2, fret: 3 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 10 }, timing: 1.75, duration: 0.25, finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.25, duration: 0.25, finger: 3 },
        { position: { string: 2, fret: 3 }, timing: 2.5, duration: 0.5, finger: 1 },
      ],
      startFret: 2, endFret: 11, loopable: true, beatsPerLoop: 2,
    },
    'B|--3-5-8-10-8-5-3--|',
    { tips: ['Visualiza el destino antes del salto'], commonMistakes: ['Aterrizar desafinado'] }
  ),
  createExercise(
    'position_shift-L2-E2', 'position_shift', 2, 2,
    'Cambio con Slide',
    'Usar slide como conexión',
    [
      'El slide conecta las posiciones',
      'Técnica muy musical',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.25, duration: 0.25, finger: 3 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 3, fret: 9 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 11 }, timing: 2, duration: 0.5, finger: 3 },
      ],
      startFret: 4, endFret: 12, loopable: true, beatsPerLoop: 2,
    },
    'G|--5-7/9-11--|',
    { tips: ['El slide hace invisible el cambio'], commonMistakes: ['Slide desconectado'] }
  ),

  // Level 3
  createExercise(
    'position_shift-L3-E1', 'position_shift', 3, 1,
    'Cambio Rápido',
    'Cambios de posición a velocidad',
    [
      'Cambios fluidos en tempo rápido',
      'La práctica lenta crea velocidad',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 1.125, duration: 0.125, finger: 4 },
        { position: { string: 1, fret: 10 }, timing: 1.25, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 12 }, timing: 1.375, duration: 0.125, finger: 3 },
        { position: { string: 1, fret: 15 }, timing: 1.5, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 17 }, timing: 1.625, duration: 0.125, finger: 3 },
        { position: { string: 1, fret: 15 }, timing: 1.75, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 12 }, timing: 1.875, duration: 0.125, finger: 3 },
      ],
      startFret: 4, endFret: 18, loopable: true, beatsPerLoop: 1,
    },
    'e|--5-8-10-12-15-17-15-12--|',
    { subdivision: 'sixteenth', bpmStart: 60, bpmTarget: 100, tips: ['Anticipa cada posición'], commonMistakes: ['Reaccionar tarde'] }
  ),
  createExercise(
    'position_shift-L3-E2', 'position_shift', 3, 2,
    'Cambio Multi-Cuerda',
    'Cambiar posición mientras cambias de cuerda',
    [
      'Diagonal por el mástil',
      'Combina habilidades',
    ],
    {
      notes: [
        { position: { string: 4, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 10 }, timing: 1.75, duration: 0.5, finger: 1 },
      ],
      startFret: 4, endFret: 11, loopable: true, beatsPerLoop: 2,
    },
    'D|--5--------|\\nG|----7------|\\nB|------8----|\\ne|--------10-|',
    { tips: ['Movimiento diagonal fluido'], commonMistakes: ['Movimientos separados'] }
  ),

  // Level 4
  createExercise(
    'position_shift-L4-E1', 'position_shift', 4, 1,
    'Conectar Cajas Pentatónicas',
    'Moverse entre posiciones de escala',
    [
      'Caja 1 → Caja 2 → Caja 3',
      'Todo el mástil es tuyo',
    ],
    {
      notes: [
        { position: { string: 6, fret: 5 }, timing: 1, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 6, fret: 8 }, timing: 1.25, duration: 0.25, finger: 4 },
        { position: { string: 5, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 5, fret: 7 }, timing: 1.75, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 5, fret: 10 }, timing: 2, duration: 0.25, finger: 4 },
        { position: { string: 4, fret: 7 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 4, fret: 9 }, timing: 2.5, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 4, fret: 12 }, timing: 2.75, duration: 0.25, finger: 4 },
      ],
      startFret: 4, endFret: 13, loopable: true, beatsPerLoop: 2,
    },
    'E|--5-8------|\\nA|------5/7-10|\\nD|----------7/9-12|',
    { tips: ['Los slides conectan las cajas'], commonMistakes: ['Quedarse en una caja'] }
  ),
  createExercise(
    'position_shift-L4-E2', 'position_shift', 4, 2,
    'Lick de Todo el Mástil',
    'Frase que recorre el mástil completo',
    [
      'Del traste 3 al traste 15',
      'Expresión total del instrumento',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.5, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 2, fret: 10 }, timing: 1.75, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 10 }, timing: 2.25, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 1, fret: 12 }, timing: 2.5, duration: 0.25, finger: 3 },
        { position: { string: 1, fret: 15 }, timing: 2.75, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 1, fret: 17 }, timing: 3, duration: 1, finger: 3, isRoot: true },
      ],
      startFret: 4, endFret: 18, loopable: true, beatsPerLoop: 4,
    },
    'G|--5--------|\\nB|----5/8-10-|\\ne|--------8/10-12/15-17|',
    { tips: ['Piensa en la frase como una historia'], commonMistakes: ['Movimientos mecánicos'] }
  ),
];

// =============================================
// LEGATO EXERCISES (Complete)
// =============================================

const LEGATO_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'legato-L1-E1', 'legato', 1, 1,
    'Legato de 3 Notas',
    'Frase básica de legato',
    [
      'Una púa, dos legatos',
      'El sonido debe ser fluido',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.33, duration: 0.33, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.66, duration: 0.34, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.33, duration: 0.33, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 2.66, duration: 0.34, technique: 'h', finger: 4 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'e|--5h7h8--5h7h8--|',
    { subdivision: 'triplet', tips: ['Solo púa en la primera nota'], commonMistakes: ['Añadir púas extra'] }
  ),
  createExercise(
    'legato-L1-E2', 'legato', 1, 2,
    'Legato Ascendente-Descendente',
    'Subir y bajar con legato',
    [
      'Hammer-ons subiendo, pull-offs bajando',
      'Una sola púa para toda la frase',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.5, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 1.75, duration: 0.25, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 1, technique: 'p', finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'e|--5h7h8p7p5--|',
    { tips: ['El flujo no debe interrumpirse'], commonMistakes: ['Pausas entre notas'] }
  ),

  // Level 2
  createExercise(
    'legato-L2-E1', 'legato', 2, 1,
    'Legato en Escala',
    'Escala pentatónica con legato',
    [
      'Una púa por cuerda máximo',
      'Las notas se conectan suavemente',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 3, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.75, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 1, fret: 8 }, timing: 2.25, duration: 0.75, technique: 'h', finger: 4 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'G|--5h7------|\\nB|------5h8--|\\ne|----------5h8|',
    { tips: ['Cada cuerda es una unidad'], commonMistakes: ['Separar las notas'] }
  ),
  createExercise(
    'legato-L2-E2', 'legato', 2, 2,
    'Legato Rápido',
    'Aumentar velocidad manteniendo legato',
    [
      'La velocidad viene de la eficiencia',
      'Menos púas = más velocidad potencial',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.125, duration: 0.125, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.25, duration: 0.125, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 1.375, duration: 0.125, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.625, duration: 0.125, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.75, duration: 0.125, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 7 }, timing: 1.875, duration: 0.125, technique: 'p', finger: 3 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 1,
    },
    'e|--5h7h8p7p5h7h8p7--|',
    { subdivision: 'sixteenth', bpmStart: 60, bpmTarget: 100, tips: ['Relajación = velocidad'], commonMistakes: ['Tensión excesiva'] }
  ),

  // Level 3
  createExercise(
    'legato-L3-E1', 'legato', 3, 1,
    'Legato con Slides',
    'Combinar legato y slides',
    [
      'Slides para cambiar posición',
      'Todo conectado fluidamente',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 0.25, technique: '/', finger: 1 },
        { position: { string: 1, fret: 9 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 10 }, timing: 2, duration: 0.25, technique: 'h', finger: 2 },
        { position: { string: 1, fret: 12 }, timing: 2.25, duration: 0.75, technique: 'h', finger: 4 },
      ],
      startFret: 4, endFret: 13, loopable: true, beatsPerLoop: 2,
    },
    'e|--5h7/9h10h12--|',
    { tips: ['El slide es parte del flujo'], commonMistakes: ['Slide desconectado'] }
  ),
  createExercise(
    'legato-L3-E2', 'legato', 3, 2,
    'Legato Multi-Cuerda',
    'Legato cruzando cuerdas',
    [
      'El legato continúa entre cuerdas',
      'Técnica avanzada de fluidez',
    ],
    {
      notes: [
        { position: { string: 3, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.25, duration: 0.25, technique: 'h', finger: 3 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.25, technique: 'sl', finger: 1 },
        { position: { string: 2, fret: 8 }, timing: 1.75, duration: 0.25, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, technique: 'sl', finger: 1 },
        { position: { string: 1, fret: 8 }, timing: 2.25, duration: 0.75, technique: 'h', finger: 4 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'G|--5h7------|\\nB|------5h8--|\\ne|----------5h8|',
    { tips: ['Minimiza el ataque al cambiar cuerda'], commonMistakes: ['Acentos no deseados'] }
  ),

  // Level 4
  createExercise(
    'legato-L4-E1', 'legato', 4, 1,
    'Solo Legato Estilo Satriani',
    'Frase legato avanzada',
    [
      'El legato define el sonido de muchos shredders',
      'Fluido, cantante, expresivo',
    ],
    {
      notes: [
        { position: { string: 1, fret: 12 }, timing: 1, duration: 0.125, finger: 1 },
        { position: { string: 1, fret: 14 }, timing: 1.125, duration: 0.125, technique: 'h', finger: 3 },
        { position: { string: 1, fret: 15 }, timing: 1.25, duration: 0.125, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 14 }, timing: 1.375, duration: 0.125, technique: 'p', finger: 3 },
        { position: { string: 1, fret: 12 }, timing: 1.5, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 15 }, timing: 1.625, duration: 0.125, finger: 4 },
        { position: { string: 2, fret: 14 }, timing: 1.75, duration: 0.125, technique: 'p', finger: 3 },
        { position: { string: 2, fret: 12 }, timing: 1.875, duration: 0.125, technique: 'p', finger: 1 },
      ],
      startFret: 11, endFret: 16, loopable: true, beatsPerLoop: 1,
    },
    'e|--12h14h15p14p12--|\\nB|----------------15p14p12|',
    { subdivision: 'sixteenth', bpmStart: 80, bpmTarget: 140, tips: ['Piensa en cantar la frase'], commonMistakes: ['Mecánico, sin feeling'] }
  ),
  createExercise(
    'legato-L4-E2', 'legato', 4, 2,
    'Cascada Legato',
    'Descenso legato por todo el mástil',
    [
      'Bajando el mástil con puro legato',
      'Técnica de guitarra moderna',
    ],
    {
      notes: [
        { position: { string: 1, fret: 17 }, timing: 1, duration: 0.125, finger: 4, isRoot: true },
        { position: { string: 1, fret: 15 }, timing: 1.125, duration: 0.125, technique: 'p', finger: 2 },
        { position: { string: 1, fret: 12 }, timing: 1.25, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 15 }, timing: 1.375, duration: 0.125, finger: 4 },
        { position: { string: 2, fret: 13 }, timing: 1.5, duration: 0.125, technique: 'p', finger: 2 },
        { position: { string: 2, fret: 12 }, timing: 1.625, duration: 0.125, technique: 'p', finger: 1 },
        { position: { string: 3, fret: 14 }, timing: 1.75, duration: 0.125, finger: 4 },
        { position: { string: 3, fret: 12 }, timing: 1.875, duration: 0.125, technique: 'p', finger: 1, isRoot: true },
      ],
      startFret: 11, endFret: 18, loopable: true, beatsPerLoop: 1,
    },
    'e|--17p15p12------|\\nB|--------15p13p12|\\nG|------------14p12|',
    { subdivision: 'sixteenth', bpmStart: 80, bpmTarget: 130, tips: ['Como agua cayendo en cascada'], commonMistakes: ['Notas desiguales'] }
  ),
];

// =============================================
// FINGER ROLLING EXERCISES (Complete)
// =============================================

const FINGER_ROLLING_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'finger_rolling-L1-E1', 'finger_rolling', 1, 1,
    'Rolling Básico',
    'Rolling entre dos cuerdas adyacentes',
    [
      'Presiona la cuerda e con la punta del dedo',
      'Rueda para presionar la cuerda B',
      'Solo una cuerda suena a la vez',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.5, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.5, duration: 0.5, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5---5---|\\nB|----5---5-|',
    { tips: ['El dedo se aplana al rodar'], commonMistakes: ['Ambas cuerdas suenan juntas'] }
  ),
  createExercise(
    'finger_rolling-L1-E2', 'finger_rolling', 1, 2,
    'Rolling Lento',
    'Practicar el rolling a tempo lento',
    [
      'Cada nota debe ser clara y separada',
      'Escucha que no haya superposición',
    ],
    {
      notes: [
        { position: { string: 1, fret: 7 }, timing: 1, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 2, duration: 1, finger: 3 },
        { position: { string: 1, fret: 7 }, timing: 3, duration: 1, finger: 3 },
        { position: { string: 2, fret: 7 }, timing: 4, duration: 1, finger: 3 },
      ],
      startFret: 5, endFret: 8, loopable: true, beatsPerLoop: 4,
    },
    'e|--7-------7-----|\\nB|----7-------7---|',
    { bpmStart: 40, bpmTarget: 60, tips: ['Lento permite escuchar cada nota'], commonMistakes: ['Ir demasiado rápido'] }
  ),

  // Level 2
  createExercise(
    'finger_rolling-L2-E1', 'finger_rolling', 2, 1,
    'Rolling a Tempo',
    'Rolling sincronizado con metrónomo',
    [
      'El rolling cae exactamente en el beat',
      'Practica con consistencia',
    ],
    {
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
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-5-5-5--|\\nB|--5-5-5-5--|',
    { tips: ['El rolling debe ser rítmico'], commonMistakes: ['Timing irregular'] }
  ),
  createExercise(
    'finger_rolling-L2-E2', 'finger_rolling', 2, 2,
    'Rolling en Tres Cuerdas',
    'Extender el rolling a más cuerdas',
    [
      'Rolling desde e hasta G',
      'El mismo dedo toca las tres cuerdas',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.33, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.33, duration: 0.33, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 1.66, duration: 0.34, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.33, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.33, duration: 0.33, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 2.66, duration: 0.34, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-----5-----|\\nB|----5-----5---|\\nG|------5-----5-|',
    { subdivision: 'triplet', tips: ['El dedo se aplana progresivamente'], commonMistakes: ['Notas cortadas'] }
  ),

  // Level 3
  createExercise(
    'finger_rolling-L3-E1', 'finger_rolling', 3, 1,
    'Rolling en Arpegio',
    'Aplicar rolling a un arpegio',
    [
      'Arpegio de Am usando rolling',
      'Cada nota del arpegio debe sonar clara',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1, isRoot: true },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 1, finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5-------5--|\\nB|----5---5----|\\nG|------5------|',
    { tips: ['Patrón de arpegio típico de fingerpicking'], commonMistakes: ['Perder el patrón'] }
  ),
  createExercise(
    'finger_rolling-L3-E2', 'finger_rolling', 3, 2,
    'Rolling Rápido',
    'Rolling a alta velocidad',
    [
      'Rolling rápido manteniendo claridad',
      'Cada nota debe escucharse separada',
    ],
    {
      notes: [
        { position: { string: 1, fret: 8 }, timing: 1, duration: 0.125, finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 1.125, duration: 0.125, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.25, duration: 0.125, finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 1.375, duration: 0.125, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.5, duration: 0.125, finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 1.625, duration: 0.125, finger: 3 },
        { position: { string: 1, fret: 8 }, timing: 1.75, duration: 0.125, finger: 3 },
        { position: { string: 2, fret: 8 }, timing: 1.875, duration: 0.125, finger: 3 },
      ],
      startFret: 6, endFret: 9, loopable: true, beatsPerLoop: 1,
    },
    'e|--8-8-8-8--|\\nB|--8-8-8-8--|',
    { subdivision: 'sixteenth', bpmStart: 60, bpmTarget: 100, tips: ['La velocidad viene con práctica'], commonMistakes: ['Sacrificar claridad'] }
  ),

  // Level 4
  createExercise(
    'finger_rolling-L4-E1', 'finger_rolling', 4, 1,
    'Sweep Picking con Rolling',
    'Combinar sweep y rolling',
    [
      'Arpegio de Am con sweep y rolling',
      'Técnica avanzada de shred',
    ],
    {
      notes: [
        { position: { string: 4, fret: 7 }, timing: 1, duration: 0.2, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 1.2, duration: 0.2, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.4, duration: 0.2, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.6, duration: 0.2, finger: 1, isRoot: true },
        { position: { string: 1, fret: 8 }, timing: 1.8, duration: 0.2, technique: 'h', finger: 4 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.2, technique: 'p', finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 2.2, duration: 0.2, finger: 1 },
        { position: { string: 3, fret: 5 }, timing: 2.4, duration: 0.2, finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2.6, duration: 0.4, finger: 3 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'D|--7-----------7--|\\nG|----5-------5----|\\nB|------5---5------|\\ne|--------5h8p5----|',
    { tips: ['El rolling permite sweep limpio'], commonMistakes: ['Notas superpuestas'] }
  ),
  createExercise(
    'finger_rolling-L4-E2', 'finger_rolling', 4, 2,
    'Arpegio de 5 Cuerdas',
    'Rolling extendido en arpegio grande',
    [
      'Arpegio de Am extendido',
      'Rolling a través de todas las cuerdas',
    ],
    {
      notes: [
        { position: { string: 5, fret: 7 }, timing: 1, duration: 0.2, finger: 3, isRoot: true },
        { position: { string: 4, fret: 7 }, timing: 1.2, duration: 0.2, finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 1.4, duration: 0.2, finger: 1 },
        { position: { string: 2, fret: 5 }, timing: 1.6, duration: 0.2, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.8, duration: 0.4, finger: 1, isRoot: true },
      ],
      startFret: 4, endFret: 8, loopable: true, beatsPerLoop: 2,
    },
    'A|--7---------|\\nD|----7-------|\\nG|------5-----|\\nB|--------5---|\\ne|----------5-|',
    { tips: ['Un solo movimiento fluido'], commonMistakes: ['Movimientos separados'] }
  ),
];

// =============================================
// ACCENTED PICKING EXERCISES (Complete)
// =============================================

const ACCENTED_PICKING_COMPLETE: TechniqueExercise[] = [
  // Level 1
  createExercise(
    'accented_picking-L1-E1', 'accented_picking', 1, 1,
    'Acentos en Tiempo 1',
    'Acentuar el primer beat de cada compás',
    [
      'El beat 1 es más fuerte',
      'Los demás beats son suaves',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|-->5-5-5-5-->5-5-5-5--|',
    { tips: ['Exagera el acento al principio'], commonMistakes: ['Todo igual'] }
  ),
  createExercise(
    'accented_picking-L1-E2', 'accented_picking', 1, 2,
    'Contraste Fuerte-Suave',
    'Alternar entre notas fuertes y suaves',
    [
      'Fuerte - suave - fuerte - suave',
      'El contraste crea el groove',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.5, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.5, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|-->5--5-->5--5--|',
    { tips: ['Las notas suaves son ghost notes casi'], commonMistakes: ['No hay diferencia dinámica'] }
  ),

  // Level 2
  createExercise(
    'accented_picking-L2-E1', 'accented_picking', 2, 1,
    'Acentos en Backbeat',
    'Acentos en tiempos 2 y 4',
    [
      'El backbeat define el rock y funk',
      'Beats 2 y 4 son los fuertes',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.75, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.25, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, technique: '>', finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5->5-5->5-5->5-5->5--|',
    { tips: ['Piensa en la caja de la batería'], commonMistakes: ['Acentos en beats equivocados'] }
  ),
  createExercise(
    'accented_picking-L2-E2', 'accented_picking', 2, 2,
    'Patrón de Acentos 3+3+2',
    'Patrón de acentos latino',
    [
      'Acento cada 3, 3 y 2 corcheas',
      'Ritmo usado en música latina y africana',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.75, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|-->5-5-5->5-5-5->5-5--|',
    { tips: ['3+3+2 = 8 corcheas'], commonMistakes: ['Perder la cuenta'] }
  ),

  // Level 3
  createExercise(
    'accented_picking-L3-E1', 'accented_picking', 3, 1,
    'Acentos Sincopados',
    'Acentos fuera del beat principal',
    [
      'Los acentos caen entre los beats',
      'Crea tensión rítmica',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.25, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.25, duration: 0.25, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.75, duration: 0.25, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5->5-5-5->5-5->5-5--|',
    { tips: ['Los acentos "empujan" el ritmo'], commonMistakes: ['Volver a acentos normales'] }
  ),
  createExercise(
    'accented_picking-L3-E2', 'accented_picking', 3, 2,
    'Acentos Dinámicos',
    'Varios niveles de acentuación',
    [
      'Fuerte - medio - suave - muy suave',
      'Control dinámico completo',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, technique: '>', finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 1.5, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 5 }, timing: 2.5, duration: 0.5, finger: 1 },
      ],
      startFret: 4, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'e|--5(fff)-5(mf)-5(p)-5(pp)--|',
    { tips: ['Piensa en crescendo y decrescendo'], commonMistakes: ['Solo dos niveles'] }
  ),

  // Level 4
  createExercise(
    'accented_picking-L4-E1', 'accented_picking', 4, 1,
    'Riff con Acentos',
    'Aplicar acentos a un riff real',
    [
      'Los acentos definen el carácter del riff',
      'Sin acentos, el riff está muerto',
    ],
    {
      notes: [
        { position: { string: 6, fret: 0 }, timing: 1, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 6, fret: 0 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 6, fret: 3 }, timing: 1.5, duration: 0.25, technique: '>', finger: 3 },
        { position: { string: 6, fret: 0 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 6, fret: 5 }, timing: 2, duration: 0.25, technique: '>', finger: 1 },
        { position: { string: 6, fret: 3 }, timing: 2.25, duration: 0.25, finger: 3 },
        { position: { string: 6, fret: 0 }, timing: 2.5, duration: 0.5, technique: '>', finger: 1 },
      ],
      startFret: 0, endFret: 6, loopable: true, beatsPerLoop: 2,
    },
    'E|-->0-0->3-0->5-3->0--|',
    { tips: ['Los acentos cuentan la historia del riff'], commonMistakes: ['Riff plano'] }
  ),
  createExercise(
    'accented_picking-L4-E2', 'accented_picking', 4, 2,
    'Solo con Acentos Expresivos',
    'Frase solista con acentos musicales',
    [
      'Los acentos añaden emoción a las frases',
      'Cada acento tiene un propósito',
    ],
    {
      notes: [
        { position: { string: 2, fret: 8 }, timing: 1, duration: 0.25, technique: '>', finger: 4 },
        { position: { string: 2, fret: 5 }, timing: 1.25, duration: 0.25, finger: 1 },
        { position: { string: 3, fret: 7 }, timing: 1.5, duration: 0.25, technique: '>', finger: 3 },
        { position: { string: 3, fret: 5 }, timing: 1.75, duration: 0.25, finger: 1 },
        { position: { string: 4, fret: 7 }, timing: 2, duration: 0.5, technique: '>', finger: 3, isRoot: true },
        { position: { string: 4, fret: 5 }, timing: 2.5, duration: 0.5, finger: 1 },
      ],
      startFret: 4, endFret: 9, loopable: true, beatsPerLoop: 2,
    },
    'B|-->8-5------|\\nG|------>7-5--|\\nD|---------->7-5|',
    { tips: ['Los acentos guían la melodía'], commonMistakes: ['Acentos aleatorios'] }
  ),
];

// =============================================
// ALL COMPLETE EXERCISES
// =============================================

export const ALL_COMPLETE_EXERCISES: TechniqueExercise[] = [
  ...HAMMER_ON_COMPLETE,
  ...PULL_OFF_COMPLETE,
  ...SLIDE_COMPLETE,
  ...BEND_HALF_COMPLETE,
  ...BEND_FULL_COMPLETE,
  ...VIBRATO_COMPLETE,
  ...ALTERNATE_PICKING_COMPLETE,
  ...PALM_MUTE_COMPLETE,
  ...POSITION_SHIFT_COMPLETE,
  ...LEGATO_COMPLETE,
  ...FINGER_ROLLING_COMPLETE,
  ...ACCENTED_PICKING_COMPLETE,
];

// =============================================
// EXERCISE GENERATOR (FAILSAFE)
// =============================================

/**
 * Auto-generates a valid exercise if none exists
 * This ensures NO EMPTY STATES ever appear
 */
export const generateFallbackExercise = (
  techniqueId: string,
  levelId: number,
  exerciseIndex: number = 1
): TechniqueExercise => {
  const levelNames: Record<number, string> = {
    1: 'Control Básico',
    2: 'Precisión', 
    3: 'Expresión',
    4: 'Contexto Musical',
  };
  
  const techniqueName = techniqueId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return createExercise(
    `${techniqueId}-L${levelId}-E${exerciseIndex}-auto`,
    techniqueId,
    levelId,
    exerciseIndex,
    `${techniqueName} - ${levelNames[levelId]}`,
    `Ejercicio de práctica para ${techniqueName}`,
    [
      'Practica este patrón lentamente',
      'Aumenta la velocidad gradualmente',
      'Mantén el control en todo momento',
    ],
    {
      notes: [
        { position: { string: 1, fret: 5 }, timing: 1, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 1.5, duration: 0.5, finger: 3 },
        { position: { string: 1, fret: 5 }, timing: 2, duration: 0.5, finger: 1 },
        { position: { string: 1, fret: 7 }, timing: 2.5, duration: 0.5, finger: 3 },
      ],
      startFret: 4,
      endFret: 8,
      loopable: true,
      beatsPerLoop: 2,
    },
    'e|--5--7--5--7--|',
    {
      tips: ['La práctica constante es la clave', 'Escucha tu sonido atentamente'],
      commonMistakes: ['Ir demasiado rápido', 'Tensión innecesaria'],
    }
  );
};

/**
 * Get exercises for a technique and level, with fallback generation
 */
export const getCompleteExercisesForLevel = (
  techniqueId: string,
  levelId: number
): TechniqueExercise[] => {
  const exercises = ALL_COMPLETE_EXERCISES.filter(
    e => e.techniqueId === techniqueId && e.levelId === levelId
  );
  
  // If no exercises found, generate fallback exercises
  if (exercises.length === 0) {
    console.warn(`[TechniqueData] No exercises for ${techniqueId} L${levelId}, generating fallbacks`);
    return [
      generateFallbackExercise(techniqueId, levelId, 1),
      generateFallbackExercise(techniqueId, levelId, 2),
    ];
  }
  
  return exercises;
};

/**
 * Get all exercises for a technique (all levels)
 */
export const getCompleteExercisesForTechnique = (techniqueId: string): TechniqueExercise[] => {
  const exercises = ALL_COMPLETE_EXERCISES.filter(e => e.techniqueId === techniqueId);
  
  // Ensure all 4 levels have exercises
  const levelIds = [1, 2, 3, 4];
  const result: TechniqueExercise[] = [];
  
  levelIds.forEach(levelId => {
    const levelExercises = exercises.filter(e => e.levelId === levelId);
    if (levelExercises.length > 0) {
      result.push(...levelExercises);
    } else {
      // Generate fallbacks for missing levels
      result.push(
        generateFallbackExercise(techniqueId, levelId, 1),
        generateFallbackExercise(techniqueId, levelId, 2)
      );
    }
  });
  
  return result;
};

export {
  HAMMER_ON_COMPLETE,
  PULL_OFF_COMPLETE,
  SLIDE_COMPLETE,
  BEND_HALF_COMPLETE,
  BEND_FULL_COMPLETE,
  VIBRATO_COMPLETE,
  ALTERNATE_PICKING_COMPLETE,
  PALM_MUTE_COMPLETE,
  POSITION_SHIFT_COMPLETE,
  LEGATO_COMPLETE,
  FINGER_ROLLING_COMPLETE,
  ACCENTED_PICKING_COMPLETE,
};