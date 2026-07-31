"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateBusinessOwner = void 0;
const BusinessOwner_1 = require("../models/BusinessOwner");
const getOrCreateBusinessOwner = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
            res.status(400).json({
                success: false,
                error: "Email is required and must be a string",
            });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();
        // Check if business owner already exists
        let businessOwner = await BusinessOwner_1.BusinessOwner.findOne({ email: normalizedEmail });
        if (businessOwner) {
            res.status(200).json({
                success: true,
                businessOwner,
            });
            return;
        }
        // Create new business owner if it does not exist
        businessOwner = await BusinessOwner_1.BusinessOwner.create({
            email: normalizedEmail,
        });
        res.status(201).json({
            success: true,
            businessOwner,
        });
    }
    catch (error) {
        console.error("[BusinessOwner Controller] Error:", error);
        res.status(500).json({
            success: false,
            error: error?.message || "Internal server error",
        });
    }
};
exports.getOrCreateBusinessOwner = getOrCreateBusinessOwner;
