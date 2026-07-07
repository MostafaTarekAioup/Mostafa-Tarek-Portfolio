import "dotenv/config";
import { scryptSync, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export function hashPassword(password: string, salt?: string): string {
  const actualSalt = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, actualSalt, 64).toString("hex");
  return `${actualSalt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const attemptHash = scryptSync(password, salt, 64).toString("hex");
  return attemptHash === hash;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function verifyAdminToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const session = await prisma.adminSession.findUnique({
      where: { token },
    });
    if (!session) return false;
    if (new Date() > session.expiresAt) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error verifying session token:", error);
    return false;
  }
}

export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  return await verifyAdminToken(token);
}

export async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;
  try {
    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session || new Date() > session.expiresAt) return null;
    const user = session.user;
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch {
    return null;
  }
}
