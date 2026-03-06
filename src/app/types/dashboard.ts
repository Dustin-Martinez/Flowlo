export type ProjectStatus = "active" | "completed" | "on-hold" | "archived";

export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  tasks: number;
  members: number;
  lastUpdated: string;
  status?: ProjectStatus;
  deadline?: string;
  tags?: string[];
};

export type Stat = {
  id: string;
  label: string;
  value: string;
  change: string;
};

// Remove icon from StatusInfo since we'll handle it in components
export type StatusInfo = {
  dotColor: string;
  textColor: string;
  bgColor: string;
  text: string;
};

export type MenuPosition = {
  top: number;
  left: number;
};