import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

async function getProjectIfOwned(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.createdById !== userId) return null;
  return project;
}

function mapProject(p: {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  tasks: number;
  members: number;
  lastUpdated: string;
  status: string | null;
  deadline: string | null;
  tags: string | null;
  team: string | null;
}) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    progress: p.progress,
    color: p.color,
    tasks: p.tasks,
    members: p.members,
    lastUpdated: p.lastUpdated,
    status: p.status ?? "active",
    deadline: p.deadline ?? undefined,
    tags: p.tags ? (JSON.parse(p.tags) as string[]) : undefined,
    team: p.team ? (JSON.parse(p.team) as Array<{ id: string; name: string; role: string; avatar: string }>) : undefined,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const project = await getProjectIfOwned(id, session.userId);
    if (!project) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(mapProject(project));
  } catch (e) {
    console.error("GET /api/projects/[id]", e);
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const owned = await getProjectIfOwned(id, session.userId);
    if (!owned) return NextResponse.json(null, { status: 404 });
    const body = await request.json();
    const lastUpdated = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const updateData: Record<string, unknown> = { lastUpdated };
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.progress !== undefined) updateData.progress = Number(body.progress);
    if (body.color !== undefined) updateData.color = body.color;
    if (body.tasks !== undefined) updateData.tasks = Number(body.tasks);
    if (body.members !== undefined) updateData.members = Number(body.members);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.deadline !== undefined) updateData.deadline = body.deadline ? String(body.deadline) : null;
    if (body.tags !== undefined) updateData.tags = body.tags ? JSON.stringify(body.tags) : null;
    if (body.team !== undefined) updateData.team = body.team ? JSON.stringify(body.team) : null;

    const updated = await prisma.project.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.project.update>[0]["data"],
    });
    return NextResponse.json(mapProject(updated));
  } catch (e) {
    console.error("PATCH /api/projects/[id]", e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const project = await getProjectIfOwned(id, session.userId);
    if (!project) return NextResponse.json(null, { status: 404 });
    await prisma.task.deleteMany({ where: { projectId: id } });
    await prisma.branchCard.deleteMany({ where: { projectId: id } });
    await prisma.branchPhase.deleteMany({ where: { projectId: id } });
    await prisma.branch.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/projects/[id]", e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
