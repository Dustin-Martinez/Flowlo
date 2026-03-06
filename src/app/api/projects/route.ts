import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

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

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const projects = await prisma.project.findMany({
      where: { createdById: session.userId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(projects.map(mapProject));
  } catch (e) {
    console.error("GET /api/projects", e);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const {
      name,
      description = "",
      progress = 0,
      color = "from-gray-500 to-gray-600",
      tasks = 0,
      members = 0,
      status = "active",
      deadline,
      tags,
      team,
    } = body;

    const lastUpdated = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const project = await prisma.project.create({
      data: {
        name: name || "New Project",
        description: String(description),
        progress: Number(progress),
        color: String(color),
        tasks: Number(tasks),
        members: Number(members),
        lastUpdated,
        status: String(status),
        deadline: deadline ? String(deadline) : null,
        tags: tags ? JSON.stringify(Array.isArray(tags) ? tags : []) : null,
        team: team ? JSON.stringify(Array.isArray(team) ? team : []) : null,
        createdById: session.userId,
      },
    });

    return NextResponse.json(mapProject(project));
  } catch (e) {
    console.error("POST /api/projects", e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
