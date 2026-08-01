import { Review, AIReview } from "./review.types";
import {
  Summary,
  SentimentScore,
  ComplaintCategory,
  Trend,
  RecurringIssue,
} from "./analytics.types";

/**
 * Request payload for POST /api/v1/analyze
 */
export interface AnalyzeRequest {
  businessId?: string;
  reviews: Review[];
}

/**
 * Final response structure for POST /api/v1/analyze
 */
export interface AnalyzeResponse {
  summary: Summary;
  sentimentScore: SentimentScore;
  complaintCategories: ComplaintCategory[];
  trendsOverTime: Trend[];
  topRecurringIssues: RecurringIssue[];
  reviews: AIReview[];
}

/**
 * Standardized error response payload.
 */
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errorCode?: string;
}
