import React, { useState, useEffect } from 'react';
import {
  X,
  Cpu,
  Cloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  DownloadCloud,
  Copy,
  Check,
  Zap,
  Sparkles,
} from 'lucide-react';
import { EngineType, LocalLLMConfig } from '../types';

interface ModelEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  engine: EngineType;
  setEngine: (engine: EngineType) => void;
  localConfig: LocalLLMConfig;
  setLocalConfig: React.Dispatch<React.SetStateAction<LocalLLMConfig>>;
}

export const ModelEngineModal: React.FC<ModelEngineModalProps> = ({
  isOpen,
  onClose,
  engine,
  setEngine,
  localConfig,
  setLocalConfig,
}) => {
  const [endpoint, setEndpoint] = useState(localConfig.endpoint || 'http://localhost:11434');
  const [model, setModel] = useState(localConfig.model || 'llama3.2');
  const [testing, setTesting] = useState(false);
  const [isPullingModel, setIsPullingModel] = useState(false);
  const [pullMessage, setPullMessage] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [autoDefaulterMsg, setAutoDefaulterMsg] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    installedModels: string[];
    recommendedModel: string;
    hasRecommended: boolean;
  } | null>(null);

  const handleAutoDefault = async () => {
    setIsAutoDetecting(true);
    setAutoDefaulterMsg(null);
    try {
      const res = await fetch('/api/llm/default-config');
      const data = await res.json();
      if (data.defaultEngine) {
        setEngine(data.defaultEngine);
        if (data.localOnline) {
          setLocalConfig((prev) => ({
            ...prev,
            status: 'connected',
            endpoint: data.endpoint,
            model: data.recommendedModel,
            availableModels: data.installedModels,
          }));
          setEndpoint(data.endpoint);
          setModel(data.recommendedModel);
        }
        setAutoDefaulterMsg(`✓ ${data.statusMessage || `Defaulted to ${data.defaultEngine}`}`);
      }
    } catch {
      setAutoDefaulterMsg('✓ Autonomous Creative Engine active (Zero API key or local model required)');
    } finally {
      setIsAutoDetecting(false);
    }
  };

  // Auto-check Ollama status when modal opens
  useEffect(() => {
    if (isOpen) {
      checkOllamaStatus();
    }
  }, [isOpen]);

  const checkOllamaStatus = async () => {
    setTesting(true);
    try {
      const res = await fetch(`/api/local-llm/status?endpoint=${encodeURIComponent(endpoint)}`);
      const data = await res.json();
      setServerStatus(data);
      if (data.online) {
        setLocalConfig((prev) => ({
          ...prev,
          status: 'connected',
          availableModels: data.installedModels,
          model: data.installedModels.length > 0 ? data.installedModels[0] : 'llama3.2',
        }));
      } else {
        setLocalConfig((prev) => ({ ...prev, status: 'error' }));
      }
    } catch {
      setServerStatus({
        online: false,
        installedModels: [],
        recommendedModel: 'llama3.2',
        hasRecommended: false,
      });
    } finally {
      setTesting(false);
    }
  };

  const handlePullModel = async (modelToPull: string) => {
    setIsPullingModel(true);
    setPullMessage(null);
    try {
      const res = await fetch('/api/local-llm/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, model: modelToPull }),
      });
      const data = await res.json();
      if (data.success) {
        setPullMessage(`✓ Model ${modelToPull} successfully downloaded and ready!`);
        setModel(modelToPull);
        checkOllamaStatus();
      } else {
        setPullMessage(data.error || 'Failed to download model automatically.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPullMessage(`Download failed: ${msg}`);
    } finally {
      setIsPullingModel(false);
    }
  };

  const handleSave = () => {
    setLocalConfig((prev) => ({
      ...prev,
      endpoint,
      model,
    }));
    onClose();
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel bg-white/95 border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Engine &amp; Model Manager</h2>
              <p className="text-xs text-slate-500">
                1-click local Ollama connection or cloud Gemini intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* LLM Connection Auto-Defaulter Banner */}
          <div className="p-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/90 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">LLM Connection Auto-Defaulter</h3>
                  <p className="text-[11px] text-slate-500">Auto-probe local Ollama, LM Studio &amp; Gemini to select the optimal setup</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoDefault}
                disabled={isAutoDetecting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-60"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAutoDetecting ? 'animate-spin' : ''}`} />
                <span>{isAutoDetecting ? 'Probing...' : 'Auto-Default'}</span>
              </button>
            </div>

            {autoDefaulterMsg && (
              <div className="text-[11px] font-medium text-indigo-700 bg-indigo-100/70 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{autoDefaulterMsg}</span>
              </div>
            )}
          </div>

          {/* Engine Selector Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setEngine('local')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                engine === 'local'
                  ? 'border-blue-500 bg-blue-50/80 text-blue-950 shadow-xs ring-2 ring-blue-200'
                  : 'glass-card text-slate-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span>Local LLM (Ollama)</span>
                </div>
                {engine === 'local' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                100% private offline inference on your own hardware. Zero subscription cost.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEngine('gemini')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                engine === 'gemini'
                  ? 'border-blue-500 bg-blue-50/80 text-blue-950 shadow-xs ring-2 ring-blue-200'
                  : 'glass-card text-slate-700 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Cloud className="w-4 h-4 text-blue-600" />
                  <span>Cloud Gemini 2.5</span>
                </div>
                {engine === 'gemini' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-speed cloud multimodal reasoning with web-grounded live search.
              </p>
            </button>
          </div>

          {/* Local Ollama Section */}
          {engine === 'local' && (
            <div className="space-y-4 p-4 rounded-2xl border border-slate-200/80 bg-white/70">
              {/* Live Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      serverStatus?.online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-900">
                    {serverStatus?.online ? 'Ollama Detected & Active' : 'Ollama Offline'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">({endpoint})</span>
                </div>

                <button
                  type="button"
                  onClick={checkOllamaStatus}
                  disabled={testing}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                  <span>Re-check</span>
                </button>
              </div>

              {/* If Online: Model Selection & 1-Click Puller */}
              {serverStatus?.online ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Selected Active Model
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {serverStatus.installedModels.length > 0 ? (
                        serverStatus.installedModels.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))
                      ) : (
                        <option value="llama3.2">llama3.2 (not yet installed)</option>
                      )}
                    </select>
                  </div>

                  {/* 1-Click Model Installer */}
                  <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DownloadCloud className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Recommended Model: Llama 3.2 (3B)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePullModel('llama3.2')}
                        disabled={isPullingModel}
                        className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {isPullingModel && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>{isPullingModel ? 'Downloading...' : '1-Click Install'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Optimized for fast short-form video transcript extraction, high-speed title generation, and private execution.
                    </p>
                  </div>

                  {pullMessage && (
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
                      {pullMessage}
                    </div>
                  )}
                </div>
              ) : (
                /* If Offline: Clear Setup Instructions */
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Ollama is not running locally yet</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Follow these 2 simple steps to launch your local model, or switch to Cloud Gemini above for instant access.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px] font-bold">1</span>
                      <span>Download Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">ollama.com</a></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-[11px] font-bold">2</span>
                      <span>Run this command in terminal to launch Llama 3.2:</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-blue-300">
                      <span>ollama run llama3.2</span>
                      <button
                        type="button"
                        onClick={() => copyCommand('ollama run llama3.2')}
                        className="flex items-center gap-1 text-[11px] text-blue-300 hover:text-white cursor-pointer"
                      >
                        {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cloud Gemini View */}
          {engine === 'gemini' && (
            <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cloud Gemini 2.5 Flash Active</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                No local hardware setup, GPU drivers, or model weights required. Uses Google AI Studio cloud proxy with high precision multimodal understanding.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save &amp; Activate
          </button>
        </div>
      </div>
    </div>
  );
};
