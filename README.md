# Maloxie — Training Tracker & AI Coach

Premium workout log + progressive overload tracker with an AI Crystal Ball coach.

**Business:** Maloxie  
**Stack:** React 18 + Vite + TypeScript + Tailwind + Framer Motion + Recharts  
**Data:** 100% local (localStorage) — no backend required for the MVP.

## Features

### Logging
- Date + Workout Title
- Exercise name (with library + autocomplete)
- Sets × Reps × Weight
- Rest time between sets
- RPE 1–10
- Per-set notes / how it felt
- Warm-up set toggle
- Energy level & sleep quality
- Injury / pain notes
- Session notes
- Templates: Push, Pull, Legs, Full Body, Upper, Lower

### Progress
- Automatic Personal Records (best estimated 1RM)
- Progressive overload visibility via volume & 1RM charts
- Volume calculator (Sets × Reps × Weight)
- Weekly training volume summary (last 6 weeks)
- Strength trend lines for top lifts
- Goal setting (e.g. “Bench 100 kg by March”)

### Premium UI
- Cinematic looping video background (your landscape clip)
- Animated Crystal Ball / Strands-style AI orb
- Glass panels, premium 3D-style buttons, star-border CTAs
- Your custom **M** logo
- Responsive (mobile bottom nav + desktop top nav)

### AI Coach
- Ask questions about programming, RPE, volume, deloads, etc.
- Currently uses smart local responses (ready to swap for any Free LLM API)

## Quick Start

```bash
cd maloxie-app
npm install
npm run dev
```

Open http://localhost:5173

## StackBlitz / GitHub

1. Push this folder to a GitHub repo.
2. Open the repo in [StackBlitz](https://stackblitz.com) (or import the folder).
3. StackBlitz will run `npm install` + `npm run dev` automatically.

## Connecting a Free LLM API

In `src/components/CrystalBall.tsx`, replace the simulated answer block with a fetch to your preferred free LLM endpoint (Groq, Together, OpenRouter free tier, etc.). Keep the same `setResponse` / `setIsThinking` pattern.

## Assets

- `/public/logo.png` — your black stylized **M**
- `/public/bg-video.mp4` — landscape video used as full-bleed background

## License

Private / for Maloxie.
