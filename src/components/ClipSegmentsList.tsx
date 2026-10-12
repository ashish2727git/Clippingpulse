import React, { useState } from 'react';
import {
  Play,
  Scissors,
  Copy,
  Check,
  Download,
  Terminal,
  Clock,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { ClipSegment } from '../types';

interface ClipSegmentsListProps {
  clips: ClipSegment[];
  activeClip: ClipSegment | null;
  onSelectClip: (clip: ClipSegment) => void;
  overallThemes: string[];
  onSendToScriptLab: (clip: ClipSegment) => void;
  videoTitle: string;
}

export const ClipSegmentsList: React.FC<ClipSegmentsListProps> = ({
  clips,
  activeClip,
  onSelectClip,
  overallThemes,
  onSendToScriptLab,
  videoTitle,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeExportTab, setActiveExportTab] = useState<'cards' | 'edl' | 'ffmpeg'>('cards');

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const getFFmpegCommand = (clip: ClipSegment, index: number) => {
    const startStr = formatSeconds(clip.startTime).replace('.', ':');
    const endStr = formatSeconds(clip.endTime).replace('.', ':');
    const safeName = clip.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
    return `ffmpeg -ss 00:${startStr} -to 00:${endStr} -i "source_video.mp4" -c copy "${index + 1}_${safeName}.mp4"`;
  };

  const handleCopyFFmpeg = (clip: ClipSegment, index: number) => {
    const cmd = getFFmpegCommand(clip, index);
    navigator.clipboard.writeText(cmd);
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllFFmpeg = () => {
    const allCmds = clips.map((c, i) => getFFmpegCommand(c, i)).join('\n');
    navigator.clipboard.writeText(allCmds);
    setCopiedId('all-ffmpeg');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadEDL = () => {
    let edl = `TITLE: ${videoTitle || 'CLIPPERPULSE_EXPORT'}\nFCM: NON-DROP FRAME\n\n`;
    clips.forEach((clip, idx) => {
      const eventNum = (idx + 1).toString().padStart(3, '0');
      const startTc = `00:${formatSeconds(clip.startTime).replace('.', ':')}:00`;
      const endTc = `00:${formatSeconds(clip.endTime).replace('.', ':')}:00`;
      edl += `${eventNum}  AX       V     C        ${startTc} ${endTc} ${startTc} ${endTc}\n`;
      edl += `* FROM CLIP NAME: ${clip.title}\n`;
      edl += `* HOOK: ${clip.hookReason}\n\n`;
    });

    const blob = new Blob([edl], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clips_${Date.now()}.edl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    let csv = 'Clip Number,Title,Start Time,End Time,Duration (s),Virality Score,Soundbite,Tags\n';
    clips.forEach((c, i) => {
      csv += `"${i + 1}","${c.title}","${formatSeconds(c.startTime)}","${formatSeconds(c.endTime)}","${c.duration}","${c.viralityScore}%","${c.soundbiteQuote.replace(/"/g, '""')}","${c.tags.join(';')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `viral_clips_timestamps_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200/80 bg-white/85">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-blue-600" />
                AI Extracted Viral Cut Timestamps
              </h3>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {clips.length} Short Clips
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by 3-second hook retention and visual event spikes
            </p>
          </div>

          {/* Export View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveExportTab('cards')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeExportTab === 'cards'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clips
            </button>
            <button
              onClick={() => setActiveExportTab('ffmpeg')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeExportTab === 'ffmpeg'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FFmpeg Code
            </button>
            <button
              onClick={() => setActiveExportTab('edl')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeExportTab === 'edl'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Export EDL/CSV
            </button>
          </div>
        </div>

        {/* Overall Themes pills */}
        {overallThemes.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1.5 border-t border-slate-100">
            <span className="font-semibold text-slate-700">Trending Themes:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {overallThemes.map((theme, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-white text-slate-700 text-[11px] border border-slate-200 shadow-2xs font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cards View */}
      {activeExportTab === 'cards' && (
        <div className="p-4 space-y-3.5 max-h-[600px] overflow-y-auto bg-white/45">
          {clips.map((clip, idx) => {
            const isSelected = activeClip?.id === clip.id;
            return (
              <div
                key={clip.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-white border-blue-400 shadow-md ring-2 ring-blue-200/70'
                    : 'glass-card'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-mono font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {clip.title}
                      </h4>
                    </div>

                    {/* Timecode & Duration */}
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span className="tabular-time font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {formatSeconds(clip.startTime)} → {formatSeconds(clip.endTime)}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {clip.duration}s duration
                      </span>
                    </div>
                  </div>

                  {/* Virality Score Badge (Warm Amber/Yellow Glow) */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-300 self-start shadow-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">
                      {clip.viralityScore}% Viral Hook
                    </span>
                  </div>
                </div>

                {/* Hook Rationale & Soundbite */}
                <div className="space-y-2 my-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80">
                    <span className="font-bold text-slate-600 block mb-0.5 text-[11px] uppercase tracking-wide">
                      Retention Psychology:
                    </span>
                    <p className="text-slate-800 leading-relaxed">{clip.hookReason}</p>
                  </div>

                  {clip.soundbiteQuote && (
                    <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 font-medium">
                      <span className="font-bold text-blue-700 mr-1.5">&ldquo;Soundbite:&rdquo;</span>
                      {clip.soundbiteQuote}
                    </div>
                  )}

                  {clip.visualEventCues && (
                    <p className="text-[11px] text-slate-500">
                      <span className="font-semibold text-blue-700">Visual Spike: </span>
                      {clip.visualEventCues}
                    </p>
                  )}
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectClip(clip)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-blue-50 text-blue-700 border border-slate-200'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isSelected ? 'Playing Clip Range' : 'Preview Clip'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyFFmpeg(clip, idx)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      title="Copy FFmpeg slice command for this clip"
                    >
                      {copiedId === clip.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{copiedId === clip.id ? 'Copied' : 'FFmpeg'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSendToScriptLab(clip)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <span>Script this Clip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FFmpeg Commands Batch Tab */}
      {activeExportTab === 'ffmpeg' && (
        <div className="p-4 space-y-4 bg-white/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">
              Losslessly slice all {clips.length} subclips in seconds:
            </span>
            <button
              onClick={handleCopyAllFFmpeg}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              {copiedId === 'all-ffmpeg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'all-ffmpeg' ? 'Copied All!' : 'Copy Batch Commands'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
            {clips.map((c, i) => getFFmpegCommand(c, i)).join('\n\n')}
          </pre>
        </div>
      )}

      {/* EDL / CSV Export Tab */}
      {activeExportTab === 'edl' && (
        <div className="p-8 text-center space-y-4 bg-white/50">
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900">Direct NLE Timeline Export</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export edit decision markers to instantly cut these segments inside Premiere Pro, DaVinci Resolve, or Final Cut Pro without manual transcription scrubbing.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleDownloadEDL}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CMX 3600 EDL</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Marker Sheet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
