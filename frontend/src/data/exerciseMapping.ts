/**
 * GUITAR GUIDE PRO - MAPEO PROGRAMA ↔ EJERCICIOS
 * Conecta las semanas del curriculum con ejercicios relevantes de la biblioteca
 */

// Mapeo de semanas a dominios y tags de ejercicios
export interface ExerciseMapping {
  warmUpDomains: string[];      // Dominios para calentamiento
  warmUpTags: string[];         // Tags específicos de calentamiento
  reinforceDomains: string[];   // Dominios para refuerzo
  reinforceTags: string[];      // Tags específicos de refuerzo
  difficulty: string[];         // Niveles de dificultad apropiados
}

// Mapeo por semana
export const WEEK_EXERCISE_MAPPING: Record<number, ExerciseMapping> = {
  // Semana 1: Acordes abiertos básicos
  1: {
    warmUpDomains: ['Fretting & Chords'],
    warmUpTags: ['finger-strength', 'chord-change'],
    reinforceDomains: ['Fretting & Chords', 'Strumming & Rhythm'],
    reinforceTags: ['open-chords', 'beginner'],
    difficulty: ['Fundamentals', 'Beginner']
  },
  
  // Semana 2: Más acordes + ritmo
  2: {
    warmUpDomains: ['Fretting & Chords'],
    warmUpTags: ['chord-change', 'warm-up'],
    reinforceDomains: ['Strumming & Rhythm', 'Fretting & Chords'],
    reinforceTags: ['rhythm', 'strumming'],
    difficulty: ['Fundamentals', 'Beginner']
  },
  
  // Semana 3: Canciones simples
  3: {
    warmUpDomains: ['Timing & Feel'],
    warmUpTags: ['metronome', 'timing'],
    reinforceDomains: ['Application & Songs', 'Strumming & Rhythm'],
    reinforceTags: ['song', 'progression'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 4: Power chords
  4: {
    warmUpDomains: ['Fretting & Chords', 'Picking Technique'],
    warmUpTags: ['power-chord', 'palm-mute'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['rock', 'power-chord'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 5: Blues acordes 7
  5: {
    warmUpDomains: ['Fretting & Chords'],
    warmUpTags: ['seventh-chord', 'blues'],
    reinforceDomains: ['Application & Songs', 'Improvisation & Lead'],
    reinforceTags: ['blues', '12-bar'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 6: Pentatónica menor
  6: {
    warmUpDomains: ['Scales & Theory', 'Picking Technique'],
    warmUpTags: ['scale', 'alternate-picking'],
    reinforceDomains: ['Improvisation & Lead', 'Scales & Theory'],
    reinforceTags: ['pentatonic', 'box-1', 'minor'],
    difficulty: ['Beginner', 'Intermediate']
  },
  
  // Semana 7: Cejillas
  7: {
    warmUpDomains: ['Fretting & Chords'],
    warmUpTags: ['barre', 'finger-strength'],
    reinforceDomains: ['Fretting & Chords', 'Application & Songs'],
    reinforceTags: ['barre-chord', 'F-shape', 'A-shape'],
    difficulty: ['Intermediate']
  },
  
  // Semana 8: Octavas + Funk
  8: {
    warmUpDomains: ['Picking Technique', 'Strumming & Rhythm'],
    warmUpTags: ['muting', '16th-notes'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['funk', 'octave', 'groove'],
    difficulty: ['Intermediate']
  },
  
  // Semana 9: Reggae
  9: {
    warmUpDomains: ['Strumming & Rhythm', 'Timing & Feel'],
    warmUpTags: ['offbeat', 'staccato'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['reggae', 'skank'],
    difficulty: ['Intermediate']
  },
  
  // Semana 10: Bossa Nova
  10: {
    warmUpDomains: ['Fretting & Chords', 'Picking Technique'],
    warmUpTags: ['jazz-chord', 'fingerpicking'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['bossa', 'latin', 'jazz'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 11: Metal Palm Mute
  11: {
    warmUpDomains: ['Picking Technique'],
    warmUpTags: ['palm-mute', 'alternate-picking'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['metal', 'gallop', 'speed'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 12: Arpegios
  12: {
    warmUpDomains: ['Picking Technique'],
    warmUpTags: ['fingerpicking', 'pima'],
    reinforceDomains: ['Application & Songs', 'Fretting & Chords'],
    reinforceTags: ['arpeggio', 'ballad'],
    difficulty: ['Intermediate']
  },
  
  // Semana 13: Escala Mayor
  13: {
    warmUpDomains: ['Scales & Theory'],
    warmUpTags: ['major-scale', 'intervals'],
    reinforceDomains: ['Improvisation & Lead'],
    reinforceTags: ['melody', 'major'],
    difficulty: ['Intermediate']
  },
  
  // Semana 14: Modo Dórico
  14: {
    warmUpDomains: ['Scales & Theory'],
    warmUpTags: ['mode', 'dorian'],
    reinforceDomains: ['Improvisation & Lead', 'Application & Songs'],
    reinforceTags: ['dorian', 'funk', 'modal'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 15: Legato
  15: {
    warmUpDomains: ['Picking Technique', 'Improvisation & Lead'],
    warmUpTags: ['hammer-on', 'pull-off', 'legato'],
    reinforceDomains: ['Improvisation & Lead'],
    reinforceTags: ['legato', 'speed'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 16: Bends y Vibrato
  16: {
    warmUpDomains: ['Improvisation & Lead'],
    warmUpTags: ['bend', 'vibrato', 'expression'],
    reinforceDomains: ['Improvisation & Lead', 'Application & Songs'],
    reinforceTags: ['blues', 'expression', 'phrasing'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 17: Shell Chords
  17: {
    warmUpDomains: ['Fretting & Chords'],
    warmUpTags: ['jazz', 'shell-chord', 'voicing'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['jazz', 'ii-V-I'],
    difficulty: ['Advanced']
  },
  
  // Semana 18: Riffs Rock
  18: {
    warmUpDomains: ['Picking Technique'],
    warmUpTags: ['palm-mute', 'accent'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['rock', 'riff'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 19: Reggae Avanzado
  19: {
    warmUpDomains: ['Strumming & Rhythm'],
    warmUpTags: ['offbeat', 'muting'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['reggae', 'dub'],
    difficulty: ['Intermediate', 'Advanced']
  },
  
  // Semana 20: Metal Velocidad
  20: {
    warmUpDomains: ['Picking Technique'],
    warmUpTags: ['alternate-picking', 'tremolo', 'speed'],
    reinforceDomains: ['Application & Songs', 'Improvisation & Lead'],
    reinforceTags: ['metal', 'shred', 'speed'],
    difficulty: ['Advanced', 'Pro']
  },
  
  // Semana 21: Conexión del mástil
  21: {
    warmUpDomains: ['Scales & Theory', 'Improvisation & Lead'],
    warmUpTags: ['position-shift', 'fretboard'],
    reinforceDomains: ['Improvisation & Lead'],
    reinforceTags: ['full-neck', 'connection'],
    difficulty: ['Advanced']
  },
  
  // Semana 22: Construcción de solos
  22: {
    warmUpDomains: ['Improvisation & Lead'],
    warmUpTags: ['phrasing', 'target-note'],
    reinforceDomains: ['Improvisation & Lead', 'Application & Songs'],
    reinforceTags: ['solo', 'structure'],
    difficulty: ['Advanced']
  },
  
  // Semana 23: Composición
  23: {
    warmUpDomains: ['Scales & Theory', 'Fretting & Chords'],
    warmUpTags: ['composition', 'creativity'],
    reinforceDomains: ['Application & Songs'],
    reinforceTags: ['composition', 'songwriting'],
    difficulty: ['Advanced', 'Pro']
  },
  
  // Semana 24: Integración total
  24: {
    warmUpDomains: ['Picking Technique', 'Scales & Theory'],
    warmUpTags: ['warm-up', 'all-styles'],
    reinforceDomains: ['Application & Songs', 'Improvisation & Lead'],
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
