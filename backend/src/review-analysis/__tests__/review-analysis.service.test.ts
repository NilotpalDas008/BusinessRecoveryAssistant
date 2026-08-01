import { ReviewAnalysisService } from "../services/review-analysis.service";
import { ReviewAnalysisAgent } from "../agents/review-analysis.agent";
import { Review, AIReview } from "../types/review.types";

jest.mock("../agents/review-analysis.agent");

describe("ReviewAnalysisService", () => {
  let service: ReviewAnalysisService;
  let mockAgent: jest.Mocked<ReviewAnalysisAgent>;

  beforeEach(() => {
    mockAgent = new ReviewAnalysisAgent() as jest.Mocked<ReviewAnalysisAgent>;
    service = new ReviewAnalysisService(mockAgent);
  });

  it("should return an empty array if empty review list provided", async () => {
    const result = await service.analyzeReviews([]);
    expect(result).toEqual([]);
    expect(mockAgent.analyze).not.toHaveBeenCalled();
  });

  it("should delegate each review to ReviewAnalysisAgent and return AIReview[]", async () => {
    const reviews: Review[] = [
      { rating: 5, text: "Awesome pizza", date: "2026-08-01" },
      { rating: 2, text: "Slow delivery", date: "2026-08-01" },
    ];

    const mockAiReview1: AIReview = {
      ...reviews[0],
      sentiment: "Positive",
      category: "Food Quality",
      emotion: "Happy",
      urgency: "Low",
      summary: "Praise for pizza",
      recommendedAction: "Maintain quality",
    };

    const mockAiReview2: AIReview = {
      ...reviews[1],
      sentiment: "Negative",
      category: "Wait Time",
      emotion: "Frustrated",
      urgency: "Medium",
      summary: "Delivery delay complaint",
      recommendedAction: "Optimize delivery route",
    };

    mockAgent.analyze
      .mockResolvedValueOnce(mockAiReview1)
      .mockResolvedValueOnce(mockAiReview2);

    const result = await service.analyzeReviews(reviews);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(mockAiReview1);
    expect(result[1]).toEqual(mockAiReview2);
    expect(mockAgent.analyze).toHaveBeenCalledTimes(2);
  });

  it("should process reviews in batches matching configured batch size", async () => {
    const batchedService = new ReviewAnalysisService(mockAgent, 2);
    const reviews: Review[] = [
      { rating: 5, text: "Review 1", date: "2026-08-01" },
      { rating: 4, text: "Review 2", date: "2026-08-01" },
      { rating: 3, text: "Review 3", date: "2026-08-01" },
    ];

    mockAgent.analyze.mockImplementation(async (r) => ({
      ...r,
      sentiment: "Positive",
      category: "General",
      emotion: "Neutral",
      urgency: "Low",
      summary: "Summary",
      recommendedAction: "Action",
    }));

    const result = await batchedService.analyzeReviews(reviews);

    expect(result).toHaveLength(3);
    expect(mockAgent.analyze).toHaveBeenCalledTimes(3);
  });
});
