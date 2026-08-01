import { AIReview, Sentiment } from "../types/review.types";
import { Summary } from "../types/analytics.types";

/**
 * Service responsible for producing high-level summary statistics using pure TypeScript logic.
 * Does NOT invoke Gemini or external APIs.
 */
export class SummaryService {
  /**
   * Generates summary metrics from analyzed reviews.
   *
   * @param reviews Array of AI-processed reviews.
   * @returns Summary object containing totalReviews, averageRating, and overallSentiment.
   */
  public generateSummary(reviews: AIReview[]): Summary {
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

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    for (const review of reviews) {
      const sentiment = (review.sentiment || "").toLowerCase();
      if (sentiment.includes("pos")) {
        positiveCount += 1;
      } else if (sentiment.includes("neg")) {
        negativeCount += 1;
      } else {
        neutralCount += 1;
      }
    }

    let overallSentiment: Sentiment = "Neutral";
    if (positiveCount >= negativeCount && positiveCount >= neutralCount) {
      overallSentiment = "Positive";
    } else if (negativeCount >= positiveCount && negativeCount >= neutralCount) {
      overallSentiment = "Negative";
    }

    return {
      totalReviews,
      averageRating,
      overallSentiment,
    };
  }
}
