import { GoogleGenAI } from "@google/genai";

/**
 * Base custom typed error for Gemini API failures and response parsing errors.
 */
export class GeminiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(message: string, errorCode: string = "GEMINI_ERROR", statusCode: number = 503) {
    super(message);
    this.name = "GeminiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, GeminiError.prototype);
  }
}

export class GeminiInvalidRequestError extends GeminiError {
  constructor(message: string = "Invalid request payload sent to Gemini API.") {
    super(message, "GEMINI_INVALID_REQUEST", 400);
    this.name = "GeminiInvalidRequestError";
  }
}

export class GeminiAuthError extends GeminiError {
  constructor(message: string = "Authentication failed. Invalid or missing Gemini API key.") {
    super(message, "GEMINI_AUTH_ERROR", 401);
    this.name = "GeminiAuthError";
  }
}

export class GeminiRateLimitError extends GeminiError {
  constructor(message: string = "Gemini API rate limit exceeded. Please try again later.") {
    super(message, "GEMINI_RATE_LIMIT_EXCEEDED", 429);
    this.name = "GeminiRateLimitError";
  }
}

export class GeminiInternalError extends GeminiError {
  constructor(message: string = "Gemini API experienced an internal error.") {
    super(message, "GEMINI_INTERNAL_ERROR", 500);
    this.name = "GeminiInternalError";
  }
}

export class GeminiServiceUnavailableError extends GeminiError {
  constructor(message: string = "Gemini API service is currently unavailable.") {
    super(message, "GEMINI_SERVICE_UNAVAILABLE", 503);
    this.name = "GeminiServiceUnavailableError";
  }
}

export class GeminiInvalidJsonError extends GeminiError {
  constructor(message: string = "Failed to parse Gemini response as valid JSON.") {
    super(message, "INVALID_JSON_RESPONSE", 500);
    this.name = "GeminiInvalidJsonError";
  }
}

export class GeminiEmptyResponseError extends GeminiError {
  constructor(message: string = "Received empty response content from Gemini API.") {
    super(message, "EMPTY_AI_RESPONSE", 503);
    this.name = "GeminiEmptyResponseError";
  }
}

export class GeminiTimeoutError extends GeminiError {
  constructor(message: string = "Gemini API request timed out.") {
    super(message, "GEMINI_TIMEOUT", 503);
    this.name = "GeminiTimeoutError";
  }
}

/**
 * Removes markdown formatting delimiters (e.g. ```json ... ```) from response strings.
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
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
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Service responsible solely for robust communication with Google Gemini API.
 */
export class GeminiService {
  private aiInstance: GoogleGenAI | null = null;
  private modelName: string;
  private timeoutMs: number;

  constructor(
    modelName: string = process.env.GEMINI_MODEL || "gemini-2.0-flash",
    timeoutMs: number = 25000
  ) {
    this.modelName = modelName;
    this.timeoutMs = timeoutMs;
  }

  /**
   * Lazily initializes GoogleGenAI instance at runtime when prompt request is executed.
   */
  private getAiClient(): GoogleGenAI {
    if (!this.aiInstance) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new GeminiAuthError("GEMINI_API_KEY environment variable is missing.");
      }
      this.aiInstance = new GoogleGenAI({ apiKey });
    }
    return this.aiInstance;
  }

  /**
   * Sends prompt to Gemini API, parses JSON response, and retries once with backoff upon failure.
   *
   * @param prompt User or structured content prompt.
   * @param systemInstruction System instruction prompt for Gemini.
   * @returns Parsed JSON response of type T.
   */
  public async generateJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    const maxRetries = 1;
    let attempt = 0;

    while (attempt <= maxRetries) {
      try {
        return await this.executeWithTimeout<T>(prompt, systemInstruction);
      } catch (error) {
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
  private async executeWithTimeout<T>(prompt: string, systemInstruction?: string): Promise<T> {
    let timer: NodeJS.Timeout | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new GeminiTimeoutError(`Gemini request exceeded timeout of ${this.timeoutMs}ms.`));
      }, this.timeoutMs);
    });

    try {
      const result = await Promise.race([
        this.executeGenerateJSON<T>(prompt, systemInstruction),
        timeoutPromise,
      ]);
      return result;
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
  }

  /**
   * Internal helper executing single call to Gemini API and JSON parsing.
   */
  private async executeGenerateJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    let rawText: string;
    const client = this.getAiClient();

    try {
      console.log("[STEP D] Calling Gemini", { model: this.modelName });
      const response = await client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });
      rawText = response.text || "";
      console.log("[STEP E] Gemini returned response");
    } catch (err) {
      throw this.mapError(err);
    }

    if (!rawText || rawText.trim().length === 0) {
      throw new GeminiEmptyResponseError();
    }

    try {
      const cleanedText = cleanJsonResponse(rawText);
      return JSON.parse(cleanedText) as T;
    } catch {
      throw new GeminiInvalidJsonError();
    }
  }

  /**
   * Maps unhandled exceptions and HTTP errors to explicit typed GeminiError sub-classes.
   */
  private mapError(err: unknown): GeminiError {
    if (err instanceof GeminiError) {
      return err;
    }

    let rawMessage = err instanceof Error ? err.message : String(err);
    let message = rawMessage;

    // Try parsing rawMessage if it's a JSON error string from @google/genai SDK
    try {
      if (rawMessage.startsWith("{") && rawMessage.endsWith("}")) {
        const parsed = JSON.parse(rawMessage);
        if (parsed?.error?.message) {
          message = parsed.error.message;
        }
      }
    } catch {
      // Keep original message if not JSON
    }

    const status = (err as { status?: number; statusCode?: number })?.status ||
                   (err as { status?: number; statusCode?: number })?.statusCode;

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
