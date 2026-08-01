import { Review, AIReview, Sentiment, Emotion, Urgency, ComplaintCategoryType } from "../types/review.types";
import { GeminiService, GeminiError } from "../services/gemini.service";
import {
  REVIEW_ANALYSIS_SYSTEM_PROMPT,
  buildReviewAnalysisUserPrompt,
} from "../prompts/review.prompt";

/**
 * Agent responsible for analyzing a single customer review using Google Gemini with optional in-memory caching.
 */
export class ReviewAnalysisAgent {
  private geminiService: GeminiService;
  private cache: Map<string, AIReview> = new Map<string, AIReview>();
  private enableCache: boolean;

  constructor(geminiService?: GeminiService, enableCache?: boolean) {
    this.geminiService = geminiService ?? new GeminiService();
    this.enableCache =
      typeof enableCache === "boolean"
        ? enableCache
        : process.env.ENABLE_REVIEW_CACHE === "true";
  }

  /**
   * Analyzes a single customer review and extracts structured AI insights.
   * Checks in-memory cache if enabled, retries once on Gemini failure, and validates output format.
   *
   * @param review Single input review object.
   * @returns Analyzed AI review payload containing sentiment, category, emotion, urgency, summary, and action.
   */
  public async analyze(review: Review): Promise<AIReview> {
    const cacheKey = review.text.trim().toLowerCase();

    if (this.enableCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return {
        ...cached,
        rating: review.rating,
        date: review.date,
      };
    }

    const userPrompt = buildReviewAnalysisUserPrompt(review);
    const systemPrompt = REVIEW_ANALYSIS_SYSTEM_PROMPT;
    let result: AIReview;

    try {
      result = await this.executeAnalysis(review, userPrompt, systemPrompt);
    } catch {
      try {
        result = await this.executeAnalysis(review, userPrompt, systemPrompt);
      } catch (retryError) {
        if (
          retryError instanceof GeminiError ||
          (typeof retryError === "object" && retryError !== null && "errorCode" in retryError)
        ) {
          throw retryError;
        }
        const message =
          retryError instanceof Error ? retryError.message : "Review analysis failed.";
        throw new GeminiError(
          `Review Analysis Agent failed after retry: ${message}`,
          "AGENT_EXECUTION_FAILED",
          503
        );
      }
    }

    if (this.enableCache) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Internal helper executing single analysis pass and validating output format.
   */
  private async executeAnalysis(
    review: Review,
    userPrompt: string,
    systemPrompt: string
  ): Promise<AIReview> {
    const rawAnalysis = await this.geminiService.generateJSON<Partial<AIReview>>(
      userPrompt,
      systemPrompt
    );

    if (!this.isValidAnalysisOutput(rawAnalysis)) {
      throw new GeminiError(
        "Gemini response is missing required analysis fields.",
        "INVALID_AI_OUTPUT",
        500
      );
    }

    return {
      rating: review.rating,
      text: review.text,
      date: review.date,
      sentiment: rawAnalysis.sentiment.trim() as Sentiment,
      category: rawAnalysis.category.trim() as ComplaintCategoryType,
      emotion: rawAnalysis.emotion.trim() as Emotion,
      urgency: rawAnalysis.urgency.trim() as Urgency,
      summary: rawAnalysis.summary.trim(),
      recommendedAction: rawAnalysis.recommendedAction.trim(),
    };
  }

  /**
   * Validates that all required AI analysis fields exist and are non-empty strings.
   */
  private isValidAnalysisOutput(data: unknown): data is Record<string, string> {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const obj = data as Record<string, unknown>;
    const requiredKeys = [
      "sentiment",
      "category",
      "emotion",
      "urgency",
      "summary",
      "recommendedAction",
    ];
    return requiredKeys.every(
      (key) => typeof obj[key] === "string" && (obj[key] as string).trim().length > 0
    );
  }
}
