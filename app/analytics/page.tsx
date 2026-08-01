"use client";

import { useState } from "react";
import { useAnalysis } from "@/context/AnalysisContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  FolderOpen,
  Flame,
  Lightbulb,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Download,
  Loader2,
} from "lucide-react";

/**
 * Dynamically computes Business Health Score (0-100), Health Label, Status Message, and Health Color Theme
 * based on positive sentiment, average star rating, negative percentage, complaint rate, and recurring issue severity.
 */
function computeBusinessHealth(
  summary: { totalReviews: number; averageRating: number },
  sentimentScore: { positive: number; neutral: number; negative: number; overallScore?: number },
  complaintCategories: Array<{ category: string; count: number; percentage: number }>,
  topRecurringIssues: Array<{ issue: string; count: number; percentage: number; severity?: string }>
) {
  // 1) Sentiment Score (40% Weight): ((PositivePercentage - NegativePercentage) + 100) / 2
  const posPct = sentimentScore.positive;
  const negPct = sentimentScore.negative;
  const rawSentimentScore = ((posPct - negPct) + 100) / 2;
  const sentimentScoreVal = Math.min(100, Math.max(0, rawSentimentScore));

  // 2) Rating Score (30% Weight): (AverageRating / 5) * 100
  const ratingScore = Math.min(100, Math.max(0, (summary.averageRating / 5) * 100));

  // 3) Complaint Score (20% Weight): ComplaintRate = ComplaintReviews / TotalReviews; ComplaintScore = 100 - (ComplaintRate * 100)
  const totalRev = summary.totalReviews || 1;
  const complaintReviewsCount = complaintCategories.reduce((sum, c) => sum + (c.count || 0), 0);
  const complaintRate = Math.min(1, Math.max(0, complaintReviewsCount / totalRev));
  const complaintScore = Math.min(100, Math.max(0, 100 - complaintRate * 100));

  // 4) Recurring Issue Score (10% Weight): Penalties (Low=10, Medium=25, High=40, Critical=60), AveragePenalty, RecurringIssueScore = 100 - AveragePenalty
  let issuePenaltiesSum = 0;
  const issueCount = topRecurringIssues.length;

  if (issueCount > 0) {
    topRecurringIssues.forEach((issue) => {
      const sev =
        issue.severity ||
        (issue.percentage > 30 ? "Critical" : issue.percentage > 15 ? "High" : "Medium");
      if (sev === "Critical") issuePenaltiesSum += 60;
      else if (sev === "High") issuePenaltiesSum += 40;
      else if (sev === "Medium") issuePenaltiesSum += 25;
      else issuePenaltiesSum += 10;
    });
  }

  const averagePenalty = issueCount > 0 ? issuePenaltiesSum / issueCount : 0;
  const recurringIssueScore = Math.min(100, Math.max(0, 100 - averagePenalty));

  // Final Business Health Score
  const rawBusinessHealth =
    sentimentScoreVal * 0.40 +
    ratingScore * 0.30 +
    complaintScore * 0.20 +
    recurringIssueScore * 0.10;

  const finalScore = Math.min(100, Math.max(0, Math.round(rawBusinessHealth)));

  // Health Label, Status Message & Theme Classification
  if (finalScore >= 90) {
    return {
      score: finalScore,
      healthLabel: "Excellent",
      label: "Excellent",
      statusMessage: "Excellent Customer Satisfaction",
      subtext: "Excellent Customer Satisfaction",
      color: "Green",
      textColor: "text-emerald-400",
      subtextColor: "text-emerald-400/90",
      borderColor: "border-emerald-500/30",
      badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Icon: ShieldCheck,
    };
  }
  if (finalScore >= 80) {
    return {
      score: finalScore,
      healthLabel: "Very Good",
      label: "Very Good",
      statusMessage: "Strong Business Performance",
      subtext: "Strong Business Performance",
      color: "Green",
      textColor: "text-emerald-400",
      subtextColor: "text-emerald-400/90",
      borderColor: "border-emerald-500/30",
      badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Icon: CheckCircle2,
    };
  }
  if (finalScore >= 70) {
    return {
      score: finalScore,
      healthLabel: "Good",
      label: "Good",
      statusMessage: "Healthy Business with Minor Improvements",
      subtext: "Healthy Business with Minor Improvements",
      color: "Green",
      textColor: "text-emerald-400",
      subtextColor: "text-emerald-400/90",
      borderColor: "border-emerald-500/30",
      badgeStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      Icon: CheckCircle2,
    };
  }
  if (finalScore >= 60) {
    return {
      score: finalScore,
      healthLabel: "Fair",
      label: "Fair",
      statusMessage: "Moderate Action Needed",
      subtext: "Moderate Action Needed",
      color: "Yellow",
      textColor: "text-amber-400",
      subtextColor: "text-amber-400/90",
      borderColor: "border-amber-500/30",
      badgeStyle: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      Icon: AlertTriangle,
    };
  }
  if (finalScore >= 45) {
    return {
      score: finalScore,
      healthLabel: "Needs Improvement",
      label: "Needs Improvement",
      statusMessage: "Improvement Required",
      subtext: "Improvement Required",
      color: "Orange",
      textColor: "text-orange-400",
      subtextColor: "text-orange-400/90",
      borderColor: "border-orange-500/30",
      badgeStyle: "bg-orange-500/10 text-orange-400 border-orange-500/30",
      Icon: AlertTriangle,
    };
  }
  return {
    score: finalScore,
    healthLabel: "Critical",
    label: "Critical",
    statusMessage: "Immediate Attention Required",
    subtext: "Immediate Attention Required",
    color: "Red",
    textColor: "text-red-400",
    subtextColor: "text-red-400/90",
    borderColor: "border-red-500/30",
    badgeStyle: "bg-red-500/10 text-red-400 border-red-500/30",
    Icon: Flame,
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { analysisData } = useAnalysis();

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownloadPDF = async () => {
    if (!analysisData) return;
    setIsExporting(true);

    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error(`PDF export failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AI_Business_Analytics_Report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF report via Puppeteer:", err);
    } finally {
      setIsExporting(false);
    }
  };

  console.log("[STEP 8] Analytics page mounted", { hasAnalysisData: !!analysisData });

  if (!analysisData) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center space-y-5 bg-[#121216]/90 border border-white/10 rounded-3xl max-w-xl mx-auto my-12">
          <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-400 w-fit mx-auto border border-blue-500/20">
            <BrainCircuit className="h-10 w-10 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">No Review Analysis Loaded</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upload a customer review CSV on the Dashboard to run Gemini AI analysis and view live intelligence reports.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <ArrowLeft className="h-4 w-4" /> Go to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { summary, sentimentScore, complaintCategories, trendsOverTime, topRecurringIssues, reviews } = analysisData;

  // Compute dynamic Business Health Metrics intelligently
  const healthMetrics = computeBusinessHealth(
    summary,
    sentimentScore,
    complaintCategories,
    topRecurringIssues
  );

  // Extract recommended actions dynamically
  const recommendedActions =
    analysisData.recommendations && analysisData.recommendations.length > 0
      ? analysisData.recommendations.map((rec, idx) => ({
          id: idx,
          title: `Action Item #${idx + 1}`,
          description: typeof rec === "string" ? rec : JSON.stringify(rec),
          priority: idx === 0 ? "High" : idx === 1 ? "Medium" : "Low",
          category: complaintCategories[idx % (complaintCategories.length || 1)]?.category || "General",
          rating: summary.averageRating,
        }))
      : reviews
          .filter((r) => r.recommendedAction && r.recommendedAction.trim().length > 0)
          .map((r, idx) => ({
            id: idx,
            title: `${r.category || "General"} Recovery Action`,
            description: r.recommendedAction,
            priority: r.urgency === "Critical" || r.urgency === "High" ? "High" : r.urgency === "Medium" ? "Medium" : "Low",
            category: r.category,
            rating: r.rating,
          }));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Bar with Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <BarChart3 className="h-7 w-7 text-blue-400" /> AI Review Analytics & Intelligence
              </h1>
            </div>
            <p className="text-xs text-zinc-400">
              Live sentiment metrics, recurring issues, and automated recovery actions generated by Gemini 3 Flash.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" /> Live AI Session
            </span>
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Report (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Printable & Exportable Analytics Report Content */}
        <div id="analytics-report-content" className="space-y-8 p-1">
          {/* 1. 📊 Business Health Overview */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" /> Business Health Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Business Health Score */}
              <div className={`dashboard-card p-5 space-y-2 bg-[#121216]/90 border ${healthMetrics.borderColor}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">Business Health Score</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase border ${healthMetrics.badgeStyle}`}>
                    {healthMetrics.label}
                  </span>
                </div>
                <div className={`text-3xl font-extrabold tracking-tight ${healthMetrics.textColor}`}>
                  {healthMetrics.score}%
                </div>
                <div className={`text-[11px] font-medium inline-flex items-center gap-1 ${healthMetrics.subtextColor}`}>
                  <healthMetrics.Icon className="h-3.5 w-3.5" /> {healthMetrics.subtext}
                </div>
              </div>

              {/* Reviews Analyzed */}
              <div className="dashboard-card p-5 space-y-2 bg-[#121216]/90">
                <span className="text-xs font-medium text-zinc-400">Reviews Analyzed</span>
                <div className="text-3xl font-extrabold text-white tracking-tight">
                  {summary.totalReviews}
                </div>
                <div className="text-[11px] text-zinc-400">100% Processing Complete</div>
              </div>

              {/* Analysis Time */}
              <div className="dashboard-card p-5 space-y-2 bg-[#121216]/90">
                <span className="text-xs font-medium text-zinc-400">Analysis Time</span>
                <div className="text-xl font-bold text-zinc-200 font-mono truncate">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="text-[11px] text-zinc-400 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3 text-purple-400" /> Today's Processing Run
                </div>
              </div>

              {/* Average Rating */}
              <div className="dashboard-card p-5 space-y-2 bg-[#121216]/90">
                <span className="text-xs font-medium text-zinc-400">Average Rating</span>
                <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
                  {summary.averageRating} ⭐
                </div>
                <div className="text-[11px] text-zinc-400">Based on parsed CSV dataset</div>
              </div>
            </div>
          </div>

          {/* 2. 😊 Overall Sentiment */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Overall Sentiment
            </h2>
            <div className="dashboard-card p-6 space-y-5 bg-[#121216]/90">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-base font-bold text-white">Customer Sentiment Classification</h3>
                  <p className="text-xs text-zinc-400">Overall feedback polarity breakdown</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border font-mono ${
                    summary.overallSentiment === "Positive"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : summary.overallSentiment === "Negative"
                      ? "bg-red-500/10 text-red-400 border-red-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {summary.overallSentiment} Sentiment
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                  <span className="text-xs font-medium text-emerald-300">Positive Feedback</span>
                  <div className="text-2xl font-black text-emerald-400">{sentimentScore.positive}%</div>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                  <span className="text-xs font-medium text-amber-300">Neutral Feedback</span>
                  <div className="text-2xl font-black text-amber-400">{sentimentScore.neutral}%</div>
                </div>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center space-y-1">
                  <span className="text-xs font-medium text-red-300">Negative Feedback</span>
                  <div className="text-2xl font-black text-red-400">{sentimentScore.negative}%</div>
                </div>
              </div>

              <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full transition-all" style={{ width: `${sentimentScore.positive}%` }} />
                <div className="bg-amber-500 h-full transition-all" style={{ width: `${sentimentScore.neutral}%` }} />
                <div className="bg-red-500 h-full transition-all" style={{ width: `${sentimentScore.negative}%` }} />
              </div>
            </div>
          </div>

          {/* 3. 📂 Complaint Categories */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-purple-400" /> Complaint Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {complaintCategories.map((cat, idx) => (
                <div key={idx} className="dashboard-card p-5 space-y-3 bg-[#121216]/90 border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white truncate">{cat.category}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
                      {cat.percentage}%
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-zinc-100">{cat.count} <span className="text-xs font-normal text-zinc-400">reviews</span></div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 📈 Trends Over Time (Recharts Line Chart) */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" /> Trends Over Time
            </h2>
            <div className="dashboard-card p-6 space-y-4 bg-[#121216]/90">
              <div>
                <h3 className="text-base font-bold text-white">Sentiment Trajectory</h3>
                <p className="text-xs text-zinc-400">Daily distribution of customer sentiment feedback</p>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsOverTime} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717A" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717A" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181B",
                        borderColor: "#27272A",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "#F4F4F5",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="positive" name="Positive" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="negative" name="Negative" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 5. 🔥 Top Recurring Issues */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-400" /> Top Recurring Issues
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topRecurringIssues.map((issue, idx) => {
                const severity = issue.severity || (issue.percentage > 30 ? "Critical" : issue.percentage > 15 ? "High" : "Medium");

                return (
                  <div key={idx} className="dashboard-card p-5 space-y-3 bg-[#121216]/90 border-red-500/20">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase border ${
                        severity === "Critical"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : severity === "High"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}>
                        {severity} Severity
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">{issue.percentage}%</span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{issue.issue}</h3>
                      <p className="text-xs text-zinc-400 mt-1">Detected in {issue.count} separate customer reviews</p>
                    </div>

                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: `${issue.percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. 🤖 AI Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-purple-400" /> AI Executive Summary
            </h2>
            <div className="dashboard-card p-6 bg-[#121216]/90 border-purple-500/30 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                <Sparkles className="h-4 w-4" /> Gemini 3 Flash Executive Business Report
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans whitespace-pre-line bg-white/[0.02] p-4 rounded-xl border border-white/[0.06]">
                {summary.executiveSummary ||
                  (typeof summary === "string"
                    ? summary
                    : `Analysis of ${summary.totalReviews} customer reviews reveals an average rating of ${summary.averageRating} ⭐ with an overall ${summary.overallSentiment.toLowerCase()} sentiment polarity.`)}
              </p>
            </div>
          </div>

          {/* 7. 💡 Recommended Business Actions */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-400" /> Recommended Business Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedActions.map((action) => (
                <div key={action.id} className="dashboard-card p-5 space-y-3 bg-[#121216]/90 border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                      <h3 className="text-xs font-bold text-white">{action.title}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                      action.priority === "High"
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : action.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {action.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-emerald-300 leading-relaxed bg-emerald-500/[0.03] p-3 rounded-xl border border-emerald-500/10">
                    {action.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Category: {action.category}</span>
                    <span>Rating Context: {action.rating} ⭐</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
