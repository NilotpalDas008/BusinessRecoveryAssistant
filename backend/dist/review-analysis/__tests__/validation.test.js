"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const review_validator_1 = require("../validators/review.validator");
const validate_analyze_request_middleware_1 = require("../validators/validate-analyze-request.middleware");
describe("Validation Logic & Middleware", () => {
    describe("Review Property Validators", () => {
        it("should validate rating boundaries (1-5)", () => {
            expect((0, review_validator_1.isValidRating)(1)).toBe(true);
            expect((0, review_validator_1.isValidRating)(5)).toBe(true);
            expect((0, review_validator_1.isValidRating)(0)).toBe(false);
            expect((0, review_validator_1.isValidRating)(6)).toBe(false);
            expect((0, review_validator_1.isValidRating)("5")).toBe(false);
        });
        it("should validate review text presence", () => {
            expect((0, review_validator_1.isValidText)("Good food")).toBe(true);
            expect((0, review_validator_1.isValidText)("   ")).toBe(false);
            expect((0, review_validator_1.isValidText)(123)).toBe(false);
        });
        it("should validate date strings", () => {
            expect((0, review_validator_1.isValidDate)("2026-08-01")).toBe(true);
            expect((0, review_validator_1.isValidDate)("invalid-date")).toBe(false);
            expect((0, review_validator_1.isValidDate)("")).toBe(false);
        });
    });
    describe("Payload Validator", () => {
        it("should reject non-array or empty reviews", () => {
            expect((0, review_validator_1.validateAnalyzePayload)({})).toBe("Field 'reviews' is required and must be an array.");
            expect((0, review_validator_1.validateAnalyzePayload)({ reviews: [] })).toBe("Reviews array cannot be empty.");
        });
        it("should reject payloads exceeding 100 reviews", () => {
            const longReviews = Array(101).fill({ rating: 5, text: "Good", date: "2026-08-01" });
            expect((0, review_validator_1.validateAnalyzePayload)({ reviews: longReviews })).toBe("Maximum 100 reviews per request exceeded.");
        });
        it("should accept valid payload array", () => {
            const validPayload = {
                reviews: [{ rating: 5, text: "Great place", date: "2026-08-01" }],
            };
            expect((0, review_validator_1.validateAnalyzePayload)(validPayload)).toBeNull();
        });
    });
    describe("validateAnalyzeRequest Middleware", () => {
        let req;
        let res;
        let next;
        beforeEach(() => {
            req = { body: {} };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            next = jest.fn();
        });
        it("should return 400 Bad Request on invalid body", () => {
            req.body = { reviews: [] };
            (0, validate_analyze_request_middleware_1.validateAnalyzeRequest)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                errorCode: "INVALID_REQUEST",
            }));
            expect(next).not.toHaveBeenCalled();
        });
        it("should call next() on valid payload", () => {
            req.body = {
                reviews: [{ rating: 4, text: "Very good experience", date: "2026-08-01" }],
            };
            (0, validate_analyze_request_middleware_1.validateAnalyzeRequest)(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});
