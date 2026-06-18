"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const router = (0, express_1.Router)();
// GET all testimonials (optional filter by category)
router.get("/", async (req, res, next) => {
    try {
        const { category } = req.query;
        const where = {};
        if (category) {
            where.category = category;
        }
        const testimonials = await prisma_1.default.testimonial.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        res.json(testimonials);
    }
    catch (error) {
        next(error);
    }
});
// POST create testimonial
router.post("/", async (req, res, next) => {
    try {
        const { author, category, quoteEn, quoteAr, quoteTr, roleEn, roleAr, roleTr } = req.body;
        const newTestimonial = await prisma_1.default.testimonial.create({
            data: {
                author,
                category: category || "General",
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
router.put("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { author, category, quoteEn, quoteAr, quoteTr, roleEn, roleAr, roleTr } = req.body;
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
router.delete("/:id", async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
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
