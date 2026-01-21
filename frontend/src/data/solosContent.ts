// Solos & Composition Data for GUITAR GUIDE
// Pedagogical solos, scale transitions, and full-neck compositions

export interface SoloNote {
  string: number;   // 1-6 (1 = high E, 6 = low E)
  fret: number;
  finger: number;   // 1-4
  duration: string; // 'q' = quarter, 'e' = eighth, 'h' = half, 'w' = whole
  technique?: 'bend' | 'vibrato' | 'slide' | 'hammer' | 'pull';
  isRoot?: boolean;
}

export interface GuidedSolo {
  id: string;
  title: string;
  style: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bars: number;
  tempo: number;
  scale: string;
  positions: number[];  // Which box positions are used
  objective: string;
  didacticIntro: string[];
  notes: SoloNote[][];  // Array of measures, each measure is array of notes
  transitionPoints?: {
    bar: number;
    fromScale: string;
    toScale: string;
    explanation: string;
  }[];
}

export interface FullNeckComposition {
  id: string;
  title: string;
  style: string;
  difficulty: 'intermediate' | 'advanced';
  bars: number;
  tempo: number;
  objective: string;
  didacticIntro: string[];
  sections: {
    name: string;
    startBar: number;
    endBar: number;
    position: string;  // "Low (frets 1-5)", "Mid (frets 5-9)", etc.
    scale: string;
    notes: SoloNote[][];
  }[];
}

// ===========================================
// GUIDED SOLOS - Educational, all notes shown
// ===========================================

