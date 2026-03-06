import { useState, useCallback } from "react";
import { Project, Stat } from "@/src/app/types/dashboard";
import { getAllProjects } from "@/src/app/lib/projectService";
import { calculateStats } from "@/src/app/utils/statsUtils";

export const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [displayProjects, setDisplayProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);

  const loadAllProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const projectsData = await getAllProjects() ?? [];

      setAllProjects(projectsData);
      
      const activeProjects = projectsData.filter(p => p.status !== 'archived');
      setDisplayProjects(activeProjects);
      
      const calculatedStats = calculateStats(projectsData);
      setStats(calculatedStats);
      
      return projectsData;
    } catch (error) {
      console.error('Error loading projects:', error);
      setAllProjects([]);
      setDisplayProjects([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    allProjects,
    displayProjects,
    stats,
    loadAllProjects,
    setAllProjects,
    setDisplayProjects,
    setStats
  };
};