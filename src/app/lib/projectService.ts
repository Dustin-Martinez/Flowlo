// lib/projectService.ts
export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  color: string;
  tasks: number;
  members: number;
  lastUpdated: string;
  status?: "active" | "completed" | "on-hold" | "archived";
  deadline?: string;
  tags?: string[];
  team?: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
  }>;
};

export type DashboardData = {
  stats: Array<{
    id: string;
    label: string;
    value: string;
    change: string;
    color: string;
  }>;
  projects: Project[];
};

// Task Types
export type TaskStatus = 'Not started' | 'In progress' | 'Done' | 'On hold';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type Task = {
  id: string;
  projectId: string;
  projectName: string;
  projectColor: string;
  name: string;
  description: string;
  assignee: string;
  assigneeAvatar: string;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  endDate: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  attachments: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dependencies?: string[];
  subtasks?: Array<{
    id: string;
    name: string;
    completed: boolean;
  }>;
};

export type ProjectWithTasks = Project & {
  tasks?: Task[];
};

// Board Types (Connected to Projects)
export type BoardCardStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'completed' | 'blocked';
export type BoardCardPriority = 'low' | 'medium' | 'high' | 'critical';

export type BoardCard = {
  id: string;
  boardId: string;
  projectId: string;
  title: string;
  description: string;
  status: BoardCardStatus;
  priority: BoardCardPriority;
  assignee: string;
  assigneeAvatar: string;
  dueDate: string;
  tags: string[];
  attachments: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
};

export type BoardColumn = {
  id: string;
  title: string;
  color: string;
  cards: BoardCard[];
};

export type Board = {
  id: string;
  projectId: string;
  projectName: string;
  projectColor: string;
  title: string;
  description: string;
  color: string;
  columns: number;
  cards: number;
  team: string[];
  lastUpdated: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  createdBy: string;
  status: "active" | "archived";
};

export type BoardStats = {
  totalBoards: number;
  totalCards: number;
  activeBoards: number;
  favoriteBoards: number;
  teamMembers: number;
  cardsByStatus: {
    todo: number;
    'in-progress': number;
    review: number;
    done: number;
  };
};

// Branch Types
export type WorkflowType = 'development' | 'marketing' | 'design' | 'qa' | 'operations' | 'custom';

export type BoardBranch = {
  id: string;
  parentBoardId: string;
  title: string;
  description: string;
  department: string;
  color: string;
  columns: number;
  cards: number;
  team: string[];
  lastUpdated: string;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  createdBy: string;
  status: "active" | "archived";
  workflowType: WorkflowType;
  projectId: string;
  projectName: string;
  projectColor: string;
};

// Update the Board type to include branches
export type BoardWithBranches = Board & {
  branches?: BoardBranch[];
};

// NEW: Add Branch Task Types for the page.tsx - these are ALIASES to existing types
export type BranchTaskStatus = BoardCardStatus;
export type BranchTaskPriority = BoardCardPriority;

// NEW: BranchTask extends BoardCard with additional properties
export interface BranchTask extends Omit<BoardCard, 'status' | 'priority'> {
  phase: string;
  progress: number;
  assignees: string[];
  tags: string[];
  comments: number;
  attachments: number;
  description: string;
  estimatedHours: number;
  dueDate: string;
  status: BranchTaskStatus;
  priority: BranchTaskPriority;
}

// Use API (MySQL) when in browser
const useApi = typeof window !== 'undefined';

// Get all projects from API (MySQL). Returns [] when not logged in or error (no floating data).
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    if (useApi) {
      const res = await fetch('/api/projects', { credentials: 'include' });
      if (res.ok) return await res.json();
      return [];
    }
    return [];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

// Get a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/projects/${id}`, { credentials: 'include' });
      if (res.ok) return await res.json();
      if (res.status === 404) return null;
    }
    const projects = await getAllProjects();
    return projects.find(project => project.id === id) || null;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
};

