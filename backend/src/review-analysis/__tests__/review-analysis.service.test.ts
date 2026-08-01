import { ReviewAnalysisService } from "../services/review-analysis.service";
import { ReviewAnalysisAgent } from "../agents/review-analysis.agent";
import { Review } from "../types/review.types";

jest.mock("../agents/review-analysis.agent");

describe("ReviewAnalysisService", () => {
  let service: ReviewAnalysisService;
  let mockAgent: jest.Mocked<ReviewAnalysisAgent>;

  beforeEach(() => {
    mockAgent = new ReviewAnalysisAgent() as jest.Mocked<ReviewAnalysisAgent>;
    service = new ReviewAnalysisService(mockAgent);
  });

  it("should return empty response structure if empty review list provided", async () => {
    const result = await service.analyzeReviews([]);
    expect(result.reviews).toEqual([]);
    expect(result.summary.totalReviews).toBe(0);
    expect(mockAgent.analyzeBatch).not.toHaveBeenCalled();
  });

  it("should send entire array of reviews to ReviewAnalysisAgent in ONE batch call", async () => {
    const reviews: Review[] = [
      { rating: 5, text: "Awesome pizza", date: "2026-08-01", customerName: "John", itemOrdered: "Pizza" },
      { rating: 2, text: "Slow delivery", date: "2026-08-01", customerName: "Jane", itemOrdered: "Burger" },
    ];

    mockAgent.analyzeBatch.mockResolvedValueOnce({
      summary: { totalReviews: 2, averageRating: 3.5, overallSentiment: "Neutral" },
      sentimentScore: { positive: 50, neutral: 0, negative: 50, overallScore: 50 },
      complaintCategories: [{ category: "Wait Time", count: 1, percentage: 50 }],
      trendsOverTime: [{ date: "2026-08-01", positive: 1, neutral: 0, negative: 1 }],
      topRecurringIssues: [{ issue: "Slow delivery", count: 1, percentage: 50, severity: "Medium" }],
      recommendations: ["Speed up delivery"],
      reviews: [
        {
          reviewId: "REV-1000",
          sentiment: "Positive",
          complaintCategory: "General",
          priority: "Low",
          summary: "Praise for pizza",
          recommendedAction: "Maintain quality",
        },
        {
          reviewId: "REV-1001",
          sentiment: "Negative",
          complaintCategory: "Wait Time",
          priority: "Medium",
          summary: "Delivery delay complaint",
          recommendedAction: "Optimize delivery route",
        },
      ],
    });

    const result = await service.analyzeReviews(reviews);

    expect(mockAgent.analyzeBatch).toHaveBeenCalledTimes(1);
    expect(result.reviews).toHaveLength(2);
    expect(result.summary.totalReviews).toBe(2);
    expect(result.sentimentScore.positive).toBe(50);
    expect(result.reviews[0].customerName).toBe("John");
    expect(result.reviews[1].customerName).toBe("Jane");
  });
});
