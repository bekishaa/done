import dotenv from "dotenv";
//import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@/generated/prisma";
// Load environment variables from .env.local first, then fallback to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error(
      "[db:test] DATABASE_URL is not set. Add it to your .env/.env.local before running this command."
    );
    process.exitCode = 1;
    return;
  }

  console.log("[db:test] Using DATABASE_URL:", dbUrl);

  const prisma = new PrismaClient();

  try {
    console.log("[db:test] Attempting to connect with Prisma...");
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("[db:test] ✅ Prisma connection successful (SELECT 1 passed).");
  } catch (error) {
    console.error("[db:test] ❌ Prisma connection failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error("[db:test] Unexpected error:", error);
  process.exitCode = 1;
});


