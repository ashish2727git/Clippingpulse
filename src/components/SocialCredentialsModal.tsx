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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel bg-white/95 border border-rose-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F171D]">Social Media Connectors &amp; Vault</h2>
              <p className="text-xs text-[#7E7385]">
                Configure authenticated access for live X, Reddit, and YouTube feeds
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

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs text-[#4B414C] leading-relaxed flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              ClipperPulse supports live syndication out-of-the-box. Providing optional tokens below upgrades your account to dedicated rate-limit-free authenticated platform endpoints.
            </p>
          </div>

          {/* X / Twitter Bearer Token */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#4B414C]">
                X / Twitter API Bearer Token
              </label>
              <a
                href="https://developer.x.com"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 hover:text-rose-800 text-[11px] flex items-center gap-1 font-semibold"
              >
                <span>Get Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#A396A5] absolute left-3 top-3" />
              <input
                type="password"
                value={localCreds.twitterBearerToken}
                onChange={(e) =>
                  setLocalCreds({ ...localCreds, twitterBearerToken: e.target.value })
                }
                placeholder="AAAAAAAAAAAAAAAAAAAAA..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-rose-200 rounded-xl text-[#1F171D] font-mono placeholder:text-[#A396A5] focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* Reddit Client ID */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#4B414C]">
                Reddit Client ID / App Key
              </label>
              <a
                href="https://www.reddit.com/prefs/apps"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 hover:text-rose-800 text-[11px] flex items-center gap-1 font-semibold"
              >
                <span>Reddit Prefs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#A396A5] absolute left-3 top-3" />
              <input
                type="text"
                value={localCreds.redditClientId}
                onChange={(e) =>
                  setLocalCreds({ ...localCreds, redditClientId: e.target.value })
                }
                placeholder="Reddit client_id"
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-rose-200 rounded-xl text-[#1F171D] font-mono placeholder:text-[#A396A5] focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>

          {/* YouTube Data API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-[#4B414C]">
                YouTube Data API v3 Key
              </label>
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-rose-600 hover:text-rose-800 text-[11px] flex items-center gap-1 font-semibold"
              >
                <span>Google Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#A396A5] absolute left-3 top-3" />
              <input
                type="password"
                value={localCreds.youtubeApiKey}
                onChange={(e) =>
                  setLocalCreds({ ...localCreds, youtubeApiKey: e.target.value })
                }
                placeholder="AIzaSy..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-rose-200 rounded-xl text-[#1F171D] font-mono placeholder:text-[#A396A5] focus:outline-none focus:border-rose-400"
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
            Save Credentials
          </button>
        </div>
      </div>
    </div>
  );
};
