import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject, deleteProject, updateProject } from "@/src/app/lib/projectService";
import { COLORS } from "@/src/app/constants/projectConstants";

export const useProjectActions = (loadAllProjects: () => Promise<any>) => {
  const router = useRouter();
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [projectToArchive, setProjectToArchive] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProject = async (newProjectName: string) => {
    if (!newProjectName.trim()) return null;

    setIsLoading(true);
    try {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      const newProject = await createProject({
        name: newProjectName,
        description: "New project description",
        progress: 0,
        color: randomColor,
        tasks: 0,
        members: 0,
        status: "active"
      });

      // Reload the projects to get the fresh data
      await loadAllProjects();
      
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const success = await deleteProject(projectId);
      if (success) {
        await loadAllProjects();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const handleArchiveProject = async (projectId: string) => {
    try {
      const updatedProject = await updateProject(projectId, { 
        status: 'archived' 
      });
      
      if (updatedProject) {
        await loadAllProjects();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error archiving project:', error);
      throw error;
    }
  };

  return {
    projectToDelete,
    projectToArchive,
    isCreatingProject,
    isLoading,
    setProjectToDelete,
    setProjectToArchive,
    setIsCreatingProject,
    handleCreateProject,
    handleDeleteProject,
    handleArchiveProject
  };
};