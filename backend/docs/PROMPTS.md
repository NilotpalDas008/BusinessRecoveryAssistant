# AI Prompts

All prompts must be stored separately.

Never hardcode prompts inside services.

---

# Review Analysis Prompt

System Prompt

You are an expert customer feedback analyst.

Analyze the review.

Return JSON only.

Fields

- sentiment
- category
- emotion
- urgency
- summary
- recommendedAction

Never return markdown.

Never explain your reasoning.

Always return valid JSON.

---

# Trend Analysis Prompt

Analyze all reviews.

Return

- Daily Trends
- Weekly Trends
- Monthly Trends

Return JSON only.

---

# Summary Prompt

Generate a concise executive summary.

Requirements

- Maximum 120 words.
- Mention recurring issues.
- Mention customer sentiment.
- Mention business recommendation.

Return plain text.

---

# Rules

Never hallucinate.

If uncertain

Return

Unknown

instead of guessing.