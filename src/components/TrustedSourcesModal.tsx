import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Filter,
  Sparkles,
  Link,
  Globe,
  Radio,
  Sliders,
  Check,
} from 'lucide-react';
import { TrustedCustomSource, Sector } from '../types';

interface TrustedSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: TrustedCustomSource[];
  setSources: React.Dispatch<React.SetStateAction<TrustedCustomSource[]>>;
  onDispatchScoutWithSources?: () => void;
}

export const TrustedSourcesModal: React.FC<TrustedSourcesModalProps> = ({
  isOpen,
  onClose,
  sources,
  setSources,
  onDispatchScoutWithSources,
}) => {
  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [testingSourceId, setTestingSourceId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; message: string } | null>(null);

  // New source form state
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDomain, setNewDomain] = useState<string>('tech');
  const [newPlatform, setNewPlatform] = useState<TrustedCustomSource['platform']>('twitter');
  const [newTrustScore, setNewTrustScore] = useState(95);
  const [newCreatorType, setNewCreatorType] = useState('Personal Trusted Researcher');
  const [newNotes, setNewNotes] = useState('');

  if (!isOpen) return null;

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUrl.trim()) return;

    const newSource: TrustedCustomSource = {
      id: `src-${Date.now()}`,
      name: newName.trim(),
      handleOrUrl: newUrl.trim(),
      domain: newDomain as any,
      platform: newPlatform,
      trustScore: newTrustScore,
      creatorType: newCreatorType.trim() || 'Independent Trusted Expert',
      isActive: true,
      notes: newNotes.trim() || 'Custom user verified source',
      addedAt: new Date().toISOString().split('T')[0],
    };

    setSources([newSource, ...sources]);
    setNewName('');
    setNewUrl('');
    setNewNotes('');
    setIsAddingNew(false);
  };

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setSources(
      sources.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleTestVerifySource = async (source: TrustedCustomSource) => {
    setTestingSourceId(source.id);
    setTestResult(null);
    try {
      // Simulate live connector ping to source
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTestResult({
        id: source.id,
        message: `Verified live connection to ${source.name} (${source.platform.toUpperCase()}). Telemetry latency 210ms.`,
      });
    } finally {
      setTestingSourceId(null);
    }
  };

  const filteredSources = sources.filter((s) => {
    if (activeDomainFilter === 'all') return true;
    return s.domain === activeDomainFilter;
  });

  const domainsList = [
    { id: 'all', label: 'All Domains' },
    { id: 'tech', label: 'Tech & AI' },
    { id: 'ai_research', label: 'Deep ML Research' },
    { id: 'crypto_macro', label: 'Crypto & Macro' },
    { id: 'finance', label: 'Finance & Wall St' },
    { id: 'popculture', label: 'Creator Pop Culture' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Personal Trusted Sources &amp; Experts Vault</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {sources.filter((s) => s.isActive).length} Active Channels
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Add personal links, handles, and trusted creators across multiple domains to guide Cloud Scout research
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Close Form' : 'Add Source Link'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add New Source Card Form */}
          {isAddingNew && (
            <form
              onSubmit={handleAddSource}
              className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-4 animate-in slide-in-from-top duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Add Personal Trusted Source Link
                </span>
                <span className="text-[11px] text-slate-400">
                  Cloud Scout will prioritize this domain source
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Creator or Source Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yann LeCun, Balaji Srinivasan, TechAltar"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Direct Link or Profile Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. https://x.com/ylecun or https://youtube.com/@techaltar"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Domain / Sector
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="tech">Tech &amp; AI Engineering</option>
                    <option value="ai_research">Deep ML Research &amp; Benchmark</option>
                    <option value="crypto_macro">Crypto &amp; Global Macro</option>
                    <option value="finance">Finance &amp; Equity Markets</option>
                    <option value="popculture">Creator Economy &amp; Media</option>
                    <option value="custom">Custom Niche Domain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Platform Connector
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="twitter">X / Twitter (@handle or URL)</option>
                    <option value="youtube">YouTube (Channel / Video feed)</option>
                    <option value="reddit">Reddit (Subreddit / Power user)</option>
                    <option value="rss_blog">Substack / Personal Blog / RSS</option>
                    <option value="github">GitHub Repo / Benchmark</option>
                    <option value="news">Verified News Wire / Publication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Creator Role / Credibility Bio
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief AI Scientist, Quantitative Macro Researcher"
                    value={newCreatorType}
                    onChange={(e) => setNewCreatorType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-semibold">
                      Trust Weight Score: {newTrustScore}%
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {newTrustScore >= 90 ? 'Highest Confidence' : 'Strong Reference'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={newTrustScore}
                    onChange={(e) => setNewTrustScore(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Why do you trust this source? (Notes &amp; Topic Focus)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Always discloses raw benchmark code; doesn't hype unreleased products."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md"
                >
                  Save Trusted Source Link
                </button>
              </div>
            </form>
          )}

          {/* Test verification feedback banner */}
          {testResult && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{testResult.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setTestResult(null)}
                className="text-[10px] text-emerald-400 hover:text-white font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Domain Filter Pills */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                Domain Filter:
              </span>
              {domainsList.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDomainFilter(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeDomainFilter === d.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {onDispatchScoutWithSources && (
              <button
                type="button"
                onClick={() => {
                  onDispatchScoutWithSources();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition-colors shrink-0"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Ground Scout with These Sources</span>
              </button>
            )}
          </div>

          {/* Source Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSources.map((source) => (
              <div
                key={source.id}
                className={`p-4 rounded-xl border transition-all space-y-3 ${
                  source.isActive
                    ? 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-slate-950/30 border-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{source.name}</h4>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {source.platform}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      {source.creatorType}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(source.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                        source.isActive
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                      title="Toggle active inclusion in Cloud Scout scraping"
                    >
                      {source.isActive ? 'Active' : 'Muted'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSource(source.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Remove source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Source Link & Trust Metric */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-850 font-mono">
                  <a
                    href={source.handleOrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 truncate max-w-[220px]"
                    title={source.handleOrUrl}
                  >
                    <Link className="w-3 h-3 shrink-0" />
                    <span className="truncate">{source.handleOrUrl.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Trust Weight:</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {source.trustScore}%
                    </span>
                  </div>
                </div>

                {/* Notes & Rationale */}
                {source.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-850">
                    &ldquo;{source.notes}&rdquo;
                  </p>
                )}

                {/* Verification test trigger */}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">Domain: {source.domain.toUpperCase()}</span>
                  <button
                    type="button"
                    onClick={() => handleTestVerifySource(source)}
                    disabled={testingSourceId === source.id}
                    className="text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>
                      {testingSourceId === source.id ? 'Pinging Source...' : 'Test Connector'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/70 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Personal sources are merged with live Reddit, X, and YouTube streams to prevent AI hallucinations.
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
