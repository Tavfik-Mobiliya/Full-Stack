import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";

const router = Router();

// GET all inquiries (for admin review)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

// POST submit a new inquiry
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
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
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);

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
