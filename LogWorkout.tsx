import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';
import { Plus, Trash2, ChevronDown, Flame } from 'lucide-react';
import { Workout, LoggedExercise, ExerciseSet, MuscleGroup } from '../types';
import { EXERCISE_LIBRARY, WORKOUT_TEMPLATES } from '../data/exercises';
import PremiumButton from './PremiumButton';

interface Props {
  onSave: (w: Omit<Workout, 'id'>) => void;
  onCancel?: () => void;
}

export default function LogWorkout({ onSave, onCancel }: Props) {
  const [title, setTitle] = useState('Workout');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);
  const [energy, setEnergy] = useState(7);
  const [sleep, setSleep] = useState(7);
  const [injuryNotes, setInjuryNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const addExercise = (name?: string, muscle?: MuscleGroup) => {
    const def = name ? EXERCISE_LIBRARY.find(e => e.name === name) : null;
    setExercises(prev => [
      ...prev,
      {
        id: uuid(),
        name: name || '',
        muscleGroup: muscle || def?.muscleGroup || 'Other',
        sets: [{ id: uuid(), reps: 8, weight: 0, rpe: 7, restSeconds: 90 }],
      },
    ]);
  };

  const applyTemplate = (tplId: string) => {
    const tpl = WORKOUT_TEMPLATES.find(t => t.id === tplId);
    if (!tpl) return;
    setTitle(tpl.name);
    setExercises(
      tpl.exercises.map(name => {
        const def = EXERCISE_LIBRARY.find(e => e.name === name);
        return {
          id: uuid(),
          name,
          muscleGroup: def?.muscleGroup || 'Other',
          sets: [
            { id: uuid(), reps: 8, weight: 0, rpe: 7, restSeconds: 120, isWarmup: true },
            { id: uuid(), reps: 8, weight: 0, rpe: 8, restSeconds: 120 },
            { id: uuid(), reps: 8, weight: 0, rpe: 8, restSeconds: 120 },
          ],
        };
      })
    );
    setShowTemplates(false);
  };

  const updateExercise = (id: string, patch: Partial<LoggedExercise>) => {
    setExercises(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  };

  const removeExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const addSet = (exId: string) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exId
          ? {
              ...e,
              sets: [
                ...e.sets,
                {
                  id: uuid(),
                  reps: e.sets[e.sets.length - 1]?.reps || 8,
                  weight: e.sets[e.sets.length - 1]?.weight || 0,
                  rpe: 8,
                  restSeconds: 90,
                },
              ],
            }
          : e
      )
    );
  };

  const updateSet = (exId: string, setId: string, patch: Partial<ExerciseSet>) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exId
          ? { ...e, sets: e.sets.map(s => (s.id === setId ? { ...s, ...patch } : s)) }
          : e
      )
    );
  };

  const removeSet = (exId: string, setId: string) => {
    setExercises(prev =>
      prev.map(e =>
        e.id === exId ? { ...e, sets: e.sets.filter(s => s.id !== setId) } : e
      )
    );
  };

  const handleSave = () => {
    if (exercises.length === 0) return;
    onSave({
      date: new Date(date).toISOString(),
      title,
      exercises,
      energyLevel: energy,
      sleepQuality: sleep,
      injuryNotes: injuryNotes || undefined,
      notes: notes || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs text-white/50 mb-1 block">Workout Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-400/50"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-400/50"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm"
          >
            Templates <ChevronDown size={16} />
          </button>
          {showTemplates && (
            <div className="absolute right-0 top-full mt-2 z-20 glass-panel-strong rounded-xl p-2 min-w-[180px] shadow-xl">
              {WORKOUT_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Energy / Sleep */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 mb-2 flex items-center gap-1">
            <Flame size={12} /> Energy before workout (1-10)
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={e => setEnergy(+e.target.value)}
            className="w-full accent-blue-400"
          />
          <div className="text-center text-sm font-medium text-blue-300">{energy}</div>
        </div>
        <div>
          <label className="text-xs text-white/50 mb-2 block">Sleep quality last night (1-10)</label>
          <input
            type="range"
            min={1}
            max={10}
            value={sleep}
            onChange={e => setSleep(+e.target.value)}
            className="w-full accent-indigo-400"
          />
          <div className="text-center text-sm font-medium text-indigo-300">{sleep}</div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {exercises.map((ex, idx) => (
          <div key={ex.id} className="glass-panel rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-sm font-mono w-6">{idx + 1}</span>
              <input
                list="exercise-list"
                value={ex.name}
                onChange={e => {
                  const def = EXERCISE_LIBRARY.find(d => d.name === e.target.value);
                  updateExercise(ex.id, {
                    name: e.target.value,
                    muscleGroup: def?.muscleGroup || ex.muscleGroup,
                  });
                }}
                placeholder="Exercise name"
                className="flex-1 bg-transparent border-b border-white/10 pb-1 outline-none focus:border-blue-400/50 text-white font-medium"
              />
              <select
                value={ex.muscleGroup}
                onChange={e => updateExercise(ex.id, { muscleGroup: e.target.value as MuscleGroup })}
                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/70"
              >
                {['Chest','Back','Shoulders','Biceps','Triceps','Legs','Glutes','Core','Full Body','Cardio','Other'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <button onClick={() => removeExercise(ex.id)} className="text-white/30 hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>

            {/* Sets header */}
            <div className="grid grid-cols-[28px_1fr_1fr_1fr_1fr_1fr_32px] gap-2 text-[10px] uppercase tracking-wider text-white/40 px-1">
              <span></span>
              <span>Reps</span>
              <span>Weight</span>
              <span>RPE</span>
              <span>Rest(s)</span>
              <span>Notes</span>
              <span></span>
            </div>

            {ex.sets.map((set, sIdx) => (
              <div
                key={set.id}
                className={`grid grid-cols-[28px_1fr_1fr_1fr_1fr_1fr_32px] gap-2 items-center ${set.isWarmup ? 'opacity-60' : ''}`}
              >
                <button
                  onClick={() => updateSet(ex.id, set.id, { isWarmup: !set.isWarmup })}
                  className={`text-[10px] font-bold rounded ${set.isWarmup ? 'text-amber-400' : 'text-white/25'}`}
                  title="Toggle warm-up"
                >
                  {set.isWarmup ? 'W' : sIdx + 1}
                </button>
                <input
                  type="number"
                  value={set.reps}
                  onChange={e => updateSet(ex.id, set.id, { reps: +e.target.value })}
                  className="bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm outline-none focus:ring-1 focus:ring-blue-400/40"
                />
                <input
                  type="number"
                  step="0.5"
                  value={set.weight}
                  onChange={e => updateSet(ex.id, set.id, { weight: +e.target.value })}
                  className="bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm outline-none focus:ring-1 focus:ring-blue-400/40"
                />
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={set.rpe ?? ''}
                  onChange={e => updateSet(ex.id, set.id, { rpe: +e.target.value })}
                  className="bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm outline-none focus:ring-1 focus:ring-blue-400/40"
                />
                <input
                  type="number"
                  value={set.restSeconds ?? ''}
                  onChange={e => updateSet(ex.id, set.id, { restSeconds: +e.target.value })}
                  className="bg-white/5 rounded-lg px-2 py-1.5 text-center text-sm outline-none focus:ring-1 focus:ring-blue-400/40"
                />
                <input
                  value={set.notes ?? ''}
                  onChange={e => updateSet(ex.id, set.id, { notes: e.target.value })}
                  placeholder="felt…"
                  className="bg-white/5 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-400/40"
                />
                <button onClick={() => removeSet(ex.id, set.id)} className="text-white/20 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={() => addSet(ex.id)}
              className="text-xs text-blue-400/80 hover:text-blue-300 flex items-center gap-1 mt-1"
            >
              <Plus size={14} /> Add set
            </button>
          </div>
        ))}
      </div>

      <datalist id="exercise-list">
        {EXERCISE_LIBRARY.map(e => (
          <option key={e.name} value={e.name} />
        ))}
      </datalist>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => addExercise()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/20 hover:border-white/40 text-sm text-white/70"
        >
          <Plus size={16} /> Add Exercise
        </button>
      </div>

      {/* Notes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-white/50 mb-1 block">Injury / Pain notes</label>
          <textarea
            value={injuryNotes}
            onChange={e => setInjuryNotes(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400/50 resize-none"
            placeholder="Any discomfort…"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1 block">Session notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400/50 resize-none"
            placeholder="How did it feel overall?"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <PremiumButton onClick={handleSave}>Save Workout</PremiumButton>
        {onCancel && (
          <button onClick={onCancel} className="px-5 py-2.5 rounded-full text-sm text-white/50 hover:text-white/80">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
