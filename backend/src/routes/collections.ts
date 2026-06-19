import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// GET all collections
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        projects: true,
      },
    });
    res.json(collections);
  } catch (error) {
    next(error);
  }
});

// POST create collection
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nameEn, nameAr, nameTr } = req.body;

    if (!nameEn || !nameAr || !nameTr) {
      res.status(400).json({ error: "Missing name translations" });
      return;
    }

    const newCollection = await prisma.collection.create({
      data: {
        nameEn,
        nameAr,
        nameTr,
      },
    });

    res.status(201).json(newCollection);
  } catch (error) {
    next(error);
  }
});

// PUT update collection by ID
router.put("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
    const { nameEn, nameAr, nameTr } = req.body;

    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        nameEn,
        nameAr,
        nameTr,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE collection by ID
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Collection not found" });
      return;
    }

    // Unlink any projects that belong to this collection first
    await prisma.project.updateMany({
      where: { collectionId: id },
      data: { collectionId: null },
    });

    await prisma.collection.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
