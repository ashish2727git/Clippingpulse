import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  ArrowRight,
  Sparkles,
  Film,
  Sliders,
  TrendingUp,
  FileText,
  Clapperboard,
  BookOpen,
  Dna,
  ShieldAlert,
  Globe,
  HelpCircle,
  FolderOpen,
  Cpu,
  X,
} from 'lucide-react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
  onOpenShortcuts: () => void;
  onOpenEngineModal: () => void;
  onSwitchProject: (id: string) => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Navigation' | 'Creator Tools' | 'Quick Projects';
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenShortcuts,
  onOpenEngineModal,
  onSwitchProject,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const ITEMS: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-notepad',
      title: 'Creator Notepad & AI Co-Pilot',
      subtitle: 'Google Search research, mistake corrections & copyright radar',
      category: 'Navigation',
      shortcut: '6',
      icon: <BookOpen className="w-4 h-4 text-amber-500" />,
      action: () => {
        onSelectTab('notepad');
        onClose();
      },
    },
    {
      id: 'nav-trends',
      title: 'Social Trend Radar (10 Sectors)',
      subtitle: '100+ items across Tech, Gaming, Finance, Science, and World with Daily Refresher',
      category: 'Navigation',
      shortcut: '3',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      action: () => {
        onSelectTab('trends');
        onClose();
      },
    },
    {
      id: 'nav-cross-scanner',
      title: 'Multi-Sector Keyword & Idea Scanner',
      subtitle: 'Search any keyword or idea across all 10 sections for aggregated news & viral hooks',
      category: 'Creator Tools',
      shortcut: '⇧S',
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      action: () => {
        onSelectTab('trends');
        onClose();
      },
    },
    {
      id: 'nav-scripts',
      title: 'Script & Packaging Lab',
      subtitle: 'Hormozi, MrBeast, and Vox documentary short-form scripts',
      category: 'Navigation',
      shortcut: '4',
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      action: () => {
        onSelectTab('scripts');
        onClose();
      },
    },
    {
      id: 'nav-studio',
      title: 'Studio Clipper Monitor',
      subtitle: 'High-retention viral segment extractor and timeline monitor',
      category: 'Navigation',
      shortcut: '1',
      icon: <Film className="w-4 h-4 text-indigo-500" />,
      action: () => {
        onSelectTab('studio');
        onClose();
      },
    },
    {
      id: 'nav-subtitles',
      title: 'Color Correction & Subtitle Lab',
      subtitle: 'Kinetic word-by-word audio sync, multi-color cycling & presets',
      category: 'Navigation',
      shortcut: '2',
      icon: <Sliders className="w-4 h-4 text-purple-500" />,
      action: () => {
        onSelectTab('grading');
        onClose();
      },
    },
    {
      id: 'nav-prompts',
      title: 'Prompt Studio & After Effects Rig',
      subtitle: 'Cinematic camera moves, VFX layers and Foley sound design',
      category: 'Navigation',
      shortcut: '5',
      icon: <Clapperboard className="w-4 h-4 text-rose-500" />,
      action: () => {
        onSelectTab('prompts');
        onClose();
      },
    },
    {
      id: 'nav-science',
      title: 'BioScience Molecular Quest Lab',
      subtitle: 'AlphaFold 3D molecular structures & PubMed citations',
      category: 'Navigation',
      shortcut: '7',
      icon: <Dna className="w-4 h-4 text-teal-500" />,
      action: () => {
        onSelectTab('science');
        onClose();
      },
    },

    // Creator Tools & AI
    {
      id: 'tool-copyright',
      title: 'Check Copyright Strike Safety',
      subtitle: 'Inspect rightsholders, DMCA risks and safe CC-BY alternatives',
      category: 'Creator Tools',
      shortcut: '⇧C',
      icon: <ShieldAlert className="w-4 h-4 text-amber-600" />,
      action: () => {
        onSelectTab('notepad');
        onClose();
      },
    },
    {
      id: 'tool-multiplatform',
      title: 'Multi-Region Posting Schedule',
      subtitle: 'Optimize prime-time windows across US, EU, India, and LATAM',
      category: 'Creator Tools',
      shortcut: '⇧R',
      icon: <Globe className="w-4 h-4 text-sky-500" />,
      action: () => {
        onSelectTab('notepad');
        onClose();
      },
    },
    {
      id: 'tool-engine',
      title: 'Configure AI Intelligence Engine',
      subtitle: 'Switch between Cloud Gemini 2.5 and Local Ollama / LM Studio',
      category: 'Creator Tools',
      shortcut: '⇧E',
      icon: <Cpu className="w-4 h-4 text-slate-700" />,
      action: () => {
        onOpenEngineModal();
        onClose();
      },
    },
    {
      id: 'tool-shortcuts',
      title: 'Keyboard Shortcuts Cheat Sheet',
      subtitle: 'Inspect all global keyboard hotkeys and productivity keys',
      category: 'Creator Tools',
      shortcut: '?',
      icon: <HelpCircle className="w-4 h-4 text-slate-600" />,
      action: () => {
        onOpenShortcuts();
        onClose();
      },
    },

    // Switch Projects
    {
      id: 'proj-tech',
      title: 'Load "Tech Revolution" Project',
      subtitle: 'Local LLMs & frontier benchmarks demo project',
      category: 'Quick Projects',
      icon: <FolderOpen className="w-4 h-4 text-blue-600" />,
      action: () => {
        onSwitchProject('sample-tech');
        onClose();
      },
    },
    {
      id: 'proj-finance',
      title: 'Load "Finance Macro" Project',
      subtitle: 'Capital allocation & central banking liquidity video',
      category: 'Quick Projects',
      icon: <FolderOpen className="w-4 h-4 text-amber-600" />,
      action: () => {
        onSwitchProject('sample-finance');
        onClose();
      },
    },
  ];

  // Filter items
  const filteredItems = ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules, AI tools, projects, or shortcuts... (↑ ↓ Enter)"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-1">
              <Command className="w-6 h-6 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No actions or modules found</p>
              <p>Try searching for "notepad", "subtitles", "trends", or "copyright"</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/90 text-blue-950 font-medium'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg border shrink-0 ${
                        isSelected
                          ? 'bg-white border-blue-200 shadow-xs'
                          : 'bg-slate-100/70 border-slate-200/60'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate">{item.title}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-xs ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Tip */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono font-bold bg-white px-1 rounded border border-slate-200">↑</kbd>
              <kbd className="font-mono font-bold bg-white px-1 rounded border border-slate-200">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono font-bold bg-white px-1 rounded border border-slate-200">↵</kbd> Select
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Press <kbd className="bg-white px-1 rounded border border-slate-200 font-bold">?</kbd> for Shortcuts
          </span>
        </div>
      </div>
    </div>
  );
};
