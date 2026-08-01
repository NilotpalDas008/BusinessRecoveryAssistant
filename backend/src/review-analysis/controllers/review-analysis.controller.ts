import { Request, Response, NextFunction } from "express";
import { AnalyzeRequest, AnalyzeResponse, ApiErrorResponse } from "../types/api.types";
import { ReviewAnalysisService, AnalyticsService, TrendService, RecurringIssueService, SummaryService, GeminiError } from "../services";

export class ReviewAnalysisController {
  constructor(
    private reviewService = new ReviewAnalysisService(),
    private analyticsService = new AnalyticsService(),
    private trendService = new TrendService(),
    private recurringIssueService = new RecurringIssueService(),
    private summaryService = new SummaryService()
  ) {}

  public analyze = async (
    req: Request<Record<string, never>, unknown, AnalyzeRequest>,
    res: Response<AnalyzeResponse | ApiErrorResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("[STEP C] ReviewAnalysisService started");
      const { reviews } = req.body;
      const aiReviews = await this.reviewService.analyzeReviews(reviews);

      console.log("[STEP F] Sending HTTP 200");
      res.status(200).json({
        summary: this.summaryService.generateSummary(aiReviews),
        sentimentScore: this.analyticsService.calculateSentimentScore(aiReviews),
        complaintCategories: this.analyticsService.calculateComplaintCategories(aiReviews),
        trendsOverTime: this.trendService.calculateTrends(aiReviews),
        topRecurringIssues: this.recurringIssueService.calculateRecurringIssues(aiReviews),
        reviews: aiReviews,
      });
    } catch (error) {
      if (error instanceof GeminiError) {
        res.status(error.statusCode).json({ success: false, message: error.message, errorCode: error.errorCode });
        return;
      }
      next(error);
    }
  };
}
