import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getAdapter() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  try {
    // Parse mysql://user:password@host:port/database
    const u = new URL(url.replace(/^mysql:\/\//, "http://"));
    const port = u.port ? parseInt(u.port, 10) : 3306;
    const database = u.pathname ? u.pathname.slice(1) : "flowlo";
    return new PrismaMariaDb({
      host: u.hostname || "localhost",
      port: port || 3306,
      user: u.username || "root",
      password: u.password || "",
      database: database || "flowlo",
    });
  } catch {
    return undefined;
  }
}

const adapter = getAdapter();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    adapter
      ? { adapter, log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"] }
      : {
          datasourceUrl: process.env.DATABASE_URL ?? "",
          log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        } as import("@prisma/client").Prisma.PrismaClientOptions
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
