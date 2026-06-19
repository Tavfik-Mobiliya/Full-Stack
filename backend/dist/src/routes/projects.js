"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET all projects (with filtering)
router.get("/", async (req, res, next) => {
    try {
        const { category, subCategory, roomType, budget, featured, search, material, style, priceMin, priceMax, } = req.query;
        const where = {};
        if (category) {
            where.category = category;
        }
        if (subCategory) {
            where.subCategory = subCategory;
        }
        if (roomType) {
            where.roomType = roomType;
        }
        if (budget) {
            where.budget = budget;
        }
        if (featured !== undefined) {
            where.featured = featured === "true";
        }
        if (priceMin || priceMax) {
            where.price = {};
            if (priceMin)
                where.price.gte = parseFloat(priceMin);
            if (priceMax)
                where.price.lte = parseFloat(priceMax);
        }
        const andConditions = [];
        if (search) {
            const searchStr = search;
            andConditions.push({
                OR: [
                    { titleEn: { contains: searchStr, mode: "insensitive" } },
                    { titleAr: { contains: searchStr, mode: "insensitive" } },
                    { titleTr: { contains: searchStr, mode: "insensitive" } },
                    { descriptionEn: { contains: searchStr, mode: "insensitive" } },
                    { descriptionAr: { contains: searchStr, mode: "insensitive" } },
                    { descriptionTr: { contains: searchStr, mode: "insensitive" } },
                ],
            });
        }
        if (material) {
            const matStr = material;
            andConditions.push({
                OR: [
                    { materialEn: { contains: matStr, mode: "insensitive" } },
                    { materialAr: { contains: matStr, mode: "insensitive" } },
                    { materialTr: { contains: matStr, mode: "insensitive" } },
                ],
            });
        }
        if (style) {
            const styleStr = style;
            andConditions.push({
                OR: [
                    { styleEn: { contains: styleStr, mode: "insensitive" } },
                    { styleAr: { contains: styleStr, mode: "insensitive" } },
                    { styleTr: { contains: styleStr, mode: "insensitive" } },
                ],
            });
        }
        if (andConditions.length > 0) {
            where.AND = andConditions;
        }
        const projects = await prisma_1.default.project.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                collection: true,
            },
        });
        res.json(projects);
    }
    catch (error) {
        next(error);
    }
});
// GET single project by slug
router.get("/:slug", async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const project = await prisma_1.default.project.findUnique({
            where: { slug },
            include: {
                collection: true,
            },
        });
        if (!project) {
            res.status(404).json({ error: "Project not found" });
            return;
        }
        res.json(project);
    }
    catch (error) {
        next(error);
    }
});
// POST create project
router.post("/", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { slug, category, subCategory, roomType, year, images, specs, beforeImage, afterImage, price, budget, featured, titleEn, titleAr, titleTr, descriptionEn, descriptionAr, descriptionTr, locationEn, locationAr, locationTr, materialEn, materialAr, materialTr, styleEn, styleAr, styleTr, collectionId, } = req.body;
        // Validate slug uniqueness
        const existing = await prisma_1.default.project.findUnique({ where: { slug } });
        if (existing) {
            res.status(400).json({ error: "A project with this slug already exists" });
            return;
        }
        const newProject = await prisma_1.default.project.create({
            data: {
                slug,
                category,
                subCategory,
                roomType,
                year: parseInt(year),
                images: images || [],
                specs: specs || {},
                beforeImage,
                afterImage,
                price: price ? parseFloat(price) : null,
                budget,
                featured: featured === true || featured === "true",
                titleEn,
                titleAr,
                titleTr,
                descriptionEn,
                descriptionAr,
                descriptionTr,
                locationEn,
                locationAr,
                locationTr,
                materialEn,
                materialAr,
                materialTr,
                styleEn,
                styleAr,
                styleTr,
                collectionId: collectionId ? parseInt(collectionId.toString(), 10) : null,
            },
        });
        res.status(201).json(newProject);
    }
    catch (error) {
        next(error);
    }
});
// PUT update project by ID
router.put("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { slug, category, subCategory, roomType, year, images, specs, beforeImage, afterImage, price, budget, featured, titleEn, titleAr, titleTr, descriptionEn, descriptionAr, descriptionTr, locationEn, locationAr, locationTr, materialEn, materialAr, materialTr, styleEn, styleAr, styleTr, collectionId, } = req.body;
        // Check if project exists
        const existingProject = await prisma_1.default.project.findUnique({ where: { id } });
        if (!existingProject) {
            res.status(404).json({ error: "Project not found" });
            return;
        }
        // Validate slug uniqueness if updated
        if (slug && slug !== existingProject.slug) {
            const existingSlug = await prisma_1.default.project.findUnique({ where: { slug } });
            if (existingSlug) {
                res.status(400).json({ error: "A project with this slug already exists" });
                return;
            }
        }
        const updatedProject = await prisma_1.default.project.update({
            where: { id },
            data: {
                slug,
                category,
                subCategory,
                roomType,
                year: year ? parseInt(year) : undefined,
                images,
                specs,
                beforeImage,
                afterImage,
                price: price !== undefined ? (price ? parseFloat(price) : null) : undefined,
                budget,
                featured: featured !== undefined ? (featured === true || featured === "true") : undefined,
                titleEn,
                titleAr,
                titleTr,
                descriptionEn,
                descriptionAr,
                descriptionTr,
                locationEn,
                locationAr,
                locationTr,
                materialEn,
                materialAr,
                materialTr,
                styleEn,
                styleAr,
                styleTr,
                collectionId: collectionId !== undefined ? (collectionId ? parseInt(collectionId.toString(), 10) : null) : undefined,
            },
        });
        res.json(updatedProject);
    }
    catch (error) {
        next(error);
    }
});
// DELETE project by ID
router.delete("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma_1.default.project.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Project not found" });
            return;
        }
        await prisma_1.default.project.delete({ where: { id } });
        res.json({ message: "Project deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
