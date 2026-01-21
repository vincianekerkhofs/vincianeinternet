/**
 * GUITAR GUIDE PRO - TECHNIQUE MASTERY STORAGE
 * Tracks which techniques the user has practiced and mastered
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'guitar_guide_technique_mastery';

export interface TechniqueMastery {
  techniqueId: string;
  level: number;          // 1-4
  lastPracticed: string;  // ISO date
  totalPracticeMinutes: number;
  exercisesCompleted: string[];
}

// Get all technique mastery data
export const getTechniqueMastery = async (): Promise<Record<string, TechniqueMastery>> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting technique mastery:', error);
    return {};
  }
};

// Get mastery for a specific technique
export const getTechniqueMasteryById = async (techniqueId: string): Promise<TechniqueMastery | null> => {
  const all = await getTechniqueMastery();
  return all[techniqueId] || null;
};

// Update technique mastery
export const updateTechniqueMastery = async (
  techniqueId: string,
  update: Partial<TechniqueMastery>
): Promise<void> => {
  try {
    const all = await getTechniqueMastery();
    const current = all[techniqueId] || {
      techniqueId,
      level: 0,
      lastPracticed: new Date().toISOString(),
      totalPracticeMinutes: 0,
      exercisesCompleted: [],
    };
    
    all[techniqueId] = {
      ...current,
      ...update,
      lastPracticed: new Date().toISOString(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Error updating technique mastery:', error);
  }
};

// Add practice time to a technique
export const addPracticeTime = async (
  techniqueId: string,
  minutes: number
): Promise<void> => {
  const current = await getTechniqueMasteryById(techniqueId);
  const newTotal = (current?.totalPracticeMinutes || 0) + minutes;
  
  // Auto-level up based on practice time
  // Level 1: 0-30 min, Level 2: 30-90 min, Level 3: 90-180 min, Level 4: 180+ min
  let newLevel = 1;
  if (newTotal >= 180) newLevel = 4;
  else if (newTotal >= 90) newLevel = 3;
  else if (newTotal >= 30) newLevel = 2;
  
  await updateTechniqueMastery(techniqueId, {
    totalPracticeMinutes: newTotal,
    level: Math.max(current?.level || 0, newLevel),
  });
};

// Mark an exercise as completed for a technique
export const completeExerciseForTechnique = async (
  techniqueId: string,
  exerciseId: string
): Promise<void> => {
  const current = await getTechniqueMasteryById(techniqueId);
  const exercises = current?.exercisesCompleted || [];
  
  if (!exercises.includes(exerciseId)) {
    await updateTechniqueMastery(techniqueId, {
      exercisesCompleted: [...exercises, exerciseId],
    });
  }
};

// Check if technique is mastered (level 4)
export const isTechniqueMastered = async (techniqueId: string): Promise<boolean> => {
  const mastery = await getTechniqueMasteryById(techniqueId);
  return mastery?.level === 4;
};

// Get level for a technique (0 if never practiced)
export const getTechniqueLevel = async (techniqueId: string): Promise<number> => {
  const mastery = await getTechniqueMasteryById(techniqueId);
  return mastery?.level || 0;
};

// Get all mastered techniques
export const getMasteredTechniques = async (): Promise<string[]> => {
  const all = await getTechniqueMastery();
  return Object.entries(all)
    .filter(([_, m]) => m.level === 4)
    .map(([id, _]) => id);
};

// Get techniques that need practice (level < 4)
export const getTechniquesThatNeedPractice = async (): Promise<TechniqueMastery[]> => {
  const all = await getTechniqueMastery();
  return Object.values(all).filter(m => m.level < 4);
};

// Check if solo has unmastered techniques
export const checkSoloTechniques = async (techniques: string[]): Promise<{
  mastered: string[];
  unmastered: string[];
}> => {
  const masteredList = await getMasteredTechniques();
  const mastered = techniques.filter(t => masteredList.includes(t));
  const unmastered = techniques.filter(t => !masteredList.includes(t));
  return { mastered, unmastered };
};
