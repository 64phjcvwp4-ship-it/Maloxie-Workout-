import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns';
import { Trophy, TrendingUp, Activity, Target } from 'lucide-react';
import { AppState } from '../types';
import { calcVolume, estimate1RM } from '../lib/storage';

interface Props {
  state: AppState;
  onToggleGoal: (id: string) => void;
}

export default function ProgressDashboard({ state, onToggleGoal }: Props) {
  const { workouts, prs, goals } = state;

  const weeklyVolume = useMemo(() => {
    const weeks: { label: string; volume: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const ref = subWeeks(new Date(), i);
      const start = startOfWeek(ref, { weekStartsOn: 1 });
      const end = endOfWeek(ref, { weekStartsOn: 1 });
      const vol = workouts
        .filter(w => isWithinInterval(parseISO(w.date), { start, end }))
        .reduce((s, w) => s + calcVolume(w), 0);
      weeks.push({
        label: format(start, 'MMM d'),
        volume: Math.round(vol),
      });
    }
    return weeks;
  }, [workouts]);

  const strengthTrends = useMemo(() => {
    // Take top 4 PRs and plot recent estimated 1RM over time
    const top = prs.slice(0, 4).map(p => p.exerciseName);
    const data: Record<string, any>[] = [];
    const byDate = new Map<string, Record<string, number>>();

    for (const w of [...workouts].reverse()) {
      const day = format(parseISO(w.date), 'MMM d');
      if (!byDate.has(day)) byDate.set(day, {});
      const entry = byDate.get(day)!;
      for (const ex of w.exercises) {
        if (!top.includes(ex.name)) continue;
        let best = 0;
        for (const s of ex.sets) {
          if (s.isWarmup) continue;
          best = Math.max(best, estimate1RM(s.weight, s.reps));
        }
        if (best > 0) entry[ex.name] = best;
      }
    }
    return Array.from(byDate.entries()).map(([date, vals]) => ({ date, ...vals }));
  }, [workouts, prs]);

  const totalVolume = workouts.reduce((s, w) => s + calcVolume(w), 0);
  const thisWeekVol = weeklyVolume[weeklyVolume.length - 1]?.volume || 0;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Workouts', value: workouts.length, icon: Activity, color: 'text-blue-400' },
          { label: 'This Week Vol', value: `${(thisWeekVol / 1000).toFixed(1)}k`, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'PRs Tracked', value: prs.length, icon: Trophy, color: 'text-amber-400' },
          { label: 'Active Goals', value: goals.filter(g => !g.completed).length, icon: Target, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-2xl p-4">
            <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
              <s.icon size={14} className={s.color} />
              {s.label}
            </div>
            <div className="text-2xl font-bold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Weekly volume chart */}
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Weekly Training Volume (kg)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                labelStyle={{ color: '#aaa' }}
              />
              <Bar dataKey="volume" fill="url(#volGrad)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strength trends */}
      {strengthTrends.length > 1 && (
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Estimated 1RM Trends</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={strengthTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}
                />
                {prs.slice(0, 4).map((p, i) => (
                  <Line
                    key={p.exerciseName}
                    type="monotone"
                    dataKey={p.exerciseName}
                    stroke={['#60a5fa', '#34d399', '#fbbf24', '#a78bfa'][i]}
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* PRs */}
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-amber-400" /> Personal Records
        </h3>
        {prs.length === 0 ? (
          <p className="text-white/40 text-sm">Log workouts to start tracking PRs automatically.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {prs.slice(0, 12).map(pr => (
              <div key={pr.exerciseName} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-medium text-sm">{pr.exerciseName}</div>
                  <div className="text-xs text-white/40">{format(parseISO(pr.date), 'MMM d, yyyy')}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-amber-300/90">{pr.weight} kg × {pr.reps}</div>
                  <div className="text-xs text-white/40">~{pr.estimated1RM} kg e1RM</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goals */}
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
          <Target size={16} className="text-purple-400" /> Goals
        </h3>
        {goals.length === 0 ? (
          <p className="text-white/40 text-sm">Set a goal like “Bench 100 kg by March”.</p>
        ) : (
          <div className="space-y-2">
            {goals.map(g => (
              <div
                key={g.id}
                className={`flex items-center gap-3 py-2 ${g.completed ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={() => onToggleGoal(g.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    g.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                  }`}
                >
                  {g.completed && <span className="text-black text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {g.exerciseName} — {g.targetWeight} kg
                    {g.targetReps ? ` × ${g.targetReps}` : ''}
                  </div>
                  <div className="text-xs text-white/40">
                    by {format(parseISO(g.targetDate), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
