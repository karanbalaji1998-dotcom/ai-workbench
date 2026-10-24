import { useState, useEffect } from 'react';
import { 
  Bot, 
  Upload, 
  FileText, 
  Send, 
  Sparkles, 
  Bookmark, 
  Quote, 
  AlertCircle, 
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, PdfChatResult } from '../../types';
import { SAMPLE_PDF_DOCUMENT, SAMPLE_PDF_QUESTIONS } from '../../data/sampleData';
import { CopyButton } from '../common/CopyButton';
import { LoadingState, ErrorBanner } from '../common/Feedback';

interface PdfChatbotProps {
  initialDemo?: boolean;
}

export function PdfChatbot({ initialDemo = false }: PdfChatbotProps) {
  const [docSource, setDocSource] = useState<'sample' | 'upload'>('sample');
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [documentText, setDocumentText] = useState(SAMPLE_PDF_DOCUMENT);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDemo) {
      handleSelectDocSource('sample');
      setQuestion(SAMPLE_PDF_QUESTIONS[0]);
    }
  }, [initialDemo]);

  const handleSelectDocSource = (source: 'sample' | 'upload') => {
    setDocSource(source);
    setError(null);
    if (source === 'sample') {
      setDocumentText(SAMPLE_PDF_DOCUMENT);
      setPdfBase64(null);
      setUploadedFileName('Nova_Distributed_Vector_Database_Whitepaper.pdf');
    } else {
      setDocumentText('');
      setPdfBase64(null);
      setUploadedFileName(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError(null);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfBase64(reader.result as string);
        setDocumentText('');
      };
      reader.readAsDataURL(file);
    } else {
      // Text or markdown document
      const reader = new FileReader();
      reader.onload = () => {
        setDocumentText(reader.result as string);
        setPdfBase64(null);
      };
      reader.readAsText(file);
    }
  };

  const handleAsk = async (queryText?: string) => {
    const activeQuestion = queryText || question;
    if (!activeQuestion.trim()) {
      setError('Please enter a question to ask about the document.');
      return;
    }

    if (!documentText.trim() && !pdfBase64) {
      setError('Please upload a PDF document or choose the sample document first.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: activeQuestion.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pdf-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: pdfBase64 || undefined,
          documentText: documentText.trim() || undefined,
          question: activeQuestion.trim(),
          conversationHistory: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const data: PdfChatResult = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        isFoundInDocument: data.isFoundInDocument,
        pageReferences: data.pageReferences,
        quotedEvidence: data.quotedEvidence,
        documentConfidence: data.documentConfidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err?.message || 'Failed to query the document.');
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
              AI PDF Chatbot
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Page-Anchored Grounding
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Ask complex queries across documents with verifiable page citations, quoted excerpts, and strict absence verification.
          </p>
        </div>

        {/* Source Toggle */}
        <div className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => handleSelectDocSource('sample')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              docSource === 'sample'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Built-in Whitepaper Demo
          </button>
          <button
            type="button"
            onClick={() => handleSelectDocSource('upload')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              docSource === 'upload'
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Upload Custom PDF
          </button>
        </div>
      </div>

      {/* Document Info Card */}
      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-white">
                {docSource === 'sample'
                  ? 'Nova Distributed Vector Database White Paper'
                  : uploadedFileName || 'No PDF Document Loaded'}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                {docSource === 'sample' ? '4 Pages • 128-dim Benchmarks & SLAs' : pdfBase64 ? 'PDF Ready' : 'Pending Upload'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {docSource === 'sample'
                ? 'Includes executive overview, p99 latency SLAs, AES-256-GCM encryption, and pricing tiers.'
                : 'Upload a PDF to ground question answering in its text and structural contents.'}
            </p>
          </div>
        </div>

        {docSource === 'upload' && (
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Select PDF</span>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Suggested Questions */}
      {docSource === 'sample' && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Quick-Test Questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PDF_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(q);
                  handleAsk(q);
                }}
                className="px-2.5 py-1 text-xs text-left rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Timeline */}
      <div className="space-y-4 min-h-[280px] p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
            <Bot className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Ask anything about the document
            </p>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">
              Answers will cite specific page numbers and quoted evidence. If the requested information is absent, the model will declare it truthfully.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 px-1">
                <span>{msg.role === 'user' ? 'You' : 'Document Research Assistant'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {/* Content */}
                <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                {/* Assistant metadata badges */}
                {msg.role === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                    {/* Page References */}
                    {msg.pageReferences && msg.pageReferences.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-semibold text-zinc-500">Citations:</span>
                        {msg.pageReferences.map((page, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[11px] border border-indigo-200 dark:border-indigo-800"
                          >
                            {page}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quoted Evidence Excerpts */}
                    {msg.quotedEvidence && msg.quotedEvidence.length > 0 && (
                      <div className="space-y-1 bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500">
                          <Quote className="w-3 h-3 text-indigo-500" />
                          <span>Direct Excerpt from Text:</span>
                        </div>
                        {msg.quotedEvidence.map((quote, i) => (
                          <p key={i} className="text-[11px] italic text-zinc-600 dark:text-zinc-300 pl-3 border-l-2 border-indigo-400">
                            "{quote}"
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Factual Absent Flag */}
                    {!msg.isFoundInDocument && (
                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Information Verified Absent from Provided Document</span>
                      </div>
                    )}

                    {/* Copy Response */}
                    <div className="flex justify-end pt-1">
                      <CopyButton text={msg.content} label="Copy Answer" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {loading && (
        <LoadingState
          message="Analyzing PDF Content with Gemini 3.8 Flash..."
          stepDescription="Scanning document structure, retrieving page citations, verifying factual grounding, and validating presence."
        />
      )}
      {error && <ErrorBanner error={error} onRetry={() => handleAsk()} />}

      {/* Input Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAsk();
            }
          }}
          placeholder="Ask a question about the document (e.g. latency, security standards, pricing)..."
          className="flex-1 px-4 py-3 text-xs sm:text-sm font-sans rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">Ask Question</span>
        </button>
      </div>
    </div>
  );
}