export const GUIDED_SOLOS: GuidedSolo[] = [
  // PENTATONIC BOX 1 SOLO
  {
    id: 'pent_box1_intro',
    title: 'Primer Solo Pentatónico',
    style: 'Blues/Rock',
    difficulty: 'beginner',
    bars: 8,
    tempo: 70,
    scale: 'Am Pentatonic',
    positions: [1],
    objective: 'Dominar la caja 1 de la pentatónica',
    didacticIntro: [
      'Este es tu primer solo completo.',
      'Usaremos solo la caja 1 (trastes 5-8).',
      'Cada nota debe sonar clara.',
      'No te apresures, siente la música.',
      'Los bends dan expresión al blues.',
    ],
    notes: [
      // Bar 1
      [
        { string: 1, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 1, fret: 8, finger: 4, duration: 'q' },
        { string: 2, fret: 5, finger: 1, duration: 'q' },
        { string: 2, fret: 8, finger: 4, duration: 'q' },
      ],
      // Bar 2
      [
        { string: 3, fret: 5, finger: 1, duration: 'q' },
        { string: 3, fret: 7, finger: 3, duration: 'q' },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 7, finger: 3, duration: 'q' },
      ],
      // Bar 3
      [
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
        { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 6, fret: 8, finger: 4, duration: 'q' },
      ],
      // Bar 4 - ascending
      [
        { string: 6, fret: 5, finger: 1, duration: 'e', isRoot: true },
        { string: 6, fret: 8, finger: 4, duration: 'e' },
        { string: 5, fret: 5, finger: 1, duration: 'e', isRoot: true },
        { string: 5, fret: 7, finger: 3, duration: 'e' },
        { string: 4, fret: 5, finger: 1, duration: 'e' },
        { string: 4, fret: 7, finger: 3, duration: 'e' },
        { string: 3, fret: 5, finger: 1, duration: 'e' },
        { string: 3, fret: 7, finger: 3, duration: 'e' },
      ],
      // Bar 5 - continue ascending
      [
        { string: 2, fret: 5, finger: 1, duration: 'e' },
        { string: 2, fret: 8, finger: 4, duration: 'e' },
        { string: 1, fret: 5, finger: 1, duration: 'e', isRoot: true },
        { string: 1, fret: 8, finger: 4, duration: 'e' },
        { string: 1, fret: 8, finger: 4, duration: 'q', technique: 'bend' },
        { string: 1, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
      // Bar 6 - descending
      [
        { string: 2, fret: 8, finger: 4, duration: 'q' },
        { string: 2, fret: 5, finger: 1, duration: 'q' },
        { string: 3, fret: 7, finger: 3, duration: 'q' },
        { string: 3, fret: 5, finger: 1, duration: 'q' },
      ],
      // Bar 7
      [
        { string: 4, fret: 7, finger: 3, duration: 'q' },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
      // Bar 8 - ending
      [
        { string: 6, fret: 8, finger: 4, duration: 'q' },
        { string: 6, fret: 5, finger: 1, duration: 'h', isRoot: true, technique: 'vibrato' },
        { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
    ],
  },

  // CONNECTING BOXES 1-2
  {
    id: 'pent_box1_to_box2',
    title: 'Conectando Cajas 1 y 2',
    style: 'Blues/Rock',
    difficulty: 'intermediate',
    bars: 12,
    tempo: 75,
    scale: 'Am Pentatonic',
    positions: [1, 2],
    objective: 'Movimiento horizontal entre posiciones',
    didacticIntro: [
      'Ahora conectamos dos posiciones.',
      'La caja 2 está en trastes 7-10.',
      'Busca las notas que conectan.',
      'El deslizamiento facilita el cambio.',
      'Practica la transición lentamente.',
    ],
    notes: [
      // Bar 1-4: Box 1
      [
        { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 6, fret: 8, finger: 4, duration: 'q' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
      ],
      [
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 7, finger: 3, duration: 'q' },
        { string: 3, fret: 5, finger: 1, duration: 'q' },
        { string: 3, fret: 7, finger: 3, duration: 'q' },
      ],
      [
        { string: 2, fret: 5, finger: 1, duration: 'q' },
        { string: 2, fret: 8, finger: 4, duration: 'q' },
        { string: 1, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 1, fret: 8, finger: 4, duration: 'q' },
      ],
      // Bar 4: Transition slide
      [
        { string: 1, fret: 8, finger: 4, duration: 'q', technique: 'slide' },
        { string: 1, fret: 10, finger: 4, duration: 'q' },
        { string: 2, fret: 10, finger: 4, duration: 'h', isRoot: true },
      ],
      // Bar 5-8: Box 2
      [
        { string: 2, fret: 10, finger: 4, duration: 'q', isRoot: true },
        { string: 2, fret: 8, finger: 2, duration: 'q' },
        { string: 3, fret: 9, finger: 3, duration: 'q' },
        { string: 3, fret: 7, finger: 1, duration: 'q' },
      ],
      [
        { string: 4, fret: 9, finger: 3, duration: 'q' },
        { string: 4, fret: 7, finger: 1, duration: 'q' },
        { string: 5, fret: 10, finger: 4, duration: 'q' },
        { string: 5, fret: 7, finger: 1, duration: 'q' },
      ],
      [
        { string: 6, fret: 10, finger: 4, duration: 'q' },
        { string: 6, fret: 8, finger: 2, duration: 'q' },
        { string: 5, fret: 10, finger: 4, duration: 'q' },
        { string: 5, fret: 7, finger: 1, duration: 'q' },
      ],
      // Bar 8: Transition back
      [
        { string: 5, fret: 7, finger: 1, duration: 'q', technique: 'slide' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 6, fret: 8, finger: 4, duration: 'q' },
        { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
      // Bar 9-12: Return to Box 1 for ending
      [
        { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 7, finger: 3, duration: 'q' },
      ],
      [
        { string: 3, fret: 5, finger: 1, duration: 'q' },
        { string: 3, fret: 7, finger: 3, duration: 'q', technique: 'bend' },
        { string: 3, fret: 5, finger: 1, duration: 'h' },
      ],
      [
        { string: 4, fret: 7, finger: 3, duration: 'q' },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
      [
        { string: 6, fret: 5, finger: 1, duration: 'w', isRoot: true, technique: 'vibrato' },
      ],
    ],
  },

  // SCALE TRANSITION: PENTATONIC TO BLUES
  {
    id: 'pent_to_blues',
    title: 'De Pentatónica a Blues',
    style: 'Blues',
    difficulty: 'intermediate',
    bars: 8,
    tempo: 65,
    scale: 'Am Pentatonic → Am Blues',
    positions: [1],
    objective: 'Aprender a añadir la blue note',
    didacticIntro: [
      'La escala blues añade UNA nota.',
      'Es la "blue note" (b5).',
      'En Am está en el traste 6 (cuerda 4).',
      'Da ese sonido triste característico.',
      'Úsala para conectar, no como nota principal.',
    ],
    notes: [
      // Bar 1-2: Pure pentatonic
      [
        { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 6, fret: 8, finger: 4, duration: 'q' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
      ],
      [
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 7, finger: 3, duration: 'h' },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
      ],
      // Bar 3-4: Introduce blue note
      [
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 6, finger: 2, duration: 'q' }, // BLUE NOTE!
        { string: 4, fret: 7, finger: 3, duration: 'h' },
      ],
      [
        { string: 3, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 7, finger: 3, duration: 'q' },
        { string: 4, fret: 6, finger: 2, duration: 'q' }, // BLUE NOTE
        { string: 4, fret: 5, finger: 1, duration: 'q' },
      ],
      // Bar 5-6: Blues scale melody
      [
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
        { string: 5, fret: 6, finger: 2, duration: 'e' }, // Blue note on A string
        { string: 5, fret: 7, finger: 3, duration: 'e' },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 4, fret: 6, finger: 2, duration: 'q' }, // BLUE NOTE
      ],
      [
        { string: 4, fret: 7, finger: 3, duration: 'q', technique: 'bend' },
        { string: 4, fret: 5, finger: 1, duration: 'q' },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
      // Bar 7-8: Ending phrase with blue notes
      [
        { string: 3, fret: 5, finger: 1, duration: 'e' },
        { string: 4, fret: 7, finger: 3, duration: 'e' },
        { string: 4, fret: 6, finger: 2, duration: 'e' }, // BLUE NOTE
        { string: 4, fret: 5, finger: 1, duration: 'e' },
        { string: 5, fret: 7, finger: 3, duration: 'q' },
        { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
      ],
      [
        { string: 6, fret: 5, finger: 1, duration: 'w', isRoot: true, technique: 'vibrato' },
      ],
    ],
    transitionPoints: [
      {
        bar: 3,
        fromScale: 'Am Pentatonic',
        toScale: 'Am Blues',
        explanation: 'Añadimos el traste 6 en cuerda 4 (la blue note)',
      },
    ],
  },
];

// ===========================================
// FULL NECK COMPOSITIONS - Travel the fretboard
// ===========================================

export const FULL_NECK_COMPOSITIONS: FullNeckComposition[] = [
  {
    id: 'journey_across',
    title: 'Viaje Por el Mástil',
    style: 'Blues/Rock',
    difficulty: 'intermediate',
    bars: 24,
    tempo: 70,
    objective: 'Recorrer todo el mástil con la pentatónica de Am',
    didacticIntro: [
      'Este es un viaje musical completo.',
      'Empezamos en trastes bajos (1-5).',
      'Subimos hasta trastes altos (12-15).',
      'Y volvemos al punto de partida.',
      'El mástil es UN solo instrumento.',
      'Conecta las posiciones fluidamente.',
    ],
    sections: [
      {
        name: 'Intro - Posición Baja',
        startBar: 1,
        endBar: 6,
        position: 'Trastes 1-5',
        scale: 'Am Pentatonic (posición abierta)',
        notes: [
          [
            { string: 6, fret: 0, finger: 0, duration: 'q', isRoot: true },
            { string: 6, fret: 3, finger: 3, duration: 'q' },
            { string: 5, fret: 0, finger: 0, duration: 'q', isRoot: true },
            { string: 5, fret: 2, finger: 2, duration: 'q' },
          ],
          [
            { string: 4, fret: 0, finger: 0, duration: 'q' },
            { string: 4, fret: 2, finger: 2, duration: 'q' },
            { string: 3, fret: 0, finger: 0, duration: 'q' },
            { string: 3, fret: 2, finger: 2, duration: 'q' },
          ],
          [
            { string: 2, fret: 0, finger: 0, duration: 'q' },
            { string: 2, fret: 3, finger: 3, duration: 'q' },
            { string: 1, fret: 0, finger: 0, duration: 'q' },
            { string: 1, fret: 3, finger: 3, duration: 'q' },
          ],
          [
            { string: 1, fret: 3, finger: 3, duration: 'q', technique: 'slide' },
            { string: 1, fret: 5, finger: 1, duration: 'q', isRoot: true },
            { string: 2, fret: 5, finger: 1, duration: 'h' },
          ],
          [
            { string: 2, fret: 5, finger: 1, duration: 'q' },
            { string: 3, fret: 5, finger: 1, duration: 'q' },
            { string: 4, fret: 5, finger: 1, duration: 'q' },
            { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
          ],
          [
            { string: 6, fret: 5, finger: 1, duration: 'h', isRoot: true },
            { string: 5, fret: 7, finger: 3, duration: 'q' },
            { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true, technique: 'slide' },
          ],
        ],
      },
      {
        name: 'Desarrollo - Posición Media',
        startBar: 7,
        endBar: 12,
        position: 'Trastes 5-10',
        scale: 'Am Pentatonic (cajas 1-2)',
        notes: [
          [
            { string: 5, fret: 7, finger: 3, duration: 'q', technique: 'slide' },
            { string: 5, fret: 10, finger: 4, duration: 'q' },
            { string: 4, fret: 7, finger: 1, duration: 'q' },
            { string: 4, fret: 9, finger: 3, duration: 'q' },
          ],
          [
            { string: 3, fret: 7, finger: 1, duration: 'q' },
            { string: 3, fret: 9, finger: 3, duration: 'q' },
            { string: 2, fret: 8, finger: 2, duration: 'q' },
            { string: 2, fret: 10, finger: 4, duration: 'q', isRoot: true },
          ],
          [
            { string: 1, fret: 8, finger: 2, duration: 'q' },
            { string: 1, fret: 10, finger: 4, duration: 'q' },
            { string: 1, fret: 10, finger: 4, duration: 'h', technique: 'bend' },
          ],
          [
            { string: 1, fret: 10, finger: 4, duration: 'q' },
            { string: 1, fret: 12, finger: 1, duration: 'q', isRoot: true, technique: 'slide' },
            { string: 2, fret: 12, finger: 1, duration: 'h' },
          ],
          [
            { string: 2, fret: 13, finger: 2, duration: 'q' },
            { string: 2, fret: 12, finger: 1, duration: 'q' },
            { string: 3, fret: 12, finger: 1, duration: 'q' },
            { string: 3, fret: 14, finger: 3, duration: 'q' },
          ],
          [
            { string: 4, fret: 12, finger: 1, duration: 'q' },
            { string: 4, fret: 14, finger: 3, duration: 'q' },
            { string: 5, fret: 12, finger: 1, duration: 'q', isRoot: true },
            { string: 5, fret: 14, finger: 3, duration: 'q' },
          ],
        ],
      },
      {
        name: 'Clímax - Posición Alta',
        startBar: 13,
        endBar: 18,
        position: 'Trastes 12-17',
        scale: 'Am Pentatonic (caja 1 octava alta)',
        notes: [
          [
            { string: 6, fret: 12, finger: 1, duration: 'q', isRoot: true },
            { string: 6, fret: 15, finger: 4, duration: 'q' },
            { string: 5, fret: 12, finger: 1, duration: 'q', isRoot: true },
            { string: 5, fret: 14, finger: 3, duration: 'q' },
          ],
          [
            { string: 4, fret: 12, finger: 1, duration: 'e' },
            { string: 4, fret: 14, finger: 3, duration: 'e' },
            { string: 3, fret: 12, finger: 1, duration: 'e' },
            { string: 3, fret: 14, finger: 3, duration: 'e' },
            { string: 2, fret: 12, finger: 1, duration: 'e' },
            { string: 2, fret: 15, finger: 4, duration: 'e' },
            { string: 1, fret: 12, finger: 1, duration: 'q', isRoot: true },
          ],
          [
            { string: 1, fret: 15, finger: 4, duration: 'q', technique: 'bend' },
            { string: 1, fret: 17, finger: 4, duration: 'q', technique: 'bend' },
            { string: 1, fret: 15, finger: 4, duration: 'q' },
            { string: 1, fret: 12, finger: 1, duration: 'q', isRoot: true },
          ],
          [
            { string: 2, fret: 15, finger: 4, duration: 'q' },
            { string: 2, fret: 12, finger: 1, duration: 'q' },
            { string: 3, fret: 14, finger: 3, duration: 'q' },
            { string: 3, fret: 12, finger: 1, duration: 'q' },
          ],
          [
            { string: 4, fret: 14, finger: 3, duration: 'q' },
            { string: 4, fret: 12, finger: 1, duration: 'q' },
            { string: 5, fret: 14, finger: 3, duration: 'q' },
            { string: 5, fret: 12, finger: 1, duration: 'q', isRoot: true },
          ],
          [
            { string: 5, fret: 12, finger: 1, duration: 'q', isRoot: true, technique: 'slide' },
            { string: 5, fret: 7, finger: 1, duration: 'q' },
            { string: 6, fret: 8, finger: 2, duration: 'q' },
            { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
          ],
        ],
      },
      {
        name: 'Regreso - Vuelta a Casa',
        startBar: 19,
        endBar: 24,
        position: 'Trastes 5-0',
        scale: 'Am Pentatonic (descendiendo)',
        notes: [
          [
            { string: 6, fret: 5, finger: 1, duration: 'q', isRoot: true },
            { string: 5, fret: 5, finger: 1, duration: 'q', isRoot: true },
            { string: 4, fret: 5, finger: 1, duration: 'q' },
            { string: 4, fret: 7, finger: 3, duration: 'q' },
          ],
          [
            { string: 3, fret: 5, finger: 1, duration: 'q' },
            { string: 3, fret: 7, finger: 3, duration: 'q', technique: 'bend' },
            { string: 3, fret: 5, finger: 1, duration: 'q' },
            { string: 4, fret: 5, finger: 1, duration: 'q' },
          ],
          [
            { string: 4, fret: 5, finger: 1, duration: 'q', technique: 'slide' },
            { string: 4, fret: 2, finger: 2, duration: 'q' },
            { string: 5, fret: 2, finger: 2, duration: 'q' },
            { string: 5, fret: 0, finger: 0, duration: 'q', isRoot: true },
          ],
          [
            { string: 6, fret: 3, finger: 3, duration: 'q' },
            { string: 6, fret: 0, finger: 0, duration: 'q' },
            { string: 5, fret: 2, finger: 2, duration: 'q' },
            { string: 5, fret: 0, finger: 0, duration: 'q', isRoot: true },
          ],
          [
            { string: 4, fret: 2, finger: 2, duration: 'q' },
            { string: 4, fret: 0, finger: 0, duration: 'q' },
            { string: 3, fret: 2, finger: 2, duration: 'q' },
            { string: 3, fret: 0, finger: 0, duration: 'q' },
          ],
          [
            { string: 5, fret: 0, finger: 0, duration: 'w', isRoot: true, technique: 'vibrato' },
          ],
        ],
      },
    ],
  },
];

// Helper functions
export const getSoloById = (id: string): GuidedSolo | undefined => {
  return GUIDED_SOLOS.find(solo => solo.id === id);
};

export const getCompositionById = (id: string): FullNeckComposition | undefined => {
  return FULL_NECK_COMPOSITIONS.find(comp => comp.id === id);
};

export const getSolosByDifficulty = (difficulty: string): GuidedSolo[] => {
  return GUIDED_SOLOS.filter(solo => solo.difficulty === difficulty);
};
