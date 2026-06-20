import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import jwt from "jsonwebtoken";
import inquiriesRouter from "./inquiries";
import { env } from "../config/env";
import prisma from "../prisma";

jest.mock("../prisma", () => ({
  __esModule: true,
  default: {
    inquiry: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/inquiries", inquiriesRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe("Inquiries Routes", () => {
  const adminToken = jwt.sign({ role: "admin", email: env.adminEmail }, env.adminJwtSecret);
  const adminCookie = [`${env.authCookieName}=${adminToken}`];

  const mockInquiry = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+90 555 123 4567",
    message: "Interested in your custom kitchen designs.",
    type: "Contact",
    details: {},
    createdAt: new Date().toISOString(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/inquiries", () => {
    it("should return 401 if unauthorized", async () => {
      const response = await request(app).get("/api/inquiries");
      expect(response.status).toBe(401);
    });

    it("should return inquiries list for admin", async () => {
      (prisma.inquiry.findMany as jest.Mock).mockResolvedValue([mockInquiry]);

      const response = await request(app)
        .get("/api/inquiries")
        .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockInquiry]);
      expect(prisma.inquiry.findMany).toHaveBeenCalled();
    });
  });

  describe("POST /api/inquiries", () => {
    it("should submit a new inquiry successfully", async () => {
      (prisma.inquiry.create as jest.Mock).mockResolvedValue(mockInquiry);

      const response = await request(app)
        .post("/api/inquiries")
        .send({
          name: "John Doe",
          email: "john@example.com",
          phone: "+90 555 123 4567",
          message: "Interested in your custom kitchen designs.",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockInquiry);
      expect(prisma.inquiry.create).toHaveBeenCalledWith({
        data: {
          name: "John Doe",
          email: "john@example.com",
          phone: "+90 555 123 4567",
          message: "Interested in your custom kitchen designs.",
          type: "Contact",
          details: {},
        },
      });
    });

    it("should fail validation if email is invalid", async () => {
      const response = await request(app)
        .post("/api/inquiries")
        .send({
          name: "John Doe",
          email: "invalid-email",
          message: "A message",
        });

      expect(response.status).toBe(400);
      expect(prisma.inquiry.create).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/inquiries/:id", () => {
    it("should return 401 if unauthorized", async () => {
      const response = await request(app).delete("/api/inquiries/1");
      expect(response.status).toBe(401);
    });

    it("should return 404 if inquiry is not found", async () => {
      (prisma.inquiry.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/inquiries/123")
        .set("Cookie", adminCookie);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("Inquiry not found");
      expect(prisma.inquiry.delete).not.toHaveBeenCalled();
    });

    it("should delete inquiry successfully if found", async () => {
      (prisma.inquiry.findUnique as jest.Mock).mockResolvedValue(mockInquiry);
      (prisma.inquiry.delete as jest.Mock).mockResolvedValue(mockInquiry);

      const response = await request(app)
        .delete("/api/inquiries/1")
        .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Inquiry deleted successfully" });
      expect(prisma.inquiry.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
