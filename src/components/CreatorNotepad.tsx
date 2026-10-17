import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Plus,
  Trash2,
  Share2,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  Sliders,
  Send,
  Zap,
  CheckCircle2,
  Layers,
  Wand2,
  Download,
  Calendar,
  Tag,
} from 'lucide-react';
import {
  Sector,
  NotepadItem,
  NotepadResearchSource,
  CopyrightRiskReport,
  MultiPlatformSchedulePlan,
  EngineType,
  LocalLLMConfig,
} from '../types';

interface CreatorNotepadProps {
  onSendToScriptLab: (topic: string, body: string, sector: Sector) => void;
  engine: EngineType;
  localConfig: LocalLLMConfig;
  onOpenTrendRadar?: (keyword?: string) => void;
}

const LOCAL_STORAGE_KEY = 'clipperpulse_creator_notes_v1';

const INITIAL_NOTES: NotepadItem[] = [
  {
    id: 'note-1',
    title: 'Local LLMs Disruption: Why 4-Bit Quantization Beats Cloud APIs',
    sector: 'tech',
    tags: ['LocalAI', 'Quantization', 'AppleSilicon'],
    lastModified: Date.now() - 3600000 * 4,
    wordCount: 145,
    readingTimeMinutes: 1,
    content: `Stop paying $20/month for cloud AI subscriptions. With Q4_K_M quantization on consumer hardware, local reasoning models now match 85% of frontier cloud benchmarks with zero subscription fees, zero rate limits, and zero privacy leaks.

Key data point: running llama.cpp on an Apple M3/M4 Max delivers 80-110 tokens/second offline.

The historical parallel is microprocessors replacing room-sized IBM mainframes in the late 1970s. We are witnessing the exact same decentralization today.

Hook for video: "The $200B cloud AI monopoly just suffered a massive leak, and nobody noticed."`,
    sources: [
      {
        title: 'Ollama Open Source Model Benchmarks',
        url: 'https://github.com/ollama/ollama',
        snippet: 'Quantized GGUF inference performance on Apple Silicon unified memory.',
        sourceDomain: 'github.com',
      },
    ],
  },
  {
    id: 'note-2',
    title: 'The Great Liquidity Trap: How Global M2 Supply Dictates Asset Prices',
    sector: 'finance',
    tags: ['Macro', 'CentralBanks', 'Liquidity'],
    lastModified: Date.now() - 3600000 * 24,
    wordCount: 110,
    readingTimeMinutes: 1,
    content: `Most retail investors watch earnings reports, but macro hedge funds watch global M2 money supply.

When central banks expand balance sheets, risk assets move upward 90-120 days later with a 0.88 correlation. Earnings misses do not matter when liquidity floods the plumbing.

Contrast hook: "Why the stock market hits all-time highs while everyday people feel broke."`,
    sources: [
      {
        title: 'Federal Reserve Balance Sheet & M2 Money Supply',
        url: 'https://fred.stlouisfed.org',
        snippet: 'Official monetary aggregate data tracks cross-border liquidity cycles.',
        sourceDomain: 'stlouisfed.org',
      },
    ],
  },
  {
    id: 'note-3',
    title: 'How Neural Frame Generation Works: Real 60Hz Physics vs AI 120 FPS',
    sector: 'gaming',
    tags: ['GamingTech', 'DLSS', 'FrameGen', 'Graphics'],
    lastModified: Date.now() - 3600000 * 12,
    wordCount: 130,
    readingTimeMinutes: 1,
    content: `Competitive gamers complain about "fake frames" with DLSS 4 and FSR, but the math is fascinating.

The game engine still computes collision, player physics, and hit detection at 60Hz. The optical flow tensor cores on the GPU calculate pixel motion vectors between two rendered frames and interpolate an AI-hallucinated middle frame.

You get smooth 120Hz motion clarity for your eyes, but with the input latency of 60Hz.

Hook: "Stop arguing about whether AI frame gen is fake—here is the exact hardware math."`,
    sources: [
      {
        title: 'Optical Flow SDK & Frame Interpolation Whitepaper',
        url: 'https://developer.nvidia.com',
        snippet: 'Deep learning real-time frame synthesis and motion vector interpolation.',
        sourceDomain: 'nvidia.com',
      },
    ],
  },
];

