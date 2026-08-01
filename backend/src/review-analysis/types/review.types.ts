/**
 * Strong string literal union types for review analysis properties.
 */
export type Sentiment = "Positive" | "Neutral" | "Negative";

export type Emotion =
  | "Happy"
  | "Satisfied"
  | "Delighted"
  | "Neutral"
  | "Frustrated"
  | "Angry"
  | "Disappointed"
  | (string & {});

export type Urgency = "Low" | "Medium" | "High" | "Critical";

export type ComplaintCategoryType =
  | "Food Quality"
  | "Customer Service"
  | "Pricing"
  | "Cleanliness"
  | "Wait Time"
  | "Ambience"
  | "Staff Behavior"
  | "Operations"
  | "General"
  | (string & {});

/**
 * Input review payload received from client or external module.
 */
export interface Review {
  reviewId?: string;
  rating: number;
  text?: string;
  reviewText?: string;
  date: string;
  customerName?: string;
  reviewerName?: string;
  itemOrdered?: string;
  visitType?: string;
  source?: string;
}

/**
 * AI-processed review result enriched with sentiment, categorization, and action items.
 */
export interface AIReview {
  reviewId?: string;
  rating: number;
  text: string;
  date: string;
  customerName?: string;
  itemOrdered?: string;
  sentiment: Sentiment;
  category: ComplaintCategoryType;
  emotion: Emotion;
  urgency: Urgency;
  summary: string;
  recommendedAction: string;
}
