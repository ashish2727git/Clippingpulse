import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Camera,
  Layers,
  Smartphone,
  Monitor,
  Repeat,
  Sparkles,
} from 'lucide-react';
import {
  ColorCorrectionProfile,
  SubtitleConfig,
  TranscriptSegment,
  ClipSegment,
  VideoFrameSnapshot,
} from '../types';

interface VideoPlayerProps {
  videoUrl: string;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  activeClip: ClipSegment | null;
  segments: TranscriptSegment[];
  colorProfile: ColorCorrectionProfile;
  subtitleConfig: SubtitleConfig;
  onSnapshotsExtracted: (snapshots: VideoFrameSnapshot[]) => void;
  onSeek: (time: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  currentTime,
  onTimeUpdate,
  duration,
  onDurationChange,
  activeClip,
  segments,
  colorProfile,
  subtitleConfig,
  onSnapshotsExtracted,
  onSeek,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isVerticalCrop, setIsVerticalCrop] = useState(false);
  const [showColorGrading, setShowColorGrading] = useState(true);
  const [isLoopingClip, setIsLoopingClip] = useState(false);
  const [isCapturingFrames, setIsCapturingFrames] = useState(false);

  // Sync video time updates
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    onTimeUpdate(time);

    // Loop active clip if enabled
    if (isLoopingClip && activeClip) {
      if (time >= activeClip.endTime || time < activeClip.startTime) {
        videoRef.current.currentTime = activeClip.startTime;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onDurationChange(videoRef.current.duration || 180);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    onSeek(newTime);
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    handleSeek(target);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleVolumeToggle = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Convert ColorProfile to CSS filter
  const getFilterStyle = (): string => {
    if (!showColorGrading) return 'none';
    const b = 100 + colorProfile.brightness; // %
    const c = 100 + colorProfile.contrast; // %
    const s = 100 + colorProfile.saturation; // %
    const h = colorProfile.temperature * 0.4; // deg hue-rotate
    return `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg)`;
  };

  // Extract Keyframe screenshots across the video
  const handleExtractScreenshots = async () => {
    if (!videoRef.current || duration <= 0) return;
    setIsCapturingFrames(true);

    const video = videoRef.current;
    const originalTime = video.currentTime;
    const wasPlaying = !video.paused;
    video.pause();

    const samplePercentages = [0.12, 0.35, 0.62, 0.88];
    const extracted: VideoFrameSnapshot[] = [];

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < samplePercentages.length; i++) {
      const targetTime = duration * samplePercentages[i];
      video.currentTime = targetTime;

      // Wait for seeked event
      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked);
          resolve();
        };
        video.addEventListener('seeked', onSeeked);
      });

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Simple pixel analysis for brightness & contrast
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let totalBrightness = 0;
        let rSum = 0, gSum = 0, bSum = 0;
        for (let p = 0; p < data.length; p += 16) {
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
          rSum += r;
          gSum += g;
          bSum += b;
        }
        const sampleCount = data.length / 16;
        const avgBrightness = Math.round((totalBrightness / sampleCount / 255) * 100);

        let colorCast = 'Balanced';
        if (rSum > gSum * 1.15 && rSum > bSum * 1.15) colorCast = 'Warm (Red Shift)';
        else if (bSum > rSum * 1.15) colorCast = 'Cool (Blue Shift)';
        else if (gSum > rSum * 1.15 && gSum > bSum * 1.15) colorCast = 'Tinted (Green)';

        extracted.push({
          id: `frame-${i + 1}`,
          timestamp: targetTime,
          dataUrl,
          brightness: avgBrightness,
          contrast: Math.round(50 + (avgBrightness - 50) * 0.4),
          colorCast,
        });
      }
    }

    // Restore video state
    video.currentTime = originalTime;
    if (wasPlaying) video.play();

    setIsCapturingFrames(false);
    onSnapshotsExtracted(extracted);
  };

  // Find current active transcript segment
  const currentSegment = segments.find(
    (seg) => currentTime >= seg.start && currentTime <= seg.end
  );

  // Power keywords that trigger enhanced visual emphasis in short-form content
  const POWER_WORDS = new Set([
    'truth', 'secret', 'shattered', 'monopoly', 'million', 'billion', 'dollar', 'dollars',
    'free', 'einstein', 'mistake', 'warning', 'catch', 'never', 'always', 'silicon',
    'ai', 'model', 'revolution', 'crazy', 'huge', 'stop', 'danger', 'rule', 'winners',
    'trillions', 'lost', 'cash', 'trap', 'god', 'first', 'second', 'third'
  ]);

  // Contextual emoji detector
  const getContextEmoji = (phrase: string): string => {
    const lower = phrase.toLowerCase();
    if (lower.includes('silicon') || lower.includes('ai') || lower.includes('model') || lower.includes('code')) return '🤖';
    if (lower.includes('shattered') || lower.includes('destroy') || lower.includes('monopoly')) return '💥';
    if (lower.includes('money') || lower.includes('billion') || lower.includes('dollar') || lower.includes('invest') || lower.includes('cash')) return '💰';
    if (lower.includes('truth') || lower.includes('secret') || lower.includes('hide')) return '🤫';
    if (lower.includes('warning') || lower.includes('mistake') || lower.includes('catch') || lower.includes('trap')) return '⚠️';
    if (lower.includes('fast') || lower.includes('revolution') || lower.includes('instant') || lower.includes('speed')) return '🚀';
    if (lower.includes('einstein') || lower.includes('brain') || lower.includes('logic')) return '🧠';
    if (lower.includes('winner') || lower.includes('rule') || lower.includes('trophy')) return '🏆';
    return '🔥';
  };

  // Modern Short-Form Subtitle Engine (Alex Hormozi / MrBeast / Ali Abdaal / Reel Retention Logic)
  const getRenderedSubtitle = () => {
    if (!currentSegment) return null;

    const fullText = currentSegment.text.trim();
    const rawWords = fullText.split(/\s+/);
    if (rawWords.length === 0) return null;

    const segDuration = Math.max(0.1, currentSegment.end - currentSegment.start);
    const progress = Math.min(1, Math.max(0, (currentTime - currentSegment.start) / segDuration));
    const activeWordIndex = Math.min(rawWords.length - 1, Math.floor(progress * rawWords.length));

    // Dynamic Creator Chunking: Alex Hormozi & Opus Clip chunk lines into 2-4 words
    // to prevent cognitive viewer overload and keep retention graphs high.
    const chunkSize = Math.max(1, subtitleConfig.maxWordsPerLine || 3);
    const chunkStart = Math.floor(activeWordIndex / chunkSize) * chunkSize;
    const chunkWords = rawWords.slice(chunkStart, chunkStart + chunkSize);

    const chunkPhrase = chunkWords.join(' ');
    const activeWordInChunk = activeWordIndex - chunkStart;
    const contextualEmoji = getContextEmoji(chunkPhrase);

    // Backdrop styling wrapper
    const getBackdropClass = () => {
      switch (subtitleConfig.backdropStyle) {
        case 'glass_pod':
          return 'bg-black/65 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.8)]';
        case 'dark_pill':
          return 'bg-black/85 px-4 py-2 rounded-xl border border-white/10 shadow-xl';
        case 'shadow_only':
        default:
          return 'px-3 py-1';
      }
    };

    return (
      <div className={`inline-flex flex-col items-center justify-center transition-all ${getBackdropClass()}`}>
        {/* Optional floating contextual emoji badge */}
        {subtitleConfig.showEmoji && (
          <span className="text-xl mb-1 animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] select-none">
            {contextualEmoji}
          </span>
        )}

        {/* Word-level synchronized text */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          {chunkWords.map((rawWord, idx) => {
            const cleanWord = rawWord.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const isPowerWord = subtitleConfig.powerWordHighlight && POWER_WORDS.has(cleanWord);
            const isActive = idx === activeWordInChunk;
            const isPassed = idx < activeWordInChunk;

            const displayText = subtitleConfig.uppercase ? rawWord.toUpperCase() : rawWord;
            const customHighlight = subtitleConfig.highlightColor || '#FACC15';

            // 1. Hormozi Viral Pop
            if (subtitleConfig.preset === 'hormozi') {
              return (
                <span
                  key={idx}
                  className={`font-black tracking-wide uppercase transition-all duration-100 select-none ${
                    isActive
                      ? 'scale-115 z-10'
                      : isPassed
                      ? 'text-white'
                      : 'text-white/80'
                  }`}
                  style={{
                    fontSize: `${subtitleConfig.fontSize}px`,
                    color: isActive ? customHighlight : isPowerWord ? '#FDE047' : '#FFFFFF',
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

            // 2. MrBeast Energy
            if (subtitleConfig.preset === 'beast_yellow') {
              return (
                <span
                  key={idx}
                  className={`font-black tracking-tight uppercase transition-all duration-100 select-none ${
                    isActive ? 'scale-120 z-10' : 'text-amber-300'
                  }`}
                  style={{
                    fontSize: `${subtitleConfig.fontSize}px`,
                    color: isActive ? customHighlight : '#FDE047',
                    WebkitTextStroke: '2px #09090b',
                    textShadow: isActive
                      ? `0 0 16px ${customHighlight}, 0 4px 8px rgba(0,0,0,1)`
                      : '0 3px 6px rgba(0,0,0,1)',
                    transform: isActive ? 'scale(1.18)' : 'scale(1)',
                  }}
                >
                  {displayText}
                </span>
              );
            }

            // 3. Ali Abdaal Clean Aesthetic
            if (subtitleConfig.preset === 'ali_aesthetic') {
              return (
                <span
                  key={idx}
                  className={`font-semibold tracking-normal transition-all duration-150 select-none ${
                    isActive
                      ? 'scale-105 font-bold'
                      : isPassed
                      ? 'text-slate-200'
                      : 'text-slate-400'
                  }`}
                  style={{
                    fontSize: `${subtitleConfig.fontSize}px`,
                    color: isActive ? customHighlight : undefined,
                    textShadow: isActive
                      ? `0 0 14px ${customHighlight}88, 0 2px 4px rgba(0,0,0,0.8)`
                      : '0 2px 4px rgba(0,0,0,0.8)',
                    textDecoration: isActive ? 'underline' : 'none',
                    textDecorationColor: customHighlight,
                    textUnderlineOffset: '4px',
                  }}
                >
                  {displayText}
                </span>
              );
            }

            // 4. High-Contrast Word Box
            if (subtitleConfig.preset === 'minimal_box') {
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all select-none ${
                    isActive
                      ? 'text-slate-950 font-black scale-110 shadow-lg'
                      : 'bg-black/60 text-white'
                  }`}
                  style={{
                    fontSize: `${subtitleConfig.fontSize * 0.9}px`,
                    backgroundColor: isActive ? customHighlight : undefined,
                  }}
                >
                  {displayText}
                </span>
              );
            }

            // 5. Cinema Documentary
            if (subtitleConfig.preset === 'documentary') {
              return (
                <span
                  key={idx}
                  className={`font-medium tracking-wider transition-all duration-150 select-none ${
                    isActive
                      ? 'text-amber-300 font-bold scale-105'
                      : 'text-slate-200/90'
                  }`}
                  style={{
                    fontSize: `${subtitleConfig.fontSize * 0.95}px`,
                    color: isActive ? customHighlight : undefined,
                    textShadow: '0 2px 6px rgba(0,0,0,0.95)',
                  }}
                >
                  {displayText}
                </span>
              );
            }

            // 6. Default: TikTok Minimalist
            return (
              <span
                key={idx}
                className={`font-extrabold tracking-tight transition-all duration-100 select-none ${
                  isActive ? 'scale-110 z-10' : 'text-white'
                }`}
                style={{
                  fontSize: `${subtitleConfig.fontSize}px`,
                  color: isActive ? customHighlight : '#FFFFFF',
                  WebkitTextStroke: '1px #000000',
                  textShadow: isActive
                    ? `0 0 12px ${customHighlight}bb, 0 3px 6px rgba(0,0,0,1)`
                    : '0 2px 6px rgba(0,0,0,0.9)',
                }}
              >
                {displayText}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div
      ref={containerRef}
      className="glass-panel rounded-2xl overflow-hidden shadow-xl flex flex-col"
    >
      {/* Top Player Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/85 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900">Preview Monitor</span>
          {activeClip && (
            <span className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80 font-medium">
              Clip: {activeClip.title} ({formatTime(activeClip.startTime)} - {formatTime(activeClip.endTime)})
            </span>
          )}
        </div>

        {/* Viewport & Grading Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsVerticalCrop(!isVerticalCrop)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              isVerticalCrop
                ? 'bg-blue-600 text-white border-transparent shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:text-blue-700 hover:bg-slate-50'
            }`}
            title="Toggle 9:16 Vertical Short-Form Crop simulator"
          >
            {isVerticalCrop ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isVerticalCrop ? '9:16 Shorts' : '16:9 Master'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowColorGrading(!showColorGrading)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
              showColorGrading
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle Color Correction LUT preview on/off"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{showColorGrading ? colorProfile.presetName : 'Rec.709 Raw'}</span>
          </button>

          <button
            type="button"
            onClick={handleExtractScreenshots}
            disabled={isCapturingFrames}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 transition-colors disabled:opacity-50 font-semibold"
            title="Capture multi-frame video screenshots for Color Grading Lab"
          >
            <Camera className={`w-3.5 h-3.5 text-blue-600 ${isCapturingFrames ? 'animate-spin' : ''}`} />
            <span>{isCapturingFrames ? 'Snapping...' : 'Snapshot Frames'}</span>
          </button>
        </div>
      </div>

      {/* Video Viewport Area */}
      <div className="relative bg-black flex items-center justify-center min-h-[380px] max-h-[520px] overflow-hidden select-none">
        {/* Aspect Ratio Sizing Wrapper */}
        <div
          className={`relative transition-all duration-300 flex items-center justify-center overflow-hidden ${
            isVerticalCrop
              ? 'w-[290px] h-[516px] rounded-2xl shadow-2xl ring-2 ring-slate-700'
              : 'w-full h-full aspect-video'
          }`}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className={`w-full h-full object-cover transition-all ${
              isVerticalCrop ? 'scale-130' : ''
            }`}
            style={{ filter: getFilterStyle() }}
            playsInline
            crossOrigin="anonymous"
          />

          {/* Vertical Shorts Guidelines Overlay when in crop mode */}
          {isVerticalCrop && (
            <div className="absolute inset-0 pointer-events-none border border-amber-400/30 rounded-2xl">
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-[10px] text-amber-300 font-mono">
                TikTok 9:16
              </div>
            </div>
          )}

          {/* Subtitle On-Screen Overlay */}
          {currentSegment && (
            <div
              className={`absolute inset-x-0 pointer-events-none z-10 flex justify-center ${
                subtitleConfig.position === 'top'
                  ? 'top-8'
                  : subtitleConfig.position === 'center'
                  ? 'top-1/2 -translate-y-1/2'
                  : 'bottom-12'
              }`}
            >
              <div className="max-w-[90%]">{getRenderedSubtitle()}</div>
            </div>
          )}

          {/* Big Center Play Icon overlay if paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:bg-black/80 transition-all z-20"
            >
              <Play className="w-8 h-8 ml-1 text-amber-400 fill-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Timeline Scrubber & Clip In/Out Markers */}
      <div className="px-4 pt-3 pb-2.5 bg-white/95 border-t border-slate-200/80">
        {/* Scrubber Track */}
        <div className="relative w-full h-6 flex items-center group cursor-pointer">
          {/* Base Background Track */}
          <div className="absolute inset-x-0 h-2 bg-slate-200/80 rounded-full overflow-hidden">
            {/* Played progress */}
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
              style={{ width: `${(currentTime / Math.max(1, duration)) * 100}%` }}
            />
          </div>

          {/* Active Clip Range Highlight */}
          {activeClip && (
            <div
              className="absolute h-2.5 bg-blue-400/35 border-x-2 border-blue-600 rounded-xs pointer-events-none z-10"
              style={{
                left: `${(activeClip.startTime / Math.max(1, duration)) * 100}%`,
                width: `${((activeClip.endTime - activeClip.startTime) / Math.max(1, duration)) * 100}%`,
              }}
              title={`Clip Range: ${formatTime(activeClip.startTime)} - ${formatTime(activeClip.endTime)}`}
            />
          )}

          {/* Invisible interactive input range */}
          <input
            type="range"
            min={0}
            max={duration || 180}
            step={0.1}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* Draggable Playhead Pin */}
          <div
            className="absolute w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full shadow-md -ml-1.5 pointer-events-none z-30 transition-transform group-hover:scale-125"
            style={{ left: `${(currentTime / Math.max(1, duration)) * 100}%` }}
          />
        </div>

        {/* Player Transport Controls */}
        <div className="flex items-center justify-between mt-1 text-slate-700">
          {/* Left: Play/Pause, Skips, Timecode */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all shadow-xs"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => handleSkip(-5)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Skip back 5s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="tabular-time text-xs font-mono font-medium text-slate-900">
              <span className="text-blue-700 font-bold">{formatTime(currentTime)}</span>
              <span className="text-slate-400 mx-1.5">/</span>
              <span className="text-slate-600">{formatTime(duration)}</span>
            </div>

            {/* Loop Clip Button */}
            {activeClip && (
              <button
                onClick={() => setIsLoopingClip(!isLoopingClip)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium border transition-colors ${
                  isLoopingClip
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                title="Loop current viral clip segment"
              >
                <Repeat className="w-3 h-3 text-blue-600" />
                <span>Loop Clip</span>
              </button>
            )}
          </div>

          {/* Right: Volume, Playback Speed */}
          <div className="flex items-center gap-3">
            {/* Playback speed selector */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs shadow-xs">
              {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    playbackRate === speed
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Volume toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleVolumeToggle}
                className="p-1 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-blue-600" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    if (val > 0) setIsMuted(false);
                  }
                }}
                className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
