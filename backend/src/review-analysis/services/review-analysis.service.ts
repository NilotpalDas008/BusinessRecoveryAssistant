import { Review, AIReview } from "../types/review.types";
import { ReviewAnalysisAgent } from "../agents/review-analysis.agent";

/**
 * Service responsible for orchestrating AI analysis over batches of customer reviews.
 */
export class ReviewAnalysisService {
  private agent: ReviewAnalysisAgent;
  private batchSize: number;

  constructor(agent?: ReviewAnalysisAgent, batchSize?: number) {
    this.agent = agent ?? new ReviewAnalysisAgent();

    const envBatchSize = Number(process.env.REVIEW_BATCH_SIZE);
    if (typeof batchSize === "number" && batchSize > 0) {
      this.batchSize = batchSize;
    } else if (Number.isInteger(envBatchSize) && envBatchSize > 0) {
      this.batchSize = envBatchSize;
    } else {
      this.batchSize = 10; // Default batch size
    }
  }

  /**
   * Analyzes a list of customer reviews in configurable sequential batches.
   * Reviews inside each batch are processed concurrently.
   *
   * @param reviews Array of input customer reviews.
   * @returns Promise resolving to an array of enriched AIReview objects.
   */
  public async analyzeReviews(reviews: Review[]): Promise<AIReview[]> {
    if (!reviews || reviews.length === 0) {
      return [];
    }

    const analyzedReviews: AIReview[] = [];

    // Process reviews sequentially within batches to prevent API rate limit bursts
    for (let i = 0; i < reviews.length; i += this.batchSize) {
      const batch = reviews.slice(i, i + this.batchSize);
      const batchResults: AIReview[] = [];

      for (const review of batch) {
        const result = await this.agent.analyze(review);
        batchResults.push(result);
      }

      analyzedReviews.push(...batchResults);
    }

    return analyzedReviews;
  }
}
