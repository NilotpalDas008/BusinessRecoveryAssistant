"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
// GET /dashboard
router.get("/", dashboard_controller_1.getDashboardOverview);
exports.default = router;
