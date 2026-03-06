import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Task, NewTaskForm } from "@/src/app/types/project";
import { Project } from "@/src/app/lib/projectService";
import { calculateProgress } from "@/src/app/utils/task";

export const useProjectTasks = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // FIXED: Properly typed newTask state
  const [newTask, setNewTask] = useState<NewTaskForm>({
    name: "",
    description: "",
    assignee: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    tags: []
  });

  // Load project data from JSON
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const { getProjectById } = await import("@/src/app/lib/projectService");
        const projectData = await getProjectById(projectId);
        if (projectData) {
          setProject(projectData);
          
          // Load tasks from localStorage for this project
          const storedTasks = localStorage.getItem(`tasks_${projectId}`);
          if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
          } else {
            // If no tasks exist, start with empty array
            setTasks([]);
            localStorage.setItem(`tasks_${projectId}`, JSON.stringify([]));
          }
        } else {
          // Project not found, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      loadProject();
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
      const updateProjectAsync = async () => {
        const { updateProject } = await import("@/src/app/lib/projectService");
        await updateProject(projectId, updatedProject);
      };
      updateProjectAsync().catch(console.error);
    }
  }, [tasks, projectId, project]);

  // Add new task
  const handleAddTask = () => {
    if (newTask.name.trim()) {
      const task: Task = {
        id: `task-${Date.now()}`,
        name: newTask.name,
        description: newTask.description,
        assignee: newTask.assignee || "Unassigned",
        assigneeAvatar: newTask.assignee 
          ? newTask.assignee.split(' ').map(n => n[0]).join('').toUpperCase()
          : "UN",
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        tags: newTask.tags,
        attachments: 0,
        comments: 0
      };
      
      const updatedTasks = [...tasks, task];
      setTasks(updatedTasks);
      localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updatedTasks));
      
      setNewTask({
        name: "",
        description: "",
        assignee: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        tags: []
      });
      return true;
    }
    return false;
  };

  // Update task status
  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updatedTasks));
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updatedTasks));
  };

  return {
    project,
    tasks,
    isLoading,
    newTask,
    setProject,
    setTasks,
    setNewTask,
    handleAddTask,
    handleStatusChange,
    handleDeleteTask
  };
};