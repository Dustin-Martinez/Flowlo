// app/dashboard/boards/create-branch/[branchId]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  Users,
  Calendar,
  Tag,
  CheckCircle,
  X,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  Copy,
  Share2,
  Download,
  ChevronDown,
  Folder,
  GitBranch,
  Settings,
  BarChart3,
  TrendingUp,
  Target,
  CheckSquare,
  ListTodo,
  CalendarDays,
  GanttChart,
  PieChart,
  FileText,
  MessageSquare,
  Paperclip,
  Eye,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Filter as FilterIcon,
  MoreHorizontal
} from "lucide-react";
import { 
  getBranchById,
  getProjectById,
  BoardBranch,
  getBranchTasks,
  getBranchPhases,
  createBranchPhase,
  updateBranchPhase,
  deleteBranchPhase,
  createBranchTask,
  updateBranchTask,
  deleteBranchTask,
  BranchTask,
  BranchTaskStatus,
  BranchTaskPriority,
} from "@/src/app/lib/projectService";

// Use the types from projectService
type TaskStatusType = BranchTaskStatus;
type TaskPriorityType = BranchTaskPriority;

// Available colors for phases
const phaseColors = [
  { id: 'blue', name: 'Blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  { id: 'green', name: 'Green', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { id: 'orange', name: 'Orange', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  { id: 'red', name: 'Red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  { id: 'gray', name: 'Gray', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
  { id: 'pink', name: 'Pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
];

// Task Card Component
const TaskCard = ({ 
  task, 
  onEdit,
  onDelete,
  onStatusChange
}: { 
  task: BranchTask;
  onEdit: (task: BranchTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatusType) => void;
}) => {
  const getPriorityColor = (priority: TaskPriorityType) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: TaskStatusType) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      case 'blocked': return 'bg-red-100 text-red-700';
      case 'todo': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-choco-300 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onStatusChange(task.id, task.status === 'completed' ? 'todo' : 'completed')}
            className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              task.status === 'completed'
                ? 'bg-choco-500 border-choco-500'
                : 'border-gray-300 hover:border-choco-300'
            }`}
          >
            {task.status === 'completed' && (
              <CheckCircle className="w-3 h-3 text-white" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{task.title}</h4>
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">{task.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          Due {formatDate(task.dueDate)}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {task.assignees?.slice(0, 3).map((assignee, idx) => (
              <div
                key={idx}
                className="w-6 h-6 rounded-full bg-choco-100 border-2 border-white text-xs flex items-center justify-center text-choco-700 font-medium"
              >
                {assignee.charAt(0)}
              </div>
            ))}
            {task.assignees && task.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white text-xs flex items-center justify-center text-gray-600">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {task.comments > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments}</span>
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachments}</span>
            </div>
          )}
        </div>
      </div>
      
      {task.progress > 0 && task.progress < 100 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-choco-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Phase Column Component
const PhaseColumn = ({ 
  phase,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onStatusChange,
  onAddTask,
  onEditPhase,
  onDeletePhase
}: { 
  phase: { id: string; title: string; description?: string; color: string };
  tasks: BranchTask[];
  onTaskEdit: (task: BranchTask) => void;
  onTaskDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatusType) => void;
  onAddTask: (phaseId: string) => void;
  onEditPhase: (phaseId: string) => void;
  onDeletePhase: (phaseId: string) => void;
}) => {
  const [showPhaseMenu, setShowPhaseMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getPhaseColor = (colorId: string) => {
    const color = phaseColors.find(c => c.id === colorId) || phaseColors[0];
    return `${color.bg} ${color.border} ${color.text}`;
  };

  const getColorValue = (colorId: string) => {
    switch (colorId) {
      case 'blue': return '#3b82f6';
      case 'purple': return '#8b5cf6';
      case 'green': return '#10b981';
      case 'orange': return '#f59e0b';
      case 'red': return '#ef4444';
      case 'pink': return '#ec4899';
      case 'indigo': return '#6366f1';
      default: return '#6b7280';
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPhaseMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-80 flex-shrink-0">
      <div className={`rounded-lg border ${getPhaseColor(phase.color)} p-4 mb-4 relative`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-lg">{phase.title}</h3>
            {phase.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{phase.description}</p>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowPhaseMenu(!showPhaseMenu)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showPhaseMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEditPhase(phase.id);
                    setShowPhaseMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Phase
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${phase.title}" phase? This will also delete all tasks in this phase.`)) {
                      onDeletePhase(phase.id);
                    }
                    setShowPhaseMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Phase
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 bg-white text-gray-600 text-xs rounded-full font-medium">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
          <div className="text-xs text-gray-500">
            {completedTasks}/{totalTasks} done
          </div>
        </div>
        
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-70 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: getColorValue(phase.color)
                }}
              ></div>
            </div>
          </div>
        )}
        
        <button
          onClick={() => onAddTask(phase.id)}
          className="w-full py-2 border border-dashed border-gray-300 rounded-lg hover:border-choco-300 hover:bg-white transition-colors flex items-center justify-center gap-2 text-sm text-gray-600"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
            onStatusChange={onStatusChange}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ListTodo className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">No tasks in this phase</p>
            <button
              onClick={() => onAddTask(phase.id)}
              className="text-sm text-choco-600 hover:text-choco-700 font-medium"
            >
              + Add first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Progress Chart Component
