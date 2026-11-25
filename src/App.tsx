import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, BarChart3, History, Plus, Sparkles, Target } from 'lucide-react';
import VideoBackground from './components/VideoBackground';
import Logo from './components/Logo';
import CrystalBall from './components/CrystalBall';
import LogWorkout from './components/LogWorkout';
import ProgressDashboard from './components/ProgressDashboard';
import WorkoutHistory from './components/WorkoutHistory';
import PremiumButton from './components/PremiumButton';
import StarBorder from './components/StarBorder';
import { useAppState } from './hooks/useAppState';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

type Tab = 'home' | 'log' | 'progress' | 'history' | 'goals';

export default function App() {
  const { state, addWorkout, deleteWorkout, addGoal, toggleGoal } = useAppState();
  const [tab, setTab] = useState<Tab>('home');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalEx, setGoalEx] = useState('Barbell Bench Press');
  const [goalWeight, setGoalWeight] = useState(100);
  const [goalDate, setGoalDate] = useState(format(new Date(Date.now() + 90 * 86400000), 'yyyy-MM-dd'));

  const nav = [
    { id: 'home' as Tab, label: 'AI Coach', icon: Sparkles },
    { id: 'log' as Tab, label: 'Log', icon: Plus },
    { id: 'progress' as Tab, label: 'Progress', icon: BarChart3 },
    { id: 'history' as Tab, label: 'History', icon: History },
    { id: 'goals' as Tab, label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen relative text-white">
      <VideoBackground />

      {/* Top nav */}
      <header className="sticky top-0 z-40 glass-panel-strong border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Logo size={32} />
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map(n => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition ${
                  tab === n.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <n.icon size={15} />
                {n.label}
              </button>
            ))}
          </nav>
          <StarBorder onClick={() => setTab('log')}>
            <span className="flex items-center gap-1.5">
              <Dumbbell size={14} /> Log Workout
            </span>
          </StarBorder>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 glass-panel-strong border-t border-white/5 px-2 pb-safe">
        <div className="flex justify-around py-2">
          {nav.map(n => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${
                tab === n.id ? 'text-blue-400' : 'text-white/40'
              }`}
            >
              <n.icon size={20} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 pb-28 sm:pb-12">
        <AnimatePresence mode="wait">
          {tab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-6 max-w-lg">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  Your AI Training Coach
                </h1>
                <p className="text-white/55 text-sm md:text-base">
                  Ask Maloxie anything about programming, progressive overload, RPE, volume, or recovery.
                  Powered by free LLM APIs — your data stays local.
                </p>
              </div>

              <CrystalBall className="mb-10" />

              {/* Quick stats strip */}
              <div className="w-full grid grid-cols-3 gap-3 max-w-md">
                <div className="glass-panel rounded-xl p-3 text-center">
                  <div className="text-xl font-bold">{state.workouts.length}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide">Workouts</div>
                </div>
                <div className="glass-panel rounded-xl p-3 text-center">
                  <div className="text-xl font-bold">{state.prs.length}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide">PRs</div>
                </div>
                <div className="glass-panel rounded-xl p-3 text-center">
                  <div className="text-xl font-bold">{state.goals.filter(g => !g.completed).length}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wide">Goals</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <PremiumButton onClick={() => setTab('log')}>Start Logging</PremiumButton>
                <button
                  onClick={() => setTab('progress')}
                  className="px-5 py-2.5 rounded-full text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition"
                >
                  View Progress
                </button>
              </div>
            </motion.div>
          )}

          {tab === 'log' && (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <h2 className="text-2xl font-bold mb-6">Log Workout</h2>
              <div className="glass-panel-strong rounded-3xl p-5 md:p-8">
                <LogWorkout
                  onSave={w => {
                    addWorkout(w);
                    setTab('history');
                  }}
                  onCancel={() => setTab('home')}
                />
              </div>
            </motion.div>
          )}

          {tab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <h2 className="text-2xl font-bold mb-6">Progress</h2>
              <ProgressDashboard state={state} onToggleGoal={toggleGoal} />
            </motion.div>
          )}

          {tab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">History</h2>
                <StarBorder onClick={() => setTab('log')}>+ New</StarBorder>
              </div>
              <WorkoutHistory workouts={state.workouts} onDelete={deleteWorkout} />
            </motion.div>
          )}

          {tab === 'goals' && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Goals</h2>
                <StarBorder onClick={() => setShowGoalForm(!showGoalForm)}>
                  {showGoalForm ? 'Cancel' : '+ Add Goal'}
                </StarBorder>
              </div>

              {showGoalForm && (
                <div className="glass-panel-strong rounded-2xl p-5 mb-6 space-y-4">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Exercise</label>
                    <input
                      value={goalEx}
                      onChange={e => setGoalEx(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Target weight (kg)</label>
                      <input
                        type="number"
                        value={goalWeight}
                        onChange={e => setGoalWeight(+e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Target date</label>
                      <input
                        type="date"
                        value={goalDate}
                        onChange={e => setGoalDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 outline-none focus:border-blue-400/50"
                      />
                    </div>
                  </div>
                  <PremiumButton
                    onClick={() => {
                      addGoal({
                        exerciseName: goalEx,
                        targetWeight: goalWeight,
                        targetDate: new Date(goalDate).toISOString(),
                      });
                      setShowGoalForm(false);
                    }}
                  >
                    Save Goal
                  </PremiumButton>
                </div>
              )}

              <ProgressDashboard state={state} onToggleGoal={toggleGoal} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer credit */}
      <footer className="text-center text-[11px] text-white/25 py-6 pb-24 sm:pb-6">
        Maloxie · Training Tracker & AI Coach · Data stays on your device
      </footer>
    </div>
  );
}
