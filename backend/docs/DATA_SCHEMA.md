# DATA_SCHEMA.md

# Data Schema

## Input Review

interface Review {

rating: number

text: string

date: string

reviewerName?: string

source?: string

}

---

## AI Review

interface AIReview {

rating: number

text: string

date: string

sentiment: string

category: string

emotion: string

urgency: string

summary: string

recommendedAction: string

}

---

## Sentiment Score

interface SentimentScore {

positive: number

neutral: number

negative: number

overallScore: number

}

---

## Complaint Category

interface ComplaintCategory {

category: string

count: number

percentage: number

}

---

## Trend

interface Trend {

date: string

positive: number

negative: number

neutral: number

}

---

## Recurring Issue

interface RecurringIssue {

issue: string

count: number

percentage: number

}

---

## Summary

interface Summary {

totalReviews: number

averageRating: number

overallSentiment: string

}

---

## Final Response

interface AnalyzeResponse {

summary

sentimentScore

complaintCategories

trendsOverTime

topRecurringIssues

reviews

}