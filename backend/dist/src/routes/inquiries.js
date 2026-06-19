"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// GET all inquiries (for admin review)
router.get("/", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const inquiries = await prisma_1.default.inquiry.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(inquiries);
    }
    catch (error) {
        next(error);
    }
});
// POST submit a new inquiry
router.post("/", async (req, res, next) => {
    try {
        const { name, email, phone, message, type, details } = req.body;
        if (!name || !email || !message) {
            res.status(400).json({ error: "Name, email, and message are required fields" });
            return;
        }
        const newInquiry = await prisma_1.default.inquiry.create({
            data: {
                name,
                email,
                phone,
                message,
                type: type || "Contact",
                details: details || {},
            },
        });
        res.status(201).json(newInquiry);
    }
    catch (error) {
        next(error);
    }
});
// DELETE inquiry by ID
router.delete("/:id", authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma_1.default.inquiry.findUnique({ where: { id } });
        if (!existing) {
            res.status(404).json({ error: "Inquiry not found" });
            return;
        }
        await prisma_1.default.inquiry.delete({ where: { id } });
        res.json({ message: "Inquiry deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
