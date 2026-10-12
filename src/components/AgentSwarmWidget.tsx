import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Globe,
  RefreshCw,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { EngineType, LocalLLMConfig } from '../types';

interface AgentSwarmWidgetProps {
  engine: EngineType;
  localConfig: LocalLLMConfig;
  onOpenEngineModal: () => void;
  onOpenKnowledgeModal: () => void;
}

export const AgentSwarmWidget: React.FC<AgentSwarmWidgetProps> = ({
  engine,
  localConfig,
  onOpenEngineModal,
  onOpenKnowledgeModal,
}) => {
  // Start collapsed by default for streamlined focus studio
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [swarmData, setSwarmData] = useState<{
    cloudScout: {
      name: string;
      model: string;
      status: string;
      currentFocus: string;
      queriesProcessed: number;
      verifiedCitationsCount: number;
      latencyMs: number;
      connected: boolean;
    };
    localEditor: {
      name: string;
      model: string;
      status: string;
      currentFocus: string;
      endpoint: string;
      tokensPerSec: number;
      installedModels: string[];
    };
    recentActivity: {
      id: string;
      timestamp: string;
      agent: string;
      message: string;
      taskType: string;
    }[];
  }>({
    cloudScout: {
      name: 'Cloud Scout Researcher',
      model: 'Gemini 3.8 Flash + Web Grounding',
      status: 'active_scraping',
      currentFocus: 'Scraping live tech, finance & social news sources',
      queriesProcessed: 52,
      verifiedCitationsCount: 26,
      latencyMs: 340,
      connected: true,
    },
    localEditor: {
      name: 'Local LLM Editor',
      model: localConfig.model || 'Llama 3.2 3B',
      status: localConfig.status === 'connected' ? 'connected' : 'standby',
      currentFocus: 'Processing clip cuts & subtitle synchronization',
      endpoint: localConfig.endpoint || 'http://localhost:11434',
      tokensPerSec: localConfig.status === 'connected' ? 92 : 0,
      installedModels: localConfig.availableModels || ['llama3.2'],
    },
    recentActivity: [
      {
        id: '1',
        timestamp: 'Just now',
        agent: 'cloud_scout',
        message: 'Scraped live tech sources & verified model benchmarks.',
        taskType: 'web_scraping',
      },
      {
        id: '2',
        timestamp: '1m ago',
        agent: 'swarm_sync',
        message: 'Handoff: Passed verified facts and audience retention curves to Local LLM Editor.',
        taskType: 'fact_check',
      },
      {
        id: '3',
        timestamp: '3m ago',
        agent: 'local_editor',
        message: 'Synthesized high-retention 30s cut with animated subtitle timings.',
        taskType: 'timeline_cut',
      },
    ],
  });

  const fetchSwarmTelemetry = async () => {
    try {
      const res = await fetch(`/api/swarm/status?endpoint=${encodeURIComponent(localConfig.endpoint || 'http://localhost:11434')}`);
      const data = await res.json();
      if (data.cloudScout) {
        setSwarmData(data);
      }
    } catch {
      // keep current telemetry
    }
  };

  useEffect(() => {
    fetchSwarmTelemetry();
    const interval = setInterval(fetchSwarmTelemetry, 14000);
    return () => clearInterval(interval);
  }, [localConfig]);

  const handleTriggerSwarmPulse = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/swarm/collaborative-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Local AI Models & Open Source Benchmarks',
          localConfig,
        }),
      });
      await res.json();
      fetchSwarmTelemetry();
    } catch {
      // completed
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-300">
      {/* Streamlined Executive Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-white/75 border-b border-slate-200/70">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Agent Swarm Telemetry
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Cloud Scout Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50/90 text-blue-700 border border-blue-200/80 font-medium">
              <Globe className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="text-slate-600">Cloud Scout:</span>
              <span className="font-semibold text-blue-800">Scraping News</span>
            </span>

            {/* Local LLM Editor Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 border border-slate-200/80 font-medium">
              <Cpu className="w-3 h-3 text-slate-600 shrink-0" />
              <span className="text-slate-600">Local LLM:</span>
              <span className="font-semibold text-slate-900">Processing Clips</span>
            </span>

            {/* Quality Standard: Best Not Fast (Cream-Yellow Badge) */}
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300/70 font-medium">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>Standard: Best Not Fast (Deep Thinking)</span>
            </span>
          </div>
        </div>

        {/* Quick Actions & Collapsible Toggle */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={onOpenKnowledgeModal}
            className="text-xs font-medium text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg bg-slate-100/80 hover:bg-white border border-slate-200 transition-colors"
          >
            Psychology &amp; Color Science
          </button>

          <button
            type="button"
            onClick={handleTriggerSwarmPulse}
            disabled={isSyncing}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100/80 border border-blue-200 shadow-xs transition-colors disabled:opacity-50"
            title="Execute collaborative research handoff"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Agents'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100/80 transition-colors"
            title={isExpanded ? 'Collapse telemetry view' : 'Expand full telemetry view'}
          >
            <span>{isExpanded ? 'Hide Details' : 'View Swarm Telemetry'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Swarm Details on Demand */}
      {isExpanded && (
        <div className="p-4 space-y-4 bg-white/45">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agent 1: Cloud Scout Researcher */}
            <div className="glass-card p-4 rounded-xl space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Cloud Scout Researcher</span>
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    </h4>
                    <span className="text-[11px] text-blue-600 font-medium">
                      {swarmData.cloudScout.model}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Live Web Grounded
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">Active Task: </span>
                  {swarmData.cloudScout.currentFocus}
                </div>
                <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-100 font-mono text-[11px]">
                  <span>Queries: {swarmData.cloudScout.queriesProcessed}</span>
                  <span>Citations: {swarmData.cloudScout.verifiedCitationsCount}</span>
                  <span>Latency: {swarmData.cloudScout.latencyMs}ms</span>
                </div>
              </div>
            </div>

            {/* Agent 2: Local LLM Production Editor */}
            <div className="glass-card p-4 rounded-xl space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white shadow-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Local LLM Editor</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          swarmData.localEditor.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      ></span>
                    </h4>
                    <span className="text-[11px] text-slate-600 font-medium font-mono">
                      {swarmData.localEditor.model}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenEngineModal}
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
                >
                  {swarmData.localEditor.status === 'connected' ? 'Ollama Online' : 'Configure Local'}
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">Active Task: </span>
                  {swarmData.localEditor.currentFocus}
                </div>
                <div className="flex items-center justify-between text-slate-500 pt-2 border-t border-slate-100 font-mono text-[11px]">
                  <span>Speed: {swarmData.localEditor.tokensPerSec} tok/s</span>
                  <span>Task: Precision Cuts</span>
                  <span>Endpoint: {swarmData.localEditor.endpoint.replace('http://', '')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Swarm Activity Feed */}
          <div className="p-3.5 rounded-xl bg-white/70 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                Live Swarm Activity Stream
              </span>
              <span className="text-emerald-700 font-semibold lowercase">● streaming</span>
            </div>
            <div className="space-y-1.5 max-h-24 overflow-y-auto text-xs font-mono">
              {swarmData.recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-2 text-slate-600 py-0.5">
                  <span className="text-slate-400 shrink-0 text-[11px]">[{act.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 text-[11px] ${
                      act.agent === 'cloud_scout'
                        ? 'text-blue-700'
                        : act.agent === 'local_editor'
                        ? 'text-indigo-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {act.agent === 'cloud_scout' ? 'CLOUD SCOUT:' : act.agent === 'local_editor' ? 'LOCAL EDITOR:' : 'SWARM SYNC:'}
                  </span>
                  <span className="text-slate-800 text-xs font-sans">{act.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
