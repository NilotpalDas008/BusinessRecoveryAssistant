import { Router } from "express";
import { getDashboardOverview } from "../controllers/dashboard.controller";

const router = Router();

// GET /dashboard
router.get("/", getDashboardOverview);

export default router;