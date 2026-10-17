import React, { useState } from 'react';
import {
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Flame,
  ArrowRight,
  Filter,
  Cpu,
  DollarSign,
  Tv,
  MessageSquare,
  ThumbsUp,
  Eye,
  Lock,
  Sparkles,
  BookOpen,
  Landmark,
  Radio,
  Search,
  Copy,
  Check,
  Dna,
  HeartPulse,
  Globe2,
  Lightbulb,
  Share2,
  Gamepad2,
  Calendar,
  Clock,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  SocialPost,
  Sector,
  SocialPlatform,
  ContentCategory,
  EngineType,
  LocalLLMConfig,
} from '../types';
import { DAILY_SECTOR_BRIEFINGS } from '../data/multiSectorNews';
import { CrossSectorIdeaScanner } from './CrossSectorIdeaScanner';

interface TrendRadarProps {
  posts: SocialPost[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  onSelectPostForScript: (post: SocialPost) => void;
  onVerifyPost: (post: SocialPost) => void;
  onOpenCredentialsModal: () => void;
  engine: EngineType;
  localConfig: LocalLLMConfig;
  onSendToNotepad?: (text: string, title?: string, sector?: Sector) => void;
}

export const TrendRadar: React.FC<TrendRadarProps> = ({
  posts,
  setPosts,
  onSelectPostForScript,
  onVerifyPost,
  onOpenCredentialsModal,
  onSendToNotepad,
}) => {
  const [radarViewMode, setRadarViewMode] = useState<'matrix' | 'cross_scanner'>('matrix');
  const [selectedSector, setSelectedSector] = useState<'all' | Sector>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ContentCategory>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialPlatform>('all');
  const [feedCadence, setFeedCadence] = useState<'today' | 'recent' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFetchingFeeds, setIsFetchingFeeds] = useState(false);
  const [isDailyRefreshing, setIsDailyRefreshing] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Daily Refresh Timestamp & Batch Seed Status
  const [dailyRefreshedDate, setDailyRefreshedDate] = useState<string>(() => {
    return localStorage.getItem('clipperpulse_daily_feed_date') || new Date().toISOString().split('T')[0];
  });
  const [dailyRefreshedAt, setDailyRefreshedAt] = useState<string>(() => {
    return localStorage.getItem('clipperpulse_daily_feed_time') || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  const [batchSeed, setBatchSeed] = useState<number>(() => {
    return Number(localStorage.getItem('clipperpulse_daily_batch_seed') || 0);
  });

  // Daily automated refresh check on mount:
  // If the user visits on a new calendar day, automatically refresh the news feed!
  React.useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastStored = localStorage.getItem('clipperpulse_daily_feed_date');
    if (lastStored !== todayStr) {
      handleDailyRefresh(false, 0);
    }
  }, []);

  const handleDailyRefresh = async (cycleNextBatch: boolean = true, explicitSeed?: number) => {
    setIsDailyRefreshing(true);
    const nextSeed = explicitSeed !== undefined ? explicitSeed : (cycleNextBatch ? batchSeed + 1 : batchSeed);
    setBatchSeed(nextSeed);
    localStorage.setItem('clipperpulse_daily_batch_seed', String(nextSeed));

    try {
      const res = await fetch('/api/news/daily-refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector: selectedSector, batchSeed: nextSeed }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts(data.posts);
          const now = new Date();
          const todayStr = now.toISOString().split('T')[0];
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          localStorage.setItem('clipperpulse_daily_feed_date', todayStr);
          localStorage.setItem('clipperpulse_daily_feed_time', timeStr);
          setDailyRefreshedDate(todayStr);
          setDailyRefreshedAt(timeStr);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsDailyRefreshing(false);
    }
  };

  // Filter posts by sector, category, platform, cadence & search query
  const filteredPosts = posts.filter((p) => {
    if (selectedSector !== 'all' && p.sector !== selectedSector) return false;
    if (selectedCategory !== 'all' && p.contentType !== selectedCategory) return false;
    if (selectedPlatform !== 'all' && p.platform !== selectedPlatform) return false;

    // Daily Cadence filter
    if (feedCadence === 'today' && p.publishedAt) {
      const postDate = new Date(p.publishedAt).getTime();
      const cutoff24h = Date.now() - 3600000 * 24;
      if (postDate < cutoff24h) return false;
    } else if (feedCadence === 'recent' && p.publishedAt) {
      const postDate = new Date(p.publishedAt).getTime();
      const cutoff48h = Date.now() - 3600000 * 48;
      if (postDate < cutoff48h) return false;
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSummary = p.summary.toLowerCase().includes(q);
      const matchEdu = p.educationalTakeaway?.toLowerCase().includes(q);
      const matchHist = p.historicalContext?.toLowerCase().includes(q);
      const matchViral = p.whyViral?.toLowerCase().includes(q);
      const matchAuthor = p.authorName.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSummary && !matchEdu && !matchHist && !matchViral && !matchAuthor && !matchTags) {
        return false;
      }
    }

    return true;
  });

