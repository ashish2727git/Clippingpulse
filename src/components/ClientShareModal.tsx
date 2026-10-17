import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Globe,
  Laptop,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ClientShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientShareModal: React.FC<ClientShareModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Live Shared preview URL hosted on Google Cloud Run
  const clientShareUrl =
    'https://ais-pre-fdxn6lz663p627z5gnp4kt-250551269412.asia-east1.run.app';

  const copyShareLink = () => {
    navigator.clipboard.writeText(clientShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/api/download/project-zip';
    link.download = `clipperpulse-standalone-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel bg-white/95 border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Client Access &amp; Standalone Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Send to clients via live web link or download the 1-click runnable package
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Method 1: Instant Client Link (No download required) */}
          <div className="p-5 rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Option 1: Live Cloud URL (Instant for Clients)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Zero Install Required
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Send this shared URL to your clients, executive reviewers, or teammates. It runs 24/7 in the cloud on any mobile, tablet, or desktop browser.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={clientShareUrl}
                className="flex-1 px-3.5 py-2 text-xs font-mono bg-white border border-slate-300 rounded-xl text-slate-800 select-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a
                href={clientShareUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Method 2: Download Standalone ZIP (Run on Client PC) */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Download className="w-4 h-4" />
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Option 2: Standalone Downloadable Package (.ZIP)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                ~215 KB Offline Bundle
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3.5 leading-relaxed">
              Download the complete self-contained project archive. Includes cross-platform 1-click launchers for Windows (<code className="font-mono text-indigo-700">run.bat</code>), macOS/Linux (<code className="font-mono text-indigo-700">run.sh</code>), and Docker.
            </p>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
              <span>
                {isDownloading
                  ? 'Packaging Distribution Bundle...'
                  : 'Download Complete Standalone App (clipperpulse-standalone.zip)'}
              </span>
            </button>
          </div>

          {/* Client Local Run Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-slate-600" />
              <span>How Clients Run It On Their Machines:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>🪟 Windows Users</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Unzip file and double-click <code className="font-bold text-indigo-600">run.bat</code>. Automatically launches browser!
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>🍎 Mac &amp; Linux</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Unzip and run <code className="font-bold text-indigo-600">./run.sh</code> in terminal. Checks node &amp; opens studio!
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>🐳 Docker Users</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Run <code className="font-bold text-indigo-600">docker compose up</code> for zero-dependency container deployment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Built-in LLM Defaulter:</strong> Even if your client has no OpenAI or Gemini API key, ClipperPulse's Autonomous Heuristics Engine generates full scripts, hooks, and clipping analysis automatically!
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            ClipperPulse Studio Standalone Build v1.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
