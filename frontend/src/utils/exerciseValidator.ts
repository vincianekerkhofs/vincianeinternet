/**
 * GUITAR GUIDE PRO - EXERCISE VALIDATOR
 * Ensures only complete, playable exercises are shown to users
 * Blocks incomplete/placeholder content from appearing in lists
 */

// =============================================
// TYPES
// =============================================

export interface ExerciseValidationResult {
  isPlayable: boolean;
  missingFields: string[];
  warnings: string[];
}

export interface ValidatableExercise {
  id?: string;
  title?: string;
  domain?: string;
  difficulty_tier?: string;
  bpm_start?: number;
  bpm_target?: number;
  steps?: string[];
  instructions?: string[];
  description_training?: string;
  description?: string;
  tab_data?: any;
  chord_progression?: string[];
  scale_shape?: string;
  technique_focus?: string;
}

// =============================================
// MAIN VALIDATOR
// =============================================

/**
 * Validates if an exercise has all required data to be playable
 * Returns true ONLY if the exercise is complete and ready for practice
 */
export const isExercisePlayable = (exercise: ValidatableExercise | null | undefined): boolean => {
  if (!exercise) return false;
  
  const result = validateExercise(exercise);
  
  // Log warnings in development
  if (__DEV__ && !result.isPlayable) {
    console.warn(`[ExerciseValidator] Exercise "${exercise.id || 'unknown'}" is not playable:`, result.missingFields);
  }
  
  return result.isPlayable;
};

/**
 * Full validation with detailed results
 */
export const validateExercise = (exercise: ValidatableExercise | null | undefined): ExerciseValidationResult => {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  
  if (!exercise) {
    return { isPlayable: false, missingFields: ['exercise object is null'], warnings: [] };
  }
  
  // Required: unique ID
  if (!exercise.id || exercise.id.trim() === '') {
    missingFields.push('id');
  }
  
  // Required: title
  if (!exercise.title || exercise.title.trim() === '') {
    missingFields.push('title');
  }
  
  // Required: category/domain
  if (!exercise.domain || exercise.domain.trim() === '') {
    missingFields.push('domain');
  }
  
  // Required: difficulty level
  if (!exercise.difficulty_tier || exercise.difficulty_tier.trim() === '') {
    missingFields.push('difficulty_tier');
  }
  
  // Required: BPM for metronome
  if (!exercise.bpm_start || exercise.bpm_start <= 0) {
    missingFields.push('bpm_start');
  }
  
  // Required: pedagogical content (at least one of these)
  const hasSteps = exercise.steps && exercise.steps.length > 0;
  const hasInstructions = exercise.instructions && exercise.instructions.length > 0;
  const hasDescription = exercise.description_training || exercise.description;
  
  if (!hasSteps && !hasInstructions && !hasDescription) {
    missingFields.push('pedagogical content (steps, instructions, or description)');
  }
  
  // Required: practice content (at least one of these)
  const hasTabData = exercise.tab_data && (
    (exercise.tab_data.notes && exercise.tab_data.notes.length > 0) ||
    (exercise.tab_data.bars && exercise.tab_data.bars.length > 0) ||
    (exercise.tab_data.pattern)
  );
  const hasChordProgression = exercise.chord_progression && exercise.chord_progression.length > 0;
  const hasScaleShape = exercise.scale_shape && exercise.scale_shape.trim() !== '';
  const hasTechniqueFocus = exercise.technique_focus && exercise.technique_focus.trim() !== '';
  
  // For rhythm exercises, tab_data or steps is enough
  const isRhythmExercise = exercise.domain?.toLowerCase().includes('rhythm') || 
                           exercise.domain?.toLowerCase().includes('timing') ||
                           exercise.domain?.toLowerCase().includes('strum');
  
  if (!hasTabData && !hasChordProgression && !hasScaleShape && !hasTechniqueFocus) {
    if (!isRhythmExercise) {
      // Only warn, don't block - rhythm exercises don't always need tab data
      warnings.push('No visual practice content (tab_data, chord_progression, or scale_shape)');
    }
  }
  
  // Warn about placeholder-like titles
  const placeholderPatterns = [
    /ejercicio libre/i,
    /free practice/i,
    /placeholder/i,
    /coming soon/i,
    /todo/i,
    /test exercise/i,
    /^exercise \d+$/i,
  ];
  
  if (exercise.title && placeholderPatterns.some(p => p.test(exercise.title!))) {
    missingFields.push('title appears to be a placeholder');
  }
  
  return {
    isPlayable: missingFields.length === 0,
    missingFields,
    warnings,
  };
};

/**
 * Filter a list of exercises to only include playable ones
 */
export const filterPlayableExercises = <T extends ValidatableExercise>(exercises: T[]): T[] => {
  const playable = exercises.filter(isExercisePlayable);
  
  if (__DEV__ && playable.length < exercises.length) {
    const excluded = exercises.length - playable.length;
    console.warn(`[ExerciseValidator] Filtered out ${excluded} incomplete exercises from list`);
  }
  
  return playable;
};

/**
 * Audit all exercises and return a report (dev only)
 */
export const auditExercises = (exercises: ValidatableExercise[]): {
  total: number;
  playable: number;
  excluded: { exercise: ValidatableExercise; result: ExerciseValidationResult }[];
} => {
  const excluded: { exercise: ValidatableExercise; result: ExerciseValidationResult }[] = [];
  let playableCount = 0;
  
  exercises.forEach(exercise => {
    const result = validateExercise(exercise);
    if (result.isPlayable) {
      playableCount++;
    } else {
      excluded.push({ exercise, result });
    }
  });
  
  return {
    total: exercises.length,
    playable: playableCount,
    excluded,
  };
};

// =============================================
// TECHNIQUE EXERCISE VALIDATOR
// =============================================

export interface ValidatableTechniqueExercise {
  id?: string;
  name?: string;
  techniqueId?: string;
  levelId?: number;
  bpmStart?: number;
  durationSeconds?: number;
  fretboardPath?: {
    notes?: any[];
  };
  tabNotation?: string;
  instructions?: string[];
}

export const isTechniqueExercisePlayable = (exercise: ValidatableTechniqueExercise | null | undefined): boolean => {
  if (!exercise) return false;
  
  // Required fields
  if (!exercise.id) return false;
  if (!exercise.name) return false;
  if (!exercise.techniqueId) return false;
  if (!exercise.levelId || exercise.levelId < 1) return false;
  if (!exercise.bpmStart || exercise.bpmStart <= 0) return false;
  
  // Must have fretboard data OR tab notation
  const hasFretboardPath = exercise.fretboardPath?.notes && exercise.fretboardPath.notes.length > 0;
  const hasTabNotation = exercise.tabNotation && exercise.tabNotation.trim() !== '';
  
  if (!hasFretboardPath && !hasTabNotation) return false;
  
  return true;
};

export const filterPlayableTechniqueExercises = <T extends ValidatableTechniqueExercise>(exercises: T[]): T[] => {
  return exercises.filter(isTechniqueExercisePlayable);
};

export default {
  isExercisePlayable,
  validateExercise,
  filterPlayableExercises,
  auditExercises,
  isTechniqueExercisePlayable,
  filterPlayableTechniqueExercises,
};
