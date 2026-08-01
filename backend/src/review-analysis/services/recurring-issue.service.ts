import { AIReview } from "../types/review.types";
import { RecurringIssue } from "../types/analytics.types";

/**
 * Service responsible for detecting top recurring issues and complaints locally.
 * Uses pure TypeScript algorithms without calling AI.
 */
export class RecurringIssueService {
  /**
   * Identifies top recurring complaint issues, counts occurrences, and calculates percentage impact.
   *
   * @param reviews List of AI-analyzed reviews.
   * @returns Array of RecurringIssue objects sorted descending by frequency count.
   */
  public calculateRecurringIssues(reviews: AIReview[]): RecurringIssue[] {
    const totalReviews = reviews.length;
    if (totalReviews === 0) {
      return [];
    }

    const issueMap = new Map<string, number>();

    for (const review of reviews) {
      // Focus on complaint categories or negative/neutral feedback topics
      const category = review.category?.trim();
      if (category) {
        issueMap.set(category, (issueMap.get(category) ?? 0) + 1);
      }
    }

    const recurringIssues: RecurringIssue[] = [];
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
