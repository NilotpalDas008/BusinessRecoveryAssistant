import { Router } from "express";
import { getOrCreateBusinessOwner } from "../controllers/businessOwner.controller";

const router = Router();

// POST /api/business-owner
router.post("/", getOrCreateBusinessOwner);

export default router;
