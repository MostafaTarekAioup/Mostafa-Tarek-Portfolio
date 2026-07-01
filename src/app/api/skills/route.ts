import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { proficiency: "desc" } });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const skill = await prisma.skill.create({
      data: {
        title: body.title,
        iconName: body.iconName || "Code",
        acquiredDate: body.acquiredDate || new Date().toLocaleDateString("en-US", { month: "numeric", year: "numeric" }),
        sources: typeof body.sources === "string" ? body.sources : JSON.stringify(body.sources || ["Self-Taught"]),
        category: body.category || "Frontend",
        proficiency: Number(body.proficiency || 80),
      },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const skill = await prisma.skill.update({
      where: { id: Number(id) },
      data: {
        ...data,
        sources: data.sources !== undefined ? (typeof data.sources === "string" ? data.sources : JSON.stringify(data.sources)) : undefined,
        proficiency: data.proficiency !== undefined ? Number(data.proficiency) : undefined,
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await prisma.skill.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
