"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inquiries_1 = __importDefault(require("./inquiries"));
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../prisma"));
jest.mock("../prisma", () => ({
    __esModule: true,
    default: {
        inquiry: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
        },
    },
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/inquiries", inquiries_1.default);
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
});
describe("Inquiries Routes", () => {
    const adminToken = jsonwebtoken_1.default.sign({ role: "admin", email: env_1.env.adminEmail }, env_1.env.adminJwtSecret);
    const adminCookie = [`${env_1.env.authCookieName}=${adminToken}`];
    const mockInquiry = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+90 555 123 4567",
        message: "Interested in your custom kitchen designs.",
        type: "Contact",
        details: {},
        createdAt: new Date().toISOString(),
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("GET /api/inquiries", () => {
        it("should return 401 if unauthorized", async () => {
            const response = await (0, supertest_1.default)(app).get("/api/inquiries");
            expect(response.status).toBe(401);
        });
        it("should return inquiries list for admin", async () => {
            prisma_1.default.inquiry.findMany.mockResolvedValue([mockInquiry]);
            const response = await (0, supertest_1.default)(app)
                .get("/api/inquiries")
                .set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockInquiry]);
            expect(prisma_1.default.inquiry.findMany).toHaveBeenCalled();
        });
    });
    describe("POST /api/inquiries", () => {
        it("should submit a new inquiry successfully", async () => {
            prisma_1.default.inquiry.create.mockResolvedValue(mockInquiry);
            const response = await (0, supertest_1.default)(app)
                .post("/api/inquiries")
                .send({
                name: "John Doe",
                email: "john@example.com",
                phone: "+90 555 123 4567",
                message: "Interested in your custom kitchen designs.",
            });
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockInquiry);
            expect(prisma_1.default.inquiry.create).toHaveBeenCalledWith({
                data: {
                    name: "John Doe",
                    email: "john@example.com",
                    phone: "+90 555 123 4567",
                    message: "Interested in your custom kitchen designs.",
                    type: "Contact",
                    details: {},
                },
            });
        });
        it("should fail validation if email is invalid", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/inquiries")
                .send({
                name: "John Doe",
                email: "invalid-email",
                message: "A message",
            });
            expect(response.status).toBe(400);
            expect(prisma_1.default.inquiry.create).not.toHaveBeenCalled();
        });
    });
    describe("DELETE /api/inquiries/:id", () => {
        it("should return 401 if unauthorized", async () => {
            const response = await (0, supertest_1.default)(app).delete("/api/inquiries/1");
            expect(response.status).toBe(401);
        });
        it("should return 404 if inquiry is not found", async () => {
            prisma_1.default.inquiry.findUnique.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app)
                .delete("/api/inquiries/123")
                .set("Cookie", adminCookie);
            expect(response.status).toBe(404);
            expect(response.body.error).toContain("Inquiry not found");
            expect(prisma_1.default.inquiry.delete).not.toHaveBeenCalled();
        });
        it("should delete inquiry successfully if found", async () => {
            prisma_1.default.inquiry.findUnique.mockResolvedValue(mockInquiry);
            prisma_1.default.inquiry.delete.mockResolvedValue(mockInquiry);
            const response = await (0, supertest_1.default)(app)
                .delete("/api/inquiries/1")
                .set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Inquiry deleted successfully" });
            expect(prisma_1.default.inquiry.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });
});
