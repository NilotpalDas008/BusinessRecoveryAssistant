"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const businessOwner_routes_1 = __importDefault(require("./routes/businessOwner.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect Database
(0, database_1.connectDB)();
// API Routes
app.use("/api/business-owner", businessOwner_routes_1.default);
// Health check endpoint
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
// Start Server
app.listen(PORT, () => {
    console.log(`[Express] Server is running on http://localhost:${PORT}`);
});
