"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_SESSION_TOKEN = void 0;
exports.authMiddleware = authMiddleware;
// A secure static token for session validation
exports.ADMIN_SESSION_TOKEN = "aura-luxury-showroom-admin-session-token-2026";
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized. Admin session token is missing." });
    }
    const token = authHeader.split(" ")[1];
    if (token !== exports.ADMIN_SESSION_TOKEN) {
        return res.status(403).json({ error: "Forbidden. Invalid admin session token." });
    }
    req.isAdmin = true;
    next();
}
