# Error Handling

## Validation Errors

400 Bad Request

Reasons

- Empty reviews
- Missing rating
- Missing text
- Invalid date

---

## Gemini Errors

Retry

Maximum Retries

3

If failed

Return

503 Service Unavailable

---

## JSON Parsing Error

If Gemini returns invalid JSON

Retry once.

If still invalid

Return

500 Internal Server Error

---

## Timeout

Gemini Timeout

Retry

↓

Return 503

---

## Logging

Log

- Timestamp
- Error
- Stack Trace
- Request ID

Never expose internal errors to clients.

---

## Error Response

{
    "success": false,
    "message": "Service unavailable",
    "errorCode": "GEMINI_TIMEOUT"
}