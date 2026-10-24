import { X, BookOpen, Layers, ShieldCheck, CheckCircle2, Terminal, Cpu } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocsModal({ isOpen, onClose }: DocsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                AI Workbench Documentation & Architecture Guide
              </h2>
              <p className="text-xs text-zinc-500">
                System design, truthfulness protocols, setup, limitations, and verification test cases.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          {/* Overview */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              1. Executive Overview & Objective
            </h3>
            <p>
              AI Workbench is a portfolio-ready full-stack web application integrating six specialized AI tools designed to solve high-value developer, data science, and productivity workflows entirely in the browser without local installations.
            </p>
          </section>

          {/* Architecture */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-500" />
              2. Full-Stack System Architecture
            </h3>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 font-mono text-xs">
              <div className="text-zinc-500 font-semibold">// Full-Stack Architecture Layout</div>
              <p>• <strong className="text-zinc-800 dark:text-zinc-200">Client:</strong> React 19 SPA, Vite 8, Tailwind CSS v4, Lucide Icons, PapaParse for CSV parsing.</p>
              <p>• <strong className="text-zinc-800 dark:text-zinc-200">Server:</strong> Node.js v22 Express API proxy (`server.ts`) mounting Vite middleware in dev and serving static assets in production.</p>
              <p>• <strong className="text-zinc-800 dark:text-zinc-200">AI Foundation:</strong> Official `@google/genai` TypeScript SDK using `gemini-3.8-flash` (low-cost, high-speed multimodal and reasoning model).</p>
              <p>• <strong className="text-zinc-800 dark:text-zinc-200">Security:</strong> API keys never leave the server; no client-side credentials or insecure browser storage.</p>
            </div>
          </section>

          {/* Six Tools Capabilities */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              3. Deep Tool Capabilities & Guardrails
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">1. AI Resume Analyzer</span>
                <p className="text-zinc-500">Provides explainable alignment scores across skills and seniority. Explicitly enforces a non-ATS disclaimer and suggests XYZ rewrites.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">2. AI SQL Assistant</span>
                <p className="text-zinc-500">Supports PostgreSQL, MySQL, SQLite, Snowflake, and BigQuery. Generates step-by-step logic and indexing advice with strict isolation from live DB execution.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">3. AI Meeting Notes Analyzer</span>
                <p className="text-zinc-500">Enforces zero-hallucination guardrails: unmentioned task assignees and deadlines are strictly marked as "Unspecified".</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">4. AI PDF Chatbot</span>
                <p className="text-zinc-500">Grounds responses in document contents with page citations. Truthfully indicates if the requested information is absent.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">5. AI Code Review Assistant</span>
                <p className="text-zinc-500">Treats submitted code strictly as untrusted input. Detects bugs, race conditions, injection flaws, and Big-O bottlenecks with refactored code.</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                <span className="font-bold text-zinc-900 dark:text-white">6. AI Data Analyst</span>
                <p className="text-zinc-500">Deterministically calculates min, max, mean, median, std dev, and missing rates in code before prompting Gemini for grounded business insights.</p>
              </div>
            </div>
          </section>

          {/* Test Cases */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-500" />
              4. Verification Test Cases & Demo Workflow
            </h3>
            <p className="text-xs">
              Every tool in AI Workbench is pre-loaded with realistic one-click demo data accessible from the Dashboard or within the tool itself:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li><strong>Resume:</strong> Alex Chen (Staff Engineer) tested against Apex FinTech Senior Platform Engineer job description.</li>
              <li><strong>SQL:</strong> E-commerce customer lifetime spend query & slow broken subquery fix for PostgreSQL.</li>
              <li><strong>Meeting:</strong> Launch & payment sync testing strict "Unspecified" tagging for tasks without explicit owners.</li>
              <li><strong>PDF:</strong> Nova Vector DB Whitepaper testing page references [Page 1-4] and unmentioned blockchain questions.</li>
              <li><strong>Code Review:</strong> Python payment ingestion worker containing SQL concatenation, connection leak, and off-by-one errors.</li>
              <li><strong>Data Analyst:</strong> SaaS Churn CSV and E-commerce Transactions CSV testing statistical computation and SVG charts.</li>
            </ul>
          </section>

          {/* Limitations */}
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              5. Limitations & Security Boundaries
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>Advisory only: SQL Assistant does not connect to live databases to avoid unauthorized writes or drops.</li>
              <li>Explainable scoring: The Resume Analyzer uses semantic similarity and does not emulate proprietary closed-source ATS algorithms.</li>
              <li>File persistence: No user files, PDFs, or resumes are permanently stored on disk or databases, ensuring strict privacy.</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
