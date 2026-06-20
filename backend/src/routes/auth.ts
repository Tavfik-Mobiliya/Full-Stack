import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env";
import { authMiddleware, AuthenticatedRequest } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validate";
import { authLoginSchema } from "../validation/schemas";

const router = Router();

function createAdminToken(email: string): string {
  const signOptions: jwt.SignOptions = {
    expiresIn: env.authTokenTtl as jwt.SignOptions["expiresIn"],
    issuer: "stitch-luxury-showroom",
    audience: "stitch-luxury-admin",
  };

  return jwt.sign({ role: "admin", email }, env.adminJwtSecret, {
    ...signOptions,
  });
}

function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.authCookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });
}

function clearAuthCookie(res: Response): void {
  res.clearCookie(env.authCookieName, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
  });
}

router.post("/login", validateBody(authLoginSchema), (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  if (email.toLowerCase() === env.adminEmail.toLowerCase() && password === env.adminPassword) {
    const token = createAdminToken(email);
    setAuthCookie(res, token);

    res.json({
      success: true,
      message: "Successfully authenticated as administrator."
    });
    return;
  }

  res.status(401).json({ error: "Invalid email or password." });
});

router.get("/session", authMiddleware, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ authenticated: true });
});

router.post("/logout", (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

export default router;