// Create a new project (API/MySQL)
export const createProject = async (project: Omit<Project, 'id' | 'lastUpdated'>): Promise<Project> => {
  try {
    if (useApi) {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(project),
      });
      if (res.ok) {
        const newProject = await res.json();
        await createBoardForProject(newProject);
        return newProject;
      }
    }
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      lastUpdated: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    const existingProjects = await getAllProjects();
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardProjects', JSON.stringify([...existingProjects, newProject]));
    }
    await createBoardForProject(newProject);
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    }
    const projects = await getAllProjects();
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) return null;
    const updatedProject = {
      ...projects[projectIndex],
      ...updates,
      lastUpdated: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    projects[projectIndex] = updatedProject;
    if (typeof window !== 'undefined') localStorage.setItem('dashboardProjects', JSON.stringify(projects));
    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
};

// Delete a project (API + clear local board data)
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) return false;
      if (typeof window !== 'undefined') {
        const storedBoards = localStorage.getItem('projectBoards');
        if (storedBoards) {
          const boards: Board[] = JSON.parse(storedBoards);
          localStorage.setItem('projectBoards', JSON.stringify(boards.filter(b => b.projectId !== id)));
        }
        const storedBranches = localStorage.getItem('boardBranches');
        if (storedBranches) {
          const branches: BoardBranch[] = JSON.parse(storedBranches);
          localStorage.setItem('boardBranches', JSON.stringify(branches.filter(b => b.projectId !== id)));
        }
      }
      return true;
    }
    const projects = await getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardProjects', JSON.stringify(filtered));
      const storedBoards = localStorage.getItem('projectBoards');
      if (storedBoards) {
        const boards: Board[] = JSON.parse(storedBoards);
        localStorage.setItem('projectBoards', JSON.stringify(boards.filter(b => b.projectId !== id)));
      }
      const storedBranches = localStorage.getItem('boardBranches');
      if (storedBranches) {
        const branches: BoardBranch[] = JSON.parse(storedBranches);
        localStorage.setItem('boardBranches', JSON.stringify(branches.filter(b => b.projectId !== id)));
      }
    }
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Get dashboard stats from API (no mock; returns empty stats when not logged in)
export const getDashboardStats = async () => {
  try {
    if (useApi) {
      const res = await fetch('/api/stats', { credentials: 'include' });
      if (res.ok) return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return [];
  }
};

// Get archived projects (NEW FUNCTION)
export const getArchivedProjects = async (): Promise<Project[]> => {
  try {
    const allProjects = await getAllProjects();
    return allProjects.filter(project => project.status === 'archived');
  } catch (error) {
    console.error('Error getting archived projects:', error);
    return [];
  }
};

// Restore archived project (NEW FUNCTION)
export const restoreArchivedProject = async (id: string): Promise<Project | null> => {
  try {
    return await updateProject(id, { status: 'active' });
  } catch (error) {
    console.error('Error restoring archived project:', error);
    return null;
  }
};

// Get all tasks from the current user's projects (for Todo list and stats). Shows every task they created.
export const getTasksForUser = async (_username?: string): Promise<Task[]> => {
  try {
    if (useApi) {
      const res = await fetch('/api/tasks', { credentials: 'include' });
      if (res.ok) return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting tasks for user:', error);
    return [];
  }
};

// Update task status (API/MySQL)
export const updateTaskStatus = async (taskId: string, status: TaskStatus): Promise<boolean> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating task status:', error);
    return false;
  }
};

// NEW: Get task statistics for a user
export const getTaskStats = async (username: string) => {
  try {
    const tasks = await getTasksForUser(username);
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Done').length;
    const inProgress = tasks.filter(t => t.status === 'In progress').length;
    const notStarted = tasks.filter(t => t.status === 'Not started').length;
    const onHold = tasks.filter(t => t.status === 'On hold').length;
    
    // Calculate overdue tasks
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => 
      t.dueDate < today && 
      t.status !== 'Done' && 
      t.status !== 'On hold'
    ).length;
    
    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      onHold,
      overdue,
      completionRate
    };
  } catch (error) {
    console.error('Error getting task stats:', error);
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      onHold: 0,
      overdue: 0,
      completionRate: 0
    };
  }
};

