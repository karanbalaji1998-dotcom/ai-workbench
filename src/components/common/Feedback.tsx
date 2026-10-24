import { Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  stepDescription?: string;
}

export function LoadingState({
  message = 'Processing with Gemini 3.8 Flash...',
  stepDescription = 'Extracting contextual attributes, performing reasoning, and structuring response.',
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 my-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center animate-spin">
          <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
        </div>
      </div>
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{message}</h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">{stepDescription}</p>
    </div>
  );
}

interface ErrorBannerProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  return (
    <div className="p-4 my-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <span className="text-rose-600 dark:text-rose-400 font-bold text-base mt-0.5">!</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">Error Occurred</p>
          <p className="text-sm mt-0.5">{error}</p>
        </div>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="self-start sm:self-auto px-3 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
