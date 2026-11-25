import { AppState, Workout, PersonalRecord, BodyMetric, Goal } from '../types';

const KEY = 'maloxie-v1';

const defaultState: AppState = {
  workouts: [],
  prs: [],
  metrics: [],
  goals: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function estimate1RM(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  // Epley formula
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function calcVolume(workout: Workout): number {
  return workout.exercises.reduce((total, ex) => {
    return total + ex.sets.reduce((s, set) => {
      if (set.isWarmup) return s;
      return s + set.reps * set.weight;
    }, 0);
  }, 0);
}

export function updatePRs(workouts: Workout[]): PersonalRecord[] {
  const map = new Map<string, PersonalRecord>();

  for (const w of workouts) {
    for (const ex of w.exercises) {
      for (const set of ex.sets) {
        if (set.isWarmup || set.weight <= 0) continue;
        const e1 = estimate1RM(set.weight, set.reps);
        const existing = map.get(ex.name);
        if (!existing || e1 > existing.estimated1RM) {
          map.set(ex.name, {
            exerciseName: ex.name,
            weight: set.weight,
            reps: set.reps,
            date: w.date,
            estimated1RM: e1,
          });
        }
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.estimated1RM - a.estimated1RM);
}
