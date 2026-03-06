import { useState } from "react";
import { Task, TaskStatus } from "@/src/app/types/todo";
import { updateTaskStatus, getTaskStats } from "@/src/app/lib/projectService";

export const useTaskActions = (username: string = "John Doe", loadData: () => Promise<void>) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    setIsUpdating(true);
    try {
      const success = await updateTaskStatus(taskId, newStatus);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const closeTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  return {
    isUpdating,
    selectedTask,
    showTaskDetail,
    handleStatusUpdate,
    openTaskDetail,
    closeTaskDetail,
    setSelectedTask
  };
};