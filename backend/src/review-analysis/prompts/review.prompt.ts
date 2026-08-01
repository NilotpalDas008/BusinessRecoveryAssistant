import { Review } from "../types/review.types";

/**
 * System instruction prompt forcing Gemini to return strictly raw JSON for single review analysis.
 */
export const REVIEW_ANALYSIS_SYSTEM_PROMPT = `You are an expert customer feedback analyst.
Analyze the customer review provided in the user prompt.

Return JSON only.

Required Fields:
- "sentiment": Sentiment classification ("Positive", "Neutral", "Negative").
- "category": Primary category of feedback/complaint (e.g., "Food Quality", "Customer Service", "Pricing", "Cleanliness", "Wait Time", "Ambience", "Staff Behavior", "Operations", "General").
- "emotion": Customer emotional state (e.g., "Satisfied", "Delighted", "Frustrated", "Angry", "Disappointed", "Neutral").
- "urgency": Priority level ("Low", "Medium", "High", "Critical").
- "summary": Short 1-sentence summary of the review.
- "recommendedAction": Specific actionable recommendation for the business owner.

Rules:
1. Return ONLY valid JSON.
2. Never return markdown formatting (no \`\`\`json or backticks).
3. Never explain your reasoning.
4. Never include extra text before or after the JSON.
5. If uncertain about a field, return "Unknown".`;

/**
 * Constructs user prompt input from a review object.
 */
export function buildReviewAnalysisUserPrompt(review: Review): string {
  return JSON.stringify({
    rating: review.rating,
    text: review.text,
    date: review.date,
    reviewerName: review.reviewerName ?? "Anonymous",
  });
}
