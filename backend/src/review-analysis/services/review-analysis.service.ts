import { Review, AIReview, Sentiment, ComplaintCategoryType, Urgency, Emotion } from "../types/review.types";
import { AnalyzeResponse } from "../types/api.types";
import { Summary, SentimentScore, ComplaintCategory, Trend, RecurringIssue } from "../types/analytics.types";
import { ReviewAnalysisAgent } from "../agents/review-analysis.agent";
import { AnalyticsService } from "./analytics.service";
import { TrendService } from "./trend.service";
import { RecurringIssueService } from "./recurring-issue.service";

/**
 * Service responsible for orchestrating AI analysis over batches of customer reviews in a single Gemini call.
 */
export class ReviewAnalysisService {
  private agent: ReviewAnalysisAgent;
  private analyticsService: AnalyticsService;
  private trendService: TrendService;
  private recurringIssueService: RecurringIssueService;

  constructor(
    agent?: ReviewAnalysisAgent,
    analyticsService?: AnalyticsService,
    trendService?: TrendService,
    recurringIssueService?: RecurringIssueService
  ) {
    this.agent = agent ?? new ReviewAnalysisAgent();
    this.analyticsService = analyticsService ?? new AnalyticsService();
    this.trendService = trendService ?? new TrendService();
    this.recurringIssueService = recurringIssueService ?? new RecurringIssueService();
  }

