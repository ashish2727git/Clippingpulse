import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Clapperboard,
  Camera,
  ArrowRight,
  SunMedium,
  Sliders,
  Shield,
  Layers,
  Volume2,
  Scissors,
  Wand2,
  Film,
  Download,
  Terminal,
  Zap,
} from 'lucide-react';
import { VideoScenePrompt } from '../types';
import { INITIAL_SCENE_PROMPTS } from '../data/sampleProjects';

interface VideoPromptStudioProps {
  currentScriptText: string;
  onSendSceneToClipper: () => void;
}

export const VideoPromptStudio: React.FC<VideoPromptStudioProps> = ({
  currentScriptText,
  onSendSceneToClipper,
}) => {
  const [targetModel, setTargetModel] = useState<'universal' | 'veo' | 'runway' | 'kling' | 'sora'>('universal');
  const [aestheticStyle, setAestheticStyle] = useState('vox_documentary');
  const [activeTabByScene, setActiveTabByScene] = useState<Record<number, 'prompt' | 'ae' | 'sfx' | 'retention'>>({
    1: 'prompt',
    2: 'prompt',
    3: 'prompt',
    4: 'prompt',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<VideoScenePrompt[]>(INITIAL_SCENE_PROMPTS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const stylePresets = [
    {
      id: 'vox_documentary',
      label: '📰 Vox / Johnny Harris Documentary',
      desc: '2.5D Photo Parallax, Animated Map Trim Paths, Paper Rips, Highlighter & Micro-Dust',
    },
    {
      id: 'magnates_noir',
      label: '💎 Magnates Media / James Jani 3D Noir',
      desc: 'Moody Film Noir, 3D Camera Orbit, Gold Floating Particles, 808 Sub-Bass Drones',
    },
    {
      id: 'hormozi_kinetic',
      label: '⚡ Alex Hormozi Kinetic Pop',
      desc: 'Bold High-Contrast One-Word Pops, Extreme Snap Zooms, Sound on Every Syllable',
    },
    {
      id: 'lemmino_mystery',
      label: '🏛️ Lemmino Archival Lore & Mystery',
      desc: '16mm Film Grain, Archival Newspaper Z-Dolly, Mechanical Typewriter Clicks',
    },
    {
      id: 'kurzgesagt_vector',
      label: '🔬 Kurzgesagt Vector & Molecular Motion',
      desc: 'Vibrant Flat 2D/3D Vector Animation, Glowing Molecular Nodes, Smooth Easing',
    },
    {
      id: 'cyber_hud',
      label: '🔮 Cyberpunk Holographic HUD',
      desc: 'Neon Wireframes, Rotating 3D Silicon Chip Models, Digital Glitch Scanlines',
    },
  ];

  const handleGeneratePrompts = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/video-gen/prompt-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptText: currentScriptText || 'Developers running local AI on MacBooks with zero cloud API subscriptions.',
          aestheticStyle,
          targetModel,
        }),
      });
      const data = await res.json();
      if (data.scenes && Array.isArray(data.scenes)) {
        setScenes(data.scenes);
      }
    } catch {
      // keep initial prompts
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPromptText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyFullEditorDossier = () => {
    const lines: string[] = [];
    lines.push(`=== HIGH-PRODUCTION SHORT FORM MOTION DESIGN DOSSIER ===`);
    lines.push(`Style Preset: ${aestheticStyle.toUpperCase()}`);
    lines.push(`Script: "${currentScriptText}"\n`);

    scenes.forEach((s) => {
      lines.push(`----------------------------------------`);
      lines.push(`SCENE ${s.sceneNumber}: ${s.scenePurpose.toUpperCase()} (${s.timecodeRange}) - Duration: ${s.durationSeconds}s`);
      lines.push(`----------------------------------------`);
      lines.push(`AI VIDEO PROMPT:\n${s.universalPrompt}\n`);
      lines.push(`CAMERA & LENS:\n${s.cameraMotion} | Lens: ${s.lensAndAspect} | Light: ${s.lightingAndColor}\n`);

      if (s.afterEffectsComp) {
        lines.push(`AFTER EFFECTS COMPOSITION SPEC:`);
        lines.push(`- Comp: ${s.afterEffectsComp.compositionPreset}`);
        lines.push(`- Camera Rig: ${s.afterEffectsComp.cameraRig}`);
        lines.push(`- Easing: ${s.afterEffectsComp.easingFormula}`);
        lines.push(`- Layers Stack:`);
        s.afterEffectsComp.layers.forEach((l) => lines.push(`   * ${l}`));
        lines.push(`- VFX Plugins: ${s.afterEffectsComp.vfxPlugins.join(', ')}\n`);
      }

      if (s.sfxFoleyCues) {
        lines.push(`FOLEY & SOUND DESIGN TIMELINE:`);
        s.sfxFoleyCues.forEach((f) => lines.push(`   * [${f.timecode}] (${f.sfxType.toUpperCase()}) ${f.soundName} -> ${f.intent}`));
        lines.push('');
      }

      if (s.patternInterrupt) {
        lines.push(`RETENTION PATTERN INTERRUPT: ${s.patternInterrupt}\n`);
      }
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedKey('full-dossier');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Motion Designer Script-to-Video &amp; After Effects Prompt Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                  After Effects · Premiere · AI Video Prompts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Transforms scripts into high-end After Effects 3D camera comps, 2.5D parallax layers, foley sound tracks, and AI generation prompts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyFullEditorDossier}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Copy complete After Effects layers and video prompt specification"
          >
            {copiedKey === 'full-dossier' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-blue-600" />
            )}
            <span>{copiedKey === 'full-dossier' ? 'Copied Full Dossier' : 'Export AE Dossier'}</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePrompts}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing AE Blueprint...' : 'Generate Motion Design Prompts'}</span>
          </button>
        </div>
      </div>

      {/* Creator Editing Style Presets (Vox, Magnates, Hormozi, Lemmino) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Wand2 className="w-3.5 h-3.5 text-purple-600" />
          <span>Select Top-Creator Short-Form Editing Style:</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {stylePresets.map((style) => {
            const isSelected = aestheticStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setAestheticStyle(style.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{style.label}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">{style.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Strip: Models Target */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Target AI Model Generator:</span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'universal', label: 'Universal (All Models)' },
              { id: 'veo', label: 'Google Veo' },
              { id: 'runway', label: 'Runway Gen-3' },
              { id: 'kling', label: 'Kling AI' },
              { id: 'sora', label: 'OpenAI Sora' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTargetModel(m.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  targetModel === m.id
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Aspect Ratio: 9:16 Vertical · 60fps Master Comp</span>
        </div>
      </div>

      {/* Scene-by-Scene Prompt & After Effects Cards */}
      <div className="space-y-5">
        {scenes.map((scene) => {
          const activeSubTab = activeTabByScene[scene.sceneNumber] || 'prompt';
          return (
            <div
              key={scene.sceneNumber}
              className="glass-card p-5 rounded-2xl hover:border-blue-300 transition-all space-y-4 group shadow-xs bg-white/95"
            >
              {/* Scene Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                    S{scene.sceneNumber}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="capitalize">{scene.scenePurpose} Sequence</span>
                      <span className="font-mono text-xs font-bold text-blue-600">
                        ({scene.timecodeRange})
                      </span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Duration: {scene.durationSeconds}s · Style: {scene.motionDesignStyle || 'Kinetic Motion Design'}
                    </span>
                  </div>
                </div>

                {/* Sub-Tabs: AI Prompt vs After Effects Layers vs Foley SFX vs Retention */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTabByScene((prev) => ({ ...prev, [scene.sceneNumber]: 'prompt' }))
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeSubTab === 'prompt'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Film className="w-3 h-3 text-blue-600" />
                    <span>AI Video Prompt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTabByScene((prev) => ({ ...prev, [scene.sceneNumber]: 'ae' }))
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeSubTab === 'ae'
                        ? 'bg-white text-purple-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-purple-600" />
                    <span>After Effects Comp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTabByScene((prev) => ({ ...prev, [scene.sceneNumber]: 'sfx' }))
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeSubTab === 'sfx'
                        ? 'bg-white text-amber-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Volume2 className="w-3 h-3 text-amber-600" />
                    <span>Foley &amp; SFX</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTabByScene((prev) => ({ ...prev, [scene.sceneNumber]: 'retention' }))
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeSubTab === 'retention'
                        ? 'bg-white text-rose-700 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3 h-3 text-rose-600" />
                    <span>Cut Strategy</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: AI VIDEO PROMPTS */}
              {activeSubTab === 'prompt' && (
                <div className="space-y-3">
                  {/* Universal Cinematic Prompt */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 leading-relaxed font-sans shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <Clapperboard className="w-3.5 h-3.5" />
                        <span>Cinematic Video Prompt (35mm Anamorphic):</span>
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => copyPromptText(scene.universalPrompt, `uni-${scene.sceneNumber}`)}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === `uni-${scene.sceneNumber}` ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-blue-600" />
                          )}
                          <span>Copy Prompt</span>
                        </button>
                      </div>
                    </div>
                    <p className="leading-relaxed text-slate-700">{scene.universalPrompt}</p>
                  </div>

                  {/* Cinematography Directives */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                        <Camera className="w-3 h-3 text-blue-600" /> Camera Motion:
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{scene.cameraMotion}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                        <SunMedium className="w-3 h-3 text-amber-600" /> Lighting &amp; Color:
                      </span>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{scene.lightingAndColor}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                        <Sliders className="w-3 h-3 text-rose-600" /> Negative Constraints:
                      </span>
                      <p className="text-slate-500 font-mono text-[10px] leading-relaxed truncate" title={scene.negativePrompt}>
                        {scene.negativePrompt}
                      </p>
                    </div>
                  </div>

                  {/* Model Specific Quick Copy Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">Copy Model Syntax:</span>
                    <button
                      type="button"
                      onClick={() => copyPromptText(scene.modelTags.veo, `veo-${scene.sceneNumber}`)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-semibold border border-blue-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `veo-${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-blue-600" />}
                      <span>Google Veo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPromptText(scene.modelTags.runway, `runway-${scene.sceneNumber}`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[11px] font-semibold border border-indigo-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `runway-${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-indigo-600" />}
                      <span>Runway Gen-3</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPromptText(scene.modelTags.kling, `kling-${scene.sceneNumber}`)}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold border border-sky-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `kling-${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-sky-600" />}
                      <span>Kling AI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPromptText(scene.modelTags.sora, `sora-${scene.sceneNumber}`)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-semibold border border-purple-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `sora-${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-purple-600" />}
                      <span>OpenAI Sora</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: AFTER EFFECTS COMPOSITION SPECIFICATION */}
              {activeSubTab === 'ae' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span>After Effects Layer Stack (Compositor Blueprint):</span>
                      </span>
                      <span className="font-mono text-[10px] text-purple-700 font-bold bg-white px-2 py-0.5 rounded-md border border-purple-200">
                        {scene.afterEffectsComp?.compositionPreset || '1080x1920 @ 60fps'}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {scene.afterEffectsComp?.layers.map((layer, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-white border border-purple-100 font-mono text-[11px] text-slate-800 flex items-start gap-2 shadow-2xs"
                        >
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold text-[10px] shrink-0">
                            L{idx + 1}
                          </span>
                          <span className="leading-snug">{layer}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                        <Camera className="w-3 h-3 text-purple-600" /> 3D Camera Rig &amp; Focal Rig:
                      </span>
                      <p className="text-slate-600 text-[11px] font-mono leading-relaxed">
                        {scene.afterEffectsComp?.cameraRig || 'After Effects 3D Camera, 35mm Anamorphic, Z-Depth Dolly'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-purple-600" /> Motion Easing Formula:
                      </span>
                      <p className="text-slate-600 text-[11px] font-mono leading-relaxed">
                        {scene.afterEffectsComp?.easingFormula || 'Cubic-Bezier (0.16, 1.0, 0.3, 1.0) Fast-In Settle'}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                      <span className="font-bold">Required AE Plugins:</span>
                      <span className="font-mono text-purple-700 font-semibold">
                        {scene.afterEffectsComp?.vfxPlugins.join(' · ') || 'Trapcode Particular, Mocha Pro, Deep Glow'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        copyPromptText(
                          scene.afterEffectsComp?.layers.join('\n') || '',
                          `ae-${scene.sceneNumber}`
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `ae-${scene.sceneNumber}` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-purple-600" />
                      )}
                      <span>Copy Layers</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: FOLEY & SOUND DESIGN TIMELINE */}
              {activeSubTab === 'sfx' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                        <Volume2 className="w-4 h-4 text-amber-600" />
                        <span>Foley &amp; Sound Design Audio Stems (Audio Psychology):</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold">
                        Syncs to Visual Pattern Interrupts
                      </span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {scene.sfxFoleyCues?.map((cue, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                              {cue.timecode}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                              {cue.sfxType}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">{cue.soundName}</span>
                          </div>

                          <span className="text-[11px] text-slate-500 italic">
                            Purpose: {cue.intent}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                    <span className="font-bold text-slate-900">Audio Engineer Note:</span> Lay down a subtle low-frequency atmospheric drone (-18dB) under the speech track. Duck music by 8dB automatically during voice transients, and let the 808 sub hits hit right on the visual transition frame.
                  </div>
                </div>
              )}

              {/* TAB 4: RETENTION CUT STRATEGY */}
              {activeSubTab === 'retention' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                        <Zap className="w-4 h-4 text-rose-600" />
                        <span>Viral Pacing &amp; Pattern Interrupt Blueprint:</span>
                      </span>
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                        Retention Optimization
                      </span>
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed bg-white p-3 rounded-xl border border-rose-100">
                      {scene.patternInterrupt || 'Cut on motion beat to reset viewer attention before 3-second dropoff.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 text-[11px]">Recommended Cut Rhythm:</span>
                      <p className="text-slate-600 text-xs">
                        Maximum 2.2 seconds per visual beat. Use snap punch-in on emphasis words.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-700 text-[11px]">Subtitle Animation Sync:</span>
                      <p className="text-slate-600 text-xs">
                        Center-screen kinetic word pops with 0.12s spring bounce damping.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA to link back to Video Clipper */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <span className="text-xs text-slate-600">
          Ready to sync your AI clips with kinetic subtitles, color correction, and audio waveforms?
        </span>
        <button
          type="button"
          onClick={onSendSceneToClipper}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>Open Studio Clipper</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
