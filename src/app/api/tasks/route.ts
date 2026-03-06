import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

function mapTask(t: {
  id: string;
  projectId: string;
  projectName: string;
  projectColor: string;
  name: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  status: string;
  priority: string;
  startDate: string | null;
  endDate: string | null;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string | null;
  attachments: number;
  comments: number;
  subtasks: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}) {
  return {
    id: t.id,
    projectId: t.projectId,
    projectName: t.projectName,
    projectColor: t.projectColor,
    name: t.name,
    description: t.description,
    assignee: t.assignee,
    assigneeAvatar: t.assigneeAvatar,
    status: t.status,
    priority: t.priority,
    startDate: t.startDate ?? "",
    endDate: t.endDate ?? "",
    dueDate: t.dueDate,
    estimatedHours: t.estimatedHours,
    actualHours: t.actualHours,
    tags: t.tags ? (JSON.parse(t.tags) as string[]) : [],
    attachments: t.attachments,
    comments: t.comments,
    subtasks: t.subtasks ? (JSON.parse(t.subtasks) as Array<{ id: string; name: string; completed: boolean }>) : undefined,
    completedAt: t.completedAt ?? undefined,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const assignee = searchParams.get("assignee");
    const projectId = searchParams.get("projectId");

    const where: {
      project: { createdById: string };
      projectId?: string;
      assignee?: { contains: string };
    } = { project: { createdById: session.userId } };
    if (projectId) where.projectId = projectId;
    if (assignee) where.assignee = { contains: assignee };

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(tasks.map(mapTask));
  } catch (e) {
    console.error("GET /api/tasks", e);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    if (!body.projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
    const project = await prisma.project.findUnique({ where: { id: body.projectId } });
    if (!project || project.createdById !== session.userId)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const now = new Date().toISOString().split("T")[0];
    const task = await prisma.task.create({
      data: {
        projectId: body.projectId,
        projectName: body.projectName || "",
        projectColor: body.projectColor || "",
        name: body.name || "Untitled",
        description: body.description || "",
        assignee: body.assignee || "Unassigned",
        assigneeAvatar: body.assigneeAvatar || "U",
        status: body.status || "Not started",
        priority: body.priority || "Medium",
        startDate: body.startDate || null,
        endDate: body.endDate || null,
        dueDate: body.dueDate || now,
        estimatedHours: body.estimatedHours ?? 0,
        actualHours: body.actualHours ?? 0,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        attachments: body.attachments ?? 0,
        comments: body.comments ?? 0,
        subtasks: body.subtasks ? JSON.stringify(body.subtasks) : null,
        completedAt: body.completedAt || null,
        createdAt: now,
        updatedAt: now,
      },
    });
    return NextResponse.json(mapTask(task));
  } catch (e) {
    console.error("POST /api/tasks", e);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
