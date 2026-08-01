# ARCHITECTURE.md

# System Architecture

────────────────────────────────────────────

            Google Business API
                     │
                     │
               CSV Upload
                     │
                     ▼
          Review Intelligence API
                     │
                     ▼
         Request Validation Layer
                     │
                     ▼
          Review Analysis Service
                     │
                     ▼
               Gemini API
                     │
                     ▼
           AI Analysis Response
                     │
                     ▼
            Analytics Engine
                     │
         ┌───────────┼────────────┐
         │           │            │
         ▼           ▼            ▼

  Sentiment     Categories     Trends

                     │
                     ▼
          Response Builder Service
                     │
                     ▼
               JSON Response

────────────────────────────────────────────

## Folder Architecture

src/

controllers/

routes/

services/

agents/

prompts/

types/

config/

utils/

middlewares/

---

## Flow

Receive Request

↓

Validate

↓

Analyze Reviews

↓

Generate Analytics

↓

Build Response

↓

Return JSON

---

## AI Flow

Reviews

↓

Gemini

↓

Structured Analysis

↓

Analytics

↓

Business Insights