# Review Processing Pipeline

## Stage 1

Receive Reviews

↓

Validate Request

---

## Stage 2

Validate Reviews

Checks

- Rating exists
- Review text exists
- Date exists

↓

Reject invalid reviews

---

## Stage 3

Review Analysis

↓

Gemini API

↓

Structured JSON

---

## Stage 4

Analytics

Generate

- Sentiment Score
- Complaint Categories
- Trends
- Recurring Issues

---

## Stage 5

Summary

Generate business summary.

---

## Stage 6

Build Response

↓

Return JSON

---

# Pipeline Diagram

Receive Request

↓

Validation

↓

Review Analysis

↓

Analytics

↓

Summary

↓

JSON Response