// Create a new task (API/MySQL)
export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  try {
    if (useApi) {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(task),
      });
      if (res.ok) return await res.json();
    }
    const now = new Date().toISOString().split('T')[0];
    return {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Get tasks by project (API/MySQL)
export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/tasks?projectId=${encodeURIComponent(projectId)}`, { credentials: 'include' });
      if (res.ok) return await res.json();
    }
    return [];
  } catch (error) {
    console.error('Error getting tasks by project:', error);
    return [];
  }
};

// BOARD FUNCTIONS (Connected to Projects)

// Helper: Create a board when a project is created - FIXED VERSION
const createBoardForProject = async (project: Project): Promise<Board> => {
  try {
    console.log('Creating board for project:', project.id, project.name);
    
    const newBoard: Board = {
      id: `board-${project.id}`,
      projectId: project.id,
      projectName: project.name,
      projectColor: project.color,
      title: `${project.name} Board`,
      description: `Board for ${project.name} project`,
      color: project.color,
      columns: 4,
      cards: 0,
      team: project.team?.map(member => member.avatar) || [],
      lastUpdated: 'Just now',
      isFavorite: false,
      tags: project.tags || [],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'System',
      status: 'active'
    };
    
    // Save directly to localStorage without calling getAllBoards again
    if (typeof window !== 'undefined') {
      const storedBoards = localStorage.getItem('projectBoards');
      let existingBoards: Board[] = [];
      
      if (storedBoards) {
        try {
          existingBoards = JSON.parse(storedBoards);
        } catch (parseError) {
          console.error('Error parsing localStorage boards:', parseError);
          localStorage.removeItem('projectBoards');
        }
      }
      
      const withoutExisting = existingBoards.filter(b => b.projectId !== project.id);
      const updatedBoards = [...withoutExisting, newBoard];
      localStorage.setItem('projectBoards', JSON.stringify(updatedBoards));
    }
    
    return newBoard;
  } catch (error) {
    console.error('Error creating board for project:', error);
    throw error;
  }
};

// Get all boards for the current user's projects only. No floating data; boards are created when project is created.
export const getAllBoards = async (): Promise<Board[]> => {
  try {
    const projects = await getAllProjects();
    const projectIds = new Set(projects.map(p => p.id));
    if (projectIds.size === 0) return [];

    if (typeof window !== 'undefined') {
      const storedBoards = localStorage.getItem('projectBoards');
      if (storedBoards) {
        try {
          const boards: Board[] = JSON.parse(storedBoards);
          const filtered = boards.filter(b => projectIds.has(b.projectId));
          return filtered;
        } catch (parseError) {
          console.error('Error parsing localStorage boards:', parseError);
          localStorage.removeItem('projectBoards');
        }
      }

      // No boards in storage: create empty boards for each of user's projects (branches stay empty)
      const activeProjects = projects.filter(p => p.status !== 'archived');
      const newBoards: Board[] = activeProjects.map(project => ({
        id: `board-${project.id}`,
        projectId: project.id,
        projectName: project.name,
        projectColor: project.color,
        title: `${project.name} Board`,
        description: `Board for ${project.name} project`,
        color: project.color,
        columns: 4,
        cards: 0,
        team: project.team?.map(member => member.avatar) || [],
        lastUpdated: 'Just now',
        isFavorite: false,
        tags: project.tags || [],
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'System',
        status: 'active' as const
      }));
      if (newBoards.length > 0) {
        localStorage.setItem('projectBoards', JSON.stringify(newBoards));
      }
      return newBoards;
    }
    return [];
  } catch (error) {
    console.error('Error getting boards:', error);
    return [];
  }
};

// NEW: Get board by ID - FIXED VERSION
export const getBoardById = async (id: string): Promise<Board | null> => {
  try {
    console.log('Getting board by ID:', id);
    const boards = await getAllBoards();
    const board = boards.find(board => board.id === id);
    
    if (!board) {
      console.log('Board not found with ID:', id);
      console.log('Available board IDs:', boards.map(b => b.id));
    }
    
    return board || null;
  } catch (error) {
    console.error('Error getting board by ID:', error);
    return null;
  }
};

// NEW: Get board by project ID
export const getBoardByProjectId = async (projectId: string): Promise<Board | null> => {
  try {
    const boards = await getAllBoards();
    return boards.find(board => board.projectId === projectId) || null;
  } catch (error) {
    console.error('Error getting board by project ID:', error);
    return null;
  }
};

// NEW: Update a board
export const updateBoard = async (id: string, updates: Partial<Board>): Promise<Board | null> => {
  try {
    const boards = await getAllBoards();
    const boardIndex = boards.findIndex(b => b.id === id);
    
    if (boardIndex === -1) return null;
    
    const updatedBoard = {
      ...boards[boardIndex],
      ...updates,
      lastUpdated: 'Just now'
    };
    
    boards[boardIndex] = updatedBoard;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectBoards', JSON.stringify(boards));
    }
    
    return updatedBoard;
  } catch (error) {
    console.error('Error updating board:', error);
    return null;
  }
};

// NEW: Toggle board favorite status
export const toggleBoardFavorite = async (id: string): Promise<boolean> => {
  try {
    const boards = await getAllBoards();
    const boardIndex = boards.findIndex(b => b.id === id);
    
    if (boardIndex === -1) return false;
    
    boards[boardIndex].isFavorite = !boards[boardIndex].isFavorite;
    boards[boardIndex].lastUpdated = 'Just now';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectBoards', JSON.stringify(boards));
    }
    
    return true;
  } catch (error) {
    console.error('Error toggling board favorite:', error);
    return false;
  }
};

// NEW: Get board statistics
export const getBoardStats = async (): Promise<BoardStats> => {
  try {
    const boards = await getAllBoards();
    const activeBoards = boards.filter(b => b.status === 'active');
    
    // Calculate unique team members across all boards
    const allTeamMembers = activeBoards.flatMap(board => board.team || []);
    const uniqueTeamMembers = new Set(allTeamMembers).size;
    
    return {
      totalBoards: activeBoards.length,
      totalCards: activeBoards.reduce((sum, board) => sum + (board.cards || 0), 0),
      activeBoards: activeBoards.length,
      favoriteBoards: activeBoards.filter(b => b.isFavorite).length,
      teamMembers: uniqueTeamMembers,
      cardsByStatus: {
        todo: 0,
        'in-progress': 0,
        review: 0,
        done: 0
      }
    };
  } catch (error) {
    console.error('Error getting board stats:', error);
    return {
      totalBoards: 0,
      totalCards: 0,
      activeBoards: 0,
      favoriteBoards: 0,
      teamMembers: 0,
      cardsByStatus: {
        todo: 0,
        'in-progress': 0,
        review: 0,
        done: 0
      }
    };
  }
};

// Get board columns. New boards get empty columns so the user can add their workflow.
export const getBoardColumns = async (boardId: string): Promise<BoardColumn[]> => {
  try {
    const board = await getBoardById(boardId);
    if (!board) return [];
    const emptyColumns: BoardColumn[] = [
      { id: 'col-todo', title: 'To Do', color: 'bg-beige-100 border-beige-200', cards: [] },
      { id: 'col-progress', title: 'In Progress', color: 'bg-choco-50 border-choco-200', cards: [] },
      { id: 'col-review', title: 'In Review', color: 'bg-amber-50 border-amber-200', cards: [] },
      { id: 'col-done', title: 'Done', color: 'bg-emerald-50 border-emerald-200', cards: [] }
    ];
    return emptyColumns;
  } catch (error) {
    console.error('Error getting board columns:', error);
    return [];
  }
};

// NEW: Update card status (move between columns)
export const updateCardStatus = async (cardId: string, newStatus: BoardCardStatus): Promise<boolean> => {
  try {
    // In a real app, this would update the card in your database
    console.log(`Card ${cardId} status updated to: ${newStatus}`);
    
    return true;
  } catch (error) {
    console.error('Error updating card status:', error);
    return false;
  }
};

// NEW: Create a new card in a board
export const createBoardCard = async (card: Omit<BoardCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<BoardCard> => {
  try {
    const newCard: BoardCard = {
      ...card,
      id: `card-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    // Get the board and increment card count
    const board = await getBoardById(card.boardId);
    if (board) {
      board.cards += 1;
      board.lastUpdated = 'Just now';
      await updateBoard(board.id, { cards: board.cards, lastUpdated: board.lastUpdated });
    }
    
    console.log('Created new board card:', newCard);
    
    return newCard;
  } catch (error) {
    console.error('Error creating board card:', error);
    throw error;
  }
};

