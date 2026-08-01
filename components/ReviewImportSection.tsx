"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
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

  const [toast, setToast] = useState<ToastState | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [isRateLimitModalOpen, setIsRateLimitModalOpen] = useState<boolean>(false);
  const [rateLimitErrorMessage, setRateLimitErrorMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

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

    console.log("[STEP 2] Preparing request");
    setIsAnalyzing(true);
    setIsFullScreenLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      console.log(`[STEP 3] Sending POST /api/reviews/analyze`, {
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

      console.log("[STEP 4] Backend response received", {
        status: response.status,
        ok: response.ok,
      });

      const data = await response.json();
      console.log("[STEP 5] Response JSON parsed", data);

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || `Analysis request failed with status ${response.status}`;
        
        const isRateLimit =
          response.status === 429 ||
          data?.errorCode === "GEMINI_RATE_LIMIT_EXCEEDED" ||
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

      // Store analysis data in global context and sessionStorage
      console.log("[STEP 6] Saving analysis data");
      saveAnalysisData(data);

      // Stop loading and navigate directly to /analytics
      console.log("[STEP 7] Navigating to /analytics");
      setIsFullScreenLoading(false);
      setIsAnalyzing(false);
      router.push("/analytics");
    } catch (err: unknown) {
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
      {/* Full-Screen Loading Overlay (Active ONLY while waiting for backend response) */}
      {isFullScreenLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300">
          <div className="flex flex-col items-center text-center space-y-6 max-w-lg w-full bg-[#121216]/95 border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-blue-500/20 animate-ping" />
              <div className="p-4 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-2xl shadow-blue-500/30">
                <BrainCircuit className="h-12 w-12 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                🤖 AI is analyzing your customer reviews...
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                Google Gemini API is processing {totalCount} reviews. Please wait...
              </p>
            </div>

            <div className="w-full space-y-2 pt-2">
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 h-full w-full animate-pulse" />
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-400 font-mono pt-1">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Backend & Gemini Analysis in progress...</span>
              </div>
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

          {/* Selected File Details */}
          {selectedFile && !isParsing && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileSpreadsheet className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="text-zinc-200 font-medium truncate">{selectedFile.name}</span>
                <span className="text-zinc-500 text-[10px]">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="p-1 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
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
