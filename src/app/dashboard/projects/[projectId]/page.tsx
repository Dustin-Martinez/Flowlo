"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Settings, 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  CheckCircle2,
  Circle,
  Clock,
  User,
  Tag as TagIcon,
  MessageSquare,
  Paperclip,
  Trash2,
  AlertCircle
} from "lucide-react";
import ProjectSettings from "@/src/components/dashboard/ProjectSettings";
import { getProjectById, updateProject, type Project } from "@/src/app/lib/projectService";
import { 
  getTasksByProjectId,
  createTask,
  updateTaskStatus,
  deleteTask,
  type Task,
  type NewTaskForm
} from "@/src/app/lib/taskService";
import {
  isValidStatus,
  isValidPriority,
  getPriorityColor,
  getStatusColor,
  getStatusIcon,
  statusOptions,
  priorityOptions,
  formatDate,
  calculateProgress
} from "@/src/app/utils/projectHelpers";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "todo" | "in-progress" | "done">("all");
  const [activeView, setActiveView] = useState<"overview" | "settings">("overview");
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  
  const [newTask, setNewTask] = useState<NewTaskForm>({
    name: "",
    description: "",
    assignee: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    tags: []
  });

  // Load project data and tasks
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const projectData = await getProjectById(projectId);
        if (projectData) {
          setProject(projectData);
          const projectTasks = await getTasksByProjectId(projectId);
          setTasks(projectTasks);
        } else {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadData();
    }
  }, [projectId, router]);

  // Update project progress when tasks change
  useEffect(() => {
    if (project && tasks.length >= 0) {
      const newProgress = calculateProgress(tasks);
      const updatedProject = {
        ...project,
        progress: newProgress,
        tasks: tasks.length,
        lastUpdated: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      // Update local state
      setProject(updatedProject);
      
      // Save to service
      updateProject(projectId, updatedProject).catch(console.error);
    }
  }, [tasks, projectId]);

  // Handle project update from settings
  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
    setActiveView("overview");
  };

  // Filter tasks based on search and status filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === "" || 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || task.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Add new task
  const handleAddTask = async () => {
    if (newTask.name.trim() && project) {
      const task = await createTask(projectId, newTask, project.name, project.color);
      setTasks([...tasks, task]);
      setNewTask({
        name: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        tags: []
      });
      setIsAddingTask(false);
    }
  };

  // Update task status
  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    const updatedTask = await updateTaskStatus(projectId, taskId, newStatus);
    if (updatedTask) {
      setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    const success = await deleteTask(projectId, taskId);
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId));
      setTaskToDelete(null);
    }
  };

  // Type-safe handlers for select changes
  const handleStatusChangeSelect = (value: string) => {
    if (isValidStatus(value)) {
      setNewTask(prev => ({ ...prev, status: value }));
    }
  };

  const handlePriorityChangeSelect = (value: string) => {
    if (isValidPriority(value)) {
      setNewTask(prev => ({ ...prev, priority: value }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }

  if (!project) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0] p-6">
      {/* Delete Task Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Delete Task</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this task?</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mt-1"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">Dashboard</span>
            </button>
            
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl font-medium text-gray-900">{project.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  project.status === 'active' ? 'bg-green-100 text-green-800' :
                  project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView(activeView === "settings" ? "overview" : "settings")}
              className={`p-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                activeView === "settings" 
                  ? "bg-gray-900 text-white" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </button>
            <button 
              onClick={() => setIsAddingTask(true)}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveView("overview")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === "overview" 
                ? "bg-gray-900 text-white" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView("settings")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === "settings" 
                ? "bg-gray-900 text-white" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Project Stats Bar (Only show in overview) */}
        {activeView === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-sm text-gray-500 mb-2">Progress</div>
              <div className="flex items-baseline gap-3">
                <div className="text-2xl font-medium text-gray-900">{project.progress}%</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full bg-gradient-to-r ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-sm text-gray-500 mb-2">Tasks</div>
              <div className="text-2xl font-medium text-gray-900">{tasks.length}</div>
              <div className="text-xs text-gray-500 mt-1">
                {tasks.filter(t => t.status === 'done').length} completed
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-sm text-gray-500 mb-2">Team</div>
              <div className="text-2xl font-medium text-gray-900">{project.members}</div>
              <div className="text-xs text-gray-500 mt-1">members</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-sm text-gray-500 mb-2">Last Updated</div>
              <div className="text-lg font-medium text-gray-900">{project.lastUpdated}</div>
              <div className="text-xs text-gray-500 mt-1">
                {project.deadline && `Due: ${formatDate(project.deadline)}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeView === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-2">
            {/* Tasks Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Tasks</h2>
                  <p className="text-sm text-gray-600">Manage project tasks and assignments</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="pl-10 pr-4 py-2.5 w-48 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                    {(["all", "todo", "in-progress", "done"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setActiveFilter(status)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          activeFilter === status
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {status === 'all' ? 'All' : 
                         status === 'in-progress' ? 'In Progress' : 
                         status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Task Form */}
              {isAddingTask && (
                <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={newTask.name}
                          onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                          placeholder="Task title"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                          autoFocus
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <textarea
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          placeholder="Description"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                          rows={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Assignee</label>
                        <input
                          type="text"
                          value={newTask.assignee}
                          onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                          placeholder="Assign to..."
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Due Date</label>
                        <input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Status</label>
                        <select
                          value={newTask.status}
                          onChange={(e) => handleStatusChangeSelect(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => handlePriorityChangeSelect(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setIsAddingTask(false)}
                        className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTask}
                        className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => handleStatusChange(task.id, 
                              task.status === 'done' ? 'todo' : 
                              task.status === 'in-progress' ? 'done' : 'in-progress'
                            )}
                            className={`p-1.5 rounded-lg ${getStatusColor(task.status)}`}
                          >
                            {getStatusIcon(task.status)}
                          </button>
                          <h3 className="font-medium text-gray-900">{task.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <User size={14} className="text-gray-400" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Paperclip size={14} className="text-gray-400" />
                              <span>{task.attachments}</span>
                            </div>
                          )}
                          {task.comments > 0 && (
                            <div className="flex items-center gap-1.5">
                              <MessageSquare size={14} className="text-gray-400" />
                              <span>{task.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {task.status === 'done' && (
                          <button
                            onClick={() => setTaskToDelete(task.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete task"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery ? 'Try adjusting your search' : 'Get started by creating a new task'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={() => setIsAddingTask(true)}
                        className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add First Task
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Add Task Button */}
              {filteredTasks.length > 0 && !isAddingTask && (
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Plus size={18} />
                  <span>Add New Task</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Project Details */}
          <div className="space-y-6">
            {/* Team Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Users size={18} />
                <span>Team Members</span>
              </h3>
              
              <div className="space-y-4">
                {project.team && project.team.length > 0 ? (
                  project.team.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{member.avatar}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No team members added yet</div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <TagIcon size={18} />
                <span>Project Tags</span>
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags added yet</span>
                )}
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Overview</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-medium text-gray-900">
                      {tasks.filter(t => t.status === 'todo').length}
                    </div>
                    <div className="text-xs text-gray-500">To Do</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-medium text-gray-900">
                      {tasks.filter(t => t.status === 'in-progress').length}
                    </div>
                    <div className="text-xs text-gray-500">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-medium text-gray-900">
                      {tasks.filter(t => t.status === 'done').length}
                    </div>
                    <div className="text-xs text-gray-500">Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Settings View */
        <ProjectSettings 
          project={project}
          onSave={handleProjectUpdate}
          onCancel={() => setActiveView("overview")}
        />
      )}
    </div>
  );
}