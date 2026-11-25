export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps'
  | 'Legs' | 'Glutes' | 'Core' | 'Full Body' | 'Cardio' | 'Other';

export interface ExerciseSet {
  id: string;
  reps: number;
  weight: number; // kg
  rpe?: number;   // 1-10
  restSeconds?: number;
  notes?: string;
  isWarmup?: boolean;
}

export interface LoggedExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  date: string; // ISO
  title: string;
  template?: string;
  exercises: LoggedExercise[];
  energyLevel?: number; // 1-10
  sleepQuality?: number; // 1-10
  injuryNotes?: string;
  notes?: string;
  durationMinutes?: number;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
  estimated1RM: number;
}

export interface BodyMetric {
  id: string;
  date: string;
  weightKg?: number;
  bodyFat?: number;
  measurements?: Record<string, number>;
}

export interface Goal {
  id: string;
  exerciseName: string;
  targetWeight: number;
  targetReps?: number;
  targetDate: string;
  currentBest?: number;
  completed: boolean;
}

export interface AppState {
  workouts: Workout[];
  prs: PersonalRecord[];
  metrics: BodyMetric[];
  goals: Goal[];
}
