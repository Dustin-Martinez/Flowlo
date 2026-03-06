import React from "react";
import { Project } from "@/src/app/types/dashboard";
import { Plus } from "lucide-react";
import { ProjectCard } from "./ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  selectedProject: string | null;
  registerMenuButton: (id: string, el: HTMLElement | null) => void;
  onProjectCardClick: (id: string) => void;
  onProjectClick: (id: string, event: React.MouseEvent) => void;
  onMenuClick: (id: string, event: React.MouseEvent) => void;
  onCreateProjectClick: () => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  selectedProject,
  registerMenuButton,
  onProjectCardClick,
  onProjectClick,
  onMenuClick,
  onCreateProjectClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isSelected={selectedProject === project.id}
          menuButtonRef={(el) => registerMenuButton(project.id, el)}
          onCardClick={onProjectCardClick}
          onProjectClick={onProjectClick}
          onMenuClick={onMenuClick}
        />
      ))}
      {/* Create New Project Card */}
      <button
        onClick={onCreateProjectClick}
        className="bg-white border border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-900 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center"
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <Plus className="w-5 h-5 text-gray-600" />
        </div>
        <div className="font-medium text-gray-900 mb-1">New Project</div>
        <div className="text-sm text-gray-600">Create a new project</div>
      </button>
    </div>
  );
};