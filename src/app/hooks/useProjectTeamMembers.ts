"use client";

import { useState, useEffect } from "react";
import { getProjectById } from "@/src/app/lib/projectService";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

export function useProjectTeamMembers(projectId: string) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setTeamMembers([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const project = await getProjectById(projectId);
        if (cancelled) return;
        if (project?.team && Array.isArray(project.team)) {
          setTeamMembers(
            project.team.map((t: { id: string; name: string; role: string; avatar?: string }) => ({
              id: t.id,
              name: t.name,
              role: t.role,
              avatar: t.avatar,
            }))
          );
        } else {
          setTeamMembers([]);
        }
      } catch (e) {
        if (!cancelled) setTeamMembers([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return { teamMembers, isLoading };
}
