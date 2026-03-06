import { useState, useMemo } from "react";
import { Task, TodoFilters } from "@/src/app/types/todo";
import { getDaysUntilDue } from "@/src/app/utils/taskUtils";

export const useTaskFilters = (tasks: Task[]) => {
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.name.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [tasks, filters]);

  const statsByStatus = useMemo(() => {
    const result = {
      'Not started': 0,
      'In progress': 0,
      'Done': 0,
      'On hold': 0
    };
    
    filteredAndSortedTasks.forEach(task => {
      if (task.status in result) {
        result[task.status as keyof typeof result]++;
      }
    });
    
    return result;
  }, [filteredAndSortedTasks]);

  const overdueTasks = useMemo(() => {
    return filteredAndSortedTasks.filter(task => {
      return task.status !== 'Done' && getDaysUntilDue(task.dueDate) < 0;
    });
  }, [filteredAndSortedTasks]);

  return {
    filters,
    setFilters,
    filteredAndSortedTasks,
    statsByStatus,
    overdueTasks
  };
};