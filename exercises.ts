import { MuscleGroup } from '../types';

export interface ExerciseDef {
  name: string;
  muscleGroup: MuscleGroup;
  tags?: string[];
}

export const EXERCISE_LIBRARY: ExerciseDef[] = [
  // Chest
  { name: 'Barbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Incline Bench Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Bench Press', muscleGroup: 'Chest' },
  { name: 'Dumbbell Flyes', muscleGroup: 'Chest' },
  { name: 'Cable Crossover', muscleGroup: 'Chest' },
  { name: 'Push-Ups', muscleGroup: 'Chest' },
  { name: 'Dips (Chest)', muscleGroup: 'Chest' },
  // Back
  { name: 'Deadlift', muscleGroup: 'Back' },
  { name: 'Barbell Row', muscleGroup: 'Back' },
  { name: 'Pull-Ups', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', muscleGroup: 'Back' },
  { name: 'Seated Cable Row', muscleGroup: 'Back' },
  { name: 'T-Bar Row', muscleGroup: 'Back' },
  { name: 'Face Pulls', muscleGroup: 'Back' },
  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raises', muscleGroup: 'Shoulders' },
  { name: 'Front Raises', muscleGroup: 'Shoulders' },
  { name: 'Rear Delt Flyes', muscleGroup: 'Shoulders' },
  { name: 'Arnold Press', muscleGroup: 'Shoulders' },
  // Arms
  { name: 'Barbell Curl', muscleGroup: 'Biceps' },
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps' },
  { name: 'Preacher Curl', muscleGroup: 'Biceps' },
  { name: 'Tricep Pushdown', muscleGroup: 'Triceps' },
  { name: 'Skull Crushers', muscleGroup: 'Triceps' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps' },
  { name: 'Close-Grip Bench Press', muscleGroup: 'Triceps' },
  // Legs
  { name: 'Back Squat', muscleGroup: 'Legs' },
  { name: 'Front Squat', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs' },
  { name: 'Leg Press', muscleGroup: 'Legs' },
  { name: 'Lunges', muscleGroup: 'Legs' },
  { name: 'Bulgarian Split Squat', muscleGroup: 'Legs' },
  { name: 'Leg Extension', muscleGroup: 'Legs' },
  { name: 'Leg Curl', muscleGroup: 'Legs' },
  { name: 'Calf Raises', muscleGroup: 'Legs' },
  { name: 'Hip Thrust', muscleGroup: 'Glutes' },
  // Core
  { name: 'Plank', muscleGroup: 'Core' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core' },
  { name: 'Cable Crunch', muscleGroup: 'Core' },
  { name: 'Ab Wheel Rollout', muscleGroup: 'Core' },
  // Full / Cardio
  { name: 'Clean & Press', muscleGroup: 'Full Body' },
  { name: 'Kettlebell Swing', muscleGroup: 'Full Body' },
  { name: 'Running', muscleGroup: 'Cardio' },
  { name: 'Rowing Machine', muscleGroup: 'Cardio' },
  { name: 'Cycling', muscleGroup: 'Cardio' },
];

export const WORKOUT_TEMPLATES = [
  {
    id: 'push',
    name: 'Push Day',
    exercises: ['Barbell Bench Press', 'Overhead Press', 'Incline Bench Press', 'Lateral Raises', 'Tricep Pushdown', 'Dips (Chest)'],
  },
  {
    id: 'pull',
    name: 'Pull Day',
    exercises: ['Deadlift', 'Pull-Ups', 'Barbell Row', 'Face Pulls', 'Barbell Curl', 'Hammer Curl'],
  },
  {
    id: 'legs',
    name: 'Legs Day',
    exercises: ['Back Squat', 'Romanian Deadlift', 'Leg Press', 'Lunges', 'Leg Curl', 'Calf Raises'],
  },
  {
    id: 'full',
    name: 'Full Body',
    exercises: ['Back Squat', 'Barbell Bench Press', 'Barbell Row', 'Overhead Press', 'Romanian Deadlift', 'Pull-Ups'],
  },
  {
    id: 'upper',
    name: 'Upper Body',
    exercises: ['Barbell Bench Press', 'Barbell Row', 'Overhead Press', 'Pull-Ups', 'Lateral Raises', 'Barbell Curl'],
  },
  {
    id: 'lower',
    name: 'Lower Body',
    exercises: ['Back Squat', 'Romanian Deadlift', 'Hip Thrust', 'Leg Press', 'Leg Curl', 'Calf Raises'],
  },
];
