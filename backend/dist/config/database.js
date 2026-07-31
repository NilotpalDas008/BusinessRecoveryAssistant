"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI;
        if (!connStr) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose_1.default.connect(connStr);
        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("[MongoDB] Connection error:", error?.message || error);
        if (error?.code === "ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR" ||
            error?.message?.includes("tlsv1 alert internal error")) {
            console.warn("[MongoDB Atlas Hint] Your current IP address is likely blocked by MongoDB Atlas Network Access list. Please add your current IP or allow access from anywhere (0.0.0.0/0) in MongoDB Atlas -> Network Access.");
        }
    }
};
exports.connectDB = connectDB;
