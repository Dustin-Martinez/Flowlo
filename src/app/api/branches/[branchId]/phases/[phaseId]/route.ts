import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

async function getPhaseIfOwned(phaseId: string, userId: string) {
  const phase = await prisma.branchPhase.findUnique({ where: { id: phaseId } });
  if (!phase) return null;
  const project = await prisma.project.findUnique({ where: { id: phase.projectId } });
  if (!project || project.createdById !== userId) return null;
  return phase;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ branchId: string; phaseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { phaseId } = await params;
    const phase = await getPhaseIfOwned(phaseId, session.userId);
    if (!phase) return NextResponse.json(null, { status: 404 });
    const withCards = await prisma.branchPhase.findUnique({
      where: { id: phaseId },
      include: { cards: true },
    });
    return NextResponse.json(withCards);
  } catch (e) {
    console.error("GET /api/branches/.../phases/[phaseId]", e);
    return NextResponse.json({ error: "Failed to load phase" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ branchId: string; phaseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { phaseId } = await params;
    const phase = await getPhaseIfOwned(phaseId, session.userId);
    if (!phase) return NextResponse.json(null, { status: 404 });
    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);
    const updated = await prisma.branchPhase.update({
      where: { id: phaseId },
      data: updateData as Parameters<typeof prisma.branchPhase.update>[0]["data"],
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("PATCH /api/branches/.../phases/[phaseId]", e);
    return NextResponse.json({ error: "Failed to update phase" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ branchId: string; phaseId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { phaseId } = await params;
    const phase = await getPhaseIfOwned(phaseId, session.userId);
    if (!phase) return NextResponse.json(null, { status: 404 });
    await prisma.branchPhase.delete({ where: { id: phaseId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/branches/.../phases/[phaseId]", e);
    return NextResponse.json({ error: "Failed to delete phase" }, { status: 500 });
  }
}