// NEW: Delete a board card
export const deleteBoardCard = async (cardId: string): Promise<boolean> => {
  try {
    // In a real app, this would delete from database
    console.log(`Card ${cardId} deleted`);
    return true;
  } catch (error) {
    console.error('Error deleting board card:', error);
    return false;
  }
};

// BRANCH FUNCTIONS

// Add this function to get branch-specific columns
export const getBranchWorkflowTemplates = (workflowType: WorkflowType): BoardColumn[] => {
  switch (workflowType) {
    case 'development':
      return [
        { id: 'backlog', title: 'Backlog', color: 'bg-gray-100', cards: [] },
        { id: 'todo', title: 'To Do', color: 'bg-blue-100', cards: [] },
        { id: 'in-progress', title: 'In Progress', color: 'bg-amber-100', cards: [] },
        { id: 'review', title: 'Code Review', color: 'bg-purple-100', cards: [] },
        { id: 'testing', title: 'Testing', color: 'bg-pink-100', cards: [] },
        { id: 'completed', title: 'Completed', color: 'bg-green-100', cards: [] }
      ];
    
    case 'design':
      return [
        { id: 'research', title: 'Research', color: 'bg-blue-100', cards: [] },
        { id: 'wireframes', title: 'Wireframes', color: 'bg-amber-100', cards: [] },
        { id: 'mockups', title: 'Mockups', color: 'bg-purple-100', cards: [] },
        { id: 'review', title: 'Design Review', color: 'bg-pink-100', cards: [] },
        { id: 'completed', title: 'Completed', color: 'bg-green-100', cards: [] }
      ];
    
    case 'marketing':
      return [
        { id: 'planning', title: 'Planning', color: 'bg-blue-100', cards: [] },
        { id: 'content', title: 'Content Creation', color: 'bg-amber-100', cards: [] },
        { id: 'review', title: 'Review', color: 'bg-purple-100', cards: [] },
        { id: 'approval', title: 'Approval', color: 'bg-pink-100', cards: [] },
        { id: 'completed', title: 'Completed', color: 'bg-green-100', cards: [] }
      ];
    
    case 'qa':
      return [
        { id: 'pending', title: 'Pending Test', color: 'bg-gray-100', cards: [] },
        { id: 'in-testing', title: 'In Testing', color: 'bg-amber-100', cards: [] },
        { id: 'blocked', title: 'Bugs Found', color: 'bg-red-100', cards: [] },
        { id: 'review', title: 'Retest', color: 'bg-purple-100', cards: [] },
        { id: 'completed', title: 'Passed', color: 'bg-green-100', cards: [] }
      ];
    
    case 'operations':
      return [
        { id: 'requested', title: 'Requested', color: 'bg-gray-100', cards: [] },
        { id: 'planning', title: 'Planning', color: 'bg-blue-100', cards: [] },
        { id: 'execution', title: 'Execution', color: 'bg-amber-100', cards: [] },
        { id: 'monitoring', title: 'Monitoring', color: 'bg-purple-100', cards: [] },
        { id: 'completed', title: 'Completed', color: 'bg-green-100', cards: [] }
      ];
    
    case 'custom':
    default:
      return [
        { id: 'todo', title: 'To Do', color: 'bg-gray-100', cards: [] },
        { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100', cards: [] },
        { id: 'review', title: 'Review', color: 'bg-amber-100', cards: [] },
        { id: 'completed', title: 'Completed', color: 'bg-green-100', cards: [] }
      ];
  }
};

// Create a board branch (API/DB)
export const createBoardBranch = async (
  parentBoardId: string,
  branchData: {
    title: string;
    description: string;
    department: string;
    workflowType: WorkflowType;
    team: string[];
    tags: string[];
  },
  projectIdOverride?: string
): Promise<BoardBranch> => {
  try {
    // Use projectId from caller when available, else parse from board ID (board-{projectId})
    const projectId = projectIdOverride ?? parentBoardId.replace(/^board-/, '') ?? parentBoardId;
    if (!projectId) throw new Error('Project ID is required');

    if (useApi) {
      const res = await fetch(`/api/projects/${projectId}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...branchData,
          parentBoardId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { error?: string }).error || `Failed to create branch (${res.status})`;
        throw new Error(msg);
      }
      const branch = await res.json();
      const project = await getProjectById(projectId);
      return {
        ...branch,
        parentBoardId,
        columns: getBranchWorkflowTemplates(branchData.workflowType).length,
        cards: 0,
        projectName: project?.name || '',
        projectColor: project?.color || '',
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'User',
      };
    }
    throw new Error('API required');
  } catch (error) {
    console.error('Error creating board branch:', error);
    throw error;
  }
};

// Get all board branches for user's projects (API/DB)
export const getAllBoardBranches = async (): Promise<BoardBranch[]> => {
  try {
    if (!useApi) return [];
    const projects = await getAllProjects();
    const allBranches: BoardBranch[] = [];
    for (const p of projects) {
      const res = await fetch(`/api/projects/${p.id}/branches`, { credentials: 'include' });
      if (res.ok) {
        const branches = await res.json();
        allBranches.push(
          ...branches.map((b: Record<string, unknown>) => ({
            ...b,
            projectId: p.id,
            projectName: p.name,
            projectColor: p.color,
            parentBoardId: b.parentBoardId || `board-${p.id}`,
            columns: 0,
            cards: 0,
            createdAt: new Date().toISOString().split('T')[0],
            createdBy: 'User',
          }))
        );
      }
    }
    return allBranches;
  } catch (error) {
    console.error('Error getting board branches:', error);
    return [];
  }
};

// Get branches by parent board (projectId = board-{projectId})
export const getBranchesByParentBoard = async (parentBoardId: string): Promise<BoardBranch[]> => {
  try {
    const projectId = parentBoardId.replace(/^board-/, '') || parentBoardId;
    if (useApi) {
      const res = await fetch(`/api/projects/${projectId}/branches`, { credentials: 'include' });
      if (!res.ok) return [];
      const branches = await res.json();
      const project = await getProjectById(projectId);
      return branches.map((b: Record<string, unknown>) => ({
        ...b,
        projectId,
        projectName: project?.name || '',
        projectColor: project?.color || '',
        parentBoardId: b.parentBoardId || parentBoardId,
          columns: 0,
          cards: 0,
          createdAt: (b as { createdAt?: string }).createdAt || new Date().toISOString().split('T')[0],
        createdBy: 'User',
      }));
    }
    return [];
  } catch (error) {
    console.error('Error getting branches by parent board:', error);
    return [];
  }
};

// Get branch by ID (API/DB)
export const getBranchById = async (id: string): Promise<BoardBranch | null> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/branches/${id}`, { credentials: 'include' });
      if (!res.ok || res.status === 404) return null;
      const branch = await res.json();
      return {
        ...branch,
        parentBoardId: branch.parentBoardId || `board-${branch.projectId}`,
        columns: 0,
        cards: 0,
        createdAt: branch.createdAt || new Date().toISOString().split('T')[0],
        createdBy: 'User',
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting branch by ID:', error);
    return null;
  }
};

// Update a branch (API/DB)
export const updateBranch = async (id: string, updates: Partial<BoardBranch>): Promise<BoardBranch | null> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/branches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (!res.ok) return null;
      return await res.json();
    }
    return null;
  } catch (error) {
    console.error('Error updating branch:', error);
    return null;
  }
};

