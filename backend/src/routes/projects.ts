import { Router, Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// GET all projects (with filtering)
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
    } = req.query;

    const where: any = {};

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

    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = parseFloat(priceMin as string);
      if (priceMax) where.price.lte = parseFloat(priceMax as string);
    }

    const andConditions: any[] = [];

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

    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        collection: true,
      },
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// GET single project by slug
router.get("/:slug", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = req.params.slug as string;
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        collection: true,
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// POST create project
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      res.status(400).json({ error: "A project with this slug already exists" });
      return;
    }

    const newProject = await prisma.project.create({
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

    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
});

// PUT update project by ID
router.put("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    // Validate slug uniqueness if updated
    if (slug && slug !== existingProject.slug) {
      const existingSlug = await prisma.project.findUnique({ where: { slug } });
      if (existingSlug) {
        res.status(400).json({ error: "A project with this slug already exists" });
        return;
      }
    }

    const updatedProject = await prisma.project.update({
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

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
});

// DELETE project by ID
router.delete("/:id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    await prisma.project.delete({ where: { id } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
