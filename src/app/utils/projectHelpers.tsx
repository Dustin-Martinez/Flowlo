import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Task, TaskStatus, TaskPriority } from "@/src/app/lib/taskService";

// Helper functions for type-safe select handlers
export const isValidStatus = (value: string): value is TaskStatus => {
  return value === "todo" || value === "in-progress" || value === "done";
};

export const isValidPriority = (value: string): value is TaskPriority => {
  return value === "low" || value === "medium" || value === "high";
};

// Calculate progress based on completed tasks
export const calculateProgress = (tasksList: Task[]): number => {
  if (tasksList.length === 0) return 0;
  const completedTasks = tasksList.filter(task => task.status === "done").length;
  return Math.round((completedTasks / tasksList.length) * 100);
};

// Priority colors
export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high": return "text-red-600 bg-red-50";
    case "medium": return "text-amber-600 bg-amber-50";
    case "low": return "text-green-600 bg-green-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

// Status colors
export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "in-progress": return "text-blue-600 bg-blue-50";
    case "done": return "text-green-600 bg-green-50";
    case "todo": return "text-gray-600 bg-gray-50";
    default: return "text-gray-600 bg-gray-50";
  }
};

// Status icons
export const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "done": return <CheckCircle2 size={16} />;
    case "in-progress": return <Clock size={16} />;
    case "todo": return <Circle size={16} />;
    default: return <Circle size={16} />;
  }
};

// Status options for select
export const statusOptions = [
  { value: "todo", label: "To Do", icon: <Circle size={14} /> },
  { value: "in-progress", label: "In Progress", icon: <Clock size={14} /> },
  { value: "done", label: "Done", icon: <CheckCircle2 size={14} /> }
];

// Priority options
export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" }
];

// Format date
export const formatDate = (dateString?: string) => {
  if (!dateString) return "No date";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return "Invalid date";
  }
};