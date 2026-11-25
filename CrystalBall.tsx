import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  listening?: boolean;
  level?: number; // 0-1 mic level
  onAsk?: (question: string) => void;
  className?: string;
}

export default function CrystalBall({ listening = false, level = 0, onAsk, className = '' }: Props) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();

  // Animated strands / energy field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.offsetWidth * 2;
    let h = canvas.height = canvas.offsetHeight * 2;
    const centerX = w / 2;
    const centerY = h / 2;
    const baseRadius = Math.min(w, h) * 0.28;

    const strands = Array.from({ length: 7 }, (_, i) => ({
      angle: (i / 7) * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6,
      amp: 12 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      hue: 200 + i * 18,
    }));

    let t = 0;

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Outer glow
      const glow = ctx.createRadialGradient(centerX, centerY, baseRadius * 0.3, centerX, centerY, baseRadius * 2.2);
      glow.addColorStop(0, `rgba(80, 160, 255, ${0.12 + level * 0.15})`);
      glow.addColorStop(0.5, `rgba(40, 100, 220, ${0.06 + level * 0.08})`);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Core sphere
      const core = ctx.createRadialGradient(centerX - 20, centerY - 25, 5, centerX, centerY, baseRadius);
      core.addColorStop(0, 'rgba(220, 240, 255, 0.95)');
      core.addColorStop(0.35, 'rgba(140, 190, 255, 0.55)');
      core.addColorStop(0.7, 'rgba(50, 110, 210, 0.35)');
      core.addColorStop(1, 'rgba(20, 50, 120, 0.15)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      // Rim highlight
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 220, 255, ${0.4 + level * 0.3})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Strands
      strands.forEach((s, i) => {
        const energy = listening || level > 0.05 ? 1.4 + level * 1.8 : 1;
        const r = baseRadius * (0.85 + Math.sin(t * s.speed + s.phase) * 0.08 * energy);
        const points: { x: number; y: number }[] = [];

        for (let a = 0; a < Math.PI * 2; a += 0.12) {
          const wave = Math.sin(a * 3 + t * s.speed * 2 + s.phase) * s.amp * energy;
          const rr = r + wave;
          const x = centerX + Math.cos(a + s.angle + t * 0.15) * rr;
          const y = centerY + Math.sin(a + s.angle + t * 0.15) * rr * 0.92;
          points.push({ x, y });
        }

        ctx.beginPath();
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.strokeStyle = `hsla(${s.hue}, 85%, 70%, ${0.18 + level * 0.25})`;
        ctx.lineWidth = 1.5 + level * 2;
        ctx.stroke();
      });

      // Listening pulse ring
      if (listening || isThinking) {
        const pulse = (Math.sin(t * 3) + 1) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius + 18 + pulse * 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 180, 255, ${0.25 + pulse * 0.2})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [listening, level, isThinking]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsThinking(true);
    setResponse(null);

    // Simulated free-LLM style response (replace with real Free LLM API later)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 800));

    const q = question.toLowerCase();
    let answer = '';

    if (q.includes('program') || q.includes('plan') || q.includes('routine')) {
      answer = 'For progressive overload, prioritize compound lifts 3–4×/week. A classic Push / Pull / Legs split works well. Start each session with your heaviest compound, then accessories. Aim for 10–20 hard sets per muscle group weekly.';
    } else if (q.includes('bench') || q.includes('press')) {
      answer = 'Bench progress: keep form strict, pause on chest, and add 1.25–2.5 kg when you hit the top of your rep range. Pair with close-grip and incline work. Track RPE — stay around 7–8 most sets.';
    } else if (q.includes('squat') || q.includes('deadlift') || q.includes('legs')) {
      answer = 'Lower body strength grows best with consistent frequency (2×/week) and controlled progressive overload. Use RPE 7–8, leave 1–2 reps in the tank on most sets, and deload every 4–6 weeks.';
    } else if (q.includes('volume') || q.includes('sets')) {
      answer = 'Most lifters thrive on 10–20 hard sets per muscle group per week. Beginners can grow on the lower end; intermediates often need the higher end. Quality > quantity — stop sets 1–3 reps before failure most of the time.';
    } else if (q.includes('rpe') || q.includes('effort')) {
      answer = 'RPE 6–7 is great for technique and volume work. RPE 8 is the sweet spot for most working sets. RPE 9–10 should be rare (top sets or testing). Log it every set so you can see trends.';
    } else if (q.includes('deload') || q.includes('recovery')) {
      answer = 'Deload every 4–8 weeks or when performance drops / joint stress rises. Cut volume ~40–50% and intensity a bit. Sleep, protein (1.6–2.2 g/kg), and managing life stress matter as much as the gym.';
    } else {
      answer = 'I can help with programming, progressive overload, RPE, volume, exercise selection, and recovery. Ask me something specific about your training — e.g. “How should I structure a push day?” or “When should I deload?”';
    }

    setResponse(answer);
    setIsThinking(false);
    onAsk?.(question);
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative w-64 h-64 md:w-72 md:h-72">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-[18%] rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mt-4 w-full max-w-md px-4">
        <div className="glass-panel-strong rounded-2xl p-3 flex gap-2">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            placeholder="Ask Maloxie AI about your training..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white/90 placeholder:text-white/40 px-2"
          />
          <button
            onClick={handleAsk}
            disabled={isThinking || !question.trim()}
            className="px-4 py-1.5 rounded-xl bg-blue-500/80 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-40 transition"
          >
            {isThinking ? '…' : 'Ask'}
          </button>
        </div>

        {(response || isThinking) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 glass-panel rounded-xl p-4 text-sm text-white/85 leading-relaxed"
          >
            {isThinking ? (
              <span className="text-white/50">Thinking about your training…</span>
            ) : (
              response
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
