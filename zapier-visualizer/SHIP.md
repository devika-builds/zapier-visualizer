# Ship it — 3 steps

Everything is already committed to a local `main` branch with the GitHub remote configured.
The sandbox can't reach GitHub to push, so finish from your own terminal.

## 1. Create the empty repo on GitHub

Go to **https://github.com/new** and create:

- **Owner:** `vika29-gif`
- **Repo name:** `zapier-visualizer`
- **Visibility:** Public
- **Do NOT** tick "Add a README", "Add .gitignore", or "Choose a license" — the repo must be empty

Click **Create repository**.

## 2. Push from your terminal

```bash
cd "C:\Users\devik\Documents\Claude\Projects\Career\zapier-visualizer"
git push -u origin main
```

Git Credential Manager will prompt for GitHub auth in the browser (same flow as the job-tracker and EA Control Center repos). Approve it — push takes ~5 seconds.

## 3. Deploy on Vercel

Go to **https://vercel.com/new** → **Import Git Repository** → select `vika29-gif/zapier-visualizer`.

Vercel auto-detects Vite. Defaults are correct:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

Click **Deploy**. First deploy is ~45 seconds.

---

## Current commit

```
281c76d Initial commit: Zapier Workflow Visualizer
```

Contains: `index.html`, `package.json`, `vite.config.js`, `src/main.jsx`, `src/ZapierVisualizer.jsx` (1,539 lines, Heritage Silver palette with per-node lanes, per-workflow accents, tinted chips).
