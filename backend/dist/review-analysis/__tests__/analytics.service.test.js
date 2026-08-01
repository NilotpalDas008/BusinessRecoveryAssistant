"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_service_1 = require("../services/analytics.service");
describe("AnalyticsService", () => {
    let analyticsService;
    beforeEach(() => {
        analyticsService = new analytics_service_1.AnalyticsService();
    });
    const sampleReviews = [
        {
            rating: 5,
            text: "Great food",
            date: "2026-08-01",
            sentiment: "Positive",
            category: "Food Quality",
            emotion: "Happy",
            urgency: "Low",
            summary: "Praise for food",
            recommendedAction: "Keep it up",
        },
        {
            rating: 1,
            text: "Cold meal",
            date: "2026-08-01",
            sentiment: "Negative",
            category: "Food Quality",
            emotion: "Angry",
            urgency: "High",
            summary: "Complaint cold food",
            recommendedAction: "Check kitchen",
        },
        {
            rating: 3,
            text: "Average service",
            date: "2026-08-01",
            sentiment: "Neutral",
            category: "Customer Service",
            emotion: "Neutral",
            urgency: "Medium",
            summary: "Neutral service feedback",
            recommendedAction: "Train staff",
        },
    ];
    it("should calculate summary metrics correctly", () => {
        const summary = analyticsService.calculateSummary(sampleReviews);
        expect(summary.totalReviews).toBe(3);
        expect(summary.averageRating).toBe(3);
        expect(["Positive", "Neutral", "Negative"]).toContain(summary.overallSentiment);
    });
    it("should calculate sentiment scores and percentages accurately", () => {
        const scores = analyticsService.calculateSentimentScore(sampleReviews);
        expect(scores.positive).toBe(33.33);
        expect(scores.negative).toBe(33.33);
        expect(scores.neutral).toBe(33.33);
        expect(scores.overallScore).toBe(60.0);
    });
    it("should compute complaint categories frequency and percentage sorted descending", () => {
        const categories = analyticsService.calculateComplaintCategories(sampleReviews);
        expect(categories.length).toBe(2);
        expect(categories[0].category).toBe("Food Quality");
        expect(categories[0].count).toBe(2);
        expect(categories[0].percentage).toBe(66.67);
    });
});
