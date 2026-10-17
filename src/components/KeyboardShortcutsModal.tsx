import React from 'react';
import { X, Command, Keyboard, Zap, Film, FileText, BookOpen } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const SHORTCUT_GROUPS = [
    {
      title: 'Global Navigation',
      icon: <Command className="w-4 h-4 text-blue-600" />,
      shortcuts: [
        { keys: ['⌘', 'K'], label: 'Open Command Palette' },
        { keys: ['?'], label: 'Open Shortcuts Cheat Sheet' },
        { keys: ['1'], label: 'Switch to Studio Clipper' },
        { keys: ['2'], label: 'Switch to Color & Subtitle Lab' },
        { keys: ['3'], label: 'Switch to Social Trend Radar' },
        { keys: ['4'], label: 'Switch to Script Lab' },
        { keys: ['5'], label: 'Switch to Prompt Studio' },
        { keys: ['6'], label: 'Switch to Creator Notepad' },
        { keys: ['7'], label: 'Switch to BioScience Quest' },
      ],
    },
    {
      title: 'Creator Notepad & AI',
      icon: <BookOpen className="w-4 h-4 text-amber-600" />,
      shortcuts: [
        { keys: ['N'], label: 'Create New Draft Note' },
        { keys: ['⌘', 'Enter'], label: 'Run AI Mistake Correction' },
        { keys: ['⌘', 'S'], label: 'Save / Update Note Draft' },
        { keys: ['Esc'], label: 'Close Active Drawer / Modal' },
      ],
    },
    {
      title: 'Video Player & Monitor',
      icon: <Film className="w-4 h-4 text-purple-600" />,
      shortcuts: [
        { keys: ['Space'], label: 'Play / Pause Video (when unfocused)' },
        { keys: ['←'], label: 'Seek 5 Seconds Backward' },
        { keys: ['→'], label: 'Seek 5 Seconds Forward' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Keyboard Shortcuts Cheat Sheet</h3>
              <p className="text-[11px] text-slate-500">Accelerate your short-form video workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                {group.icon}
                <span>{group.title}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {group.shortcuts.map((sc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs"
                  >
                    <span className="text-slate-600 font-medium">{sc.label}</span>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      {sc.keys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className="font-mono text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-300 shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tip: Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300 font-bold">⌘K</kbd> anywhere to search all commands</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
