import { Review } from "../types/review.types";
import { GeminiService, GeminiError } from "../services/gemini.service";
import {
  BATCH_REVIEW_ANALYSIS_SYSTEM_PROMPT,
  buildBatchReviewAnalysisUserPrompt,
} from "../prompts/review.prompt";

export interface RawBatchReviewAnalysis {
  summary?:
    | {
        totalReviews?: number;
        averageRating?: number;
        overallSentiment?: string;
        executiveSummary?: string;
      }
    | string;
  executiveSummary?: string;
  sentimentScore?: {
    positive?: number;
    neutral?: number;
    negative?: number;
    overallScore?: number;
  };
  complaintCategories?: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  trendsOverTime?: Array<{
    date: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
  topRecurringIssues?: Array<{
    issue: string;
    count: number;
    percentage: number;
    severity?: "Critical" | "High" | "Medium" | "Low";
  }>;
  recommendations?: string[];
  reviews?: Array<{
    reviewId?: string;
    sentiment?: string;
    complaintCategory?: string;
    category?: string;
    priority?: string;
    urgency?: string;
    summary?: string;
    recommendedAction?: string;
    emotion?: string;
  }>;
}

/**
 * Agent responsible for sending batch customer reviews to Google Gemini in a single prompt.
 */
export class ReviewAnalysisAgent {
  private geminiService: GeminiService;

  constructor(geminiService?: GeminiService) {
    this.geminiService = geminiService ?? new GeminiService();
  }

  /**
   * Invokes Gemini ONCE with the entire array of customer reviews.
   *
   * @param reviews Array of input customer reviews.
   * @returns Raw batch analysis result from Gemini.
   */
  public async analyzeBatch(reviews: Review[]): Promise<RawBatchReviewAnalysis> {
    if (!reviews || reviews.length === 0) {
      return {
        summary: { totalReviews: 0, averageRating: 0, overallSentiment: "Neutral", executiveSummary: "" },
        sentimentScore: { positive: 0, neutral: 0, negative: 0, overallScore: 0 },
        complaintCategories: [],
        trendsOverTime: [],
        topRecurringIssues: [],
        recommendations: [],
        reviews: [],
      };
    }

    const userPrompt = buildBatchReviewAnalysisUserPrompt(reviews);
    const systemPrompt = BATCH_REVIEW_ANALYSIS_SYSTEM_PROMPT;

    try {
      return await this.geminiService.generateJSON<RawBatchReviewAnalysis>(
        userPrompt,
        systemPrompt
      );
    } catch (error) {
      if (
        error instanceof GeminiError ||
        (typeof error === "object" && error !== null && "errorCode" in error)
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : "Batch analysis failed.";
      throw new GeminiError(
        `Review Analysis Agent failed: ${message}`,
        "AGENT_EXECUTION_FAILED",
        503
      );
    }
  }
}
