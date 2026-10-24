import { useState } from 'react';
import { ToolId } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ResumeAnalyzer } from './components/tools/ResumeAnalyzer';
import { SqlAssistant } from './components/tools/SqlAssistant';
import { MeetingNotesAnalyzer } from './components/tools/MeetingNotesAnalyzer';
import { PdfChatbot } from './components/tools/PdfChatbot';
import { CodeReviewer } from './components/tools/CodeReviewer';
import { DataAnalyst } from './components/tools/DataAnalyst';
import { DocsModal } from './components/DocsModal';
import { ChevronRight, LayoutDashboard, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTool, setCurrentTool] = useState<ToolId>('dashboard');
  const [autoLoadDemo, setAutoLoadDemo] = useState<boolean>(false);
  const [docsOpen, setDocsOpen] = useState<boolean>(false);

  const handleSelectTool = (tool: ToolId, demo: boolean = false) => {
    setAutoLoadDemo(demo);
    setCurrentTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toolTitles: Record<ToolId, string> = {
    dashboard: 'Workbench Overview',
    'resume-analyzer': 'AI Resume Analyzer',
    'sql-assistant': 'AI SQL Assistant',
    'meeting-notes': 'AI Meeting Notes Analyzer',
    'pdf-chatbot': 'AI PDF Chatbot',
    'code-review': 'AI Code Review Assistant',
    'data-analyst': 'AI Data Analyst',
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTool={currentTool}
        onSelectTool={(tool) => handleSelectTool(tool, false)}
        onOpenDocs={() => setDocsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb if inside a tool */}
        {currentTool !== 'dashboard' && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
            <button
              onClick={() => handleSelectTool('dashboard')}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {toolTitles[currentTool]}
            </span>
          </div>
        )}

        {/* View Switcher */}
        {currentTool === 'dashboard' && (
          <Dashboard
            onSelectTool={handleSelectTool}
            onOpenDocs={() => setDocsOpen(true)}
          />
        )}
        {currentTool === 'resume-analyzer' && (
          <ResumeAnalyzer initialDemo={autoLoadDemo} />
        )}
        {currentTool === 'sql-assistant' && (
          <SqlAssistant initialDemo={autoLoadDemo} />
        )}
        {currentTool === 'meeting-notes' && (
          <MeetingNotesAnalyzer initialDemo={autoLoadDemo} />
        )}
        {currentTool === 'pdf-chatbot' && (
          <PdfChatbot initialDemo={autoLoadDemo} />
        )}
        {currentTool === 'code-review' && (
          <CodeReviewer initialDemo={autoLoadDemo} />
        )}
        {currentTool === 'data-analyst' && (
          <DataAnalyst initialDemo={autoLoadDemo} />
        )}
      </main>

      {/* In-App Documentation Modal */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              AI
            </div>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">AI Workbench</span>
            <span>• Six Production-Grade AI Engineering Tools</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setDocsOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-zinc-200 underline underline-offset-4 cursor-pointer"
            >
              System Architecture & README
            </button>
            <span>•</span>
            <span>Gemini 3.8 Flash SDK</span>
            <span>•</span>
            <span>Server-Side Orchestrated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
