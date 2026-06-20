"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.split(" ")[1] ?? null;
    }
    const cookieToken = req.cookies?.[env_1.env.authCookieName];
    if (typeof cookieToken === "string" && cookieToken.length > 0) {
        return cookieToken;
    }
    return null;
}
function authMiddleware(req, res, next) {
    const token = extractToken(req);
    if (!token) {
        res.status(401).json({ error: "Unauthorized. Authentication token is missing." });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.adminJwtSecret);
        if (payload.role !== "admin") {
            res.status(403).json({ error: "Forbidden. Admin access is required." });
            return;
        }
        req.isAdmin = true;
        next();
    }
    catch {
        res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
    }
}
