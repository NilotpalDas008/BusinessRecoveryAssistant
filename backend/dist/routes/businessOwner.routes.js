"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const businessOwner_controller_1 = require("../controllers/businessOwner.controller");
const router = (0, express_1.Router)();
// POST /api/business-owner
router.post("/", businessOwner_controller_1.getOrCreateBusinessOwner);
exports.default = router;