const ProgressChart = ({ progress }: { progress: number }) => {
  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#92400e"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress * 2.513}, 251.3`}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-900">{progress}%</span>
      </div>
    </div>
  );
};

export default function BranchWorkflowPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.branchId as string;
  
  const [branch, setBranch] = useState<BoardBranch | null>(null);
  const [tasks, setTasks] = useState<BranchTask[]>([]);
  // CHANGED: Start with empty phases array instead of default phases
  const [phases, setPhases] = useState<{ id: string; title: string; description?: string; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI States
  const [activeView, setActiveView] = useState<'workflow' | 'calendar' | 'timeline'>('workflow');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreatePhase, setShowCreatePhase] = useState(false);
  const [showEditPhase, setShowEditPhase] = useState<string | null>(null);
  const [showEditTask, setShowEditTask] = useState<BranchTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    phase: '',
    priority: 'medium' as TaskPriorityType,
    status: 'todo' as TaskStatusType,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignees: [] as string[],
    estimatedHours: 8,
    tags: [] as string[]
  });

  // Phase form state
  const [phaseForm, setPhaseForm] = useState({
    title: '',
    description: '',
    color: 'blue'
  });

  // Team members from project (same as project folder team – no mock)
  const [teamMembers, setTeamMembers] = useState<{ id: string; name: string; role: string }[]>([]);

  // Load branch data, phases, project team, and tasks from API
  useEffect(() => {
    const loadBranchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const branchData = await getBranchById(branchId);
        if (!branchData) {
          throw new Error('Branch not found');
        }

        setBranch(branchData);

        const [phasesData, tasksData] = await Promise.all([
          getBranchPhases(branchId, branchData.projectId),
          getBranchTasks(branchId, branchData.projectId)
        ]);

        setPhases(phasesData);
        setTasks(tasksData);

        // Load project team for assignee options (project members only, no mock)
        const project = await getProjectById(branchData.projectId);
        if (project?.team && Array.isArray(project.team)) {
          setTeamMembers(
            project.team.map((t: { id: string; name: string; role: string; avatar?: string }) => ({
              id: t.id,
              name: t.name,
              role: t.role
            }))
          );
        } else {
          setTeamMembers([]);
        }
      } catch (error) {
        console.error('Error loading branch:', error);
        setError('Failed to load branch data');
      } finally {
        setIsLoading(false);
      }
    };

    loadBranchData();
  }, [branchId]);

  // Calculate statistics
  const calculateStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate phase distribution
    const phaseDistribution = phases.map(phase => ({
      ...phase,
      count: tasks.filter(t => t.phase === phase.id).length,
      completed: tasks.filter(t => t.phase === phase.id && t.status === 'completed').length
    }));

    return { totalTasks, completedTasks, inProgressTasks, overdueTasks, progress, phaseDistribution };
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPhase = selectedPhase === 'all' || task.phase === selectedPhase;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    
    return matchesSearch && matchesPhase && matchesStatus;
  });

  // Group tasks by phase for workflow view
  const tasksByPhase = phases.map(phase => ({
    ...phase,
    tasks: filteredTasks.filter(task => task.phase === phase.id)
  }));

  // Handle task status change
  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatusType) => {
    if (!branch) return;
    try {
      const updated = await updateBranchTask(branchId, taskId, {
        status: newStatus,
        progress: newStatus === 'completed' ? 100 : undefined,
      });
      if (updated) {
        setTasks(prev => prev.map(t =>
          t.id === taskId
            ? { ...t, status: newStatus, progress: newStatus === 'completed' ? 100 : t.progress }
            : t
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle create task
  const handleCreateTask = async () => {
    try {
      if (!branch) return;

      // NEW: Check if there are phases before creating task
      if (phases.length === 0) {
        alert("Please create at least one phase before adding tasks.");
        setShowCreateTask(false);
        setShowCreatePhase(true);
        return;
      }

      // Ensure task has a valid phase
      const taskPhase = taskForm.phase || phases[0]?.id;
      if (!taskPhase) {
        alert("No phases available. Please create a phase first.");
        return;
      }

      const newTask = await createBranchTask(branchId, {
        title: taskForm.title,
        description: taskForm.description,
        phase: taskPhase,
        priority: taskForm.priority,
        dueDate: taskForm.dueDate,
        assignees: taskForm.assignees,
        estimatedHours: taskForm.estimatedHours,
        tags: taskForm.tags
      });

      setTasks(prev => [...prev, newTask]);
      setShowCreateTask(false);
      resetTaskForm();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Handle update task
  const handleUpdateTask = async () => {
    if (!showEditTask || !branch) return;

    try {
      const updatedTask = await updateBranchTask(branchId, showEditTask.id, {
        title: taskForm.title,
        description: taskForm.description,
        phase: taskForm.phase || phases[0]?.id || '',
        priority: taskForm.priority,
        status: taskForm.status,
        dueDate: taskForm.dueDate,
        assignees: taskForm.assignees,
        tags: taskForm.tags,
        estimatedHours: taskForm.estimatedHours,
        progress: taskForm.status === 'completed' ? 100 : showEditTask.progress
      });

      if (updatedTask) {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
        setShowEditTask(null);
        resetTaskForm();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const success = await deleteBranchTask(branchId, taskId);
        if (success) {
          setTasks(prev => prev.filter(t => t.id !== taskId));
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Handle create phase (API)
  const handleCreatePhase = async () => {
    if (!phaseForm.title.trim() || !branch) return;

    const newPhase = await createBranchPhase(branchId, branch.projectId, {
      title: phaseForm.title,
      description: phaseForm.description || undefined,
      color: phaseForm.color
    });

    if (newPhase) {
      setPhases(prev => [...prev, newPhase]);
      setShowCreatePhase(false);
      resetPhaseForm();
      if (phases.length === 0) {
        setTaskForm(prev => ({ ...prev, phase: newPhase.id }));
      }
    }
  };

  // Handle update phase (API)
  const handleUpdatePhase = async () => {
    if (!showEditPhase || !phaseForm.title.trim()) return;

    const success = await updateBranchPhase(branchId, showEditPhase, {
      title: phaseForm.title,
      description: phaseForm.description || undefined,
      color: phaseForm.color
    });

    if (success) {
      setPhases(prev => prev.map(phase =>
        phase.id === showEditPhase
          ? { ...phase, title: phaseForm.title, description: phaseForm.description || undefined, color: phaseForm.color }
          : phase
      ));
      setShowEditPhase(null);
      resetPhaseForm();
    }
  };

  // Handle delete phase (API - cascades to delete cards in phase)
  const handleDeletePhase = async (phaseId: string) => {
    const success = await deleteBranchPhase(branchId, phaseId);
    if (success) {
      setTasks(prev => prev.filter(task => task.phase !== phaseId));
      setPhases(prev => prev.filter(phase => phase.id !== phaseId));
    }
  };

  // Reset task form
  const resetTaskForm = () => {
    setTaskForm({
      title: '',
      description: '',
      phase: phases[0]?.id || '',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignees: [],
      estimatedHours: 8,
      tags: []
    });
  };

  // Reset phase form
  const resetPhaseForm = () => {
    setPhaseForm({
      title: '',
      description: '',
      color: 'blue'
    });
  };

  // Load task data into form for editing
  const loadTaskForEditing = (task: BranchTask) => {
    setShowEditTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      phase: task.phase,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate.split('T')[0],
      assignees: task.assignees || [],
      estimatedHours: task.estimatedHours || 8,
      tags: task.tags || []
    });
  };

  // Load phase data into form for editing
  const loadPhaseForEditing = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (phase) {
      setShowEditPhase(phaseId);
      setPhaseForm({
        title: phase.title,
        description: phase.description || '',
        color: phase.color
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-choco-200 border-t-choco-600 rounded-full animate-spin"></div>
          <div className="text-choco-600 text-sm">Loading branch workflow...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !branch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Branch</h2>
          <p className="text-gray-600 text-sm mb-4">{error || 'Branch not found'}</p>
          <button
            onClick={() => router.push('/dashboard/boards')}
            className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors text-sm"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{branch.title}</h1>
                <p className="text-gray-600 text-sm">{branch.department} • Custom Workflow Board</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ProgressChart progress={stats.progress} />
                <div>
                  <div className="text-sm font-medium text-gray-900">{stats.progress}% Complete</div>
                  <div className="text-xs text-gray-500">{stats.completedTasks} of {stats.totalTasks} tasks</div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{stats.completedTasks} done</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>{stats.inProgressTasks} in progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>{stats.overdueTasks} overdue</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('workflow')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeView === 'workflow'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Workflow
                </button>
                <button
                  onClick={() => setActiveView('calendar')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeView === 'calendar'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setActiveView('timeline')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeView === 'timeline'
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Timeline
                </button>
              </div>
              
              <button
                onClick={() => setShowCreatePhase(true)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Phase
              </button>
              
              <button
                onClick={() => {
                  if (phases.length === 0) {
                    alert("Please create a phase first before adding tasks.");
                    setShowCreatePhase(true);
                    return;
                  }
                  setTaskForm(prev => ({ ...prev, phase: phases[0]?.id || '' }));
                  setShowCreateTask(true);
                }}
                className="px-4 py-2 bg-choco-600 text-white rounded hover:bg-choco-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        <div className="max-w-full mx-auto">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Phases</option>
                  {phases.map(phase => (
                    <option key={phase.id} value={phase.id}>{phase.title}</option>
                  ))}
                </select>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredTasks.length} tasks</span>
              <span className="text-gray-300">•</span>
              <span>{phases.length} phases</span>
              <span className="text-gray-300">•</span>
              <span>{stats.completedTasks} completed</span>
            </div>
          </div>

          {/* Workflow View */}
          {activeView === 'workflow' && (
            <div>
              {/* Phase Overview - Only show if there are phases */}
              {phases.length > 0 ? (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Workflow Phases</h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Drag tasks between phases</span>
                        <button
                          onClick={() => setShowCreatePhase(true)}
                          className="text-choco-600 hover:text-choco-700 font-medium"
                        >
                          + Add new phase
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {stats.phaseDistribution.map(phase => {
                        const color = phaseColors.find(c => c.id === phase.color) || phaseColors[0];
                        return (
                          <div key={phase.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${color.bg.replace('50', '500')}`}></div>
                                <span className="text-sm font-medium text-gray-900">{phase.title}</span>
                              </div>
                              <span className="text-xs text-gray-500">{phase.count}</span>
                            </div>
                            {phase.description && (
                              <div className="text-xs text-gray-600 mb-3 line-clamp-2">{phase.description}</div>
                            )}
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{phase.completed}/{phase.count} done</span>
                              <span className="font-medium text-gray-700">
                                {phase.count > 0 ? Math.round((phase.completed / phase.count) * 100) : 0}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Phase Columns */}
                  <div className="overflow-x-auto pb-4">
                    <div className="flex gap-4 min-w-max">
                      {tasksByPhase.map(phase => (
                        <PhaseColumn
                          key={phase.id}
                          phase={phase}
                          tasks={phase.tasks}
                          onTaskEdit={loadTaskForEditing}
                          onTaskDelete={handleDeleteTask}
                          onStatusChange={handleTaskStatusChange}
                          onAddTask={(phaseId) => {
                            setTaskForm(prev => ({ ...prev, phase: phaseId }));
                            setShowCreateTask(true);
                          }}
                          onEditPhase={loadPhaseForEditing}
                          onDeletePhase={handleDeletePhase}
                        />
                      ))}
                      
                      {/* Add Phase Column */}
                      <div className="w-80 flex-shrink-0">
                        <button
                          onClick={() => setShowCreatePhase(true)}
                          className="w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg hover:border-choco-300 hover:bg-choco-50 transition-colors flex flex-col items-center justify-center gap-3 p-8"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plus className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-medium text-gray-900 mb-1">Add New Phase</h3>
                            <p className="text-gray-600 text-sm">Create a custom workflow phase</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Empty state when no phases exist
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <div className="w-20 h-20 bg-choco-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <GitBranch className="w-10 h-10 text-choco-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Create Your First Phase</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start by creating workflow phases to organize your tasks. You can customize phases, colors, and order to match your team's process.
                  </p>
                  <button
                    onClick={() => setShowCreatePhase(true)}
                    className="px-6 py-3 bg-choco-600 text-black rounded-lg hover:bg-choco-700 transition-colors font-medium"
                  >
                    Create Your First Phase
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Calendar View Placeholder */}
          {activeView === 'calendar' && (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-choco-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-choco-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600 text-sm mb-4">Visualize tasks on a timeline calendar</p>
              {phases.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-amber-800 text-sm">
                    Please create workflow phases first to use the calendar view.
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-xs">Calendar view coming soon</p>
              )}
            </div>
          )}

          {/* Timeline View Placeholder */}
          {activeView === 'timeline' && (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-choco-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <GanttChart className="w-8 h-8 text-choco-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline View</h3>
              <p className="text-gray-600 text-sm mb-4">Gantt chart timeline of all tasks</p>
              {phases.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-amber-800 text-sm">
                    Please create workflow phases first to use the timeline view.
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-xs">Timeline view coming soon</p>
              )}
            </div>
          )}

          {/* Quick Stats - Only show if there are phases */}
          {phases.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Productivity</h3>
                    <p className="text-gray-600 text-xs">Tasks completed this week</p>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {Math.round((stats.completedTasks / Math.max(stats.totalTasks, 1)) * 100)}%
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">On Track</h3>
                    <p className="text-gray-600 text-xs">Tasks within deadline</p>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {stats.totalTasks - stats.overdueTasks} / {stats.totalTasks}
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Team Load</h3>
                    <p className="text-gray-600 text-xs">Active assignments</p>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {tasks.reduce((acc, task) => acc + (task.assignees?.length || 0), 0)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Task Modal */}
      {(showCreateTask || showEditTask) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateTask(false);
                  setShowEditTask(null);
                  resetTaskForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* CHANGED: Show warning if no phases exist */}
            {phases.length === 0 && !showEditTask && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">No Phases Available</span>
                </div>
                <p className="text-red-600 text-sm mb-3">
                  You need to create at least one phase before adding tasks.
                </p>
                <button
                  onClick={() => {
                    setShowCreateTask(false);
                    setShowCreatePhase(true);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Create Phase First
                </button>
              </div>
            )}
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phase
                  </label>
                  {phases.length > 0 ? (
                    <select
                      value={taskForm.phase}
                      onChange={(e) => setTaskForm({...taskForm, phase: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900"
                    >
                      {phases.map(phase => (
                        <option key={phase.id} value={phase.id}>{phase.title}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 border border-red-300 bg-red-50 rounded-lg text-red-700 text-sm">
                      No phases available. Please create a phase first.
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Describe the task requirements..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({...taskForm, status: e.target.value as TaskStatusType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="blocked">Blocked</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({...taskForm, priority: e.target.value as TaskPriorityType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={taskForm.estimatedHours}
                    onChange={(e) => setTaskForm({...taskForm, estimatedHours: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={taskForm.tags.join(', ')}
                    onChange={(e) => setTaskForm({
                      ...taskForm, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Design, Frontend, Bug"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignees
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {taskForm.assignees.map(assigneeId => {
                    const member = teamMembers.find(m => m.id === assigneeId);
                    return member ? (
                      <div key={assigneeId} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="text-sm text-gray-700">{member.name}</span>
                        <button
                          type="button"
                          onClick={() => setTaskForm({
                            ...taskForm,
                            assignees: taskForm.assignees.filter(id => id !== assigneeId)
                          })}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {teamMembers.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        if (!taskForm.assignees.includes(member.id)) {
                          setTaskForm({
                            ...taskForm,
                            assignees: [...taskForm.assignees, member.id]
                          });
                        }
                      }}
                      disabled={taskForm.assignees.includes(member.id)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        taskForm.assignees.includes(member.id)
                          ? 'bg-gray-100 border-gray-300 opacity-60'
                          : 'border-gray-200 hover:border-choco-300 hover:bg-choco-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-choco-100 text-choco-600 text-sm flex items-center justify-center">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateTask(false);
                  setShowEditTask(null);
                  resetTaskForm();
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditTask ? handleUpdateTask : handleCreateTask}
                className="px-4 py-2 bg-choco-600 text-black rounded-lg hover:bg-choco-700 transition-colors"
                disabled={!taskForm.title.trim() || (phases.length === 0 && !showEditTask)}
              >
                {showEditTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Phase Modal */}
      {(showCreatePhase || showEditPhase) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {showEditPhase ? 'Edit Phase' : 'Create New Phase'}
              </h3>
              <button
                onClick={() => {
                  setShowCreatePhase(false);
                  setShowEditPhase(null);
                  resetPhaseForm();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phase Name *
                </label>
                <input
                  type="text"
                  value={phaseForm.title}
                  onChange={(e) => setPhaseForm({...phaseForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Planning, Execution, Review"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={phaseForm.description}
                  onChange={(e) => setPhaseForm({...phaseForm, description: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-choco-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-none"
                  placeholder="Brief description of this phase"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {phaseColors.map(color => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setPhaseForm({...phaseForm, color: color.id})}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        phaseForm.color === color.id 
                          ? 'border-choco-500 bg-choco-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${color.bg} ${color.border} flex items-center justify-center`}>
                        {phaseForm.color === color.id && (
                          <CheckCircle className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreatePhase(false);
                  setShowEditPhase(null);
                  resetPhaseForm();
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showEditPhase ? handleUpdatePhase : handleCreatePhase}
                className="px-4 py-2 bg-choco-600 text-black rounded-lg hover:bg-choco-700 transition-colors"
                disabled={!phaseForm.title.trim()}
              >
                {showEditPhase ? 'Update Phase' : 'Create Phase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}