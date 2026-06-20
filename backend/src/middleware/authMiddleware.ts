import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  isAdmin?: boolean;
}

interface AdminTokenPayload extends JwtPayload {
  role?: string;
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1] ?? null;
  }

  const cookieToken = req.cookies?.[env.authCookieName];
  if (typeof cookieToken === "string" && cookieToken.length > 0) {
    return cookieToken;
  }

  return null;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: "Unauthorized. Authentication token is missing." });
    return;
  }

  try {
    const payload = jwt.verify(token, env.adminJwtSecret) as AdminTokenPayload;

    if (payload.role !== "admin") {
      res.status(403).json({ error: "Forbidden. Admin access is required." });
      return;
    }

    req.isAdmin = true;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
  }
}
