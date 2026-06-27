import { Router, Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { productCreateSchema, productUpdateSchema } from "../validation/schemas";

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

// GET all products (with filtering)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      subCategory,
      roomType,
      budget,
      featured,
      search,
      material,
      style,
      priceMin,
      priceMax,
      page,
      pageSize,
    } = req.query;

    const where: Prisma.ProductWhereInput = {};
    const pagination = parsePagination(page, pageSize);

    if (category) {
      where.category = category as string;
    }
    if (subCategory) {
      where.subCategory = subCategory as string;
    }
    if (roomType) {
      where.roomType = roomType as string;
    }
    if (budget) {
      where.budget = budget as string;
    }
    if (featured !== undefined) {
      where.featured = featured === "true";
    }
    if (req.query.collectionId === "not-null") {
      where.collectionId = { not: null };
    } else if (req.query.collectionId) {
      where.collectionId = parseInt(req.query.collectionId as string, 10);
    }

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin as string);
      if (priceMax) where.price.lte = parseFloat(priceMax as string);
    }

    const andConditions: Prisma.ProductWhereInput[] = [];

    if (search) {
      const searchStr = search as string;
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
      const matStr = material as string;
      andConditions.push({
        OR: [
          { materialEn: { contains: matStr, mode: "insensitive" } },
          { materialAr: { contains: matStr, mode: "insensitive" } },
          { materialTr: { contains: matStr, mode: "insensitive" } },
        ],
      });
    }

    if (style) {
      const styleStr = style as string;
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

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...pagination,
      include: {
        collection: true,
      },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET single product by slug
router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
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
  } catch (error) {
    next(error);
  }
});

// POST create product
router.post("/", authMiddleware, validateBody(productCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      slug,
      category,
      subCategory,
      roomType,
      year,
      images,
      specs,
      beforeImage,
      afterImage,
      price,
      budget,
      featured,
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
      collectionId,
    } = req.body;

    // Validate slug uniqueness
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      res.status(400).json({ error: "A product with this slug already exists" });
      return;
    }

    const newProduct = await prisma.product.create({
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
  } catch (error) {
    next(error);
  }
});

// PUT update product by ID
router.put("/:id", authMiddleware, validateBody(productUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }
    const {
      slug,
      category,
      subCategory,
      roomType,
      year,
      images,
      specs,
      beforeImage,
      afterImage,
      price,
      budget,
      featured,
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
      collectionId,
    } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Validate slug uniqueness if updated
    if (slug && slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({ where: { slug } });
      if (existingSlug) {
        res.status(400).json({ error: "A product with this slug already exists" });
        return;
      }
    }

    const updatedProduct = await prisma.product.update({
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
  } catch (error) {
    next(error);
  }
});

// DELETE product by ID
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: "Invalid product id" });
      return;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Delete related DealProduct entries to satisfy foreign key constraint
    await prisma.dealProduct.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
