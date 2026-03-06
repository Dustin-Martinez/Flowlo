export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  name: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
  attachments: number;
  comments: number;
};

export type NewTaskForm = {
  name: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
};

const useApi = typeof window !== "undefined";

// Map API status to taskService status
function fromApiStatus(s: string): TaskStatus {
  if (s === "Done" || s === "done") return "done";
  if (s === "In progress" || s === "in-progress") return "in-progress";
  return "todo";
}
function toApiStatus(s: TaskStatus): string {
  if (s === "done") return "Done";
  if (s === "in-progress") return "In progress";
  return "Not started";
}

// Get tasks for a specific project (from API when in browser)
export async function getTasksByProjectId(projectId: string): Promise<Task[]> {
  if (!useApi) return [];
  try {
    const res = await fetch(`/api/tasks?projectId=${encodeURIComponent(projectId)}`, { credentials: "include" });
    if (!res.ok) return [];
    const list = await res.json();
    return list.map((t: Record<string, unknown>) => ({
      id: t.id,
      name: t.name,
      description: t.description ?? "",
      assignee: t.assignee ?? "",
      assigneeAvatar: t.assigneeAvatar ?? "U",
      status: fromApiStatus((t.status as string) ?? "todo"),
      priority: ((t.priority as string) ?? "medium").toLowerCase() as TaskPriority,
      dueDate: t.dueDate ?? "",
      tags: Array.isArray(t.tags) ? t.tags : [],
      attachments: Number(t.attachments) ?? 0,
      comments: Number(t.comments) ?? 0,
    }));
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
}

// Create a new task (API)
export async function createTask(
  projectId: string,
  taskData: NewTaskForm,
  projectName?: string,
  projectColor?: string
): Promise<Task> {
  if (useApi) {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        projectId,
        projectName: projectName ?? "",
        projectColor: projectColor ?? "",
        name: taskData.name,
        description: taskData.description,
        assignee: taskData.assignee || "Unassigned",
        assigneeAvatar: taskData.assignee ? taskData.assignee.split(" ").map((n) => n[0]).join("").toUpperCase() : "UN",
        status: toApiStatus(taskData.status),
        priority: taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1),
        dueDate: taskData.dueDate,
        tags: taskData.tags,
        attachments: 0,
        comments: 0,
      }),
    });
    if (res.ok) {
      const t = await res.json();
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        assignee: t.assignee,
        assigneeAvatar: t.assigneeAvatar,
        status: fromApiStatus(t.status),
        priority: (t.priority ?? "medium").toLowerCase(),
        dueDate: t.dueDate,
        tags: t.tags ?? [],
        attachments: t.attachments ?? 0,
        comments: t.comments ?? 0,
      };
    }
  }
  const newTask: Task = {
    id: `task-${Date.now()}`,
    name: taskData.name,
    description: taskData.description,
    assignee: taskData.assignee || "Unassigned",
    assigneeAvatar: taskData.assignee ? taskData.assignee.split(" ").map((n) => n[0]).join("").toUpperCase() : "UN",
    status: taskData.status,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    tags: taskData.tags,
    attachments: 0,
    comments: 0,
  };
  const existing = await getTasksByProjectId(projectId);
  if (typeof window !== "undefined") {
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify([...existing, newTask]));
  }
  return newTask;
}

// Update task status (API)
export async function updateTaskStatus(
  projectId: string,
  taskId: string,
  newStatus: TaskStatus
): Promise<Task | null> {
  if (useApi) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: toApiStatus(newStatus) }),
    });
    if (res.ok) {
      const t = await res.json();
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        assignee: t.assignee,
        assigneeAvatar: t.assigneeAvatar,
        status: fromApiStatus(t.status),
        priority: (t.priority ?? "medium").toLowerCase(),
        dueDate: t.dueDate,
        tags: t.tags ?? [],
        attachments: t.attachments ?? 0,
        comments: t.comments ?? 0,
      };
    }
  }
  const tasks = await getTasksByProjectId(projectId);
  const idx = tasks.findIndex((task) => task.id === taskId);
  if (idx === -1) return null;
  const updated = { ...tasks[idx], status: newStatus };
  tasks[idx] = updated;
  if (typeof window !== "undefined") localStorage.setItem(`tasks_${projectId}`, JSON.stringify(tasks));
  return updated;
}

// Delete task (API)
export async function deleteTask(projectId: string, taskId: string): Promise<boolean> {
  if (useApi) {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE", credentials: "include" });
    if (res.ok) return true;
  }
  const tasks = await getTasksByProjectId(projectId);
  const filtered = tasks.filter((task) => task.id !== taskId);
  if (filtered.length === tasks.length) return false;
  if (typeof window !== "undefined") localStorage.setItem(`tasks_${projectId}`, JSON.stringify(filtered));
  return true;
}
