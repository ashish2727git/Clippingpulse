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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel bg-white/95 border border-rose-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F171D]">Expert Domain Heuristics &amp; Psychology</h2>
              <p className="text-xs text-[#7E7385]">
                Preloaded editing heuristics, retention curves, and color science guiding both AI models
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

        {/* Filter Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-rose-100 flex items-center gap-2 overflow-x-auto">
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
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'bg-white text-[#6B6071] border border-rose-200 hover:bg-rose-50'
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
              className="glass-card p-4 rounded-2xl hover:border-rose-400 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.category === 'retention' && <Flame className="w-4 h-4 text-rose-500" />}
                  {item.category === 'color_science' && <Palette className="w-4 h-4 text-pink-500" />}
                  {item.category === 'algorithm' && <Target className="w-4 h-4 text-rose-600" />}
                  <h4 className="text-sm font-bold text-[#1F171D]">{item.title}</h4>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
                  {item.targetMetric}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-rose-100 text-xs">
                <span className="font-bold text-[#4B414C] block mb-0.5 text-[11px] uppercase tracking-wide">
                  Core Heuristic:
                </span>
                <p className="text-[#1F171D] leading-relaxed">{item.rule}</p>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-[#4B414C] block text-[11px] uppercase tracking-wide">
                  Mechanics:
                </span>
                <p className="text-xs text-[#6B6071] leading-relaxed">{item.mechanics}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-rose-100 bg-white/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
