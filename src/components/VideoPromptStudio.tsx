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
  const [aestheticStyle, setAestheticStyle] = useState('documentary_cinematic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<VideoScenePrompt[]>(INITIAL_SCENE_PROMPTS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F171D]">
                Script-to-Video World-Building Prompt Studio
              </h3>
              <p className="text-xs text-[#7E7385]">
                Transforms your script into cinematic, time-locked scene prompts formatted for Veo, Sora, Kling, and Runway Gen-3
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGeneratePrompts}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing World Prompts...' : 'Generate Scene Prompts'}</span>
        </button>
      </div>

      {/* Configuration Strip: Models & Aesthetic Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 p-4 rounded-2xl bg-white/70 border border-rose-100 text-xs">
        {/* Model Target Format */}
        <div className="space-y-1.5">
          <label className="font-bold text-[#4B414C] block">AI Video Model Target</label>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'universal', label: 'Universal' },
              { id: 'veo', label: 'Google Veo' },
              { id: 'runway', label: 'Runway Gen-3' },
              { id: 'kling', label: 'Kling / Sora' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTargetModel(m.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  targetModel === m.id
                    ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-xs'
                    : 'bg-white text-[#6B6071] border-rose-200 hover:bg-rose-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Realism Style */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="font-bold text-[#4B414C] block">Visual Realism &amp; Cinematography</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'documentary_cinematic', label: 'Photorealistic Documentary (35mm Anamorphic)' },
              { id: 'creator_studio', label: 'Modern Creator Studio (Warm Tungsten Rim)' },
              { id: 'dramatic_noir', label: 'Dramatic Film Noir (High OLED Contrast)' },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setAestheticStyle(style.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  aestheticStyle === style.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-xs font-bold'
                    : 'bg-white text-[#6B6071] border-rose-200 hover:bg-rose-50'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Consistency Anchor Banner */}
      <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5 shadow-2xs">
        <Shield className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-rose-800">Style &amp; Character Consistency Anchor Active:</span>
          <p className="text-[#4B414C] mt-0.5 text-xs leading-relaxed">
            All scene prompts maintain persistent character vectors (charcoal crewneck, 35mm lens mechanics, raw travertine/oak setting) to prevent character drifting across scene cuts.
          </p>
        </div>
      </div>

      {/* Scene-by-Scene Prompt Cards */}
      <div className="space-y-4">
        {scenes.map((scene) => (
          <div
            key={scene.sceneNumber}
            className="glass-card p-5 rounded-2xl hover:border-rose-400 transition-all space-y-4 group shadow-xs"
          >
            {/* Scene Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
                  S{scene.sceneNumber}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#1F171D] flex items-center gap-2">
                    <span className="capitalize">{scene.scenePurpose} Scene</span>
                    <span className="font-mono text-xs font-bold text-rose-600">
                      ({scene.timecodeRange})
                    </span>
                  </h4>
                  <span className="text-[11px] text-[#7E7385] font-mono">
                    Duration: {scene.durationSeconds}s · Aspect: 9:16 Vertical Shorts
                  </span>
                </div>
              </div>

              {/* Copy Model Tags Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => copyPromptText(scene.universalPrompt, `uni-${scene.sceneNumber}`)}
                  className="px-3 py-1 rounded-xl bg-white hover:bg-rose-50 text-rose-900 text-[11px] font-semibold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  {copiedKey === `uni-${scene.sceneNumber}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-rose-500" />
                  )}
                  <span>{copiedKey === `uni-${scene.sceneNumber}` ? 'Copied' : 'Universal'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyPromptText(scene.modelTags.veo, `veo-${scene.sceneNumber}`)}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `veo-${scene.sceneNumber}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-rose-500" />
                  )}
                  <span>Veo</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyPromptText(scene.modelTags.runway, `runway-${scene.sceneNumber}`)}
                  className="px-2.5 py-1 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-800 text-[11px] font-semibold border border-pink-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `runway-${scene.sceneNumber}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-pink-500" />
                  )}
                  <span>Runway</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyPromptText(scene.modelTags.kling, `kling-${scene.sceneNumber}`)}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === `kling-${scene.sceneNumber}` ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-rose-500" />
                  )}
                  <span>Kling</span>
                </button>
              </div>
            </div>

            {/* Universal Cinematic Prompt */}
            <div className="p-4 rounded-xl bg-white/90 border border-rose-200 text-xs text-[#1F171D] leading-relaxed font-sans shadow-xs">
              <span className="font-bold text-rose-600 block mb-1">Cinematic Video Prompt:</span>
              <p className="leading-relaxed text-[#332A32]">{scene.universalPrompt}</p>
            </div>

            {/* Cinematography Directives */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/80 border border-rose-100 space-y-1">
                <span className="font-bold text-[#4B414C] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <Camera className="w-3 h-3 text-rose-500" /> Camera Motion:
                </span>
                <p className="text-[#6B6071]">{scene.cameraMotion}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-rose-100 space-y-1">
                <span className="font-bold text-[#4B414C] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <SunMedium className="w-3 h-3 text-rose-500" /> Lighting &amp; Color:
                </span>
                <p className="text-[#6B6071]">{scene.lightingAndColor}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-rose-100 space-y-1">
                <span className="font-bold text-[#4B414C] flex items-center gap-1 text-[11px] uppercase tracking-wide">
                  <Sliders className="w-3 h-3 text-rose-500" /> Negative Prompts:
                </span>
                <p className="text-[#8E7C8D] font-mono text-[10px] truncate" title={scene.negativePrompt}>
                  {scene.negativePrompt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to link back to Video Clipper */}
      <div className="p-4 rounded-2xl bg-white/80 border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <span className="text-xs text-[#6B6071]">
          Once your AI video clips are generated, drop them into the Studio Clipper to add synchronized subtitles and color grading.
        </span>
        <button
          type="button"
          onClick={onSendSceneToClipper}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <span>Open Studio Clipper</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
