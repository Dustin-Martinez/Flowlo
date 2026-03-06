import React from "react";
import { Task, TodoFilters } from "@/src/app/types/todo";
import { getStatusInfo, getPriorityInfo, getDaysUntilDue } from "@/src/app/utils/taskUtils";
import { STATUS_OPTIONS } from "@/src/app/constants/taskConstants";

interface StatusSummaryProps {
  tasks: Task[];
  onFilterChange: (filters: Partial<TodoFilters>) => void;
  onTaskClick: (task: Task) => void;
}

export const StatusSummary: React.FC<StatusSummaryProps> = ({ 
  tasks, 
  onFilterChange,
  onTaskClick 
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Tasks by Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATUS_OPTIONS.map((status) => {
          const statusTasks = tasks.filter(t => t.status === status);
          const statusInfo = getStatusInfo(status);
          
          return (
            <div
              key={status}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Status Header */}
              <div 
                className="px-6 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onFilterChange({ status })}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusInfo.dotColor}`}></div>
                    <h3 className="font-medium text-gray-900">{statusInfo.label}</h3>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {statusTasks.length}
                  </span>
                </div>
              </div>
              
              {/* Scrollable Tasks List */}
              <div className="max-h-96 overflow-y-auto">
                {statusTasks.length === 0 ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 text-sm">No tasks</div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {statusTasks.map(task => {
                      const priorityInfo = getPriorityInfo(task.priority);
                      const daysUntilDue = getDaysUntilDue(task.dueDate);
                      
                      return (
                        <div
                          key={task.id}
                          onClick={() => onTaskClick(task)}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
                              {task.name}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded ${priorityInfo.color} border ${priorityInfo.borderColor} flex-shrink-0`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-2 truncate">
                            {task.projectName}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {(task.tags || []).slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(task.tags || []).length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{(task.tags || []).length - 2}
                                </span>
                              )}
                            </div>
                            <div className={`text-xs font-medium ${
                              task.status === 'Done' ? 'text-green-600' :
                              daysUntilDue < 0 ? 'text-red-600' :
                              daysUntilDue <= 2 ? 'text-amber-600' : 'text-gray-600'
                            }`}>
                              {task.status === 'Done' ? 'Done' :
                               daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d ago` :
                               daysUntilDue === 0 ? 'Today' :
                               daysUntilDue === 1 ? 'Tomorrow' :
                               `${daysUntilDue}d`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};