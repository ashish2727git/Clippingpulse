import React, { useState } from 'react';
import { X, Key, CheckCircle2, Lock, Shield, ExternalLink } from 'lucide-react';
import { SocialCredentials } from '../types';

interface SocialCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: SocialCredentials;
  setCredentials: React.Dispatch<React.SetStateAction<SocialCredentials>>;
}

export const SocialCredentialsModal: React.FC<SocialCredentialsModalProps> = ({
  isOpen,
  onClose,
  credentials,
  setCredentials,
}) => {
  const [localCreds, setLocalCreds] = useState<SocialCredentials>(credentials);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setCredentials(localCreds);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Social Media Connectors &amp; Vault</h2>
              <p className="text-xs text-slate-500">
                Configure authenticated access for live X, Reddit, and YouTube feeds
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

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              ClipperPulse supports live syndication out-of-the-box. Providing optional tokens below upgrades your account to dedicated rate-limit-free authenticated platform endpoints.
            </p>
          </div>

          {/* X / Twitter Bearer Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">
                X / Twitter API Bearer Token
              </label>
              <a
                href="https://developer.x.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1 font-semibold"
              >
                <span>Get Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={localCreds.twitterBearerToken}
                onChange={(e) =>
                  setLocalCreds({ ...localCreds, twitterBearerToken: e.target.value })
                }
                placeholder="AAAAAAAAAAAAAAAAAAAAA..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Reddit Client ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">
                Reddit Client ID / App Key
              </label>
              <a
                href="https://www.reddit.com/prefs/apps"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1 font-semibold"
              >
                <span>Reddit Prefs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={localCreds.redditClientId}
                onChange={(e) =>
                  setLocalCreds({ ...localCreds, redditClientId: e.target.value })
                }
                placeholder="Reddit client_id"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* YouTube Data API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-700">
                YouTube Data API v3 Key
              </label>
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 text-[11px] flex items-center gap-1 font-semibold"
              >
                <span>Google Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={localCreds.youtubeApiKey}
                onChange={(e) =>
                  setLocalCreds({ ...localCreds, youtubeApiKey: e.target.value })
                }
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Credentials saved to local session securely!</span>
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
            Save Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
