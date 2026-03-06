"use client";

import React from "react";
import { 
  TodoHeader, 
  TodoStats, 
  TodoFilters, 
  TaskTable,
  StatusSummary,
  TaskDetailModal 
} from "@/src/components/todo";
import { 
  useSession,
  useTodoData, 
  useTaskActions, 
  useTaskFilters 
} from "@/src/app/hooks";

const TodoPage = () => {
  const { user } = useSession();
  const username = user?.name ?? "Guest";
  
  const {
    tasks,
    stats,
    isLoading,
    error,
    loadData
  } = useTodoData(username);

  const {
    isUpdating,
    selectedTask,
    showTaskDetail,
    handleStatusUpdate,
    openTaskDetail,
    closeTaskDetail,
    setSelectedTask
  } = useTaskActions(username, loadData);

  const {
    filters,
    setFilters,
    filteredAndSortedTasks
  } = useTaskFilters(tasks);

  // Fix: Properly type the newStatus parameter
  const handleStatusUpdateWithDetail = async (taskId: string, newStatus: 'Not started' | 'In progress' | 'Done' | 'On hold') => {
    try {
      await handleStatusUpdate(taskId, newStatus);
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({
          ...selectedTask,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading your tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TodoHeader username={username} />
      <TodoStats stats={stats} />
      
      {/* Main Content */}
      <div className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <TodoFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          
          <TaskTable
            tasks={filteredAndSortedTasks}
            onTaskClick={openTaskDetail}
            onStatusUpdate={handleStatusUpdateWithDetail}
            isUpdating={isUpdating}
          />
          
          {filteredAndSortedTasks.length > 0 && (
            <StatusSummary
              tasks={filteredAndSortedTasks}
              onFilterChange={(newFilters) => setFilters({...filters, ...newFilters})}
              onTaskClick={openTaskDetail}
            />
          )}
        </div>
      </div>

      <TaskDetailModal
        task={selectedTask}
        isOpen={showTaskDetail}
        onClose={closeTaskDetail}
        onStatusUpdate={handleStatusUpdateWithDetail}
      />
    </div>
  );
};

export default TodoPage; // Make sure this line is present and correct