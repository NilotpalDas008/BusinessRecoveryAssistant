import { Request, Response, NextFunction } from "express";
import {
  isValidRating,
  isValidText,
  isValidDate,
  validateAnalyzePayload,
} from "../validators/review.validator";
import { validateAnalyzeRequest } from "../validators/validate-analyze-request.middleware";

describe("Validation Logic & Middleware", () => {
  describe("Review Property Validators", () => {
    it("should validate rating boundaries (1-5)", () => {
      expect(isValidRating(1)).toBe(true);
      expect(isValidRating(5)).toBe(true);
      expect(isValidRating(0)).toBe(false);
      expect(isValidRating(6)).toBe(false);
      expect(isValidRating("5")).toBe(false);
    });

    it("should validate review text presence", () => {
      expect(isValidText("Good food")).toBe(true);
      expect(isValidText("   ")).toBe(false);
      expect(isValidText(123)).toBe(false);
    });

    it("should validate date strings", () => {
      expect(isValidDate("2026-08-01")).toBe(true);
      expect(isValidDate("invalid-date")).toBe(false);
      expect(isValidDate("")).toBe(false);
    });
  });

  describe("Payload Validator", () => {
    it("should reject non-array or empty reviews", () => {
      expect(validateAnalyzePayload({})).toBe("Field 'reviews' is required and must be an array.");
      expect(validateAnalyzePayload({ reviews: [] })).toBe("Reviews array cannot be empty.");
    });

    it("should reject payloads exceeding 100 reviews", () => {
      const longReviews = Array(101).fill({ rating: 5, text: "Good", date: "2026-08-01" });
      expect(validateAnalyzePayload({ reviews: longReviews })).toBe("Maximum 100 reviews per request exceeded.");
    });

    it("should accept valid payload array", () => {
      const validPayload = {
        reviews: [{ rating: 5, text: "Great place", date: "2026-08-01" }],
      };
      expect(validateAnalyzePayload(validPayload)).toBeNull();
    });
  });

  describe("validateAnalyzeRequest Middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;

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
      validateAnalyzeRequest(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errorCode: "INVALID_REQUEST",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next() on valid payload", () => {
      req.body = {
        reviews: [{ rating: 4, text: "Very good experience", date: "2026-08-01" }],
      };
      validateAnalyzeRequest(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
