import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const edu = await prisma.education.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(edu);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const edu = await prisma.education.create({
      data: {
        title: body.title,
        institution: body.institution,
        period: body.period || "",
        description: body.description || "",
        courses: typeof body.courses === "string" ? body.courses : JSON.stringify(body.courses || []),
        certificateUrl: body.certificateUrl || null,
      },
    });
    return NextResponse.json(edu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    const edu = await prisma.education.update({
      where: { id: Number(id) },
      data: {
        ...data,
        courses: data.courses ? (typeof data.courses === "string" ? data.courses : JSON.stringify(data.courses)) : undefined,
      },
    });
    return NextResponse.json(edu);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    await prisma.education.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
