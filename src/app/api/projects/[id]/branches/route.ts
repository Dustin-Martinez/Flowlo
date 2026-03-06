import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

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
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: projectId } = await params;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.createdById !== session.userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const branches = await prisma.branch.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(branches.map(mapBranch));
  } catch (e) {
    console.error("GET /api/projects/[id]/branches", e);
    return NextResponse.json({ error: "Failed to load branches" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: projectId } = await params;
    const body = await request.json();

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.createdById !== session.userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { title, description, department, workflowType, team, tags, parentBoardId } = body;
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const lastUpdated = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const branch = await prisma.branch.create({
      data: {
        projectId,
        parentBoardId: parentBoardId ?? `board-${projectId}`,
        title: String(title),
        description: description ? String(description) : "",
        department: department ? String(department) : "",
        color: project.color,
        workflowType: workflowType ? String(workflowType) : "custom",
        team: team ? JSON.stringify(Array.isArray(team) ? team : []) : null,
        tags: tags ? JSON.stringify(Array.isArray(tags) ? tags : []) : null,
        lastUpdated,
      },
    });
    return NextResponse.json(mapBranch(branch));
  } catch (e) {
    console.error("POST /api/projects/[id]/branches", e);
    const message = e instanceof Error ? e.message : "Failed to create branch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
