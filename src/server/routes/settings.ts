import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// GET /api/settings
router.get("/", async (req, res, next) => {
  try {
    const settings = await prisma.companySettings.findFirst();
    res.json(settings || {});
  } catch (error) {
    next(error);
  }
});

export default router;
