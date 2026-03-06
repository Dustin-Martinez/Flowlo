import { TaskStatus, TaskPriority } from "@/src/app/types/todo";

export const STATUS_OPTIONS: TaskStatus[] = ['Not started', 'In progress', 'Done', 'On hold'];
export const PRIORITY_OPTIONS: TaskPriority[] = ['Urgent', 'High', 'Medium', 'Low'];
export const SORT_OPTIONS = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'name', label: 'Name' },
  { value: 'createdAt', label: 'Created' }
] as const;