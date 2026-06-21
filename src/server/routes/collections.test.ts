import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import jwt from "jsonwebtoken";
import collectionsRouter from "./collections";
import { env } from "../config/env";
import prisma from "../prisma";

jest.mock("../prisma", () => ({
  __esModule: true,
  default: {
    collection: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      updateMany: jest.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/collections", collectionsRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { statusCode?: number }, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe("Collections Routes", () => {
  const adminToken = jwt.sign({ role: "admin", email: env.adminEmail }, env.adminJwtSecret);
  const userCookie = [`${env.authCookieName}=${adminToken}`];

  const mockCollection = {
    id: 1,
    nameEn: "Modern Collection",
    nameAr: "المجموعة الحديثة",
    nameTr: "Modern Koleksiyon",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    products: [],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/collections", () => {
    it("should return collections with pagination defaults", async () => {
      (prisma.collection.findMany as jest.Mock).mockResolvedValue([mockCollection]);

      const response = await request(app).get("/api/collections");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockCollection]);
      expect(prisma.collection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
          orderBy: { createdAt: "desc" },
          include: { products: true },
        })
      );
    });

    it("should parse page and pageSize query parameters", async () => {
      (prisma.collection.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get("/api/collections?page=3&pageSize=10");

      expect(response.status).toBe(200);
      expect(prisma.collection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 10,
        })
      );
    });
  });

  describe("POST /api/collections", () => {
    it("should return 401 if unauthorized", async () => {
      const response = await request(app)
        .post("/api/collections")
        .send({
          nameEn: "New",
          nameAr: "جديد",
          nameTr: "Yeni",
        });

      expect(response.status).toBe(401);
    });

    it("should create a collection successfully with valid body and auth", async () => {
      (prisma.collection.create as jest.Mock).mockResolvedValue(mockCollection);

      const response = await request(app)
        .post("/api/collections")
        .set("Cookie", userCookie)
        .send({
          nameEn: "Modern Collection",
          nameAr: "المجموعة الحديثة",
          nameTr: "Modern Koleksiyon",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCollection);
      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          nameEn: "Modern Collection",
          nameAr: "المجموعة الحديثة",
          nameTr: "Modern Koleksiyon",
        },
      });
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app)
        .post("/api/collections")
        .set("Cookie", userCookie)
        .send({
          nameEn: "", // Empty english name
          nameAr: "جديد",
          nameTr: "Yeni",
        });

      expect(response.status).toBe(400);
      expect(prisma.collection.create).not.toHaveBeenCalled();
    });
  });

  describe("PUT /api/collections/:id", () => {
    it("should return 400 for invalid collection id", async () => {
      const response = await request(app)
        .put("/api/collections/notaninteger")
        .set("Cookie", userCookie)
        .send({
          nameEn: "Modern Collection",
          nameAr: "المجموعة الحديثة",
          nameTr: "Modern Koleksiyon",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Invalid collection id");
    });

    it("should return 404 if collection is not found", async () => {
      (prisma.collection.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/api/collections/123")
        .set("Cookie", userCookie)
        .send({
          nameEn: "Modern Collection",
          nameAr: "المجموعة الحديثة",
          nameTr: "Modern Koleksiyon",
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("Collection not found");
    });

    it("should update collection if it exists", async () => {
      (prisma.collection.findUnique as jest.Mock).mockResolvedValue(mockCollection);
      (prisma.collection.update as jest.Mock).mockResolvedValue({
        ...mockCollection,
        nameEn: "Updated Modern Collection",
      });

      const response = await request(app)
        .put("/api/collections/1")
        .set("Cookie", userCookie)
        .send({
          nameEn: "Updated Modern Collection",
          nameAr: "المجموعة الحديثة",
          nameTr: "Modern Koleksiyon",
        });

      expect(response.status).toBe(200);
      expect(response.body.nameEn).toBe("Updated Modern Collection");
      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          nameEn: "Updated Modern Collection",
          nameAr: "المجموعة الحديثة",
          nameTr: "Modern Koleksiyon",
        },
      });
    });
  });

  describe("DELETE /api/collections/:id", () => {
    it("should delete collection and unlink products", async () => {
      (prisma.collection.findUnique as jest.Mock).mockResolvedValue(mockCollection);
      (prisma.product.updateMany as jest.Mock).mockResolvedValue({ count: 2 });
      (prisma.collection.delete as jest.Mock).mockResolvedValue(mockCollection);

      const response = await request(app)
        .delete("/api/collections/1")
        .set("Cookie", userCookie);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });

      expect(prisma.product.updateMany).toHaveBeenCalledWith({
        where: { collectionId: 1 },
        data: { collectionId: null },
      });
      expect(prisma.collection.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should return 404 if collection to delete is not found", async () => {
      (prisma.collection.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/collections/1")
        .set("Cookie", userCookie);

      expect(response.status).toBe(404);
      expect(prisma.collection.delete).not.toHaveBeenCalled();
    });
  });
});
