import { useState, useEffect, useCallback } from "react";
import { Board, BoardStats } from "../types/boards";
import { getAllBoards } from "@/src/app/lib/projectService";
import { initialBoardStats } from "../utils/board.data";
import { calculateStats } from "../utils/board.utils";

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<BoardStats>(initialBoardStats);

  const loadBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllBoards();
      setBoards(data);
      setStats(calculateStats(data));
    } catch (err) {
      console.error("Error loading boards:", err);
      setError("Failed to load boards.");
      setBoards([]);
      setStats(initialBoardStats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const updateBoardsAndSave = (updatedBoards: Board[], _showDeleteConfirm?: string | null) => {
    setBoards(updatedBoards);
    setStats(calculateStats(updatedBoards));
    if (typeof window !== "undefined") {
      localStorage.setItem("projectBoards", JSON.stringify(updatedBoards));
    }
  };

  return {
    boards,
    setBoards,
    isLoading,
    error,
    stats,
    loadBoards,
    updateBoardsAndSave,
  };
};
