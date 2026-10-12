import React, { useState } from 'react';
import { Search, Tag, Eye, Sparkles, Check, Edit2 } from 'lucide-react';
import { TranscriptSegment } from '../types';

interface TranscriptEditorProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  targetKeywords: string[];
  setTargetKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  visualEventCues: string;
  setVisualEventCues: (val: string) => void;
  onUpdateSegment: (id: string, newText: string) => void;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  segments,
  currentTime,
  onSeek,
  targetKeywords,
  setTargetKeywords,
  visualEventCues,
  setVisualEventCues,
  onUpdateSegment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Preset viral hook trigger keywords
  const VIRAL_TRIGGER_PRESETS = [
    'Breakthrough',
    'Secret',
    'Truth',
    'Warning',
    'Monopoly',
    'Mistake',
    'Billion',
    'Shocking',
  ];

  const handleToggleKeyword = (kw: string) => {
    if (targetKeywords.includes(kw)) {
      setTargetKeywords(targetKeywords.filter((k) => k !== kw));
    } else {
      setTargetKeywords([...targetKeywords, kw]);
    }
  };

  const handleAddCustomKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordInput.trim()) return;
    if (!targetKeywords.includes(newKeywordInput.trim())) {
      setTargetKeywords([...targetKeywords, newKeywordInput.trim()]);
    }
    setNewKeywordInput('');
  };

  const startEdit = (seg: TranscriptSegment) => {
    setEditingId(seg.id);
    setEditText(seg.text);
  };

  const saveEdit = (id: string) => {
    onUpdateSegment(id, editText);
    setEditingId(null);
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter segments based on search
  const filteredSegments = segments.filter((seg) => {
    if (!searchQuery) return true;
    return seg.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl flex flex-col h-[520px]">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200/80 bg-white/85 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Transcript &amp; Cut Triggers
            </h3>
            <span className="text-xs text-slate-500">({segments.length} segments)</span>
          </div>
          <span className="text-[11px] text-slate-500">Click row to seek video</span>
        </div>

        {/* Keyword Filter & Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-blue-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript phrases or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 shadow-xs"
          />
        </div>

        {/* Target Keyword Tags & AI Cue Injection */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Tag className="w-3 h-3 text-blue-600" />
              Clip Cut Target Keywords:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 max-h-16 overflow-y-auto">
            {VIRAL_TRIGGER_PRESETS.map((kw) => {
              const isSelected = targetKeywords.includes(kw);
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => handleToggleKeyword(kw)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-700'
                  }`}
                >
                  {isSelected && '✓ '}
                  {kw}
                </button>
              );
            })}

            {/* Custom Keyword Adder */}
            <form onSubmit={handleAddCustomKeyword} className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                placeholder="+ keyword"
                className="w-20 px-2 py-0.5 text-[11px] bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </form>
          </div>
        </div>

        {/* Visual Event Directives */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <input
              type="text"
              value={visualEventCues}
              onChange={(e) => setVisualEventCues(e.target.value)}
              placeholder="Visual cues (e.g. eye contact, animated slide graph reveal)..."
              className="w-full bg-transparent border-none text-[11px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Segments List Scroll View */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-100 bg-white/45">
        {filteredSegments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No transcript segments match &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filteredSegments.map((seg) => {
            const isActive = currentTime >= seg.start && currentTime <= seg.end;
            const isEditing = editingId === seg.id;

            // Highlight target keywords in text
            const containsTargetKeyword = targetKeywords.some((kw) =>
              seg.text.toLowerCase().includes(kw.toLowerCase())
            );

            return (
              <div
                key={seg.id}
                onClick={() => !isEditing && onSeek(seg.start)}
                className={`p-2.5 rounded-xl cursor-pointer transition-all text-xs group ${
                  isActive
                    ? 'bg-blue-50/90 border border-blue-300 text-blue-950 shadow-xs font-medium'
                    : containsTargetKeyword
                    ? 'bg-amber-50/60 border border-amber-200/80 hover:bg-amber-50 text-slate-900'
                    : 'hover:bg-white/80 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`tabular-time font-mono text-[11px] px-2 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 border border-slate-200 group-hover:text-blue-700'
                      }`}
                    >
                      {formatSeconds(seg.start)} - {formatSeconds(seg.end)}
                    </span>
                    {seg.speaker && (
                      <span className="text-[11px] font-semibold text-slate-500">
                        {seg.speaker}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {containsTargetKeyword && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-100 text-amber-900 border border-amber-200 font-bold">
                        ★ Keyword Spike
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(seg);
                      }}
                      className="p-1 hover:text-blue-700 text-slate-500 rounded-lg hover:bg-slate-100"
                      title="Edit transcript line"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-blue-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(seg.id)}
                      className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="leading-relaxed">
                    {seg.text}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
