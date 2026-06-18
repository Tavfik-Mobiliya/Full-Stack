"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
require("dotenv/config");
const prisma = new client_1.PrismaClient();
async function test() {
    try {
        const count = await prisma.project.count();
        console.log("SUCCESS! Projects count:", count);
    }
    catch (error) {
        console.error("FAILURE! Connection error:", error);
    }
    finally {
        await prisma.$disconnect();
    }
}
test();