// Delete a branch (API/DB)
export const deleteBranch = async (id: string): Promise<boolean> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/branches/${id}`, { method: 'DELETE', credentials: 'include' });
      return res.ok;
    }
    return false;
  } catch (error) {
    console.error('Error deleting branch:', error);
    return false;
  }
};

// Toggle branch favorite (API/DB)
export const toggleBranchFavorite = async (id: string): Promise<boolean> => {
  try {
    const branch = await getBranchById(id);
    if (!branch) return false;
    const res = await fetch(`/api/branches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isFavorite: !branch.isFavorite }),
    });
    return res.ok;
  } catch (error) {
    console.error('Error toggling branch favorite:', error);
    return false;
  }
};

// Get branch phases from API
export const getBranchPhases = async (branchId: string, projectId: string): Promise<Array<{ id: string; title: string; description?: string; color: string }>> => {
  try {
    if (!useApi) return [];
    const res = await fetch(
      `/api/branches/${branchId}/phases?projectId=${encodeURIComponent(projectId)}`,
      { credentials: 'include' }
    );
    if (!res.ok) return [];
    const phases = await res.json();
    return phases.map((p: { id: string; title: string; description?: string; color: string }) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      color: p.color || 'blue',
    }));
  } catch (error) {
    console.error('Error getting branch phases:', error);
    return [];
  }
};

