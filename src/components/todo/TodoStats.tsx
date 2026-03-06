import React from "react";
import { TaskStats } from "@/src/app/types/todo";
import { ListTodo, CheckSquare, PlayCircle, AlertCircle, BarChart3 } from "lucide-react";

interface TodoStatsProps {
  stats: TaskStats;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ stats }) => {
  const statItems = [
    {
      icon: <ListTodo className="w-5 h-5 text-gray-600" />,
      bgColor: "bg-gray-100",
      label: "Total Tasks",
      value: stats.total
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      label: "Completed",
      value: stats.completed
    },
    {
      icon: <PlayCircle className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      label: "In Progress",
      value: stats.inProgress
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      bgColor: "bg-red-50",
      label: "Overdue",
      value: stats.overdue
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      bgColor: "bg-purple-50",
      label: "Completion Rate",
      value: `${stats.completionRate}%`
    }
  ];

  return (
    <div className="px-8 pt-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                {item.icon}
              </div>
              <div>
                <div className="text-sm text-gray-600">{item.label}</div>
                <div className="text-xl font-semibold text-gray-900">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};