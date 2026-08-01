"use client";

import { X, Lock, Sparkles, AlertCircle } from "lucide-react";

interface GoogleBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleBusinessModal({ isOpen, onClose }: GoogleBusinessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#121216] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold mb-1">
              <Sparkles className="h-3 w-3" /> Coming Soon
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Google Business Integration
            </h3>
          </div>
        </div>

        {/* Message Content */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300 space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Google Business integration is currently under development. For this demo, please upload your exported review CSV.
            </p>
          </div>
        </div>

        {/* Modal Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/20 transition-all"
          >
            Got it, use CSV Upload
          </button>
        </div>
      </div>
    </div>
  );
}
