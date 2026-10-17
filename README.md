# ClipperPulse ⚡

> **AI Video Repurposing Studio & Multi-Sector Viral Trend Radar**  
> Repurpose long-form videos into high-retention short-form clips (TikTok, YouTube Shorts, Reels, X) with stylish synchronized subtitles, AI color grading, 10-sector daily trend intelligence, and an automated Creator Notepad co-pilot.

---

## 🚀 1-Click Quick Start (Run on Any System)

ClipperPulse comes with ready-to-run startup files for macOS, Linux, Windows, and Docker.

### macOS & Linux
```bash
./run.sh
# or: ./start.sh
```
*What this does:*
1. Checks for Node.js (v18+)
2. Sets up `.env` from `.env.example`
3. Automatically runs `npm install` if `node_modules` is missing
4. Probes for local Ollama or Gemini keys (LLM Connection Defaulter)
5. Opens `http://localhost:3000` in your default browser

### Windows
Double-click `run.bat` (or `start.bat`) in the project folder, or run:
```cmd
run.bat
```

### Docker (Zero Local Setup)
```bash
docker compose up
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 LLM Connection Defaulter (How It Works)

ClipperPulse features an **intelligent auto-defaulter** that automatically connects to the best available AI backend on your system:

| Priority | Engine | How it works | Requirements |
| :--- | :--- | :--- | :--- |
| **1. Cloud Gemini** | `Cloud Gemini 2.5 Flash` | Ultra-fast multimodal reasoning, deep research, and script generation. | Set `GEMINI_API_KEY` in `.env` |
| **2. Local LLM** | `Ollama / LM Studio` | 100% private, free inference directly on your local GPU/Apple Silicon. | Install [Ollama](https://ollama.com) & run `ollama run llama3.2` |
| **3. Autonomous Fallback** | `Autonomous Engine` | Intelligent heuristic generation for clips, scripts, titles, and note analysis. | **Zero setup, zero API keys, works completely offline!** |

### Switching Engines in the App
Click the **Engine Badge** in the top navigation bar (or press `⌘K` -> *Switch AI Engine*):
- Click **"Auto-Default"** to let ClipperPulse automatically detect running local models or cloud keys.
- You can test endpoints, pull new Ollama models (e.g. `llama3.2`, `mistral`, `deepseek-r1`), and inspect latency in real-time.

---

## 📤 Push This Project to Git (GitHub / GitLab)

We've initialized the git repository and prepared convenience scripts for you:

### Option A: Use the 1-Click Git Script
```bash
# On macOS / Linux:
./push_to_git.sh

# On Windows:
push_to_git.bat
```
The script will prompt for your remote repository URL (e.g., `https://github.com/username/clipperpulse.git`), stage files, commit, and push automatically.

### Option B: Standard Git Commands
```bash
# 1. Add your remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/clipperpulse.git

# 2. Rename branch to main (if not already)
git branch -M main

# 3. Push to remote
git push -u origin main
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘K` or `Ctrl+K` | Open Global Command Palette (search actions & jump to any tool) |
| `?` | Show Keyboard Shortcuts Cheat Sheet |
| `N` | Quick Jump to **Creator Notepad** |
| `1` | Video Clipper Studio |
| `2` | Color Grading Lab |
| `3` | Trend Radar (10 Sectors) |
| `4` | Script & Packaging Lab |
| `5` | Video Prompt Studio |
| `6` | Creator Notepad Co-Pilot |
| `7` | BioScience Lab |

---

## 🌟 Core Modules

### 1. Trend Radar (Daily Intelligence & 10 Sectors)
- **10 Core Sectors:** Tech & AI, **Gaming & Interactive**, Finance & Macro, Pop Culture, Viral TikTok, Science & Bio, Education, History, Health & Longevity, and World Geopolitics.
- **Daily Feed Refresher:** Automatic daily freshness timestamps, cadence filter (`Today's Breaking`, `Recent 48h`, `All Archives`), and real-time social feeds from Reddit, YouTube, and X.
- **Fact-Checking & Source Verifier:** Verifies primary source credibility with 1-click inspection.

### 2. Subtitle Maker & Style Engine
- **Word-Level Audio Sync Highlighting:** Follows audio timestamps and highlights active words in real time.
- **Market Trend Presets:** Alex Hormozi (Bold Yellow/Green, Upper-case), MrBeast Pop (Comic Bounce), Vox Minimalist (Editorial Serif), Karaoke Glow (Gradient Fill), Cyberpunk Neon, and Cinematic Clean.
- **Customization:** Full control over font family, font size, stroke color/thickness, drop shadows, glow blur, and animated entrance effects (`bounce`, `fade`, `slide`, `pulse`).

### 3. Creator Notepad & Automated Planner
- **Google Search Simulation:** Research any topic with grounded sources.
- **AI Mistake Correction:** Fix grammar, improve flow, punch up the active voice, and generate irresistible 3-second hooks.
- **News Wave Prediction:** Forecast next-week editorial flashpoints before they trend.
- **Copyright Radar:** Detect DMCA risks and identify platforms/fair-use formats that don't issue copyright strikes.
- **Multi-Platform Automated Schedule:** Schedule optimal posting hours and copy-paste ready captions across YouTube Shorts, TikTok, Instagram Reels, and X.

### 4. Video Repurposing & Color Grading Lab
- Extract viral moments using transcript keywords and visual event cues.
- Auto-calculate CSS color grading profiles (`Vibrant Short-Form Pop`, `Moody Film Slate`, `Warm Creator Glow`) based on frame brightness, contrast, and saturation.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion
- **Backend Server:** Node.js, Express, TSX, Google GenAI SDK (`@google/genai`)
- **Local AI:** Ollama API / Local OpenAI endpoints (`/v1/chat/completions`)
- **Deployment:** Docker, Node.js runner scripts (`run.sh`, `run.bat`)

---

## 📄 License
MIT License. Created with ClipperPulse Build.
