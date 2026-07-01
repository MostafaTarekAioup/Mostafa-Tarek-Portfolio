import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
  return NextResponse.json({ valid: true, user });
}

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;

    const dbUser = await prisma.adminUser.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (currentPassword && !verifyPassword(currentPassword, dbUser.passwordHash)) {
      return NextResponse.json({ success: false, error: "Incorrect current password" }, { status: 400 });
    }

    const updateData: Record<string, string> = {};
    if (username && username !== dbUser.username) {
      const existingName = await prisma.adminUser.findUnique({ where: { username } });
      if (existingName) {
        return NextResponse.json({ success: false, error: "Username already taken" }, { status: 400 });
      }
      updateData.username = username;
    }

    if (email && email !== dbUser.email) {
      const existingEmail = await prisma.adminUser.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ success: false, error: "Email already taken" }, { status: 400 });
      }
      updateData.email = email;
    }

    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: "Current password required to set new password" }, { status: 400 });
      }
      updateData.passwordHash = hashPassword(newPassword.trim());
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email },
    });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json({ success: false, error: "Failed to update account credentials" }, { status: 500 });
  }
}
