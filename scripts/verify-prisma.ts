import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    await prisma.profile.findFirst();
    console.log("✅ Connected");
  } catch (error) {
    console.error("Error verifying Prisma Postgres connection:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
