import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminRequest } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }
  try {
    const body = await request.json();
    let id = body.id ? Number(body.id) : undefined;
    if (!id) {
      const lastProject = await prisma.project.findFirst({ orderBy: { id: "desc" } });
      id = (lastProject?.id || 0) + 1;
    }
    const project = await prisma.project.create({
      data: {
        id,
        title: body.title,
        imgUrl: body.imgUrl || (Array.isArray(body.images) && body.images[0]) || "https://i.ibb.co/CPrHNtZ/b1.webp",
        liveLink: body.liveLink || "#",
        tags: typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags || ["react"]),
        tools: typeof body.tools === "string" ? body.tools : JSON.stringify(body.tools || []),
        description: body.description || "",
        images: typeof body.images === "string" ? body.images : JSON.stringify(body.images || [body.imgUrl || "https://i.ibb.co/CPrHNtZ/b1.webp"]),
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        ...data,
        tags: data.tags ? (typeof data.tags === "string" ? data.tags : JSON.stringify(data.tags)) : undefined,
        tools: data.tools ? (typeof data.tools === "string" ? data.tools : JSON.stringify(data.tools)) : undefined,
        description: data.description !== undefined ? data.description : undefined,
        images: data.images ? (typeof data.images === "string" ? data.images : JSON.stringify(data.images)) : undefined,
      },
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await prisma.project.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
