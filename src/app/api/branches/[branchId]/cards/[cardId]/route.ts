import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

async function getCardIfOwned(cardId: string, userId: string) {
  const card = await prisma.branchCard.findUnique({ where: { id: cardId } });
  if (!card) return null;
  const project = await prisma.project.findUnique({ where: { id: card.projectId } });
  if (!project || project.createdById !== userId) return null;
  return card;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ branchId: string; cardId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId } = await params;
    const card = await getCardIfOwned(cardId, session.userId);
    if (!card) return NextResponse.json(null, { status: 404 });
    const withPhase = await prisma.branchCard.findUnique({
      where: { id: cardId },
      include: { phase: true },
    });
    return NextResponse.json(withPhase);
  } catch (e) {
    console.error("GET /api/branches/.../cards/[cardId]", e);
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ branchId: string; cardId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId } = await params;
    const card = await getCardIfOwned(cardId, session.userId);
    if (!card) return NextResponse.json(null, { status: 404 });
    const body = await request.json();
    const now = new Date().toISOString().split("T")[0];
    const updateData: Record<string, unknown> = { updatedAt: now };
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.assignee !== undefined) updateData.assignee = body.assignee;
    if (body.assigneeAvatar !== undefined) updateData.assigneeAvatar = body.assigneeAvatar;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate;
    if (body.phaseId !== undefined) updateData.phaseId = body.phaseId;
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? JSON.stringify(body.tags) : body.tags;
    if (body.estimatedHours !== undefined) updateData.estimatedHours = Number(body.estimatedHours);
    const updated = await prisma.branchCard.update({
      where: { id: cardId },
      data: updateData as Parameters<typeof prisma.branchCard.update>[0]["data"],
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/branches/.../cards/[cardId]", e);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ branchId: string; cardId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { cardId } = await params;
    const card = await getCardIfOwned(cardId, session.userId);
    if (!card) return NextResponse.json(null, { status: 404 });
    await prisma.branchCard.delete({ where: { id: cardId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/branches/.../cards/[cardId]", e);
    return NextResponse.json({ error: "Failed to delete card" }, { status: 500 });
  }
}
