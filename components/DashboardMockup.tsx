"use client";

import { useState } from "react";
import {
  Star,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  Zap,
  BarChart3,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "complaints">("whatsapp");
  const [simulatedSent, setSimulatedSent] = useState(false);

  const complaintTrends = [
    { label: "Slow Service / Wait Time", count: 18, pct: "42%", status: "Recovering" },
    { label: "Food Temperature", count: 9, pct: "21%", status: "Fixed" },
    { label: "Billing / Order Errors", count: 7, pct: "16%", status: "Monitoring" },
    { label: "Staff Communication", count: 5, pct: "12%", status: "Resolved" },
  ];

  return (
    <div className="relative w-full rounded-2xl border border-white/15 bg-[#121216]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl shadow-purple-950/40 overflow-hidden group">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-zinc-400 border-l border-white/10 pl-3">
            revive-ai.dashboard/v2.4
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" className="animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
            AI Active & Guarding
          </Badge>
        </div>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* 1. Overall Rating */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Overall Rating</span>
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            4.85 <span className="text-xs font-normal text-zinc-400">/ 5.0</span>
          </div>
          <div className="flex items-center text-[11px] text-emerald-400 mt-1 font-medium">
            <TrendingUp className="h-3 w-3 mr-1" /> +0.4 this month
          </div>
        </div>

        {/* 2. Negative Reviews */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Negative Reviews</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">14</div>
          <div className="text-[11px] text-zinc-400 mt-1">12 Auto-Contacted</div>
        </div>

        {/* 3. AI Health Score */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>AI Health Score</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight">
            96 <span className="text-xs text-zinc-400 font-normal">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1 font-medium">Excellent Retention</div>
        </div>

        {/* 4. Customer Recovery */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/30 transition-colors">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Customer Recovery</span>
            <Zap className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-gradient-primary tracking-tight">85.7%</div>
          <div className="text-[11px] text-purple-300 mt-1 font-medium">12/14 Saved</div>
        </div>
      </div>

      {/* Main Feature Tabs inside Dashboard */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0c0c0f] p-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "whatsapp"
                  ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />
              WhatsApp Recovery AI
            </button>
            <button
              onClick={() => setActiveTab("complaints")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === "complaints"
                  ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 inline mr-1.5" />
              Complaint Trends
            </button>
          </div>
          <span className="text-[11px] text-zinc-400 hidden sm:inline-flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin text-purple-400" /> Real-time Syncing
          </span>
        </div>

        {activeTab === "whatsapp" ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-200">Google Review Detected (2 Stars):</span>{" "}
                <span className="text-zinc-300">
                  "Waited 45 minutes for my pasta order. Food was warm, but service was too slow."
                </span>
                <span className="block text-[11px] text-zinc-400 mt-0.5">— Marcus Vance</span>
              </div>
            </div>

            {/* AI Generated WhatsApp Output */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> AI Recovery Campaign Generated
                </div>
                <Badge variant="emerald" className="text-[10px] py-0 px-2">
                  20% OFF Offer Attached
                </Badge>
              </div>

              <div className="bg-[#071d15] p-3 rounded-lg border border-emerald-500/20 text-xs text-emerald-100 font-sans leading-relaxed">
                "Hi Marcus! 👋 We saw your Google review regarding the wait time on Friday. We're super sorry about the delay. We've optimized kitchen prep for peak hours! Here is a <strong>20% OFF voucher (REVIVE20)</strong> for your next visit. We'd love to make it right!"
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-400">
                  Status: {simulatedSent ? "Sent to WhatsApp ✅" : "Ready to Dispatch"}
                </span>
                <button
                  onClick={() => setSimulatedSent(true)}
                  disabled={simulatedSent}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    simulatedSent
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-900/40"
                  }`}
                >
                  {simulatedSent ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Message Sent
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> Dispatch Recovery Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="text-zinc-300 font-medium mb-2">
              Recurring Complaint Clusters (Last 30 Days):
            </div>
            {complaintTrends.map((trend, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-zinc-300">
                  <span>{trend.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">{trend.count} reviews ({trend.pct})</span>
                    <Badge variant={i === 0 ? "amber" : "emerald"} className="text-[10px] py-0">
                      {trend.status}
                    </Badge>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? "bg-gradient-to-r from-amber-500 to-red-500"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500"
                    }`}
                    style={{ width: trend.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
