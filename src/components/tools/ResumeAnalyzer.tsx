import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  Layers,
  Award,
  Info
} from 'lucide-react';
import { ResumeAnalysisResult } from '../../types';
import { SAMPLE_RESUME, SAMPLE_JOB_DESCRIPTION } from '../../data/sampleData';
import { CopyButton } from '../common/CopyButton';
import { LoadingState, ErrorBanner } from '../common/Feedback';

interface ResumeAnalyzerProps {
  initialDemo?: boolean;
}

export function ResumeAnalyzer({ initialDemo = false }: ResumeAnalyzerProps) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');

  useEffect(() => {
    if (initialDemo) {
      handleLoadSample();
    }
  }, [initialDemo]);

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME);
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setFileName('alex_chen_senior_engineer_resume.txt');
    setResumeBase64(null);
    setActiveTab('text');
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeBase64(reader.result as string);
        setResumeText(''); // clear text when file is uploaded
      };
      reader.readAsDataURL(file);
    } else {
      // txt, md, etc.
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(reader.result as string);
        setResumeBase64(null);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if ((!resumeText.trim() && !resumeBase64) || !jobDescription.trim()) {
      setError('Please provide both candidate resume and the target job description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/resume-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: resumeText.trim() || undefined,
          resumeBase64: resumeBase64 || undefined,
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const data: ResumeAnalysisResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while analyzing the resume.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500';
    if (score >= 60) return 'text-indigo-600 dark:text-indigo-400 border-indigo-500';
    return 'text-amber-600 dark:text-amber-400 border-amber-500';
  };

  return (
    <div className="space-y-8 py-4">
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              AI Resume Analyzer
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Explainable Scoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Compare candidate credentials against real job specifications with objective skill mapping and quantified rewrite suggestions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load Staff Engineer Demo</span>
          </button>
        </div>
      </div>

      {/* Input Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Resume Input */}
        <div className="space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              1. Candidate Resume
            </label>
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeTab === 'file'
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Upload File (PDF/TXT)
              </button>
            </div>
          </div>

          {activeTab === 'text' ? (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume text or CV content here..."
              rows={14}
              className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 text-center">
              <Upload className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {fileName ? fileName : 'Choose a PDF or text resume file'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">Supports PDF, TXT, Markdown (Max 10MB)</p>
              <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {resumeBase64 && (
                <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>PDF Document ready for multimodal analysis</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Job Description */}
        <div className="space-y-3 flex flex-col">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            2. Target Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description, requirements, and responsibilities..."
            rows={14}
            className="w-full p-3.5 text-xs sm:text-sm font-sans rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? 'Analyzing Alignment...' : 'Run Alignment Analysis'}</span>
        </button>
      </div>

      {error && <ErrorBanner error={error} onRetry={handleAnalyze} />}
      {loading && (
        <LoadingState
          message="Evaluating Candidate Alignment with Gemini 3.8 Flash..."
          stepDescription="Comparing technical skills, evaluating role seniority, checking requirements, and formulating explainable scoring metrics."
        />
      )}

      {/* Analysis Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-300">
          {/* Top Score Banner with EXPLICIT ATS DISCLAIMER */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 rounded-2xl border-4 flex flex-col items-center justify-center font-bold ${getScoreColor(result.matchScore)} bg-zinc-50 dark:bg-zinc-950`}>
                <span className="text-2xl leading-none">{result.matchScore}</span>
                <span className="text-[10px] text-zinc-400 uppercase mt-0.5">/ 100</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    Explainable Match Score
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">
                    Not a Validated ATS Score
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 max-w-xl">
                  {result.scoreExplanation}
                </p>
              </div>
            </div>

            <div className="self-stretch md:self-auto flex items-center justify-end">
              <CopyButton
                text={`AI Resume Alignment Report\nMatch Score: ${result.matchScore}/100\nDisclaimer: ${result.disclaimer}\n\nMatched Skills:\n${result.matchedSkills.join(', ')}\n\nMissing Skills:\n${result.missingSkills.join(', ')}`}
                label="Copy Summary"
              />
            </div>
          </div>

          {/* Mandatory Disclaimer Box */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Compliance & Transparency Notice: </span>
              {result.disclaimer}
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matching Skills */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Identified Matching Skills ({result.matchedSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.matchedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Requirements */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <XCircle className="w-4 h-4" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Missing Requirements / Gaps ({result.missingSkills.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.missingSkills.length > 0 ? (
                  result.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No major missing required skills identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Experience Alignment */}
          {result.experienceAlignment && (
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                    Experience & Seniority Alignment
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                    Seniority Fit: {result.experienceAlignment.seniorityFit}
                  </span>
                  <span className="px-2.5 py-1 rounded-md font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                    Domain Match: {result.experienceAlignment.domainRelevance}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {result.experienceAlignment.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    Demonstrated Strengths
                  </h5>
                  <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {result.experienceAlignment.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    Alignment Areas of Concern
                  </h5>
                  <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {result.experienceAlignment.concerns.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Recommendations & XYZ Rewrites */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                Actionable Resume Improvements & High-Impact Rewrites
              </h4>
            </div>

            <div className="space-y-4">
              {result.actionableImprovements.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.section}
                    </span>
                    {item.sampleRewrite && (
                      <CopyButton text={item.sampleRewrite} label="Copy Rewrite" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    <strong className="text-zinc-800 dark:text-zinc-200">Critique: </strong>
                    {item.critique}
                  </p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-zinc-100">Recommendation: </strong>
                    {item.recommendation}
                  </p>
                  {item.sampleRewrite && (
                    <div className="mt-2 p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                        Suggested XYZ Rewrite
                      </span>
                      <p className="text-xs font-mono text-zinc-800 dark:text-zinc-200">
                        {item.sampleRewrite}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
