import { Review } from "../types/review.types";

/**
 * Validates whether a rating is a number between 1 and 5 (inclusive).
 */
export function isValidRating(rating: unknown): rating is number {
  return typeof rating === "number" && Number.isFinite(rating) && rating >= 1 && rating <= 5;
}

/**
 * Validates whether review text is a non-empty string.
 */
export function isValidText(text: unknown): text is string {
  return typeof text === "string" && text.trim().length > 0;
}

/**
 * Validates whether a date string is non-empty and a valid ISO/parseable date.
 */
export function isValidDate(dateStr: unknown): dateStr is string {
  if (typeof dateStr !== "string" || dateStr.trim().length === 0) {
    return false;
  }
  const timestamp = Date.parse(dateStr);
  return !Number.isNaN(timestamp);
}

/**
 * Validates an individual review item.
 * @returns Error message string if invalid, or null if valid.
 */
export function validateSingleReview(review: unknown, index: number): string | null {
  if (typeof review !== "object" || review === null) {
    return `Review at index ${index} must be an object.`;
  }

  const { rating, text, date } = review as Partial<Review>;

  if (rating === undefined || !isValidRating(rating)) {
    return `Review at index ${index} has an invalid rating. Rating must be a number between 1 and 5.`;
  }

  if (text === undefined || !isValidText(text)) {
    return `Review at index ${index} missing or empty review text.`;
  }

  if (date === undefined || !isValidDate(date)) {
    return `Review at index ${index} has an invalid or missing date format.`;
  }

  return null;
}

/**
 * Validates the payload for review analysis request.
 * @returns Error message string if invalid, or null if valid.
 */
export function validateAnalyzePayload(body: unknown): string | null {
  if (typeof body !== "object" || body === null) {
    return "Request body must be a JSON object.";
  }

  const payload = body as { reviews?: unknown };

  if (!payload.reviews || !Array.isArray(payload.reviews)) {
    return "Field 'reviews' is required and must be an array.";
  }

  if (payload.reviews.length === 0) {
    return "Reviews array cannot be empty.";
  }

  if (payload.reviews.length > 100) {
    return "Maximum 100 reviews per request exceeded.";
  }

  for (let i = 0; i < payload.reviews.length; i += 1) {
    const error = validateSingleReview(payload.reviews[i], i);
    if (error) {
      return error;
    }
  }

  return null;
}
