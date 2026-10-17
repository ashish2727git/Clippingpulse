import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SourceVerificationReport, SocialPost } from '../types';

interface SourceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SourceVerificationReport | null;
  post: SocialPost | null;
  onSendToScript: (post: SocialPost) => void;
}

export const SourceVerificationModal: React.FC<SourceVerificationModalProps> = ({
  isOpen,
  onClose,
  report,
  post,
  onSendToScript,
}) => {
  if (!isOpen || !report || !post) return null;

  const isVerified = report.credibilityScore >= 80;
  const isDeveloping = report.credibilityScore >= 60 && report.credibilityScore < 80;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel bg-white/95 border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isVerified
                  ? 'bg-emerald-50 text-emerald-600'
                  : isDeveloping
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Source Credibility &amp; Fact Audit</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isVerified
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : isDeveloping
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {report.status} ({report.credibilityScore}% Score)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Cross-referenced against verified public reporting and primary technical documentation
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

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Post Claim Header */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Claim Reported by {post.authorName} ({post.authorHandle})</span>
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold"
              >
                <span>Original {post.platform} Post</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm font-bold text-slate-900 leading-snug">
              &ldquo;{post.title}&rdquo;
            </p>
          </div>

          {/* AI Verdict Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Editorial Verdict Summary
            </span>
            <p className="leading-relaxed text-slate-700">
              {report.verdictSummary}
            </p>
          </div>

          {/* Corroborated Primary Sources */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Primary Sources &amp; Documentation Links
            </h4>
            <div className="space-y-1.5">
              {report.primarySources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {source.sourceType.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {source.title}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Supporting Evidence vs Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Supporting Evidence */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Supporting Evidence:
              </span>
              <ul className="space-y-1 text-slate-600 text-xs list-disc list-inside">
                {report.supportingEvidence.map((ev, i) => (
                  <li key={i} className="leading-relaxed">{ev}</li>
                ))}
              </ul>
            </div>

            {/* Nuances & Caveats */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Reporting Nuances &amp; Context:
              </span>
              <ul className="space-y-1 text-slate-600 text-xs list-disc list-inside">
                {report.risksOrBiases.map((rk, i) => (
                  <li key={i} className="leading-relaxed">{rk}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Creator Disclaimer */}
          {report.suggestedDisclaimer && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Info className="w-3 h-3 text-amber-600" />
                Recommended Video Caption Disclaimer:
              </span>
              <p className="italic text-slate-800">
                &ldquo;{report.suggestedDisclaimer}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white/80">
          <span className="text-xs text-slate-500">
            Credibility verified for production video publication
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onSendToScript(post);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Convert to Script &amp; Clip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
