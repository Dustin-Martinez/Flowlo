import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

async function getBranchIfOwned(branchId: string, userId: string) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) return null;
  const project = await prisma.project.findUnique({ where: { id: branch.projectId } });
  if (!project || project.createdById !== userId) return null;
  return branch;
}

function mapBranch(b: {
  id: string;
  projectId: string;
  parentBoardId: string | null;
  title: string;
  description: string;
  department: string;
  color: string;
  workflowType: string;
  team: string | null;
  tags: string | null;
  lastUpdated: string;
  isFavorite: boolean;
  status: string;
}) {
  return {
    id: b.id,
    projectId: b.projectId,
    parentBoardId: b.parentBoardId ?? `board-${b.projectId}`,
    title: b.title,
    description: b.description,
    department: b.department,
    color: b.color,
    workflowType: b.workflowType,
    team: b.team ? (JSON.parse(b.team) as string[]) : [],
    tags: b.tags ? (JSON.parse(b.tags) as string[]) : [],
    lastUpdated: b.lastUpdated,
    isFavorite: b.isFavorite,
    status: b.status,
    projectName: "",
    projectColor: "",
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { branchId } = await params;
    const branch = await getBranchIfOwned(branchId, session.userId);
    if (!branch) return NextResponse.json(null, { status: 404 });

    const project = await prisma.project.findUnique({ where: { id: branch.projectId } });
    const result = mapBranch(branch);
    if (project) {
      (result as { projectName: string; projectColor: string }).projectName = project.name;
      (result as { projectName: string; projectColor: string }).projectColor = project.color;
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error("GET /api/branches/[branchId]", e);
    return NextResponse.json({ error: "Failed to load branch" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { branchId } = await params;
    const branch = await getBranchIfOwned(branchId, session.userId);
    if (!branch) return NextResponse.json(null, { status: 404 });

    const body = await request.json();
    const lastUpdated = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const updateData: Record<string, unknown> = { lastUpdated };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.department !== undefined) updateData.department = body.department;
    if (body.workflowType !== undefined) updateData.workflowType = body.workflowType;
    if (body.team !== undefined) updateData.team = body.team ? JSON.stringify(body.team) : null;
    if (body.tags !== undefined) updateData.tags = body.tags ? JSON.stringify(body.tags) : null;
    if (body.isFavorite !== undefined) updateData.isFavorite = Boolean(body.isFavorite);

    const updated = await prisma.branch.update({
      where: { id: branchId },
      data: updateData as Parameters<typeof prisma.branch.update>[0]["data"],
    });
    const project = await prisma.project.findUnique({ where: { id: updated.projectId } });
    const result = mapBranch(updated);
    if (project) {
      (result as { projectName: string; projectColor: string }).projectName = project.name;
      (result as { projectName: string; projectColor: string }).projectColor = project.color;
    }
    return NextResponse.json(result);
  } catch (e) {
    console.error("PATCH /api/branches/[branchId]", e);
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ branchId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { branchId } = await params;
    const branch = await getBranchIfOwned(branchId, session.userId);
    if (!branch) return NextResponse.json(null, { status: 404 });

    await prisma.branchCard.deleteMany({ where: { branchId } });
    await prisma.branchPhase.deleteMany({ where: { branchId } });
    await prisma.branch.delete({ where: { id: branchId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/branches/[branchId]", e);
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
  }
}
