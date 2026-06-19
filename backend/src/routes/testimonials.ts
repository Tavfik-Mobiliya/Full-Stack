import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// GET all testimonials (optional filter by category)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const where: any = {};
    if (category) {
      where.category = category as string;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(testimonials);
  } catch (error) {
    next(error);
  }
});

// POST create testimonial
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { author, category, quoteEn, quoteAr, quoteTr, roleEn, roleAr, roleTr, rating } = req.body;

    const newTestimonial = await prisma.testimonial.create({
      data: {
        author,
        category: category || "General",
        rating: rating !== undefined ? parseInt(rating as string, 10) : 5,
        quoteEn,
        quoteAr,
        quoteTr,
        roleEn,
        roleAr,
        roleTr,
      },
    });

    res.status(201).json(newTestimonial);
  } catch (error) {
    next(error);
  }
});

// PUT update testimonial by ID
router.put("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const { author, category, quoteEn, quoteAr, quoteTr, roleEn, roleAr, roleTr, rating } = req.body;

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        author,
        category,
        rating: rating !== undefined ? parseInt(rating as string, 10) : undefined,
        quoteEn,
        quoteAr,
        quoteTr,
        roleEn,
        roleAr,
        roleTr,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE testimonial by ID
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }

    await prisma.testimonial.delete({ where: { id } });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
