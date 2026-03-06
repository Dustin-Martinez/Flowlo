import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/db";
import { getSession } from "@/src/app/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const projects = await prisma.project.findMany({
      where: { createdById: session.userId },
    });
    const total = projects.length;
    const active = projects.filter((p) => p.status === "active").length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const taskCount = await prisma.task.count({
      where: { project: { createdById: session.userId } },
    });

    const stats = [
      { id: "1", label: "Total Projects", value: String(total), change: "+0", color: "from-blue-500 to-blue-600" },
      { id: "2", label: "Tasks Completed", value: String(taskCount), change: "+0%", color: "from-green-500 to-green-600" },
      { id: "3", label: "Team Members", value: "0", change: "+0", color: "from-purple-500 to-purple-600" },
      { id: "4", label: "Active Projects", value: String(active), change: String(completed), color: "from-amber-500 to-amber-600" },
    ];
    return NextResponse.json(stats);
  } catch (e) {
    console.error("GET /api/stats", e);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
