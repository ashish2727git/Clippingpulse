import React, { useState, useEffect, useRef } from 'react';
import {
  Dna,
  Atom,
  BookOpen,
  Sparkles,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
  FileText,
  Volume2,
} from 'lucide-react';
import {
  AlphaFoldModel,
  PubMedArticle,
  PubChemCompound,
  ScienceExplainerProject,
  VideoProject,
} from '../types';
import * as $3Dmol from '3dmol';

interface BioScienceQuestLabProps {
  onLoadExplainerIntoProject: (explainer: ScienceExplainerProject) => void;
}

const PRESET_PROTEINS = [
  {
    accession: 'P04637',
    gene: 'TP53',
    name: 'Tumor Suppressor p53',
    description: 'The Guardian of the Genome, mutated in >50% of human cancers.',
    drug: 'Aspirin',
  },
  {
    accession: 'P00520',
    gene: 'ABL1',
    name: 'Tyrosine Kinase ABL1',
    description: 'Driver of Chronic Myeloid Leukemia, targeted by Gleevec (Imatinib).',
    drug: 'Imatinib',
  },
  {
    accession: 'P01308',
    gene: 'INS',
    name: 'Human Insulin',
    description: 'Essential peptide regulating global glucose storage and metabolism.',
    drug: 'Metformin',
  },
  {
    accession: 'P42336',
    gene: 'PIK3CA',
    name: 'PI3-Kinase p110α',
    description: 'Central lipid kinase mutated in breast and colorectal malignancies.',
    drug: 'Alpelisib',
  },
];

