"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trend_service_1 = require("../services/trend.service");
describe("TrendService", () => {
    let trendService;
    beforeEach(() => {
        trendService = new trend_service_1.TrendService();
    });
    it("should return empty array for empty reviews", () => {
        const result = trendService.calculateTrends([]);
        expect(result).toEqual([]);
    });
    it("should group sentiment counts by review date and sort chronologically", () => {
        const reviews = [
            {
                rating: 5,
                text: "Great",
                date: "2026-08-02",
                sentiment: "Positive",
                category: "General",
                emotion: "Happy",
                urgency: "Low",
                summary: "Praise",
                recommendedAction: "N/A",
            },
            {
                rating: 1,
                text: "Bad",
                date: "2026-08-01",
                sentiment: "Negative",
                category: "Service",
                emotion: "Angry",
                urgency: "High",
                summary: "Complaint",
                recommendedAction: "N/A",
            },
            {
                rating: 5,
                text: "Super",
                date: "2026-08-01",
                sentiment: "Positive",
                category: "Food",
                emotion: "Happy",
                urgency: "Low",
                summary: "Praise",
                recommendedAction: "N/A",
            },
        ];
        const trends = trendService.calculateTrends(reviews);
        expect(trends).toHaveLength(2);
        expect(trends[0].date).toBe("2026-08-01");
        expect(trends[0].positive).toBe(1);
        expect(trends[0].negative).toBe(1);
        expect(trends[0].neutral).toBe(0);
        expect(trends[1].date).toBe("2026-08-02");
        expect(trends[1].positive).toBe(1);
        expect(trends[1].negative).toBe(0);
    });
});
