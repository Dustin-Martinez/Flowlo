import React, { useState } from "react";
import { Task, TaskStatus } from "@/src/app/types/todo";
import { X, CheckCircle2, Calendar, Users, Clock, Tag, FileText, Folder, Loader2 } from "lucide-react";
import { 
  getStatusInfo, 
  getPriorityInfo, 
  getDaysUntilDue 
} from "@/src/app/utils/taskUtils";
import { STATUS_OPTIONS } from "@/src/app/constants/taskConstants";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onStatusUpdate
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>('Not started');

  // Initialize selectedStatus when task changes
  React.useEffect(() => {
    if (task) {
      setSelectedStatus(task.status);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const statusInfo = getStatusInfo(selectedStatus);
  const priorityInfo = getPriorityInfo(task.priority);
  const daysUntilDue = getDaysUntilDue(task.dueDate);
  const completionPercentage = task.estimatedHours > 0 
    ? Math.round((task.actualHours / task.estimatedHours) * 100)
    : 0;

  const handleSaveChanges = async () => {
    if (selectedStatus === task.status) {
      onClose(); // Close if no changes
      return;
    }

    setIsSaving(true);
    try {
      await onStatusUpdate(task.id, selectedStatus);
      onClose(); // Close after successful save
    } catch (error) {
      console.error('Failed to update task status:', error);
      // You could add error handling UI here
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as TaskStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${statusInfo.bgColor} border ${statusInfo.borderColor} flex items-center justify-center`}>
              <div className="scale-125">
                {statusInfo.icon}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{task.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusInfo.color} border ${statusInfo.borderColor}`}>
                  {selectedStatus}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${priorityInfo.color} border ${priorityInfo.borderColor}`}>
                  {task.priority} Priority
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-base">{task.description}</p>
                  </div>
                </div>
                
                {/* Subtasks Section */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">Checklist</h3>
                      <span className="ml-auto text-sm text-gray-500">
                        {task.subtasks.filter(st => st.completed).length} of {task.subtasks.length} completed
                      </span>
                    </div>
                    <div className="space-y-3">
                      {task.subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                            subtask.completed
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}>
                            {subtask.completed && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className={`flex-1 text-base ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {subtask.name}
                          </span>
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            subtask.completed 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {subtask.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column - Sidebar */}
              <div className="space-y-8">
                {/* Task Details Card */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Details</h3>
                  <div className="space-y-6">
                    {/* Project */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Folder className="w-4 h-4" />
                        <span>Project</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                        <span className="font-medium text-gray-900">{task.projectName}</span>
                      </div>
                    </div>
                    
                    {/* Assignee */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Assignee</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {task.assigneeAvatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{task.assignee}</div>
                          <div className="text-sm text-gray-500">Assigned</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Due Date */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Due Date</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-base font-medium text-gray-900 mb-1">
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className={`text-sm font-medium ${
                          selectedStatus === 'Done' ? 'text-green-600' :
                          daysUntilDue < 0 ? 'text-red-600' :
                          'text-amber-600'
                        }`}>
                          {selectedStatus === 'Done' ? '✓ Completed' : 
                           daysUntilDue < 0 ? `⚠ ${Math.abs(daysUntilDue)} days overdue` :
                           daysUntilDue === 0 ? '⚠ Due today' :
                           daysUntilDue === 1 ? '⚠ Due tomorrow' :
                           `⏰ ${daysUntilDue} days remaining`}
                        </div>
                      </div>
                    </div>
                    
                    {/* Time Tracking */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Time Spent</span>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-base font-medium text-gray-900">
                            {task.actualHours}h / {task.estimatedHours}h
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            {completionPercentage}%
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tags Section */}
                {(task.tags || []).length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(task.tags || []).map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 border border-blue-200 rounded-xl text-sm font-medium hover:from-blue-100 hover:to-blue-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Status Update Section */}
                <div className="pt-6 border-t border-gray-200 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
                  <div className="space-y-4">
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      disabled={isSaving}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-3.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveChanges}
                        disabled={isSaving || selectedStatus === task.status}
                        className="px-4 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 text-base font-medium transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};