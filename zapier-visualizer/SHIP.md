# Ship it — 3 steps

Everything is already committed to a local `main` branch with the GitHub remote configured.
The sandbox can't reach GitHub to push, so finish from your own terminal.

## 1. Create the empty repo on GitHub

Go to **https://github.com/new** and create:

- **Owner:** `devika-builds`
- **Repo name:** `zapier-visualizer`
- **Visibility:** Public
- **Do NOT** tick "Add a README", "Add .gitignore", or "Choose a license" — the repo must be empty

Click **Create repository**.

(If you already created it during the first attempt, skip this step.)

## 2. Push from your terminal

```bash
cd "C:\Users\devik\Documents\Claude\Projects\Career\zapier-visualizer"
git push -u origin main
```

Git Credential Manager will prompt for GitHub auth in the browser (same flow as the job-tracker and EA Control Center repos). Approve it — push takes ~5 seconds.

Three commits go up together: the initial scaffold, the portfolio shell redesign, and this SHIP.md.

## 3. Deploy on Vercel

Go to **https://vercel.com/new** → **Import Git Repository** → select `devika-builds/zapier-visualizer`.

Vercel auto-detects Vite. Defaults are correct:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Click **Deploy**. First deploy is ~45 seconds.

After the first deploy, subsequent commits to `main` auto-deploy — so if you push more changes later, you won't need to touch Vercel again.

---

## Current commits

```
2962f20 Document shell redesign in SHIP.md
8d24563 Add editorial portfolio shell
281c76d Initial commit: Zapier Workflow Visualizer
```

**Initial commit** — `index.html`, `package.json`, `vite.config.js`, `src/main.jsx`, `src/ZapierVisualizer.jsx` (1,539 lines, Heritage Silver palette with per-node lanes, per-workflow accents, tinted chips).

**Shell redesign** — `src/ZapierVisualizer.jsx` grows to 2,469 lines. Adds the editorial portfolio wrapper: sticky TopNav, hero, dark metrics band with animated counters (13+ hrs saved/week · 4 workflows · 24 steps), framed demo with faux browser chrome, sticky-TOC case study, next-piece footer CTA, and a keyboard shortcut overlay (press ?). Responsive at 960/820/640px; prefers-reduced-motion honored throughout. Default export is now the full portfolio page; the core demo component is renamed `ZapierVisualizerCore` and wrapped by the shell.
