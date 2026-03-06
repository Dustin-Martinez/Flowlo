export type BoardStatus = "active" | "archived";
export type BoardFilterStatus = "all" | "active" | "favorite";
export type SortByOption = "name" | "lastUpdated" | "cards";
export type SortOrder = "asc" | "desc";
export type ViewMode = "grid" | "list";

export interface Board {
  id: string;
  title: string;
  description: string;
  color: string;
  columns: number;
  cards: number;
  team: string[];
  lastUpdated: string;
  isFavorite: boolean;
  tags: string[];
  projectId: string;
  projectName: string;
  status: BoardStatus;
  createdBy: string;
  createdAt: string;
}

export interface BoardFilters {
  search: string;
  status: BoardFilterStatus;
  sortBy: SortByOption;
  sortOrder: SortOrder;
}

export interface BoardStats {
  totalBoards: number;
  totalCards: number;
  activeBoards: number;
  favoriteBoards: number;
  teamMembers: number;
}