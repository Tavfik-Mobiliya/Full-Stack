import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import jwt from "jsonwebtoken";
import testimonialsRouter from "./testimonials";
import { env } from "../config/env";
import prisma from "../prisma";

jest.mock("../prisma", () => ({
  __esModule: true,
  default: {
    testimonial: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/testimonials", testimonialsRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { statusCode?: number }, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe("Testimonials Routes", () => {
  const adminToken = jwt.sign({ role: "admin", email: env.adminEmail }, env.adminJwtSecret);
  const adminCookie = [`${env.authCookieName}=${adminToken}`];

  const mockTestimonial = {
    id: 1,
    author: "Jane Doe",
    category: "General",
    rating: 5,
    quoteEn: "Superb designs!",
    quoteAr: "تصاميم رائعة!",
    quoteTr: "Harika tasarımlar!",
    roleEn: "Architect",
    roleAr: "مهندس معماري",
    roleTr: "Mimar",
    createdAt: new Date().toISOString(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/testimonials", () => {
    it("should return testimonials list with default parameters", async () => {
      (prisma.testimonial.findMany as jest.Mock).mockResolvedValue([mockTestimonial]);

      const response = await request(app).get("/api/testimonials");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockTestimonial]);
      expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          skip: 0,
          take: 20,
        })
      );
    });

    it("should filter by category", async () => {
      (prisma.testimonial.findMany as jest.Mock).mockResolvedValue([]);

      await request(app).get("/api/testimonials?category=Interior");

      expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: "Interior" },
        })
      );
    });
  });

  describe("POST /api/testimonials", () => {
    it("should return 401 if unauthorized", async () => {
      const response = await request(app)
        .post("/api/testimonials")
        .send(mockTestimonial);

      expect(response.status).toBe(401);
    });

    it("should create testimonial successfully with valid body and auth", async () => {
      (prisma.testimonial.create as jest.Mock).mockResolvedValue(mockTestimonial);

      const response = await request(app)
        .post("/api/testimonials")
        .set("Cookie", adminCookie)
        .send({
          author: "Jane Doe",
          quoteEn: "Superb designs!",
          quoteAr: "تصاميم رائعة!",
          quoteTr: "Harika tasarımlar!",
          roleEn: "Architect",
          roleAr: "مهندس معماري",
          roleTr: "Mimar",
          rating: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTestimonial);
      expect(prisma.testimonial.create).toHaveBeenCalledWith({
        data: {
          author: "Jane Doe",
          category: "General",
          rating: 5,
          quoteEn: "Superb designs!",
          quoteAr: "تصاميم رائعة!",
          quoteTr: "Harika tasarımlar!",
          roleEn: "Architect",
          roleAr: "مهندس معماري",
          roleTr: "Mimar",
        },
      });
    });
  });

  describe("PUT /api/testimonials/:id", () => {
    it("should return 404 if testimonial is not found", async () => {
      (prisma.testimonial.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/api/testimonials/123")
        .set("Cookie", adminCookie)
        .send({
          author: "Jane Doe",
          quoteEn: "Superb designs!",
          quoteAr: "تصاميم رائعة!",
          quoteTr: "Harika tasarımlar!",
          roleEn: "Architect",
          roleAr: "مهندس معماري",
          roleTr: "Mimar",
        });

      expect(response.status).toBe(404);
      expect(prisma.testimonial.update).not.toHaveBeenCalled();
    });

    it("should update testimonial successfully", async () => {
      (prisma.testimonial.findUnique as jest.Mock).mockResolvedValue(mockTestimonial);
      (prisma.testimonial.update as jest.Mock).mockResolvedValue({
        ...mockTestimonial,
        author: "Updated Author",
      });

      const response = await request(app)
        .put("/api/testimonials/1")
        .set("Cookie", adminCookie)
        .send({
          author: "Updated Author",
          quoteEn: "Superb designs!",
          quoteAr: "تصاميم رائعة!",
          quoteTr: "Harika tasarımlar!",
          roleEn: "Architect",
          roleAr: "مهندس معماري",
          roleTr: "Mimar",
          rating: 4,
        });

      expect(response.status).toBe(200);
      expect(response.body.author).toBe("Updated Author");
      expect(prisma.testimonial.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          author: "Updated Author",
          rating: 4,
        }),
      });
    });
  });

  describe("DELETE /api/testimonials/:id", () => {
    it("should return 404 if not found", async () => {
      (prisma.testimonial.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/testimonials/123")
        .set("Cookie", adminCookie);

      expect(response.status).toBe(404);
    });

    it("should delete testimonial successfully if found", async () => {
      (prisma.testimonial.findUnique as jest.Mock).mockResolvedValue(mockTestimonial);
      (prisma.testimonial.delete as jest.Mock).mockResolvedValue(mockTestimonial);

      const response = await request(app)
        .delete("/api/testimonials/1")
        .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Testimonial deleted successfully" });
      expect(prisma.testimonial.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
