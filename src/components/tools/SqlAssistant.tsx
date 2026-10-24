import { useState, useEffect } from 'react';
import { 
  Database, 
  Sparkles, 
  ShieldAlert, 
  Code, 
  HelpCircle, 
  Zap, 
  Bug, 
  RefreshCw,
  Terminal,
  FileCheck
} from 'lucide-react';
import { SqlAssistantResult, SqlDialect } from '../../types';
import { SAMPLE_SQL_QUESTIONS, SAMPLE_SQL_DEBUG } from '../../data/sampleData';
import { CopyButton } from '../common/CopyButton';
import { LoadingState, ErrorBanner } from '../common/Feedback';

interface SqlAssistantProps {
  initialDemo?: boolean;
}

export function SqlAssistant({ initialDemo = false }: SqlAssistantProps) {
  const [mode, setMode] = useState<'generate' | 'debug'>('generate');
  const [dialect, setDialect] = useState<SqlDialect>('PostgreSQL');
  const [question, setQuestion] = useState('');
  const [schema, setSchema] = useState('');
  const [existingSql, setExistingSql] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SqlAssistantResult | null>(null);

  useEffect(() => {
    if (initialDemo) {
      handleLoadSampleGenerate(0);
    }
  }, [initialDemo]);

  const handleLoadSampleGenerate = (index: number) => {
    const s = SAMPLE_SQL_QUESTIONS[index];
    setMode('generate');
    setQuestion(s.question);
    setDialect(s.dialect);
    setSchema(s.schema);
    setExistingSql('');
    setError(null);
  };

  const handleLoadSampleDebug = () => {
    setMode('debug');
    setQuestion(SAMPLE_SQL_DEBUG.question);
    setDialect(SAMPLE_SQL_DEBUG.dialect);
    setSchema(SAMPLE_SQL_DEBUG.schema);
    setExistingSql(SAMPLE_SQL_DEBUG.existingSql);
    setError(null);
  };

  const handleExecute = async () => {
    if (mode === 'generate' && !question.trim()) {
      setError('Please provide a natural-language question or prompt.');
      return;
    }
    if (mode === 'debug' && !existingSql.trim()) {
      setError('Please provide the SQL query you wish to debug and optimize.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sql-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          dialect,
          schema: schema.trim() || undefined,
          existingSql: mode === 'debug' ? existingSql.trim() : undefined,
          mode,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const data: SqlAssistantResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while generating SQL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              AI SQL Assistant
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Multi-Dialect
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Generate, explain, debug, and optimize queries with step-by-step logic, execution safety, and indexing guidance.
          </p>
        </div>

        {/* Demo Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleLoadSampleGenerate(0)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load E-Commerce Query</span>
          </button>
          <button
            type="button"
            onClick={handleLoadSampleDebug}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            <Bug className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Debug & Fix Sample</span>
          </button>
        </div>
      </div>

      {/* Mode & Dialect Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Mode:</span>
          <div className="inline-flex rounded-lg bg-zinc-200/80 dark:bg-zinc-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode('generate')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                mode === 'generate'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Generate from Question
            </button>
            <button
              type="button"
              onClick={() => setMode('debug')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                mode === 'debug'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Debug & Optimize SQL
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Dialect:</span>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value as SqlDialect)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="SQLite">SQLite</option>
            <option value="Snowflake">Snowflake</option>
            <option value="BigQuery">BigQuery</option>
          </select>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1.5">
              {mode === 'generate' ? 'Natural-Language Question / Goal' : 'Bug Description / Problem Statement'}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                mode === 'generate'
                  ? 'e.g. Find the top 10 customers by revenue who have placed orders in the last 30 days...'
                  : 'e.g. This query fails with GROUP BY clause errors and is running very slow on the orders table...'
              }
              rows={mode === 'debug' ? 4 : 8}
              className="w-full p-3.5 text-xs sm:text-sm font-sans rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {mode === 'debug' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1.5">
                Existing SQL Query to Debug
              </label>
              <textarea
                value={existingSql}
                onChange={(e) => setExistingSql(e.target.value)}
                placeholder="Paste the problematic SQL query here..."
                rows={7}
                className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Optional Database Schema / DDL
            </label>
            <span className="text-[11px] text-zinc-400">If omitted, schema will be inferred</span>
          </div>
          <textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="CREATE TABLE orders (id INT, customer_id INT, amount NUMERIC...);"
            rows={12}
            className="w-full p-3.5 text-xs sm:text-sm font-mono rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleExecute}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Terminal className="w-4 h-4" />
          )}
          <span>{loading ? 'Synthesizing Query...' : mode === 'generate' ? 'Generate SQL Query' : 'Debug & Optimize SQL'}</span>
        </button>
      </div>

      {error && <ErrorBanner error={error} onRetry={handleExecute} />}
      {loading && (
        <LoadingState
          message="Synthesizing SQL Architecture with Gemini 3.8 Flash..."
          stepDescription={`Analyzing ${dialect} syntax, constructing execution plan, and drafting optimization guidelines.`}
        />
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-300">
          {/* Mandatory Execution Sandbox Guardrail Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wider block">Production Execution Guardrail Active</span>
              <p>{result.safetyWarning}</p>
            </div>
          </div>

          {/* Generated SQL Code Block */}
          <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-md">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-mono font-semibold text-zinc-300">
                  {dialect} Query ({mode === 'generate' ? 'Synthesized' : 'Optimized'})
                </span>
              </div>
              <CopyButton text={result.sql} label="Copy SQL" />
            </div>
            <pre className="p-5 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              <code>{result.sql}</code>
            </pre>
          </div>

          {/* Step-by-Step Explanation */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Step-by-Step Query Breakdown
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.explanation.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {step.step}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-7">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Suggestions & Dialect Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Optimizations */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Zap className="w-5 h-5" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Query Performance & Indexing Tips
                </h3>
              </div>
              <div className="space-y-2.5 pt-1">
                {result.optimizations.map((opt, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1">
                    <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {opt.type}
                    </span>
                    <p className="text-zinc-700 dark:text-zinc-300">{opt.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dialect Caveats & Assumptions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {dialect} Specific Notes & Assumptions
                </h3>
              </div>
              <div className="space-y-3 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {result.dialectSpecificNotes?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                      Dialect Nuances:
                    </span>
                    <ul className="space-y-1 list-disc list-inside">
                      {result.dialectSpecificNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.assumptions?.length > 0 && (
                  <div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-1">
                      Schema Assumptions:
                    </span>
                    <ul className="space-y-1 list-disc list-inside">
                      {result.assumptions.map((ass, idx) => (
                        <li key={idx}>{ass}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
