"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = exports.GeminiTimeoutError = exports.GeminiEmptyResponseError = exports.GeminiInvalidJsonError = exports.GeminiServiceUnavailableError = exports.GeminiInternalError = exports.GeminiRateLimitError = exports.GeminiAuthError = exports.GeminiInvalidRequestError = exports.GeminiError = void 0;
/**
 * Base custom typed error for Gemini API failures and response parsing errors.
 */
class GeminiError extends Error {
    statusCode;
    errorCode;
    constructor(message, errorCode = "GEMINI_ERROR", statusCode = 503) {
        super(message);
        this.name = "GeminiError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.GeminiError = GeminiError;
class GeminiInvalidRequestError extends GeminiError {
    constructor(message = "Invalid request payload sent to Gemini API.") {
        super(message, "GEMINI_INVALID_REQUEST", 400);
        this.name = "GeminiInvalidRequestError";
        Object.setPrototypeOf(this, GeminiInvalidRequestError.prototype);
    }
}
exports.GeminiInvalidRequestError = GeminiInvalidRequestError;
class GeminiAuthError extends GeminiError {
    constructor(message = "Authentication failed. Invalid or missing Gemini API key.") {
        super(message, "GEMINI_AUTH_ERROR", 401);
        this.name = "GeminiAuthError";
        Object.setPrototypeOf(this, GeminiAuthError.prototype);
    }
}
exports.GeminiAuthError = GeminiAuthError;
class GeminiRateLimitError extends GeminiError {
    constructor(message = "Gemini API rate limit exceeded. Please try again later.") {
        super(message, "GEMINI_RATE_LIMIT_EXCEEDED", 429);
        this.name = "GeminiRateLimitError";
        Object.setPrototypeOf(this, GeminiRateLimitError.prototype);
    }
}
exports.GeminiRateLimitError = GeminiRateLimitError;
class GeminiInternalError extends GeminiError {
    constructor(message = "Gemini API experienced an internal error.") {
        super(message, "GEMINI_INTERNAL_ERROR", 500);
        this.name = "GeminiInternalError";
        Object.setPrototypeOf(this, GeminiInternalError.prototype);
    }
}
exports.GeminiInternalError = GeminiInternalError;
class GeminiServiceUnavailableError extends GeminiError {
    constructor(message = "Gemini API service is currently unavailable.") {
        super(message, "GEMINI_SERVICE_UNAVAILABLE", 503);
        this.name = "GeminiServiceUnavailableError";
        Object.setPrototypeOf(this, GeminiServiceUnavailableError.prototype);
    }
}
exports.GeminiServiceUnavailableError = GeminiServiceUnavailableError;
class GeminiInvalidJsonError extends GeminiError {
    constructor(message = "Failed to parse Gemini response as valid JSON.") {
        super(message, "INVALID_JSON_RESPONSE", 500);
        this.name = "GeminiInvalidJsonError";
        Object.setPrototypeOf(this, GeminiInvalidJsonError.prototype);
    }
}
exports.GeminiInvalidJsonError = GeminiInvalidJsonError;
class GeminiEmptyResponseError extends GeminiError {
    constructor(message = "Received empty response content from Gemini API.") {
        super(message, "EMPTY_AI_RESPONSE", 503);
        this.name = "GeminiEmptyResponseError";
        Object.setPrototypeOf(this, GeminiEmptyResponseError.prototype);
    }
}
exports.GeminiEmptyResponseError = GeminiEmptyResponseError;
class GeminiTimeoutError extends GeminiError {
    constructor(message = "Gemini API request timed out.") {
        super(message, "GEMINI_TIMEOUT", 503);
        this.name = "GeminiTimeoutError";
        Object.setPrototypeOf(this, GeminiTimeoutError.prototype);
    }
}
exports.GeminiTimeoutError = GeminiTimeoutError;
/**
 * Removes markdown formatting delimiters (e.g. ```json ... ```) from response strings.
 */
function cleanJsonResponse(text) {
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.substring(7);
    }
    else if (cleaned.startsWith("```")) {
        cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith("```")) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    return cleaned.trim();
}
/**
 * Utility helper for async delays (prepared for exponential backoff).
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Service responsible solely for robust communication with Google Gemini API via REST API.
 */
class GeminiService {
    modelName;
    timeoutMs;
    constructor(modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview", timeoutMs = 25000) {
        this.modelName = modelName;
        this.timeoutMs = timeoutMs;
    }
    /**
     * Sends prompt to Gemini REST API, parses JSON response, and retries once with backoff upon failure.
     *
     * @param prompt User or structured content prompt.
     * @param systemInstruction System instruction prompt for Gemini.
     * @returns Parsed JSON response of type T.
     */
    async generateJSON(prompt, systemInstruction) {
        const maxRetries = 1;
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                return await this.executeWithTimeout(prompt, systemInstruction);
            }
            catch (error) {
                if (error instanceof GeminiAuthError || error instanceof GeminiInvalidRequestError) {
                    throw error;
                }
                if (attempt >= maxRetries) {
                    if (error instanceof GeminiError) {
                        throw error;
                    }
                    throw this.mapError(error);
                }
                attempt += 1;
                const backoffMs = Math.pow(2, attempt) * 300;
                await delay(backoffMs);
            }
        }
        throw new GeminiServiceUnavailableError("Gemini service unavailable after retry execution.");
    }
    /**
     * Executes single API call wrapped with a timeout threshold.
     */
    async executeWithTimeout(prompt, systemInstruction) {
        let timer = null;
        const timeoutPromise = new Promise((_, reject) => {
            timer = setTimeout(() => {
                reject(new GeminiTimeoutError(`Gemini request exceeded timeout of ${this.timeoutMs}ms.`));
            }, this.timeoutMs);
        });
        try {
            const result = await Promise.race([
                this.executeGenerateJSON(prompt, systemInstruction),
                timeoutPromise,
            ]);
            return result;
        }
        finally {
            if (timer) {
                clearTimeout(timer);
            }
        }
    }
    /**
     * Internal helper executing single REST API call to Gemini API and JSON parsing.
     */
    async executeGenerateJSON(prompt, systemInstruction) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new GeminiAuthError("GEMINI_API_KEY environment variable is missing.");
        }
        let textToSend = prompt;
        if (systemInstruction && systemInstruction.trim().length > 0) {
            textToSend = `System:\n${systemInstruction}\n\nUser:\n${prompt}`;
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;
        let response;
        try {
            console.log("[STEP D] Calling Gemini", { model: this.modelName });
            console.log("[STEP D1] Before fetch");
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: textToSend,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        responseMimeType: "application/json",
                    },
                }),
            });
            console.log("[STEP D2] Fetch completed", response.status);
        }
        catch (err) {
            throw this.mapError(err);
        }
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status} ${response.statusText}`;
            try {
                const errorData = (await response.json());
                if (errorData?.error?.message) {
                    errorMessage = errorData.error.message;
                }
            }
            catch {
                // Fallback to HTTP status text
            }
            throw this.mapError({ status: response.status, message: errorMessage });
        }
        let data;
        try {
            console.log("[STEP D3] Parsing JSON");
            data = await response.json();
            console.log("[STEP D4] JSON parsed");
            console.log("[STEP E] Gemini returned response");
        }
        catch (err) {
            throw this.mapError(err);
        }
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!rawText || rawText.trim().length === 0) {
            throw new GeminiEmptyResponseError();
        }
        try {
            const cleanedText = cleanJsonResponse(rawText);
            return JSON.parse(cleanedText);
        }
        catch {
            throw new GeminiInvalidJsonError();
        }
    }
    /**
     * Maps unhandled exceptions and HTTP errors to explicit typed GeminiError sub-classes.
     */
    mapError(err) {
        if (err instanceof GeminiError) {
            return err;
        }
        let rawMessage = "";
        if (err instanceof Error) {
            rawMessage = err.message;
        }
        else if (typeof err === "object" && err !== null && "message" in err) {
            rawMessage = String(err.message);
        }
        else {
            rawMessage = String(err);
        }
        let message = rawMessage;
        try {
            if (typeof rawMessage === "string" && rawMessage.startsWith("{") && rawMessage.endsWith("}")) {
                const parsed = JSON.parse(rawMessage);
                if (parsed?.error?.message) {
                    message = parsed.error.message;
                }
            }
        }
        catch {
            // Keep original message if not JSON
        }
        const status = err?.status ||
            err?.statusCode;
        if (status === 400 || message.includes("400") || message.includes("INVALID_ARGUMENT") || message.includes("no longer available")) {
            return new GeminiInvalidRequestError(message);
        }
        if (status === 401 || message.includes("401") || message.includes("UNAUTHENTICATED") || message.includes("API_KEY")) {
            return new GeminiAuthError(message);
        }
        if (status === 429 || message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || message.includes("Quota")) {
            return new GeminiRateLimitError(message);
        }
        if (status === 500 || message.includes("500") || message.includes("INTERNAL")) {
            return new GeminiInternalError(message);
        }
        if (status === 503 || message.includes("503") || message.includes("UNAVAILABLE")) {
            return new GeminiServiceUnavailableError(message);
        }
        if (message.includes("timeout") || message.includes("ETIMEDOUT") || message.includes("ECONNRESET")) {
            return new GeminiTimeoutError(message);
        }
        return new GeminiServiceUnavailableError(`Gemini API Error: ${message}`);
    }
}
exports.GeminiService = GeminiService;
