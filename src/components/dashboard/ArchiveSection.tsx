// src/components/dashboard/ArchiveSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/src/app/types/dashboard";
import { 
    Archive, 
    X, 
    RotateCcw, 
    Trash2, 
    Search,
    Calendar,
    Users,
    ListTodo,
    FolderArchive,
    ChevronRight
} from "lucide-react";
import { getArchivedProjects, restoreArchivedProject } from "@/src/app/lib/projectService";

interface ArchiveSectionProps {
    isOpen: boolean;
    onClose: () => void;
    onRestore: (restoredProject: Project) => void;
}

export const ArchiveSection: React.FC<ArchiveSectionProps> = ({
    isOpen,
    onClose,
    onRestore,
}) => {
    const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [restoringId, setRestoringId] = useState<string | null>(null);

  // Fetch archived projects when opened
    useEffect(() => {
    if (isOpen) {
        fetchArchivedProjects();
    }
    }, [isOpen]);

    const fetchArchivedProjects = async () => {
    setLoading(true);
    try {
        const projects = await getArchivedProjects();
        setArchivedProjects(projects);
    } catch (error) {
        console.error("Error fetching archived projects:", error);
    } finally {
        setLoading(false);
    }
};

    const handleRestore = async (projectId: string) => {
    setRestoringId(projectId);
    try {
        const restored = await restoreArchivedProject(projectId);
        if (restored) {
        // Remove from archived list
        setArchivedProjects(prev => prev.filter(p => p.id !== projectId));
        // Notify parent to add back to main list
        onRestore(restored);
        }
    } catch (error) {
        console.error("Error restoring project:", error);
    } finally {
        setRestoringId(null);
    }
    };

    const filteredProjects = archivedProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
    <>
      {/* Backdrop */}
    <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
    />

      {/* Archive Panel - Slides from right */}
    <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
            <FolderArchive className="w-5 h-5 text-gray-700" />
            </div>
            <div>
            <h2 className="text-xl font-medium text-gray-900">Archived Projects</h2>
            <p className="text-sm text-gray-500">
                {archivedProjects.length} {archivedProjects.length === 1 ? 'project' : 'projects'} archived
            </p>
            </div>
        </div>
        <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Search archived projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
            {loading ? (
            // Loading skeletons
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded-full w-full animate-pulse" />
                    <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                    </div>
                </div>
                ))}
            </div>
            ) : filteredProjects.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Archive className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No archived projects</h3>
                <p className="text-gray-500">
                {searchTerm 
                    ? "No projects match your search"
                    : "Projects you archive will appear here"
                }
                </p>
            </div>
            ) : (
            // Project cards
            <div className="space-y-4">
                {filteredProjects.map((project) => (
                <div
                    key={project.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                >
                    <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="font-medium text-gray-900 text-lg mb-1">
                        {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                        {project.description || "No description"}
                        </p>
                    </div>
                    <button
                        onClick={() => handleRestore(project.id)}
                        disabled={restoringId === project.id}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {restoringId === project.id ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Restoring...
                        </>
                        ) : (
                        <>
                            <RotateCcw className="w-4 h-4" />
                            Restore
                        </>
                        )}
                    </button>
                    </div>

                  {/* Project Details */}
                    <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${project.color} transition-all duration-300`}
                            style={{ width: `${project.progress}%` }}
                        />
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <ListTodo className="w-3 h-3" />
                            <span>{project.tasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{project.members} members</span>
                        </div>
                        {project.deadline && (
                            <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        )}
                    </div>
                    <span className="text-xs text-gray-400">
                        Archived: {project.lastUpdated}
                    </span>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                            <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                            {tag}
                            </span>
                        ))}
                        </div>
                    )}
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {/* Footer */}
        {archivedProjects.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
                Restored projects will reappear in your dashboard
            </p>
            </div>
        )}
    </div>
    </>
    );
};