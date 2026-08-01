"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AIReviewItem {
  reviewId?: string;
  rating: number;
  text: string;
  date: string;
  sentiment: string;
  category: string;
  emotion: string;
  urgency: string;
  summary: string;
  recommendedAction: string;
  itemOrdered?: string;
  customerName?: string;
}

export interface AnalysisData {
  summary: {
    totalReviews: number;
    averageRating: number;
    overallSentiment: "Positive" | "Neutral" | "Negative" | string;
  };
  sentimentScore: {
    positive: number;
    neutral: number;
    negative: number;
    overallScore: number;
  };
  complaintCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  trendsOverTime: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
  topRecurringIssues: Array<{
    issue: string;
    count: number;
    percentage: number;
    severity?: "Critical" | "High" | "Medium" | "Low";
  }>;
  reviews: AIReviewItem[];
}

interface AnalysisContextType {
  analysisData: AnalysisData | null;
  saveAnalysisData: (data: AnalysisData) => void;
  clearAnalysisData: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const STORAGE_KEY = "reviewAnalysisData";

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setAnalysisData(JSON.parse(stored));
        } catch {
          console.error("Failed to parse analysis data from sessionStorage");
        }
      }
    }
  }, []);

  const saveAnalysisData = (data: AnalysisData) => {
    setAnalysisData(data);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const clearAnalysisData = () => {
    setAnalysisData(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AnalysisContext.Provider value={{ analysisData, saveAnalysisData, clearAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
