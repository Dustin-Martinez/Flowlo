import { BoardFilters, BoardStats } from "../types/boards";

export const initialBoardFilters: BoardFilters = {
  search: "",
  status: "all",
  sortBy: "lastUpdated",
  sortOrder: "desc",
};

export const initialBoardStats: BoardStats = {
  totalBoards: 0,
  totalCards: 0,
  activeBoards: 0,
  favoriteBoards: 0,
  teamMembers: 0,
};