  /**
   * Analyzes customer reviews with real-time stage progress callbacks.
   */
  public async analyzeReviewsWithProgress(
    reviews: Review[],
    onProgress?: (event: Record<string, unknown>) => void
  ): Promise<AnalyzeResponse> {
    if (!reviews || reviews.length === 0) {
      return {
        summary: { totalReviews: 0, averageRating: 0, overallSentiment: "Neutral", executiveSummary: "" },
        sentimentScore: { positive: 0, neutral: 0, negative: 0, overallScore: 0, healthLabel: "Critical", statusMessage: "Immediate Attention Required" },
        complaintCategories: [],
        trendsOverTime: [],
        topRecurringIssues: [],
        reviews: [],
        recommendations: [],
      };
    }

    if (onProgress) onProgress({ stage: "Sending Reviews to Gemini", step: 3 });

    // Single Gemini API invocation for the entire batch
    const rawBatch = await this.agent.analyzeBatch(reviews);

    if (onProgress) onProgress({ stage: "Analyzing Sentiment", step: 4 });

    // Merge original review fields with Gemini's AI analysis output
    const aiReviews: AIReview[] = reviews.map((r, idx) => {
      const reviewId = r.reviewId || `REV-${1000 + idx}`;
      const rawR =
        (rawBatch.reviews || []).find((item) => item.reviewId === reviewId) ||
        (rawBatch.reviews || [])[idx] ||
        {};

      const sentiment: Sentiment =
        (rawR.sentiment as Sentiment) ||
        (r.rating >= 4 ? "Positive" : r.rating <= 2 ? "Negative" : "Neutral");

      const category: ComplaintCategoryType =
        ((rawR.complaintCategory || rawR.category) as ComplaintCategoryType) || "General";

      const urgency: Urgency =
        ((rawR.priority || rawR.urgency) as Urgency) ||
        (r.rating <= 2 ? "High" : "Low");

      const emotion: Emotion =
        (rawR.emotion as Emotion) ||
        (sentiment === "Positive"
          ? "Satisfied"
          : sentiment === "Negative"
          ? "Frustrated"
          : "Neutral");

      return {
        reviewId,
        rating: r.rating,
        text: r.reviewText || r.text || "",
        date: r.date,
        customerName: r.customerName || r.reviewerName || "Anonymous",
        itemOrdered: r.itemOrdered || "N/A",
        sentiment,
        category,
        emotion,
        urgency,
        summary: rawR.summary || r.reviewText || r.text || "No summary available",
        recommendedAction:
          rawR.recommendedAction ||
          (rawBatch.recommendations && rawBatch.recommendations[0]) ||
          "Maintain service quality",
      };
    });

    if (onProgress) onProgress({ stage: "Detecting Complaint Categories", step: 5 });

    // 1. Summary & Executive Business Report
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
    const averageRating = Number((totalRating / (totalReviews || 1)).toFixed(1));

    let overallSentiment: Sentiment = "Neutral";
    if (typeof rawBatch.summary === "object" && rawBatch.summary?.overallSentiment) {
      overallSentiment = rawBatch.summary.overallSentiment as Sentiment;
    } else {
      const posCount = aiReviews.filter((r) => r.sentiment === "Positive").length;
      const negCount = aiReviews.filter((r) => r.sentiment === "Negative").length;
      overallSentiment =
        posCount > negCount ? "Positive" : negCount > posCount ? "Negative" : "Neutral";
    }

    let execSummary = "";
    if (typeof rawBatch.summary === "object" && rawBatch.summary?.executiveSummary) {
      execSummary = rawBatch.summary.executiveSummary;
    } else if (typeof rawBatch.executiveSummary === "string") {
      execSummary = rawBatch.executiveSummary;
    }

    const summary: Summary = {
      totalReviews,
      averageRating,
      overallSentiment,
      executiveSummary: execSummary,
    };

    // 3. Complaint Categories
    const complaintCategories: ComplaintCategory[] =
      rawBatch.complaintCategories && rawBatch.complaintCategories.length > 0
        ? rawBatch.complaintCategories.map((c) => ({
            category: c.category as ComplaintCategoryType,
            count: c.count,
            percentage: c.percentage,
          }))
        : this.analyticsService.calculateComplaintCategories(aiReviews);

    if (onProgress) onProgress({ stage: "Finding Trends", step: 6 });

    // 4. Trends Over Time
    const trendsOverTime: Trend[] =
      rawBatch.trendsOverTime && rawBatch.trendsOverTime.length > 0
        ? rawBatch.trendsOverTime
        : this.trendService.calculateTrends(aiReviews);

    // 5. Top Recurring Issues
    const topRecurringIssues: RecurringIssue[] =
      rawBatch.topRecurringIssues && rawBatch.topRecurringIssues.length > 0
        ? rawBatch.topRecurringIssues.map((i) => ({
            issue: i.issue,
            count: i.count,
            percentage: i.percentage,
            severity:
              i.severity || (i.percentage > 30 ? "Critical" : i.percentage > 15 ? "High" : "Medium"),
          }))
        : this.recurringIssueService.calculateRecurringIssues(aiReviews);

    if (onProgress) onProgress({ stage: "Generating Executive Summary", step: 7 });

    // 2. Sentiment Score & Dynamic 4-Factor Weighted Business Health Score Algorithm
    const pos = rawBatch.sentimentScore?.positive ?? Number(((aiReviews.filter((r) => r.sentiment === "Positive").length / totalReviews) * 100).toFixed(1));
    const neu = rawBatch.sentimentScore?.neutral ?? Number(((aiReviews.filter((r) => r.sentiment === "Neutral").length / totalReviews) * 100).toFixed(1));
    const neg = rawBatch.sentimentScore?.negative ?? Number(((aiReviews.filter((r) => r.sentiment === "Negative").length / totalReviews) * 100).toFixed(1));

    // 1) Sentiment Score (40% Weight): ((PositivePercentage - NegativePercentage) + 100) / 2
    const rawSentimentScore = ((pos - neg) + 100) / 2;
    const sentimentScoreVal = Math.min(100, Math.max(0, rawSentimentScore));

    // 2) Rating Score (30% Weight): (AverageRating / 5) * 100
    const ratingScore = Math.min(100, Math.max(0, (averageRating / 5) * 100));

    // 3) Complaint Score (20% Weight): ComplaintRate = ComplaintReviews / TotalReviews; ComplaintScore = 100 - (ComplaintRate * 100)
    const complaintReviewsCount =
      complaintCategories.reduce((sum, c) => sum + (c.count || 0), 0) ||
      aiReviews.filter((r) => r.sentiment === "Negative").length;
    const complaintRate = Math.min(1, Math.max(0, complaintReviewsCount / (totalReviews || 1)));
    const complaintScore = Math.min(100, Math.max(0, 100 - complaintRate * 100));

    // 4) Recurring Issue Score (10% Weight): Low=10, Medium=25, High=40, Critical=60. Average penalty.
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

    const overallScore = Math.min(100, Math.max(0, Math.round(rawBusinessHealth)));

    let healthLabel: "Excellent" | "Very Good" | "Good" | "Fair" | "Needs Improvement" | "Critical";
    let statusMessage: string;

    if (overallScore >= 90) {
      healthLabel = "Excellent";
      statusMessage = "Excellent Customer Satisfaction";
    } else if (overallScore >= 80) {
      healthLabel = "Very Good";
      statusMessage = "Strong Business Performance";
    } else if (overallScore >= 70) {
      healthLabel = "Good";
      statusMessage = "Healthy Business with Minor Improvements";
    } else if (overallScore >= 60) {
      healthLabel = "Fair";
      statusMessage = "Moderate Action Needed";
    } else if (overallScore >= 45) {
      healthLabel = "Needs Improvement";
      statusMessage = "Improvement Required";
    } else {
      healthLabel = "Critical";
      statusMessage = "Immediate Attention Required";
    }

    const sentimentScore: SentimentScore = {
      positive: pos,
      neutral: neu,
      negative: neg,
      overallScore,
      healthLabel,
      statusMessage,
    };

    return {
      summary,
      sentimentScore,
      complaintCategories,
      trendsOverTime,
      topRecurringIssues,
      reviews: aiReviews,
      recommendations: rawBatch.recommendations || [],
    };
  }

  public async analyzeReviews(reviews: Review[]): Promise<AnalyzeResponse> {
    return this.analyzeReviewsWithProgress(reviews);
  }
}
