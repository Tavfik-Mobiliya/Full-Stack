"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
function parsePagination(pageRaw, pageSizeRaw) {
    const page = Number(pageRaw ?? 1);
    const pageSize = Number(pageSizeRaw ?? 20);
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(Math.floor(pageSize), 50) : 20;
    return {
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
    };
}
// GET all testimonials (optional filter by category)
router.get("/", async (req, res, next) => {
    try {
        const { category, page, pageSize } = req.query;
        const where = {};
        const pagination = parsePagination(page, pageSize);
        if (category) {
            where.category = category;
        }
        const testimonials = await prisma_1.default.testimonial.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...pagination,
        });
        res.json(testimonials);
    }
    catch (error) {
        next(error);
    }
});
// POST create testimonial
router.post("/", authMiddleware_1.authMiddleware, (0, validate_1.validateBody)(schemas_1.testimonialSchema), async (req, res, next) => {
    try {
        const { author, category, quoteEn, quoteAr, quoteTr, roleEn, roleAr, roleTr, rating } = req.body;
        const newTestimonial = await prisma_1.default.testimonial.create({
            data: {
                author,
                category: category || "General",
                rating: rating !== undefined ? parseInt(rating, 10) : 5,
                quoteEn,
                quoteAr,
                quoteTr,
                roleEn,
                roleAr,
                roleTr,
            },
        });
        res.status(201).json(newTestimonial);
    }
    catch (error) {
        next(error);
    }
});
// PUT update testimonial by ID
router.put("/:id", authMiddleware_1.authMiddleware, (0, validate_1.validateBody)(schemas_1.testimonialSchema), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Invalid testimonial id" });
            return;
        }
        const { author, category, quoteEn, quoteAr, quoteTr, roleEn, roleAr, roleTr, rating } = req.body;
        const existing = await prisma_1.default.testimonial.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Testimonial not found" });
            return;
        }
        const updated = await prisma_1.default.testimonial.update({
            where: { id },
            data: {
                author,
                category,
                rating: rating !== undefined ? parseInt(rating, 10) : undefined,
                quoteEn,
                quoteAr,
                quoteTr,
                roleEn,
                roleAr,
                roleTr,
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// DELETE testimonial by ID
router.delete("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Invalid testimonial id" });
            return;
        }
        const existing = await prisma_1.default.testimonial.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Testimonial not found" });
            return;
        }
        await prisma_1.default.testimonial.delete({ where: { id } });
        res.json({ message: "Testimonial deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
