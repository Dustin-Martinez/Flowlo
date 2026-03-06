import React from "react";
import { Search } from "lucide-react";
import { TodoFilters as TodoFiltersType } from "@/src/app/types/todo";
import { STATUS_OPTIONS, SORT_OPTIONS } from "@/src/app/constants/taskConstants";

interface TodoFiltersProps {
  filters: TodoFiltersType;
  onFiltersChange: (filters: TodoFiltersType) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({ 
  filters, 
  onFiltersChange 
}) => {
  const statusOptions = ['all', ...STATUS_OPTIONS] as const;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => onFiltersChange({...filters, status})}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.status === status
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {status === 'all' ? 'All Tasks' : status}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c28b6] focus:border-transparent text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({...filters, sortBy: e.target.value as any})}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9c28b6] focus:border-transparent"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={() => onFiltersChange({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};