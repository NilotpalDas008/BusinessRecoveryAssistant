"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gemini_service_1 = require("../services/gemini.service");
describe("GeminiService REST API Transport", () => {
    const originalEnv = process.env;
    const originalFetch = global.fetch;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv, GEMINI_API_KEY: "test-api-key" };
    });
    afterEach(() => {
        process.env = originalEnv;
        global.fetch = originalFetch;
        jest.restoreAllMocks();
    });
    it("should throw GeminiAuthError if GEMINI_API_KEY is missing", async () => {
        delete process.env.GEMINI_API_KEY;
        const service = new gemini_service_1.GeminiService();
        await expect(service.generateJSON("test")).rejects.toThrow(gemini_service_1.GeminiAuthError);
    });
    it("should send correct POST request format and parse JSON response", async () => {
        const mockResponse = {
            candidates: [
                {
                    content: {
                        parts: [
                            {
                                text: "```json\n{\"success\": true}\n```",
                            },
                        ],
                    },
                },
            ],
        };
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });
        global.fetch = mockFetch;
        const service = new gemini_service_1.GeminiService();
        const result = await service.generateJSON("Hello prompt", "Act as helpful assistant");
        expect(result).toEqual({ success: true });
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent");
        expect(options.method).toBe("POST");
        expect(options.headers["X-goog-api-key"]).toBe("test-api-key");
        expect(options.headers["Content-Type"]).toBe("application/json");
        const parsedBody = JSON.parse(options.body);
        expect(parsedBody.contents[0].parts[0].text).toBe("System:\nAct as helpful assistant\n\nUser:\nHello prompt");
    });
    it("should format body without system prefix if systemInstruction is omitted", async () => {
        const mockResponse = {
            candidates: [
                {
                    content: {
                        parts: [
                            {
                                text: "{\"result\": 42}",
                            },
                        ],
                    },
                },
            ],
        };
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });
        global.fetch = mockFetch;
        const service = new gemini_service_1.GeminiService();
        const result = await service.generateJSON("Simple prompt");
        expect(result).toEqual({ result: 42 });
        const parsedBody = JSON.parse(mockFetch.mock.calls[0][1].body);
        expect(parsedBody.contents[0].parts[0].text).toBe("Simple prompt");
    });
    it("should map HTTP 401 response to GeminiAuthError", async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 401,
            statusText: "Unauthorized",
            json: async () => ({ error: { message: "Invalid API key" } }),
        });
        global.fetch = mockFetch;
        const service = new gemini_service_1.GeminiService();
        await expect(service.generateJSON("test")).rejects.toThrow(gemini_service_1.GeminiAuthError);
    });
    it("should map HTTP 429 response to GeminiRateLimitError", async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 429,
            statusText: "Too Many Requests",
            json: async () => ({ error: { message: "Rate limit exceeded" } }),
        });
        global.fetch = mockFetch;
        const service = new gemini_service_1.GeminiService();
        await expect(service.generateJSON("test")).rejects.toThrow(gemini_service_1.GeminiRateLimitError);
    });
    it("should map invalid JSON output from model to GeminiInvalidJsonError", async () => {
        const mockResponse = {
            candidates: [
                {
                    content: {
                        parts: [
                            {
                                text: "This is not valid JSON",
                            },
                        ],
                    },
                },
            ],
        };
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockResponse,
        });
        global.fetch = mockFetch;
        const service = new gemini_service_1.GeminiService();
        await expect(service.generateJSON("test")).rejects.toThrow(gemini_service_1.GeminiInvalidJsonError);
    });
});
