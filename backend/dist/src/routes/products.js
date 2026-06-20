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
// GET all products (with filtering)
router.get("/", async (req, res, next) => {
    try {
        const { category, subCategory, roomType, budget, featured, search, material, style, priceMin, priceMax, page, pageSize, } = req.query;
        const where = {};
        const pagination = parsePagination(page, pageSize);
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
        const products = await prisma_1.default.product.findMany({
            where,
            orderBy: { createdAt: "desc" },
            ...pagination,
            include: {
                collection: true,
            },
        });
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
// GET single product by slug
router.get("/:slug", async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const product = await prisma_1.default.product.findUnique({
            where: { slug },
            include: {
                collection: true,
            },
        });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
// POST create product
router.post("/", authMiddleware_1.authMiddleware, (0, validate_1.validateBody)(schemas_1.productCreateSchema), async (req, res, next) => {
    try {
        const { slug, category, subCategory, roomType, year, images, specs, beforeImage, afterImage, price, budget, featured, titleEn, titleAr, titleTr, descriptionEn, descriptionAr, descriptionTr, locationEn, locationAr, locationTr, materialEn, materialAr, materialTr, styleEn, styleAr, styleTr, collectionId, } = req.body;
        // Validate slug uniqueness
        const existing = await prisma_1.default.product.findUnique({ where: { slug } });
        if (existing) {
            res.status(400).json({ error: "A product with this slug already exists" });
            return;
        }
        const newProduct = await prisma_1.default.product.create({
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
        res.status(201).json(newProduct);
    }
    catch (error) {
        next(error);
    }
});
// PUT update product by ID
router.put("/:id", authMiddleware_1.authMiddleware, (0, validate_1.validateBody)(schemas_1.productUpdateSchema), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Invalid product id" });
            return;
        }
        const { slug, category, subCategory, roomType, year, images, specs, beforeImage, afterImage, price, budget, featured, titleEn, titleAr, titleTr, descriptionEn, descriptionAr, descriptionTr, locationEn, locationAr, locationTr, materialEn, materialAr, materialTr, styleEn, styleAr, styleTr, collectionId, } = req.body;
        // Check if product exists
        const existingProduct = await prisma_1.default.product.findUnique({ where: { id } });
        if (!existingProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        // Validate slug uniqueness if updated
        if (slug && slug !== existingProduct.slug) {
            const existingSlug = await prisma_1.default.product.findUnique({ where: { slug } });
            if (existingSlug) {
                res.status(400).json({ error: "A product with this slug already exists" });
                return;
            }
        }
        const updatedProduct = await prisma_1.default.product.update({
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
        res.json(updatedProduct);
    }
    catch (error) {
        next(error);
    }
});
// DELETE product by ID
router.delete("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Invalid product id" });
            return;
        }
        const existing = await prisma_1.default.product.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        await prisma_1.default.product.delete({ where: { id } });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
