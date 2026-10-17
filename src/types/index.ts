export type Sector =
  | 'tech'
  | 'finance'
  | 'popculture'
  | 'viral'
  | 'science'
  | 'education'
  | 'history'
  | 'health'
  | 'world'
  | 'gaming';

export interface DailyFeedMetadata {
  todayDate: string;
  formattedDate: string;
  refreshedAt: string;
  nextScheduledRefresh: string;
  totalStoriesToday: number;
  activeSector: string;
  dailyBriefings?: Record<string, string>;
}

export type ContentCategory = 'viral' | 'educational' | 'history' | 'live';

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
  | 'documentary'
  | 'iman_gadzhi'
  | 'vox_highlighter'
  | 'neon_cyber'
  | 'capcut_3d'
  | 'karaoke_sweep';

export type WordColorMode =
  | 'single_highlight'
  | 'multi_color_cycle'
  | 'karaoke_fill'
  | 'highlighter_box';

export type WordAnimation =
  | 'scale_bounce'
  | 'karaoke_sweep'
  | 'elastic_snap'
  | 'neon_pulse'
  | 'highlighter_wipe'
  | 'tilt_pop';

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
  // Advanced Market Trend & Word-by-Word Styling
  wordColorMode?: WordColorMode;
  wordAnimation?: WordAnimation;
  passedWordColor?: string;
  upcomingWordColor?: string;
  powerWordColor?: string;
  highlightBoxColor?: string;
  multiColorPalette?: string[];
  enableDynamicKaraoke?: boolean;
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

export type SocialPlatform = 'twitter' | 'reddit' | 'youtube' | 'tiktok';

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
  // Multi-sector enriched knowledge fields
  contentType?: ContentCategory;
  educationalTakeaway?: string; // What educates people & why it matters
  historicalContext?: string; // Fascinating historical origins or parallels
  whyViral?: string; // Creator angle / high retention hook
  liveStatus?: 'LIVE' | 'BREAKING' | 'TRENDING' | 'DEEP_DIVE';
  tags?: string[];
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

export interface AfterEffectsLayerComp {
  layers: string[];
  cameraRig: string;
  vfxPlugins: string[];
  easingFormula: string;
  compositionPreset: string;
}

export interface FoleySoundCue {
  timecode: string;
  sfxType: 'impact' | 'whoosh' | 'riser' | 'foley' | 'glitch' | 'drone' | 'ding' | string;
  soundName: string;
  intent: string;
}

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
  // Advanced After Effects & Motion Design specs
  afterEffectsComp?: AfterEffectsLayerComp;
  sfxFoleyCues?: FoleySoundCue[];
  motionDesignStyle?: string;
  editingStylePreset?: string;
  patternInterrupt?: string;
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

// ==========================================
// BIOSCIENCE SKILLS TYPES
// ==========================================
export interface AlphaFoldModel {
  entryId: string;
  gene: string;
  uniprotAccession: string;
  uniprotId: string;
  uniprotDescription: string;
  taxId: number;
  organismScientificName: string;
  cifUrl?: string;
  pdbUrl?: string;
  paeImageUrl?: string;
  paeDocUrl?: string;
  meanPlddt?: number;
  keyFunction?: string;
}

export interface PubMedArticle {
  pmid: string;
  title: string;
  source: string;
  pubdate: string;
  authors: string;
  doi?: string;
}

export interface PubChemCompound {
  CID: number;
  MolecularFormula: string;
  MolecularWeight: string;
  CanonicalSMILES: string;
  XLogP?: number;
  TPSA?: number;
  HBondDonorCount?: number;
  HBondAcceptorCount?: number;
  RotatableBondCount?: number;
}

export interface ScienceExplainerScene {
  sceneNumber: number;
  timeSpan: string;
  visualDirection: string;
  voiceover: string;
  subtitleHighlight: string;
  soundEffect: string;
}

export interface ScienceExplainerProject {
  title: string;
  hook: string;
  synopsis: string;
  alphaGenomeAtlasUrl: string;
  uniprotId: string;
  plddtFocusResidues: string;
  scenes: ScienceExplainerScene[];
  retentionPowerWords: string[];
  scientificCitations: {
    pmid: string;
    journal: string;
    keyFinding: string;
  }[];
}

// ==========================================
// GENERATE VIDEO FROM TEXT TYPES
// ==========================================
export interface TextToVideoScene {
  sceneId: string;
  timestamp: string;
  sceneType: string;
  cameraMotion: string;
  visualDescription: string;
  aiVideoPrompt: string;
  negativePrompt: string;
  voiceoverScript: string;
  screenOverlayText: string;
  colorGradePalette: string;
}

export interface TextToVideoStoryboard {
  videoTitle: string;
  logline: string;
  estimatedPacing: string;
  scenes: TextToVideoScene[];
}

// ==========================================
// CREATOR NOTEPAD & AI CO-PILOT TYPES
// ==========================================
export interface NotepadResearchSource {
  title: string;
  url: string;
  snippet: string;
  sourceDomain: string;
  publishedDate?: string;
}

export interface NotepadItem {
  id: string;
  title: string;
  content: string;
  sector: Sector;
  tags: string[];
  lastModified: number;
  wordCount: number;
  readingTimeMinutes: number;
  sources: NotepadResearchSource[];
  contentIdeas?: string[];
}

export interface CopyrightRiskItem {
  term: string;
  category: 'music' | 'studio' | 'sports' | 'brand' | 'trademark';
  riskLevel: 'high' | 'medium' | 'safe';
  rightsholder: string;
  explanation: string;
  safeAlternative: string;
}

export interface CopyrightRiskReport {
  overallRiskScore: number; // 0 (100% safe) to 100 (high risk)
  status: 'safe' | 'caution' | 'high_risk';
  summary: string;
  flaggedItems: CopyrightRiskItem[];
  permissiveLicensesAvailable: string[];
  safeStockMusicSuggestions: string[];
  fairUseTransformationChecklist: string[];
}

export interface MultiPlatformFormat {
  platform: 'youtube_shorts' | 'tiktok' | 'instagram_reels' | 'twitter_x' | 'linkedin';
  hookHeadline: string;
  bodyScriptOrCaption: string;
  optimalDuration: string;
  recommendedSoundType: string;
  hashtags: string[];
  engagementCTA: string;
}

export interface MultiRegionWindow {
  regionCode: 'US_GLOBAL' | 'UK_EUROPE' | 'INDIA_SOUTH_ASIA' | 'LATAM' | 'APAC' | 'MENA';
  regionName: string;
  timezoneLabel: string;
  primeTimeWindow: string;
  peakEngagementDays: string;
  localizedHookAngle: string;
  culturalNuance: string;
}

export interface MultiPlatformSchedulePlan {
  topic: string;
  recommendedContentType: string;
  contentRationale: string;
  estimatedViralityScore: number;
  formats: MultiPlatformFormat[];
  regions: MultiRegionWindow[];
  automatedPostQueue: {
    scheduledDate: string;
    platform: string;
    headline: string;
    status: 'ready' | 'queued' | 'exported';
  }[];
}

export interface CommandPaletteAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Creator Tools' | 'AI Intelligence' | 'Actions';
  shortcut?: string;
  action: () => void;
  iconName?: string;
}

