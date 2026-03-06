import React from "react";
import { TaskStatus, TaskPriority, StatusInfo, PriorityInfo } from "@/src/app/types/todo";
import { CheckCircle2, Clock, PlayCircle, PauseCircle, AlertCircle, Flag } from "lucide-react";

export const getStatusInfo = (status: TaskStatus): StatusInfo => {
  switch (status) {
    case 'Not started':
      return {
        icon: <Clock className="w-3.5 h-3.5" />,
        color: 'text-gray-600 bg-gray-50',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        dotColor: 'bg-gray-400',
        label: 'Not Started'
      };
    case 'In progress':
      return {
        icon: <PlayCircle className="w-3.5 h-3.5" />,
        color: 'text-blue-600 bg-blue-50',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        dotColor: 'bg-blue-500',
        label: 'In Progress'
      };
    case 'Done':
      return {
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        color: 'text-green-600 bg-green-50',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        dotColor: 'bg-green-500',
        label: 'Done'
      };
    case 'On hold':
      return {
        icon: <PauseCircle className="w-3.5 h-3.5" />,
        color: 'text-amber-600 bg-amber-50',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        dotColor: 'bg-amber-500',
        label: 'On Hold'
      };
    default:
      return {
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        color: 'text-gray-600 bg-gray-50',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        dotColor: 'bg-gray-400',
        label: 'Unknown'
      };
  }
};

export const getPriorityInfo = (priority: TaskPriority): PriorityInfo => {
  switch (priority) {
    case 'Urgent':
      return {
        icon: <Flag className="w-3 h-3" />,
        color: 'text-red-600 bg-red-50',
        borderColor: 'border-red-200',
        label: 'Urgent'
      };
    case 'High':
      return {
        icon: <Flag className="w-3 h-3" />,
        color: 'text-orange-600 bg-orange-50',
        borderColor: 'border-orange-200',
        label: 'High'
      };
    case 'Medium':
      return {
        icon: <Flag className="w-3 h-3" />,
        color: 'text-amber-600 bg-amber-50',
        borderColor: 'border-amber-200',
        label: 'Medium'
      };
    case 'Low':
      return {
        icon: <Flag className="w-3 h-3" />,
        color: 'text-green-600 bg-green-50',
        borderColor: 'border-green-200',
        label: 'Low'
      };
    default:
      return {
        icon: <Flag className="w-3 h-3" />,
        color: 'text-gray-600 bg-gray-50',
        borderColor: 'border-gray-200',
        label: 'Unknown'
      };
  }
};

export const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getDueDateColor = (dueDate: string, status: TaskStatus): string => {
  if (status === 'Done' || status === 'On hold') return 'text-gray-500';
  
  const daysUntilDue = getDaysUntilDue(dueDate);
  
  if (daysUntilDue < 0) return 'text-red-600';
  if (daysUntilDue === 0) return 'text-orange-600';
  if (daysUntilDue <= 2) return 'text-amber-600';
  return 'text-gray-600';
};

export const getDueDateText = (dueDate: string, status: TaskStatus): string => {
  if (status === 'Done') return 'Completed';
  
  const daysUntilDue = getDaysUntilDue(dueDate);
  
  if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)}d overdue`;
  if (daysUntilDue === 0) return 'Today';
  if (daysUntilDue === 1) return 'Tomorrow';
  return `${daysUntilDue}d left`;
};