import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { collectionSchema } from "../validation/schemas";

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

// GET all collections
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, pageSize } = req.query;
    const pagination = parsePagination(page, pageSize);
    const collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      ...pagination,
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
router.post("/", authMiddleware, validateBody(collectionSchema), async (req: Request, res: Response, next: NextFunction) => {
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
router.put("/:id", authMiddleware, validateBody(collectionSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid collection id" });
      return;
    }
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
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid collection id" });
      return;
    }

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
