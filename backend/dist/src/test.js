"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
const prisma = new client_1.PrismaClient();
async function test() {
    try {
        const projects = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                slug: true,
                titleEn: true,
                category: true,
                createdAt: true,
            }
        });
        console.log("SUCCESS! Last 5 projects in DB:", JSON.stringify(projects, null, 2));
    }
    catch (error) {
        console.error("FAILURE!", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
test();
