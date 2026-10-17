import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Clapperboard,
  Video,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Layers,
  Copy,
  Check,
  Download,
  ArrowRight,
  Maximize2,
  Sliders,
  Volume2,
  VolumeX,
  Zap,
  Film,
} from 'lucide-react';
import { TextToVideoStoryboard, TextToVideoScene, VideoProject } from '../types';

interface TextToVideoQuestLabProps {
  onLoadVideoIntoProject: (storyboard: TextToVideoStoryboard, canvasVideoUrl: string) => void;
}

const VIDEO_PROMPT_PRESETS = [
  {
    title: 'Quantum Supercomputer Boot',
    prompt: 'Cryogenic quantum computing processor glowing with intense cerulean light inside a vacuum chamber, floating microscopic helium vapor, cinematic anamorphic lens flare, 8k raw footage',
    style: 'Cinematic Photorealistic',
    cameraMotion: 'Dramatic Push-In',
  },
  {
    title: 'Cellular Nanobot DNA Repair',
    prompt: 'Medical nanobots navigating human capillary blood vessel, docking onto double-helix DNA strand to repair nucleotide sequence, glowing luminous therapeutic payloads, electron microscopy 8k',
    style: 'Macro Scientific 8K',
    cameraMotion: 'Slow-Mo Dolly Zoom',
  },
  {
    title: 'Neo-Tokyo Cyberpunk Rain',
    prompt: 'Slick rainy asphalt streets of futuristic cyberpunk city reflecting glowing sapphire and amber neon signs, flying vehicle headlights cutting through volumetric mist, 60fps cinematic 35mm film',
    style: 'Cyberpunk 3D CGI',
    cameraMotion: 'Dynamic Handheld POV',
  },
  {
    title: 'Stellar Nebula Hyperjump',
    prompt: 'Exploration spaceship accelerating through a violent cosmic nebula, volumetric light beams slicing through stellar dust clouds, epic planetary rings in deep background, ultra-wide angle',
    style: 'Cinematic Photorealistic',
    cameraMotion: '360 Orbital Tracking',
  },
];

const STYLE_OPTIONS = [
  'Cinematic Photorealistic',
  'Macro Scientific 8K',
  'Cyberpunk 3D CGI',
  'Anime Cel-Shaded',
  'Vintage 35mm Analog',
];

const CAMERA_OPTIONS = [
  'Dramatic Push-In',
  '360 Orbital Tracking',
  'Slow-Mo Dolly Zoom',
  'Sweeping Crane Pullback',
  'Dynamic Handheld POV',
];

