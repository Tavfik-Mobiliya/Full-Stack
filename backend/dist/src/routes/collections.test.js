"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const collections_1 = __importDefault(require("./collections"));
const env_1 = require("../config/env");
const prisma_1 = __importDefault(require("../prisma"));
jest.mock("../prisma", () => ({
    __esModule: true,
    default: {
        collection: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        product: {
            updateMany: jest.fn(),
        },
    },
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/collections", collections_1.default);
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ error: err.message });
});
describe("Collections Routes", () => {
    const adminToken = jsonwebtoken_1.default.sign({ role: "admin", email: env_1.env.adminEmail }, env_1.env.adminJwtSecret);
    const userCookie = [`${env_1.env.authCookieName}=${adminToken}`];
    const mockCollection = {
        id: 1,
        nameEn: "Modern Collection",
        nameAr: "المجموعة الحديثة",
        nameTr: "Modern Koleksiyon",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projects: [],
    };
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("GET /api/collections", () => {
        it("should return collections with pagination defaults", async () => {
            prisma_1.default.collection.findMany.mockResolvedValue([mockCollection]);
            const response = await (0, supertest_1.default)(app).get("/api/collections");
            expect(response.status).toBe(200);
            expect(response.body).toEqual([mockCollection]);
            expect(prisma_1.default.collection.findMany).toHaveBeenCalledWith(expect.objectContaining({
                skip: 0,
                take: 20,
                orderBy: { createdAt: "desc" },
                include: { projects: true },
            }));
        });
        it("should parse page and pageSize query parameters", async () => {
            prisma_1.default.collection.findMany.mockResolvedValue([]);
            const response = await (0, supertest_1.default)(app).get("/api/collections?page=3&pageSize=10");
            expect(response.status).toBe(200);
            expect(prisma_1.default.collection.findMany).toHaveBeenCalledWith(expect.objectContaining({
                skip: 20,
                take: 10,
            }));
        });
    });
    describe("POST /api/collections", () => {
        it("should return 401 if unauthorized", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/collections")
                .send({
                nameEn: "New",
                nameAr: "جديد",
                nameTr: "Yeni",
            });
            expect(response.status).toBe(401);
        });
        it("should create a collection successfully with valid body and auth", async () => {
            prisma_1.default.collection.create.mockResolvedValue(mockCollection);
            const response = await (0, supertest_1.default)(app)
                .post("/api/collections")
                .set("Cookie", userCookie)
                .send({
                nameEn: "Modern Collection",
                nameAr: "المجموعة الحديثة",
                nameTr: "Modern Koleksiyon",
            });
            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockCollection);
            expect(prisma_1.default.collection.create).toHaveBeenCalledWith({
                data: {
                    nameEn: "Modern Collection",
                    nameAr: "المجموعة الحديثة",
                    nameTr: "Modern Koleksiyon",
                },
            });
        });
        it("should return 400 if validation fails", async () => {
            const response = await (0, supertest_1.default)(app)
                .post("/api/collections")
                .set("Cookie", userCookie)
                .send({
                nameEn: "", // Empty english name
                nameAr: "جديد",
                nameTr: "Yeni",
            });
            expect(response.status).toBe(400);
            expect(prisma_1.default.collection.create).not.toHaveBeenCalled();
        });
    });
    describe("PUT /api/collections/:id", () => {
        it("should return 400 for invalid collection id", async () => {
            const response = await (0, supertest_1.default)(app)
                .put("/api/collections/notaninteger")
                .set("Cookie", userCookie)
                .send({
                nameEn: "Modern Collection",
                nameAr: "المجموعة الحديثة",
                nameTr: "Modern Koleksiyon",
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Invalid collection id");
        });
        it("should return 404 if collection is not found", async () => {
            prisma_1.default.collection.findUnique.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app)
                .put("/api/collections/123")
                .set("Cookie", userCookie)
                .send({
                nameEn: "Modern Collection",
                nameAr: "المجموعة الحديثة",
                nameTr: "Modern Koleksiyon",
            });
            expect(response.status).toBe(404);
            expect(response.body.error).toContain("Collection not found");
        });
        it("should update collection if it exists", async () => {
            prisma_1.default.collection.findUnique.mockResolvedValue(mockCollection);
            prisma_1.default.collection.update.mockResolvedValue({
                ...mockCollection,
                nameEn: "Updated Modern Collection",
            });
            const response = await (0, supertest_1.default)(app)
                .put("/api/collections/1")
                .set("Cookie", userCookie)
                .send({
                nameEn: "Updated Modern Collection",
                nameAr: "المجموعة الحديثة",
                nameTr: "Modern Koleksiyon",
            });
            expect(response.status).toBe(200);
            expect(response.body.nameEn).toBe("Updated Modern Collection");
            expect(prisma_1.default.collection.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    nameEn: "Updated Modern Collection",
                    nameAr: "المجموعة الحديثة",
                    nameTr: "Modern Koleksiyon",
                },
            });
        });
    });
    describe("DELETE /api/collections/:id", () => {
        it("should delete collection and unlink projects", async () => {
            prisma_1.default.collection.findUnique.mockResolvedValue(mockCollection);
            prisma_1.default.product.updateMany.mockResolvedValue({ count: 2 });
            prisma_1.default.collection.delete.mockResolvedValue(mockCollection);
            const response = await (0, supertest_1.default)(app)
                .delete("/api/collections/1")
                .set("Cookie", userCookie);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
            expect(prisma_1.default.product.updateMany).toHaveBeenCalledWith({
                where: { collectionId: 1 },
                data: { collectionId: null },
            });
            expect(prisma_1.default.collection.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
        it("should return 404 if collection to delete is not found", async () => {
            prisma_1.default.collection.findUnique.mockResolvedValue(null);
            const response = await (0, supertest_1.default)(app)
                .delete("/api/collections/1")
                .set("Cookie", userCookie);
            expect(response.status).toBe(404);
            expect(prisma_1.default.collection.delete).not.toHaveBeenCalled();
        });
    });
});
