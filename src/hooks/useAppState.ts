import { useState, useEffect, useCallback } from 'react';
import { AppState, Workout, BodyMetric, Goal } from '../types';
import { loadState, saveState, updatePRs } from '../lib/storage';
import { v4 as uuid } from 'uuid';

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const addWorkout = useCallback((workout: Omit<Workout, 'id'>) => {
    setState(prev => {
      const newWorkout = { ...workout, id: uuid() };
      const workouts = [newWorkout, ...prev.workouts];
      return {
        ...prev,
        workouts,
        prs: updatePRs(workouts),
      };
    });
  }, []);

  const updateWorkout = useCallback((id: string, patch: Partial<Workout>) => {
    setState(prev => {
      const workouts = prev.workouts.map(w => w.id === id ? { ...w, ...patch } : w);
      return { ...prev, workouts, prs: updatePRs(workouts) };
    });
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setState(prev => {
      const workouts = prev.workouts.filter(w => w.id !== id);
      return { ...prev, workouts, prs: updatePRs(workouts) };
    });
  }, []);

  const addMetric = useCallback((metric: Omit<BodyMetric, 'id'>) => {
    setState(prev => ({
      ...prev,
      metrics: [{ ...metric, id: uuid() }, ...prev.metrics],
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'completed'>) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: uuid(), completed: false }],
    }));
  }, []);

  const toggleGoal = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g),
    }));
  }, []);

  return {
    state,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addMetric,
    addGoal,
    toggleGoal,
  };
}
