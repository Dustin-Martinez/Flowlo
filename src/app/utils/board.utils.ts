import { Board, BoardFilters, BoardStats } from '../types/boards';

export const calculateStats = (boards: Board[]): BoardStats => {
  const totalCards = boards.reduce((sum, board) => sum + (board.cards || 0), 0);
  const activeBoards = boards.filter(b => b.status === 'active').length;
  const favoriteBoards = boards.filter(b => b.isFavorite).length;
  const allTeamMembers = boards.flatMap(board => board.team || []);
  const teamMembers = new Set(allTeamMembers).size;
  
  return {
    totalBoards: boards.length,
    totalCards,
    activeBoards,
    favoriteBoards,
    teamMembers
  };
};

export const getStatusColor = (status: Board['status']): string => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-800';
    case 'archived': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatRelativeTime = (timeString: string): string => {
  if (timeString.includes('Just now')) return 'Just now';
  if (timeString.includes('hour')) return timeString;
  if (timeString.includes('day')) return timeString;
  return timeString;
};

export const filterAndSortBoards = (
  boards: Board[],
  filters: BoardFilters
): Board[] => {
  return [...boards]
    .filter(board => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          board.title.toLowerCase().includes(searchLower) ||
          board.projectName.toLowerCase().includes(searchLower) ||
          board.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(board => {
      if (filters.status === "favorite") return board.isFavorite;
      if (filters.status === "active") return board.status === "active";
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case "name":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "cards":
          aValue = a.cards || 0;
          bValue = b.cards || 0;
          break;
        case "lastUpdated":
        default:
          aValue = a.lastUpdated;
          bValue = b.lastUpdated;
          break;
      }
      
      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
};