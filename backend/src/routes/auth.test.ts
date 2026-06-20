import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import jwt from "jsonwebtoken";
import authRouter from "./auth";
import { env } from "../config/env";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);

// Global Error Handler to avoid raw stack trace logs during test runs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe("Auth Routes", () => {
  describe("POST /api/auth/login", () => {
    it("should login successfully with valid admin credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: env.adminEmail,
          password: env.adminPassword,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Successfully authenticated as administrator.",
      });

      // Verify that the cookie is set in headers
      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain(env.authCookieName);
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: env.adminEmail,
          password: "wrongpassword",
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: "Invalid email or password.",
      });
    });

    it("should return 400 if validation fails (e.g. invalid email)", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "notanemail",
          password: "password",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Validation error");
    });
  });

  describe("GET /api/auth/session", () => {
    it("should return 200 with authenticated: true if a valid admin token cookie is provided", async () => {
      const token = jwt.sign({ role: "admin", email: env.adminEmail }, env.adminJwtSecret);
      
      const response = await request(app)
        .get("/api/auth/session")
        .set("Cookie", [`${env.authCookieName}=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ authenticated: true });
    });

    it("should return 401 if token is missing", async () => {
      const response = await request(app).get("/api/auth/session");

      expect(response.status).toBe(401);
      expect(response.body.error).toContain("Authentication token is missing");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should clear the auth cookie and return success", async () => {
      const response = await request(app).post("/api/auth/logout");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain(`${env.authCookieName}=;`);
      expect(cookies[0]).toContain("Expires=");
    });
  });
});
