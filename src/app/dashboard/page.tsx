"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  WelcomeSection, 
  StatsSection, 
  ProjectsGrid,
  CreateProjectModal,
  ConfirmationModal,
  FloatingMenu,
  ArchiveSection // Import ArchiveSection
} from "@/src/components/dashboard";
import { 
  useDashboardData, 
  useProjectActions, 
  useMenu 
} from "@/src/app/hooks";
import { Archive } from "lucide-react"; // Import Archive icon
import { Project } from "@/src/app/types/dashboard"; // Import Project type

export default function DashboardPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showArchive, setShowArchive] = useState(false); // Add state for archive section
  
  const {
    isLoading,
    displayProjects,
    stats,
    loadAllProjects
  } = useDashboardData();

  const {
    projectToDelete,
    projectToArchive,
    isCreatingProject,
    setIsCreatingProject,
    setProjectToDelete,
    setProjectToArchive,
    handleCreateProject,
    handleDeleteProject,
    handleArchiveProject
  } = useProjectActions(loadAllProjects);

  const {
    menuOpen,
    menuPosition,
    menuRef,
    registerMenuButton,
    toggleMenu,
    setMenuOpen
  } = useMenu();

  // Load data on mount
  useEffect(() => {
    loadAllProjects();
  }, [loadAllProjects]);

  const handleProjectClick = (projectId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    router.push(`/dashboard/projects/${projectId}`);
  };

  const handleCardClick = (projectId: string) => {
    setSelectedProject(projectId === selectedProject ? null : projectId);
  };

  const handleDeleteClick = (projectId: string) => {
    setMenuOpen(null);
    setProjectToDelete(projectId);
  };

  const handleArchiveClick = (projectId: string) => {
    setMenuOpen(null);
    setProjectToArchive(projectId);
  };

  // Handle restored project
  const handleRestore = (restoredProject: Project) => {
    // Refresh the projects list to show the restored project
    loadAllProjects();
    // Optional: Show a success toast or notification here
  };

  // Fixed: Properly handle project creation
  const onCreateProject = async (projectName: string): Promise<void> => {
    try {
      const newProject = await handleCreateProject(projectName);
      if (newProject) {
        setIsCreatingProject(false);
        // Optional: Navigate to the new project
        // router.push(`/dashboard/projects/${newProject.id}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      // The modal will stay open with error message
      throw error; // Re-throw so modal can show error
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <WelcomeSection />
      <StatsSection stats={stats} />
      
      {/* Projects Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
            <p className="text-gray-600 text-sm">
              {displayProjects.length} total
            </p>
          </div>
          <div className="flex items-center gap-3"> {/* Added container for buttons */}
            <button
              onClick={() => setShowArchive(true)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Archive className="w-4 h-4" />
              Archived
            </button>
            <button
              onClick={() => setIsCreatingProject(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm flex items-center gap-2"
            >
              New Project
            </button>
          </div>
        </div>

        <ProjectsGrid
          projects={displayProjects}
          selectedProject={selectedProject}
          registerMenuButton={registerMenuButton}
          onProjectCardClick={handleCardClick}
          onProjectClick={handleProjectClick}
          onMenuClick={toggleMenu}
          onCreateProjectClick={() => setIsCreatingProject(true)}
        />
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreatingProject}
        onClose={() => setIsCreatingProject(false)}
        onCreate={onCreateProject}
      />

      <ConfirmationModal
        isOpen={!!projectToDelete}
        title="Delete Project"
        message="This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={async () => {
          if (projectToDelete) {
            await handleDeleteProject(projectToDelete);
            setProjectToDelete(null);
          }
        }}
        onCancel={() => setProjectToDelete(null)}
      />

      <ConfirmationModal
        isOpen={!!projectToArchive}
        title="Archive Project"
        message="Project will be moved to archive."
        confirmText="Archive"
        confirmVariant="warning"
        onConfirm={async () => {
          if (projectToArchive) {
            await handleArchiveProject(projectToArchive);
            setProjectToArchive(null);
          }
        }}
        onCancel={() => setProjectToArchive(null)}
      />

      <FloatingMenu
        isOpen={!!menuOpen}
        position={menuPosition}
        menuRef={menuRef}
        onArchive={handleArchiveClick}
        onDelete={handleDeleteClick}
        projectId={menuOpen || ""}
      />

      {/* Archive Section - Slides in from right */}
      <ArchiveSection
        isOpen={showArchive}
        onClose={() => setShowArchive(false)}
        onRestore={handleRestore}
      />
    </div>
  );
}