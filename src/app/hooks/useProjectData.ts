import { useState, useEffect, useCallback } from "react";
import { getProjectById, updateProject, type Project } from "@/src/app/lib/ProjService";

export const useProjectData = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load project data from JSON
  const loadProject = useCallback(async () => {
    setIsLoading(true);
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Error loading project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Handle project update
  const handleProjectUpdate = useCallback(async (updatedProject: Project) => {
    try {
      await updateProject(projectId, updatedProject);
      setProject(updatedProject);
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId, loadProject]);

  return {
    project,
    setProject,
    isLoading,
    loadProject,
    handleProjectUpdate
  };
};