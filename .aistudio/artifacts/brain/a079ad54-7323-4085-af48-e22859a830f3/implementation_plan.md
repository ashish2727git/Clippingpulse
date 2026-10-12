# ClipperPulse: Dual-Agent Swarm, Expert Knowledge & Script-to-Video World Prompt Studio

An upgraded architectural blueprint introducing:
1. **Dual-Agent Swarm Intelligence**: Cloud Internet Scout (Gemini + Live Web Grounding) and Local Production Editor (Ollama / Llama 3.2) collaborating simultaneously.
2. **Expert Domain Knowledge Base**: Embedded rules for viral retention curves, DaVinci color science, and algorithmic psychology.
3. **Script-to-Video World-Building Prompt Studio**: Translates any generated script into scene-by-scene cinematic prompts optimized for universal AI video generation models (Google Veo, Sora, Kling, Runway Gen-3) with photorealistic documentary realism, camera motion physics, and social engagement hooks.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers:
> - **Dual-Agent Swarm**: Cloud Scout researches real-time web facts & citations; Local Editor executes video cuts, frame color grading, and subtitle timings.
> - **Universal Video Prompts**: Scene-by-scene timeline breakdown formatted for **Google Veo, OpenAI Sora, Kling AI, and Runway Gen-3**.
> - **Cinematic World Realism**: Prompts incorporate photorealistic documentary aesthetics, 35mm anamorphic camera motion, precise lighting temperatures, and authentic social visual hooks.

- **Confirmed Decision (Video Generation Target)**: Universal prompt formulation with model-specific syntax tags (e.g. `--motion 5`, `--camera push-in`, 24fps 4K HDR photorealistic documentary).
- **Confirmed Decision (Scene Breakdown)**: Scene-by-scene sequence (Hook Shot 0-3s, Narrative Build Shots, Dynamic Metaphor Shot, Payoff & Loop Shot) with dedicated camera movement, lighting, and audio design cues.
- **Confirmed Decision (World-Building & Social References)**: Incorporates realistic atmospheric lighting, environmental textures, authentic human expressions, and viral B-roll metaphors proven on social platforms.

---

## 1. Overview & Core Concept

ClipperPulse completes the full creator pipeline:
$$\text{Live Social & Trend Discovery} \longrightarrow \text{Source Fact-Checking} \longrightarrow \text{Multi-Platform Scriptwriting} \longrightarrow \text{Script-to-Video World Prompt Studio} \longrightarrow \text{Video Clipping & Subtitles}$$

1. **Dual-Agent Swarm**: Cloud Scout researches today's live web breaking news; Local LLM edits local video footage and formats scripts.
2. **Script-to-Video Prompt Studio**: Select any script (TikTok, Shorts, X, LinkedIn) and click **"Generate Video World Prompts"**. The AI creates scene-by-scene visual prompts with camera angles, subject action, lighting, and negative prompts ready for 1-click copy into Veo, Sora, Kling, or Runway.

---

## 2. User Experience & Visual Design

### Script-to-Video World Studio Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       Script-to-Video World Prompt Studio                       │
│                                                                                 │
│   [Selected Script: TikTok 45s High-Retention Hook]                            │
│   "If you are still paying $20/month for cloud AI, stop right now..."           │
│                                                                                 │
│   Model Target: [Universal (Veo · Sora · Kling · Runway Gen-3)]                 │
│   Style: [Photorealistic Documentary & Cinematic Realism]                       │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ Scene 1: The 0-3s Pattern Interrupt Hook                                │   │
│   │ Prompt: "Extreme close-up 35mm anamorphic shot of tired developer...    │   │
│   │ Camera: Rapid push-in with subtle handheld tremor                       │   │
│   │ Lighting: Cool blue monitor glow with warm tungsten desk rim light      │   │
│   │ [Copy Veo Prompt]  [Copy Runway Gen-3 Spec]  [Copy Kling Tag]           │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │ Scene 2: The Breakthrough Metaphor Shot (3-12s)                         │   │
│   │ Prompt: "Cinematic medium tracking shot moving past racks of servers... │   │
│   │ Camera: Smooth dolly left at 24fps, shallow depth of field              │   │
│   │ Lighting: Dramatic volumetric atmospheric haze with amber highlights    │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Universal Model Prompt Optimization
- **Chosen Approach**: Every scene prompt outputs:
  1. **Universal Cinematic Prompt**: Natural language description of subject, action, environment, camera, and lighting.
  2. **Model-Specific Parameter Presets**:
     - *Google Veo*: Aspect ratio (`9:16` or `16:9`), resolution (`1080p`), cinematic camera directive (`push-in`, `tracking`).
     - *Runway Gen-3*: Camera motion tags (`Pan Left`, `Zoom In`, `Motion: 4`).
     - *Kling / Sora*: Atmospheric realism keywords and negative prompt tags (`no CGI blur, no cartoon, no deformed hands`).
- **Why**: Creators switch between different video generation tools depending on generation speed and subscription credits.

### Decision 2: Scene-by-Scene Timeline Coherence
- **Chosen Approach**: Breaks the script into 4–6 cohesive scenes matching the speech pacing:
  - *Scene 1: Hook (0–3s)* — High kinetic visual pattern interrupt.
  - *Scene 2: Problem / Tension (3–15s)* — Relatable real-world scene establishing the conflict.
  - *Scene 3: Revelation / Proof (15–30s)* — Visual metaphor or technical demonstration.
  - *Scene 4: Transformation / Climax (30–42s)* — Cinematic high-contrast payoff shot.
  - *Scene 5: Loop / Outro (42–45s)* — Visual resolution that loops back to Scene 1.
- **Why**: Videos generated from a single generic prompt suffer from pacing drift; scene-by-scene prompts allow modular video generation that matches voiceover cadence.

---

## 4. Technical Architecture & System Layout

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            Express Backend (server.ts)                           │
│                                                                                  │
│  • /api/swarm/collaborative-analysis (Dual-Agent Swarm execution)                │
│  • /api/video-gen/prompt-studio (Generates scene-by-scene world-building prompts)│
│    Input: { scriptText, platform, aestheticStyle, targetModel }                  │
│    Output: { scenes: [ { sceneNumber, timecode, prompt, camera, lighting, ... } ]}│
│  • /api/social/verify-source (Credibility & fact-checking inspection)            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Key Entities

- **VideoScenePrompt**:
  - `sceneNumber`: number
  - `timecodeRange`: string (e.g. `00:00 - 00:03`)
  - `durationSeconds`: number
  - `scenePurpose`: 'hook' | 'tension' | 'proof' | 'payoff' | 'loop'
  - `universalPrompt`: string
  - `cameraMotion`: string
  - `lightingAndColor`: string
  - `lensAndAspect`: string
  - `negativePrompt`: string
  - `targetModelTags`: { veo: string; runway: string; kling: string; sora: string }
- **VideoWorldPackage**:
  - `title`: string
  - `overallAtmosphere`: string
  - `colorPaletteTheme`: string
  - `scenes`: VideoScenePrompt[]
