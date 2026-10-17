import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Send,
  FileText,
  Clapperboard,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Gamepad2,
  DollarSign,
  Tv,
  Flame,
  Atom,
  GraduationCap,
  History,
  HeartPulse,
  Globe2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { Sector, SocialPost } from '../types';

interface CrossSectorIdeaScannerProps {
  onSendToNotepad?: (text: string, title?: string, sector?: Sector) => void;
  onSendToScriptLab?: (topic: string, sector?: Sector) => void;
  onVerifySource?: (post: SocialPost) => void;
}

export const CrossSectorIdeaScanner: React.FC<CrossSectorIdeaScannerProps> = ({
  onSendToNotepad,
  onSendToScriptLab,
  onVerifySource,
}) => {
  const [keyword, setKeyword] = useState('Local AI and next-gen gaming engines');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([
    'tech',
    'gaming',
    'finance',
    'popculture',
    'viral',
    'science',
  ]);
  const [results, setResults] = useState<{
    query: string;
    totalMatchedPosts: number;
    sectorMatches: Record<string, any[]>;
    aiSynthesis: {
      crossSectorExecutiveSummary: string;
      sectorHighlights: Array<{
        sector: string;
        sectorLabel: string;
        angleSummary: string;
        viralHeadline: string;
        whyItMatters: string;
      }>;
      creatorHooks: string[];
      recommendedFormat: string;
      nextStepAction: string;
    };
  } | null>(null);

  const [activeFilterSector, setActiveFilterSector] = useState<'all' | Sector>('all');
  const [copiedHookIndex, setCopiedHookIndex] = useState<number | null>(null);

  const presetTopics = [
    { label: '🚗 Tesla Roadster Flying Car', query: 'Tesla Roadster flying car SpaceX cold gas thrusters hover' },
    { label: '🚀 Local AI & Quantization', query: 'Local AI models quantized benchmarks consumer hardware' },
    { label: '🎮 Unreal Engine 5.6 & Gaming', query: 'Unreal Engine Nanite cloth physics frame generation' },
    { label: '📈 Macro Rates & Tech Stocks', query: 'Federal Reserve interest rates tech valuations liquidity' },
    { label: '🧬 Longevity & Bio-Hacking', query: 'Cellular longevity NAD biomarkers health span' },
    { label: '🎬 Viral Retention Subtitle Styles', query: 'Short-form video retention Alex Hormozi animated subtitles' },
    { label: '🛰️ Commercial Space Economy', query: 'Starship orbital payload commercial space stations' },
  ];

  const allAvailableSectors: { id: Sector; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'tech', label: 'Tech & AI', icon: <Cpu className="w-3.5 h-3.5" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'gaming', label: 'Gaming & Tech', icon: <Gamepad2 className="w-3.5 h-3.5" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'finance', label: 'Finance & Macro', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'popculture', label: 'Pop Culture', icon: <Tv className="w-3.5 h-3.5" />, color: 'text-pink-600 bg-pink-50 border-pink-200' },
    { id: 'viral', label: 'Viral Short-Form', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'science', label: 'Science & Bio', icon: <Atom className="w-3.5 h-3.5" />, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { id: 'history', label: 'History', icon: <History className="w-3.5 h-3.5" />, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'health', label: 'Health', icon: <HeartPulse className="w-3.5 h-3.5" />, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'world', label: 'World News', icon: <Globe2 className="w-3.5 h-3.5" />, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  ];

  const toggleSectorSelection = (sec: Sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
    );
  };

  const handleScan = async (searchQueryOverride?: string) => {
    const q = (searchQueryOverride || keyword).trim();
    if (!q) return;

    setIsScanning(true);
    try {
      const res = await fetch('/api/news/cross-sector-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: q,
          sectors: selectedSectors,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const copyHookToClipboard = (hookText: string, index: number) => {
    navigator.clipboard.writeText(hookText);
    setCopiedHookIndex(index);
    setTimeout(() => setCopiedHookIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search Controller */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 text-white shadow-xl border border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Multi-Sector Keyword &amp; Content Idea Scanner
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Cross-Section Deep Search
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Give any context, content idea, or keyword: we search across Tech, Gaming, Finance, Science, and more to synthesize multi-angle news &amp; viral hooks
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Enter any keyword, topic, or content idea (e.g. 'Unreal Engine 5.6', 'Local AI models', 'GPU pricing')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => handleScan()}
            disabled={isScanning || !keyword.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning All Sectors...' : 'Scan Across Sectors'}</span>
          </button>
        </div>

        {/* Preset Keyword Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Suggested Ideas:</span>
          {presetTopics.map((pt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setKeyword(pt.query);
                handleScan(pt.query);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 text-[11px] transition-colors cursor-pointer"
            >
              {pt.label}
            </button>
          ))}
        </div>

        {/* Sector Inclusions Filter Pills */}
        <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold">Active Sectors to Query:</span>
          {allAvailableSectors.map((s) => {
            const isSelected = selectedSectors.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSectorSelection(s.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-500/30 border-blue-400 text-blue-200 shadow-2xs'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6 animate-fadeIn">
          {/* AI Cross-Sector Strategic Synthesis */}
          <div className="p-5 rounded-2xl glass-card border border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/60 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Cross-Sector Intelligence Synthesis for &ldquo;{results.query}&rdquo;
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {results.totalMatchedPosts} matching news stories aggregated across {Object.keys(results.sectorMatches).length} sectors
                  </p>
                </div>
              </div>

              {onSendToScriptLab && (
                <button
                  type="button"
                  onClick={() => onSendToScriptLab(results.query, 'tech')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Send Topic to Script Lab</span>
                </button>
              )}
            </div>

            {/* Macro Executive Summary */}
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-white/80 p-3.5 rounded-xl border border-indigo-100/70 shadow-2xs">
              {results.aiSynthesis.crossSectorExecutiveSummary}
            </p>

            {/* Sector Perspectives Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {results.aiSynthesis.sectorHighlights?.slice(0, 3).map((hl, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                      {hl.sectorLabel || hl.sector}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {hl.viralHeadline}
                  </h5>
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-2">
                    {hl.angleSummary}
                  </p>
                  <div className="pt-1 text-[10px] text-slate-500 font-medium">
                    💡 <span className="font-semibold text-slate-700">Creator Angle:</span> {hl.whyItMatters}
                  </div>
                </div>
              ))}
            </div>

            {/* 3-Second Viral Video Hooks */}
            <div className="p-4 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Suggested 3-Second Short-Form Video Hooks (TikTok, Shorts, Reels):</span>
              </span>

              <div className="space-y-1.5">
                {results.aiSynthesis.creatorHooks?.map((hook, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/70 transition-colors text-xs text-slate-800"
                  >
                    <span className="font-medium flex-1">&ldquo;{hook}&rdquo;</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyHookToClipboard(hook, index)}
                        className="p-1 rounded-md bg-white hover:bg-slate-200 text-slate-600 text-[10px] font-semibold border border-slate-200 transition-colors cursor-pointer"
                        title="Copy hook to clipboard"
                      >
                        {copiedHookIndex === index ? 'Copied!' : 'Copy Hook'}
                      </button>

                      {onSendToNotepad && (
                        <button
                          type="button"
                          onClick={() => onSendToNotepad(hook, `Hook: ${results.query}`)}
                          className="p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-semibold border border-indigo-200 transition-colors cursor-pointer"
                          title="Save to Creator Notepad"
                        >
                          + Notepad
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Section News Aggregated Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Multiple News Discovered Across Sections
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {results.totalMatchedPosts} stories
                </span>
              </div>

              {/* Sector Quick Filter */}
              <div className="flex items-center gap-1 overflow-x-auto py-1">
                <button
                  type="button"
                  onClick={() => setActiveFilterSector('all')}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-bold border transition-colors cursor-pointer ${
                    activeFilterSector === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Sections
                </button>
                {Object.keys(results.sectorMatches).map((sec) => {
                  const count = results.sectorMatches[sec]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setActiveFilterSector(sec as Sector)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-bold border capitalize transition-colors cursor-pointer ${
                        activeFilterSector === sec
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sec} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* News Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results.sectorMatches)
                .filter(([sec]) => activeFilterSector === 'all' || activeFilterSector === sec)
                .flatMap(([sec, posts]) =>
                  (posts || []).map((post: any, idx: number) => (
                    <div
                      key={`${sec}-${post.id || idx}`}
                      className="p-4 rounded-2xl glass-card bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            {post.sector || sec}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {post.platform || 'curated'} • {post.timeAgo || 'today'}
                          </span>
                        </div>

                        {/* Title */}
                        <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {post.title}
                        </h5>

                        {/* Summary */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {post.summary}
                        </p>

                        {/* Educational / Angle takeaway */}
                        {post.educationalTakeaway && (
                          <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
                            <strong>Takeaway:</strong> {post.educationalTakeaway}
                          </div>
                        )}
                      </div>

                      {/* Card Action Footers */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {onSendToNotepad && (
                            <button
                              type="button"
                              onClick={() =>
                                onSendToNotepad(
                                  `${post.title}\n\nSummary: ${post.summary}\n\nTakeaway: ${post.educationalTakeaway || ''}`,
                                  post.title,
                                  post.sector
                                )
                              }
                              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            >
                              + Notepad
                            </button>
                          )}

                          {onSendToScriptLab && (
                            <button
                              type="button"
                              onClick={() => onSendToScriptLab(post.title, post.sector)}
                              className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                            >
                              + Script Lab
                            </button>
                          )}
                        </div>

                        {onVerifySource && (
                          <button
                            type="button"
                            onClick={() => onVerifySource(post)}
                            className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Fact-Check</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
