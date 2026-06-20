"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("./auth"));
const env_1 = require("../config/env");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_1.default);
// Global Error Handler to avoid raw stack trace logs during test runs
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
});
describe("Auth Routes", () => {
    describe("POST /api/auth/login", () => {
        it("should login successfully with valid admin credentials", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/auth/login")
                .send({
                email: env_1.env.adminEmail,
                password: env_1.env.adminPassword,
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "Successfully authenticated as administrator.",
            });
            // Verify that the cookie is set in headers
            const cookies = response.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toContain(env_1.env.authCookieName);
        });
        it("should return 401 with invalid credentials", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/auth/login")
                .send({
                email: env_1.env.adminEmail,
                password: "wrongpassword",
            });
            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: "Invalid email or password.",
            });
        });
        it("should return 400 if validation fails (e.g. invalid email)", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/auth/login")
                .send({
                email: "notanemail",
                password: "password",
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Validation error");
        });
    });
    describe("GET /api/auth/session", () => {
        it("should return 200 with authenticated: true if a valid admin token cookie is provided", async () => {
            const token = jsonwebtoken_1.default.sign({ role: "admin", email: env_1.env.adminEmail }, env_1.env.adminJwtSecret);
            const response = await (0, supertest_1.default)(app)
                .get("/api/auth/session")
                .set("Cookie", [`${env_1.env.authCookieName}=${token}`]);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ authenticated: true });
        });
        it("should return 401 if token is missing", async () => {
            const response = await (0, supertest_1.default)(app).get("/api/auth/session");
            expect(response.status).toBe(401);
            expect(response.body.error).toContain("Authentication token is missing");
        });
    });
    describe("POST /api/auth/logout", () => {
        it("should clear the auth cookie and return success", async () => {
            const response = await (0, supertest_1.default)(app).post("/api/auth/logout");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
            const cookies = response.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toContain(`${env_1.env.authCookieName}=;`);
            expect(cookies[0]).toContain("Expires=");
        });
    });
});
