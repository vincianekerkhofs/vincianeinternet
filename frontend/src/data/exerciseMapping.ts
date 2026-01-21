/**
 * GUITAR GUIDE PRO - MAPEO PROGRAMA ↔ EJERCICIOS
 * Conecta las semanas del curriculum con ejercicios relevantes de la biblioteca
 * 
 * Dominios disponibles en la DB:
 * - "Techniques"
 * - "Chords & Harmony"
 * - "Timing & Rhythm"
 * - "Picking"
 * - "Strumming & Rhythm Guitar"
 * - "Scales & Fretboard"
 * - "Lead / Punteos"
 * - "Musical Application"
 * - "Fretting Hand"
 * - "Improvisation"
 */

// Mapeo de semanas a dominios y tags de ejercicios
export interface ExerciseMapping {
  warmUpDomains: string[];      // Dominios para calentamiento
  warmUpTags: string[];         // Tags específicos de calentamiento
  reinforceDomains: string[];   // Dominios para refuerzo
  reinforceTags: string[];      // Tags específicos de refuerzo
  difficulty: string[];         // Niveles de dificultad apropiados
}

// Mapeo por semana - usando dominios REALES de la base de datos
export const WEEK_EXERCISE_MAPPING: Record<number, ExerciseMapping> = {
  // Semana 1: Acordes abiertos básicos
  1: {
    warmUpDomains: ['Fretting Hand', 'Chords & Harmony'],
    warmUpTags: ['finger-strength', 'chord-change'],
    reinforceDomains: ['Chords & Harmony', 'Strumming & Rhythm Guitar'],
    reinforceTags: ['open-chords', 'beginner'],
    difficulty: ['Fundamentals', 'Beginner']
  },
  
  // Semana 2: Más acordes + ritmo
  2: {
    warmUpDomains: ['Fretting Hand', 'Chords & Harmony'],
    warmUpTags: ['chord-change', 'warm-up'],
    reinforceDomains: ['Strumming & Rhythm Guitar', 'Chords & Harmony'],
    reinforceTags: ['rhythm', 'strumming'],
    difficulty: ['Fundamentals', 'Beginner']
  },
  
  // Semana 3: Canciones simples
  3: {
    warmUpDomains: ['Timing & Rhythm'],
    warmUpTags: ['metronome', 'timing'],
    reinforceDomains: ['Musical Application', 'Strumming & Rhythm Guitar'],
    reinforceTags: ['song', 'progression'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 4: Power chords
  4: {
    warmUpDomains: ['Chords & Harmony', 'Picking'],
    warmUpTags: ['power-chord', 'palm-mute'],
    reinforceDomains: ['Musical Application', 'Techniques'],
    reinforceTags: ['rock', 'power-chord'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 5: Blues acordes 7
  5: {
    warmUpDomains: ['Chords & Harmony'],
    warmUpTags: ['seventh-chord', 'blues'],
    reinforceDomains: ['Musical Application', 'Improvisation'],
    reinforceTags: ['blues', '12-bar'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 6: Pentatónica menor
  6: {
    warmUpDomains: ['Scales & Fretboard', 'Picking'],
    warmUpTags: ['scale', 'alternate-picking'],
    reinforceDomains: ['Improvisation', 'Lead / Punteos', 'Scales & Fretboard'],
    reinforceTags: ['pentatonic', 'box-1', 'minor'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 7: Cejillas
  7: {
    warmUpDomains: ['Fretting Hand', 'Chords & Harmony', 'Techniques'],
    warmUpTags: ['barre', 'finger-strength'],
    reinforceDomains: ['Chords & Harmony', 'Musical Application'],
    reinforceTags: ['barre-chord', 'F-shape', 'A-shape'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 8: Octavas + Funk
  8: {
    warmUpDomains: ['Picking', 'Strumming & Rhythm Guitar'],
    warmUpTags: ['muting', '16th-notes'],
    reinforceDomains: ['Musical Application', 'Techniques'],
    reinforceTags: ['funk', 'octave', 'groove'],
    difficulty: ['Intermediate']
  },
  
  // Semana 9: Reggae
  9: {
    warmUpDomains: ['Strumming & Rhythm Guitar', 'Timing & Rhythm'],
    warmUpTags: ['offbeat', 'staccato'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['reggae', 'skank'],
    difficulty: ['Intermediate']
  },
  
  // Semana 10: Bossa Nova
  10: {
    warmUpDomains: ['Chords & Harmony', 'Picking'],
    warmUpTags: ['jazz-chord', 'fingerpicking'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['bossa', 'latin', 'jazz'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 11: Metal Palm Mute
  11: {
    warmUpDomains: ['Picking', 'Techniques'],
    warmUpTags: ['palm-mute', 'alternate-picking'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['metal', 'gallop', 'speed'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 12: Arpegios
  12: {
    warmUpDomains: ['Picking', 'Techniques'],
    warmUpTags: ['fingerpicking', 'pima'],
    reinforceDomains: ['Musical Application', 'Chords & Harmony'],
    reinforceTags: ['arpeggio', 'ballad'],
    difficulty: ['Intermediate']
  },
  
  // Semana 13: Escala Mayor
  13: {
    warmUpDomains: ['Scales & Fretboard'],
    warmUpTags: ['major-scale', 'intervals'],
    reinforceDomains: ['Improvisation', 'Lead / Punteos'],
    reinforceTags: ['melody', 'major'],
    difficulty: ['Intermediate']
  },
  
  // Semana 14: Modo Dórico
  14: {
    warmUpDomains: ['Scales & Fretboard'],
    warmUpTags: ['mode', 'dorian'],
    reinforceDomains: ['Improvisation', 'Musical Application'],
    reinforceTags: ['dorian', 'funk', 'modal'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 15: Legato
  15: {
    warmUpDomains: ['Techniques', 'Lead / Punteos'],
    warmUpTags: ['hammer-on', 'pull-off', 'legato'],
    reinforceDomains: ['Improvisation', 'Lead / Punteos'],
    reinforceTags: ['legato', 'speed'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 16: Bends y Vibrato
  16: {
    warmUpDomains: ['Lead / Punteos', 'Techniques'],
    warmUpTags: ['bend', 'vibrato', 'expression'],
    reinforceDomains: ['Improvisation', 'Musical Application'],
    reinforceTags: ['blues', 'expression', 'phrasing'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 17: Shell Chords
  17: {
    warmUpDomains: ['Chords & Harmony'],
    warmUpTags: ['jazz', 'shell-chord', 'voicing'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['jazz', 'ii-V-I'],
    difficulty: ['Advanced']
  },
  
  // Semana 18: Riffs Rock
  18: {
    warmUpDomains: ['Picking', 'Techniques'],
    warmUpTags: ['palm-mute', 'accent'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['rock', 'riff'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 19: Reggae Avanzado
  19: {
    warmUpDomains: ['Strumming & Rhythm Guitar'],
    warmUpTags: ['offbeat', 'muting'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['reggae', 'dub'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 20: Metal Velocidad
  20: {
    warmUpDomains: ['Picking', 'Techniques'],
    warmUpTags: ['alternate-picking', 'tremolo', 'speed'],
    reinforceDomains: ['Musical Application', 'Lead / Punteos'],
    reinforceTags: ['metal', 'shred', 'speed'],
    difficulty: ['Advanced', 'Pro']
  },
  
  // Semana 21: Conexión del mástil
  21: {
    warmUpDomains: ['Scales & Fretboard', 'Lead / Punteos'],
    warmUpTags: ['position-shift', 'fretboard'],
    reinforceDomains: ['Improvisation'],
    reinforceTags: ['full-neck', 'connection'],
    difficulty: ['Advanced']
  },
  
  // Semana 22: Construcción de solos
  22: {
    warmUpDomains: ['Improvisation', 'Lead / Punteos'],
    warmUpTags: ['phrasing', 'target-note'],
    reinforceDomains: ['Improvisation', 'Musical Application'],
    reinforceTags: ['solo', 'structure'],
    difficulty: ['Advanced']
  },
  
  // Semana 23: Composición
  23: {
    warmUpDomains: ['Scales & Fretboard', 'Chords & Harmony'],
    warmUpTags: ['composition', 'creativity'],
    reinforceDomains: ['Musical Application'],
    reinforceTags: ['composition', 'songwriting'],
    difficulty: ['Advanced', 'Pro']
  },
  
  // Semana 24: Integración total
  24: {
    warmUpDomains: ['Picking', 'Scales & Fretboard', 'Techniques'],
    warmUpTags: ['warm-up', 'all-styles'],
    reinforceDomains: ['Musical Application', 'Improvisation'],
    reinforceTags: ['jam', 'integration'],
    difficulty: ['Advanced', 'Pro']
  }
};

/**
 * Obtiene el mapeo de ejercicios para una semana específica
 */
export const getExerciseMappingForWeek = (weekNum: number): ExerciseMapping => {
  return WEEK_EXERCISE_MAPPING[weekNum] || WEEK_EXERCISE_MAPPING[1];
};

/**
 * Filtra ejercicios basándose en el mapeo de la semana
 */
export const filterExercisesForWeek = (
  exercises: any[],
  weekNum: number,
  type: 'warmUp' | 'reinforce'
): any[] => {
  const mapping = getExerciseMappingForWeek(weekNum);
  
  const domains = type === 'warmUp' ? mapping.warmUpDomains : mapping.reinforceDomains;
  const difficulties = mapping.difficulty;
  
  return exercises.filter(exercise => {
    const domainMatch = domains.some(d => 
      exercise.domain?.toLowerCase().includes(d.toLowerCase())
    );
    const difficultyMatch = difficulties.some(d =>
      exercise.difficulty_tier?.toLowerCase() === d.toLowerCase()
    );
    return domainMatch && difficultyMatch;
  });
};

/**
 * Obtiene ejercicios sugeridos para una semana (máximo 3 de calentamiento, 3 de refuerzo)
 */
export const getSuggestedExercises = (
  exercises: any[],
  weekNum: number
): { warmUp: any[]; reinforce: any[] } => {
  const warmUpExercises = filterExercisesForWeek(exercises, weekNum, 'warmUp').slice(0, 3);
  const reinforceExercises = filterExercisesForWeek(exercises, weekNum, 'reinforce').slice(0, 3);
  
  return {
    warmUp: warmUpExercises,
    reinforce: reinforceExercises
  };
};

/**
 * Obtiene el texto descriptivo de por qué se sugiere un ejercicio
 */
export const getExerciseRelevanceText = (weekNum: number, exerciseType: 'warmUp' | 'reinforce'): string => {
  const mapping = getExerciseMappingForWeek(weekNum);
  
  if (exerciseType === 'warmUp') {
    return `Prepara tu ${mapping.warmUpDomains[0]?.split(' ')[0] || 'técnica'} para la lección`;
  } else {
    return `Refuerza lo aprendido en ${mapping.reinforceDomains[0]?.split(' ')[0] || 'esta semana'}`;
  }
};
