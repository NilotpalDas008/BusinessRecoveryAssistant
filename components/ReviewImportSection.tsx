"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseReviewCSV, ParsedReview } from "@/utils/csvParser";
import { useAnalysis } from "@/context/AnalysisContext";
import { GoogleBusinessModal } from "./GoogleBusinessModal";
import { RateLimitModal } from "./RateLimitModal";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  ArrowRight,
  X,
  MessageSquareText,
  BrainCircuit,
} from "lucide-react";

interface ToastState {
  type: "success" | "error" | "info";
  message: string;
}

const ANALYSIS_STAGES = [
  { step: 1, label: "Uploading Reviews" },
  { step: 2, label: "Reading CSV" },
  { step: 3, label: "Sending Reviews to Gemini" },
  { step: 4, label: "Analyzing Sentiment" },
  { step: 5, label: "Detecting Complaint Categories" },
  { step: 6, label: "Finding Business Trends" },
  { step: 7, label: "Calculating Business Health Score" },
  { step: 8, label: "Generating Executive Summary" },
  { step: 9, label: "Preparing Analytics Dashboard" },
];

export function ReviewImportSection() {
  const router = useRouter();
  const { saveAnalysisData } = useAnalysis();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedReviews, setParsedReviews] = useState<ParsedReview[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isFullScreenLoading, setIsFullScreenLoading] = useState<boolean>(false);

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStageText, setActiveStageText] = useState<string>("Uploading Reviews");

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState<boolean>(false);
  const [rateLimitErrorMessage, setRateLimitErrorMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const showToast = (type: "success" | "error" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setIsParsing(true);
    setUploadProgress(20);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    const parseResult = await parseReviewCSV(file);
    clearInterval(timer);
    setUploadProgress(100);

    setTimeout(() => {
      setIsParsing(false);
      if (parseResult.success && parseResult.reviews) {
        setParsedReviews(parseResult.reviews);
        setTotalCount(parseResult.totalCount || parseResult.reviews.length);
        showToast("success", `Parsed ${parseResult.reviews.length} reviews successfully.`);
      } else {
        setSelectedFile(null);
        setParsedReviews([]);
        setTotalCount(0);
        showToast("error", parseResult.error || "Invalid CSV file format.");
      }
    }, 300);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setParsedReviews([]);
    setTotalCount(0);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyzeReviews = async () => {
    console.log("[STEP 1] Analyze button clicked");

    if (parsedReviews.length === 0) {
      showToast("error", "No reviews available to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setIsFullScreenLoading(true);
    setCompletedSteps([1]);
    setActiveStageText(ANALYSIS_STAGES[0].label);

    try {
      // Step 1: Uploading Reviews -> Complete in 200ms
      await new Promise((r) => setTimeout(r, 200));
      setCompletedSteps([1, 2]);
      setActiveStageText(ANALYSIS_STAGES[1].label);

      // Step 2: Reading CSV -> Step 3: Sending Reviews to Gemini in 250ms
      await new Promise((r) => setTimeout(r, 250));
      setCompletedSteps([1, 2, 3]);
      setActiveStageText(ANALYSIS_STAGES[2].label);

      // Step 3: Sending Reviews to Gemini -> Step 4: Analyzing Sentiment in 1350ms
      await new Promise((r) => setTimeout(r, 1350));
      setCompletedSteps([1, 2, 3, 4]);
      setActiveStageText(ANALYSIS_STAGES[3].label); // Step 4 active ("Analyzing Sentiment")

      // Distribute remaining analysis steps (Steps 4 to 8) evenly over backend processing time (~3.8s per step)
      let currentStageIdx = 3; // Step 4 (Index 3)
      timerRef.current = setInterval(() => {
        if (currentStageIdx < 7) { // Advance up to Step 8 ("Generating Executive Summary")
          currentStageIdx++;
          const stage = ANALYSIS_STAGES[currentStageIdx];
          setCompletedSteps((prev) => Array.from(new Set([...prev, stage.step - 1])));
          setActiveStageText(stage.label);
        } else if (currentStageIdx === 7) {
          // At Step 9 ("Preparing Analytics Dashboard"), keep step 9 active with spinner while waiting
          currentStageIdx = 8;
          setCompletedSteps([1, 2, 3, 4, 5, 6, 7, 8]);
          setActiveStageText(ANALYSIS_STAGES[8].label);
        }
      }, 3800);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      console.log(`[STEP 2] Sending POST /api/reviews/analyze`, {
        backendUrl,
        reviewsCount: parsedReviews.length,
      });

      const response = await fetch(`${backendUrl}/api/reviews/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessId: "biz_hackathon_demo",
          reviews: parsedReviews,
        }),
      });

      // Stop the progressive interval timer once backend HTTP response arrives
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (!response.ok) {
        let errorMsg = `Analysis request failed with status ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData?.message || errData?.error || errorMsg;
        } catch {}

        const isRateLimit =
          response.status === 429 ||
          errorMsg.toLowerCase().includes("quota") ||
          errorMsg.toLowerCase().includes("rate limit") ||
          errorMsg.toLowerCase().includes("resource_exhausted");

        if (isRateLimit) {
          setRateLimitErrorMessage(errorMsg);
          setIsRateLimitModalOpen(true);
          setIsFullScreenLoading(false);
          setIsAnalyzing(false);
          return;
        }

        throw new Error(errorMsg);
      }

      // Robust response payload extraction (handles both NDJSON stream text & standard JSON)
      const rawText = await response.text();
      let finalResult: any = null;

      try {
        const parsed = JSON.parse(rawText);
        finalResult = parsed.result || (parsed.summary || parsed.sentimentScore ? parsed : null);
      } catch {
        const lines = rawText.split("\n").filter((l) => l.trim().length > 0);
        for (let i = lines.length - 1; i >= 0; i--) {
          try {
            const event = JSON.parse(lines[i]);
            if (event.result) {
              finalResult = event.result;
              break;
            } else if (event.summary || event.sentimentScore) {
              finalResult = event;
              break;
            }
          } catch {}
        }
      }

      if (!finalResult || (!finalResult.summary && !finalResult.sentimentScore)) {
        throw new Error("Invalid or incomplete review analysis response received from server.");
      }

      console.log("[STEP 3] Analysis result received, completing progress steps...", finalResult);

      // Rapidly complete any remaining intermediate steps up to Step 8 (120ms each)
      for (let s = 4; s <= 8; s++) {
        setCompletedSteps((prev) => Array.from(new Set([...prev, s])));
        setActiveStageText(ANALYSIS_STAGES[s - 1].label);
        await new Promise((r) => setTimeout(r, 120));
      }

      // Complete final step 9 ("Preparing Analytics Dashboard")
      setCompletedSteps([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      setActiveStageText(ANALYSIS_STAGES[8].label);

      // Save analysis data to global AnalysisContext state
      saveAnalysisData(finalResult);

      // Save analysis data to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("reviewAnalysisData", JSON.stringify(finalResult));
      }

      // Wait 700ms with 100% completed checklist before navigating
      await new Promise((r) => setTimeout(r, 700));

      console.log("[STEP 4] Executing automatic navigation to /analytics...");

      // Perform automatic navigation to /analytics BEFORE hiding full screen loading modal
      router.push("/analytics");
      window.location.href = "/analytics";
    } catch (err: unknown) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsFullScreenLoading(false);
      setIsAnalyzing(false);
      const message = err instanceof Error ? err.message : "Failed to communicate with backend.";

      const isRateLimit =
        message.toLowerCase().includes("429") ||
        message.toLowerCase().includes("quota") ||
        message.toLowerCase().includes("rate limit") ||
        message.toLowerCase().includes("resource_exhausted");

      if (isRateLimit) {
        setRateLimitErrorMessage(message);
        setIsRateLimitModalOpen(true);
      } else {
        showToast("error", `Analysis Failed: ${message}`);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Full-Screen Real-Time Smooth Event-Driven Loading Overlay */}
      {isFullScreenLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="flex flex-col items-center text-center space-y-5 max-w-md w-full bg-[#121216]/95 border border-white/10 p-7 rounded-3xl shadow-2xl">
            {/* Animated Brain Icon */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-blue-500/20 animate-ping" />
              <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-2xl shadow-blue-500/30">
                <BrainCircuit className="h-10 w-10 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                🤖 AI is analyzing your customer reviews...
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Gemini 3 Flash is processing {totalCount} reviews
              </p>
            </div>

            {/* Smooth Percentage Progress Bar */}
            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono px-1">
                <span>{activeStageText}</span>
                <span className="text-blue-400 font-bold">
                  {Math.round((completedSteps.length / ANALYSIS_STAGES.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.max(10, Math.round((completedSteps.length / ANALYSIS_STAGES.length) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Dynamic Step Progression Checklist */}
            <div className="w-full space-y-1.5 text-left pt-2 border-t border-white/[0.08]">
              {ANALYSIS_STAGES.map((stg) => {
                const isCompleted = completedSteps.includes(stg.step);
                const isActive = !isCompleted && (completedSteps.length + 1 === stg.step || (completedSteps.length === 0 && stg.step === 1));

                return (
                  <div
                    key={stg.step}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium"
                        : isActive
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold"
                        : "bg-white/[0.02] border border-transparent text-zinc-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 animate-in zoom-in-50 duration-200" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-zinc-600 shrink-0" />
                      )}
                      <span>{stg.label}</span>
                    </div>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">DONE</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Banner */}
      {toast && (
        <div
          className={`p-4 rounded-xl border backdrop-blur-md flex items-center justify-between text-xs font-medium animate-in slide-in-from-top duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : toast.type === "error"
              ? "bg-red-500/10 border-red-500/30 text-red-300"
              : "bg-blue-500/10 border-blue-500/30 text-blue-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Import Options Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-400" /> Import Customer Reviews
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Import feedback from CSV or connect external business profiles for AI analysis.
          </p>
        </div>
      </div>

      {/* Two Import Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 1: CSV Upload Card */}
        <div className="dashboard-card p-6 flex flex-col justify-between space-y-4 relative overflow-hidden border-blue-500/20 bg-[#121216]/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Upload CSV File</h3>
                <span className="text-[11px] text-emerald-400 font-medium">Fully Functional</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono">
              CSV Format
            </span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragOver
                ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
                : "border-white/10 bg-white/[0.02] hover:border-blue-500/40 hover:bg-white/[0.04]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-blue-600/10 text-blue-400">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div className="text-xs text-zinc-300">
                <span className="font-semibold text-blue-400">Click to browse</span> or drag and drop your CSV file here
              </div>
              <p className="text-[11px] text-zinc-500">
                Accepted formats: <code className="text-zinc-400">.csv</code> • Maximum size: <strong>10MB</strong>
              </p>
            </div>
          </div>

          {/* Upload Progress Animation */}
          {isParsing && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-zinc-400 font-mono">
                <span>Parsing CSV Data...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Option 2: Connect Google Business (UI Mockup Only) */}
        <div
          onClick={() => setIsGoogleModalOpen(true)}
          className="dashboard-card p-6 flex flex-col justify-between space-y-4 cursor-pointer hover:border-amber-500/30 transition-all duration-200 group bg-[#121216]/90 relative"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  Connect Google Business
                </h3>
                <span className="text-[11px] text-zinc-400">Direct Account Sync</span>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Coming Soon
            </span>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2">
            <div className="p-3 rounded-full bg-amber-500/10 text-amber-400 w-fit mx-auto">
              <Lock className="h-6 w-6" />
            </div>
            <p className="text-xs text-zinc-400">
              Automatically sync reviews directly from your Google Business Profile.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-amber-400 font-medium pt-2">
            <span>View Integration Status</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* CSV Preview Table (When reviews parsed) */}
      {parsedReviews.length > 0 && (
        <div className="p-6 rounded-2xl border border-white/10 bg-[#121216]/90 backdrop-blur-xl shadow-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">CSV Review Preview</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono">
                {totalCount} Reviews Total
              </span>
            </div>
            <span className="text-xs text-zinc-400">Showing first 10 rows</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/[0.03] text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">⭐ Rating</th>
                  <th className="px-4 py-3">📝 Review Text</th>
                  <th className="px-4 py-3">🍽 Item Ordered</th>
                  <th className="px-4 py-3 rounded-r-lg">📅 Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {parsedReviews.slice(0, 10).map((rev, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-semibold text-amber-400 whitespace-nowrap">
                      {rev.rating} ⭐
                    </td>
                    <td className="px-4 py-3 text-zinc-200 max-w-xs sm:max-w-md truncate">
                      {rev.reviewText || rev.text}
                    </td>
                    <td className="px-4 py-3 text-zinc-300 font-medium whitespace-nowrap">
                      {rev.itemOrdered || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 font-mono whitespace-nowrap">
                      {rev.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              onClick={handleCancel}
              disabled={isAnalyzing}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyzeReviews}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Analyzing reviews...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Analyze Reviews ({totalCount})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Modal Dialog for Google Business */}
      <GoogleBusinessModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />

      {/* Pop Up Modal for Rate Limit Reached */}
      <RateLimitModal
        isOpen={isRateLimitModalOpen}
        onClose={() => setIsRateLimitModalOpen(false)}
        errorMessage={rateLimitErrorMessage}
        onRetry={handleAnalyzeReviews}
      />
    </div>
  );
}
