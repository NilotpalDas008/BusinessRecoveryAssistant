"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewAnalysisAgent = void 0;
const gemini_service_1 = require("../services/gemini.service");
const review_prompt_1 = require("../prompts/review.prompt");
/**
 * Agent responsible for sending batch customer reviews to Google Gemini in a single prompt.
 */
class ReviewAnalysisAgent {
    geminiService;
    constructor(geminiService) {
        this.geminiService = geminiService ?? new gemini_service_1.GeminiService();
    }
    /**
     * Invokes Gemini ONCE with the entire array of customer reviews.
     *
     * @param reviews Array of input customer reviews.
     * @returns Raw batch analysis result from Gemini.
     */
    async analyzeBatch(reviews) {
        if (!reviews || reviews.length === 0) {
            return {
                summary: { totalReviews: 0, averageRating: 0, overallSentiment: "Neutral", executiveSummary: "" },
                sentimentScore: { positive: 0, neutral: 0, negative: 0, overallScore: 0 },
                complaintCategories: [],
                trendsOverTime: [],
                topRecurringIssues: [],
                recommendations: [],
                reviews: [],
            };
        }
        const userPrompt = (0, review_prompt_1.buildBatchReviewAnalysisUserPrompt)(reviews);
        const systemPrompt = review_prompt_1.BATCH_REVIEW_ANALYSIS_SYSTEM_PROMPT;
        try {
            return await this.geminiService.generateJSON(userPrompt, systemPrompt);
        }
        catch (error) {
            if (error instanceof gemini_service_1.GeminiError ||
                (typeof error === "object" && error !== null && "errorCode" in error)) {
                throw error;
            }
            const message = error instanceof Error ? error.message : "Batch analysis failed.";
            throw new gemini_service_1.GeminiError(`Review Analysis Agent failed: ${message}`, "AGENT_EXECUTION_FAILED", 503);
        }
    }
}
exports.ReviewAnalysisAgent = ReviewAnalysisAgent;
