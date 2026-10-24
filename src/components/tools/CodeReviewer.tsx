import { useState, useEffect } from 'react';
import { 
  Code2, 
  Sparkles, 
  ShieldAlert, 
  Bug, 
  Zap, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  RefreshCw,
  Terminal,
  FileCheck
} from 'lucide-react';
import { CodeReviewResult, SeverityLevel } from '../../types';
import { SAMPLE_CODE_SNIPPET } from '../../data/sampleData';
import { CopyButton } from '../common/CopyButton';
import { LoadingState, ErrorBanner } from '../common/Feedback';

interface CodeReviewerProps {
  initialDemo?: boolean;
}

export function CodeReviewer({ initialDemo = false }: CodeReviewerProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [selectedSeverities, setSelectedSeverities] = useState<SeverityLevel[]>(['Critical', 'High', 'Medium', 'Low', 'Nit']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CodeReviewResult | null>(null);

  useEffect(() => {
    if (initialDemo) {
      handleLoadSample();
    }
  }, [initialDemo]);

  const handleLoadSample = () => {
    setCode(SAMPLE_CODE_SNIPPET);
    setLanguage('python');
    setError(null);
  };

  const handleReview = async () => {
    if (!code.trim()) {
      setError('Please provide code to review.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/code-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          language,
          focusAreas: ['Security', 'Bugs', 'Edge Cases', 'Complexity', 'Maintainability'],
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const data: CodeReviewResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred during code review.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeverity = (sev: SeverityLevel) => {
    setSelectedSeverities((prev) =>
      prev.includes(sev) ? prev.filter((s) => s !== sev) : [...prev, sev]
    );
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Low':
        return 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'Nit':
        return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-emerald-500 border-emerald-500';
      case 'B': return 'text-indigo-500 border-indigo-500';
      case 'C': return 'text-amber-500 border-amber-500';
      default: return 'text-rose-500 border-rose-500';
    }
  };

  const filteredFindings = result?.findings.filter((f) => selectedSeverities.includes(f.severity)) || [];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              AI Code Review Assistant
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Security & Untrusted Sandbox
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Detect subtle edge cases, race conditions, injection vulnerabilities, Big-O algorithmic scaling bottlenecks, and get corrected code.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Load Vulnerable Worker Demo</span>
        </button>
      </div>

      {/* Untrusted Input Warning Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
        <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-zinc-800 dark:text-zinc-200">Security Sandbox Active: </strong>
          All submitted code is strictly isolated as untrusted data input without dynamic evaluation or execution.
        </span>
      </div>

      {/* Code Input Form */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Source Code to Analyze
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            >
              <option value="python">Python</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="golang">Go (Golang)</option>
              <option value="rust">Rust</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="sql">SQL</option>
            </select>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste untrusted source code here for static, security, and algorithmic review..."
          rows={14}
          className="w-full p-4 text-xs sm:text-sm font-mono rounded-xl bg-zinc-950 text-zinc-200 border border-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
        />

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleReview}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
            <span>{loading ? 'Inspecting Code Security & AST...' : 'Run Comprehensive Review'}</span>
          </button>
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={handleReview} />}
      {loading && (
        <LoadingState
          message="Running AST & Security Inspection with Gemini 3.8 Flash..."
          stepDescription="Simulating edge cases, tracing data flow for injection vulnerabilities, checking complexity bounds, and synthesizing refactored code."
        />
      )}

      {/* Review Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className={`w-18 h-18 rounded-2xl border-4 flex flex-col items-center justify-center font-bold ${getGradeColor(result.grade)} bg-zinc-50 dark:bg-zinc-950`}>
                <span className="text-3xl leading-none">{result.grade}</span>
                <span className="text-[10px] text-zinc-400 uppercase mt-0.5">{result.qualityScore}/100</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Code Review Executive Assessment
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 max-w-xl">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Complexity Quick Stats */}
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
              <span className="font-semibold text-zinc-500 uppercase text-[10px] block">Complexity Shift</span>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Time:</span>
                <span className="font-mono text-rose-500">{result.complexityAnalysis.originalTimeComplexity}</span>
                <span className="text-zinc-400">→</span>
                <span className="font-mono text-emerald-500">{result.complexityAnalysis.suggestedTimeComplexity}</span>
              </div>
            </div>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-zinc-500">Filter Severity:</span>
            {(['Critical', 'High', 'Medium', 'Low', 'Nit'] as SeverityLevel[]).map((sev) => {
              const active = selectedSeverities.includes(sev);
              const count = result.findings.filter((f) => f.severity === sev).length;
              return (
                <button
                  key={sev}
                  type="button"
                  onClick={() => toggleSeverity(sev)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    active
                      ? getSeverityBadge(sev)
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 border-zinc-200 dark:border-zinc-800 opacity-60'
                  }`}
                >
                  {sev} ({count})
                </button>
              );
            })}
          </div>

          {/* Findings List */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Inspection Findings ({filteredFindings.length})
            </h4>

            {filteredFindings.map((finding) => (
              <div
                key={finding.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded border ${getSeverityBadge(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {finding.category}
                    </span>
                    {finding.lineReference && (
                      <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                        {finding.lineReference}
                      </span>
                    )}
                  </div>
                </div>

                <h5 className="text-sm font-bold text-zinc-900 dark:text-white pt-1">
                  {finding.title}
                </h5>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {finding.description}
                </p>

                <div className="mt-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    Recommended Fix:
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300">{finding.recommendation}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Refactored Corrected Code */}
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-md">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-zinc-300">
                  Refactored & Hardened Code ({language})
                </span>
              </div>
              <CopyButton text={result.correctedCode} label="Copy Corrected Code" />
            </div>
            <pre className="p-5 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              <code>{result.correctedCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
