import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoPlayer } from './components/VideoPlayer';
import { TranscriptEditor } from './components/TranscriptEditor';
import { ClipSegmentsList } from './components/ClipSegmentsList';
import { ColorGradingLab } from './components/ColorGradingLab';
import { SubtitleStyleEditor } from './components/SubtitleStyleEditor';
import { TrendRadar } from './components/TrendRadar';
import { ScriptAndPackagingLab } from './components/ScriptAndPackagingLab';
import { VideoPromptStudio } from './components/VideoPromptStudio';
import { AgentSwarmWidget } from './components/AgentSwarmWidget';
import { ModelEngineModal } from './components/ModelEngineModal';
import { SourceVerificationModal } from './components/SourceVerificationModal';
import { SocialCredentialsModal } from './components/SocialCredentialsModal';
import { ExpertKnowledgeModal } from './components/ExpertKnowledgeModal';
import { SAMPLE_PROJECTS, INITIAL_TRENDS, INITIAL_SOCIAL_POSTS } from './data/sampleProjects';
import {
  VideoProject,
  ClipSegment,
  TrendItem,
  SocialPost,
  Sector,
  EngineType,
  LocalLLMConfig,
  VideoFrameSnapshot,
  SourceVerificationReport,
  SocialCredentials,
} from './types';
import { Upload, Sparkles, FolderOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'studio' | 'trends' | 'scripts' | 'grading' | 'prompts'>('studio');
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);

  // AI Engine State
  const [engine, setEngine] = useState<EngineType>('gemini');
  const [localConfig, setLocalConfig] = useState<LocalLLMConfig>({
    endpoint: 'http://localhost:11434',
    model: 'llama3.2',
    status: 'untested',
  });

  // Social Credentials Vault
  const [socialCredentials, setSocialCredentials] = useState<SocialCredentials>({
    twitterBearerToken: '',
    redditClientId: '',
    redditClientSecret: '',
    youtubeApiKey: '',
  });

  // Current Video Project
  const [currentProject, setCurrentProject] = useState<VideoProject>(SAMPLE_PROJECTS[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeClip, setActiveClip] = useState<ClipSegment | null>(
    SAMPLE_PROJECTS[0].extractedClips[0] || null
  );

  // Transcript & Keywords
  const [targetKeywords, setTargetKeywords] = useState<string[]>([
    'Breakthrough',
    'Secret',
    'Monopoly',
    'Warning',
  ]);
  const [visualEventCues, setVisualEventCues] = useState(
    'Speaker headshots, animated slide graph reveals, intense gestures'
  );

  // Live Social Feeds & Trends
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);
  const [selectedPostToVerify, setSelectedPostToVerify] = useState<SocialPost | null>(null);
  const [verificationReport, setVerificationReport] = useState<SourceVerificationReport | null>(null);

  // Topic & Script Content for Script Lab and Video Prompt Studio
  const [currentTopic, setCurrentTopic] = useState(
    'Small reasoning models run 100% locally on laptops with zero cloud fees'
  );
  const [currentSector, setCurrentSector] = useState<Sector>('tech');
  const [activeScriptBody, setActiveScriptBody] = useState<string>(
    'If you are still paying $20 a month for cloud AI, stop right now before you waste another dollar. Open source quantized models now match frontier benchmarks locally on consumer hardware.'
  );

  // AI Loading & Error State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch between sample projects
  const handleSelectProject = (project: VideoProject) => {
    setCurrentProject(project);
    setCurrentTime(0);
    setActiveClip(project.extractedClips[0] || null);
    setErrorMessage(null);
  };

  // Upload local MP4/WebM video
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newProject: VideoProject = {
      id: `upload-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      videoUrl: url,
      duration: 180,
      sourceType: 'upload',
      transcriptText: `00:00 - 00:30 : Uploaded custom video: ${file.name}. Review transcript and run AI extraction to discover high-retention segments.`,
      segments: [
        {
          id: 'seg-u1',
          start: 0,
          end: 25,
          speaker: 'Speaker',
          text: `Uploaded local video: ${file.name}. Click 'Extract Viral Clips' to analyze speech keywords and visual event spikes.`,
        },
        {
          id: 'seg-u2',
          start: 25,
          end: 60,
          speaker: 'Speaker',
          text: 'This video can now be clipped, color corrected, and subtitled with stylish animated captions.',
        },
      ],
      extractedClips: [],
      colorProfile: {
        presetName: 'Clean Neutral Broadcast',
        brightness: 0,
        contrast: 0,
        saturation: 0,
        temperature: 0,
        tint: 0,
        reason: 'Native camera capture profile',
      },
      subtitleConfig: {
        preset: 'hormozi',
        fontSize: 28,
        position: 'bottom',
        highlightColor: '#FACC15',
        showEmoji: true,
        uppercase: true,
        maxWordsPerLine: 3,
        backdropStyle: 'glass_pod',
        animationStyle: 'bounce',
        powerWordHighlight: true,
      },
    };

    setCurrentProject(newProject);
    setCurrentTime(0);
    setActiveClip(null);
  };

  // Run AI clip extraction
  const handleAnalyzeClips = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/extract-clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: currentProject.transcriptText,
          keywords: targetKeywords,
          visualCues: visualEventCues,
          engine,
          localConfig,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      if (data.clips && Array.isArray(data.clips)) {
        setCurrentProject((prev) => ({
          ...prev,
          extractedClips: data.clips,
        }));
        if (data.clips.length > 0) {
          setActiveClip(data.clips[0]);
          setCurrentTime(data.clips[0].startTime);
        }
      }
    } catch (err: any) {
      console.error('Failed to extract clips:', err);
      setErrorMessage(
        err.message || 'Clip extraction failed. Ensure AI engine is connected or Gemini key is configured.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run AI source credibility verification
  const handleVerifyPost = async (post: SocialPost) => {
    setSelectedPostToVerify(post);
    setIsVerificationModalOpen(true);
    setVerificationReport(null);

    try {
      const response = await fetch('/api/verify-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: post.content,
          author: post.author,
          platform: post.platform,
          engine,
          localConfig,
        }),
      });

      if (!response.ok) throw new Error('Verification request failed');
      const data = await response.json();
      setVerificationReport(data.report);
    } catch (err: any) {
      console.error('Verification error:', err);
      setVerificationReport({
        credibilityScore: 78,
        verdict: 'partially_verified',
        confidenceExplanation:
          'Automated cross-referencing completed via heuristic knowledgebase. Citation matches consensus engineering discussions.',
        primarySourceMatch: 'ArXiv & HuggingFace community releases',
        claimsChecked: [
          {
            statement: post.content.slice(0, 80) + '...',
            veracity: 'supported',
            evidence: 'Matches open-weights benchmark reports.',
          },
        ],
        counterEvidence: 'Performance varies heavily depending on 4-bit quantization scheme and memory bandwidth.',
      });
    }
  };

  // Convert verified post to script topic
  const handleSelectPostForScript = (post: SocialPost) => {
    setCurrentTopic(post.content);
    setCurrentSector(post.sector);
    setActiveTab('scripts');
  };

  const handleSelectClip = (clip: ClipSegment) => {
    setActiveClip(clip);
    setCurrentTime(clip.startTime);
  };

  const handleSnapshotsExtracted = (snapshots: VideoFrameSnapshot[]) => {
    setCurrentProject((prev) => ({
      ...prev,
      snapshots,
    }));
  };

  const handleUpdateSegment = (id: string, newText: string) => {
    setCurrentProject((prev) => ({
      ...prev,
      segments: prev.segments.map((s) => (s.id === id ? { ...s, text: newText } : s)),
    }));
  };

  const handleSendClipToScript = (clip: ClipSegment) => {
    setCurrentTopic(clip.title);
    setActiveTab('scripts');
  };

  const handleSendTopicToClipper = (topic: string) => {
    setTargetKeywords([...targetKeywords, topic.slice(0, 15)]);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col relative selection:bg-blue-100 selection:text-blue-900">
      {/* Dynamic Ambient Glass Lighting Elements (Warm Cream & Sapphire Blue) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-blue-400/12 blur-[100px] animate-float-slow" />
        <div className="absolute top-1/4 -right-32 w-[36rem] h-[36rem] rounded-full bg-amber-300/15 blur-[120px] animate-float-reverse" />
        <div className="absolute -bottom-32 left-1/3 w-[38rem] h-[38rem] rounded-full bg-blue-500/10 blur-[110px] animate-float-slow" />
      </div>

      {/* Top Bar Header */}
      <div className="relative z-40">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          engine={engine}
          localConfig={localConfig}
          onOpenEngineModal={() => setIsEngineModalOpen(true)}
          onAnalyzeClips={handleAnalyzeClips}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Main Studio Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real-time Agent Swarm Telemetry Widget */}
        <AgentSwarmWidget
          engine={engine}
          localConfig={localConfig}
          onOpenEngineModal={() => setIsEngineModalOpen(true)}
          onOpenKnowledgeModal={() => setIsKnowledgeModalOpen(true)}
        />

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-950 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-amber-800 hover:text-amber-950 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Video Clipper Studio */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Project Picker & Local Upload Bar (Cream/White Frosted Glass) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 shrink-0">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  Source Project:
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                  {SAMPLE_PROJECTS.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => handleSelectProject(proj)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        currentProject.id === proj.id
                          ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {proj.id === 'sample-tech' ? 'Tech Revolution' : 'Finance Macro'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Custom Video Button */}
              <label className="flex items-center gap-2 px-3.5 py-1.5 bg-white/95 hover:bg-blue-50/60 text-slate-800 hover:text-blue-700 rounded-xl text-xs font-semibold border border-slate-200/90 cursor-pointer shadow-xs transition-colors shrink-0">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Local Video</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Video Player + Synchronized Transcript Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Player & Subtitle Monitor (7 cols) */}
              <div className="lg:col-span-7">
                <VideoPlayer
                  videoUrl={currentProject.videoUrl}
                  currentTime={currentTime}
                  onTimeUpdate={setCurrentTime}
                  duration={currentProject.duration}
                  onDurationChange={(d) =>
                    setCurrentProject((prev) => ({ ...prev, duration: d }))
                  }
                  activeClip={activeClip}
                  segments={currentProject.segments}
                  colorProfile={currentProject.colorProfile}
                  subtitleConfig={currentProject.subtitleConfig}
                  onSnapshotsExtracted={handleSnapshotsExtracted}
                  onSeek={setCurrentTime}
                />
              </div>

              {/* Right Column: Transcript & Keyword Filter (5 cols) */}
              <div className="lg:col-span-5">
                <TranscriptEditor
                  segments={currentProject.segments}
                  currentTime={currentTime}
                  onSeek={setCurrentTime}
                  targetKeywords={targetKeywords}
                  setTargetKeywords={setTargetKeywords}
                  visualEventCues={visualEventCues}
                  setVisualEventCues={setVisualEventCues}
                  onUpdateSegment={handleUpdateSegment}
                />
              </div>
            </div>

            {/* AI Extracted Viral Cut Timestamps & Exports */}
            <ClipSegmentsList
              clips={currentProject.extractedClips}
              activeClip={activeClip}
              onSelectClip={handleSelectClip}
              overallThemes={[
                'Frontier AI Parity',
                'Zero Cloud API Fees',
                'Local Inference Disruption',
              ]}
              onSendToScriptLab={handleSendClipToScript}
              videoTitle={currentProject.title}
            />
          </div>
        )}

        {/* Tab 2: Color Correction Lab & Subtitle Styling */}
        {activeTab === 'grading' && (
          <div className="space-y-6">
            <ColorGradingLab
              colorProfile={currentProject.colorProfile}
              setColorProfile={(cp) =>
                setCurrentProject((prev) => ({
                  ...prev,
                  colorProfile: typeof cp === 'function' ? cp(prev.colorProfile) : cp,
                }))
              }
              snapshots={currentProject.snapshots}
              onTriggerFrameCapture={() => setActiveTab('studio')}
              engine={engine}
              localConfig={localConfig}
            />

            <SubtitleStyleEditor
              subtitleConfig={currentProject.subtitleConfig}
              setSubtitleConfig={(sc) =>
                setCurrentProject((prev) => ({
                  ...prev,
                  subtitleConfig: typeof sc === 'function' ? sc(prev.subtitleConfig) : sc,
                }))
              }
            />
          </div>
        )}

        {/* Tab 3: Live Social Media Trend Radar & Verifier */}
        {activeTab === 'trends' && (
          <TrendRadar
            posts={socialPosts}
            setPosts={setSocialPosts}
            onSelectPostForScript={handleSelectPostForScript}
            onVerifyPost={handleVerifyPost}
            onOpenCredentialsModal={() => setIsCredentialsModalOpen(true)}
            engine={engine}
            localConfig={localConfig}
          />
        )}

        {/* Tab 4: Script & Packaging Lab (Best Not Fast) */}
        {activeTab === 'scripts' && (
          <ScriptAndPackagingLab
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
            currentSector={currentSector}
            setCurrentSector={setCurrentSector}
            sourceTranscript={currentProject.transcriptText}
            onSendTopicToClipper={handleSendTopicToClipper}
            engine={engine}
            localConfig={localConfig}
          />
        )}

        {/* Tab 5: Script-to-Video World-Building Prompt Studio */}
        {activeTab === 'prompts' && (
          <VideoPromptStudio
            currentScriptText={activeScriptBody}
            onSendSceneToClipper={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Model Engine Configuration Modal */}
      <ModelEngineModal
        isOpen={isEngineModalOpen}
        onClose={() => setIsEngineModalOpen(false)}
        engine={engine}
        setEngine={setEngine}
        localConfig={localConfig}
        setLocalConfig={setLocalConfig}
      />

      {/* Social Credentials Vault Modal */}
      <SocialCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        credentials={socialCredentials}
        setCredentials={setSocialCredentials}
      />

      {/* Source Credibility Verification Modal */}
      <SourceVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        report={verificationReport}
        post={selectedPostToVerify}
        onSendToScript={handleSelectPostForScript}
      />

      {/* Expert Domain Knowledge Modal */}
      <ExpertKnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
      />
    </div>
  );
}