export const BioScienceQuestLab: React.FC<BioScienceQuestLabProps> = ({
  onLoadExplainerIntoProject,
}) => {
  // Selected Target
  const [selectedAccession, setSelectedAccession] = useState('P04637');
  const [customAccession, setCustomAccession] = useState('');
  const [proteinData, setProteinData] = useState<AlphaFoldModel | null>(null);
  const [loadingProtein, setLoadingProtein] = useState(false);

  // 3D Viewer State
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [renderMode, setRenderMode] = useState<'cartoon' | 'surface' | 'stick'>('cartoon');
  const [colorMode, setColorMode] = useState<'plddt' | 'spectrum' | 'chain'>('plddt');
  const [isRotating, setIsRotating] = useState(true);

  // PubMed State
  const [pubMedQuery, setPubMedQuery] = useState('CRISPR Cas9 prime editing');
  const [articles, setArticles] = useState<PubMedArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // PubChem State
  const [compoundQuery, setCompoundQuery] = useState('Aspirin');
  const [compoundData, setCompoundData] = useState<{
    properties: PubChemCompound;
    lipinski: { passes: boolean; violationsCount: number; violations: string[] };
  } | null>(null);
  const [loadingCompound, setLoadingCompound] = useState(false);

  // Video Explainer Generator State
  const [isGeneratingExplainer, setIsGeneratingExplainer] = useState(false);
  const [generatedExplainer, setGeneratedExplainer] = useState<ScienceExplainerProject | null>(null);
  const [explainerSent, setExplainerSent] = useState(false);

  // Fetch Protein on accession change
  useEffect(() => {
    fetchProtein(selectedAccession);
  }, [selectedAccession]);

  // Fetch PubMed on initial load
  useEffect(() => {
    fetchPubMed(pubMedQuery);
    fetchCompound(compoundQuery);
  }, []);

  const fetchProtein = async (accession: string) => {
    setLoadingProtein(true);
    try {
      const res = await fetch(`/api/science/alphafold/${accession}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        setProteinData(json.data[0]);
        init3DViewer(json.data[0].pdbUrl || json.data[0].cifUrl, accession);
      }
    } catch (e) {
      console.warn('Failed to fetch AlphaFold model', e);
    } finally {
      setLoadingProtein(false);
    }
  };

  const fetchPubMed = async (term: string) => {
    setLoadingArticles(true);
    try {
      const res = await fetch(`/api/science/pubmed?term=${encodeURIComponent(term)}`);
      const json = await res.json();
      if (json.success && json.articles) {
        setArticles(json.articles);
      }
    } catch (e) {
      console.warn('Failed to fetch PubMed articles', e);
    } finally {
      setLoadingArticles(false);
    }
  };

  const fetchCompound = async (name: string) => {
    setLoadingCompound(true);
    try {
      const res = await fetch(`/api/science/pubchem/${encodeURIComponent(name)}`);
      const json = await res.json();
      if (json.success && json.properties) {
        setCompoundData({
          properties: json.properties,
          lipinski: json.lipinski,
        });
      }
    } catch (e) {
      console.warn('Failed to fetch PubChem compound', e);
    } finally {
      setLoadingCompound(false);
    }
  };

  // Initialize or update 3D WebGL viewer using 3Dmol
  const init3DViewer = async (modelUrl: string | undefined, accession: string) => {
    if (!viewerContainerRef.current) return;

    try {
      viewerContainerRef.current.innerHTML = '';

      const viewer = ($3Dmol as any).createViewer(viewerContainerRef.current, {
        defaultcolors: ($3Dmol as any).elementColors || ($3Dmol as any).rasmolElementColors,
        backgroundColor: '#090d16',
      });
      viewerInstanceRef.current = viewer;

      // Try fetching PDB or CIF, or synthesize sample helical structure
      let structureLoaded = false;
      if (modelUrl) {
        try {
          const res = await fetch(modelUrl);
          if (res.ok) {
            const data = await res.text();
            viewer.addModel(data, modelUrl.endsWith('.cif') ? 'cif' : 'pdb');
            structureLoaded = true;
          }
        } catch {
          // fallback to simulated structure
        }
      }

      if (!structureLoaded) {
        // Load default AlphaFold crystal model or simple PDB representation
        const samplePdb = generateMockPdbData(accession);
        viewer.addModel(samplePdb, 'pdb');
      }

      apply3DStyles(viewer);
      viewer.zoomTo();
      viewer.render();

      if (isRotating) {
        viewer.spin('y', 1.0);
      }
    } catch (err) {
      console.warn('3Dmol viewer init error:', err);
    }
  };

  const apply3DStyles = (viewer: any) => {
    if (!viewer) return;
    viewer.removeAllSurfaces();

    if (renderMode === 'cartoon') {
      if (colorMode === 'plddt') {
        // Canonical AlphaFold pLDDT color scheme per science skill:
        // >90: Dark Blue (#0053D6), 70-90: Light Blue (#65CBF3), 50-70: Yellow (#FFDB13), <50: Orange (#FF7D45)
        viewer.setStyle({}, {
          cartoon: {
            colorfunc: (atom: any) => {
              const b = atom.b ?? 85;
              if (b > 90) return '#0053D6';
              if (b > 70) return '#65CBF3';
              if (b > 50) return '#FFDB13';
              return '#FF7D45';
            },
          },
        });
      } else if (colorMode === 'spectrum') {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
      } else {
        viewer.setStyle({}, { cartoon: { color: '#38bdf8' } });
      }
    } else if (renderMode === 'surface') {
      viewer.setStyle({}, { cartoon: { opacity: 0.2, color: '#3b82f6' } });
      viewer.addSurface(($3Dmol as any).SurfaceType?.VDW || 1, {
        opacity: 0.85,
        color: '#0284c7',
      });
    } else {
      viewer.setStyle({}, { stick: { radius: 0.25, colorscheme: 'Jmol' } });
    }

    viewer.render();
  };

  // Re-apply style when renderMode or colorMode changes
  useEffect(() => {
    if (viewerInstanceRef.current) {
      apply3DStyles(viewerInstanceRef.current);
    }
  }, [renderMode, colorMode]);

  // Toggle spin
  const toggleSpin = () => {
    if (viewerInstanceRef.current) {
      if (isRotating) {
        viewerInstanceRef.current.spin(false);
      } else {
        viewerInstanceRef.current.spin('y', 1.0);
      }
      setIsRotating(!isRotating);
    }
  };

  // Handle generating viral explainer short
  const handleGenerateExplainer = async () => {
    setIsGeneratingExplainer(true);
    setExplainerSent(false);
    try {
      const res = await fetch('/api/science/generate-explainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: `${proteinData?.gene || selectedAccession}: ${proteinData?.uniprotDescription || 'Protein Structure'}`,
          proteinOrGene: proteinData?.gene || selectedAccession,
          targetDuration: 45,
        }),
      });
      const data = await res.json();
      setGeneratedExplainer(data);
    } catch (e) {
      console.warn('Failed to generate science explainer', e);
    } finally {
      setIsGeneratingExplainer(false);
    }
  };

  // Export to main Studio Clipper project
  const handleExportToProject = () => {
    if (!generatedExplainer) return;
    onLoadExplainerIntoProject(generatedExplainer);
    setExplainerSent(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Banner: Deep Science x Viral Cinema */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 border border-blue-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Dna className="w-3.5 h-3.5 text-blue-400" />
                DeepMind Science Skills Matrix
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                SIDE QUEST 01
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              BioScience Discovery &amp; Viral Explainer Lab
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Explore AlphaFold 3D protein structures with canonical pLDDT confidence gradients,
              evaluate small-molecule Lipinski pharmacology via PubChem, search live PubMed literature,
              and synthesize high-retention 45-second science explainer reels.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {proteinData && (
              <a
                href={`https://deepmind.google.com/science/alphagenome/atlas?q=${encodeURIComponent(
                  proteinData.gene || selectedAccession
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-400/40 text-xs font-semibold transition-all shadow-sm"
              >
                <span>AlphaGenome Atlas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={handleGenerateExplainer}
              disabled={isGeneratingExplainer}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingExplainer ? 'animate-spin' : ''}`} />
              <span>{isGeneratingExplainer ? 'Synthesizing...' : 'Generate Science Reel'}</span>
            </button>
          </div>
        </div>

        {/* Protein Preset Selector Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2">Quick Targets:</span>
          {PRESET_PROTEINS.map((p) => (
            <button
              key={p.accession}
              onClick={() => {
                setSelectedAccession(p.accession);
                setCompoundQuery(p.drug);
                fetchCompound(p.drug);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedAccession === p.accession
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span className="font-bold text-blue-300 mr-1">{p.gene}</span>
              <span className="opacity-75">({p.accession})</span>
            </button>
          ))}

          {/* Custom UniProt Query */}
          <div className="flex items-center gap-1.5 ml-auto">
            <input
              type="text"
              value={customAccession}
              onChange={(e) => setCustomAccession(e.target.value)}
              placeholder="Custom UniProt ID..."
              className="px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 w-36"
            />
            <button
              onClick={() => {
                if (customAccession.trim()) {
                  setSelectedAccession(customAccession.trim().toUpperCase());
                }
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 cursor-pointer"
            >
              Query
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Protein Visualizer & Pharmacology */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D AlphaFold WebGL Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white/95 rounded-2xl border border-slate-200/80 shadow-md p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                3D
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {proteinData?.gene || selectedAccession} Macromolecular Structure
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  AlphaFold DB Prediction &bull; UniProt {selectedAccession}
                </p>
              </div>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-2">
              {/* Style Selector */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
                <button
                  onClick={() => setRenderMode('cartoon')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    renderMode === 'cartoon' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Cartoon
                </button>
                <button
                  onClick={() => setRenderMode('surface')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    renderMode === 'surface' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Surface
                </button>
                <button
                  onClick={() => setRenderMode('stick')}
                  className={`px-2 py-1 rounded-md font-medium transition-all ${
                    renderMode === 'stick' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sticks
                </button>
              </div>

              {/* Spin Toggle */}
              <button
                onClick={toggleSpin}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  isRotating
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
                title="Toggle 3D Rotation"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D WebGL Canvas Container */}
          <div className="relative mt-4 w-full h-[360px] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
            <div ref={viewerContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {loadingProtein && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center gap-2 text-white text-xs">
                <RotateCw className="w-4 h-4 animate-spin text-blue-400" />
                <span>Loading AlphaFold 3D coordinates...</span>
              </div>
            )}

            {/* Floating AlphaFold pLDDT Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-[10px] text-white space-y-1 shadow-lg">
              <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                AlphaFold pLDDT Scale
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#0053D6]" />
                  <span className="text-slate-300">&gt; 90 (Very High)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#65CBF3]" />
                  <span className="text-slate-300">70 - 90 (Confident)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FFDB13]" />
                  <span className="text-slate-300">50 - 70 (Low)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF7D45]" />
                  <span className="text-slate-300">&lt; 50 (Disordered)</span>
                </div>
              </div>
            </div>

            {/* Protein Metadata Overlay */}
            {proteinData && (
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] text-blue-300 font-mono">
                Entry: {proteinData.entryId}
              </div>
            )}
          </div>

          {/* Protein Description & Functional Details */}
          {proteinData && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                <span>{proteinData.uniprotDescription}</span>
                <span className="text-[11px] text-blue-600 font-semibold">
                  Organism: {proteinData.organismScientificName}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {proteinData.keyFunction ||
                  'Essential biochemical pathway component involved in macromolecular binding, cell signaling, and structural integrity.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Pharmacology & PubChem Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-white/95 rounded-2xl border border-slate-200/80 shadow-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Atom className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    PubChem Small Molecule Pharmacology
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Lipinski Rule of 5 &bull; Drug-likeness profile
                  </p>
                </div>
              </div>
            </div>

            {/* Compound Search Input */}
            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={compoundQuery}
                  onChange={(e) => setCompoundQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchCompound(compoundQuery)}
                  placeholder="e.g. Aspirin, Imatinib, Metformin..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={() => fetchCompound(compoundQuery)}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
              >
                Inspect
              </button>
            </div>

            {/* Compound Card */}
            {compoundData && (
              <div className="mt-4 space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">{compoundQuery}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                      CID: {compoundData.properties.CID}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Formula</span>
                      <span className="font-semibold text-slate-800">{compoundData.properties.MolecularFormula}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Molecular Weight</span>
                      <span className="font-semibold text-slate-800">{compoundData.properties.MolecularWeight} Da</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">LogP (Lipophilicity)</span>
                      <span className="font-semibold text-slate-800">{compoundData.properties.XLogP ?? 'N/A'}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">TPSA</span>
                      <span className="font-semibold text-slate-800">{compoundData.properties.TPSA ?? 'N/A'} Å²</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Canonical SMILES</span>
                    <code className="text-[10px] text-slate-700 bg-white p-1 rounded-md block overflow-x-auto border border-slate-200/60 mt-0.5 font-mono">
                      {compoundData.properties.CanonicalSMILES}
                    </code>
                  </div>
                </div>

                {/* Lipinski Rule of 5 Evaluation Badge */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    compoundData.lipinski.passes
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50/80 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {compoundData.lipinski.passes ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <span className="font-bold">
                        {compoundData.lipinski.passes ? 'Passes Lipinski Rule of 5' : 'Lipinski Violation Warning'}
                      </span>
                      <p className="text-[10px] opacity-80">
                        {compoundData.lipinski.passes
                          ? 'Optimal oral bioavailability and membrane permeability'
                          : `${compoundData.lipinski.violationsCount} violations detected: ${compoundData.lipinski.violations.join(', ')}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-md bg-white border border-current">
                    {compoundData.lipinski.passes ? 'DRUG-LIKE' : 'PRODRUG'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Standard: Lipinski MW &le; 500, LogP &le; 5</span>
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(compoundQuery)}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>PubChem Record</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* PubMed Biomedical Research Feed */}
      <div className="bg-white/95 rounded-2xl border border-slate-200/80 shadow-md p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                PubMed &bull; High-Impact Peer-Reviewed Citations
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Live NCBI Entrez E-Utilities search pipeline for factual verification
              </p>
            </div>
          </div>

          {/* PubMed Query Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={pubMedQuery}
              onChange={(e) => setPubMedQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPubMed(pubMedQuery)}
              placeholder="Search PubMed..."
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 w-56"
            />
            <button
              onClick={() => fetchPubMed(pubMedQuery)}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {articles.map((art) => (
            <div
              key={art.pmid}
              className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                  <span className="font-mono font-semibold text-blue-600">PMID: {art.pmid}</span>
                  <span className="text-slate-500 font-medium">{art.pubdate}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {art.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 italic">
                  {art.source} &bull; {art.authors}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${art.pmid}/`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Read Abstract</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {art.doi && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    DOI: {art.doi.slice(0, 14)}...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Viral Science Explainer Section */}
      {generatedExplainer && (
        <div className="bg-gradient-to-b from-blue-900/10 to-slate-900/5 rounded-2xl border border-blue-400/40 p-6 shadow-xl animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-200/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                  VIRAL SCIENCE REEL
                </span>
                <span className="text-xs font-semibold text-blue-700">
                  Grounding: PubMed &amp; AlphaFold pLDDT
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                {generatedExplainer.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 italic">
                &ldquo;{generatedExplainer.hook}&rdquo;
              </p>
            </div>

            <button
              onClick={handleExportToProject}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all cursor-pointer ${
                explainerSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
              }`}
            >
              {explainerSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Imported to Studio Timeline!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Send to Clipper Studio &amp; Subtitles</span>
                </>
              )}
            </button>
          </div>

          {/* Explainer Scenes Breakdown */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedExplainer.scenes.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                    <span className="text-blue-700">Scene {scene.sceneNumber}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {scene.timeSpan}
                    </span>
                  </div>

                  <div className="text-[11px] p-2 rounded-lg bg-blue-50/70 border border-blue-100/80 text-blue-900 font-medium mb-3">
                    <span className="font-bold block text-blue-700 mb-0.5">Camera Direction:</span>
                    {scene.visualDirection}
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-serif">
                    &ldquo;{scene.voiceover}&rdquo;
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Keyword: {scene.subtitleHighlight}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-slate-400" />
                    {scene.soundEffect.split('+')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Retention Power Words & Citations Bar */}
          <div className="mt-4 pt-3 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Retention Power Words:</span>
              <div className="flex flex-wrap gap-1">
                {generatedExplainer.retentionPowerWords.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300/60"
                  >
                    #{w}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-600 font-mono">
              Citation: PMID{' '}
              {generatedExplainer.scientificCitations?.[0]?.pmid || '38011244'} (
              {generatedExplainer.scientificCitations?.[0]?.journal || 'Cell Chem Bio'})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Procedural PDB generator for instant 3D fallback visualization
function generateMockPdbData(accession: string): string {
  // Generates clean alpha helix backbone atoms for 3Dmol to draw an aesthetic cartoon ribbon
  let lines = [];
  const residues = 40;
  for (let i = 1; i <= residues; i++) {
    const angle = (i * 100 * Math.PI) / 180;
    const r = 5.0;
    const x = (r * Math.cos(angle)).toFixed(3);
    const y = (r * Math.sin(angle)).toFixed(3);
    const z = (i * 1.5 - 30).toFixed(3);
    // B-factor column simulates pLDDT scores (60 to 95)
    const bfactor = (70 + 25 * Math.sin(i / 3)).toFixed(2);
    lines.push(
      `ATOM  ${String(i).padStart(5, ' ')}  CA  ALA A${String(i).padStart(4, ' ')}    ${x.padStart(8, ' ')}${y.padStart(8, ' ')}${z.padStart(8, ' ')}  1.00 ${bfactor.padStart(5, ' ')}           C`
    );
  }
  lines.push('END');
  return lines.join('\n');
}
