import { Request, Response, NextFunction } from "express";
import { validateAnalyzePayload } from "./review.validator";
import { ApiErrorResponse } from "../types/api.types";

/**
 * Express middleware to validate POST /analyze request payload.
 * Returns HTTP 400 Bad Request with standardized error JSON if payload is invalid.
 */
export function validateAnalyzeRequest(
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction
): void {
  console.log("[STEP A] POST /api/reviews/analyze received", {
    bodyLength: req.body?.reviews?.length,
  });

  const errorMessage = validateAnalyzePayload(req.body);

  if (errorMessage) {
    console.error("[STEP B FAILED] Validation failed:", errorMessage);
    res.status(400).json({
      success: false,
      message: errorMessage,
      errorCode: "INVALID_REQUEST",
    });
    return;
  }

  console.log("[STEP B] Validation passed");
  next();
}
