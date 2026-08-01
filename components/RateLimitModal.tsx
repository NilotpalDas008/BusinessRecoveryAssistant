"use client";

import { X, AlertTriangle, Clock, RefreshCw, Key } from "lucide-react";

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  onRetry?: () => void;
}

export function RateLimitModal({
  isOpen,
  onClose,
  errorMessage,
  onRetry,
}: RateLimitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121216] border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header with Warning Aura */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/10">
            <AlertTriangle className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold mb-1">
              <Clock className="h-3 w-3" /> Rate Limit Exceeded
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              API Limit Reached
            </h3>
          </div>
        </div>

        {/* Error Details Box */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 space-y-3">
          <p className="font-semibold text-amber-300">
            AI Review Analysis hit a Gemini API quota limit.
          </p>
          {errorMessage && (
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-zinc-300 max-h-28 overflow-y-auto leading-relaxed">
              {errorMessage}
            </div>
          )}
          <div className="space-y-1.5 text-[11px] text-zinc-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Wait 30 to 60 seconds for the free tier quota to reset.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Or verify your Gemini API key in <code className="text-zinc-200">backend/.env</code>.</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors"
          >
            Dismiss
          </button>
          {onRetry && (
            <button
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
