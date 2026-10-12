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
} from 'lucide-react';
import {
  SocialPost,
  Sector,
  SocialPlatform,
  EngineType,
  LocalLLMConfig,
} from '../types';

interface TrendRadarProps {
  posts: SocialPost[];
  setPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  onSelectPostForScript: (post: SocialPost) => void;
  onVerifyPost: (post: SocialPost) => void;
  onOpenCredentialsModal: () => void;
  engine: EngineType;
  localConfig: LocalLLMConfig;
}

export const TrendRadar: React.FC<TrendRadarProps> = ({
  posts,
  setPosts,
  onSelectPostForScript,
  onVerifyPost,
  onOpenCredentialsModal,
}) => {
  const [selectedSector, setSelectedSector] = useState<'all' | Sector>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | SocialPlatform>('all');
  const [isFetchingFeeds, setIsFetchingFeeds] = useState(false);

  // Filter posts by sector & platform
  const filteredPosts = posts.filter((p) => {
    if (selectedSector !== 'all' && p.sector !== selectedSector) return false;
    if (selectedPlatform !== 'all' && p.platform !== selectedPlatform) return false;
    return true;
  });

  const handleFetchLiveFeeds = async () => {
    setIsFetchingFeeds(true);
    try {
      const activeSector = selectedSector === 'all' ? 'tech' : selectedSector;

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
        setPosts(newPosts);
      }
    } catch {
      // Keep existing posts
    } finally {
      setIsFetchingFeeds(false);
    }
  };

  const getPlatformBadge = (platform: SocialPlatform) => {
    switch (platform) {
      case 'twitter':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white">
            𝕏 Twitter
          </span>
        );
      case 'reddit':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
            Reddit
          </span>
        );
      case 'youtube':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
            YouTube
          </span>
        );
    }
  };

  const getSectorIcon = (sector: Sector) => {
    switch (sector) {
      case 'tech':
        return <Cpu className="w-3.5 h-3.5 text-blue-600" />;
      case 'finance':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case 'popculture':
        return <Tv className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Social Radar &amp; Source Verifier
              </h3>
              <p className="text-xs text-slate-500">
                Scrapes genuine trending topics from 𝕏, Reddit, &amp; YouTube with automated fact verification
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenCredentialsModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>API Credentials</span>
          </button>

          <button
            type="button"
            onClick={handleFetchLiveFeeds}
            disabled={isFetchingFeeds}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingFeeds ? 'animate-spin' : ''}`} />
            <span>{isFetchingFeeds ? 'Scraping Feeds...' : 'Refresh Live Feeds'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: Sector & Platform */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/70 border border-slate-200/80">
        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Sector:</span>
          {[
            { id: 'all', label: 'All Sectors' },
            { id: 'tech', label: 'Tech & AI' },
            { id: 'finance', label: 'Finance & Macro' },
            { id: 'popculture', label: 'Culture & Meta' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSelectedSector(sec.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedSector === sec.id
                  ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1">Channel:</span>
          {[
            { id: 'all', label: 'All' },
            { id: 'twitter', label: '𝕏 Twitter' },
            { id: 'reddit', label: 'Reddit' },
            { id: 'youtube', label: 'YouTube' },
          ].map((plat) => (
            <button
              key={plat.id}
              type="button"
              onClick={() => setSelectedPlatform(plat.id as any)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                selectedPlatform === plat.id
                  ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {plat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Social Post Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="glass-card rounded-2xl p-5 hover:border-blue-400 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="space-y-3">
              {/* Card Meta: Platform & Sector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPlatformBadge(post.platform)}
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {getSectorIcon(post.sector)}
                    <span>{post.sector}</span>
                  </span>
                </div>

                {/* Credibility Status Badge */}
                <div
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    post.credibility.status === 'verified'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span className="capitalize">{post.credibility.status}</span>
                </div>
              </div>

              {/* Author & Source Details */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{post.authorName}</span>
                  <span className="text-slate-400 text-[11px] font-mono">{post.authorHandle}</span>
                  {post.isVerifiedAuthor && (
                    <span className="text-blue-600 font-bold">✓</span>
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
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {post.summary}
              </p>

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
              <button
                type="button"
                onClick={() => onVerifyPost(post)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verify Source</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectPostForScript(post)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Write Script</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
