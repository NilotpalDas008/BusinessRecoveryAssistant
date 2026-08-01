# Testing Strategy

## Unit Testing

Review Analysis Service

Expected

- Correct sentiment
- Correct category
- Correct emotion

---

Analytics Service

Expected

- Correct counts
- Correct percentages
- Correct trends

---

## API Testing

POST /analyze

Expected

200 OK

---

## Edge Cases

Empty Reviews

Expected

400

---

Single Review

Expected

200

---

100 Reviews

Expected

200

---

Invalid Rating

Expected

400

---

Missing Review Text

Expected

400

---

Invalid Date

Expected

400

---

## Performance

Target

100 Reviews

↓

Under 10 Seconds

---

## Prompt Testing

Positive Review

↓

Positive Sentiment

Negative Review

↓

Negative Sentiment

Mixed Review

↓

Neutral / Mixed

---

## Success Criteria

All tests pass.

API returns consistent JSON.

No malformed Gemini responses.

No crashes on invalid input.