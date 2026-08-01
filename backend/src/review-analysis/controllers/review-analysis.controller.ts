import { Request, Response, NextFunction } from "express";
import { AnalyzeRequest, AnalyzeResponse, ApiErrorResponse } from "../types/api.types";
import { ReviewAnalysisService, GeminiError } from "../services";

export class ReviewAnalysisController {
  constructor(private reviewService = new ReviewAnalysisService()) {}

  public analyze = async (
    req: Request<Record<string, never>, unknown, AnalyzeRequest>,
    res: Response<AnalyzeResponse | ApiErrorResponse | string>,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("[STEP C] ReviewAnalysisService started");
      const { reviews } = req.body;

      // Enable streaming NDJSON progress events
      res.setHeader("Content-Type", "application/x-ndjson");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const sendEvent = (event: Record<string, unknown>) => {
        res.write(JSON.stringify(event) + "\n");
      };

      sendEvent({ stage: "Uploading Reviews", step: 1 });
      sendEvent({ stage: "Reading CSV", step: 2 });

      const analysisResult = await this.reviewService.analyzeReviewsWithProgress(
        reviews,
        sendEvent
      );

      console.log("[STEP F] Sending HTTP 200 Final Result");
      sendEvent({
        stage: "Preparing Dashboard",
        step: 8,
        result: analysisResult,
      });
      res.end();
    } catch (error) {
      if (error instanceof GeminiError) {
        if (!res.headersSent) {
          res.status(error.statusCode).json({ success: false, message: error.message, errorCode: error.errorCode });
        } else {
          res.write(JSON.stringify({ error: error.message, errorCode: error.errorCode }) + "\n");
          res.end();
        }
        return;
      }
      next(error);
    }
  };
}
