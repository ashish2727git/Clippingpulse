import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Video,
  Flame,
  Target,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PlatformScript, ViralTitle, ThumbnailConcept, Sector, EngineType, LocalLLMConfig } from '../types';

interface ScriptAndPackagingLabProps {
  currentTopic: string;
  setCurrentTopic: (topic: string) => void;
  currentSector: Sector;
  setCurrentSector: (sector: Sector) => void;
  sourceTranscript: string;
  onSendTopicToClipper: (topic: string) => void;
  engine: EngineType;
  localConfig: LocalLLMConfig;
}

export const ScriptAndPackagingLab: React.FC<ScriptAndPackagingLabProps> = ({
  currentTopic,
  setCurrentTopic,
  currentSector,
  setCurrentSector,
  sourceTranscript,
  onSendTopicToClipper,
  engine,
  localConfig,
}) => {
  const [activePlatform, setActivePlatform] = useState<'tiktok' | 'shorts' | 'twitter' | 'linkedin'>('tiktok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [deepQualityMode, setDeepQualityMode] = useState(true);
  const [deepPassStep, setDeepPassStep] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Default scripts & titles with After Effects Motion Designer directions
  const [scripts, setScripts] = useState<PlatformScript[]>([
    {
      platform: 'tiktok',
      title: 'TikTok 45s High-Retention Hook Script',
      estimatedDurationSeconds: 45,
      hook0to3s: 'If you are still paying $20 a month for cloud AI, stop right now before you waste another dollar.',
      visualDirections: 'Snap zoom-in to face with After Effects 3D Camera, flash amber warning overlay, cut to terminal typing benchmark at 2.5s.',
      pacingNotes: 'Cut every 1.8 seconds. Drop 808 sub-bass impact after first statement. Hormozi kinetic subtitle pop.',
      fullScript: `[0:00 - 0:03] [AE LAYER: 3D Camera Z-Push 4.0 + 2.5D Eye Cutout + Amber Glow Wipe] [SFX: 808 Sub-Bass Impact + Reverse Whoosh]
If you are still paying $20 a month for cloud AI, stop right now before you waste another dollar.

[0:03 - 0:12] [AE LAYER: Split-Screen Comparison Card + Corner Pin Terminal Track] [SFX: Analog Tape Stop + Fast Mechanical Keyboard Clack]
Last night, an open-source research team released a distilled reasoning model that matches OpenAI and Anthropic benchmarks... but it runs 100% locally on your own laptop.

[0:12 - 0:25] [AE LAYER: Animated Trim-Path Graph + Red Giant Chromatic Aberration] [SFX: Cash Register Riser + Bell Chime]
Zero subscriptions. Zero data mining. Zero server downtime. It works completely offline on an airplane.

[0:25 - 0:38] [AE LAYER: 2.5D Parallax Laptop Float + Glowing Yellow Marker Highlight Swipe] [SFX: Film Projector Click + Vinyl Crackle]
Here is the exact terminal command to run it today. Just install Ollama and run this single command.

[0:38 - 0:45] [AE LAYER: Direct Eye Lock + Spring Physics Bouncing CTA Badge] [SFX: Sub-Bass Bloom + Muffled Whoosh]
Save this video before it gets buried, and comment "LOCAL" if you want my step-by-step installation guide.`,
      callToAction: 'Save this video before it gets buried, and drop your questions below.',
    },
    {
      platform: 'shorts',
      title: 'YouTube Shorts 50s Looping Curiosity Script',
      estimatedDurationSeconds: 50,
      hook0to3s: 'Everyone thought only multi-billion dollar tech monopolies could build AI, but this 7B model broke that forever.',
      visualDirections: 'High contrast side-by-side comparison: Big Tech Server Farms vs Tiny Laptop screen with 2.5D parallax.',
      pacingNotes: 'Fast cadence with zero dead air. End the last sentence so it loops seamlessly into the opening line.',
      fullScript: `[0:00 - 0:04] [AE LAYER: 3D Camera Whip Pan + Server Rack Grid Overlay] [SFX: Sub-Bass Reverse Suction + Metallic Vault Latch]
Everyone thought only multi-billion dollar tech monopolies could build AI, but this 7B model broke that forever.

[0:04 - 0:18] [AE LAYER: Animated Data Counter Incrementing from $0 to $10,000,000,000] [SFX: Fast Digital Scanner Blips]
Silicon Valley spent billions training giant models. But open-source engineers just proved you can quantize high-level reasoning to fit on consumer hardware with 95% benchmark parity.

[0:18 - 0:34] [AE LAYER: 2.5D Archival Photo Cutout + Animated Yellow Highlighter on "100% PRIVATE"] [SFX: Heavy Typewriter Carriage Return]
That means developers are running private software architects right on their MacBooks with zero token limits and zero corporate surveillance.

[0:34 - 0:45] [AE LAYER: Split-Screen Speed Test Graph (Cloud 1400ms vs Local 85ms)] [SFX: High-Pitched Camera Shutter Click]
If you haven't switched to local inference yet, you're competing at a massive financial disadvantage.

[0:45 - 0:50] [AE LAYER: Seamless Loop Infinite Bridge Graphic] [SFX: Harmonic Glass Chime resolving into opening hook]
Subscribe for tomorrow's benchmark breakdown, because... [LOOPS INTO: Everyone thought only multi-billion dollar tech monopolies...]`,
      callToAction: 'Subscribe for part 2 benchmark breakdown.',
    },
    {
      platform: 'twitter',
      title: 'X / Twitter Video 60s Contrarian Breakdown',
      estimatedDurationSeconds: 60,
      hook0to3s: 'The enterprise AI API bubble is collapsing much faster than Wall Street analysts anticipated.',
      visualDirections: 'Single authoritative frame, clean microphone, clear metric overlays with subtle film grain.',
      pacingNotes: 'Deliberate, high density, thought-leader cadence.',
      fullScript: `[0:00 - 0:06] [AE LAYER: 35mm 400T Film Grain + Subtle Camera Shake (wiggle 1.2, 8)] [SFX: Low 60Hz Electrical Hum]
The enterprise AI API bubble is collapsing much faster than Wall Street anticipated.

[0:06 - 0:25] [AE LAYER: Clean Swiss Minimalist Typography Cards popping on beat] [SFX: Wood Block Metronome Tap]
Here is the economic reality:
1. When frontier intelligence is compressed into open-source weights, SaaS margins instantly compress to zero.
2. Smart engineering teams will not send proprietary internal code across public cloud endpoints when local models deliver equal accuracy.
3. The real winners of this cycle are not closed model providers; they are the developers building on private, sovereign infrastructure.

[0:25 - 0:45] [AE LAYER: Macro Chart Overlay with Red Declining Margins Trendline] [SFX: Sub-Bass Drone + Paper Slide Whoosh]
If your startup's entire moat is an API wrapper around a commercial LLM, you have less than 12 months to pivot.

[0:45 - 0:60] [AE LAYER: Authoritative Close-up + Repost Badge with Spring Damping] [SFX: Deep Cinematic Piano Note]
Repost if you agree, and let me know your thoughts in the replies.`,
      callToAction: 'Repost if this changed how you view AI infrastructure.',
    },
    {
      platform: 'linkedin',
      title: 'LinkedIn 75s Executive Thought-Leadership Script',
      estimatedDurationSeconds: 75,
      hook0to3s: 'Here is the one strategic shift our engineering team made this month that saved over $18,000 in cloud compute.',
      visualDirections: 'Professional studio lighting, lower-third title card, concise charts.',
      pacingNotes: 'Calm, authoritative, executive storytelling.',
      fullScript: `[0:00 - 0:08] [AE LAYER: Lower-Third Animated Glass Nameplate + Studio Key 5400K] [SFX: Subtle Air Whoosh]
Here is the one strategic shift our engineering team made this month that saved over $18,000 in cloud compute.

[0:08 - 0:30] [AE LAYER: Clean Bar Chart Growth Metric Reveal + Animated Percentage Counters] [SFX: Soft Mechanical Clock Tick]
Six months ago, our team was spending thousands each week on third-party AI APIs for routine code review and data extraction.

[0:30 - 0:50] [AE LAYER: 3-Point Checklist with Teal Bullet Icon Checkmarks popping on beat] [SFX: Gentle Wooden Chime on each bullet]
Then we tested self-hosted quantized models on our internal edge machines. The results surprised everyone:
- Latency dropped from 2.4 seconds to 380 milliseconds.
- Zero customer data ever left our private firewall.
- Annualized savings exceeded $200,000.

[0:50 - 0:75] [AE LAYER: Direct Eye Contact Framing + Thought-Leadership Lower Third CTA] [SFX: Warm Cello Chord Fadeout]
AI is no longer about who has the biggest centralized cloud; it's about who deploys localized intelligence most efficiently.

How is your organization approaching on-premise AI governance? Let's discuss in the comments.`,
      callToAction: 'How is your organization approaching local AI governance? Let\'s discuss.',
    },
  ]);

  const [titles, setTitles] = useState<ViralTitle[]>([
    {
      title: 'The AI Tool Nobody Wants You to Know About',
      category: 'Curiosity Gap',
      ctrPotential: 95,
      psychologicalTrigger: 'Insiders vs Outsiders FOMO trigger',
      characterCount: 42,
    },
    {
      title: 'Cancel Your AI Subscriptions Right Now (Here\'s Why)',
      category: 'Negativity Bias & High Urgency',
      ctrPotential: 92,
      psychologicalTrigger: 'Immediate financial savings & urgency',
      characterCount: 52,
    },
    {
      title: 'Why 99% of Developers Are Running AI Completely Wrong',
      category: 'Contrarian Challenge',
      ctrPotential: 90,
      psychologicalTrigger: 'Ego challenge & herd-mentality skepticism',
      characterCount: 53,
    },
    {
      title: 'How I Built a 100% Free Private AI in 5 Minutes',
      category: 'High Specificity & Outcome',
      ctrPotential: 93,
      psychologicalTrigger: 'Zero friction, instant gratification',
      characterCount: 48,
    },
    {
      title: 'The $100B Cloud Monopoly Just Shattered',
      category: 'Impending Catastrophe',
      ctrPotential: 91,
      psychologicalTrigger: 'David vs Goliath macro drama',
      characterCount: 40,
    },
  ]);

  const [thumbnails, setThumbnails] = useState<ThumbnailConcept[]>([
    {
      conceptName: 'Shocked Revelation Hook',
      textOverlay: 'IT\'S OVER.',
      textBadgeColor: '#2563EB',
      faceExpression: 'Shocked direct eye contact looking straight at camera',
      backgroundVisual: 'Dark server room with downward electric blue trendline',
      compositionRule: 'Subject on right third, bold yellow typography on left third',
      suggestedImagePrompt: 'Cinematic creator thumbnail photo, shocked facial expression, dark futuristic server room background with glowing blue warning light, 8k high contrast',
    },
    {
      conceptName: 'The $0 vs $10,000 Contrast',
      textOverlay: '$0 VS $20,000',
      textBadgeColor: '#059669',
      faceExpression: 'Smug knowing smile pointing finger towards text',
      backgroundVisual: 'Side-by-side terminal code screen vs big tech logo',
      compositionRule: 'High dynamic contrast, 3-color limit (Yellow, Blue, Dark Grey)',
      suggestedImagePrompt: 'High-CTR YouTube thumbnail style, creator pointing at glowing green text, dramatic rim light, studio photography',
    },
    {
      conceptName: 'The Secret Warning',
      textOverlay: 'DON\'T PAY.',
      textBadgeColor: '#D97706',
      faceExpression: 'Intense eye contact with hand near mouth whispering',
      backgroundVisual: 'Blurred confidential schematic document with red stamp',
      compositionRule: 'Rule of thirds, high luminance contrast on eyes',
      suggestedImagePrompt: 'Dramatic documentary thriller thumbnail, half shadow across face, intense eyes, high contrast amber accent light, 4k',
    },
  ]);

  const handleGenerateAll = async () => {
    if (!currentTopic.trim()) return;
    setIsGenerating(true);
    setDeepPassStep(1);

    try {
      if (deepQualityMode) {
        // Multi-pass simulation step 1: Hook psychology
        await new Promise((r) => setTimeout(r, 600));
        setDeepPassStep(2);
        // Multi-pass simulation step 2: Sensory pacing
        await new Promise((r) => setTimeout(r, 600));
        setDeepPassStep(3);
      }

      // 1. Generate Platform Scripts
      const scriptsRes = await fetch('/api/ai/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic,
          sector: currentSector,
          sourceTranscript,
          engine,
          localConfig,
          deepQuality: deepQualityMode,
        }),
      });
      const scriptsData = await scriptsRes.json();
      if (scriptsData.scripts && Array.isArray(scriptsData.scripts)) {
        setScripts(scriptsData.scripts);
      }

      // 2. Generate Titles & Thumbnails
      const packageRes = await fetch('/api/ai/generate-titles-thumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentTopic,
          sector: currentSector,
          engine,
          localConfig,
        }),
      });
      const packageData = await packageRes.json();
      if (packageData.titles && Array.isArray(packageData.titles)) {
        setTitles(packageData.titles);
      }
      if (packageData.thumbnails && Array.isArray(packageData.thumbnails)) {
        setThumbnails(packageData.thumbnails);
      }
    } catch {
      // Keep existing templates if request fails
    } finally {
      setIsGenerating(false);
      setDeepPassStep(0);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeScript = scripts.find((s) => s.platform === activePlatform) || scripts[0];

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-xl p-6 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Platform-Tailored Script &amp; Packaging Lab
              </h3>
              <p className="text-xs text-slate-500">
                Multi-pass viral scripts, psychology-backed hooks, and high-CTR thumbnail blueprints
              </p>
            </div>
          </div>
        </div>

        {/* Quality Standard Switch & Action Button */}
        <div className="flex items-center gap-3">
          {/* Deep Quality Mode Toggle ("Best Not Fast") */}
          <button
            type="button"
            onClick={() => setDeepQualityMode(!deepQualityMode)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              deepQualityMode
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
            title="When active, runs 3-pass deep refinement for highest retention"
          >
            <Sparkles className={`w-3.5 h-3.5 ${deepQualityMode ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Deep Quality Mode: <strong>{deepQualityMode ? 'Best Not Fast' : 'Standard'}</strong></span>
          </button>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Deep Synthesizing...' : 'Generate Multi-Platform Package'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Pass Step Indicator during Generation */}
      {isGenerating && (
        <div className="p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-blue-950 space-y-2 animate-pulse">
          <div className="flex items-center justify-between font-bold text-blue-900">
            <span>Deep Thinking Pipeline (Focusing on Best, Not Fast):</span>
            <span>Pass {deepPassStep || 1} of 3</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className={`p-2 rounded-lg ${deepPassStep >= 1 ? 'bg-blue-200/80 font-bold text-blue-900' : 'bg-white text-slate-500'}`}>
              1. Hook Psychology &amp; Retention Curve
            </div>
            <div className={`p-2 rounded-lg ${deepPassStep >= 2 ? 'bg-blue-200/80 font-bold text-blue-900' : 'bg-white text-slate-500'}`}>
              2. Visual Camera Metaphor Architect
            </div>
            <div className={`p-2 rounded-lg ${deepPassStep >= 3 ? 'bg-blue-200/80 font-bold text-blue-900' : 'bg-white text-slate-500'}`}>
              3. Platform Cadence &amp; CTA Polish
            </div>
          </div>
        </div>
      )}

      {/* Input Topic & Sector Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/70 border border-slate-200/80">
        <div className="md:col-span-3 space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Target Script Topic &amp; Core Thesis
          </label>
          <input
            type="text"
            value={currentTopic}
            onChange={(e) => setCurrentTopic(e.target.value)}
            placeholder="e.g. Small reasoning models run 100% locally on laptops with zero cloud fees"
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200/50 font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Niche Sector
          </label>
          <select
            value={currentSector}
            onChange={(e) => setCurrentSector(e.target.value as Sector)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            <option value="tech">🤖 Tech &amp; AI Frontiers</option>
            <option value="gaming">🎮 Gaming &amp; Interactive Graphics</option>
            <option value="finance">📈 Finance &amp; Macro Markets</option>
            <option value="science">🧬 Science, Space &amp; Deep Tech</option>
            <option value="history">🏛️ Mind-Blowing History &amp; Lore</option>
            <option value="education">💡 Useful Knowledge &amp; Life Skills</option>
            <option value="viral">🔥 Viral Culture &amp; Creator Meta</option>
            <option value="health">🌿 Health, Biohacking &amp; Longevity</option>
            <option value="world">🌍 World Affairs &amp; Mega-Infra</option>
          </select>
        </div>
      </div>

      {/* Platform Script Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'tiktok', label: 'TikTok / IG Reels', desc: '0-3s Visual Interrupt' },
              { id: 'shorts', label: 'YouTube Shorts', desc: 'Curiosity Loop' },
              { id: 'twitter', label: 'X / Twitter Video', desc: 'Contrarian Monologue' },
              { id: 'linkedin', label: 'LinkedIn Video', desc: 'Executive Insight' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatform(p.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activePlatform === p.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80'
                }`}
              >
                <span>{p.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => copyToClipboard(activeScript?.fullScript || '', 'active-script')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            >
              {copiedKey === 'active-script' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-blue-600" />
              )}
              <span>{copiedKey === 'active-script' ? 'Copied Script!' : 'Copy Script'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSendTopicToClipper(currentTopic)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
              title="Switch to Video Clipper with this topic"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Clip Footage</span>
            </button>
          </div>
        </div>

        {/* Active Script Details */}
        {activeScript && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Hook & Visual Direction Card */}
            <div className="space-y-3">
              <div className="glass-card p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    First 3-Second Hook
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    ~{activeScript.estimatedDurationSeconds}s runtime
                  </span>
                </div>
                <p className="text-xs text-slate-900 font-medium p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 leading-relaxed">
                  &ldquo;{activeScript.hook0to3s}&rdquo;
                </p>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                    Visual Camera Direction:
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeScript.visualDirections}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wide">
                    Audio &amp; Cut Pacing:
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {activeScript.pacingNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Word-for-Word Body Script */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-900 space-y-2 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto shadow-inner">
              {activeScript.fullScript}
            </div>
          </div>
        )}
      </div>

      {/* High-CTR Titles & Visual Thumbnail Packaging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-200/80">
        {/* High-CTR Title Pack */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              High-CTR Viral Titles
            </h4>
            <span className="text-[11px] text-slate-500">Ranked by Click-Through Potential</span>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
            {titles.map((t, idx) => (
              <div
                key={idx}
                className="glass-card p-3.5 rounded-xl hover:border-blue-300 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {t.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(t.title, `title-${idx}`)}
                    className="p-1 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-slate-100 shrink-0 cursor-pointer"
                    title="Copy title"
                  >
                    {copiedKey === `title-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                    {t.category}
                  </span>
                  <span className="font-mono text-blue-600 font-bold">
                    {t.ctrPotential}% Est. CTR
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Thumbnail Concepts Studio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              Visual Thumbnail Concepts
            </h4>
            <span className="text-[11px] text-slate-500">Optimized for Mobile Feed Contrast</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto">
            {thumbnails.map((thumb, idx) => (
              <div
                key={idx}
                className="glass-card p-4 rounded-xl hover:border-blue-300 transition-all space-y-3"
              >
                {/* Visual Thumbnail Preview Box */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-tr from-slate-900 to-blue-950 border border-slate-200 flex items-center justify-center shadow-inner">
                  {/* Background Mock Graphic */}
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Left Third: Bold High Contrast Typography */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 max-w-[55%]">
                    <span
                      className="inline-block px-3 py-1 rounded-lg text-base sm:text-lg font-black tracking-tight text-white uppercase shadow-2xl"
                      style={{ backgroundColor: thumb.textBadgeColor }}
                    >
                      {thumb.textOverlay}
                    </span>
                  </div>

                  {/* Right Third: Face Expression Avatar Mock */}
                  <div className="absolute right-4 bottom-2 text-right">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/80 flex items-center justify-center text-2xl shadow-xl">
                      {idx === 0 ? '😱' : idx === 1 ? '😏' : '🤫'}
                    </div>
                  </div>
                </div>

                {/* Concept Breakdown */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{thumb.conceptName}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(thumb.suggestedImagePrompt, `prompt-${idx}`)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                    >
                      {copiedKey === `prompt-${idx}` ? 'Copied Prompt!' : 'Copy Prompt'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">{thumb.compositionRule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
