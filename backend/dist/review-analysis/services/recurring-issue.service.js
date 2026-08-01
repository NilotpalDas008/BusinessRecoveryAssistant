"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringIssueService = void 0;
/**
 * Service responsible for detecting top recurring issues and complaints locally.
 * Uses pure TypeScript algorithms without calling AI.
 */
class RecurringIssueService {
    /**
     * Identifies top recurring complaint issues, counts occurrences, and calculates percentage impact.
     *
     * @param reviews List of AI-analyzed reviews.
     * @returns Array of RecurringIssue objects sorted descending by frequency count.
     */
    calculateRecurringIssues(reviews) {
        const totalReviews = reviews.length;
        if (totalReviews === 0) {
            return [];
        }
        const issueMap = new Map();
        for (const review of reviews) {
            // Focus on complaint categories or negative/neutral feedback topics
            const category = review.category?.trim();
            if (category) {
                issueMap.set(category, (issueMap.get(category) ?? 0) + 1);
            }
        }
        const recurringIssues = [];
        issueMap.forEach((count, issue) => {
            const percentage = Number(((count / totalReviews) * 100).toFixed(2));
            recurringIssues.push({
                issue,
                count,
                percentage,
            });
        });
        // Sort descending by count, then by percentage
        return recurringIssues.sort((a, b) => b.count - a.count);
    }
}
exports.RecurringIssueService = RecurringIssueService;
