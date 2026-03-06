import { useRouter } from "next/navigation";
import { Board } from '../types/boards';

export const useBoardActions = (
  updateBoardsAndSave: (boards: Board[], showDeleteConfirm?: string | null) => void, 
  boards: Board[]
) => {
  const router = useRouter();

  const handleFavoriteToggle = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedBoards = boards.map(board => 
      board.id === boardId ? { ...board, isFavorite: !board.isFavorite, lastUpdated: 'Just now' } : board
    );
    updateBoardsAndSave(updatedBoards);
  };

  const handleViewBoard = (boardId: string) => {
    router.push(`/dashboard/boards/${boardId}`);
  };

  const handleCreateBranch = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/boards/create-branch?boardId=${boardId}`);
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent, showDeleteConfirm: string | null) => {
    e.stopPropagation();
    const updatedBoards = boards.filter(board => board.id !== boardId);
    updateBoardsAndSave(updatedBoards, showDeleteConfirm);
  };

  return {
    handleFavoriteToggle,
    handleViewBoard,
    handleCreateBranch,
    handleDeleteBoard
  };
};