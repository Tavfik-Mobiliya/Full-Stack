"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const testimonials_1 = __importDefault(require("./testimonials"));
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../prisma"));
jest.mock("../prisma", () => ({
    __esModule: true,
    default: {
        testimonial: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/testimonials", testimonials_1.default);
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
});
describe("Testimonials Routes", () => {
    const adminToken = jsonwebtoken_1.default.sign({ role: "admin", email: env_1.env.adminEmail }, env_1.env.adminJwtSecret);
    const adminCookie = [`${env_1.env.authCookieName}=${adminToken}`];
    const mockTestimonial = {
        id: 1,
        author: "Jane Doe",
        category: "General",
        rating: 5,
        quoteEn: "Superb designs!",
        quoteAr: "تصاميم رائعة!",
        quoteTr: "Harika tasarımlar!",
        roleEn: "Architect",
        roleAr: "مهندس معماري",
        roleTr: "Mimar",
        createdAt: new Date().toISOString(),
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("GET /api/testimonials", () => {
        it("should return testimonials list with default parameters", async () => {
            prisma_1.default.testimonial.findMany.mockResolvedValue([mockTestimonial]);
            const response = await (0, supertest_1.default)(app).get("/api/testimonials");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockTestimonial]);
            expect(prisma_1.default.testimonial.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: {},
                skip: 0,
                take: 20,
            }));
        });
        it("should filter by category", async () => {
            prisma_1.default.testimonial.findMany.mockResolvedValue([]);
            await (0, supertest_1.default)(app).get("/api/testimonials?category=Interior");
            expect(prisma_1.default.testimonial.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { category: "Interior" },
            }));
        });
    });
    describe("POST /api/testimonials", () => {
        it("should return 401 if unauthorized", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/testimonials")
                .send(mockTestimonial);
            expect(response.status).toBe(401);
        });
        it("should create testimonial successfully with valid body and auth", async () => {
            prisma_1.default.testimonial.create.mockResolvedValue(mockTestimonial);
            const response = await (0, supertest_1.default)(app)
                .post("/api/testimonials")
                .set("Cookie", adminCookie)
                .send({
                author: "Jane Doe",
                quoteEn: "Superb designs!",
                quoteAr: "تصاميم رائعة!",
                quoteTr: "Harika tasarımlar!",
                roleEn: "Architect",
                roleAr: "مهندس معماري",
                roleTr: "Mimar",
                rating: 5,
            });
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockTestimonial);
            expect(prisma_1.default.testimonial.create).toHaveBeenCalledWith({
                data: {
                    author: "Jane Doe",
                    category: "General",
                    rating: 5,
                    quoteEn: "Superb designs!",
                    quoteAr: "تصاميم رائعة!",
                    quoteTr: "Harika tasarımlar!",
                    roleEn: "Architect",
                    roleAr: "مهندس معماري",
                    roleTr: "Mimar",
                },
            });
        });
    });
    describe("PUT /api/testimonials/:id", () => {
        it("should return 404 if testimonial is not found", async () => {
            prisma_1.default.testimonial.findUnique.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app)
                .put("/api/testimonials/123")
                .set("Cookie", adminCookie)
                .send({
                author: "Jane Doe",
                quoteEn: "Superb designs!",
                quoteAr: "تصاميم رائعة!",
                quoteTr: "Harika tasarımlar!",
                roleEn: "Architect",
                roleAr: "مهندس معماري",
                roleTr: "Mimar",
            });
            expect(response.status).toBe(404);
            expect(prisma_1.default.testimonial.update).not.toHaveBeenCalled();
        });
        it("should update testimonial successfully", async () => {
            prisma_1.default.testimonial.findUnique.mockResolvedValue(mockTestimonial);
            prisma_1.default.testimonial.update.mockResolvedValue({
                ...mockTestimonial,
                author: "Updated Author",
            });
            const response = await (0, supertest_1.default)(app)
                .put("/api/testimonials/1")
                .set("Cookie", adminCookie)
                .send({
                author: "Updated Author",
                quoteEn: "Superb designs!",
                quoteAr: "تصاميم رائعة!",
                quoteTr: "Harika tasarımlar!",
                roleEn: "Architect",
                roleAr: "مهندس معماري",
                roleTr: "Mimar",
                rating: 4,
            });
            expect(response.status).toBe(200);
            expect(response.body.author).toBe("Updated Author");
            expect(prisma_1.default.testimonial.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining({
                    author: "Updated Author",
                    rating: 4,
                }),
            });
        });
    });
    describe("DELETE /api/testimonials/:id", () => {
        it("should return 404 if not found", async () => {
            prisma_1.default.testimonial.findUnique.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app)
                .delete("/api/testimonials/123")
                .set("Cookie", adminCookie);
            expect(response.status).toBe(404);
        });
        it("should delete testimonial successfully if found", async () => {
            prisma_1.default.testimonial.findUnique.mockResolvedValue(mockTestimonial);
            prisma_1.default.testimonial.delete.mockResolvedValue(mockTestimonial);
            const response = await (0, supertest_1.default)(app)
                .delete("/api/testimonials/1")
                .set("Cookie", adminCookie);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Testimonial deleted successfully" });
            expect(prisma_1.default.testimonial.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });
});
