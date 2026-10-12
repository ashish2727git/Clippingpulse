import React, { useState, useEffect } from 'react';
import {
  Type,
  Sparkles,
  Layout,
  Smile,
  Check,
  Flame,
  Zap,
  Sliders,
  Eye,
  Info,
  Maximize2,
  Palette,
} from 'lucide-react';
import { SubtitleConfig, SubtitlePreset } from '../types';

interface SubtitleStyleEditorProps {
  subtitleConfig: SubtitleConfig;
  setSubtitleConfig: React.Dispatch<React.SetStateAction<SubtitleConfig>>;
}

export const SubtitleStyleEditor: React.FC<SubtitleStyleEditorProps> = ({
  subtitleConfig,
  setSubtitleConfig,
}) => {
  // Animated preview simulator state
  const [previewWordIndex, setPreviewWordIndex] = useState(0);
  const [showRetentionGuide, setShowRetentionGuide] = useState(false);

  const PREVIEW_SAMPLE_WORDS = ['THE', 'SECRET', 'MONOPOLY', 'JUST', 'SHATTERED'];

  // Simulate active word playback every 650ms for live creator inspection
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewWordIndex((prev) => (prev + 1) % PREVIEW_SAMPLE_WORDS.length);
    }, 650);
    return () => clearInterval(timer);
  }, []);

  const PRESET_OPTIONS: {
    id: SubtitlePreset;
    name: string;
    creatorInspiration: string;
    description: string;
    defaultColor: string;
    retentionRating: string;
  }[] = [
    {
      id: 'hormozi',
      name: 'Hormozi Kinetic Pop',
      creatorInspiration: 'Alex Hormozi / Acquisition.com',
      description: 'Heavy black outline, uppercase, vibrant gold pop on active word with scale bounce.',
      defaultColor: '#FACC15',
      retentionRating: '92% (Hook King)',
    },
    {
      id: 'beast_yellow',
      name: 'MrBeast Energy',
      creatorInspiration: 'MrBeast / High-Stakes Storytelling',
      description: 'Amber base with exploding cyber-cyan punchline, intense drop shadow.',
      defaultColor: '#22D3EE',
      retentionRating: '94% (Viral Apex)',
    },
    {
      id: 'ali_aesthetic',
      name: 'Ali Abdaal Glass Pod',
      creatorInspiration: 'Ali Abdaal / Iman Gadzhi',
      description: 'Frosted dark glass capsule backdrop, crisp white with glowing sky-blue active underline.',
      defaultColor: '#38BDF8',
      retentionRating: '88% (High-Status)',
    },
    {
      id: 'tiktok_clean',
      name: 'Modern Reel Streamline',
      creatorInspiration: 'Opus Clip / Captions AI',
      description: 'Clean dark rounded pill, neon lime active pop, rapid 2-3 word chunking.',
      defaultColor: '#4ADE80',
      retentionRating: '89% (Optimal Flow)',
    },
    {
      id: 'minimal_box',
      name: 'Contrast Word Chips',
      creatorInspiration: 'Ryan Pineda / Tech Influencers',
      description: 'Each word enclosed in an isolated micro-chip with active word highlighting.',
      defaultColor: '#F59E0B',
      retentionRating: '86% (High Contrast)',
    },
    {
      id: 'documentary',
      name: 'Cinema Documentary',
      creatorInspiration: 'Vox / Johnny Harris',
      description: 'Cinematic letterspacing, lower-third placement, subtle warm champagne glow.',
      defaultColor: '#FDE047',
      retentionRating: '87% (Authentic)',
    },
  ];

  const COLOR_PALETTES = [
    { label: 'Vibrant Gold', hex: '#FACC15' },
    { label: 'Cyber Cyan', hex: '#22D3EE' },
    { label: 'Neon Lime', hex: '#4ADE80' },
    { label: 'Hot Coral', hex: '#FB923C' },
    { label: 'Electric Purple', hex: '#A855F7' },
    { label: 'Crisp White', hex: '#FFFFFF' },
  ];

  return (
    <div className="glass-panel rounded-2xl overflow-hidden p-6 space-y-6">
      {/* Header with Creator Retention Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Creator Subtitle &amp; Kinetic Alignment Lab
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300/70">
                Retention Pacing Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Synchronized word-by-word karaoke highlighting tuned to top creator psychology (Hormozi, MrBeast, Ali Abdaal)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRetentionGuide(!showRetentionGuide)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 transition-colors shrink-0"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showRetentionGuide ? 'Hide Creator Science' : 'Retention Logic Guide'}</span>
        </button>
      </div>

      {/* Collapsible Creator Retention Science Guide */}
      {showRetentionGuide && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Why Top Creator Subtitles 2x Video Completion Rates:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900">1. Micro-Chunking (2-3 Words)</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                If full sentences appear, viewers read ahead in 0.8s and swipe away. Limiting to 2-3 words locks eyes directly onto the active spoken cadence.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900">2. Active Word Bounce Scale</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                A 10-15% scale pop on the current spoken word simulates audio rhythm visually, keeping dopamine receptors actively engaged without mute issues.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200/60 space-y-1">
              <span className="font-bold text-slate-900">3. Frosted Backdrop Contrast</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                A subtle frosted glass pod or dark pill prevents text from getting lost on bright shirts, complex code terminals, or changing studio lighting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Interactive Preview Screen */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] shadow-2xl">
        <div className="absolute top-2.5 left-3 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-blue-400" />
          <span>Live Synchronized Simulator (650ms clock)</span>
        </div>

        {/* Backdrop simulation */}
        <div
          className={`inline-flex flex-col items-center justify-center transition-all ${
            subtitleConfig.backdropStyle === 'glass_pod'
              ? 'bg-black/65 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 shadow-2xl'
              : subtitleConfig.backdropStyle === 'dark_pill'
              ? 'bg-black/85 px-4 py-2 rounded-xl border border-white/10 shadow-lg'
              : 'px-3 py-1'
          }`}
        >
          {subtitleConfig.showEmoji && (
            <span className="text-xl mb-1 animate-bounce">🔥</span>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            {PREVIEW_SAMPLE_WORDS.slice(0, subtitleConfig.maxWordsPerLine || 3).map((w, idx) => {
              const isActive = idx === previewWordIndex % (subtitleConfig.maxWordsPerLine || 3);
              const customHighlight = subtitleConfig.highlightColor || '#FACC15';
              const displayText = subtitleConfig.uppercase ? w : w.toLowerCase();

              if (subtitleConfig.preset === 'hormozi') {
                return (
                  <span
                    key={idx}
                    className="font-black tracking-wide uppercase transition-all duration-150 select-none"
                    style={{
                      fontSize: `${subtitleConfig.fontSize}px`,
                      color: isActive ? customHighlight : '#FFFFFF',
                      WebkitTextStroke: '2.5px #000000',
                      textShadow: isActive
                        ? `0 0 20px ${customHighlight}99, 0 4px 10px rgba(0,0,0,1)`
                        : '0 3px 6px rgba(0,0,0,1)',
                      transform: isActive ? 'scale(1.15) translateY(-2px)' : 'scale(1)',
                    }}
                  >
                    {displayText}
                  </span>
                );
              }

              if (subtitleConfig.preset === 'beast_yellow') {
                return (
                  <span
                    key={idx}
                    className="font-black tracking-tight uppercase transition-all duration-150 select-none"
                    style={{
                      fontSize: `${subtitleConfig.fontSize}px`,
                      color: isActive ? customHighlight : '#FDE047',
                      WebkitTextStroke: '2px #09090b',
                      transform: isActive ? 'scale(1.18)' : 'scale(1)',
                    }}
                  >
                    {displayText}
                  </span>
                );
              }

              if (subtitleConfig.preset === 'ali_aesthetic') {
                return (
                  <span
                    key={idx}
                    className="font-semibold tracking-normal transition-all duration-150 select-none"
                    style={{
                      fontSize: `${subtitleConfig.fontSize}px`,
                      color: isActive ? customHighlight : '#E2E8F0',
                      textDecoration: isActive ? 'underline' : 'none',
                      textDecorationColor: customHighlight,
                      textUnderlineOffset: '4px',
                    }}
                  >
                    {displayText}
                  </span>
                );
              }

              if (subtitleConfig.preset === 'minimal_box') {
                return (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg font-bold transition-all select-none"
                    style={{
                      fontSize: `${subtitleConfig.fontSize * 0.9}px`,
                      backgroundColor: isActive ? customHighlight : 'rgba(0,0,0,0.6)',
                      color: isActive ? '#020617' : '#FFFFFF',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {displayText}
                  </span>
                );
              }

              return (
                <span
                  key={idx}
                  className="font-extrabold tracking-tight transition-all duration-100 select-none"
                  style={{
                    fontSize: `${subtitleConfig.fontSize}px`,
                    color: isActive ? customHighlight : '#FFFFFF',
                    WebkitTextStroke: '1px #000000',
                  }}
                >
                  {displayText}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Creator Typography &amp; Motion Presets
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PRESET_OPTIONS.map((p) => {
            const isSelected = subtitleConfig.preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() =>
                  setSubtitleConfig({
                    ...subtitleConfig,
                    preset: p.id,
                    highlightColor: p.defaultColor,
                  })
                }
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-400 text-blue-950 shadow-sm ring-2 ring-blue-200'
                    : 'glass-card text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{p.name}</span>
                    <span className="text-[10px] text-blue-700 font-medium">{p.creatorInspiration}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </div>

                <div className="my-2 py-1.5 px-2 rounded-lg bg-slate-950 text-center font-bold text-xs shadow-inner">
                  <span
                    style={{ color: p.defaultColor }}
                    className="tracking-wider uppercase"
                  >
                    POP SAMPLE WORD
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed mb-2">{p.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-400">Retention Score:</span>
                  <span className="font-semibold text-emerald-700">{p.retentionRating}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Creator Fine-Tuning Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-white/80 border border-slate-200/80 text-xs">
        {/* Control 1: Active Highlight Color Swatches */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              Active Word Highlight
            </span>
            <span
              className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
              style={{ backgroundColor: subtitleConfig.highlightColor }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PALETTES.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setSubtitleConfig({ ...subtitleConfig, highlightColor: c.hex })}
                className={`w-6 h-6 rounded-lg border transition-transform ${
                  subtitleConfig.highlightColor === c.hex
                    ? 'ring-2 ring-blue-500 scale-110 border-white'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Control 2: Retention Chunking (Max Words per Line) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Retention Chunking
            </span>
            <span className="font-mono text-blue-700 font-bold">
              {subtitleConfig.maxWordsPerLine || 3} words/burst
            </span>
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {[2, 3, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setSubtitleConfig({ ...subtitleConfig, maxWordsPerLine: cnt })}
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  (subtitleConfig.maxWordsPerLine || 3) === cnt
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cnt === 2 ? '2 (Hook)' : cnt === 3 ? '3 (Sweet)' : '5 (Story)'}
              </button>
            ))}
          </div>
        </div>

        {/* Control 3: Backdrop Style */}
        <div className="space-y-2">
          <span className="block text-slate-700 font-semibold">Backdrop Frame</span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            {[
              { id: 'glass_pod', label: 'Glass Pod' },
              { id: 'dark_pill', label: 'Dark Pill' },
              { id: 'shadow_only', label: 'Shadow Only' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  setSubtitleConfig({
                    ...subtitleConfig,
                    backdropStyle: b.id as any,
                  })
                }
                className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                  subtitleConfig.backdropStyle === b.id
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Controls: Font Size, Position, Emoji, Case */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/80 border border-slate-200/80 text-xs">
        {/* Font Size */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-slate-700 font-medium">
            <span>Font Size</span>
            <span className="font-mono text-blue-700 font-bold">{subtitleConfig.fontSize}px</span>
          </div>
          <input
            type="range"
            min={20}
            max={40}
            value={subtitleConfig.fontSize}
            onChange={(e) =>
              setSubtitleConfig({ ...subtitleConfig, fontSize: parseInt(e.target.value) })
            }
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Vertical Placement */}
        <div className="space-y-1.5">
          <span className="block text-slate-700 font-medium">Vertical Placement</span>
          <div className="flex items-center gap-1">
            {(['bottom', 'center', 'top'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setSubtitleConfig({ ...subtitleConfig, position: pos })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
                  subtitleConfig.position === pos
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {pos === 'bottom' ? 'Lower 1/3' : pos}
              </button>
            ))}
          </div>
        </div>

        {/* Uppercase Toggle */}
        <div className="space-y-1.5">
          <span className="block text-slate-700 font-medium">Text Case</span>
          <button
            type="button"
            onClick={() =>
              setSubtitleConfig({ ...subtitleConfig, uppercase: !subtitleConfig.uppercase })
            }
            className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold transition-all ${
              subtitleConfig.uppercase
                ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {subtitleConfig.uppercase ? 'UPPERCASE (Hormozi)' : 'Natural Case'}
          </button>
        </div>

        {/* Contextual Emojis Toggle */}
        <div className="space-y-1.5">
          <span className="block text-slate-700 font-medium">Viral Emojis</span>
          <button
            type="button"
            onClick={() =>
              setSubtitleConfig({ ...subtitleConfig, showEmoji: !subtitleConfig.showEmoji })
            }
            className={`w-full py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
              subtitleConfig.showEmoji
                ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-blue-600" />
              <span>Auto Emojis</span>
            </span>
            <span>{subtitleConfig.showEmoji ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
