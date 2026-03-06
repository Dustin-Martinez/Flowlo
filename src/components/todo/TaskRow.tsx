import React, { useState } from "react";
import { Task } from "@/src/app/types/todo";
import { Calendar } from "lucide-react";
import { 
  getStatusInfo, 
  getPriorityInfo, 
  getDueDateColor, 
  getDueDateText,
  getDaysUntilDue 
} from "@/src/app/utils/taskUtils";
import { STATUS_OPTIONS } from "@/src/app/constants/taskConstants";

interface TaskRowProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  onStatusUpdate: (taskId: string, newStatus: Task['status']) => Promise<void>;
  isUpdating: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onTaskClick,
  onStatusUpdate,
  isUpdating
}) => {
  const [editingStatus, setEditingStatus] = useState(false);
  
  const statusInfo = getStatusInfo(task.status);
  const priorityInfo = getPriorityInfo(task.priority);
  const dueDateColor = getDueDateColor(task.dueDate, task.status);
  const dueDateText = getDueDateText(task.dueDate, task.status);
  const daysUntilDue = getDaysUntilDue(task.dueDate);

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStatus(true);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await onStatusUpdate(task.id, e.target.value as Task['status']);
    setEditingStatus(false);
  };

  const handleStatusBlur = () => {
    setEditingStatus(false);
  };

  return (
    <div
      onClick={() => onTaskClick(task)}
      className="grid grid-cols-12 gap-6 p-6 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors cursor-pointer group"
    >
      {/* Task Name and Description */}
      <div className="col-span-6">
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-lg ${statusInfo.bgColor} border ${statusInfo.borderColor} flex items-center justify-center flex-shrink-0`}>
            {statusInfo.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">
                {task.name}
              </h3>
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityInfo.color} border ${priorityInfo.borderColor} flex-shrink-0`}>
                {task.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            <div className="flex items-center gap-2 mt-3">
              {(task.tags || []).slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
              {(task.tags || []).length > 3 && (
                <span className="text-xs text-gray-500">
                  +{(task.tags || []).length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Project */}
      <div className="col-span-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0"></div>
          <span className="text-sm text-gray-700 truncate">{task.projectName}</span>
        </div>
      </div>
      
      {/* Status */}
      <div className="col-span-2" onClick={handleStatusClick}>
        {editingStatus ? (
          <select
            value={task.status}
            onChange={handleStatusChange}
            onBlur={handleStatusBlur}
            disabled={isUpdating}
            autoFocus
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color} border ${statusInfo.borderColor} focus:outline-none focus:ring-2 focus:ring-[#9c28b6] cursor-pointer`}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <button className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${statusInfo.color} border ${statusInfo.borderColor} hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2`}>
            {statusInfo.icon}
            <span>{task.status}</span>
          </button>
        )}
      </div>
      
      {/* Due Date */}
      <div className="col-span-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <div className={`text-sm font-medium ${dueDateColor}`}>
              {new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {dueDateText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};