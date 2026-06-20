"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getRequiredEnv(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function getNumberEnv(name, defaultValue) {
    const rawValue = process.env[name];
    if (!rawValue) {
        return defaultValue;
    }
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
        throw new Error(`Environment variable ${name} must be a valid number.`);
    }
    return parsed;
}
function getCsvEnv(name, defaultValue) {
    const rawValue = process.env[name];
    if (!rawValue) {
        return defaultValue;
    }
    return rawValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
}
const adminJwtSecret = getRequiredEnv("ADMIN_JWT_SECRET");
if (adminJwtSecret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be at least 32 characters long.");
}
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: getNumberEnv("PORT", 5000),
    adminEmail: getRequiredEnv("ADMIN_EMAIL"),
    adminPassword: getRequiredEnv("ADMIN_PASSWORD"),
    adminJwtSecret,
    authCookieName: process.env.AUTH_COOKIE_NAME?.trim() || "showroom_admin_session",
    authTokenTtl: process.env.AUTH_TOKEN_TTL?.trim() || "15m",
    corsOrigins: getCsvEnv("CORS_ORIGINS", ["http://localhost:3000"]),
    rateLimitWindowMs: getNumberEnv("RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
    rateLimitMax: getNumberEnv("RATE_LIMIT_MAX", 100),
};
exports.isProduction = exports.env.nodeEnv === "production";
