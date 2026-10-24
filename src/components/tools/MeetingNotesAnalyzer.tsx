import { useState, useEffect } from 'react';
import { 
  ListChecks, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Calendar, 
  AlertTriangle, 
  Mail, 
  RefreshCw,
  Clock,
  ShieldAlert,
  Send
} from 'lucide-react';
import { MeetingNotesResult, ActionItem } from '../../types';
import { SAMPLE_MEETING_NOTES } from '../../data/sampleData';
import { CopyButton } from '../common/CopyButton';
import { LoadingState, ErrorBanner } from '../common/Feedback';

interface MeetingNotesAnalyzerProps {
  initialDemo?: boolean;
}

export function MeetingNotesAnalyzer({ initialDemo = false }: MeetingNotesAnalyzerProps) {
  const [meetingTitle, setMeetingTitle] = useState('Payment Gateway & Load Testing Sync');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingNotesResult | null>(null);

  useEffect(() => {
    if (initialDemo) {
      handleLoadSample();
    }
  }, [initialDemo]);

  const handleLoadSample = () => {
    setMeetingTitle('Q4 Product Launch & Architecture Sync');
    setTranscript(SAMPLE_MEETING_NOTES);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please provide a meeting transcript or meeting notes.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/meeting-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle: meetingTitle.trim() || 'Team Meeting',
          transcript: transcript.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      const data: MeetingNotesResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while analyzing meeting notes.');
    } finally {
      setLoading(false);
    }
  };

  const isUnspecified = (val: string) => {
    const lower = val.toLowerCase().trim();
    return lower === 'unspecified' || lower.includes('unspecified') || lower === 'none' || lower === 'unknown' || lower === 'tbd';
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
              AI Meeting Notes Analyzer
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Zero Hallucination
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Extract executive summaries, key decisions, verified action items, risk registers, and one-click follow-up emails without invented assignees or dates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Load Architecture Sync Demo</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block mb-1.5">
            Meeting Title / Context
          </label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g. Sprint Planning, Customer Advisory Call, Incident Postmortem"
            className="w-full px-3.5 py-2 text-xs sm:text-sm font-sans rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Meeting Notes or Audio Transcript
            </label>
            <span className="text-[11px] text-zinc-400">Strictly tags unmentioned owners/deadlines as "Unspecified"</span>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste transcript or notes from Zoom, Meet, Teams, or shorthand bullets..."
            rows={12}
            className="w-full p-3.5 text-xs sm:text-sm font-sans rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-md transition-all cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ListChecks className="w-4 h-4" />
            )}
            <span>{loading ? 'Synthesizing Factual Notes...' : 'Analyze Meeting Notes'}</span>
          </button>
        </div>
      </div>

      {error && <ErrorBanner error={error} onRetry={handleAnalyze} />}
      {loading && (
        <LoadingState
          message="Synthesizing Meeting Artifacts with Gemini 3.8 Flash..."
          stepDescription="Filtering speaker turns, validating explicit commitments, and enforcing strict unspecified owner/deadline rules."
        />
      )}

      {/* Results */}
      {result && !loading && (
        <div className="mt-8 space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-300">
          {/* Executive Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Executive Summary
                </h3>
              </div>
              <CopyButton text={result.executiveSummary} label="Copy Summary" />
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {result.executiveSummary}
            </p>
          </div>

          {/* Key Decisions */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Confirmed Decisions ({result.keyDecisions.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {result.keyDecisions.map((dec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{dec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strict Action Items Table */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Action Items & Deliverables ({result.actionItems.length})
                </h3>
                <p className="text-xs text-zinc-500">
                  Non-hallucination protocol: Unmentioned owners or dates are explicitly tagged as Unspecified.
                </p>
              </div>
              <CopyButton
                text={result.actionItems.map((a) => `• [${a.priority}] ${a.task} | Owner: ${a.owner} | Due: ${a.deadline}`).join('\n')}
                label="Copy Action Items"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                    <th className="py-2.5 px-4 font-semibold uppercase tracking-wider">Priority</th>
                    <th className="py-2.5 px-4 font-semibold uppercase tracking-wider">Task Description</th>
                    <th className="py-2.5 px-4 font-semibold uppercase tracking-wider">Owner</th>
                    <th className="py-2.5 px-4 font-semibold uppercase tracking-wider">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {result.actionItems.map((item, idx) => {
                    const ownerUnspecified = isUnspecified(item.owner);
                    const deadlineUnspecified = isUnspecified(item.deadline);
                    return (
                      <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.priority === 'High'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                              : item.priority === 'Medium'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}>
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-md">
                          {item.task}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {ownerUnspecified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Unspecified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{item.owner}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {deadlineUnspecified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Unspecified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{item.deadline}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risks & Follow-Up Email Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks and Blockers */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Identified Risks & Blockers
                </h3>
              </div>
              <div className="space-y-3 pt-1">
                {result.risksAndBlockers.map((risk, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{risk.description}</p>
                    <div className="text-zinc-500 space-y-0.5">
                      <p><strong className="text-zinc-700 dark:text-zinc-300">Impact: </strong>{risk.impact}</p>
                      <p><strong className="text-zinc-700 dark:text-zinc-300">Mitigation: </strong>{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up Email Draft */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <Mail className="w-5 h-5" />
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      Ready-to-Send Follow-up Email
                    </h3>
                  </div>
                  <CopyButton
                    text={`Subject: ${result.followUpEmail.subject}\n\n${result.followUpEmail.body}`}
                    label="Copy Email"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 font-medium">Subject: </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{result.followUpEmail.subject}</span>
                  </div>
                  <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2 whitespace-pre-line text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                    {result.followUpEmail.body}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
