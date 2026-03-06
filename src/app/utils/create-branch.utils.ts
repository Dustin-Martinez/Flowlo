// utils/branch.utils.ts
import { BoardBranch } from "@/src/app/lib/projectService";

export const calculateTotalProgress = (branches: BoardBranch[]): number => {
  if (!branches.length) return 0;
  
  const totalCards = branches.reduce((sum, branch) => sum + (branch.cards || 0), 0);
  const doneCards = branches.reduce((sum, branch) => {
    // Assuming 30% of cards are done as a simple calculation
    return sum + Math.floor((branch.cards || 0) * 0.3);
  }, 0);
  
  return totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;
};

export const getWorkflowColumnsCount = (workflowType: string): number => {
  const columnsMap: Record<string, number> = {
    development: 6,
    design: 5,
    marketing: 5,
    qa: 5,
    operations: 5,
    custom: 4
  };
  
  return columnsMap[workflowType] || 4;
};

export const formatBranchTitle = (parentBoardTitle: string): string => {
  return `${parentBoardTitle} - Branch`;
};

export const formatBranchDescription = (projectName: string): string => {
  return `Branch workflow for ${projectName}`;
};

export const getUniqueTeamMembersCount = (branches: BoardBranch[]): number => {
  const allTeamMembers = branches.flatMap(branch => branch.team || []);
  return new Set(allTeamMembers).size;
};

export const getTotalCards = (branches: BoardBranch[]): number => {
  return branches.reduce((sum, branch) => sum + (branch.cards || 0), 0);
};