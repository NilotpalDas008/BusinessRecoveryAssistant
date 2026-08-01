"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAnalyzeRequest = validateAnalyzeRequest;
const review_validator_1 = require("./review.validator");
/**
 * Express middleware to validate POST /analyze request payload.
 * Returns HTTP 400 Bad Request with standardized error JSON if payload is invalid.
 */
function validateAnalyzeRequest(req, res, next) {
    console.log("[STEP A] POST /api/reviews/analyze received", {
        bodyLength: req.body?.reviews?.length,
    });
    const errorMessage = (0, review_validator_1.validateAnalyzePayload)(req.body);
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
