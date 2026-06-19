import { Router, Request, Response } from "express";
import { ADMIN_SESSION_TOKEN } from "../middleware/authMiddleware";

const router = Router();

// Static Admin Credentials (safe fallback)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aura.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "auraAdmin2026!";

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_SESSION_TOKEN,
      message: "Successfully authenticated as administrator."
    });
  }

  return res.status(401).json({ error: "Invalid email or password." });
});

export default router;
