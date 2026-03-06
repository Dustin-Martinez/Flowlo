import { useState, useEffect, useCallback } from "react";
import { Task, TaskStats } from "@/src/app/types/todo";
import { getTasksForUser, getTaskStats } from "@/src/app/lib/projectService";

export const useTodoData = (username: string = "John Doe") => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    onHold: 0,
    overdue: 0,
    completionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userTasks, taskStats] = await Promise.all([
        getTasksForUser(username),
        getTaskStats(username)
      ]);
      
      setTasks(userTasks);
      setStats(taskStats);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const onFocus = () => loadData();
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }
  }, [loadData]);

  return {
    tasks,
    stats,
    isLoading,
    error,
    loadData,
    setTasks
  };
};