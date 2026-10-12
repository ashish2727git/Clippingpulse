import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Camera,
  Layers,
  RotateCcw,
  Check,
  SunMedium,
  Contrast,
  Palette,
  Thermometer,
} from 'lucide-react';
import { ColorCorrectionProfile, VideoFrameSnapshot, EngineType, LocalLLMConfig } from '../types';

interface ColorGradingLabProps {
  colorProfile: ColorCorrectionProfile;
  setColorProfile: React.Dispatch<React.SetStateAction<ColorCorrectionProfile>>;
  snapshots: VideoFrameSnapshot[];
  onTriggerFrameCapture: () => void;
  engine: EngineType;
  localConfig: LocalLLMConfig;
}

export const ColorGradingLab: React.FC<ColorGradingLabProps> = ({
  colorProfile,
  setColorProfile,
  snapshots,
  onTriggerFrameCapture,
  engine,
  localConfig,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState('cinematic');
  const [aiReport, setAiReport] = useState<string | null>(colorProfile.reason || null);

  const PRESETS: ColorCorrectionProfile[] = [
    {
      presetName: 'Warm Creator Glow',
      brightness: 6,
      contrast: 16,
      saturation: 18,
      temperature: 12,
      tint: -4,
      reason: 'Enhances warm facial skin tones and adds punchy contrast for mobile OLED viewing.',
      lutStyle: 'Warm 709 Creator',
    },
    {
      presetName: 'Moody Slate Film',
      brightness: -4,
      contrast: 22,
      saturation: 10,
      temperature: -8,
      tint: 2,
      reason: 'Deep cinematic contrast with desaturated shadows, popular for business and investigative video topics.',
      lutStyle: 'Noir Documentary',
    },
    {
      presetName: 'Vibrant Reels Pop',
      brightness: 10,
      contrast: 24,
      saturation: 28,
      temperature: 6,
      tint: -2,
      reason: 'High dynamic saturation and luminous midtones that catch attention immediately on social feeds.',
      lutStyle: 'Hyper Pop 2026',
    },
    {
      presetName: 'Cyberpunk Cool',
      brightness: 2,
      contrast: 20,
      saturation: 15,
      temperature: -18,
      tint: 8,
      reason: 'Cold electric shadows and punchy cyan accents for futuristic tech videos.',
      lutStyle: 'Neo Tokyo Blue',
    },
    {
      presetName: 'Clean Neutral Broadcast',
      brightness: 0,
      contrast: 5,
      saturation: 2,
      temperature: 0,
      tint: 0,
      reason: 'Faithful color reproduction with true-to-life studio lighting balance.',
      lutStyle: 'Neutral Rec.709',
    },
  ];

  const handleApplyPreset = (preset: ColorCorrectionProfile) => {
    setColorProfile(preset);
    if (preset.reason) setAiReport(preset.reason);
  };

  const handleReset = () => {
    setColorProfile({
      presetName: 'Clean Neutral Broadcast',
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      tint: 0,
      reason: 'Default camera color space',
    });
    setAiReport(null);
  };

  const handleAskAIColorCorrection = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/suggest-color-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshots: snapshots.map((s) => ({
            brightness: s.brightness || 50,
            contrast: s.contrast || 50,
            colorCast: s.colorCast || 'Neutral',
            timestamp: s.timestamp,
          })),
          vibe: selectedVibe,
          engine,
          localConfig,
        }),
      });

      const data = await res.json();
      if (data.recommendedProfile) {
        setColorProfile(data.recommendedProfile);
        setAiReport(data.recommendedProfile.reason || 'AI optimized frame color balance.');
      }
    } catch {
      // Apply Warm Creator Glow as smart fallback
      setColorProfile(PRESETS[0]);
      setAiReport('Applied Warm Creator Glow to boost dynamic contrast and natural skin tones.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getSnapshotFilter = () => {
    const b = 1 + colorProfile.brightness / 100;
    const c = 1 + colorProfile.contrast / 100;
    const s = 1 + colorProfile.saturation / 100;
    const hue = colorProfile.tint * 2;
    const sepia = colorProfile.temperature > 0 ? colorProfile.temperature / 120 : 0;
    return `brightness(${b}) contrast(${c}) saturate(${s}) hue-rotate(${hue}deg) sepia(${sepia})`;
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Multi-Frame Colorist &amp; Lighting Lab
              </h3>
              <p className="text-xs text-slate-500">
                Extracts screenshots across video timeline for histogram calibration &amp; LUT styling
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onTriggerFrameCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Retake Snapshots</span>
          </button>

          <button
            type="button"
            onClick={handleAskAIColorCorrection}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAnalyzing ? 'Analyzing Colors...' : 'AI Colorist Recommendation'}</span>
          </button>
        </div>
      </div>

      {/* Screenshot Frame Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Analyzed Frame Snapshots ({snapshots.length > 0 ? snapshots.length : 'Simulated Frames'})
          </h4>
          <span className="text-xs text-slate-500">Live color grade preview applied below</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {(snapshots.length > 0
            ? snapshots
            : [
                { id: '1', timestamp: 15, brightness: 52, contrast: 48, colorCast: 'Slightly Cool' },
                { id: '2', timestamp: 48, brightness: 58, contrast: 55, colorCast: 'Balanced' },
                { id: '3', timestamp: 95, brightness: 44, contrast: 51, colorCast: 'Warm Cast' },
                { id: '4', timestamp: 140, brightness: 60, contrast: 56, colorCast: 'Slightly Cool' },
              ]
          ).map((snap, i) => (
            <div
              key={snap.id || i}
              className="glass-card rounded-xl overflow-hidden group shadow-xs"
            >
              <div className="relative aspect-video bg-black/60 overflow-hidden">
                {('dataUrl' in snap && snap.dataUrl) ? (
                  <img
                    src={snap.dataUrl}
                    alt={`Frame at ${formatSeconds(snap.timestamp)}`}
                    className="w-full h-full object-cover transition-all duration-200"
                    style={{ filter: getSnapshotFilter() }}
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-tr from-slate-900 to-slate-800"
                    style={{ filter: getSnapshotFilter() }}
                  >
                    <Layers className="w-6 h-6 text-slate-500 mb-1" />
                    <span className="text-[11px] text-slate-300 font-mono">
                      Frame @ {formatSeconds(snap.timestamp)}
                    </span>
                  </div>
                )}

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-blue-300">
                  {formatSeconds(snap.timestamp)}
                </div>
              </div>

              <div className="p-3 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Luminance:</span>
                  <span className="font-mono text-slate-900 font-bold">{snap.brightness}%</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Color Balance:</span>
                  <span className="text-blue-700 font-semibold">{snap.colorCast}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Colorist Intelligence Report */}
      {aiReport && (
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Colorist Telemetry &amp; Rationale:</span>
          </div>
          <p className="leading-relaxed text-slate-700">{aiReport}</p>
        </div>
      )}

      {/* 1-Click Cinematic Presets */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          1-Click Cinematic LUT Presets
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = colorProfile.presetName === p.presetName;
            return (
              <button
                key={p.presetName}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-400 text-blue-950 shadow-xs ring-2 ring-blue-200'
                    : 'glass-card text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{p.presetName}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2">{p.reason}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Fine-Tuning Sliders */}
      <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-blue-600" />
            Manual Grading Adjustments
          </h4>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Default</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Brightness */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <SunMedium className="w-3.5 h-3.5 text-blue-600" /> Brightness
              </span>
              <span className="font-mono text-blue-700 font-bold">{colorProfile.brightness > 0 ? `+${colorProfile.brightness}` : colorProfile.brightness}%</span>
            </div>
            <input
              type="range"
              min={-35}
              max={35}
              value={colorProfile.brightness}
              onChange={(e) =>
                setColorProfile({
                  ...colorProfile,
                  brightness: parseInt(e.target.value),
                  presetName: 'Custom',
                })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <Contrast className="w-3.5 h-3.5 text-blue-600" /> Contrast
              </span>
              <span className="font-mono text-blue-700 font-bold">{colorProfile.contrast > 0 ? `+${colorProfile.contrast}` : colorProfile.contrast}%</span>
            </div>
            <input
              type="range"
              min={-35}
              max={35}
              value={colorProfile.contrast}
              onChange={(e) =>
                setColorProfile({
                  ...colorProfile,
                  contrast: parseInt(e.target.value),
                  presetName: 'Custom',
                })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-blue-600" /> Saturation
              </span>
              <span className="font-mono text-blue-700 font-bold">{colorProfile.saturation > 0 ? `+${colorProfile.saturation}` : colorProfile.saturation}%</span>
            </div>
            <input
              type="range"
              min={-35}
              max={45}
              value={colorProfile.saturation}
              onChange={(e) =>
                setColorProfile({
                  ...colorProfile,
                  saturation: parseInt(e.target.value),
                  presetName: 'Custom',
                })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Temperature (Cool / Warm) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-600" /> Temp (Warm/Cool)
              </span>
              <span className="font-mono text-blue-700 font-bold">{colorProfile.temperature > 0 ? `+${colorProfile.temperature}` : colorProfile.temperature}</span>
            </div>
            <input
              type="range"
              min={-30}
              max={30}
              value={colorProfile.temperature}
              onChange={(e) =>
                setColorProfile({
                  ...colorProfile,
                  temperature: parseInt(e.target.value),
                  presetName: 'Custom',
                })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
