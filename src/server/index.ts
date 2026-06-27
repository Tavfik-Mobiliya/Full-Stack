import app from "./app";
import { env } from "./config/env";
import prisma from "./prisma";

async function warmup(): Promise<void> {
  try {
    await prisma.$connect();
  } catch {
    console.warn("Prisma warmup failed — will connect lazily");
  }
}

warmup().then(() => {
  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
});
