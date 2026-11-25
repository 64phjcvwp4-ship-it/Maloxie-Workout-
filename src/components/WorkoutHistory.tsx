import { format, parseISO } from 'date-fns';
import { Trash2, ChevronRight } from 'lucide-react';
import { Workout } from '../types';
import { calcVolume } from '../lib/storage';

interface Props {
  workouts: Workout[];
  onDelete: (id: string) => void;
  onSelect?: (w: Workout) => void;
}

export default function WorkoutHistory({ workouts, onDelete, onSelect }: Props) {
  if (workouts.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-white/40 text-sm">
        No workouts logged yet. Hit “Log Workout” to start.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {workouts.map(w => {
        const vol = calcVolume(w);
        const totalSets = w.exercises.reduce((s, e) => s + e.sets.filter(x => !x.isWarmup).length, 0);
        return (
          <div
            key={w.id}
            className="glass-panel rounded-2xl p-4 hover:bg-white/[0.04] transition cursor-pointer group"
            onClick={() => onSelect?.(w)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{w.title}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {format(parseISO(w.date), 'EEE, MMM d yyyy')}
                  {w.energyLevel != null && ` · Energy ${w.energyLevel}/10`}
                  {w.sleepQuality != null && ` · Sleep ${w.sleepQuality}/10`}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {w.exercises.slice(0, 5).map(e => (
                    <span key={e.id} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                      {e.name}
                    </span>
                  ))}
                  {w.exercises.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                      +{w.exercises.length - 5}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-medium text-blue-300/90">{Math.round(vol).toLocaleString()} kg</div>
                <div className="text-xs text-white/35">{totalSets} sets</div>
                <button
                  onClick={e => { e.stopPropagation(); onDelete(w.id); }}
                  className="mt-2 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
