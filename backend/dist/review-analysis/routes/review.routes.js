"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validators_1 = require("../validators");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
const controller = new controllers_1.ReviewAnalysisController();
router.post("/analyze", validators_1.validateAnalyzeRequest, controller.analyze);
exports.default = router;
