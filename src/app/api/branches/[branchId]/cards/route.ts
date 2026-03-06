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

    const cards = await prisma.branchCard.findMany({
      where: { branchId, projectId },
      include: { phase: true },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(cards);
  } catch (e) {
    console.error("GET /api/branches/[branchId]/cards", e);
    return NextResponse.json({ error: "Failed to load cards" }, { status: 500 });
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
    const {
      projectId,
      phaseId,
      title,
      description,
      status,
      priority,
      assignee,
      assigneeAvatar,
      dueDate,
      tags,
      estimatedHours,
    } = body;
    if (!projectId || !phaseId || !title) {
      return NextResponse.json({ error: "projectId, phaseId and title required" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.createdById !== session.userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const phase = await prisma.branchPhase.findFirst({
      where: { id: phaseId, branchId, projectId },
    });
    if (!phase) return NextResponse.json({ error: "Phase not found" }, { status: 404 });

    const now = new Date().toISOString().split("T")[0];
    const card = await prisma.branchCard.create({
      data: {
        branchId,
        phaseId,
        projectId,
        title: String(title),
        description: description ? String(description) : "",
        status: status ? String(status) : "todo",
        priority: priority ? String(priority) : "medium",
        assignee: assignee ? String(assignee) : "",
        assigneeAvatar: assigneeAvatar ? String(assigneeAvatar) : "",
        dueDate: dueDate ? String(dueDate) : now,
        tags: tags ? JSON.stringify(Array.isArray(tags) ? tags : []) : null,
        estimatedHours: typeof estimatedHours === "number" ? estimatedHours : 0,
        createdAt: now,
        updatedAt: now,
      },
    });
    return NextResponse.json(card);
  } catch (e) {
    console.error("POST /api/branches/[branchId]/cards", e);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}
