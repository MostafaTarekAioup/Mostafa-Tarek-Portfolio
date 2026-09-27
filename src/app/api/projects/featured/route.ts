import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get pinned projects sorted by pinOrder
    const pinnedProjects = await prisma.project.findMany({
      where: { isPinned: true },
      orderBy: { pinOrder: "asc" },
      take: 3,
    });

    // Get latest non-pinned project
    const pinnedIds = pinnedProjects.map((p) => p.id);
    const latestProject = await prisma.project.findFirst({
      where: { id: { notIn: pinnedIds.length > 0 ? pinnedIds : [-1] } },
      orderBy: { id: "desc" },
    });

    // Combine: pinned first, then latest (if exists and not already pinned)
    const featured = [...pinnedProjects];
    if (latestProject && !pinnedIds.includes(latestProject.id)) {
      featured.push(latestProject);
    }

    return NextResponse.json(featured);
  } catch {
    return NextResponse.json({ error: "Failed to fetch featured projects" }, { status: 500 });
  }
}