// Create branch phase (API/DB)
export const createBranchPhase = async (
  branchId: string,
  projectId: string,
  data: { title: string; description?: string; color?: string }
): Promise<{ id: string; title: string; description?: string; color: string } | null> => {
  try {
    if (!useApi) return null;
    const res = await fetch(`/api/branches/${branchId}/phases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ projectId, ...data }),
    });
    if (!res.ok) return null;
    const phase = await res.json();
    return { id: phase.id, title: phase.title, description: phase.description, color: phase.color || 'blue' };
  } catch (error) {
    console.error('Error creating branch phase:', error);
    return null;
  }
};

// Update branch phase (API/DB)
export const updateBranchPhase = async (
  branchId: string,
  phaseId: string,
  data: { title?: string; description?: string; color?: string }
): Promise<boolean> => {
  try {
    if (!useApi) return false;
    const res = await fetch(`/api/branches/${branchId}/phases/${phaseId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating branch phase:', error);
    return false;
  }
};

// Delete branch phase (API/DB)
export const deleteBranchPhase = async (branchId: string, phaseId: string): Promise<boolean> => {
  try {
    if (!useApi) return false;
    const res = await fetch(`/api/branches/${branchId}/phases/${phaseId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.ok;
  } catch (error) {
    console.error('Error deleting branch phase:', error);
    return false;
  }
};

// Get branch columns (phases) with cards from API - no mock data
export const getBranchColumns = async (branchId: string, projectId?: string): Promise<BoardColumn[]> => {
  try {
    if (!useApi || !projectId) return [];
    const res = await fetch(
      `/api/branches/${branchId}/phases?projectId=${encodeURIComponent(projectId)}`,
      { credentials: 'include' }
    );
    if (!res.ok) return [];
    const phases = await res.json();
    return phases.map((p: { id: string; title: string; description?: string; color: string; cards: Array<Record<string, unknown>> }) => ({
      id: p.id,
      title: p.title,
      color: p.color,
      cards: (p.cards || []).map((c: Record<string, unknown>) => ({
        id: c.id,
        boardId: branchId,
        projectId,
        title: c.title,
        description: c.description || '',
        status: c.status || 'todo',
        priority: c.priority || 'medium',
        assignee: c.assignee || '',
        assigneeAvatar: c.assigneeAvatar || '',
        dueDate: c.dueDate || '',
        tags: Array.isArray(c.tags) ? c.tags : (typeof c.tags === 'string' ? (() => { try { return JSON.parse(c.tags); } catch { return []; } })() : []),
        attachments: Number(c.attachments) || 0,
        comments: Number(c.comments) || 0,
        createdAt: c.createdAt || '',
        updatedAt: c.updatedAt || '',
        completedAt: c.completedAt,
      })),
    }));
  } catch (error) {
    console.error('Error getting branch columns:', error);
    return [];
  }
};

// Get branch tasks from API (cards grouped by phase)
export const getBranchTasks = async (branchId: string, projectId?: string): Promise<BranchTask[]> => {
  try {
    const columns = await getBranchColumns(branchId, projectId);
    const tasks: BranchTask[] = [];
    for (const column of columns) {
      for (const card of column.cards) {
        tasks.push({
          ...card,
          phase: column.id,
          progress: card.status === 'completed' ? 100 :
            card.status === 'review' ? 75 :
            card.status === 'in-progress' ? 50 :
            card.status === 'blocked' ? 25 : 0,
          assignees: card.assignee ? [card.assignee] : [],
          tags: card.tags || [],
          comments: card.comments || 0,
          attachments: card.attachments || 0,
          description: card.description || '',
          estimatedHours: (card as { estimatedHours?: number }).estimatedHours || 0,
          dueDate: card.dueDate || new Date().toISOString().split('T')[0],
          status: card.status,
          priority: card.priority,
        });
      }
    }
    return tasks;
  } catch (error) {
    console.error('Error getting branch tasks:', error);
    return [];
  }
};

// NEW: Get branch progress
export const getBranchProgress = async (branchId: string): Promise<number> => {
  try {
    const tasks = await getBranchTasks(branchId);
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === 'completed' || task.progress === 100).length;
    return Math.round((completedTasks / tasks.length) * 100);
  } catch (error) {
    console.error('Error getting branch progress:', error);
    return 0;
  }
};

// Create a branch task (API/DB)
export const createBranchTask = async (branchId: string, taskData: {
  title: string;
  description: string;
  phase: string;
  priority: BranchTaskPriority;
  dueDate: string;
  assignees: string[];
  estimatedHours: number;
  tags: string[];
}): Promise<BranchTask> => {
  try {
    const branch = await getBranchById(branchId);
    if (!branch) throw new Error('Branch not found');

    if (useApi) {
      const res = await fetch(`/api/branches/${branchId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          projectId: branch.projectId,
          phaseId: taskData.phase,
          title: taskData.title,
          description: taskData.description,
          status: 'todo',
          priority: taskData.priority,
          assignee: taskData.assignees[0] || '',
          assigneeAvatar: taskData.assignees[0]?.charAt(0) || '',
          dueDate: taskData.dueDate,
          tags: taskData.tags,
          estimatedHours: taskData.estimatedHours,
        }),
      });
      if (!res.ok) throw new Error('Failed to create task');
      const card = await res.json();
      return {
        ...card,
        boardId: branchId,
        projectId: branch.projectId,
        phase: taskData.phase,
        progress: 0,
        assignees: taskData.assignees,
        tags: taskData.tags || [],
        comments: 0,
        attachments: 0,
        description: taskData.description,
        estimatedHours: taskData.estimatedHours,
        dueDate: taskData.dueDate,
        status: 'todo',
        priority: taskData.priority,
      };
    }
    throw new Error('API required');
  } catch (error) {
    console.error('Error creating branch task:', error);
    throw error;
  }
};

