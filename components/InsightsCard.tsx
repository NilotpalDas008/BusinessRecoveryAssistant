"use client";

import { Sparkles, AlertTriangle, ArrowRight, Lightbulb, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export function InsightsCard() {
  const [actedInsights, setActedInsights] = useState<Record<number, boolean>>({});

  const insights = [
    {
      id: 1,
      title: "Cold food complaints increased by 18% compared to last week.",
      category: "Operational Alert",
      priority: "High",
      priorityBg: "bg-red-500/10 text-red-400 border-red-500/20",
      action: "Notify Kitchen Ops",
      icon: AlertTriangle,
      iconColor: "text-red-400",
      impact: "High Impact: Affects 12 customer reviews",
    },
    {
      id: 2,
      title: "Customers visiting after 8PM are leaving lower ratings (avg 3.4 ⭐).",
      category: "Staffing Pattern",
      priority: "Medium",
      priorityBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      action: "Review Shift Schedule",
      icon: Clock,
      iconColor: "text-amber-400",
      impact: "Medium Impact: Evening table turnover delay",
    },
    {
      id: 3,
      title: "Offering a free dessert could improve repeat visits by up to 34%.",
      category: "Growth Recommendation",
      priority: "Opportunity",
      priorityBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      action: "Deploy Dessert Voucher",
      icon: Lightbulb,
      iconColor: "text-emerald-400",
      impact: "Revenue Booster: Estimated +$1,200 monthly",
    },
  ];

  const handleAction = (id: number) => {
    setActedInsights((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="dashboard-card p-6 border border-[#27272A] relative overflow-hidden">
      {/* Subtle top border glow accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">AI Business Insights</h3>
            <p className="text-xs text-zinc-400">
              Automated intelligence generated from recent customer reviews and operational trends
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
          3 Actionable Recommendations
        </span>
      </div>

      {/* Insight List */}
      <div className="space-y-4">
        {insights.map((item) => {
          const Icon = item.icon;
          const isActed = actedInsights[item.id];

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#111113] border border-[#27272A] hover:border-[#3f3f46] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2 rounded-lg bg-[#18181B] border border-[#27272A] shrink-0 mt-0.5`}>
                  <Icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${item.priorityBg}`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-xs text-zinc-500">• {item.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100">{item.title}</h4>
                  <p className="text-xs text-zinc-400">{item.impact}</p>
                </div>
              </div>

              <div className="shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleAction(item.id)}
                  disabled={isActed}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    isActed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/20"
                  }`}
                >
                  {isActed ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Action Dispatched
                    </>
                  ) : (
                    <>
                      {item.action} <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
