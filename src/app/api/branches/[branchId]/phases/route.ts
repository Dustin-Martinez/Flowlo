import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { branchId } = await params;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.createdById !== session.userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const phases = await prisma.branchPhase.findMany({
      where: { branchId, projectId },
      orderBy: { sortOrder: "asc" },
      include: { cards: true },
    });
    return NextResponse.json(phases);
  } catch (e) {
    console.error("GET /api/branches/[branchId]/phases", e);
    return NextResponse.json({ error: "Failed to load phases" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { branchId } = await params;
    const body = await request.json();
    const { projectId, title, description, color, sortOrder } = body;
    if (!projectId || !title) return NextResponse.json({ error: "projectId and title required" }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.createdById !== session.userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const count = await prisma.branchPhase.count({ where: { branchId, projectId } });
    const phase = await prisma.branchPhase.create({
      data: {
        branchId,
        projectId,
        title: String(title),
        description: description ? String(description) : null,
        color: color ? String(color) : "blue",
        sortOrder: typeof sortOrder === "number" ? sortOrder : count,
      },
    });
    return NextResponse.json(phase);
  } catch (e) {
    console.error("POST /api/branches/[branchId]/phases", e);
    return NextResponse.json({ error: "Failed to create phase" }, { status: 500 });
  }
}
