import { useState } from "react";
import { BoardFilters, ViewMode } from '../types/boards';
import { initialBoardFilters } from '../utils/board.data';

export const useBoardFilters = () => {
  const [filters, setFilters] = useState<BoardFilters>(initialBoardFilters);
  const [activeView, setActiveView] = useState<ViewMode>("grid");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [hoveredBoard, setHoveredBoard] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  return {
    filters,
    setFilters,
    activeView,
    setActiveView,
    showFilterDropdown,
    setShowFilterDropdown,
    hoveredBoard,
    setHoveredBoard,
    showDeleteConfirm,
    setShowDeleteConfirm
  };
};