export const TextToVideoQuestLab: React.FC<TextToVideoQuestLabProps> = ({
  onLoadVideoIntoProject,
}) => {
  // Input State
  const [prompt, setPrompt] = useState(
    'Cryogenic quantum computing processor glowing with intense cerulean light inside a vacuum chamber, floating microscopic helium vapor, cinematic anamorphic lens flare'
  );
  const [style, setStyle] = useState('Cinematic Photorealistic');
  const [cameraMotion, setCameraMotion] = useState('Dramatic Push-In');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [duration, setDuration] = useState<number>(15);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboard, setStoryboard] = useState<TextToVideoStoryboard | null>(null);
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);

  // Video Canvas Player State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [importedToStudio, setImportedToStudio] = useState(false);

  // Auto-generate default storyboard on mount
  useEffect(() => {
    handleGenerateStoryboard();
  }, []);

  const handleGenerateStoryboard = async (customPrompt?: string) => {
    setIsGenerating(true);
    setImportedToStudio(false);
    try {
      const res = await fetch('/api/video/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt || prompt,
          style,
          aspectRatio,
          cameraMotion,
          duration,
        }),
      });
      const data = await res.json();
      setStoryboard(data);
      setCurrentTime(0);
      setIsPlaying(true);
    } catch (e) {
      console.warn('Failed to generate video storyboard', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Canvas Video Simulation Engine (60fps procedural generation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    let lastRenderTime = performance.now();

    // Particle field state
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      alpha: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? '#38bdf8' : '#fbbf24',
    }));

    const render = (now: number) => {
      const dt = (now - lastRenderTime) / 1000;
      lastRenderTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt * playbackSpeed;
          return next >= duration ? 0 : next;
        });
      }

      // Determine active scene based on time
      const sceneFraction = currentTime / duration;
      const sceneIdx = Math.min(
        Math.floor(sceneFraction * (storyboard?.scenes?.length || 3)),
        (storyboard?.scenes?.length || 3) - 1
      );
      setCurrentSceneIndex(sceneIdx);

      const width = canvas.width;
      const height = canvas.height;

      // Clear & Background Gradient
      ctx.clearRect(0, 0, width, height);

      // Dynamic color theme based on style and scene
      let primaryColor = '#0f172a';
      let secondaryColor = '#1e3a8a';
      let accentColor = '#38bdf8';

      if (style.includes('Cyberpunk')) {
        primaryColor = '#050515';
        secondaryColor = '#1e1b4b';
        accentColor = '#f43f5e';
      } else if (style.includes('Scientific')) {
        primaryColor = '#021024';
        secondaryColor = '#052c54';
        accentColor = '#10b981';
      }

      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, primaryColor);
      grad.addColorStop(0.5, secondaryColor);
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Camera Motion Simulation (Zoom & Pan)
      ctx.save();
      const zoom = 1 + Math.sin((currentTime / duration) * Math.PI) * 0.12;
      const panX = Math.cos(currentTime * 0.5) * 15;
      const panY = Math.sin(currentTime * 0.5) * 10;
      ctx.translate(width / 2 + panX, height / 2 + panY);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Volumetric Light Ray Sweep
      const sweepX = (Math.sin(currentTime * 0.8) * 0.5 + 0.5) * width;
      const rayGrad = ctx.createRadialGradient(sweepX, height * 0.3, 10, sweepX, height * 0.3, width * 0.8);
      rayGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      rayGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)');
      rayGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, width, height);

      // Animated Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.globalAlpha = 1.0;

      // Central Geometric AI Focus Ring
      ctx.beginPath();
      const ringRadius = 70 + Math.sin(currentTime * 2) * 8;
      ctx.arc(width / 2, height / 2, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([12, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner Core Glow
      const coreGrad = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, 60);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      coreGrad.addColorStop(0.4, accentColor);
      coreGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Cinematic Letterbox Overlay (if landscape or 9:16 styling)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, 40);
      ctx.fillRect(0, height - 55, width, 55);

      // Live Timecode & AI Engine Watermark
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      const tc = `REC 00:${Math.floor(currentTime).toString().padStart(2, '0')}:${Math.floor(
        (currentTime % 1) * 30
      ).toString().padStart(2, '0')} FPS:60`;
      ctx.fillText(tc, 16, 26);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('CLIPPERPULSE // NEURAL SYNTH V3', width - 190, 26);

      // On-Screen Subtitle / Hook Text from active scene
      if (storyboard?.scenes && storyboard.scenes[sceneIdx]) {
        const activeScene = storyboard.scenes[sceneIdx];
        const overlayText = activeScene.screenOverlayText || activeScene.voiceoverScript.slice(0, 30);

        ctx.textAlign = 'center';
        ctx.font = '900 18px "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fillText(overlayText, width / 2, height - 24);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'left';
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, duration, storyboard, style, playbackSpeed, currentTime]);

  // Copy scene prompt to clipboard
  const handleCopyPrompt = (scene: TextToVideoScene) => {
    navigator.clipboard.writeText(scene.aiVideoPrompt);
    setCopiedSceneId(scene.sceneId);
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  // Download still frame snapshot from canvas
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `neural-video-frame-${Math.floor(currentTime)}s.png`;
    a.click();
  };

  // Send to Studio Clipper Timeline
  const handleExportToStudio = () => {
    if (!storyboard) return;
    const canvas = canvasRef.current;
    const canvasDataUrl = canvas ? canvas.toDataURL('image/png') : '';
    onLoadVideoIntoProject(storyboard, canvasDataUrl);
    setImportedToStudio(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Header: Text-to-Video Engine */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-indigo-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Video className="w-3.5 h-3.5 text-indigo-400" />
                Text-To-Video Synthesis Matrix
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                SIDE QUEST 02
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Text-to-Video Storyboard &amp; Scene Synthesis Lab
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Transform any creative brief, script, or scientific prompt into a cinematic 3-scene
              storyboard with optimized AI video prompts (Runway Gen-3, Sora, Kling, Luma) and an
              interactive 60fps canvas generative preview player.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleGenerateStoryboard()}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Storyboard...' : 'Generate AI Video Scenes'}</span>
            </button>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2">Cinematic Presets:</span>
          {VIDEO_PROMPT_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p.prompt);
                setStyle(p.style);
                setCameraMotion(p.cameraMotion);
                handleGenerateStoryboard(p.prompt);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-all"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid: Video Player + Director Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Generative Video Player (5 cols) */}
        <div className="lg:col-span-5 bg-white/95 rounded-2xl border border-slate-200/80 shadow-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Generative Canvas Preview
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    60 FPS Dynamic Neural Simulation &bull; {aspectRatio}
                  </p>
                </div>
              </div>

              {/* Aspect Ratio Switcher */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
                {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2 py-1 rounded-md font-medium transition-all ${
                      aspectRatio === ratio
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Video Viewport */}
            <div className="mt-4 flex justify-center">
              <div
                className={`relative rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 flex items-center justify-center ${
                  aspectRatio === '9:16'
                    ? 'w-[260px] h-[460px]'
                    : aspectRatio === '16:9'
                    ? 'w-full h-[260px]'
                    : 'w-[320px] h-[320px]'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  width={aspectRatio === '9:16' ? 360 : aspectRatio === '16:9' ? 640 : 400}
                  height={aspectRatio === '9:16' ? 640 : aspectRatio === '16:9' ? 360 : 400}
                  className="w-full h-full object-cover"
                />

                {/* Floating Scene Badge */}
                {storyboard?.scenes && storyboard.scenes[currentSceneIndex] && (
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-white border border-slate-700">
                    Scene {currentSceneIndex + 1}: {storyboard.scenes[currentSceneIndex].sceneType}
                  </div>
                )}
              </div>
            </div>

            {/* Scrubber & Timeline Bar */}
            <div className="mt-4 space-y-2">
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>00:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
                <span className="font-sans text-indigo-600 font-semibold">
                  Scene {currentSceneIndex + 1} of {storyboard?.scenes?.length || 3}
                </span>
                <span>00:{duration.toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center cursor-pointer shadow-sm"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                  title="Rewind to start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Speed Selector */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[10px]">
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPlaybackSpeed(s)}
                      className={`px-1.5 py-0.5 rounded font-medium ${
                        playbackSpeed === s ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Capture Frame Snapshot */}
                <button
                  onClick={handleCaptureSnapshot}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  title="Capture Frame"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Snapshot</span>
                </button>
              </div>
            </div>
          </div>

          {/* Export to Studio Timeline Action */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={handleExportToStudio}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                importedToStudio
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30'
              }`}
            >
              {importedToStudio ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Imported to Studio Timeline &amp; Subtitle Lab!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Open Video in Studio Clipper &amp; Subtitles</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Director Prompt Studio & Storyboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Creative Director Input Card */}
          <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Text-to-Video Direction Console
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Configure camera parameters, visual style, and duration
                  </p>
                </div>
              </div>
            </div>

            {/* Prompt Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Visual Concept / Prompt Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe your scene in vivid cinematic detail..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Direction Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Visual Style
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Camera Motion
                </label>
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  {CAMERA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Video Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value={5}>5 Seconds (Micro-Hook)</option>
                  <option value={10}>10 Seconds (Standard)</option>
                  <option value={15}>15 Seconds (Story Arc)</option>
                  <option value={30}>30 Seconds (Extended Reel)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generated Multi-Scene Storyboard */}
          {storyboard && (
            <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Production AI Storyboard &bull; {storyboard.videoTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    {storyboard.logline}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                  {storyboard.estimatedPacing}
                </span>
              </div>

              {/* Scenes List */}
              <div className="space-y-3">
                {storyboard.scenes.map((scene, idx) => (
                  <div
                    key={scene.sceneId}
                    className={`p-4 rounded-xl border transition-all ${
                      currentSceneIndex === idx
                        ? 'bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-200'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{scene.sceneType}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {scene.timestamp}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyPrompt(scene)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
                      >
                        {copiedSceneId === scene.sceneId ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 mb-2.5 font-medium leading-relaxed">
                      {scene.visualDescription}
                    </p>

                    {/* AI Prompt Box */}
                    <div className="p-2.5 rounded-lg bg-slate-950 text-slate-200 text-[11px] font-mono leading-relaxed space-y-1">
                      <div className="text-indigo-400 font-bold text-[10px] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Prompt (Runway Gen-3 / Sora / Kling / Luma):
                      </div>
                      <p className="text-slate-300">{scene.aiVideoPrompt}</p>
                    </div>

                    {/* Scene Metadata Bar */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500 font-medium">
                      <span>Camera: <strong className="text-slate-700">{scene.cameraMotion}</strong></span>
                      <span>Text Overlay: <strong className="text-indigo-700">&ldquo;{scene.screenOverlayText}&rdquo;</strong></span>
                      <span>Grade: <strong className="text-slate-700">{scene.colorGradePalette}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
