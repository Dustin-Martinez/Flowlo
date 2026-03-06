import React from "react";
import { Project } from "@/src/app/types/dashboard";
import { 
  Users, 
  ListTodo, 
  ChevronRight, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  PauseCircle, 
  FolderArchive 
} from "lucide-react";
import { getStatusInfo } from "@/src/app/utils/statusUtils";
import { formatDate } from "@/src/app/utils/dateUtils";

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  menuButtonRef: (el: HTMLElement | null) => void;
  onCardClick: (id: string) => void;
  onProjectClick: (id: string, event: React.MouseEvent) => void;
  onMenuClick: (id: string, event: React.MouseEvent) => void;
}

// Helper function to get icon component
const getIconComponent = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case 'check-circle':
    case 'check-circle-2':
      return <CheckCircle2 className="w-3 h-3" />;
    case 'pause-circle':
      return <PauseCircle className="w-3 h-3" />;
    case 'folder-archive':
      return <FolderArchive className="w-3 h-3" />;
    default:
      return <Circle className="w-3 h-3" />;
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected,
  menuButtonRef,
  onCardClick,
  onProjectClick,
  onMenuClick,
}) => {
  const statusInfo = getStatusInfo(project.status);
  const deadline = formatDate(project.deadline);
  const iconComponent = getIconComponent(statusInfo.iconName);

  return (
    <div
      onClick={() => onCardClick(project.id)}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer group relative ${
        isSelected ? 'ring-1 ring-gray-900' : ''
      }`}
    >
      {/* Project Menu Button */}
      <div className="absolute top-3 right-3">
        <button
          ref={menuButtonRef}
          onClick={(e) => onMenuClick(project.id, e)}
          className="p-1 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Project Header */}
      <div className="mb-4">
        <h3
          onClick={(e) => onProjectClick(project.id, e)}
          className="font-medium text-gray-900 hover:text-gray-700 transition-colors text-lg mb-2 pr-8"
        >
          {project.name}
        </h3>

        {/* Status and Deadline */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
            {iconComponent}
            <span className={`${statusInfo.textColor} font-medium`}>
              {statusInfo.text}
            </span>
          </div>
          {deadline && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                Due {deadline}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${project.color} transition-all duration-300`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Project Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ListTodo className="w-3 h-3" />
            <span>{project.tasks} tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{project.members} members</span>
          </div>
        </div>
        <button
          onClick={(e) => onProjectClick(project.id, e)}
          className="text-gray-600 hover:text-gray-900 text-xs flex items-center gap-0.5 group-hover:gap-1 transition-all"
        >
          View
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};