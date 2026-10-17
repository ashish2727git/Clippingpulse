import React from 'react';
import {
  Video,
  Sparkles,
  Cpu,
  Film,
  TrendingUp,
  Sliders,
  FileText,
  Clapperboard,
  Dna,
  BookOpen,
  Search,
  Command,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { EngineType, LocalLLMConfig } from '../types';

interface HeaderProps {
  activeTab: 'studio' | 'trends' | 'scripts' | 'grading' | 'prompts' | 'science' | 'text2video' | 'notepad';
  setActiveTab: (tab: 'studio' | 'trends' | 'scripts' | 'grading' | 'prompts' | 'science' | 'text2video' | 'notepad') => void;
  engine: EngineType;
  localConfig: LocalLLMConfig;
  onOpenEngineModal: () => void;
  onAnalyzeClips: () => void;
  isAnalyzing: boolean;
  onOpenCommandPalette?: () => void;
  onOpenShortcuts?: () => void;
  onOpenClientShareModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  engine,
  localConfig,
  onOpenEngineModal,
  onAnalyzeClips,
  isAnalyzing,
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenClientShareModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-2xl border-b border-slate-200/75 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/20 ring-1 ring-blue-300/40">
            <Video className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Clipper<span className="text-blue-600">Pulse</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-300/60">
                PRO STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Viral Retention &amp; Scene Synthesis
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Segmented Control */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-blue-600" />
            <span>Studio Clipper</span>
          </button>

          <button
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'grading'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>Color &amp; Captions</span>
          </button>

          <button
            onClick={() => setActiveTab('trends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'trends'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Social Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('scripts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'scripts'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Script Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'prompts'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-blue-600" />
            <span>Video Prompts</span>
          </button>

          {/* Dedicated Creator Notepad & AI Co-Pilot Tab */}
          <button
            onClick={() => setActiveTab('notepad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'notepad'
                ? 'bg-white text-amber-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Creator Notepad</span>
          </button>

          {/* SIDE QUEST 1: BioScience Matrix */}
          <button
            onClick={() => setActiveTab('science')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'science'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Dna className="w-3.5 h-3.5 text-emerald-600" />
            <span>BioScience</span>
            <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60 uppercase">
              Quest
            </span>
          </button>

          {/* SIDE QUEST 2: Text to Video Generator */}
          <button
            onClick={() => setActiveTab('text2video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'text2video'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/70 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Text-to-Video</span>
            <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-indigo-100 text-indigo-800 border border-indigo-300/60 uppercase">
              Quest
            </span>
          </button>
        </nav>

        {/* Zone 3: AI Engine Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Open Command Palette (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <kbd className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Shortcuts Modal Trigger */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Client Share & Standalone Download Button */}
          {onOpenClientShareModal && (
            <button
              onClick={onOpenClientShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transition-all shadow-xs hover:shadow cursor-pointer"
              title="Share live web preview link with clients or download the 1-click standalone runnable package"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share &amp; Export</span>
              <span className="sm:hidden">Share</span>
            </button>
          )}

          {/* Engine Selector Button */}
          <button
            onClick={onOpenEngineModal}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/95 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-slate-900 transition-all shadow-xs"
            title="Configure AI Engine: Local Ollama / LM Studio or Cloud Gemini"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline text-slate-500">Model:</span>
            <span className="font-semibold text-slate-900">
              {engine === 'local' ? `Local (${localConfig.model || 'Ollama'})` : 'Gemini 2.5 Flash'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                engine === 'local'
                  ? localConfig.status === 'connected'
                    ? 'bg-emerald-500 ring-2 ring-emerald-200'
                    : 'bg-amber-500 ring-2 ring-amber-200'
                  : 'bg-emerald-500 ring-2 ring-emerald-200'
              }`}
            />
          </button>

          {/* Primary Action Button (Deep Sapphire with Specular Shimmer) */}
          <button
            onClick={onAnalyzeClips}
            disabled={isAnalyzing}
            className="shimmer-sweep flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Synthesizing...' : 'Extract Viral Clips'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
