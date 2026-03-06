import React from "react";
import { Task } from "@/src/app/types/todo";
import { CheckSquare } from "lucide-react";
import { TaskRow } from "./TaskRow";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusUpdate: (taskId: string, newStatus: Task['status']) => Promise<void>;
  isUpdating: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onTaskClick,
  onStatusUpdate,
  isUpdating
}) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600">
            No tasks match your current filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="grid grid-cols-12 gap-6 p-6 bg-gray-50/50 text-sm font-medium text-gray-700">
          <div className="col-span-6">Task</div>
          <div className="col-span-2">Project</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Due Date</div>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="max-h-[600px] overflow-y-auto">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            onStatusUpdate={onStatusUpdate}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
};