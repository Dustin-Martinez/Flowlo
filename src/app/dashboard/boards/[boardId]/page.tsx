"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Users,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  GitBranch,
  Settings,
  Maximize2,
  Minimize2,
  Target,
  TrendingUp
} from "lucide-react";
import { 
  getBoardById, 
  Board,
  getBranchesByParentBoard,
  deleteBranch,
  getBranchProgress, // This already exists in your projectService
} from "@/src/app/lib/projectService";

// Branch card component
const BranchCard = ({ 
  branch,
  progress,
  onEdit,
  onDelete,
  onView
}: { 
  branch: any;
  progress: number;
  onEdit: (branch: any) => void;
  onDelete: (branchId: string) => void;
  onView: (branch: any) => void;
}) => {
  const getWorkflowColor = (type: string) => {
    switch (type) {
      case 'development': return 'bg-blue-100 text-blue-700';
      case 'design': return 'bg-purple-100 text-purple-700';
      case 'marketing': return 'bg-pink-100 text-pink-700';
      case 'qa': return 'bg-amber-100 text-amber-700';
      case 'operations': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      onClick={() => onView(branch)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-choco-300 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-choco-50 rounded-lg flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-choco-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">{branch.title}</h3>
            <p className="text-gray-500 text-xs">{branch.department}</p>
          </div>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(branch)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(branch.id)}
            className="p-1 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{branch.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getWorkflowColor(branch.workflowType)}`}>
          {branch.workflowType}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
          {branch.workflowType} workflow
        </span>
      </div>
      
      {/* Branch progress display */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Branch Progress</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-choco-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>
            {branch.team ? 
              (typeof branch.team === 'string' ? 
                JSON.parse(branch.team).length : 
                Array.isArray(branch.team) ? branch.team.length : 0
              ) : 0
            } members
          </span>
        </div>
        <span>Updated {branch.lastUpdated}</span>
      </div>
    </div>
  );
};

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;
  
  const [board, setBoard] = useState<Board | null>(null);
  const [boardProgress, setBoardProgress] = useState(0);
  const [branches, setBranches] = useState<any[]>([]);
  const [branchProgressMap, setBranchProgressMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Function to calculate overall board progress from branches
  const calculateBoardProgress = (progressMap: Record<string, number>) => {
    const branchIds = Object.keys(progressMap);
    if (branchIds.length === 0) return 0;
    
    const totalProgress = branchIds.reduce((sum, branchId) => {
      return sum + (progressMap[branchId] || 0);
    }, 0);
    
    return Math.round(totalProgress / branchIds.length);
  };
  
  // Load board data and calculate progress
  useEffect(() => {
    const loadBoardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const boardData = await getBoardById(boardId);
        if (!boardData) {
          throw new Error('Board not found');
        }
        setBoard(boardData);
        
        // Load branches
        const branchesData = await getBranchesByParentBoard(boardId);
        setBranches(branchesData);
        
        // Calculate progress for each branch using getBranchProgress
        const progressMap: Record<string, number> = {};
        
        // Use Promise.all to load all branch progress in parallel
        const progressPromises = branchesData.map(async (branch) => {
          try {
            const progress = await getBranchProgress(branch.id);
            return { branchId: branch.id, progress };
          } catch (err) {
            console.warn(`Error getting progress for branch ${branch.id}:`, err);
            return { branchId: branch.id, progress: 0 };
          }
        });
        
        const results = await Promise.all(progressPromises);
        results.forEach(({ branchId, progress }) => {
          progressMap[branchId] = progress;
        });
        
        setBranchProgressMap(progressMap);
        
        // Calculate overall board progress
        const calculatedProgress = calculateBoardProgress(progressMap);
        setBoardProgress(calculatedProgress);
        
      } catch (error) {
        console.error('Error loading board:', error);
        setError('Failed to load board data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBoardData();
  }, [boardId]);

  // Handle branch operations
  const handleDeleteBranch = async (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranch(branchId);
        
        // Remove branch from state
        const updatedBranches = branches.filter(branch => branch.id !== branchId);
        setBranches(updatedBranches);
        
        // Remove from progress map
        const updatedProgressMap = { ...branchProgressMap };
        delete updatedProgressMap[branchId];
        setBranchProgressMap(updatedProgressMap);
        
        // Recalculate board progress
        const calculatedProgress = calculateBoardProgress(updatedProgressMap);
        setBoardProgress(calculatedProgress);
        
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  const handleEditBranch = (branch: any) => {
    router.push(`/dashboard/boards/create-branch/${branch.id}`);
  };

  const handleViewBranch = (branch: any) => {
    // Navigate to branch detail page
    router.push(`/dashboard/branches/${branch.id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-choco-200 border-t-choco-600 rounded-full animate-spin"></div>
          <div className="text-choco-600 text-sm">Loading board...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Board</h2>
          <p className="text-gray-600 text-sm mb-4">{error || 'Board not found'}</p>
          <button
            onClick={() => router.push('/dashboard/boards')}
            className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors text-sm"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push("/dashboard/boards")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{board.title}</h1>
                <p className="text-gray-600 text-sm">Project: {board.projectName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span className="font-medium text-gray-900">{boardProgress}% complete</span>
                <span className="text-gray-500">({branches.length} branch{branches.length !== 1 ? 'es' : ''})</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{board.team?.length || 0} members</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4" />
                <span>{branches.length} branches</span>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/dashboard/boards/create-branch?boardId=${boardId}`)}
              className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Branch
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        <div className="max-w-full mx-auto">
          {/* Progress Overview */}
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-choco-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-choco-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Board Progress</h3>
                  <p className="text-sm text-gray-500">
                    Average of {branches.length} branch{branches.length !== 1 ? 'es' : ''} based on completed tasks
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-medium text-gray-900">{boardProgress}% done</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-choco-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${boardProgress}%` }}
                    />
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  boardProgress === 100 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : boardProgress >= 70 
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{boardProgress}%</span>
                </div>
              </div>
              
              {/* Progress breakdown by branch */}
              {branches.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Branch Progress Breakdown</h4>
                  <div className="space-y-3">
                    {branches.map(branch => (
                      <div key={branch.id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{branch.title}</span>
                            <span className="font-medium text-gray-900">
                              {branchProgressMap[branch.id] || 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${branchProgressMap[branch.id] || 0}%`,
                                backgroundColor: branchProgressMap[branch.id] === 100 
                                  ? '#10b981' // emerald
                                  : branchProgressMap[branch.id] >= 70
                                  ? '#3b82f6' // blue
                                  : '#f59e0b' // amber
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Branches */}
          <div>
            {branches.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 bg-choco-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <GitBranch className="w-5 h-5 text-choco-600" />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">No branches yet</h3>
                  <p className="text-gray-600 text-sm mb-4">Create your first branch workflow</p>
                  <button
                    onClick={() => router.push(`/dashboard/boards/create-branch?boardId=${boardId}`)}
                    className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors text-sm"
                  >
                    Create Branch
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {branches.map((branch) => (
                    <BranchCard
                      key={branch.id}
                      branch={branch}
                      progress={branchProgressMap[branch.id] || 0}
                      onEdit={handleEditBranch}
                      onDelete={handleDeleteBranch}
                      onView={handleViewBranch}
                    />
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}