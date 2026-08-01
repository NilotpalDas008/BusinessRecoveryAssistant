"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendService = void 0;
/**
 * Service for computing sentiment trends over time grouped by review date.
 * Uses pure TypeScript without calling AI models.
 */
class TrendService {
    /**
     * Groups AI reviews by review date and calculates daily sentiment counts.
     *
     * @param reviews Array of AI-analyzed reviews.
     * @returns Array of Trend objects ordered chronologically by date.
     */
    calculateTrends(reviews) {
        if (!reviews || reviews.length === 0) {
            return [];
        }
        const dateMap = new Map();
        for (const review of reviews) {
            const dateKey = review.date ? review.date.trim() : "Unknown Date";
            if (!dateMap.has(dateKey)) {
                dateMap.set(dateKey, { positive: 0, neutral: 0, negative: 0 });
            }
            const counts = dateMap.get(dateKey);
            const sentiment = (review.sentiment || "").toLowerCase();
            if (sentiment.includes("pos")) {
                counts.positive += 1;
            }
            else if (sentiment.includes("neg")) {
                counts.negative += 1;
            }
            else {
                counts.neutral += 1;
            }
        }
        const trends = [];
        dateMap.forEach((counts, date) => {
            trends.push({
                date,
                positive: counts.positive,
                neutral: counts.neutral,
                negative: counts.negative,
            });
        });
        // Sort chronologically by date
        return trends.sort((a, b) => {
            const timeA = Date.parse(a.date);
            const timeB = Date.parse(b.date);
            if (Number.isNaN(timeA) || Number.isNaN(timeB)) {
                return a.date.localeCompare(b.date);
            }
            return timeA - timeB;
        });
    }
}
exports.TrendService = TrendService;
