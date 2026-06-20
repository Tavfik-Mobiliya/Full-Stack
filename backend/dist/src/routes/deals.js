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
    return { skip: (safePage - 1) * safePageSize, take: safePageSize };
}
// GET all deals
router.get("/", async (req, res, next) => {
    try {
        const { featured } = req.query;
        const pagination = parsePagination(req.query.page, req.query.pageSize);
        const where = {};
        if (featured === "true")
            where.featured = true;
        const [deals, total] = await Promise.all([
            prisma_1.default.deal.findMany({
                where,
                orderBy: { createdAt: "desc" },
                ...pagination,
                include: {
                    products: {
                        include: {
                            product: true,
                        },
                    },
                },
            }),
            prisma_1.default.deal.count({ where }),
        ]);
        res.json({ data: deals, total, page: pagination.skip / pagination.take + 1, pageSize: pagination.take });
    }
    catch (error) {
        next(error);
    }
});
// GET single deal by slug
router.get("/:slug", async (req, res, next) => {
    try {
        const deal = await prisma_1.default.deal.findUnique({
            where: { slug: String(req.params.slug) },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!deal) {
            res.status(404).json({ error: "Deal not found" });
            return;
        }
        res.json(deal);
    }
    catch (error) {
        next(error);
    }
});
// POST create deal
router.post("/", authMiddleware_1.authMiddleware, (0, validate_1.validateBody)(schemas_1.dealSchema), async (req, res, next) => {
    try {
        const { productIds, ...data } = req.body;
        const deal = await prisma_1.default.deal.create({
            data: {
                ...data,
                products: productIds?.length
                    ? { create: productIds.map((productId) => ({ productId })) }
                    : undefined,
            },
            include: {
                products: {
                    include: { product: true },
                },
            },
        });
        res.status(201).json(deal);
    }
    catch (error) {
        next(error);
    }
});
// PUT update deal
router.put("/:id", authMiddleware_1.authMiddleware, (0, validate_1.validateBody)(schemas_1.dealSchema), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Invalid deal id" });
            return;
        }
        const existing = await prisma_1.default.deal.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Deal not found" });
            return;
        }
        const { productIds, ...data } = req.body;
        if (productIds) {
            await prisma_1.default.dealProduct.deleteMany({ where: { dealId: id } });
            if (productIds.length > 0) {
                await prisma_1.default.dealProduct.createMany({
                    data: productIds.map((productId) => ({ dealId: id, productId })),
                });
            }
        }
        const updated = await prisma_1.default.deal.update({
            where: { id },
            data,
            include: {
                products: {
                    include: { product: true },
                },
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// DELETE deal
router.delete("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({ error: "Invalid deal id" });
            return;
        }
        const existing = await prisma_1.default.deal.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Deal not found" });
            return;
        }
        await prisma_1.default.deal.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
