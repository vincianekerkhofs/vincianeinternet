import AsyncStorage from '@react-native-async-storage/async-storage';

const COMPLETED_EXERCISES_KEY = 'guitar_gym_completed_exercises';
const COMPLETED_WEEKS_KEY = 'guitar_gym_completed_weeks';

/**
 * Completion tracking for exercises
 */

// Get all completed exercise IDs
export const getCompletedExercises = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_EXERCISES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting completed exercises:', error);
    return [];
  }
};

// Mark an exercise as complete
export const markExerciseComplete = async (exerciseId: string): Promise<void> => {
  try {
    const completed = await getCompletedExercises();
    if (!completed.includes(exerciseId)) {
      completed.push(exerciseId);
      await AsyncStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(completed));
    }
  } catch (error) {
    console.error('Error marking exercise complete:', error);
  }
};

// Mark an exercise as incomplete
export const markExerciseIncomplete = async (exerciseId: string): Promise<void> => {
  try {
    const completed = await getCompletedExercises();
    const filtered = completed.filter(id => id !== exerciseId);
    await AsyncStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error marking exercise incomplete:', error);
  }
};

// Check if an exercise is complete
export const isExerciseComplete = async (exerciseId: string): Promise<boolean> => {
  const completed = await getCompletedExercises();
  return completed.includes(exerciseId);
};

// Get completion stats
export const getCompletionStats = async (): Promise<{
  totalCompleted: number;
  week1to24Completed: number;
  week1to24Total: number;
  percentComplete: number;
}> => {
  const completed = await getCompletedExercises();
  
  // Estimate total exercises in weeks 1-24 (approximately 68 in first 24 weeks)
  const week1to24Total = 68;
  
  return {
    totalCompleted: completed.length,
    week1to24Completed: completed.length, // All our exercises are in weeks 1-24
    week1to24Total,
    percentComplete: Math.round((completed.length / week1to24Total) * 100),
  };
};

// Reset all progress
export const resetAllProgress = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(COMPLETED_EXERCISES_KEY);
    await AsyncStorage.removeItem(COMPLETED_WEEKS_KEY);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
};
