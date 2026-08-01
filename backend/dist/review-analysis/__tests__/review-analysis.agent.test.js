"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const review_analysis_agent_1 = require("../agents/review-analysis.agent");
const gemini_service_1 = require("../services/gemini.service");
jest.mock("../services/gemini.service", () => {
    const actual = jest.requireActual("../services/gemini.service");
    return {
        ...actual,
        GeminiService: jest.fn().mockImplementation(() => ({
            generateJSON: jest.fn(),
        })),
    };
});
describe("ReviewAnalysisAgent", () => {
    let agent;
    let mockGeminiService;
    beforeEach(() => {
        mockGeminiService = new gemini_service_1.GeminiService();
        agent = new review_analysis_agent_1.ReviewAnalysisAgent(mockGeminiService);
    });
    it("should successfully invoke Gemini ONCE for batch reviews", async () => {
        const reviews = [
            {
                rating: 1,
                text: "Food was cold and service was terrible.",
                date: "2026-08-01",
                customerName: "Alice",
                itemOrdered: "Pizza",
            },
        ];
        mockGeminiService.generateJSON.mockResolvedValueOnce({
            summary: { totalReviews: 1, averageRating: 1, overallSentiment: "Negative" },
            sentimentScore: { positive: 0, neutral: 0, negative: 100, overallScore: 0 },
            complaintCategories: [{ category: "Food Quality", count: 1, percentage: 100 }],
            trendsOverTime: [{ date: "2026-08-01", positive: 0, neutral: 0, negative: 1 }],
            topRecurringIssues: [{ issue: "Cold food", count: 1, percentage: 100, severity: "High" }],
            recommendations: ["Improve kitchen heating"],
            reviews: [
                {
                    reviewId: "REV-1000",
                    sentiment: "Negative",
                    complaintCategory: "Food Quality",
                    priority: "High",
                    summary: "Cold food complaint",
                    recommendedAction: "Apologize to customer",
                },
            ],
        });
        const result = await agent.analyzeBatch(reviews);
        expect(mockGeminiService.generateJSON).toHaveBeenCalledTimes(1);
        expect(result.reviews).toHaveLength(1);
        expect(result.reviews[0].sentiment).toBe("Negative");
    });
    it("should handle empty review array without invoking Gemini", async () => {
        const result = await agent.analyzeBatch([]);
        expect(mockGeminiService.generateJSON).not.toHaveBeenCalled();
        expect(result.reviews).toEqual([]);
    });
});
