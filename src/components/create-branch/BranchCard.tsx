// pages/create-branch/components/BranchCard.tsx
import React from 'react';
import { 
  FolderKanban, 
  Users, 
  Target, 
  Eye, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle 
} from 'lucide-react';
import { BoardBranch } from '@/src/app/lib/projectService';
import { BranchCardProps } from '@/src/app/types/create-branch';

export const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  onView,
  onEdit,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  showMenuForBranch,
  setShowMenuForBranch,
  setShowDeleteConfirm
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-choco-300 transition-colors relative group min-h-[240px]">
      {/* Branch Menu */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenuForBranch(showMenuForBranch === branch.id ? null : branch.id);
            }}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
          
          {showMenuForBranch === branch.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <div className="py-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(branch.id);
                    setShowMenuForBranch(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Open Branch
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(branch.id);
                    setShowMenuForBranch(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Branch
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(branch.id, e);
                    setShowMenuForBranch(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {branch.isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(branch);
                    setShowMenuForBranch(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                
                <div className="border-t border-gray-200 my-1"></div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(branch.id);
                    setShowMenuForBranch(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Branch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Branch Content */}
      <div onClick={() => onView(branch.id)} className="cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 text-sm truncate max-w-[120px]">{branch.title}</h3>
                {branch.isFavorite && (
                  <CheckCircle className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-500 text-xs mt-1 truncate max-w-[140px]">{branch.department}</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{branch.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {branch.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
              {tag}
            </span>
          ))}
          {branch.tags && branch.tags.length > 2 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-400 rounded-lg text-xs">
              +{branch.tags.length - 2}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              <span>{branch.cards || 0} cards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{branch.team?.length || 0} members</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(branch.id);
            }}
            className="px-3 py-1.5 bg-choco-600 text-white rounded-lg hover:bg-choco-700 transition-colors text-xs flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View
          </button>
        </div>
      </div>
    </div>
  );
};