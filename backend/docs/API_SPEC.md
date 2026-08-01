# API_SPEC.md

# API Specification

Base URL

/api/v1

---

## POST /analyze

Description

Analyze business reviews using AI.

---

Request

{
  "businessId": "abc123",
  "reviews": [
    {
      "rating": 5,
      "text": "Amazing food.",
      "date": "2026-07-31"
    }
  ]
}

---

Success Response

Status

200 OK

Response

{
  "summary": {},
  "sentimentScore": {},
  "complaintCategories": [],
  "trendsOverTime": [],
  "topRecurringIssues": [],
  "reviews": []
}

---

Error Responses

400

Invalid Request

401

Unauthorized

429

Rate Limit Exceeded

500

Internal Server Error

503

Gemini API Unavailable

---

Validation Rules

Rating

1-5

Review Text

Required

Date

Required

Maximum Reviews Per Request

100

---

Content Type

application/json