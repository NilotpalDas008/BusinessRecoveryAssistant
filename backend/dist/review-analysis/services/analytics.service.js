"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
/**
 * Service for local deterministic mathematical and statistical analytics calculations.
 * Does NOT invoke Gemini or external APIs.
 */
class AnalyticsService {
    /**
     * Computes high-level summary metrics (total reviews, average rating, overall sentiment).
     */
    calculateSummary(reviews) {
        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return {
                totalReviews: 0,
                averageRating: 0,
                overallSentiment: "Neutral",
            };
        }
        const sumRating = reviews.reduce((acc, r) => acc + r.rating, 0);
        const averageRating = Number((sumRating / totalReviews).toFixed(2));
        const sentimentCounts = this.getSentimentCounts(reviews);
        let overallSentiment = "Neutral";
        if (sentimentCounts.positive >= sentimentCounts.negative &&
            sentimentCounts.positive >= sentimentCounts.neutral) {
            overallSentiment = "Positive";
        }
        else if (sentimentCounts.negative >= sentimentCounts.positive &&
            sentimentCounts.negative >= sentimentCounts.neutral) {
            overallSentiment = "Negative";
        }
        return {
            totalReviews,
            averageRating,
            overallSentiment,
        };
    }
    /**
     * Computes sentiment breakdown metrics (positive, neutral, negative percentages and overall score).
     */
    calculateSentimentScore(reviews) {
        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return {
                positive: 0,
                neutral: 0,
                negative: 0,
                overallScore: 0,
            };
        }
        const counts = this.getSentimentCounts(reviews);
        const positivePct = Number(((counts.positive / totalReviews) * 100).toFixed(2));
        const neutralPct = Number(((counts.neutral / totalReviews) * 100).toFixed(2));
        const negativePct = Number(((counts.negative / totalReviews) * 100).toFixed(2));
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
        const overallScore = Number(((avgRating / 5) * 100).toFixed(2));
        return {
            positive: positivePct,
            neutral: neutralPct,
            negative: negativePct,
            overallScore,
        };
    }
    /**
     * Computes complaint category frequencies and percentages.
     */
    calculateComplaintCategories(reviews) {
        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return [];
        }
        const categoryMap = new Map();
        for (const review of reviews) {
            const category = review.category?.trim() || "General";
            categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
        }
        const categories = [];
        categoryMap.forEach((count, category) => {
            const percentage = Number(((count / totalReviews) * 100).toFixed(2));
            categories.push({
                category,
                count,
                percentage,
            });
        });
        // Sort descending by count
        return categories.sort((a, b) => b.count - a.count);
    }
    /**
     * Helper function counting sentiment occurrences.
     */
    getSentimentCounts(reviews) {
        let positive = 0;
        let neutral = 0;
        let negative = 0;
        for (const review of reviews) {
            const sentiment = (review.sentiment || "").toLowerCase();
            if (sentiment.includes("pos")) {
                positive += 1;
            }
            else if (sentiment.includes("neg")) {
                negative += 1;
            }
            else {
                neutral += 1;
            }
        }
        return { positive, neutral, negative };
    }
}
exports.AnalyticsService = AnalyticsService;
