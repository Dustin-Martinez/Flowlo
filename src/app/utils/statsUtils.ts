import { Project } from "@/src/app/types/dashboard";
import { Stat } from "@/src/app/types/dashboard";

export const calculateStats = (projects: Project[]): Stat[] => {
  const activeProjects = projects.filter(p => p.status === 'active');
  const totalProjects = projects.filter(p => p.status !== 'archived').length;
  
  // Calculate total progress across all non-archived projects
  const nonArchivedProjects = projects.filter(p => p.status !== 'archived');
  const totalProgress = nonArchivedProjects.length > 0 
    ? Math.round(nonArchivedProjects.reduce((sum, p) => sum + p.progress, 0) / nonArchivedProjects.length)
    : 0;

  // Calculate total members across non-archived projects
  const totalMembers = nonArchivedProjects.reduce((sum, p) => sum + p.members, 0);

  // Calculate previous period stats (simplified changes)
  const prevTotalProjects = Math.max(0, totalProjects - Math.floor(Math.random() * 2));
  const prevActiveProjects = Math.max(0, activeProjects.length - Math.floor(Math.random() * 1));
  const prevMembers = Math.max(0, totalMembers - Math.floor(Math.random() * 2));
  const prevProgress = Math.max(0, totalProgress - Math.floor(Math.random() * 5));

  return [
    {
      id: '1',
      label: 'Total Projects',
      value: totalProjects.toString(),
      change: totalProjects > prevTotalProjects 
        ? `+${totalProjects - prevTotalProjects}` 
        : `-${prevTotalProjects - totalProjects}`
    },
    {
      id: '2',
      label: 'Progress',
      value: `${totalProgress}%`,
      change: totalProgress > prevProgress 
        ? `+${totalProgress - prevProgress}%` 
        : `-${prevProgress - totalProgress}%`
    },
    {
      id: '3',
      label: 'Members',
      value: totalMembers.toString(),
      change: totalMembers > prevMembers 
        ? `+${totalMembers - prevMembers}` 
        : `-${prevMembers - totalMembers}`
    },
    {
      id: '4',
      label: 'Active',
      value: activeProjects.length.toString(),
      change: activeProjects.length > prevActiveProjects 
        ? `+${activeProjects.length - prevActiveProjects}` 
        : `-${prevActiveProjects - activeProjects.length}`
    }
  ];
};