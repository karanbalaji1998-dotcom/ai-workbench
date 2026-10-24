import { useState } from 'react';
import { 
  FileText, 
  Database, 
  ListChecks, 
  Bot, 
  Code2, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Zap,
  Play
} from 'lucide-react';
import { ToolId } from '../types';
import { TOOLS_CONFIG } from '../data/sampleData';

interface DashboardProps {
  onSelectTool: (tool: ToolId, autoLoadSample?: boolean) => void;
  onOpenDocs: () => void;
}

const ICON_MAP: Record<string, any> = {
  FileText,
  Database,
  ListChecks,
  Bot,
  Code2,
  BarChart3,
};

export function Dashboard({ onSelectTool, onOpenDocs }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Career & HR',
    'Database & Engineering',
    'Productivity',
    'Document AI',
    'Code Quality',
    'Analytics',
  ];

  const filteredTools = selectedCategory === 'All'
    ? TOOLS_CONFIG
    : TOOLS_CONFIG.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 text-white p-8 sm:p-10 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portfolio-Ready Full-Stack AI Suite</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            AI Workbench
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            A production-grade application engineered with six deeply functional AI tools. Built with server-side Gemini 3.8 Flash orchestration, deterministic statistical computing, explainable scoring, and zero-hallucination factual guardrails.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectTool('resume-analyzer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm transition-all cursor-pointer"
            >
              <span>Explore Tools</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenDocs}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-all cursor-pointer"
            >
              <span>View System Architecture</span>
            </button>
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="relative z-10 mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero ATS False Claims</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Strict Unspecified Tagging</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Page-Anchored Citations</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Pure Deterministic Math + AI</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tool Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const Icon = ICON_MAP[tool.icon] || Sparkles;
          return (
            <div
              key={tool.id}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-800/80 shadow-xs hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {tool.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {tool.category}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {tool.shortDesc}
                  </p>
                </div>

                {/* Feature checklist */}
                <ul className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  {tool.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-6 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectTool(tool.id, false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 transition-colors cursor-pointer"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTool(tool.id, true)}
                  className="inline-flex items-center justify-center gap-1 py-2 px-2.5 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 transition-colors cursor-pointer"
                  title="Open with pre-loaded demo data"
                >
                  <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Try Demo</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Engineering Architecture Overview Footer */}
      <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
          Technical Architecture & Grounding Philosophy
        </h4>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          AI Workbench is structured as an end-to-end full-stack web application. Every request is routed through server-side Express proxies to prevent browser API key exposure. Prompt workflows are strictly constrained by truthfulness directives: meeting notes never invent unspecified owners, SQL generation prohibits live production execution, PDF questions trigger truthful "absent" declarations when citations cannot be verified, and tabular data statistics are computed deterministically in code before generating executive AI narratives.
        </p>
      </div>
    </div>
  );
}
