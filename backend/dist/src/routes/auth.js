"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
function createAdminToken(email) {
    const signOptions = {
        expiresIn: env_1.env.authTokenTtl,
        issuer: "stitch-luxury-showroom",
        audience: "stitch-luxury-admin",
    };
    return jsonwebtoken_1.default.sign({ role: "admin", email }, env_1.env.adminJwtSecret, {
        ...signOptions,
    });
}
function setAuthCookie(res, token) {
    res.cookie(env_1.env.authCookieName, token, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: "strict",
        path: "/",
    });
}
function clearAuthCookie(res) {
    res.clearCookie(env_1.env.authCookieName, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: "strict",
        path: "/",
    });
}
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "Email and password are required." });
        return;
    }
    if (email.toLowerCase() === env_1.env.adminEmail.toLowerCase() && password === env_1.env.adminPassword) {
        const token = createAdminToken(email);
        setAuthCookie(res, token);
        res.json({
            success: true,
            message: "Successfully authenticated as administrator."
        });
        return;
    }
    res.status(401).json({ error: "Invalid email or password." });
});
router.get("/session", authMiddleware_1.authMiddleware, (_req, res) => {
    res.json({ authenticated: true });
});
router.post("/logout", (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true });
});
exports.default = router;
