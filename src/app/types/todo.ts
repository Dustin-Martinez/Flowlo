export type TaskStatus = 'Not started' | 'In progress' | 'Done' | 'On hold';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  projectId: string;
  projectName: string;
  assignee: string;
  assigneeAvatar: string;
  tags?: string[];
  subtasks?: {
    id: string;
    name: string;
    completed: boolean;
  }[];
  estimatedHours: number;
  actualHours: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  onHold: number;
  overdue: number;
  completionRate: number;
}

export interface TodoFilters {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  search: string;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface StatusInfo {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  label: string;
}

export interface PriorityInfo {
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  label: string;
}