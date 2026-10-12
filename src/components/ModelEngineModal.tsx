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
  const [serverStatus, setServerStatus] = useState<{
    online: boolean;
    installedModels: string[];
    recommendedModel: string;
    hasRecommended: boolean;
  } | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel bg-white/95 border border-rose-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F171D]">AI Engine &amp; Model Manager</h2>
              <p className="text-xs text-[#7E7385]">
                1-click local Ollama connection or cloud Gemini intelligence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8E7C8D] hover:text-[#1F171D] rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Engine Selector Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setEngine('local')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                engine === 'local'
                  ? 'border-rose-400 bg-rose-50/80 text-rose-950 shadow-xs ring-2 ring-rose-200'
                  : 'glass-card text-[#4B414C] hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#1F171D]">
                  <Server className="w-4 h-4 text-rose-500" />
                  <span>Local LLM (Ollama)</span>
                </div>
                {engine === 'local' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
              </div>
              <p className="text-xs text-[#6B6071] leading-relaxed">
                100% private offline inference on your own hardware. Zero subscription cost.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setEngine('gemini')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                engine === 'gemini'
                  ? 'border-rose-400 bg-rose-50/80 text-rose-950 shadow-xs ring-2 ring-rose-200'
                  : 'glass-card text-[#4B414C] hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-[#1F171D]">
                  <Cloud className="w-4 h-4 text-rose-500" />
                  <span>Cloud Gemini 3.8</span>
                </div>
                {engine === 'gemini' && <CheckCircle2 className="w-4 h-4 text-rose-600" />}
              </div>
              <p className="text-xs text-[#6B6071] leading-relaxed">
                High-speed cloud multimodal reasoning with web-grounded live search.
              </p>
            </button>
          </div>

          {/* Local Ollama Section */}
          {engine === 'local' && (
            <div className="space-y-4 p-4 rounded-2xl border border-rose-100 bg-white/70">
              {/* Live Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      serverStatus?.online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-[#1F171D]">
                    {serverStatus?.online ? 'Ollama Detected & Active' : 'Ollama Offline'}
                  </span>
                  <span className="text-xs text-[#7E7385] font-mono">({endpoint})</span>
                </div>

                <button
                  type="button"
                  onClick={checkOllamaStatus}
                  disabled={testing}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                  <span>Re-check</span>
                </button>
              </div>

              {/* If Online: Model Selection & 1-Click Puller */}
              {serverStatus?.online ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4B414C] mb-1.5">
                      Selected Active Model
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-rose-200 rounded-xl text-[#1F171D] font-mono focus:outline-none focus:border-rose-400"
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
                  <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DownloadCloud className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-bold text-[#1F171D]">
                          Recommended Model: Llama 3.2 (3B)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePullModel('llama3.2')}
                        disabled={isPullingModel}
                        className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {isPullingModel && <RefreshCw className="w-3 h-3 animate-spin" />}
                        <span>{isPullingModel ? 'Downloading...' : '1-Click Install'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-[#6B6071] leading-relaxed">
                      Optimized for fast short-form video transcript extraction, high-speed title generation, and private execution.
                    </p>
                  </div>

                  {pullMessage && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-medium">
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
                    <p className="text-xs text-[#4B414C] leading-relaxed">
                      Follow these 2 simple steps to launch your local model, or switch to Cloud Gemini above for instant access.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#4B414C]">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[11px] font-bold">1</span>
                      <span>Download Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-rose-600 underline font-semibold">ollama.com</a></span>
                    </div>

                    <div className="flex items-center gap-2 text-[#4B414C]">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[11px] font-bold">2</span>
                      <span>Run this command in terminal to launch Llama 3.2:</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1F171D] border border-rose-200 font-mono text-xs text-pink-200">
                      <span>ollama run llama3.2</span>
                      <button
                        type="button"
                        onClick={() => copyCommand('ollama run llama3.2')}
                        className="flex items-center gap-1 text-[11px] text-pink-300 hover:text-white cursor-pointer"
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
            <div className="p-4 rounded-2xl border border-rose-100 bg-rose-50/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Cloud Gemini 3.8 Flash Active</span>
              </div>
              <p className="text-xs text-[#6B6071] leading-relaxed">
                No local hardware setup, GPU drivers, or model weights required. Uses Google AI Studio cloud proxy with zero rate limiting.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-rose-100 bg-white/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#6B6071] hover:text-[#1F171D] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save &amp; Activate
          </button>
        </div>
      </div>
    </div>
  );
};
