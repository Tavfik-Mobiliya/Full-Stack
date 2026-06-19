"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Static Admin Credentials (safe fallback)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aura.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "auraAdmin2026!";
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        return res.json({
            success: true,
            token: authMiddleware_1.ADMIN_SESSION_TOKEN,
            message: "Successfully authenticated as administrator."
        });
    }
    return res.status(401).json({ error: "Invalid email or password." });
});
exports.default = router;
