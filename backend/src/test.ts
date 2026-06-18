import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.project.count();
    console.log("SUCCESS! Projects count:", count);
  } catch (error) {
    console.error("FAILURE! Connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
