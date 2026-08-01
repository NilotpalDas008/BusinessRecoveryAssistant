import { Router } from "express";
import { validateAnalyzeRequest } from "../validators";
import { ReviewAnalysisController } from "../controllers";

const router = Router();
const controller = new ReviewAnalysisController();

router.post("/analyze", validateAnalyzeRequest, controller.analyze);

export default router;
