// hooks/useCreateBranch.ts
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Board, 
  getBoardById, 
  getProjectById,
  createBoardBranch, 
  BoardBranch,
  getBranchesByParentBoard,
  deleteBranch,
  toggleBranchFavorite
} from "@/src/app/lib/projectService";
import { BranchFormData } from "../types/create-branch";
import { formatBranchTitle, formatBranchDescription } from "@/src/app/utils/create-branch.utils";

export const useCreateBranch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentBoardId = searchParams.get('boardId');

  const [parentBoard, setParentBoard] = useState<Board | null>(null);
  const [existingBranches, setExistingBranches] = useState<BoardBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'existing' | 'create'>('existing');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showMenuForBranch, setShowMenuForBranch] = useState<string | null>(null);

  const [branchData, setBranchData] = useState<BranchFormData>({
    title: '',
    description: '',
    department: '',
    workflowType: 'custom',
    team: [],
    tags: [],
    newTag: '',
    newTeamMember: ''
  });

  const loadBranches = async () => {
    if (!parentBoardId) return;
    
    try {
      const branches = await getBranchesByParentBoard(parentBoardId);
      setExistingBranches(branches);
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!parentBoardId) {
        setError('No board specified for branch creation');
        setIsLoading(false);
        return;
      }

      try {
        const [board, branches] = await Promise.all([
          getBoardById(parentBoardId),
          getBranchesByParentBoard(parentBoardId)
        ]);

        if (!board) {
          setError('Parent board not found');
          setIsLoading(false);
          return;
        }

        setParentBoard(board);
        setExistingBranches(branches);

        // Pre-fill from project - team members from project.team only (IDs, no mock)
        const project = await getProjectById(board.projectId);
        const teamIds = project?.team && Array.isArray(project.team)
          ? project.team.map((m: { id: string }) => m.id)
          : [];
        setBranchData(prev => ({
          ...prev,
          title: formatBranchTitle(board.title),
          description: formatBranchDescription(board.projectName),
          department: board.projectName,
          team: teamIds,
          tags: board.tags || []
        }));
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load board information');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [parentBoardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!parentBoardId || !parentBoard) {
      setError('Parent board information is missing');
      return;
    }

    if (!branchData.title.trim()) {
      setError('Please enter a branch title');
      return;
    }

    if (!branchData.department.trim()) {
      setError('Please specify a department');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newBranch = await createBoardBranch(
        parentBoardId,
        {
          title: branchData.title,
          description: branchData.description,
          department: branchData.department,
          workflowType: branchData.workflowType,
          team: branchData.team,
          tags: branchData.tags
        },
        parentBoard?.projectId
      );

      // Add the new branch to existing branches
      setExistingBranches(prev => [...prev, newBranch]);
      
      // Reset form and switch to existing tab
      setBranchData({
        title: formatBranchTitle(parentBoard.title),
        description: formatBranchDescription(parentBoard.projectName),
        department: parentBoard.projectName || '',
        workflowType: 'custom',
        team: parentBoard.team || [],
        tags: parentBoard.tags || [],
        newTag: '',
        newTeamMember: ''
      });
      
      // Show success message and redirect with corrected route
      setTimeout(() => {
        router.push(`/dashboard/boards/create-branch/${newBranch.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating branch:', error);
      setError(error instanceof Error ? error.message : 'Failed to create branch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (branchData.newTag.trim() && !branchData.tags.includes(branchData.newTag.trim())) {
      setBranchData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setBranchData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddTeamMember = (memberId: string) => {
    if (!branchData.team.includes(memberId)) {
      setBranchData(prev => ({
        ...prev,
        team: [...prev.team, memberId]
      }));
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setBranchData(prev => ({
      ...prev,
      team: prev.team.filter(id => id !== memberId)
    }));
  };

  const handleViewBranch = (branchId: string) => {
    router.push(`/dashboard/boards/create-branch/${branchId}`);
  };

  const handleViewMainBoard = () => {
    if (parentBoard) {
      router.push(`/dashboard/boards/${parentBoard.id}`);
    }
  };

  const handleEditBranch = (branchId: string) => {
    router.push(`/dashboard/boards/create-branch/${branchId}/edit`);
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      const success = await deleteBranch(branchId);
      if (success) {
        // Remove from local state
        setExistingBranches(prev => prev.filter(branch => branch.id !== branchId));
        setShowDeleteConfirm(null);
        setShowMenuForBranch(null);
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      setError('Failed to delete branch');
    }
  };

  const handleToggleFavorite = async (branchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleBranchFavorite(branchId);
      // Refresh branches list
      await loadBranches();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDuplicateBranch = async (branch: BoardBranch) => {
    try {
      const duplicatedBranch = await createBoardBranch(
        branch.parentBoardId,
        {
          title: `${branch.title} (Copy)`,
          description: branch.description,
          department: branch.department,
          workflowType: branch.workflowType,
          team: [...branch.team],
          tags: [...branch.tags]
        },
        branch.projectId
      );

      // Add to existing branches
      setExistingBranches(prev => [...prev, duplicatedBranch]);
      setShowMenuForBranch(null);
    } catch (error) {
      console.error('Error duplicating branch:', error);
      setError('Failed to duplicate branch');
    }
  };

  return {
    router,
    parentBoard,
    existingBranches,
    isLoading,
    isSubmitting,
    error,
    activeTab,
    showDeleteConfirm,
    showMenuForBranch,
    branchData,
    setBranchData,
    setActiveTab,
    setShowDeleteConfirm,
    setShowMenuForBranch,
    handleSubmit,
    handleAddTag,
    handleRemoveTag,
    handleAddTeamMember,
    handleRemoveTeamMember,
    handleViewBranch,
    handleViewMainBoard,
    handleEditBranch,
    handleDeleteBranch,
    handleToggleFavorite,
    handleDuplicateBranch,
    loadBranches
  };
};