"use client";

import { 
  Search,
  Users,
  ArrowLeft,
  Grid3x3,
  List,
  FolderOpen,
  Target,
  Star,
  StarOff,
  Eye,
  Filter,
  ChevronDown,
  TrendingUp,
  CheckCircle,
  Copy,
  AlertCircle,
  Trash2,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useBoards } from "@/src/app/hooks/useBoards";
import { useBoardFilters } from "@/src/app/hooks/useBoardFilters";
import { useBoardActions } from "@/src/app/hooks/useBoardActions";
import { deleteProject } from "@/src/app/lib/projectService";
import { filterAndSortBoards, getStatusColor, formatRelativeTime } from "@/src/app/utils/board.utils";

export default function BoardsPage() {
  const router = useRouter();

  const { boards, isLoading, error, stats, loadBoards, updateBoardsAndSave } = useBoards();
  const {
    filters,
    setFilters,
    activeView,
    setActiveView,
    showFilterDropdown,
    setShowFilterDropdown,
    hoveredBoard,
    setHoveredBoard,
    showDeleteConfirm,
    setShowDeleteConfirm,
  } = useBoardFilters();

  const {
    handleFavoriteToggle,
    handleViewBoard,
    handleCreateBranch,
    handleDeleteBoard,
  } = useBoardActions(updateBoardsAndSave, boards);

  const filteredAndSortedBoards = filterAndSortBoards(boards, filters);

  const handleDeleteConfirm = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showDeleteConfirm) return;
    const board = boards.find((b) => b.id === showDeleteConfirm);
    if (board && !board.id.includes("branch")) {
      const ok = await deleteProject(board.projectId);
      if (ok) await loadBoards();
    } else {
      handleDeleteBoard(showDeleteConfirm, e, showDeleteConfirm);
    }
    setShowDeleteConfirm(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-choco-200 border-t-choco-600 rounded-full animate-spin"></div>
          <div className="text-choco-600 text-sm">Loading boards...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Boards</h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors text-sm"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Project Boards</h1>
                <p className="text-gray-600 text-sm">Workflow management for your projects</p>
              </div>
            </div>
            {/* Removed Export Button */}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{stats.totalBoards} boards</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{stats.totalCards} cards</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{stats.teamMembers} team members</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{stats.favoriteBoards} favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Status Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilters({...filters, status: "all"})}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.status === "all"
                      ? "bg-choco-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilters({...filters, status: "active"})}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.status === "active"
                      ? "bg-choco-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilters({...filters, status: "favorite"})}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.status === "favorite"
                      ? "bg-choco-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Favorites
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView("grid")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${
                    activeView === "grid" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setActiveView("list")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 ${
                    activeView === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="Search boards..."
                  className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-sm"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Sort: {filters.sortBy === 'name' ? 'Name' : filters.sortBy === 'cards' ? 'Cards' : 'Last Updated'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 px-2 py-1">Sort by</div>
                      {['name', 'lastUpdated', 'cards'].map((sortOption) => (
                        <button
                          key={sortOption}
                          onClick={() => {
                            setFilters({...filters, sortBy: sortOption as any});
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                            filters.sortBy === sortOption ? 'text-choco-700 bg-gray-50' : 'text-gray-700'
                          }`}
                        >
                          {sortOption === 'name' ? 'Name' : sortOption === 'cards' ? 'Cards' : 'Last Updated'}
                        </button>
                      ))}
                      
                      <div className="border-t border-gray-200 my-2"></div>
                      
                      <div className="text-xs font-medium text-gray-500 px-2 py-1">Order</div>
                      <button
                        onClick={() => {
                          setFilters({...filters, sortOrder: 'asc'});
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                          filters.sortOrder === 'asc' ? 'text-choco-700 bg-gray-50' : 'text-gray-700'
                        }`}
                      >
                        Ascending (A-Z)
                      </button>
                      <button
                        onClick={() => {
                          setFilters({...filters, sortOrder: 'desc'});
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                          filters.sortOrder === 'desc' ? 'text-choco-700 bg-gray-50' : 'text-gray-700'
                        }`}
                      >
                        Descending (Z-A)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Boards Grid View */}
          {activeView === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedBoards.map((board) => (
                <div
                  key={board.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 cursor-pointer group relative"
                  onMouseEnter={() => setHoveredBoard(board.id)}
                  onMouseLeave={() => {
                    // Only clear hover if not showing delete confirmation for this board
                    if (showDeleteConfirm !== board.id) {
                      setHoveredBoard(null);
                    }
                  }}
                  onClick={() => handleViewBoard(board.id)}
                >
                  {/* Hover Overlay */}
                  <div 
                    className={`absolute inset-0 bg-white bg-opacity-95 rounded-lg transition-opacity duration-200 flex flex-col justify-center items-center gap-3 ${
                      hoveredBoard === board.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {/* Action Buttons */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewBoard(board.id);
                      }}
                      className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Open Board
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleCreateBranch(board.id, e)}
                        className="px-3 py-2 border border-choco-300 text-choco-700 rounded hover:bg-choco-50 transition-colors flex items-center gap-2 text-sm"
                        title="Create branch workflow"
                      >
                        <Copy className="w-4 h-4" />
                        Branch
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setShowDeleteConfirm(board.id);
                          setHoveredBoard(board.id); // Keep hovered state
                        }}
                        className="px-3 py-2 border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Board Content */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${getStatusColor(board.status)} flex items-center justify-center`}>
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{board.title}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">Project: {board.projectName}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleFavoriteToggle(board.id, e)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors z-10 relative"
                    >
                      {board.isFavorite ? (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{board.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {board.tags?.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {board.tags && board.tags.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-xs">
                        +{board.tags.length - 2}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        <span>{board.cards} cards</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{board.team?.length || 0} members</span>
                      </div>
                    </div>
                    <span>{formatRelativeTime(board.lastUpdated)}</span>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {filteredAndSortedBoards.length === 0 && (
                <div className="col-span-3 bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FolderOpen className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No boards found</h3>
                  <p className="text-gray-600 text-sm">
                    {filters.search ? 'Try adjusting your search' : 'Each project automatically gets a board. Create a project first.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-medium text-gray-900">Board Activity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-gray-900">Active Boards</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{stats.activeBoards}</div>
                <div className="text-xs text-gray-500 mt-1">Boards currently in use</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm font-medium text-gray-900">Cards Total</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{stats.totalCards}</div>
                <div className="text-xs text-gray-500 mt-1">Tasks across all boards</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-gray-900">Team Members</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{stats.teamMembers}</div>
                <div className="text-xs text-gray-500 mt-1">People involved</div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium text-gray-900">Favorite Boards</span>
                </div>
                <div className="text-2xl font-semibold text-gray-900">{stats.favoriteBoards}</div>
                <div className="text-xs text-gray-500 mt-1">Starred by team</div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-8 bg-choco-50 border border-choco-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-choco-900 mb-2">How Boards Work</h3>
            <ul className="space-y-2 text-sm text-choco-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
                <span>Each project automatically gets a main board</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
                <span>Click on a board to manage the project workflow</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
                <span>Hover and click "Branch" to create separate workflows for different departments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-choco-600 mt-0.5 flex-shrink-0" />
                <span>Deleting a main board also deletes its associated project</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - MOVED OUTSIDE the main content container */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal when clicking on the backdrop
            if (e.target === e.currentTarget) {
              setShowDeleteConfirm(null);
              setHoveredBoard(null);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent backdrop click from closing modal
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Board</h3>
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setHoveredBoard(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this board?
              </p>
              <p className="text-sm text-gray-500">
                {boards.find(b => b.id === showDeleteConfirm)?.id.includes('branch') 
                  ? 'This branch workflow will be deleted.'
                  : 'The main board and its associated project will be deleted.'}
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setHoveredBoard(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}