export const CreatorNotepad: React.FC<CreatorNotepadProps> = ({
  onSendToScriptLab,
  engine,
  localConfig,
  onOpenTrendRadar,
}) => {
  // Notes State
  const [notes, setNotes] = useState<NotepadItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || 'note-1');
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  // Right Pane Active Tab
  const [activeRightTab, setActiveRightTab] = useState<'search' | 'ai_co-pilot' | 'copyright' | 'multiplatform'>('ai_co-pilot');

  // Google Search Tray State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NotepadResearchSource[]>(activeNote?.sources || []);
  const [searchInsight, setSearchInsight] = useState<string | null>(null);

  // AI Mistake Correction State
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [correctionReport, setCorrectionReport] = useState<any | null>(null);
  const [desiredTone, setDesiredTone] = useState<'punchy' | 'educational' | 'documentary' | 'viral'>('punchy');

  // Predicted News Waves State
  const [isPredictingWave, setIsPredictingWave] = useState(false);
  const [waveForecast, setWaveForecast] = useState<any | null>(null);

  // Copyright Radar State
  const [isCheckingCopyright, setIsCheckingCopyright] = useState(false);
  const [copyrightReport, setCopyrightReport] = useState<CopyrightRiskReport | null>(null);

  // Multi-Platform & Multi-Region Schedule State
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const [schedulePlan, setSchedulePlan] = useState<MultiPlatformSchedulePlan | null>(null);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [saveIndicator, setSaveIndicator] = useState(false);

  // Persist notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // Update current active note fields
  const updateActiveNote = (updates: Partial<NotepadItem>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === activeNoteId) {
          const content = updates.content !== undefined ? updates.content : n.content;
          const words = content.trim().split(/\s+/).filter(Boolean).length;
          return {
            ...n,
            ...updates,
            wordCount: words,
            readingTimeMinutes: Math.max(1, Math.round(words / 140)),
            lastModified: Date.now(),
          };
        }
        return n;
      })
    );
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 1200);
  };

  // Create new blank note
  const handleCreateNote = () => {
    const newNote: NotepadItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Creator Outline',
      sector: 'tech',
      tags: ['Idea', 'Draft'],
      lastModified: Date.now(),
      wordCount: 0,
      readingTimeMinutes: 1,
      content: '',
      sources: [],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  // Delete note
  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id) {
      setActiveNoteId(remaining[0].id);
    }
  };

  // Run Google Search
  const handleSearchGoogle = async (queryToSearch?: string) => {
    const q = queryToSearch || searchQuery || activeNote?.title || '';
    if (!q.trim()) return;
    setIsSearching(true);
    setSearchInsight(null);

    try {
      const res = await fetch('/api/notepad/google-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          sector: activeNote?.sector || 'tech',
        }),
      });
      const data = await res.json();
      if (data.results) {
        setSearchResults(data.results);
        setSearchInsight(data.creatorInsight || null);
        // also store into active note sources
        updateActiveNote({ sources: data.results });
      }
    } catch {
      // Fallback
    } finally {
      setIsSearching(false);
    }
  };

  // Run AI Mistake Correction
  const handleRunMistakeCorrection = async () => {
    if (!activeNote?.content) return;
    setIsCorrecting(true);
    try {
      const res = await fetch('/api/notepad/mistake-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: activeNote.content,
          title: activeNote.title,
          tone: desiredTone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCorrectionReport(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsCorrecting(false);
    }
  };

  // Apply corrected text directly
  const handleApplyCorrection = () => {
    if (correctionReport?.correctedText) {
      updateActiveNote({ content: correctionReport.correctedText });
    }
  };

  // Run Predicted News Wave
  const handlePredictNewsWave = async () => {
    if (!activeNote?.content) return;
    setIsPredictingWave(true);
    try {
      const res = await fetch('/api/notepad/predict-news-wave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: activeNote.content,
          sector: activeNote.sector,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWaveForecast(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsPredictingWave(false);
    }
  };

  // Run Copyright Strike Safety Check
  const handleCheckCopyright = async () => {
    if (!activeNote?.content) return;
    setIsCheckingCopyright(true);
    try {
      const res = await fetch('/api/notepad/copyright-radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: activeNote.content,
          scriptText: activeNote.title,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCopyrightReport(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsCheckingCopyright(false);
    }
  };

  // Run Multi-Platform & Multi-Region Schedule Generator
  const handleGenerateSchedule = async () => {
    if (!activeNote?.content) return;
    setIsGeneratingSchedule(true);
    try {
      const res = await fetch('/api/notepad/multi-platform-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteText: activeNote.content,
          title: activeNote.title,
          sector: activeNote.sector,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSchedulePlan(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  // Copy platform format
  const handleCopyPlatform = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 1800);
  };

  // Insert template into note
  const handleInsertTemplate = (type: string) => {
    let tpl = '';
    if (type === 'viral_hook') {
      tpl = `\n\n[THE 3-SECOND HOOK]: "Stop scrolling before you make this $10,000 mistake..."\n[THE CONTRAST]: "Most people believe X, but the math proves Y."\n[THE PROOF]: "Here is the exact benchmark from page 4."\n[CALL TO ACTION]: "Save this before it gets taken down."`;
    } else if (type === 'vox_investigation') {
      tpl = `\n\n[ACT 1: THE CRIME]: "In 2024, an obscure regulation changed everything."\n[ACT 2: THE HIDDEN INCENTIVE]: "Follow the money: $40 billion flows to three players."\n[ACT 3: THE PARALLEL]: "We saw this exact pattern in 1982 during the telecomm monopoly breakup."\n[VERDICT]: "The next 18 months will decide who owns the infrastructure."`;
    } else if (type === 'step_breakdown') {
      tpl = `\n\n[STEP 1: THE FOUNDATION]: Set up local weights without cloud telemetry.\n[STEP 2: THE LEVERAGE]: Quantize to 4-bits to save 75% memory.\n[STEP 3: THE PROMPT]: Structure input tokens with single-role isolation.`;
    }
    updateActiveNote({ content: activeNote.content + tpl });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Creator Notepad &amp; Distribution Command Center
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300/60">
                AI CO-PILOT
              </span>
              {saveIndicator && (
                <span className="text-[11px] text-emerald-600 font-bold animate-pulse flex items-center gap-1">
                  <Check className="w-3 h-3" /> Auto-saved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Live Google Search research, mistake corrections, copyright strike safety radar &amp; multi-region automated scheduler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCreateNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Draft (N)</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onSendToScriptLab(activeNote.title, activeNote.content, activeNote.sector)
            }
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send to Script Lab</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Left Notes List + Editor (7 cols) / Right AI Hub (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Note Navigation & Rich Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Notes Carousel / Selector Bar */}
          <div className="glass-panel p-2.5 rounded-2xl flex items-center gap-2 overflow-x-auto border border-slate-200/80">
            <span className="text-xs font-bold text-slate-500 px-2 shrink-0">Drafts:</span>
            {notes.map((n) => {
              const isSelected = n.id === activeNoteId;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveNoteId(n.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all whitespace-nowrap border shrink-0 ${
                    isSelected
                      ? 'bg-white text-blue-700 border-blue-300 font-bold shadow-xs'
                      : 'bg-slate-50/70 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <span className="max-w-[140px] truncate">{n.title || 'Untitled'}</span>
                  {notes.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteNote(n.id, e)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Note Editor Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-200/80 space-y-4">
            {/* Note Meta Controls: Title, Sector, Tags */}
            <div className="space-y-3 pb-3 border-b border-slate-200/80">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateActiveNote({ title: e.target.value })}
                placeholder="Note Title or Viral Video Topic..."
                className="w-full text-base font-extrabold text-slate-900 bg-transparent border-0 focus:outline-none placeholder:text-slate-400"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500">Sector:</span>
                  <select
                    value={activeNote.sector}
                    onChange={(e) => updateActiveNote({ sector: e.target.value as Sector })}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="tech">Tech &amp; AI</option>
                    <option value="gaming">Gaming &amp; Interactive</option>
                    <option value="finance">Finance &amp; Macro</option>
                    <option value="science">Science &amp; Deep Tech</option>
                    <option value="history">History &amp; Ancient</option>
                    <option value="education">Education &amp; TIL</option>
                    <option value="health">Health &amp; Bio</option>
                    <option value="world">World Geopolitics</option>
                    <option value="popculture">Culture &amp; Creator</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {activeNote.readingTimeMinutes} min read ({activeNote.wordCount} words)
                  </span>
                </div>
              </div>
            </div>

            {/* Note Textarea */}
            <div className="relative">
              <textarea
                value={activeNote.content}
                onChange={(e) => updateActiveNote({ content: e.target.value })}
                placeholder="Write your research findings, script hooks, facts, or controversial questions here... Press ⌘K for commands."
                rows={12}
                className="w-full bg-slate-50/50 rounded-xl p-4 text-xs font-mono text-slate-900 border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed resize-y"
              />
            </div>

            {/* Quick Template Inserts */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Insert Structure:</span>
              <button
                type="button"
                onClick={() => handleInsertTemplate('viral_hook')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
              >
                + 3s Hook-Story-Offer
              </button>
              <button
                type="button"
                onClick={() => handleInsertTemplate('vox_investigation')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
              >
                + Vox 3-Act Investigation
              </button>
              <button
                type="button"
                onClick={() => handleInsertTemplate('step_breakdown')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
              >
                + 3-Step Educational Blueprint
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Research & Distribution Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sub-Tabs for Right Pane */}
          <div className="glass-panel p-1.5 rounded-2xl flex items-center justify-between border border-slate-200/80 overflow-x-auto gap-1">
            <button
              type="button"
              onClick={() => setActiveRightTab('ai_co-pilot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRightTab === 'ai_co-pilot'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Co-Pilot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRightTab('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRightTab === 'search'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Google Research</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRightTab('copyright')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRightTab === 'copyright'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Copyright Radar</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRightTab('multiplatform')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeRightTab === 'multiplatform'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Region</span>
            </button>
          </div>

          {/* TAB 1: GOOGLE SEARCH RESEARCH */}
          {activeRightTab === 'search' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Google Live Search Grounding</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Search verified research papers, Reuters reports, and primary metrics directly into notes
                </p>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchGoogle()}
                  placeholder={activeNote.title || 'Search news, papers or facts...'}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  disabled={isSearching}
                  onClick={() => handleSearchGoogle()}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  <span>Search</span>
                </button>
              </div>

              {/* Quick Prompt Ideas */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                <span>Trending:</span>
                {['Quantized LLM benchmarks', 'Central bank liquidity 2026', 'DeepSeek architectural innovations'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      handleSearchGoogle(term);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {term}
                  </button>
                ))}

                {onOpenTrendRadar && (
                  <button
                    type="button"
                    onClick={() => onOpenTrendRadar(searchQuery || activeNote.title)}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Deep search this keyword across all 10 sectors simultaneously"
                  >
                    <Layers className="w-3 h-3 text-indigo-600" />
                    <span>🌐 Scan All 10 Sectors</span>
                  </button>
                )}
              </div>

              {/* Creator Insight Box */}
              {searchInsight && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">{searchInsight}</p>
                </div>
              )}

              {/* Results List */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/90 border border-slate-200/80 hover:border-slate-300 transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 leading-snug"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{res.snippet}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="font-mono">{res.sourceDomain}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const quote = `\n\n[CITATION: ${res.title}] (${res.sourceDomain})\n"${res.snippet}"\nLink: ${res.url}`;
                          updateActiveNote({ content: activeNote.content + quote });
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        + Insert Citation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AI CO-PILOT & MISTAKE CORRECTIONS */}
          {activeRightTab === 'ai_co-pilot' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AI Proofreader &amp; Wave Predictor</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Corrects pacing, grammar, and predicts upcoming news cycles</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[10px] font-bold">
                  {(['punchy', 'educational', 'documentary', 'viral'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDesiredTone(t)}
                      className={`px-2 py-0.5 rounded capitalize transition-colors ${
                        desiredTone === t ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isCorrecting || !activeNote.content}
                  onClick={handleRunMistakeCorrection}
                  className="p-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isCorrecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  <span>Fix Mistakes &amp; Polish</span>
                </button>

                <button
                  type="button"
                  disabled={isPredictingWave || !activeNote.content}
                  onClick={handlePredictNewsWave}
                  className="p-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isPredictingWave ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Calendar className="w-3.5 h-3.5" />}
                  <span>Predict News Waves</span>
                </button>
              </div>

              {/* Mistake Correction Results */}
              {correctionReport && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Editorial Polish Complete</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleApplyCorrection}
                        className="text-[11px] bg-emerald-600 text-white px-2.5 py-0.5 rounded font-bold hover:bg-emerald-700 shadow-xs"
                      >
                        Apply to Note
                      </button>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      {correctionReport.summaryOfCorrections}
                    </p>
                  </div>

                  {/* Stronger Hook Recommendation */}
                  {correctionReport.strongerHookAlternative && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider block">
                        Recommended 3-Second Viral Hook:
                      </span>
                      <p className="font-extrabold text-slate-900 leading-snug">
                        "{correctionReport.strongerHookAlternative}"
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const hook = `\n\n[RECOMMENDED 3S HOOK]: "${correctionReport.strongerHookAlternative}"`;
                          updateActiveNote({ content: hook + '\n' + activeNote.content });
                        }}
                        className="text-[10px] text-amber-700 font-bold hover:underline"
                      >
                        + Prepend as Opening Hook
                      </button>
                    </div>
                  )}

                  {/* Fact-Check Flags */}
                  {correctionReport.factCheckFlags?.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 uppercase">Fact Verification Flags:</span>
                      {correctionReport.factCheckFlags.map((flag: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                          <span className="font-bold text-slate-900">{flag.claim}</span>
                          <p className="text-slate-500">{flag.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Predicted News Wave Results */}
              {waveForecast && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Upcoming Wave: {waveForecast.projectedWaveTimeline}</span>
                  </div>

                  <div className="space-y-2">
                    {waveForecast.futureDevelopments?.map((dev: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{dev.headline}</span>
                          <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                            {dev.timeframe}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{dev.whyItHappens}</p>
                        <div className="pt-1 text-[10px] text-blue-700 font-bold">
                          🎬 Action to Record: {dev.creatorAction}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contrarian Angles */}
                  {waveForecast.contrarianAngles?.length > 0 && (
                    <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-1 text-purple-950">
                      <span className="font-bold text-purple-900 uppercase text-[10px] tracking-wider block">
                        Contrarian Niche Angle:
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        {waveForecast.contrarianAngles[0]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COPYRIGHT STRIKE SAFETY RADAR */}
          {activeRightTab === 'copyright' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="space-y-1 pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Copyright Strike Safety &amp; Fair Use Radar</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Scans for automated Content ID claimants, aggressive studios &amp; safe CC-BY alternatives
                </p>
              </div>

              <button
                type="button"
                disabled={isCheckingCopyright || !activeNote.content}
                onClick={handleCheckCopyright}
                className="w-full p-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isCheckingCopyright ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Scan Note for Copyright Risks</span>
              </button>

              {copyrightReport && (
                <div className="space-y-3 pt-2">
                  {/* Risk Score Meter */}
                  <div className="p-3.5 rounded-xl bg-slate-950 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Copyright Strike Risk Score</span>
                      <span
                        className={`font-black font-mono text-sm ${
                          copyrightReport.overallRiskScore > 50
                            ? 'text-rose-400'
                            : copyrightReport.overallRiskScore > 25
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {copyrightReport.overallRiskScore} / 100 ({copyrightReport.status.toUpperCase()})
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          copyrightReport.overallRiskScore > 50
                            ? 'bg-rose-500'
                            : copyrightReport.overallRiskScore > 25
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(8, copyrightReport.overallRiskScore)}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {copyrightReport.summary}
                    </p>
                  </div>

                  {/* Flagged Items */}
                  {copyrightReport.flaggedItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.term}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            item.riskLevel === 'high'
                              ? 'bg-rose-100 text-rose-800'
                              : item.riskLevel === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.riskLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong className="text-slate-800">Rightsholder:</strong> {item.rightsholder} — {item.explanation}
                      </p>
                      <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-blue-900">
                        <strong>Safe Alternative:</strong> {item.safeAlternative}
                      </div>
                    </div>
                  ))}

                  {/* Fair Use Guidance */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                    <strong className="text-slate-900 block font-bold">Safe Creator Channels &amp; Libraries:</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {copyrightReport.safeStockMusicSuggestions?.map((src, i) => (
                        <li key={i}>{src}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MULTI-PLATFORM & MULTI-REGION SCHEDULER */}
          {activeRightTab === 'multiplatform' && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="space-y-1 pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <span>Multi-Platform &amp; Global Distribution</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Converts note into platform-specific scripts &amp; peak timezone release schedules
                </p>
              </div>

              <button
                type="button"
                disabled={isGeneratingSchedule || !activeNote.content}
                onClick={handleGenerateSchedule}
                className="w-full p-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isGeneratingSchedule ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                <span>Generate Multi-Platform &amp; Regional Matrix</span>
              </button>

              {schedulePlan && (
                <div className="space-y-4 pt-1">
                  {/* Recommended Format Badge */}
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-900">Recommended Format:</span>
                      <span className="font-bold font-mono text-sky-700">Virality Score: {schedulePlan.estimatedViralityScore}%</span>
                    </div>
                    <p className="font-bold text-slate-900">{schedulePlan.recommendedContentType}</p>
                    <p className="text-[11px] text-slate-600">{schedulePlan.contentRationale}</p>
                  </div>

                  {/* 5 Platforms Accordion/Tabs */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Platform Formats (Ready to Copy):
                    </span>
                    {schedulePlan.formats?.map((fmt) => (
                      <div
                        key={fmt.platform}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                            {fmt.platform.replace('_', ' ')} · {fmt.optimalDuration}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyPlatform(fmt.platform, `${fmt.hookHeadline}\n\n${fmt.bodyScriptOrCaption}\n\n${fmt.hashtags.join(' ')}`)
                            }
                            className="flex items-center gap-1 text-[11px] text-blue-600 font-bold hover:underline"
                          >
                            {copiedPlatform === fmt.platform ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedPlatform === fmt.platform ? 'Copied!' : 'Copy Script'}</span>
                          </button>
                        </div>
                        <p className="font-bold text-slate-900 text-xs leading-snug">
                          Hook: "{fmt.hookHeadline}"
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                          {fmt.bodyScriptOrCaption}
                        </p>
                        <div className="flex flex-wrap gap-1 text-[10px] text-slate-400 font-mono">
                          {fmt.hashtags.map((h, i) => (
                            <span key={i} className="text-blue-500 font-semibold">{h}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 6 Regional Windows */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Global Prime-Time Posting Windows:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {schedulePlan.regions?.map((reg) => (
                        <div
                          key={reg.regionCode}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{reg.regionName}</span>
                            <span className="font-mono text-[10px] text-slate-500">{reg.timezoneLabel}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-emerald-700">
                            🕒 {reg.primeTimeWindow}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            Angle: {reg.localizedHookAngle}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
