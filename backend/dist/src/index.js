"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const crypto_1 = require("crypto");
const projects_1 = __importDefault(require("./routes/projects"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
const auth_1 = __importDefault(require("./routes/auth"));
const collections_1 = __importDefault(require("./routes/collections"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const apiRouter = express_1.default.Router();
const allowedOrigins = new Set(env_1.env.corsOrigins);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Origin is not allowed by CORS policy"));
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, express_rate_limit_1.default)({
    windowMs: env_1.env.rateLimitWindowMs,
    max: env_1.env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use((req, res, next) => {
    const requestId = (0, crypto_1.randomUUID)();
    req.headers["x-request-id"] = requestId;
    res.setHeader("x-request-id", requestId);
    next();
});
app.use((0, morgan_1.default)("dev"));
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});
// Routes
apiRouter.use("/projects", projects_1.default);
apiRouter.use("/testimonials", testimonials_1.default);
apiRouter.use("/inquiries", inquiries_1.default);
apiRouter.use("/auth", auth_1.default);
apiRouter.use("/collections", collections_1.default);
app.use("/api", apiRouter);
app.use("/api/v1", apiRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    void next;
    const statusCode = err instanceof Error && "statusCode" in err ? Number(err.statusCode) : 500;
    const safeMessage = err instanceof Error ? err.message : "Something went wrong on the server.";
    const responseMessage = statusCode >= 500 ? "Internal server error" : safeMessage;
    if (statusCode >= 500) {
        console.error(`[${req.method}] ${req.originalUrl} request_id=${res.getHeader("x-request-id") ?? "unknown"}`, err);
    }
    res.status(Number.isFinite(statusCode) ? statusCode : 500).json({ error: responseMessage });
});
app.listen(env_1.env.port, () => {
    console.log(`Server is running on port ${env_1.env.port}`);
});
