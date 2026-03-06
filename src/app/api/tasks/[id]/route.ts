import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

async function getTaskIfProjectOwned(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { project: true } });
  if (!task || !task.project || task.project.createdById !== userId) return null;
  return task;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const task = await getTaskIfProjectOwned(id, session.userId);
    if (!task) return NextResponse.json(null, { status: 404 });
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/tasks/[id]", e);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
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
    const owned = await getTaskIfProjectOwned(id, session.userId);
    if (!owned) return NextResponse.json(null, { status: 404 });
    const body = await request.json();
    const now = new Date().toISOString().split("T")[0];

    const updateData: Record<string, unknown> = { updatedAt: now };
    if (body.status !== undefined) {
      updateData.status = body.status;
      if (body.status === "Done") updateData.completedAt = now;
    }
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate;
    if (body.actualHours !== undefined) updateData.actualHours = Number(body.actualHours);
    if (body.estimatedHours !== undefined) updateData.estimatedHours = Number(body.estimatedHours);
    if (body.subtasks !== undefined) updateData.subtasks = JSON.stringify(body.subtasks);

    const task = await prisma.task.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.task.update>[0]["data"],
    });

    return NextResponse.json({
      id: task.id,
      projectId: task.projectId,
      projectName: task.projectName,
      projectColor: task.projectColor,
      name: task.name,
      description: task.description,
      assignee: task.assignee,
      assigneeAvatar: task.assigneeAvatar,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate ?? "",
      endDate: task.endDate ?? "",
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      tags: task.tags ? JSON.parse(task.tags) : [],
      attachments: task.attachments,
      comments: task.comments,
      subtasks: task.subtasks ? JSON.parse(task.subtasks) : undefined,
      completedAt: task.completedAt ?? undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (e) {
    console.error("PATCH /api/tasks/[id]", e);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
