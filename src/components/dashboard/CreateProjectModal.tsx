import React, { useState, useEffect } from "react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (projectName: string) => Promise<void>;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setProjectName("");
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onCreate(projectName);
      // Don't reset here - let parent handle closing and resetting
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error('Failed to create project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Project
            </h3>
            <input
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                setError(null); // Clear error when user types
              }}
              placeholder="Enter project name"
              className={`w-full px-3 py-2 border rounded mb-2 focus:outline-none focus:border-gray-900 text-sm ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              autoFocus
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-600 text-sm mb-2">{error}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!projectName.trim() || isLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};