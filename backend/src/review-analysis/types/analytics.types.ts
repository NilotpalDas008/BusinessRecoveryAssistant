import { Sentiment, ComplaintCategoryType } from "./review.types";

/**
 * Aggregated sentiment breakdown and overall score metrics.
 */
export interface SentimentScore {
  positive: number;
  neutral: number;
  negative: number;
  overallScore: number;
  healthLabel?: "Excellent" | "Very Good" | "Good" | "Fair" | "Needs Improvement" | "Critical";
  statusMessage?: string;
}

/**
 * Breakdown of complaint category counts and percentages.
 */
export interface ComplaintCategory {
  category: ComplaintCategoryType;
  count: number;
  percentage: number;
}

/**
 * Sentiment metrics aggregated over specific dates.
 */
export interface Trend {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

/**
 * Frequency and impact percentage of recurring issues.
 */
export interface RecurringIssue {
  issue: string;
  count: number;
  percentage: number;
  severity?: "Critical" | "High" | "Medium" | "Low";
}

/**
 * Executive high-level summary of review analytics.
 */
export interface Summary {
  totalReviews: number;
  averageRating: number;
  overallSentiment: Sentiment;
  executiveSummary?: string;
}
