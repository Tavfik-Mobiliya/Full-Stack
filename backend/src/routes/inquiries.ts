import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { inquirySchema } from "../validation/schemas";

const router = Router();

function parsePagination(pageRaw: unknown, pageSizeRaw: unknown): { skip: number; take: number } {
  const page = Number(pageRaw ?? 1);
  const pageSize = Number(pageSizeRaw ?? 20);

  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(Math.floor(pageSize), 50) : 20;

  return {
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  };
}

// GET all inquiries (for admin review)
router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize } = req.query;
    const pagination = parsePagination(page, pageSize);
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      ...pagination,
    });

    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

// POST submit a new inquiry
router.post("/", validateBody(inquirySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, message, type, details } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required fields" });
      return;
    }

    const newInquiry = await prisma.inquiry.create({
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
  } catch (error) {
    next(error);
  }
});

// DELETE inquiry by ID
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid inquiry id" });
      return;
    }

    const existing = await prisma.inquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Inquiry not found" });
      return;
    }

    await prisma.inquiry.delete({ where: { id } });
    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
