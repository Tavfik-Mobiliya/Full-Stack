import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { dealSchema } from "../validation/schemas";

const router = Router();

function parsePagination(pageRaw: unknown, pageSizeRaw: unknown): { skip: number; take: number } {
  const page = Number(pageRaw ?? 1);
  const pageSize = Number(pageSizeRaw ?? 20);
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? Math.min(Math.floor(pageSize), 50) : 20;
  return { skip: (safePage - 1) * safePageSize, take: safePageSize };
}

// GET all deals
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { featured } = req.query;
    const pagination = parsePagination(req.query.page, req.query.pageSize);
    const where: Record<string, unknown> = {};
    if (featured === "true") where.featured = true;

    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
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
      prisma.deal.count({ where }),
    ]);

    res.json({ data: deals, total, page: pagination.skip / pagination.take + 1, pageSize: pagination.take });
  } catch (error) {
    next(error);
  }
});

// GET single deal by slug
router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deal = await prisma.deal.findUnique({
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
  } catch (error) {
    next(error);
  }
});

// POST create deal
router.post("/", authMiddleware, validateBody(dealSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productIds, ...data } = req.body;
    const deal = await prisma.deal.create({
      data: {
        ...data,
        products: productIds?.length
          ? { create: productIds.map((productId: number) => ({ productId })) }
          : undefined,
      },
      include: {
        products: {
          include: { product: true },
        },
      },
    });
    res.status(201).json(deal);
  } catch (error) {
    next(error);
  }
});

// PUT update deal
router.put("/:id", authMiddleware, validateBody(dealSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid deal id" });
      return;
    }

    const existing = await prisma.deal.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }

    const { productIds, ...data } = req.body;

    if (productIds) {
      await prisma.dealProduct.deleteMany({ where: { dealId: id } });
      if (productIds.length > 0) {
        await prisma.dealProduct.createMany({
          data: productIds.map((productId: number) => ({ dealId: id, productId })),
        });
      }
    }

    const updated = await prisma.deal.update({
      where: { id },
      data,
      include: {
        products: {
          include: { product: true },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE deal
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid deal id" });
      return;
    }

    const existing = await prisma.deal.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }

    await prisma.deal.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
