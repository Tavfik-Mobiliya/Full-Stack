"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const projects_1 = __importDefault(require("./routes/projects"));
const testimonials_1 = __importDefault(require("./routes/testimonials"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
const auth_1 = __importDefault(require("./routes/auth"));
const collections_1 = __importDefault(require("./routes/collections"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});
// Routes
app.use("/api/projects", projects_1.default);
app.use("/api/testimonials", testimonials_1.default);
app.use("/api/inquiries", inquiries_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/collections", collections_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong on the server." });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