  // Calculate sector counts for badges
  const getSectorCount = (sec: 'all' | Sector) => {
    if (sec === 'all') return posts.length;
    return posts.filter((p) => p.sector === sec).length;
  };

  const handleFetchLiveFeeds = async () => {
    setIsFetchingFeeds(true);
    try {
      const activeSector = selectedSector === 'all' ? 'tech' : selectedSector;

      const res = await fetch('/api/news/sector-feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: selectedSector,
          category: selectedCategory,
          search: searchQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          // Merge or replace posts
          const otherPosts = posts.filter(
            (p) => selectedSector !== 'all' && p.sector !== selectedSector
          );
          setPosts([...data.posts, ...otherPosts]);
          return;
        }
      }

      // Fallback to social connectors
      const [redditRes, ytRes, twRes] = await Promise.allSettled([
        fetch('/api/social/reddit/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sector: activeSector }),
        }).then((r) => r.json()),
        fetch('/api/social/youtube/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sector: activeSector }),
        }).then((r) => r.json()),
        fetch('/api/social/twitter/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sector: activeSector }),
        }).then((r) => r.json()),
      ]);

      const newPosts: SocialPost[] = [];
      if (redditRes.status === 'fulfilled' && redditRes.value.posts) {
        newPosts.push(...redditRes.value.posts);
      }
      if (ytRes.status === 'fulfilled' && ytRes.value.posts) {
        newPosts.push(...ytRes.value.posts);
      }
      if (twRes.status === 'fulfilled' && twRes.value.posts) {
        newPosts.push(...twRes.value.posts);
      }

      if (newPosts.length > 0) {
        setPosts((prev) => {
          const map = new Map<string, SocialPost>();
          newPosts.forEach((p) => map.set(p.id, p));
          prev.forEach((p) => {
            if (!map.has(p.id)) map.set(p.id, p);
          });
          return Array.from(map.values());
        });
      }
    } catch {
      // Keep existing posts
    } finally {
      setIsFetchingFeeds(false);
    }
  };

  const handleRealtimeSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;

    setIsSearchingLive(true);
    try {
      const res = await fetch('/api/news/realtime-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          sector: selectedSector === 'all' ? 'tech' : selectedSector,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          setPosts((prev) => {
            const map = new Map<string, SocialPost>();
            data.posts.forEach((p: SocialPost) => map.set(p.id, p));
            prev.forEach((p) => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            return Array.from(map.values());
          });
        }
      }
    } catch (err) {
      console.warn('Realtime search failed:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleAIDiscoverFreshNews = async () => {
    setIsGeneratingAI(true);
    try {
      const activeSector = selectedSector === 'all' ? 'tech' : selectedSector;
      const res = await fetch('/api/news/live-ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector,
          customFocus: searchQuery || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
          // Prepend the new generated items to the post feed
          setPosts((prev) => {
            const map = new Map<string, SocialPost>();
            data.posts.forEach((p: SocialPost) => map.set(p.id, p));
            prev.forEach((p) => {
              if (!map.has(p.id)) map.set(p.id, p);
            });
            return Array.from(map.values());
          });
        }
      }
    } catch {
      // Keep existing
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const copyPostHookAndTakeaway = (post: SocialPost) => {
    const text = `HOOK: "${post.title}"\n\nEDUCATIONAL TAKEAWAY:\n${post.educationalTakeaway || post.summary}\n\nHISTORICAL CONTEXT:\n${post.historicalContext || 'N/A'}\n\nVIRAL ANGLE:\n${post.whyViral || 'N/A'}\n\nSOURCE: ${post.sourceUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const formatPostTime = (isoString?: string) => {
    if (!isoString) return 'Today';
    const postTime = new Date(isoString).getTime();
    const diffMinutes = Math.max(1, Math.floor((Date.now() - postTime) / 60000));
    if (diffMinutes < 60) return `${diffMinutes}m ago (Today)`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago (Today)`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const getPlatformBadge = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white flex items-center gap-1">
            𝕏 Twitter
          </span>
        );
      case 'reddit':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200 flex items-center gap-1">
            Reddit
          </span>
        );
      case 'youtube':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-800 border border-red-200 flex items-center gap-1">
            YouTube
          </span>
        );
    }
  };

  const getCategoryBadge = (category?: ContentCategory) => {
    switch (category) {
      case 'educational':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-indigo-600" />
            <span>Useful &amp; Educate</span>
          </span>
        );
      case 'history':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
            <Landmark className="w-3 h-3 text-amber-700" />
            <span>History &amp; Origins</span>
          </span>
        );
      case 'viral':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>Viral Breaking</span>
          </span>
        );
      case 'live':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 animate-pulse">
            <Radio className="w-3 h-3 text-emerald-600" />
            <span>Live Alert</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getSectorIcon = (sector: Sector) => {
    switch (sector) {
      case 'tech':
        return <Cpu className="w-3.5 h-3.5 text-blue-600" />;
      case 'finance':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case 'science':
        return <Dna className="w-3.5 h-3.5 text-cyan-600" />;
      case 'history':
        return <Landmark className="w-3.5 h-3.5 text-amber-700" />;
      case 'education':
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600" />;
      case 'viral':
        return <Flame className="w-3.5 h-3.5 text-rose-600" />;
      case 'health':
        return <HeartPulse className="w-3.5 h-3.5 text-red-600" />;
      case 'world':
        return <Globe2 className="w-3.5 h-3.5 text-teal-600" />;
      case 'gaming':
        return <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />;
      case 'popculture':
        return <Tv className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const sectorsConfig: { id: 'all' | Sector; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Sectors', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'tech', label: 'Tech & AI', icon: <Cpu className="w-3.5 h-3.5 text-blue-600" /> },
    { id: 'gaming', label: 'Gaming & Interactive', icon: <Gamepad2 className="w-3.5 h-3.5 text-purple-600" /> },
    { id: 'finance', label: 'Finance & Macro', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> },
    { id: 'science', label: 'Science & Deep Tech', icon: <Dna className="w-3.5 h-3.5 text-cyan-600" /> },
    { id: 'history', label: 'History & Lore', icon: <Landmark className="w-3.5 h-3.5 text-amber-700" /> },
    { id: 'education', label: 'Useful & Educate', icon: <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> },
    { id: 'viral', label: 'Viral Meta', icon: <Flame className="w-3.5 h-3.5 text-rose-600" /> },
    { id: 'health', label: 'Health & Longevity', icon: <HeartPulse className="w-3.5 h-3.5 text-red-600" /> },
    { id: 'world', label: 'World & Infra', icon: <Globe2 className="w-3.5 h-3.5 text-teal-600" /> },
  ];

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const activeSectorKey = selectedSector === 'all' ? 'tech' : selectedSector;
  const currentSectorFlashpoint = DAILY_SECTOR_BRIEFINGS[activeSectorKey] || DAILY_SECTOR_BRIEFINGS.tech;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Multi-Sector Viral Intelligence &amp; Educational Radar
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  10 Sectors · 100+ Curated Items
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Refreshes Every Day</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                10 rich items per sector: Breaking Viral News, Mind-Blowing History, Gaming Tech &amp; Multi-Section Idea Scanner
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCredentialsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>API Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => handleDailyRefresh(true)}
            disabled={isDailyRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
            title="Cycle to next brand-new batch of viral news stories for today"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDailyRefreshing ? 'animate-spin' : ''}`} />
            <span>{isDailyRefreshing ? "Generating New Batch..." : "🔥 Next Viral News Batch"}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">
              #{batchSeed + 1}
            </span>
          </button>

          <button
            type="button"
            onClick={handleAIDiscoverFreshNews}
            disabled={isGeneratingAI}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all disabled:opacity-50 cursor-pointer"
            title="Use Gemini to generate 10 brand-new live items for the selected sector"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Synthesizing 10 News...' : '✨ AI Fetch 10 News'}</span>
          </button>

          <button
            type="button"
            onClick={handleFetchLiveFeeds}
            disabled={isFetchingFeeds}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingFeeds ? 'animate-spin' : ''}`} />
            <span>{isFetchingFeeds ? 'Scraping Live...' : 'Refresh Live Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher: 10-Sector Feed Matrix vs Multi-Sector Idea Scanner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100/90 border border-slate-200">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <button
            type="button"
            onClick={() => setRadarViewMode('matrix')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              radarViewMode === 'matrix'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>10-Sector News Matrix</span>
            <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">100 Items</span>
          </button>

          <button
            type="button"
            onClick={() => setRadarViewMode('cross_scanner')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              radarViewMode === 'cross_scanner'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Sector Keyword &amp; Idea Scanner</span>
            <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 font-extrabold text-[10px]">
              NEW
            </span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 hidden sm:block px-2">
          {radarViewMode === 'matrix'
            ? 'Browse daily rotated stories across 10 sectors with dynamic timestamps'
            : 'Enter any keyword, topic, or context to deep search across all sections'}
        </p>
      </div>

      {radarViewMode === 'cross_scanner' ? (
        <CrossSectorIdeaScanner
          onSendToNotepad={onSendToNotepad}
          onSendToScriptLab={(topic, sec) =>
            onSelectPostForScript({
              id: `scanned-${Date.now()}`,
              title: topic,
              sector: sec || 'tech',
              summary: topic,
              platform: 'youtube',
              hookTakeaway: topic,
              contentType: 'viral',
              engagement: { viralityScore: 92 },
            } as any)
          }
          onVerifySource={onVerifyPost}
        />
      ) : (
        <div className="space-y-6">

      {/* Daily Intelligence & Freshness Control Strip */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>{todayFormatted}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span>Daily Viral Cycle Active</span>
                <span className="text-white font-bold">(Batch #{batchSeed + 1})</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last refreshed today at {dailyRefreshedAt}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Auto-refreshes daily every 24 hours</span>
            </div>
          </div>
        </div>

        {/* Cadence Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Feed Window:</span>
          {[
            { id: 'today', label: "Today's 24h Feed" },
            { id: 'recent', label: 'Recent 48h' },
            { id: 'all', label: 'All Curated' },
          ].map((cad) => (
            <button
              key={cad.id}
              type="button"
              onClick={() => setFeedCadence(cad.id as any)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                feedCadence === cad.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cad.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Flashpoint Briefing */}
      <div className="px-4 py-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-800">
          <span className="font-bold text-blue-900 shrink-0 flex items-center gap-1.5">
            {getSectorIcon(activeSectorKey)}
            <span className="capitalize">{activeSectorKey} Daily Brief:</span>
          </span>
          <span className="text-slate-700 italic">{currentSectorFlashpoint}</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded-md shrink-0">
          Updated Daily
        </span>
      </div>


      {/* Sector Bar: All 8 Sectors with Count Badges */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Sector (10 Verified Items Per Sector):</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            Showing {filteredPosts.length} of {posts.length} Total Stories
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {sectorsConfig.map((sec) => {
            const count = getSectorCount(sec.id);
            const isSelected = selectedSector === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSector(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Bar: Content Type Filters & Search Query */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white/80 border border-slate-200/80">
        {/* Category format filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 mr-1 shrink-0">Focus:</span>
          {[
            { id: 'all', label: 'All Formats', icon: null },
            { id: 'educational', label: '💡 Useful & Educate', icon: <Lightbulb className="w-3 h-3 text-indigo-600" /> },
            { id: 'history', label: '🏛️ History & Origins', icon: <Landmark className="w-3 h-3 text-amber-700" /> },
            { id: 'viral', label: '💥 Viral Breaking', icon: <Flame className="w-3 h-3 text-rose-600" /> },
            { id: 'live', label: '🔴 Live Alerts', icon: <Radio className="w-3 h-3 text-emerald-600" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Search Bar & Action */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRealtimeSearch()}
              placeholder="Search news, topics, tags (e.g. 'Tesla Roadster flying car')..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleRealtimeSearch()}
            disabled={isSearchingLive || !searchQuery.trim()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shrink-0"
            title="Search real-time Google Web news on this topic"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSearchingLive ? 'animate-spin' : ''}`} />
            <span>{isSearchingLive ? 'Searching...' : 'Live Search'}</span>
          </button>
        </div>
      </div>

      {/* Quick Trending Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-500 px-1">
        <span className="font-bold text-slate-700 shrink-0">Viral Trends:</span>
        {[
          { label: '🚗 Tesla Roadster Flying Car', q: 'Tesla Roadster flying car' },
          { label: '🚀 OpenAI o3 Reasoning', q: 'OpenAI o3' },
          { label: '🎮 GTA 6 NPC Memory', q: 'GTA 6' },
          { label: '⚡ Unreal Engine 5.6', q: 'Unreal Engine' },
          { label: '🧬 Epigenetic Age Reversal', q: 'Epigenetic' },
          { label: '📉 Reverse Repo Drain', q: 'Reverse Repo' },
        ].map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSearchQuery(item.q);
              setSelectedSector('all');
            }}
            className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80 font-medium whitespace-nowrap transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Social Post Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white/50 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No stories match your current local filters</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `Search real-time Google Web news for "${searchQuery}" to pull live articles directly into your feed.`
              : 'Try switching sectors or click "Next Viral News Batch" to load a new set of stories.'}
          </p>

          <div className="flex items-center justify-center gap-2 pt-1">
            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => handleRealtimeSearch(searchQuery)}
                disabled={isSearchingLive}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSearchingLive ? 'animate-spin' : ''}`} />
                <span>
                  {isSearchingLive
                    ? `Searching Google Web for "${searchQuery}"...`
                    : `🌐 Search Live Google Web for "${searchQuery}"`}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedSector('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-2xl p-5 hover:border-blue-400 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md bg-white/90"
            >
              <div className="space-y-3">
                {/* Card Meta: Platform, Sector & Category Badge */}
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {getPlatformBadge(post.platform)}
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {getSectorIcon(post.sector)}
                      <span>{post.sector}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {getCategoryBadge(post.contentType)}
                    {/* Credibility Status Badge */}
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        post.credibility.status === 'verified'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                      title={`Credibility score: ${post.credibility.score}%`}
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{post.credibility.score}%</span>
                    </div>
                  </div>
                </div>

                {/* Author & Source Details */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900">{post.authorName}</span>
                    <span className="text-slate-400 text-[11px] font-mono">{post.authorHandle}</span>
                    {post.isVerifiedAuthor && (
                      <span className="text-blue-600 font-bold" title="Verified Author">✓</span>
                    )}
                    {post.publishedAt && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono font-semibold flex items-center gap-1 border border-emerald-200/60">
                        <Clock className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{formatPostTime(post.publishedAt)}</span>
                      </span>
                    )}
                  </div>

                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                    title="View genuine live post on social platform"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Title / Headline */}
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h4>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {post.summary}
                </p>

                {/* 💡 THE KNOWLEDGE DROP / EDUCATIONAL TAKEAWAY (Requested by user to educate people) */}
                {post.educationalTakeaway && (
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100/90 text-xs space-y-1">
                    <span className="font-bold text-indigo-900 flex items-center gap-1 text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>The Knowledge Drop (Why It Educates):</span>
                    </span>
                    <p className="text-indigo-950/80 leading-relaxed text-[11px]">
                      {post.educationalTakeaway}
                    </p>
                  </div>
                )}

                {/* 🏛️ HISTORICAL CONTEXT & ORIGINS (Requested by user) */}
                {post.historicalContext && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                    <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                      <Landmark className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>Historical Origin &amp; Precedent:</span>
                    </span>
                    <p className="text-amber-950/80 leading-relaxed text-[11px]">
                      {post.historicalContext}
                    </p>
                  </div>
                )}

                {/* 🔥 CREATOR HOOK & VIRAL ANGLE */}
                {post.whyViral && (
                  <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                    <span className="font-bold text-rose-900 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                      <Flame className="w-3 h-3 text-rose-600 shrink-0" />
                      <span>Viral Hook Angle:</span>
                    </span>
                    <p className="text-rose-950/80 text-[11px] mt-0.5">
                      {post.whyViral}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Real Engagement Metrics */}
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-slate-700 font-mono">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    {post.engagement.likesOrUpvotes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1 text-slate-700 font-mono">
                    <MessageSquare className="w-3 h-3 text-slate-400" />
                    {post.engagement.comments.toLocaleString()}
                  </span>
                  {post.engagement.viewsOrImpressions && (
                    <span className="flex items-center gap-1 text-slate-700 font-mono">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {post.engagement.viewsOrImpressions.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions: Verify Source & Convert to Script */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onVerifyPost(post)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                    title="Audit primary sources and corroborating citations"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Verify</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyPostHookAndTakeaway(post)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                    title="Copy headline hook and educational takeaway to clipboard"
                  >
                    {copiedId === post.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    <span className="hidden sm:inline">
                      {copiedId === post.id ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPostForScript(post)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  title="Load into Script & Packaging Lab to draft high-retention video script"
                >
                  <span>Create Script</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      )}
    </div>
  );
};
