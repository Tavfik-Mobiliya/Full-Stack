import { Request, Response, NextFunction } from "express";

// A secure static token for session validation
export const ADMIN_SESSION_TOKEN = "aura-luxury-showroom-admin-session-token-2026";

export interface AuthenticatedRequest extends Request {
  isAdmin?: boolean;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Admin session token is missing." });
  }

  const token = authHeader.split(" ")[1];

  if (token !== ADMIN_SESSION_TOKEN) {
    return res.status(403).json({ error: "Forbidden. Invalid admin session token." });
  }

  req.isAdmin = true;
  next();
}
