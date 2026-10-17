import React, { useState } from 'react';
import { X, BookOpen, Flame, Palette, Target } from 'lucide-react';
import { EXPERT_KNOWLEDGE_BASE } from '../data/sampleProjects';

interface ExpertKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpertKnowledgeModal: React.FC<ExpertKnowledgeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'retention' | 'color_science' | 'algorithm'>('all');

  if (!isOpen) return null;

  const filteredRules = EXPERT_KNOWLEDGE_BASE.filter((rule) => {
    if (selectedCategory === 'all') return true;
    return rule.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Expert Domain Heuristics &amp; Psychology</h2>
              <p className="text-xs text-slate-500">
                Preloaded editing heuristics, retention curves, and color science guiding both AI models
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

        {/* Filter Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Heuristics' },
            { id: 'retention', label: 'Retention Curves' },
            { id: 'color_science', label: 'Color Science' },
            { id: 'algorithm', label: 'Virality Psychology' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rules Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {filteredRules.map((item) => (
            <div
              key={item.id}
              className="glass-card p-4 rounded-2xl hover:border-blue-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.category === 'retention' && <Flame className="w-4 h-4 text-amber-500" />}
                  {item.category === 'color_science' && <Palette className="w-4 h-4 text-indigo-500" />}
                  {item.category === 'algorithm' && <Target className="w-4 h-4 text-blue-600" />}
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {item.targetMetric}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5 text-[11px] uppercase tracking-wide">
                  Core Heuristic:
                </span>
                <p className="text-slate-900 leading-relaxed">{item.rule}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                  Mechanics:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{item.mechanics}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-white/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