// Update a branch task (API/DB) - requires branchId
export const updateBranchTask = async (
  branchId: string,
  taskId: string,
  updates: Partial<BranchTask>
): Promise<BranchTask | null> => {
  try {
    if (useApi) {
      const body: Record<string, unknown> = {};
      if (updates.title !== undefined) body.title = updates.title;
      if (updates.description !== undefined) body.description = updates.description;
      if (updates.status !== undefined) body.status = updates.status;
      if (updates.priority !== undefined) body.priority = updates.priority;
      if (updates.dueDate !== undefined) body.dueDate = updates.dueDate;
      if (updates.phase !== undefined) body.phaseId = updates.phase;
      if (updates.assignees !== undefined) {
        body.assignee = updates.assignees[0] || '';
        body.assigneeAvatar = updates.assignees[0]?.charAt(0) || '';
      }
      if (updates.tags !== undefined) body.tags = updates.tags;
      if (updates.estimatedHours !== undefined) body.estimatedHours = updates.estimatedHours;

      const res = await fetch(`/api/branches/${branchId}/cards/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) return null;
      const card = await res.json();
      return {
        ...card,
        boardId: branchId,
        phase: updates.phase || card.phaseId || '',
        progress: updates.status === 'completed' ? 100 : updates.progress ?? 0,
        assignees: updates.assignees || (card.assignee ? [card.assignee] : []),
        estimatedHours: updates.estimatedHours ?? card.estimatedHours ?? 0,
      };
    }
    return null;
  } catch (error) {
    console.error('Error updating branch task:', error);
    return null;
  }
};

// Delete a branch task (API/DB) - requires branchId
export const deleteBranchTask = async (branchId: string, taskId: string): Promise<boolean> => {
  try {
    if (useApi) {
      const res = await fetch(`/api/branches/${branchId}/cards/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return res.ok;
    }
    return false;
  } catch (error) {
    console.error('Error deleting branch task:', error);
    return false;
  }
};

// NEW: Initialize boards on app startup - ADD THIS FUNCTION
export const initializeBoards = async (): Promise<Board[]> => {
  console.log('Initializing boards...');
  return await getAllBoards(); // This will create boards for all projects
};

// NEW: Get total cards for a board - ADD THIS FUNCTION
export const getBoardTotalCards = async (boardId: string): Promise<number> => {
  try {
    const columns = await getBoardColumns(boardId);
    return columns.reduce((total, column) => total + (column.cards?.length || 0), 0);
  } catch (error) {
    console.error('Error getting board total cards:', error);
    return 0;
  }
};

// NEW: Get total cards for a branch - ADD THIS FUNCTION
export const getBranchTotalCards = async (branchId: string): Promise<number> => {
  try {
    const columns = await getBranchColumns(branchId);
    return columns.reduce((total, column) => total + (column.cards?.length || 0), 0);
  } catch (error) {
    console.error('Error getting branch total cards:', error);
    return 0;
  }
};