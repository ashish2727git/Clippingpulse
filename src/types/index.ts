export type Sector = 'tech' | 'finance' | 'popculture';

export type EngineType = 'gemini' | 'local';

export interface LocalLLMConfig {
  endpoint: string;
  model: string;
  status: 'untested' | 'connected' | 'error';
  latency?: number;
  availableModels?: string[];
}

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
}

export interface TranscriptSegment {
  id: string;
  start: number;
  end: number;
  speaker?: string;
  text: string;
  words?: TranscriptWord[];
}

export interface ClipSegment {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  viralityScore: number;
  hookReason: string;
  transcriptExcerpt: string;
  visualEventCues: string;
  soundbiteQuote: string;
  suggestedSubtitleStyle?: 'hormozi' | 'tiktok_clean' | 'beast_yellow' | 'minimal_box';
  tags: string[];
}

export interface ColorCorrectionProfile {
  presetName: string;
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  saturation: number; // -50 to 50
  temperature: number; // -50 to 50 (warm/cool)
  tint: number; // -50 to 50 (green/magenta)
  sharpness?: number;
  reason?: string;
  lutStyle?: string;
}

export interface VideoFrameSnapshot {
  id: string;
  timestamp: number;
  dataUrl: string;
  brightness: number;
  contrast: number;
  colorCast: string;
}

export type SubtitlePreset =
  | 'hormozi'
  | 'beast_yellow'
  | 'ali_aesthetic'
  | 'tiktok_clean'
  | 'minimal_box'
  | 'documentary';

export interface SubtitleConfig {
  preset: SubtitlePreset;
  fontSize: number; // in px
  position: 'top' | 'center' | 'bottom';
  highlightColor: string; // hex code for active word
  showEmoji: boolean;
  uppercase: boolean;
  maxWordsPerLine: number; // word chunking (e.g. 2, 3, 5)
  backdropStyle: 'none' | 'glass_pod' | 'dark_pill' | 'shadow_only';
  animationStyle: 'bounce' | 'pop' | 'glow' | 'underline';
  powerWordHighlight: boolean;
}

export interface TrendItem {
  id: string;
  sector: Sector;
  headline: string;
  summary: string;
  viralityVelocity: number; // 0-100
  targetPlatforms: string[];
  audienceEmotion: string;
  keyKeywords: string[];
  suggestedVideoAngle: string;
  recommendedFormat: string;
  sourceUrl?: string;
  sourceAuthor?: string;
}

export type SocialPlatform = 'twitter' | 'reddit' | 'youtube';

export type CredibilityVerdict = 'verified' | 'developing' | 'speculation' | 'unverified';

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  sector: Sector;
  title: string;
  summary: string;
  sourceUrl: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  isVerifiedAuthor?: boolean;
  engagement: {
    likesOrUpvotes: number;
    comments: number;
    viewsOrImpressions?: number;
    repostsOrShares?: number;
  };
  publishedAt: string;
  communityOrSubreddit?: string;
  externalLink?: string;
  credibility: {
    score: number; // 0-100
    status: CredibilityVerdict;
    verifiedFactCheck?: string;
    primarySourceUrl?: string;
  };
}

export interface SourceVerificationReport {
  postId: string;
  title: string;
  credibilityScore: number;
  status: CredibilityVerdict;
  verdictSummary: string;
  primarySources: {
    title: string;
    url: string;
    sourceType: 'official_announcement' | 'sec_filing' | 'github_repo' | 'news_wire' | 'verified_statement';
  }[];
  supportingEvidence: string[];
  risksOrBiases: string[];
  suggestedDisclaimer: string;
}

export interface SocialCredentials {
  twitterBearerToken: string;
  redditClientId: string;
  redditClientSecret: string;
  youtubeApiKey: string;
}

export type ScenePurpose = 'hook' | 'tension' | 'proof' | 'climax' | 'loop';

export interface VideoScenePrompt {
  sceneNumber: number;
  timecodeRange: string;
  durationSeconds: number;
  scenePurpose: ScenePurpose;
  universalPrompt: string;
  cameraMotion: string;
  lightingAndColor: string;
  lensAndAspect: string;
  negativePrompt: string;
  modelTags: {
    veo: string;
    runway: string;
    kling: string;
    sora: string;
  };
}

export interface VideoWorldPackage {
  id: string;
  scriptTitle: string;
  aestheticStyle: string;
  overallAtmosphere: string;
  colorPaletteTheme: string;
  scenes: VideoScenePrompt[];
}

export interface SwarmAgentStatus {
  cloudScout: {
    name: string;
    status: 'active' | 'idle' | 'searching';
    lastTask?: string;
  };
  localEditor: {
    name: string;
    status: 'connected' | 'offline';
    lastTask?: string;
  };
}

export interface ExpertKnowledgeTopic {
  id: string;
  category: 'retention' | 'color_science' | 'algorithm';
  title: string;
  rule: string;
  mechanics: string;
  targetMetric: string;
}

export interface PlatformScript {
  platform: 'tiktok' | 'shorts' | 'twitter' | 'linkedin';
  title: string;
  estimatedDurationSeconds: number;
  hook0to3s: string;
  visualDirections: string;
  pacingNotes: string;
  fullScript: string;
  callToAction: string;
}

export interface ViralTitle {
  title: string;
  category: string;
  ctrPotential: number;
  psychologicalTrigger: string;
  characterCount: number;
}

export interface ThumbnailConcept {
  conceptName: string;
  textOverlay: string;
  textBadgeColor: string;
  faceExpression: string;
  backgroundVisual: string;
  compositionRule: string;
  suggestedImagePrompt: string;
}

export interface VideoProject {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  sourceType: 'sample' | 'upload';
  transcriptText: string;
  segments: TranscriptSegment[];
  extractedClips: ClipSegment[];
  colorProfile: ColorCorrectionProfile;
  subtitleConfig: SubtitleConfig;
  snapshots: VideoFrameSnapshot[];
}
