// First, let's define some helper types for better type safety
export type ProjectStatus = "active" | "completed" | "on-hold" | "archived";
export type IconName = "sunrise" | "sun" | "moon" | "check-circle" | "check-circle-2" | "pause-circle" | "folder-archive" | "circle" | "alert-circle";

export interface StatItem {
  id: string;
  label: string;
  value: string;
  change: string;
}

export interface GreetingConfigItem {
  greeting: string;
  iconName: IconName;
}

export interface StatusConfigItem {
  dotColor: string;
  textColor: string;
  bgColor: string;
  iconName: IconName;
  text: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  tasks: number;
  members: number;
  lastUpdated: string;
  status: ProjectStatus;
  deadline?: string;
  tags?: string[];
}

// Now define the constants
export const STAT_ITEMS: StatItem[] = [
  { id: '1', label: 'Total Projects', value: '0', change: '+0' },
  { id: '2', label: 'Progress', value: '0%', change: '+0%' },
  { id: '3', label: 'Members', value: '0', change: '+0' },
  { id: '4', label: 'Active', value: '0', change: '-0' }
];

export const COLORS: readonly string[] = [
  "from-gray-600 to-gray-700",
  "from-gray-700 to-gray-800",
  "from-gray-800 to-gray-900"
];

export const GREETING_CONFIG: Record<string, GreetingConfigItem> = {
  morning: {
    greeting: "Good morning",
    iconName: "sunrise"
  },
  afternoon: {
    greeting: "Good afternoon",
    iconName: "sun"
  },
  evening: {
    greeting: "Good evening",
    iconName: "moon"
  }
};

export const STATUS_CONFIG: Record<ProjectStatus, StatusConfigItem> = {
  active: {
    dotColor: 'bg-green-500 opacity-30',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    iconName: 'check-circle',
    text: 'Active'
  },
  completed: {
    dotColor: 'bg-blue-500 opacity-30',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    iconName: 'check-circle-2',
    text: 'Completed'
  },
  "on-hold": {
    dotColor: 'bg-amber-500 opacity-30',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
    iconName: 'pause-circle',
    text: 'On Hold'
  },
  archived: {
    dotColor: 'bg-gray-400 opacity-30',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    iconName: 'folder-archive',
    text: 'Archived'
  }
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete redesign of company website",
    progress: 75,
    color: "from-blue-500 to-blue-600",
    tasks: 12,
    members: 5,
    lastUpdated: "2025-03-15",
    status: "active",
    deadline: "2025-03-30",
    tags: ["Design", "Frontend"]
  },
  {
    id: "2",
    name: "Mobile App",
    description: "iOS & Android app development",
    progress: 45,
    color: "from-purple-500 to-purple-600",
    tasks: 8,
    members: 3,
    lastUpdated: "2025-03-20",
    status: "active",
    deadline: "2025-04-15",
    tags: ["Mobile", "Backend"]
  },
  {
    id: "3",
    name: "Backend API",
    description: "REST API development",
    progress: 90,
    color: "from-green-500 to-green-600",
    tasks: 15,
    members: 4,
    lastUpdated: "2025-03-10",
    status: "completed",
    deadline: "2025-02-28",
    tags: ["Backend", "DevOps"]
  }
];