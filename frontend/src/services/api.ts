import axios from 'axios';

const API_BASE = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exercises
export const getExercises = async (params?: {
  domain?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
  skip?: number;
}) => {
  const response = await api.get('/exercises', { params });
  return response.data;
};

export const getExercise = async (id: string) => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};

// Alias for getExercise for backwards compatibility
export const getExerciseById = getExercise;

export const getDomains = async () => {
  const response = await api.get('/exercises/domains');
  return response.data;
};

export const getDifficulties = async () => {
  const response = await api.get('/exercises/difficulties');
  return response.data;
};

// Curriculum
export const getPhases = async () => {
  const response = await api.get('/phases');
  return response.data;
};

export const getWeeks = async (phaseId?: string) => {
  const response = await api.get('/weeks', { params: { phase_id: phaseId } });
  return response.data;
};

export const getWeek = async (weekNumber: number) => {
  const response = await api.get(`/weeks/${weekNumber}`);
  return response.data;
};

export const getTodayWorkout = async (week: number, day: number) => {
  const response = await api.get('/today', { params: { week, day } });
  return response.data;
};

// Progress
export const getProgress = async (userId: string = 'default_user') => {
  const response = await api.get('/progress', { params: { user_id: userId } });
  return response.data;
};

export const completeWorkout = async (completion: {
  week: number;
  day: number;
  duration_minutes: number;
  exercises_completed: string[];
}) => {
  const response = await api.post('/progress/workout', completion);
  return response.data;
};

export const resetProgress = async () => {
  const response = await api.post('/progress/reset');
  return response.data;
};

// Settings
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (updates: Record<string, any>) => {
  const response = await api.put('/settings', updates);
  return response.data;
};

// Stats
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export default api;
