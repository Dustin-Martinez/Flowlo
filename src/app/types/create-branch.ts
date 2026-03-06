// types/branch.types.ts
import { Board, BoardBranch, WorkflowType } from "@/src/app/lib/projectService";

export interface BranchFormData {
  title: string;
  description: string;
  department: string;
  workflowType: WorkflowType;
  team: string[];
  tags: string[];
  newTag: string;
  newTeamMember: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface WorkflowTypeOption {
  value: WorkflowType;
  label: string;
  description: string;
  icon: string;
}

export type ActiveTab = 'existing' | 'create';

export interface BranchCardProps {
  branch: BoardBranch;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDuplicate: (branch: BoardBranch) => void;
  onDelete: (id: string) => void;
  showMenuForBranch: string | null;
  setShowMenuForBranch: (id: string | null) => void;
  setShowDeleteConfirm: (id: string | null) => void;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export interface BranchFormProps {
  branchData: BranchFormData;
  setBranchData: React.Dispatch<React.SetStateAction<BranchFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onAddTeamMember: (memberId: string) => void;
  onRemoveTeamMember: (memberId: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
  parentBoard: Board | null;
  setActiveTab: (tab: ActiveTab) => void;
}