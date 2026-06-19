"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET all collections
router.get("/", async (req, res, next) => {
    try {
        const collections = await prisma_1.default.collection.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                projects: true,
            },
        });
        res.json(collections);
    }
    catch (error) {
        next(error);
    }
});
// POST create collection
router.post("/", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { nameEn, nameAr, nameTr } = req.body;
        if (!nameEn || !nameAr || !nameTr) {
            res.status(400).json({ error: "Missing name translations" });
            return;
        }
        const newCollection = await prisma_1.default.collection.create({
            data: {
                nameEn,
                nameAr,
                nameTr,
            },
        });
        res.status(201).json(newCollection);
    }
    catch (error) {
        next(error);
    }
});
// PUT update collection by ID
router.put("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const { nameEn, nameAr, nameTr } = req.body;
        const existing = await prisma_1.default.collection.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Collection not found" });
            return;
        }
        const updated = await prisma_1.default.collection.update({
            where: { id },
            data: {
                nameEn,
                nameAr,
                nameTr,
            },
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
});
// DELETE collection by ID
router.delete("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma_1.default.collection.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Collection not found" });
            return;
        }
        // Unlink any projects that belong to this collection first
        await prisma_1.default.project.updateMany({
            where: { collectionId: id },
            data: { collectionId: null },
        });
        await prisma_1.default.collection.delete({
            where: { id },
        });
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
